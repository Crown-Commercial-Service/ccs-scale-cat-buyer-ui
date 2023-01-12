//@ts-nocheck
import * as express from 'express';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';
import moment from 'moment-business-days';
import * as cmsData from '../../../resources/content/eoi/eoi-response-date.json';
import config from 'config';
import { dateFilter } from 'main/modules/nunjucks/filters/dateFilter';
import { logConstant } from '../../../common/logtracer/logConstant';

const predefinedDays = {
  defaultEndingHour: Number(config.get('predefinedDays.defaultEndingHour')),
  defaultEndingMinutes: Number(config.get('predefinedDays.defaultEndingMinutes')),
  clarification_days: Number(config.get('predefinedDays.clarification_days')),
  clarification_period_end: Number(config.get('predefinedDays.clarification_period_end')),
  supplier_period: Number(config.get('predefinedDays.supplier_period')),
  supplier_deadline: Number(config.get('predefinedDays.supplier_deadline')),
  supplier_deadline_extra: Number(config.get('predefinedDays.supplier_deadline_extra')),
};

export const RESPONSEDATEHELPER = async (req: express.Request, res: express.Response, errorTriggered, errorItem) => {
  
  const proc_id = req.session.projectId;
  const event_id = req.session.eventId;
  const agreement_id =  req.session.agreement_id;
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
    let prompt = criterianStorage[0].nonOCDS.prompt.replace("</strong></p>\n       <br>", " It is recommended you set your times to no later than 4pm on a weekday in case you need to contact CCS about your project.</strong></p>");
    prompt = prompt.replace('<p class="govuk-body"><strong>', '<p class="govuk-body govuk-inset-text"><strong>');
    const apiData_baseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${Criterian_ID}/groups/${keyDateselector}/questions`;
 
    const fetchQuestions = await DynamicFrameworkInstance.Instance(SESSION_ID).get(apiData_baseURL);
    let fetchQuestionsData = fetchQuestions.data;
       
    //CAS-INFO-LOG 
    LoggTracer.infoLogger(fetchQuestionsData, logConstant.eoiGetTimeLineQuestions, req);
    
    let DeadlinePeriodDate;
    let SupplierPeriodDate;
    let eoi_clarification_date;
    let eoi_clarification_period_end;
    let clarification_period_end_date;
    let deadline_period_for_clarification_period;
    let supplier_period_for_clarification_period;
    let supplier_dealine_for_clarification_period;
    let eoi_clarification;
    let eoi_clarification_period;
    let deadline_period_for_clarification;
    let supplier_period_for_clarification;

    
    if (req.session.UIDate == null) {
      const eoi_clarification_date = moment(new Date(), 'DD/MM/YYYY').format('DD MMMM YYYY');
      const clarification_period_end_date = new Date();
      const clarification_period_end_date_parsed = `${clarification_period_end_date.getDate()}-${clarification_period_end_date.getMonth() + 1
        }-${clarification_period_end_date.getFullYear()}`;

      const eoi_clarification_period_end = moment(clarification_period_end_date_parsed, 'DD MM YYYY').businessAdd(
        predefinedDays.clarification_days,
      )._d;

      

      eoi_clarification_period_end.setHours(predefinedDays.defaultEndingHour);
      eoi_clarification_period_end.setMinutes(predefinedDays.defaultEndingMinutes);
      
      const DeadlinePeriodDate = eoi_clarification_period_end;
        
      const DeadlinePeriodDate_Parsed = `${DeadlinePeriodDate.getDate()}-${DeadlinePeriodDate.getMonth() + 1
        }-${DeadlinePeriodDate.getFullYear()}`;
        const deadline_period_for_clarification_period = moment(DeadlinePeriodDate_Parsed, 'DD-MM-YYYY').businessAdd(
        predefinedDays.clarification_period_end,
      )._d;
      deadline_period_for_clarification_period.setHours(predefinedDays.defaultEndingHour);
      deadline_period_for_clarification_period.setMinutes(predefinedDays.defaultEndingMinutes);

      const SupplierPeriodDate = deadline_period_for_clarification_period;
      const SupplierPeriodDate_Parsed = `${SupplierPeriodDate.getDate()}-${SupplierPeriodDate.getMonth() + 1
        }-${SupplierPeriodDate.getFullYear()}`;
      const supplier_period_for_clarification_period = moment(SupplierPeriodDate_Parsed, 'DD-MM-YYYY').businessAdd(
        predefinedDays.supplier_period,
      )._d;
      supplier_period_for_clarification_period.setHours(predefinedDays.defaultEndingHour);
      supplier_period_for_clarification_period.setMinutes(predefinedDays.defaultEndingMinutes);

      const SupplierPeriodDeadLine = supplier_period_for_clarification_period;
      const SupplierPeriodDeadLine_Parsed = `${SupplierPeriodDeadLine.getDate()}-${SupplierPeriodDeadLine.getMonth() + 1
        }-${SupplierPeriodDeadLine.getFullYear()}`;
        const supplier_dealine_for_clarification_period = moment(SupplierPeriodDeadLine_Parsed, 'DD-MM-YYYY').businessAdd(predefinedDays.supplier_deadline_extra,)._d;
        // if(agreement_id=='RM6263'){
        //   const supplier_dealine_for_clarification_period = moment(SupplierPeriodDeadLine_Parsed, 'DD-MM-YYYY').businessAdd(
        //     predefinedDays.supplier_deadline,
        //   )._d;
        // }else{
        //   const supplier_dealine_for_clarification_period = moment(SupplierPeriodDeadLine_Parsed, 'DD-MM-YYYY').businessAdd(predefinedDays.supplier_deadline_extra,)._d;
        // }
        
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
          fetchQuestionsData[i].nonOCDS.options[0].value=moment(day+" "+time,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY, HH:mm');
          }
        }
        }
      let appendData = {
        data: cmsData,
        prompt: prompt,
        framework: fetchQuestionsData,
        eoi_clarification_date,
        agreement_id,
        eoi_clarification_period_end: moment(eoi_clarification_period_end, 'DD/MM/YYYY, HH:mm').format(
          'DD MMMM YYYY, HH:mm',
        ),
        deadline_period_for_clarification_period: moment(
          deadline_period_for_clarification_period,
          'DD/MM/YYYY, HH:mm',
        ).format('DD MMMM YYYY, HH:mm'),
        supplier_period_for_clarification_period: moment(
          supplier_period_for_clarification_period,
          'DD/MM/YYYY, HH:mm',
        ).format('DD MMMM YYYY, HH:mm'),
        supplier_dealine_for_clarification_period: moment(
          supplier_dealine_for_clarification_period,
          'DD/MM/YYYY, HH:mm',
        ).format('DD MMMM YYYY, HH:mm'),
        releatedContent: req.session.releatedContent,
      };

      if (errorTriggered) {
        appendData = { ...appendData, error: true, errorMessage: errorItem };
      } else {
        req.session.timeline = {};
        req.session.timeline.publish = new Date();
          
         req.session.timeline.clarificationPeriodEnd = moment(eoi_clarification_period_end, 'DD/MM/YYYY, HH:mm').format('DD MMMM YYYY, HH:mm');
        req.session.timeline.publishResponsesClarificationQuestions = moment(deadline_period_for_clarification_period, 'DD/MM/YYYY, HH:mm').format('DD MMMM YYYY, HH:mm');
        req.session.timeline.supplierSubmitResponse = moment(supplier_period_for_clarification_period, 'DD/MM/YYYY, HH:mm').format('DD MMMM YYYY, HH:mm');
        req.session.timeline.confirmNextStepsSuppliers = moment(supplier_dealine_for_clarification_period, 'DD/MM/YYYY, HH:mm').format('DD MMMM YYYY, HH:mm');
        
        //OLD DATA
        // req.session.timeline.clarificationPeriodEnd = eoi_clarification_period_end;
        // req.session.timeline.publishResponsesClarificationQuestions = deadline_period_for_clarification_period;
        // req.session.timeline.supplierSubmitResponse = supplier_period_for_clarification_period;
        // req.session.timeline.confirmNextStepsSuppliers = supplier_dealine_for_clarification_period;
     
     
      }
      res.render('responseDate', appendData);
    }

    else {
      if (req.session.questionID == 'Question 2') {
        eoi_clarification_date = moment(req.session.eoipublishdate, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY');
        eoi_clarification_period_end = req.session.UIDate;

        // rfp_clarification_date =moment(req.session.clarificationend,'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
        deadline_period_for_clarification_period = req.session.deadlinepublishresponse;
        supplier_period_for_clarification_period = req.session.supplierresponse;
        supplier_dealine_for_clarification_period = req.session.confirmNextStepsSuppliers;

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
            fetchQuestionsData[i].nonOCDS.options[0].value=moment(day+" "+time,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY, HH:mm');
            }
          }
        }
        let appendData = {
          data: cmsData,
          prompt: prompt,
          framework: fetchQuestionsData,
          eoi_clarification_date,
          eoi_clarification_period_end,
          deadline_period_for_clarification_period,
          supplier_period_for_clarification_period,
          supplier_dealine_for_clarification_period,
          releatedContent: req.session.releatedContent,
          agreement_id,
        };
        if (errorTriggered) {
          appendData = { ...appendData, error: true, errorMessage: errorItem };
        } else {
          req.session.timeline.clarificationPeriodEnd = eoi_clarification_period_end;
        }

        res.render('responseDate', appendData);

      }
      else if (req.session.questionID == 'Question 3') {

        deadline_period_for_clarification_period = req.session.UIDate;

        eoi_clarification_date = moment(req.session.eoipublishdate, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY');
        eoi_clarification_period_end = req.session.clarificationend;
        //deadline_period_for_clarification_period =moment(req.session.deadlinepublishresponse,'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
        supplier_period_for_clarification_period = req.session.supplierresponse;
        supplier_dealine_for_clarification_period = req.session.confirmNextStepsSuppliers;

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
            fetchQuestionsData[i].nonOCDS.options[0].value=moment(day+" "+time,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY, HH:mm');
            }
          }
        }
        let appendData = {
          data: cmsData,
          prompt: prompt,
          framework: fetchQuestionsData,
          eoi_clarification_date,
          eoi_clarification_period_end,
          deadline_period_for_clarification_period,
          supplier_period_for_clarification_period,
          supplier_dealine_for_clarification_period,
          releatedContent: req.session.releatedContent,
          agreement_id,
        };
        if (errorTriggered) {
          appendData = { ...appendData, error: true, errorMessage: errorItem };
        } else {
          req.session.timeline.publishResponsesClarificationQuestions = deadline_period_for_clarification_period;
        }

        res.render('responseDate', appendData);

      }
      else if (req.session.questionID == 'Question 4') {

        supplier_period_for_clarification_period = req.session.UIDate;

        eoi_clarification_date = moment(req.session.eoipublishdate, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY');
        eoi_clarification_period_end = req.session.clarificationend;
        deadline_period_for_clarification_period = req.session.deadlinepublishresponse;
        //supplier_period_for_clarification_period =moment(req.session.supplierresponse,'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
        supplier_dealine_for_clarification_period = req.session.confirmNextStepsSuppliers;

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
            fetchQuestionsData[i].nonOCDS.options[0].value=moment(day+" "+time,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY, HH:mm');
            }
          }
        }
        let appendData = {
          data: cmsData,
          prompt: prompt,
          framework: fetchQuestionsData,
          eoi_clarification_date,
          eoi_clarification_period_end,
          deadline_period_for_clarification_period,
          supplier_period_for_clarification_period,
          supplier_dealine_for_clarification_period,
          releatedContent: req.session.releatedContent,
          agreement_id,
        };
        if (errorTriggered) {
          appendData = { ...appendData, error: true, errorMessage: errorItem };
        } else {
          req.session.timeline.supplierSubmitResponse = supplier_period_for_clarification_period;
        }

        res.render('responseDate', appendData);
      }
      else if (req.session.questionID == 'Question 5') {
        
        supplier_dealine_for_clarification_period = req.session.UIDate;
        
        // eoi_clarification_date = req.session.eoipublishdate;
        eoi_clarification_date =moment(req.session.eoipublishdate,'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY');
        eoi_clarification_period_end = req.session.clarificationend;
        deadline_period_for_clarification_period = req.session.deadlinepublishresponse;
        supplier_period_for_clarification_period = req.session.supplierresponse;
        
        // eoi_clarification_date = moment(req.session.eoipublishdate, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
        // eoi_clarification_period_end = moment(req.session.clarificationend, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
        // deadline_period_for_clarification_period = moment(req.session.deadlinepublishresponse, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
        // supplier_period_for_clarification_period = moment(req.session.supplierresponse, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
        // //supplier_dealine_for_clarification_period =moment(req.session.confirmNextStepsSuppliers,'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');

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
            fetchQuestionsData[i].nonOCDS.options[0].value=moment(day+" "+time,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY, HH:mm');
            }
          }
        }
        let appendData = {
          data: cmsData,
          prompt: prompt,
          framework: fetchQuestionsData,
          eoi_clarification_date,
          eoi_clarification_period_end,
          deadline_period_for_clarification_period,
          supplier_period_for_clarification_period,
          supplier_dealine_for_clarification_period,
          releatedContent: req.session.releatedContent,
          agreement_id,
        };
        if (errorTriggered) {
          appendData = { ...appendData, error: true, errorMessage: errorItem };
        } else {
          req.session.timeline.confirmNextStepsSuppliers = supplier_dealine_for_clarification_period;
        }

        res.render('responseDate', appendData);
      }
    }



  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'EOI - Tenders Service Api cannot be connected',
      true,
    );
  }
};
