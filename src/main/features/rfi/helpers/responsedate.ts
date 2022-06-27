//@ts-nocheck
import * as express from 'express';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';
import moment from 'moment-business-days';
import * as cmsData from '../../../resources/content/RFI/rfi-response-date.json';
import config from 'config';
import { dateFilter } from 'main/modules/nunjucks/filters/dateFilter';

const predefinedDays = {
  defaultEndingHour: Number(config.get('predefinedDays.defaultEndingHour')),
  defaultEndingMinutes: Number(config.get('predefinedDays.defaultEndingMinutes')),
  clarification_days: Number(config.get('predefinedDays.clarification_days')),
  clarification_period_end: Number(config.get('predefinedDays.clarification_period_end')),
  supplier_period: Number(config.get('predefinedDays.supplier_period')),
  supplier_deadline: Number(config.get('predefinedDays.supplier_deadline')),
};

export const RESPONSEDATEHELPER = async (req: express.Request, res: express.Response, errorTriggered, errorItem) => {
  const proc_id = req.session.projectId;
  const event_id = req.session.eventId;
  const { SESSION_ID } = req.cookies;
  let baseURL = `/tenders/projects/${proc_id}/events/${event_id}`;
  baseURL = baseURL + '/criteria';
  const keyDateselector = 'Key Dates';
  let day,time;

  try {
    const fetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(baseURL);
    const fetch_dynamic_api_data = fetch_dynamic_api?.data;
    const extracted_criterion_based = fetch_dynamic_api_data?.map(criterian => criterian?.id);
    let criterianStorage = [];
    for (const aURI of extracted_criterion_based) {
      const criterian_bas_url = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${aURI}/groups`;
      const fetch_criterian_group_data = await DynamicFrameworkInstance.Instance(SESSION_ID).get(criterian_bas_url);
      const criterian_array = fetch_criterian_group_data?.data;
      const rebased_object_with_requirements = criterian_array?.map(anItem => {
        const object = anItem;
        object['criterianId'] = aURI;
        return object;
      });
      criterianStorage.push(rebased_object_with_requirements);
    }

    criterianStorage = criterianStorage.flat();
    criterianStorage = criterianStorage.filter(AField => AField.OCDS.id === keyDateselector);
    const Criterian_ID = criterianStorage[0].criterianId;
    const prompt = criterianStorage[0].nonOCDS.prompt.replace("</strong></p>\n       <br>", " It is recommended you set your times to no later than 4pm on a weekday in case you need to contact CCS about your project.</strong></p>");
    const apiData_baseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${Criterian_ID}/groups/${keyDateselector}/questions`;
    const fetchQuestions = await DynamicFrameworkInstance.Instance(SESSION_ID).get(apiData_baseURL);
    let fetchQuestionsData = fetchQuestions.data;
    let DeadlinePeriodDate;
    let SupplierPeriodDate;
    let rfi_clarification_date;
    let rfi_clarification_period_end;
    let clarification_period_end_date;
    let deadline_period_for_clarification_period;
    let supplier_period_for_clarification_period;
    let supplier_dealine_for_clarification_period;
    let rfi_clarification;
    let rfi_clarification_period;
    let deadline_period_for_clarification;
    let supplier_period_for_clarification;
    if (req.session.UIDate == null) {
      rfi_clarification_date = moment(new Date(), 'DD/MM/YYYY').format('DD MMMM YYYY');
      clarification_period_end_date = new Date();
      const clarification_period_end_date_parsed = `${clarification_period_end_date.getDate()}-${clarification_period_end_date.getMonth() + 1
        }-${clarification_period_end_date.getFullYear()}`;
      rfi_clarification_period_end = moment(clarification_period_end_date_parsed, 'DD MM YYYY').businessAdd(
        predefinedDays.clarification_days,
      )._d;
      rfi_clarification_period_end.setHours(predefinedDays.defaultEndingHour);
      rfi_clarification_period_end.setMinutes(predefinedDays.defaultEndingMinutes);

      const DeadlinePeriodDate = rfi_clarification_period_end;

      const DeadlinePeriodDate_Parsed = `${DeadlinePeriodDate.getDate()}-${DeadlinePeriodDate.getMonth() + 1
        }-${DeadlinePeriodDate.getFullYear()}`;
      deadline_period_for_clarification_period = moment(DeadlinePeriodDate_Parsed, 'DD-MM-YYYY').businessAdd(
        predefinedDays.clarification_period_end,
      )._d;
      deadline_period_for_clarification_period.setHours(predefinedDays.defaultEndingHour);
      deadline_period_for_clarification_period.setMinutes(predefinedDays.defaultEndingMinutes);

      const SupplierPeriodDate = deadline_period_for_clarification_period;
      const SupplierPeriodDate_Parsed = `${SupplierPeriodDate.getDate()}-${SupplierPeriodDate.getMonth() + 1
        }-${SupplierPeriodDate.getFullYear()}`;
      supplier_period_for_clarification_period = moment(SupplierPeriodDate_Parsed, 'DD-MM-YYYY').businessAdd(
        predefinedDays.supplier_period,
      )._d;
      supplier_period_for_clarification_period.setHours(predefinedDays.defaultEndingHour);
      supplier_period_for_clarification_period.setMinutes(predefinedDays.defaultEndingMinutes);

      const SupplierPeriodDeadLine = supplier_period_for_clarification_period;
      const SupplierPeriodDeadLine_Parsed = `${SupplierPeriodDeadLine.getDate()}-${SupplierPeriodDeadLine.getMonth() + 1
        }-${SupplierPeriodDeadLine.getFullYear()}`;
      supplier_dealine_for_clarification_period = moment(SupplierPeriodDeadLine_Parsed, 'DD-MM-YYYY').businessAdd(
        predefinedDays.supplier_deadline,
      )._d;
      supplier_dealine_for_clarification_period.setHours(predefinedDays.defaultEndingHour);
      supplier_dealine_for_clarification_period.setMinutes(predefinedDays.defaultEndingMinutes);
      fetchQuestionsData = fetchQuestionsData.sort((current_element, next_element) => {
        const currentElementID = Number(current_element.OCDS.id.split('Question ').join(''));
        const nextElementID = Number(next_element.OCDS.id.split('Question ').join(''));
        return currentElementID - nextElementID;
      });
      for(var i=0;i<fetchQuestionsData.length;i++)
        {
          if(fetchQuestionsData[i].nonOCDS.options.length>0){
          let value=fetchQuestionsData[i].nonOCDS.options[0].value;
          day=value.substr(0,10);
          time=value.substr(11,5);
          if(i==0){
            fetchQuestionsData[i].nonOCDS.options[0].value=moment(day+" "+time,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY');
          }
          else
          {
          fetchQuestionsData[i].nonOCDS.options[0].value=moment(day+" "+time,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY, hh:mm a');
          }
        }
        }
      let appendData = {
        data: cmsData,
        prompt: prompt,
        framework: fetchQuestionsData,
        rfi_clarification_date,
        rfi_clarification_period_end: moment(rfi_clarification_period_end, 'DD/MM/YYYY, hh:mm a').format(
          'DD MMMM YYYY, hh:mm a',
        ),
        deadline_period_for_clarification_period: moment(
          deadline_period_for_clarification_period,
          'DD/MM/YYYY, hh:mm a',
        ).format('DD MMMM YYYY, hh:mm a'),
        supplier_period_for_clarification_period: moment(
          supplier_period_for_clarification_period,
          'DD/MM/YYYY, hh:mm a',
        ).format('DD MMMM YYYY, hh:mm a'),
        supplier_dealine_for_clarification_period: moment(
          supplier_dealine_for_clarification_period,
          'DD/MM/YYYY, hh:mm a',
        ).format('DD MMMM YYYY, hh:mm a'),
        releatedContent: req.session.releatedContent,
      };

      if (errorTriggered) {
        appendData = { ...appendData, error: true, errorMessage: errorItem };
      } else {
        req.session.timeline = {};
        req.session.timeline.publish = new Date();
        req.session.timeline.clarificationPeriodEnd = rfi_clarification_period_end;
        req.session.timeline.publishResponsesClarificationQuestions = deadline_period_for_clarification_period;
        req.session.timeline.supplierSubmitResponse = supplier_period_for_clarification_period;
        req.session.timeline.confirmNextStepsSuppliers = supplier_dealine_for_clarification_period;
      }

      res.render('response-date', appendData);
    }

    else {
      if (req.session.questionID == 'Question 2') {
        rfi_clarification_date = moment(req.session.rfipublishdate, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
        rfi_clarification_period_end = req.session.UIDate;

        // rfp_clarification_date =moment(req.session.clarificationend,'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
        deadline_period_for_clarification_period = moment(req.session.deadlinepublishresponse, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
        supplier_period_for_clarification_period = moment(req.session.supplierresponse, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
        supplier_dealine_for_clarification_period = moment(req.session.confirmNextStepsSuppliers, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');

        fetchQuestionsData = fetchQuestionsData.sort((current_element, next_element) => {
          const currentElementID = Number(current_element.OCDS.id.split('Question ').join(''));
          const nextElementID = Number(next_element.OCDS.id.split('Question ').join(''));
          return currentElementID - nextElementID;
        });
        for(var i=0;i<fetchQuestionsData.length;i++)
        {
          if(fetchQuestionsData[i].nonOCDS.options.length>0){
            let value=fetchQuestionsData[i].nonOCDS.options[0].value;
            day=value.substr(0,10);
            time=value.substr(11,5);
            if(i==0){
              fetchQuestionsData[i].nonOCDS.options[0].value=moment(day+" "+time,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY');
            }
            else
            {
            fetchQuestionsData[i].nonOCDS.options[0].value=moment(day+" "+time,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY, hh:mm a');
            }
          }
        }
        let appendData = {
          data: cmsData,
          prompt: prompt,
          framework: fetchQuestionsData,
          rfi_clarification_date,
          rfi_clarification_period_end,
          deadline_period_for_clarification_period,
          supplier_period_for_clarification_period,
          supplier_dealine_for_clarification_period,
          releatedContent: req.session.releatedContent,
        };
        if (errorTriggered) {
          appendData = { ...appendData, error: true, errorMessage: errorItem };
        } else {
          req.session.timeline.clarificationPeriodEnd = rfi_clarification_period_end;
        }

        res.render('response-date', appendData);

      }
      else if (req.session.questionID == 'Question 3') {

        deadline_period_for_clarification_period = req.session.UIDate;

        rfi_clarification_date = moment(req.session.rfipublishdate, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
        rfi_clarification_period_end = moment(req.session.clarificationend, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
        //deadline_period_for_clarification_period =moment(req.session.deadlinepublishresponse,'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
        supplier_period_for_clarification_period = moment(req.session.supplierresponse, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
        supplier_dealine_for_clarification_period = moment(req.session.confirmNextStepsSuppliers, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');

        fetchQuestionsData = fetchQuestionsData.sort((current_element, next_element) => {
          const currentElementID = Number(current_element.OCDS.id.split('Question ').join(''));
          const nextElementID = Number(next_element.OCDS.id.split('Question ').join(''));
          return currentElementID - nextElementID;
        });
        for(var i=0;i<fetchQuestionsData.length;i++)
        {
          if(fetchQuestionsData[i].nonOCDS.options.length>0){
            let value=fetchQuestionsData[i].nonOCDS.options[0].value;
            day=value.substr(0,10);
            time=value.substr(11,5);
            if(i==0){
              fetchQuestionsData[i].nonOCDS.options[0].value=moment(day+" "+time,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY');
            }
            else
            {
            fetchQuestionsData[i].nonOCDS.options[0].value=moment(day+" "+time,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY, hh:mm a');
            }
          }
        }
        let appendData = {
          data: cmsData,
          prompt: prompt,
          framework: fetchQuestionsData,
          rfi_clarification_date,
          rfi_clarification_period_end,
          deadline_period_for_clarification_period,
          supplier_period_for_clarification_period,
          supplier_dealine_for_clarification_period,
          releatedContent: req.session.releatedContent,
        };
        if (errorTriggered) {
          appendData = { ...appendData, error: true, errorMessage: errorItem };
        } else {
          req.session.timeline.publishResponsesClarificationQuestions = deadline_period_for_clarification_period;
        }

        res.render('response-date', appendData);

      }
      else if (req.session.questionID == 'Question 4') {

        supplier_period_for_clarification_period = req.session.UIDate;

        rfi_clarification_date = moment(req.session.rfipublishdate, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
        rfi_clarification_period_end = moment(req.session.clarificationend, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
        deadline_period_for_clarification_period = moment(req.session.deadlinepublishresponse, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
        //supplier_period_for_clarification_period =moment(req.session.supplierresponse,'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
        supplier_dealine_for_clarification_period = moment(req.session.confirmNextStepsSuppliers, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');

        fetchQuestionsData = fetchQuestionsData.sort((current_element, next_element) => {
          const currentElementID = Number(current_element.OCDS.id.split('Question ').join(''));
          const nextElementID = Number(next_element.OCDS.id.split('Question ').join(''));
          return currentElementID - nextElementID;
        });
        for(var i=0;i<fetchQuestionsData.length;i++)
        {
          if(fetchQuestionsData[i].nonOCDS.options.length>0){
            let value=fetchQuestionsData[i].nonOCDS.options[0].value;
            day=value.substr(0,10);
            time=value.substr(11,5);
            if(i==0){
              fetchQuestionsData[i].nonOCDS.options[0].value=moment(day+" "+time,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY');
            }
            else
            {
            fetchQuestionsData[i].nonOCDS.options[0].value=moment(day+" "+time,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY, hh:mm a');
            }
          }
        }
        let appendData = {
          data: cmsData,
          prompt: prompt,
          framework: fetchQuestionsData,
          rfi_clarification_date,
          rfi_clarification_period_end,
          deadline_period_for_clarification_period,
          supplier_period_for_clarification_period,
          supplier_dealine_for_clarification_period,
          releatedContent: req.session.releatedContent,
        };
        if (errorTriggered) {
          appendData = { ...appendData, error: true, errorMessage: errorItem };
        } else {
          req.session.timeline.supplierSubmitResponse = supplier_period_for_clarification_period;
        }

        res.render('response-date', appendData);
      }
      else if (req.session.questionID == 'Question 5') {
        supplier_dealine_for_clarification_period = req.session.UIDate;

        rfi_clarification_date = moment(req.session.rfipublishdate, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
        rfi_clarification_period_end = moment(req.session.clarificationend, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
        deadline_period_for_clarification_period = moment(req.session.deadlinepublishresponse, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
        supplier_period_for_clarification_period = moment(req.session.supplierresponse, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
        //supplier_dealine_for_clarification_period =moment(req.session.confirmNextStepsSuppliers,'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');

        fetchQuestionsData = fetchQuestionsData.sort((current_element, next_element) => {
          const currentElementID = Number(current_element.OCDS.id.split('Question ').join(''));
          const nextElementID = Number(next_element.OCDS.id.split('Question ').join(''));
          return currentElementID - nextElementID;
        });
        for(var i=0;i<fetchQuestionsData.length;i++)
        {
          if(fetchQuestionsData[i].nonOCDS.options.length>0){
            let value=fetchQuestionsData[i].nonOCDS.options[0].value;
            day=value.substr(0,10);
            time=value.substr(11,5);
            if(i==0){
              fetchQuestionsData[i].nonOCDS.options[0].value=moment(day+" "+time,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY');
            }
            else
            {
            fetchQuestionsData[i].nonOCDS.options[0].value=moment(day+" "+time,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY, hh:mm a');
            }
          }
        }
        let appendData = {
          data: cmsData,
          prompt: prompt,
          framework: fetchQuestionsData,
          rfi_clarification_date,
          rfi_clarification_period_end,
          deadline_period_for_clarification_period,
          supplier_period_for_clarification_period,
          supplier_dealine_for_clarification_period,
          releatedContent: req.session.releatedContent,
        };
        if (errorTriggered) {
          appendData = { ...appendData, error: true, errorMessage: errorItem };
        } else {
          req.session.timeline.confirmNextStepsSuppliers = supplier_dealine_for_clarification_period;
        }

        res.render('response-date', appendData);
      }
    }



  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Tenders Service Api cannot be connected',
      true,
    );
  }
};
