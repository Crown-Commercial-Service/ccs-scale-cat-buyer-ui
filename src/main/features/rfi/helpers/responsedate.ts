//@ts-nocheck
import * as express from 'express';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { TenderApi } from '../../../common/util/fetch/tenderService/tenderApiInstance';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';
import moment from 'moment-business-days';
import * as cmsData from '../../../resources/content/RFI/rfi-response-date.json';
import config from 'config';
import { dateFilter } from 'main/modules/nunjucks/filters/dateFilter';
import { logConstant } from '../../../common/logtracer/logConstant';
import { bankHolidays } from 'main/services/bankHolidays';

const momentCssHolidays = async () => {
  const bankholidaydata = (await bankHolidays.api.getBankHolidays()).unwrap();
  const bankHolidayEnglandWales = bankholidaydata['england-and-wales'].events;
  const holiDaysArr = [];
  for (let h = 0; h < bankHolidayEnglandWales.length; h++) {
    const AsDate = new Date(bankHolidayEnglandWales[h].date);
    holiDaysArr.push(moment(AsDate).format('DD-MM-YYYY'));
  }

  moment.updateLocale('en', {
    holidays: holiDaysArr,
    holidayFormat: 'DD-MM-YYYY',
  });
};
const predefinedDays = {
  defaultEndingHour: Number(config.get('predefinedDays.defaultEndingHour')),
  defaultEndingMinutes: Number(config.get('predefinedDays.defaultEndingMinutes')),
  clarification_days: Number(config.get('predefinedDays.clarification_days')),
  clarification_period_end: Number(config.get('predefinedDays.clarification_period_end')),
  supplier_period: Number(config.get('predefinedDays.supplier_period')),
  supplier_deadline: Number(config.get('predefinedDays.supplier_deadline')),
};

export const RESPONSEDATEHELPER = async (req: express.Request, res: express.Response, errorTriggered, errorItem) => {
  await momentCssHolidays();
  const proc_id = req.session.projectId;
  const event_id = req.session.eventId;
  const agreementId_session = req.session.agreement_id;
  const { SESSION_ID } = req.cookies;
  let baseURL = `/tenders/projects/${proc_id}/events/${event_id}`;
  baseURL = baseURL + '/criteria';
  const keyDateselector = 'Key Dates';
  let day, time;

  try {
    const fetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(baseURL);
    const fetch_dynamic_api_data = fetch_dynamic_api?.data;
    const extracted_criterion_based = fetch_dynamic_api_data?.map((criterian) => criterian?.id);
    let criterianStorage = [];
    for (const aURI of extracted_criterion_based) {
      const criterian_bas_url = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${aURI}/groups`;
      const fetch_criterian_group_data = await DynamicFrameworkInstance.Instance(SESSION_ID).get(criterian_bas_url);
      const criterian_array = fetch_criterian_group_data?.data;
      const rebased_object_with_requirements = criterian_array?.map((anItem) => {
        const object = anItem;
        object['criterianId'] = aURI;
        return object;
      });
      criterianStorage.push(rebased_object_with_requirements);
    }

    criterianStorage = criterianStorage.flat();
    criterianStorage = criterianStorage.filter((AField) => AField.OCDS.id === keyDateselector);
    const Criterian_ID = criterianStorage[0].criterianId;
    let prompt = criterianStorage[0].nonOCDS.prompt;
    if (agreementId_session != 'RM1557.13') {
      prompt = criterianStorage[0].nonOCDS.prompt.replace(
        '</strong></p>\n       <br>',
        ' It is recommended you set your times to no later than 4pm on a weekday in case you need to contact CCS about your project.</strong></p>'
      );
    } else {
      prompt = criterianStorage[0].nonOCDS.prompt.replace('</strong></p>\n       <br>', ' </strong></p>');
    }
    const apiData_baseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${Criterian_ID}/groups/${keyDateselector}/questions`;
    const fetchQuestions = await DynamicFrameworkInstance.Instance(SESSION_ID).get(apiData_baseURL);

    let fetchQuestionsData = fetchQuestions.data;

    //CAS-INFO-LOG
    LoggTracer.infoLogger(fetchQuestionsData, logConstant.rfiGetTimeLineQuestions, req);

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
      // const rfi_clarification_date = moment(new Date(), 'DD/MM/YYYY').format('DD MMMM YYYY');
      const rfi_clarification_dateNew = new Date();
      rfi_clarification_dateNew.setHours(predefinedDays.defaultEndingHour);
      rfi_clarification_dateNew.setMinutes(predefinedDays.defaultEndingMinutes);
      // const rfi_clarification_date = moment(new Date(rfi_clarification_dateNew), 'DD/MM/YYYY').format('DD MMMM YYYY,HH:mm');
      const rfi_clarification_date = moment(rfi_clarification_dateNew, 'DD/MM/YYYY, HH:mm').format(
        'DD MMMM YYYY, HH:mm'
      );
      const clarification_period_end_date = new Date();
      const clarification_period_end_date_parsed = `${clarification_period_end_date.getDate()}-${clarification_period_end_date.getMonth() + 1
        }-${clarification_period_end_date.getFullYear()}`;
      let rfi_clarification_period_end = moment(clarification_period_end_date_parsed, 'DD MM YYYY').businessAdd(
        predefinedDays.clarification_days
      )._d;
      rfi_clarification_period_end.setHours(predefinedDays.defaultEndingHour);
      rfi_clarification_period_end.setMinutes(predefinedDays.defaultEndingMinutes);

      const DeadlinePeriodDate = rfi_clarification_period_end;

      const DeadlinePeriodDate_Parsed = `${DeadlinePeriodDate.getDate()}-${DeadlinePeriodDate.getMonth() + 1
        }-${DeadlinePeriodDate.getFullYear()}`;
      let deadline_period_for_clarification_period = moment(DeadlinePeriodDate_Parsed, 'DD-MM-YYYY').businessAdd(
        predefinedDays.clarification_period_end
      )._d;
      deadline_period_for_clarification_period.setHours(predefinedDays.defaultEndingHour);
      deadline_period_for_clarification_period.setMinutes(predefinedDays.defaultEndingMinutes);

      const SupplierPeriodDate = deadline_period_for_clarification_period;
      const SupplierPeriodDate_Parsed = `${SupplierPeriodDate.getDate()}-${SupplierPeriodDate.getMonth() + 1
        }-${SupplierPeriodDate.getFullYear()}`;
      let supplier_period_for_clarification_period = moment(SupplierPeriodDate_Parsed, 'DD-MM-YYYY').businessAdd(
        predefinedDays.supplier_period
      )._d;
      supplier_period_for_clarification_period.setHours(predefinedDays.defaultEndingHour);
      supplier_period_for_clarification_period.setMinutes(predefinedDays.defaultEndingMinutes);

      const SupplierPeriodDeadLine = supplier_period_for_clarification_period;
      const SupplierPeriodDeadLine_Parsed = `${SupplierPeriodDeadLine.getDate()}-${SupplierPeriodDeadLine.getMonth() + 1
        }-${SupplierPeriodDeadLine.getFullYear()}`;
      let supplier_dealine_for_clarification_period = moment(SupplierPeriodDeadLine_Parsed, 'DD-MM-YYYY').businessAdd(
        predefinedDays.supplier_deadline
      )._d;
      supplier_dealine_for_clarification_period.setHours(predefinedDays.defaultEndingHour);
      supplier_dealine_for_clarification_period.setMinutes(predefinedDays.defaultEndingMinutes);
      fetchQuestionsData = fetchQuestionsData.sort((current_element, next_element) => {
        const currentElementID = Number(current_element.OCDS.id.split('Question ').join(''));
        const nextElementID = Number(next_element.OCDS.id.split('Question ').join(''));
        return currentElementID - nextElementID;
      });
      for (let i = 0; i < fetchQuestionsData.length; i++) {
        if (fetchQuestionsData[i].nonOCDS.options.length > 0) {
          const value = fetchQuestionsData[i].nonOCDS.options[0].value;
          day = value.substr(0, 10);
          time = value.substr(11, 5);
          if (i == 0) {
            fetchQuestionsData[i].nonOCDS.options[0].value = moment(day + ' ' + time, 'YYYY-MM-DD HH:mm').format(
              'DD MMMM YYYY'
            );
          } else {
            fetchQuestionsData[i].nonOCDS.options[0].value = moment(day + ' ' + time, 'YYYY-MM-DD HH:mm').format(
              'DD MMMM YYYY, HH:mm'
            );
          }
        }
      }

      if (!req.session.isTimelineRevert) {
        const rfi_clarification_period_endGet = fetchQuestionsData
          ?.filter((item) => item?.OCDS?.id == 'Question 2')
          .map((item) => item?.nonOCDS?.options)?.[0]
          ?.find((i) => i?.value)?.value;
        rfi_clarification_period_end =
          rfi_clarification_period_endGet != undefined
            ? new Date(rfi_clarification_period_endGet)
            : rfi_clarification_period_end;

        const deadline_period_for_clarification_periodGet = fetchQuestionsData
          ?.filter((item) => item?.OCDS?.id == 'Question 3')
          .map((item) => item?.nonOCDS?.options)?.[0]
          ?.find((i) => i?.value)?.value;
        deadline_period_for_clarification_period =
          deadline_period_for_clarification_periodGet != undefined
            ? new Date(deadline_period_for_clarification_periodGet)
            : deadline_period_for_clarification_period;

        const supplier_period_for_clarification_periodGet = fetchQuestionsData
          ?.filter((item) => item?.OCDS?.id == 'Question 4')
          .map((item) => item?.nonOCDS?.options)?.[0]
          ?.find((i) => i?.value)?.value;
        supplier_period_for_clarification_period =
          supplier_period_for_clarification_periodGet != undefined
            ? new Date(supplier_period_for_clarification_periodGet)
            : supplier_period_for_clarification_period;

        const supplier_dealine_for_clarification_periodGet = fetchQuestionsData
          ?.filter((item) => item?.OCDS?.id == 'Question 5')
          .map((item) => item?.nonOCDS?.options)?.[0]
          ?.find((i) => i?.value)?.value;
        supplier_dealine_for_clarification_period =
          supplier_dealine_for_clarification_periodGet != undefined
            ? new Date(supplier_dealine_for_clarification_periodGet)
            : supplier_dealine_for_clarification_period;
      }

      let appendData = {
        data: cmsData,
        prompt: prompt,
        framework: fetchQuestionsData,
        rfi_clarification_date,
        agreementId_session,
        rfi_clarification_period_end: moment(rfi_clarification_period_end, 'DD/MM/YYYY, HH:mm').format(
          'DD MMMM YYYY, HH:mm'
        ),
        deadline_period_for_clarification_period: moment(
          deadline_period_for_clarification_period,
          'DD/MM/YYYY, HH:mm'
        ).format('DD MMMM YYYY, HH:mm'),
        supplier_period_for_clarification_period: moment(
          supplier_period_for_clarification_period,
          'DD/MM/YYYY, HH:mm'
        ).format('DD MMMM YYYY, HH:mm'),
        supplier_dealine_for_clarification_period: moment(
          supplier_dealine_for_clarification_period,
          'DD/MM/YYYY, HH:mm'
        ).format('DD MMMM YYYY, HH:mm'),
        releatedContent: req.session.releatedContent,
      };

      if (errorTriggered) {
        appendData = { ...appendData, error: true, errorMessage: errorItem };
      } else {
        req.session.timeline = {};

        const newDatePublish = new Date();
        newDatePublish.setHours(predefinedDays.defaultEndingHour);
        newDatePublish.setMinutes(predefinedDays.defaultEndingMinutes);
        req.session.timeline.publish = moment(new Date(newDatePublish), 'DD/MM/YYYY').format('DD MMMM YYYY, HH:mm');

        //const rfi_clarification_date = moment(new Date(rfi_clarification_dateNew), 'DD/MM/YYYY').format('DD MMMM YYYY');

        req.session.timeline.clarificationPeriodEnd = rfi_clarification_period_end;
        req.session.timeline.publishResponsesClarificationQuestions = deadline_period_for_clarification_period;
        req.session.timeline.supplierSubmitResponse = supplier_period_for_clarification_period;
        req.session.timeline.confirmNextStepsSuppliers = supplier_dealine_for_clarification_period;
      }

      //CAS-INFO-LOG
      LoggTracer.infoLogger(null, logConstant.setYourTimeLinePage, req);
      //CAS-32
      if (req.session.isTimelineRevert) {
        const arrOfCurrentTimeline = [];
        arrOfCurrentTimeline.push(
          `Question 1*${appendData.rfi_clarification_date}`,
          `Question 2*${appendData.rfi_clarification_period_end}`,
          `Question 3*${appendData.deadline_period_for_clarification_period}`,
          `Question 4*${appendData.supplier_period_for_clarification_period}`,
          `Question 5*${appendData.supplier_dealine_for_clarification_period}`
        );
        await timelineForcePostForPublish(req, res, arrOfCurrentTimeline);
        res.redirect('/rfi/response-date');
      } else {
        res.render('response-date', appendData);
      }
    } else {
      if (req.session.questionID == 'Question 2') {
        rfi_clarification_date = req.session.rfipublishdate;
        // rfi_clarification_date = moment(req.session.rfipublishdate, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');

        rfi_clarification_period_end = req.session.UIDate;

        // rfp_clarification_date =moment(req.session.clarificationend,'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
        deadline_period_for_clarification_period = moment(
          req.session.deadlinepublishresponse,
          'YYYY-MM-DD, HH:mm'
        ).format('DD MMMM YYYY, HH:mm');
        supplier_period_for_clarification_period = moment(req.session.supplierresponse, 'YYYY-MM-DD, HH:mm').format(
          'DD MMMM YYYY, HH:mm'
        );
        supplier_dealine_for_clarification_period = moment(
          req.session.confirmNextStepsSuppliers,
          'YYYY-MM-DD, HH:mm'
        ).format('DD MMMM YYYY, HH:mm');

        fetchQuestionsData = fetchQuestionsData.sort((current_element, next_element) => {
          const currentElementID = Number(current_element.OCDS.id.split('Question ').join(''));
          const nextElementID = Number(next_element.OCDS.id.split('Question ').join(''));
          return currentElementID - nextElementID;
        });
        for (let i = 0; i < fetchQuestionsData.length; i++) {
          if (fetchQuestionsData[i].nonOCDS.options.length > 0) {
            const value = fetchQuestionsData[i].nonOCDS.options[0].value;
            day = value.substr(0, 10);
            time = value.substr(11, 5);
            if (i == 0) {
              fetchQuestionsData[i].nonOCDS.options[0].value = moment(day + ' ' + time, 'YYYY-MM-DD HH:mm').format(
                'DD MMMM YYYY'
              );
            } else {
              fetchQuestionsData[i].nonOCDS.options[0].value = moment(day + ' ' + time, 'YYYY-MM-DD HH:mm').format(
                'DD MMMM YYYY, HH:mm'
              );
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
          agreementId_session,
        };
        if (errorTriggered) {
          appendData = { ...appendData, error: true, errorMessage: errorItem };
        } else {
          req.session.timeline.clarificationPeriodEnd = rfi_clarification_period_end;
        }

        res.render('response-date', appendData);
      } else if (req.session.questionID == 'Question 3') {
        deadline_period_for_clarification_period = req.session.UIDate;
        rfi_clarification_date = req.session.rfipublishdate;
        //rfi_clarification_date = moment(req.session.rfipublishdate, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
        rfi_clarification_period_end = moment(req.session.clarificationend, 'YYYY-MM-DD, HH:mm').format(
          'DD MMMM YYYY, HH:mm'
        );
        //deadline_period_for_clarification_period =moment(req.session.deadlinepublishresponse,'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
        supplier_period_for_clarification_period = moment(req.session.supplierresponse, 'YYYY-MM-DD, HH:mm').format(
          'DD MMMM YYYY, HH:mm'
        );
        supplier_dealine_for_clarification_period = moment(
          req.session.confirmNextStepsSuppliers,
          'YYYY-MM-DD, HH:mm'
        ).format('DD MMMM YYYY, HH:mm');

        fetchQuestionsData = fetchQuestionsData.sort((current_element, next_element) => {
          const currentElementID = Number(current_element.OCDS.id.split('Question ').join(''));
          const nextElementID = Number(next_element.OCDS.id.split('Question ').join(''));
          return currentElementID - nextElementID;
        });
        for (let i = 0; i < fetchQuestionsData.length; i++) {
          if (fetchQuestionsData[i].nonOCDS.options.length > 0) {
            const value = fetchQuestionsData[i].nonOCDS.options[0].value;
            day = value.substr(0, 10);
            time = value.substr(11, 5);
            if (i == 0) {
              fetchQuestionsData[i].nonOCDS.options[0].value = moment(day + ' ' + time, 'YYYY-MM-DD HH:mm').format(
                'DD MMMM YYYY'
              );
            } else {
              fetchQuestionsData[i].nonOCDS.options[0].value = moment(day + ' ' + time, 'YYYY-MM-DD HH:mm').format(
                'DD MMMM YYYY, HH:mm'
              );
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
          agreementId_session,
        };
        if (errorTriggered) {
          appendData = { ...appendData, error: true, errorMessage: errorItem };
        } else {
          req.session.timeline.publishResponsesClarificationQuestions = deadline_period_for_clarification_period;
        }

        res.render('response-date', appendData);
      } else if (req.session.questionID == 'Question 4') {
        supplier_period_for_clarification_period = req.session.UIDate;
        rfi_clarification_date = req.session.rfipublishdate;
        //rfi_clarification_date = moment(req.session.rfipublishdate, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
        rfi_clarification_period_end = moment(req.session.clarificationend, 'YYYY-MM-DD, HH:mm').format(
          'DD MMMM YYYY, HH:mm'
        );
        deadline_period_for_clarification_period = moment(
          req.session.deadlinepublishresponse,
          'YYYY-MM-DD, HH:mm'
        ).format('DD MMMM YYYY, HH:mm');
        //supplier_period_for_clarification_period =moment(req.session.supplierresponse,'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
        supplier_dealine_for_clarification_period = moment(
          req.session.confirmNextStepsSuppliers,
          'YYYY-MM-DD, HH:mm'
        ).format('DD MMMM YYYY, HH:mm');

        fetchQuestionsData = fetchQuestionsData.sort((current_element, next_element) => {
          const currentElementID = Number(current_element.OCDS.id.split('Question ').join(''));
          const nextElementID = Number(next_element.OCDS.id.split('Question ').join(''));
          return currentElementID - nextElementID;
        });
        for (let i = 0; i < fetchQuestionsData.length; i++) {
          if (fetchQuestionsData[i].nonOCDS.options.length > 0) {
            const value = fetchQuestionsData[i].nonOCDS.options[0].value;
            day = value.substr(0, 10);
            time = value.substr(11, 5);
            if (i == 0) {
              fetchQuestionsData[i].nonOCDS.options[0].value = moment(day + ' ' + time, 'YYYY-MM-DD HH:mm').format(
                'DD MMMM YYYY'
              );
            } else {
              fetchQuestionsData[i].nonOCDS.options[0].value = moment(day + ' ' + time, 'YYYY-MM-DD HH:mm').format(
                'DD MMMM YYYY, HH:mm'
              );
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
          agreementId_session,
        };
        if (errorTriggered) {
          appendData = { ...appendData, error: true, errorMessage: errorItem };
        } else {
          req.session.timeline.supplierSubmitResponse = supplier_period_for_clarification_period;
        }

        res.render('response-date', appendData);
      } else if (req.session.questionID == 'Question 5') {
        supplier_dealine_for_clarification_period = req.session.UIDate;
        rfi_clarification_date = req.session.rfipublishdate;
        // rfi_clarification_date = moment(req.session.rfipublishdate, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
        rfi_clarification_period_end = moment(req.session.clarificationend, 'YYYY-MM-DD, HH:mm').format(
          'DD MMMM YYYY, HH:mm'
        );
        deadline_period_for_clarification_period = moment(
          req.session.deadlinepublishresponse,
          'YYYY-MM-DD, HH:mm'
        ).format('DD MMMM YYYY, HH:mm');
        supplier_period_for_clarification_period = moment(req.session.supplierresponse, 'YYYY-MM-DD, HH:mm').format(
          'DD MMMM YYYY, HH:mm'
        );
        //supplier_dealine_for_clarification_period =moment(req.session.confirmNextStepsSuppliers,'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');

        fetchQuestionsData = fetchQuestionsData.sort((current_element, next_element) => {
          const currentElementID = Number(current_element.OCDS.id.split('Question ').join(''));
          const nextElementID = Number(next_element.OCDS.id.split('Question ').join(''));
          return currentElementID - nextElementID;
        });
        for (let i = 0; i < fetchQuestionsData.length; i++) {
          if (fetchQuestionsData[i].nonOCDS.options.length > 0) {
            const value = fetchQuestionsData[i].nonOCDS.options[0].value;
            day = value.substr(0, 10);
            time = value.substr(11, 5);
            if (i == 0) {
              fetchQuestionsData[i].nonOCDS.options[0].value = moment(day + ' ' + time, 'YYYY-MM-DD HH:mm').format(
                'DD MMMM YYYY'
              );
            } else {
              fetchQuestionsData[i].nonOCDS.options[0].value = moment(day + ' ' + time, 'YYYY-MM-DD HH:mm').format(
                'DD MMMM YYYY, HH:mm'
              );
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
          agreementId_session,
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
      'RFI Timeline - Tenders Service Api cannot be connected',
      true
    );
  }
};
//CAS-32
const timelineForcePostForPublish = async (req, res, arr: any) => {
  const filterWithQuestions = arr.map((aQuestions) => {
    const anEntry = aQuestions.split('*');
    return { Question: anEntry[0], value: anEntry[1] };
  });
  const proc_id = req.session.projectId;
  const event_id = req.session.eventId;
  const stage2_value = req.session.stage2_value;
  const { SESSION_ID } = req.cookies;
  const { projectId, eventId } = req.session;
  const agreement_id = req.session.agreement_id;
  let baseURL = `/tenders/projects/${proc_id}/events/${event_id}`;
  baseURL = baseURL + '/criteria';
  const keyDateselector = 'Key Dates';
  try {
    const fetch_dynamic_api = await TenderApi.Instance(SESSION_ID).get(baseURL);
    const fetch_dynamic_api_data = fetch_dynamic_api?.data;
    const extracted_criterion_based = fetch_dynamic_api_data?.map((criterian) => criterian?.id);
    let criterianStorage = [];
    for (const aURI of extracted_criterion_based) {
      const criterian_bas_url = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${aURI}/groups`;
      const fetch_criterian_group_data = await TenderApi.Instance(SESSION_ID).get(criterian_bas_url);
      const criterian_array = fetch_criterian_group_data?.data;
      const rebased_object_with_requirements = criterian_array?.map((anItem) => {
        const object = anItem;
        object['criterianId'] = aURI;
        return object;
      });
      criterianStorage.push(rebased_object_with_requirements);
    }
    criterianStorage = criterianStorage.flat();
    criterianStorage = criterianStorage.filter((AField) => AField.OCDS.id === keyDateselector);
    const Criterian_ID = criterianStorage[0].criterianId;
    const apiData_baseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${Criterian_ID}/groups/${keyDateselector}/questions`;
    const fetchQuestions = await TenderApi.Instance(SESSION_ID).get(apiData_baseURL);
    const fetchQuestionsData = fetchQuestions.data;
    const allunfilledAnswer = fetchQuestionsData
      .filter((anAswer) => anAswer.nonOCDS.options.length != 0) //CAS-32 - minor changes were made in this place
      .map((aQuestion) => aQuestion.OCDS.id);
    for (const answers of allunfilledAnswer) {
      const proc_id = req.session.projectId;
      const event_id = req.session.eventId;
      const id = Criterian_ID;
      const group_id = 'Key Dates';
      const question_id = answers;
      const findFilterQuestion = filterWithQuestions.filter((question) => question.Question === question_id);
      const findFilterValues = findFilterQuestion[0].value;
      const filtervalues = moment(findFilterValues, 'DD MMMM YYYY, HH:mm:ss ').format('YYYY-MM-DDTHH:mm:ss') + 'Z';
      const answerformater = {
        value: filtervalues,
        selected: true,
        text: answers,
      };
      const answerBody = {
        nonOCDS: {
          answered: true,
          options: [answerformater],
        },
      };
      const answerBaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups/${group_id}/questions/${question_id}`;
      const timeLineRaw = await TenderApi.Instance(SESSION_ID).put(answerBaseURL, answerBody);
    }
    req.session.isTimelineRevert = false;
  } catch (error) {
    // LoggTracer.errorLogger(
    //   res,
    //   error,
    //   `${req.headers.host}${req.originalUrl}`,
    //   null,
    //   TokenDecoder.decoder(SESSION_ID),
    //   'Issue at timeline dates update force - Regards publish date & timeline date mismatch issue',
    //   true,
    // );
  }
};
