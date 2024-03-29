//@ts-nocheck
import * as express from 'express';
import { TenderApi } from '../../common/util/fetch/tenderService/tenderApiInstance';
import { LoggTracer } from '../../common/logtracer/tracer';
import { TokenDecoder } from '../../common/tokendecoder/tokendecoder';
import { LogMessageFormatter } from '../../common/logtracer/logmessageformatter';
import moment from 'moment-business-days';
import config from 'config';

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
  const baseURL = `/tenders/projects/${proc_id}/events/${event_id}`;
  const criteriaUrl = baseURL + '/criteria';
  const keyDateselector = 'Key Dates';
  req.session.timeline = {};
  try {
    const fetch_dynamic_api = await TenderApi.Instance(SESSION_ID).get(criteriaUrl);
    const fetch_dynamic_api_data = fetch_dynamic_api?.data;
    const extracted_criterion_Ids = fetch_dynamic_api_data?.map((criterian) => criterian?.id);
    let criterianStorage = [];
    for (const aURI of extracted_criterion_Ids) {
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
    const prompt = criterianStorage[0].nonOCDS.prompt;
    const apiData_baseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 2/groups/${keyDateselector}/questions`;
    const fetchQuestions = await TenderApi.Instance(SESSION_ID).get(apiData_baseURL);
    let fetchQuestionsData = fetchQuestions.data;
    const clarification_date = moment(new Date(), 'DD/MM/YYYY').format('DD MMMM YYYY');

    const clarification_period_end_date = new Date();
    const clarification_period_end_date_parsed = `${clarification_period_end_date.getDate()}-${
      clarification_period_end_date.getMonth() + 1
    }-${clarification_period_end_date.getFullYear()}`;
    const clarification_period_end = moment(clarification_period_end_date_parsed, 'DD-MM-YYYY').businessAdd(
      predefinedDays.clarification_days
    )._d;
    clarification_period_end.setHours(predefinedDays.defaultEndingHour);
    clarification_period_end.setMinutes(predefinedDays.defaultEndingMinutes);
    const DeadlinePeriodDate = clarification_period_end;

    const DeadlinePeriodDate_Parsed = `${DeadlinePeriodDate.getDate()}-${
      DeadlinePeriodDate.getMonth() + 1
    }-${DeadlinePeriodDate.getFullYear()}`;
    const deadline_period_for_clarification_period = moment(DeadlinePeriodDate_Parsed, 'DD-MM-YYYY').businessAdd(
      predefinedDays.clarification_period_end
    )._d;
    deadline_period_for_clarification_period.setHours(predefinedDays.defaultEndingHour);
    deadline_period_for_clarification_period.setMinutes(predefinedDays.defaultEndingMinutes);

    const SupplierPeriodDate = deadline_period_for_clarification_period;
    const SupplierPeriodDate_Parsed = `${SupplierPeriodDate.getDate()}-${
      SupplierPeriodDate.getMonth() + 1
    }-${SupplierPeriodDate.getFullYear()}`;
    const supplier_period_for_clarification_period = moment(SupplierPeriodDate_Parsed, 'DD-MM-YYYY').businessAdd(
      predefinedDays.supplier_period
    )._d;
    supplier_period_for_clarification_period.setHours(predefinedDays.defaultEndingHour);
    supplier_period_for_clarification_period.setMinutes(predefinedDays.defaultEndingMinutes);

    const SupplierPeriodDeadLine = supplier_period_for_clarification_period;
    const SupplierPeriodDeadLine_Parsed = `${SupplierPeriodDeadLine.getDate()}-${
      SupplierPeriodDeadLine.getMonth() + 1
    }-${SupplierPeriodDeadLine.getFullYear()}`;
    const supplier_dealine_for_clarification_period = moment(SupplierPeriodDeadLine_Parsed, 'DD-MM-YYYY').businessAdd(
      predefinedDays.supplier_deadline
    )._d;
    supplier_dealine_for_clarification_period.setHours(predefinedDays.defaultEndingHour);
    supplier_dealine_for_clarification_period.setMinutes(predefinedDays.defaultEndingMinutes);

    fetchQuestionsData = fetchQuestionsData.sort((current_element, next_element) => {
      const currentElementID = Number(current_element.OCDS.id.split('Question ').join(''));
      const nextElementID = Number(next_element.OCDS.id.split('Question ').join(''));
      return currentElementID - nextElementID;
    });
    let appendData = {
      prompt: prompt,
      framework: fetchQuestionsData,
      clarification_date,
      clarification_period_end: moment(clarification_period_end, 'DD/MM/YYYY, hh:mm a').format('DD MMMM YYYY, hh:mm a'),
      deadline_period_for_clarification_period: moment(
        deadline_period_for_clarification_period,
        'DD/MM/YYYY, hh:mm a'
      ).format('DD MMMM YYYY, hh:mm a'),
      supplier_period_for_clarification_period: moment(
        supplier_period_for_clarification_period,
        'DD/MM/YYYY, hh:mm a'
      ).format('DD MMMM YYYY, hh:mm a'),
      supplier_dealine_for_clarification_period: moment(
        supplier_dealine_for_clarification_period,
        'DD/MM/YYYY, hh:mm a'
      ).format('DD MMMM YYYY, hh:mm a'),
      releatedContent: req.session.releatedContent,
    };
    if (errorTriggered) {
      appendData = { ...appendData, error: true, errorMessage: errorItem };
    } else {
      req.session.timeline.publish = new Date();
      req.session.timeline.clarificationPeriodEnd = rfi_clarification_period_end;
      req.session.timeline.publishResponsesClarificationQuestions = deadline_period_for_clarification_period;
      req.session.timeline.supplierSubmitResponse = supplier_period_for_clarification_period;
      req.session.timeline.confirmNextStepsSuppliers = supplier_dealine_for_clarification_period;
    }

    return appendData;
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Tenders Service Api cannot be connected',
      true
    );
  }
};
