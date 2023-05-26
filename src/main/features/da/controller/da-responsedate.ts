//@ts-nocheck
import * as express from 'express';
import { TenderApi } from '../../../common/util/fetch/tenderService/tenderApiInstance';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';
import { RESPONSEDATEHELPER } from '../helpers/responsedate';
import { HttpStatusCode } from 'main/errors/httpStatusCodes';
import moment from 'moment-business-days';
import { ShouldEventStatusBeUpdated } from '../../shared/ShouldEventStatusBeUpdated';
import { bankholidayContentAPI } from '../../../common/util/fetch/bankholidayservice/bankholidayApiInstance';
import { logConstant } from '../../../common/logtracer/logConstant';

export const DA_GET_RESPONSE_DATE = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const proj_Id = req.session.projectId;
  const { eventId } = req.session;
  RESPONSEDATEHELPER(req, res);
};

export const DA_POST_RESPONSE_DATE = async (req: express.Request, res: express.Response) => {
  const RequestBodyValues = Object.values(req.body);
  const { supplier_period_for_clarification_period } = req.body;
  req.session['endDate'] = supplier_period_for_clarification_period;
  const filterWithQuestions = RequestBodyValues.map((aQuestions) => {
    const anEntry = aQuestions.split('*');
    return { Question: anEntry[0], value: anEntry[1] };
  });
  const proc_id = req.session.projectId;
  const event_id = req.session.eventId;
  const { SESSION_ID } = req.cookies;
  const { projectId, eventId } = req.session;
  let baseURL = `/tenders/projects/${proc_id}/events/${event_id}`;
  baseURL = baseURL + '/criteria';
  const keyDateselector = 'Key Dates';
  try {
    const fetch_dynamic_api = await TenderApi.Instance(SESSION_ID).get(baseURL);
    //CAS-INFO-LOG
    LoggTracer.infoLogger(fetch_dynamic_api, logConstant.keyDates, req);
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
    //CAS-INFO-LOG
    LoggTracer.infoLogger(fetchQuestions, logConstant.keyDates, req);
    const fetchQuestionsData = fetchQuestions.data;
    const allunfilledAnswer = fetchQuestionsData
      .filter((anAswer) => anAswer.nonOCDS.options.length == 0)
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
      const responses = await TenderApi.Instance(SESSION_ID).put(answerBaseURL, answerBody);
      //CAS-INFO-LOG
      LoggTracer.infoLogger(responses, logConstant.saveKeyDates, req);
    }
    const response = await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/35`, 'Completed');
    if (response.status == HttpStatusCode.OK) {
      const flag = await ShouldEventStatusBeUpdated(eventId, 36, req);
      if (flag) {
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/36`, 'Not started');
      }
    }

    res.redirect('/da/review');
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'DA Timeline - Tenders Service Api cannot be connected',
      true
    );
  }
};
function isValidQuestion(
  questionId: number,
  day: number,
  month: number,
  year: number,
  hour: number,
  minute: number,
  timeinHoursBased: number,
  timeline: any,
  agreement_id: any,
  bankholidaydata: any
) {
  //const date1 = new Date(year, month, day, timeinHoursBased, minute);
  //let todaydate=new Date();
  let isValid = true,
    error,
    errorSelector;
  if (day > 31 || day < 1) {
    isValid = false;
    error = 'Enter a valid date';
  }
  if (minute > 59 || minute < 0) {
    isValid = false;
    error = 'Enter valid minutes';
  }
  if (hour > 23 || hour <= 0) {
    isValid = false;
    error = 'Enter a valid hour';
  }
  if (month > 12 || month < 0) {
    isValid = false;
    error = 'Enter a valid month';
  }
  const currentYear = new Date().getFullYear();
  if (year > 2121 || year < currentYear) {
    isValid = false;
    error = 'Enter a valid year';
  }
  const questionNewDate = new Date(year, month, day, timeinHoursBased, minute);

  let bankHolidayEnglandWales;
  if (bankholidaydata) {
    let bankholidaydataengland = JSON.stringify(bankholidaydata.data).replace(/england-and-wales/g, 'englandwales'); //convert to JSON string
    bankholidaydataengland = JSON.parse(bankholidaydataengland); //convert back to array
    bankHolidayEnglandWales = bankholidaydataengland.englandwales.events;
  }
  const questionInputDate = new Date(year, month, day);

  const bankHolidayResult = checkBankHoliday(questionInputDate, bankHolidayEnglandWales);
  if (bankHolidayResult) {
    isValid = false;
    error = 'You cannot set a date in bank holiday';
  }

  const dayOfWeek = new Date(questionNewDate).getDay();
  if (dayOfWeek === 6 || dayOfWeek === 0) {
    isValid = false;
    error = 'You can not set a date in weekend';
  }
  if (agreement_id == 'RM6263') {
    switch (questionId) {
    case 'Question 1':
      errorSelector = 'rfi_clarification_date_expanded_1';
      break;
    case 'Question 2':
      if (questionNewDate < new Date(timeline.publish)) {
        isValid = false;
        error = 'You can not set a date and time that is earlier than the previous milestone in the timeline';
      }
      if (questionNewDate > new Date(timeline.publishResponsesClarificationQuestions)) {
        isValid = false;
        error = 'You can not set a date and time that is greater than the next milestone in the timeline';
      }
      errorSelector = 'rfi_clarification_date_expanded_2';
      break;
    case 'Question 3':
      if (questionNewDate < new Date(timeline.clarificationPeriodEnd)) {
        isValid = false;
        error = 'You can not set a date and time that is earlier than the previous milestone in the timeline';
      }
      if (questionNewDate > new Date(timeline.supplierSubmitResponse)) {
        isValid = false;
        error = 'You can not set a date and time that is greater than the next milestone in the timeline';
      }
      errorSelector = 'rfi_clarification_date_expanded_3';
      break;
    case 'Question 4':
      if (questionNewDate < new Date(timeline.publishResponsesClarificationQuestions)) {
        isValid = false;
        error = 'You can not set a date and time that is earlier than the previous milestone in the timeline';
      }
      if (questionNewDate > new Date(timeline.confirmNextStepsSuppliers)) {
        isValid = false;
        error = 'You can not set a date and time that is greater than the next milestone in the timeline';
      }
      errorSelector = 'rfi_clarification_date_expanded_4';
      break;
    case 'Question 5':
      if (questionNewDate < new Date(timeline.supplierSubmitResponse)) {
        isValid = false;
        error = 'You can not set a date and time that is earlier than the previous milestone in the timeline';
      }
      if (questionNewDate > new Date(timeline.deadlineForSubmissionOfStageOne)) {
        isValid = false;
        error = 'You can not set a date and time that is greater than the next milestone in the timeline';
      }
      errorSelector = 'rfi_clarification_date_expanded_5';
      break;
    case 'Question 6':
      if (questionNewDate < new Date(timeline.confirmNextStepsSuppliers)) {
        isValid = false;
        error = 'You can not set a date and time that is earlier than the previous milestone in the timeline';
      }
      if (questionNewDate > new Date(timeline.evaluationProcessStartDate)) {
        isValid = false;
        error = 'You can not set a date and time that is greater than the next milestone in the timeline';
      }
      errorSelector = 'rfi_clarification_date_expanded_6';
      break;
    case 'Question 7':
      if (questionNewDate < new Date(timeline.deadlineForSubmissionOfStageOne)) {
        isValid = false;
        error = 'You can not set a date and time that is earlier than the previous milestone in the timeline';
      }
      if (questionNewDate > new Date(timeline.bidderPresentationsDate)) {
        isValid = false;
        error = 'You can not set a date and time that is greater than the next milestone in the timeline';
      }
      errorSelector = 'rfi_clarification_date_expanded_7';
      break;
    case 'Question 8':
      if (questionNewDate < new Date(timeline.evaluationProcessStartDate)) {
        isValid = false;
        error = 'You can not set a date and time that is earlier than the previous milestone in the timeline';
      }
      if (questionNewDate > new Date(timeline.standstillPeriodStartsDate)) {
        isValid = false;
        error = 'You can not set a date and time that is greater than the next milestone in the timeline';
      }
      errorSelector = 'rfi_clarification_date_expanded_8';
      break;
    case 'Question 9':
      if (questionNewDate < new Date(timeline.bidderPresentationsDate)) {
        isValid = false;
        error = 'You can not set a date and time that is earlier than the previous milestone in the timeline';
      }
      if (questionNewDate > new Date(timeline.proposedAwardDate)) {
        isValid = false;
        error = 'You can not set a date and time that is greater than the next milestone in the timeline';
      }
      errorSelector = 'rfi_clarification_date_expanded_9';
      break;
    case 'Question 10':
      if (questionNewDate < new Date(timeline.standstillPeriodStartsDate)) {
        isValid = false;
        error = 'You can not set a date and time that is earlier than the previous milestone in the timeline';
      }
      if (questionNewDate > new Date(timeline.expectedSignatureDate)) {
        isValid = false;
        error = 'You can not set a date and time that is greater than the next milestone in the timeline';
      }
      errorSelector = 'rfi_clarification_date_expanded_10';
      break;
    case 'Question 11':
      if (questionNewDate < new Date(timeline.proposedAwardDate)) {
        isValid = false;
        error = 'You can not set a date and time that is earlier than the previous milestone in the timeline';
      }
      errorSelector = 'rfi_clarification_date_expanded_11';
      break;
    default:
      isValid = true;
    }
  } else {
    switch (questionId) {
    case 'Question 1':
      errorSelector = 'rfi_clarification_date_expanded_1';
      break;
    case 'Question 2':
      if (questionNewDate < new Date(timeline.publish)) {
        isValid = false;
        error = 'You can not set a date and time that is earlier than the previous milestone in the timeline';
      }
      if (questionNewDate > new Date(timeline.publishResponsesClarificationQuestions)) {
        isValid = false;
        error = 'You can not set a date and time that is greater than the next milestone in the timeline';
      }
      errorSelector = 'rfi_clarification_date_expanded_2';
      break;
    case 'Question 3':
      if (questionNewDate < new Date(timeline.clarificationPeriodEnd)) {
        isValid = false;
        error = 'You can not set a date and time that is earlier than the previous milestone in the timeline';
      }
      if (questionNewDate > new Date(timeline.supplierSubmitResponse)) {
        isValid = false;
        error = 'You can not set a date and time that is greater than the next milestone in the timeline';
      }
      errorSelector = 'rfi_clarification_date_expanded_3';
      break;
    case 'Question 4':
      if (questionNewDate < new Date(timeline.publishResponsesClarificationQuestions)) {
        isValid = false;
        error = 'You can not set a date and time that is earlier than the previous milestone in the timeline';
      }
      if (questionNewDate > new Date(timeline.confirmNextStepsSuppliers)) {
        isValid = false;
        error = 'You can not set a date and time that is greater than the next milestone in the timeline';
      }
      errorSelector = 'rfi_clarification_date_expanded_4';
      break;
    case 'Question 5':
      if (questionNewDate < new Date(timeline.supplierSubmitResponse)) {
        isValid = false;
        error = 'You can not set a date and time that is earlier than the previous milestone in the timeline';
      }
      if (questionNewDate > new Date(timeline.deadlineForSubmissionOfStageOne)) {
        isValid = false;
        error = 'You can not set a date and time that is greater than the next milestone in the timeline';
      }
      errorSelector = 'rfi_clarification_date_expanded_5';
      break;

    case 'Question 9':
      if (questionNewDate < new Date(timeline.confirmNextStepsSuppliers)) {
        isValid = false;
        error = 'You can not set a date and time that is earlier than the previous milestone in the timeline';
      }
      if (questionNewDate > new Date(timeline.proposedAwardDate)) {
        isValid = false;
        error = 'You can not set a date and time that is greater than the next milestone in the timeline';
      }
      errorSelector = 'rfi_clarification_date_expanded_9';
      break;
    case 'Question 10':
      if (questionNewDate < new Date(timeline.standstillPeriodStartsDate)) {
        isValid = false;
        error = 'You can not set a date and time that is earlier than the previous milestone in the timeline';
      }
      if (questionNewDate > new Date(timeline.expectedSignatureDate)) {
        isValid = false;
        error = 'You can not set a date and time that is greater than the next milestone in the timeline';
      }
      errorSelector = 'rfi_clarification_date_expanded_10';
      break;
    case 'Question 11':
      if (questionNewDate < new Date(timeline.proposedAwardDate)) {
        isValid = false;
        error = 'You can not set a date and time that is earlier than the previous milestone in the timeline';
      }
      errorSelector = 'rfi_clarification_date_expanded_11';
      break;
    default:
      isValid = true;
    }
  }

  return { isValid, error, errorSelector };
}

function checkBankHoliday(questionInputDate, bankHolidayEnglandWales) {
  let isBankHoliday = false;
  if (bankHolidayEnglandWales.length > 0) {
    const currentyearHolidays = bankHolidayEnglandWales.filter(
      (holiday) => new Date(holiday.date).getFullYear() == questionInputDate.getFullYear()
    );
    currentyearHolidays.forEach((data) => {
      if (questionInputDate.setHours(0, 0, 0, 0) === new Date(data.date).setHours(0, 0, 0, 0)) {
        isBankHoliday = true;
      }
    });
  }
  return isBankHoliday;
}

// @POST "/da/add/response-date"
export const DA_POST_ADD_RESPONSE_DATE = async (req: express.Request, res: express.Response) => {
  const {
    clarification_date_hourFormat,
    selected_question_id,
  } = req.body;
  let {
    clarification_date_day,
    clarification_date_month,
    clarification_date_year,
    clarification_date_hour,
    clarification_date_minute
  } = req.body;
  const { timeline, agreement_id } = req.session;
  clarification_date_day = Number(clarification_date_day);
  clarification_date_month = Number(clarification_date_month);
  clarification_date_year = Number(clarification_date_year);
  clarification_date_hour = Number(clarification_date_hour);

  const basebankURL = '/bank-holidays.json';
  const bankholidaydata = await bankholidayContentAPI.Instance(null).get(basebankURL);

  if (
    clarification_date_day == 0 ||
    isNaN(clarification_date_day) ||
    clarification_date_month == 0 ||
    isNaN(clarification_date_month) ||
    clarification_date_year == 0 ||
    isNaN(clarification_date_year) ||
    clarification_date_hour == 0 ||
    isNaN(clarification_date_hour) ||
    clarification_date_minute == ''
  ) {
    const errorItem = {
      text: 'Date invalid or empty. Plese enter the valid date',
      href: 'clarification_date',
    };
    await RESPONSEDATEHELPER(req, res, true, errorItem);
  } else {
    clarification_date_minute = Number(clarification_date_minute);
    clarification_date_month = clarification_date_month - 1;
    let timeinHoursBased = 0;
    if (clarification_date_hourFormat == 'AM') {
      timeinHoursBased = Number(clarification_date_hour);
    } else {
      timeinHoursBased = Number(clarification_date_hour);
    }
    let date = new Date(
      clarification_date_year,
      clarification_date_month,
      clarification_date_day,
      timeinHoursBased,
      clarification_date_minute
    );
    const nowDate = new Date();
    const { isValid, error, errorSelector } = isValidQuestion(
      selected_question_id,
      clarification_date_day,
      clarification_date_month,
      clarification_date_year,
      clarification_date_hour,
      clarification_date_minute,
      timeinHoursBased,
      timeline,
      agreement_id,
      bankholidaydata
    );
    if (date.getTime() >= nowDate.getTime() && isValid) {
      date = moment(date).format('DD MMMM YYYY, HH:mm');
      req.session.questionID = selected_question_id;

      if (selected_question_id == 'Question 2') {
        req.session.rfppublishdate = timeline.publish;
        req.session.deadlinepublishresponse = timeline.publishResponsesClarificationQuestions;
        req.session.supplierresponse = timeline.supplierSubmitResponse;
        req.session.nextsupplier = timeline.confirmNextStepsSuppliers;
        req.session.deadlinestageone = timeline.deadlineForSubmissionOfStageOne;
        req.session.processstart = timeline.evaluationProcessStartDate;
        req.session.bidder = timeline.bidderPresentationsDate;
        req.session.standstill = timeline.standstillPeriodStartsDate;
        req.session.awarddate = timeline.proposedAwardDate;
        req.session.signaturedate = timeline.expectedSignatureDate;
        req.session.UIDate = date;
      } else if (selected_question_id == 'Question 3') {
        req.session.rfppublishdate = timeline.publish;
        req.session.clarificationend = timeline.clarificationPeriodEnd;
        req.session.supplierresponse = timeline.supplierSubmitResponse;
        req.session.nextsupplier = timeline.confirmNextStepsSuppliers;
        req.session.deadlinestageone = timeline.deadlineForSubmissionOfStageOne;
        req.session.processstart = timeline.evaluationProcessStartDate;
        req.session.bidder = timeline.bidderPresentationsDate;
        req.session.standstill = timeline.standstillPeriodStartsDate;
        req.session.awarddate = timeline.proposedAwardDate;
        req.session.signaturedate = timeline.expectedSignatureDate;
        req.session.UIDate = date;
      } else if (selected_question_id == 'Question 4') {
        req.session.rfppublishdate = timeline.publish;
        req.session.clarificationend = timeline.clarificationPeriodEnd;
        req.session.deadlinepublishresponse = timeline.publishResponsesClarificationQuestions;
        req.session.nextsupplier = timeline.confirmNextStepsSuppliers;
        req.session.deadlinestageone = timeline.deadlineForSubmissionOfStageOne;
        req.session.processstart = timeline.evaluationProcessStartDate;
        req.session.bidder = timeline.bidderPresentationsDate;
        req.session.standstill = timeline.standstillPeriodStartsDate;
        req.session.awarddate = timeline.proposedAwardDate;
        req.session.signaturedate = timeline.expectedSignatureDate;
        req.session.UIDate = date;
      } else if (selected_question_id == 'Question 5') {
        req.session.rfppublishdate = timeline.publish;
        req.session.clarificationend = timeline.clarificationPeriodEnd;
        req.session.deadlinepublishresponse = timeline.publishResponsesClarificationQuestions;
        req.session.supplierresponse = timeline.supplierSubmitResponse;
        req.session.deadlinestageone = timeline.deadlineForSubmissionOfStageOne;
        req.session.processstart = timeline.evaluationProcessStartDate;
        req.session.bidder = timeline.bidderPresentationsDate;
        req.session.standstill = timeline.standstillPeriodStartsDate;
        req.session.awarddate = timeline.proposedAwardDate;
        req.session.signaturedate = timeline.expectedSignatureDate;
        req.session.UIDate = date;
      } else if (selected_question_id == 'Question 6') {
        req.session.rfppublishdate = timeline.publish;
        req.session.clarificationend = timeline.clarificationPeriodEnd;
        req.session.deadlinepublishresponse = timeline.publishResponsesClarificationQuestions;
        req.session.supplierresponse = timeline.supplierSubmitResponse;
        req.session.processstart = timeline.evaluationProcessStartDate;
        req.session.bidder = timeline.bidderPresentationsDate;
        req.session.standstill = timeline.standstillPeriodStartsDate;
        req.session.awarddate = timeline.proposedAwardDate;
        req.session.signaturedate = timeline.expectedSignatureDate;
        req.session.UIDate = date;
      } else if (selected_question_id == 'Question 7') {
        req.session.rfppublishdate = timeline.publish;
        req.session.clarificationend = timeline.clarificationPeriodEnd;
        req.session.deadlinepublishresponse = timeline.publishResponsesClarificationQuestions;
        req.session.supplierresponse = timeline.supplierSubmitResponse;
        req.session.nextsupplier = timeline.confirmNextStepsSuppliers;
        req.session.deadlinestageone = timeline.deadlineForSubmissionOfStageOne;
        req.session.bidder = timeline.bidderPresentationsDate;
        req.session.standstill = timeline.standstillPeriodStartsDate;
        req.session.awarddate = timeline.proposedAwardDate;
        req.session.signaturedate = timeline.expectedSignatureDate;
        req.session.UIDate = date;
      } else if (selected_question_id == 'Question 8') {
        req.session.rfppublishdate = timeline.publish;
        req.session.clarificationend = timeline.clarificationPeriodEnd;
        req.session.deadlinepublishresponse = timeline.publishResponsesClarificationQuestions;
        req.session.supplierresponse = timeline.supplierSubmitResponse;
        req.session.nextsupplier = timeline.confirmNextStepsSuppliers;
        req.session.deadlinestageone = timeline.deadlineForSubmissionOfStageOne;
        req.session.standstill = timeline.evaluationProcessStartDate;
        req.session.awarddate = timeline.proposedAwardDate;
        req.session.signaturedate = timeline.expectedSignatureDate;
        req.session.UIDate = date;
      } else if (selected_question_id == 'Question 9') {
        req.session.rfppublishdate = timeline.publish;
        req.session.clarificationend = timeline.clarificationPeriodEnd;
        req.session.deadlinepublishresponse = timeline.publishResponsesClarificationQuestions;
        req.session.supplierresponse = timeline.supplierSubmitResponse;
        req.session.nextsupplier = timeline.confirmNextStepsSuppliers;
        req.session.deadlinestageone = timeline.deadlineForSubmissionOfStageOne;
        req.session.processstart = timeline.evaluationProcessStartDate;
        req.session.bidder = timeline.bidderPresentationsDate;
        req.session.awarddate = timeline.proposedAwardDate;
        req.session.signaturedate = timeline.expectedSignatureDate;
        req.session.UIDate = date;
      } else if (selected_question_id == 'Question 10') {
        req.session.rfppublishdate = timeline.publish;
        req.session.clarificationend = timeline.clarificationPeriodEnd;
        req.session.deadlinepublishresponse = timeline.publishResponsesClarificationQuestions;
        req.session.supplierresponse = timeline.supplierSubmitResponse;
        req.session.nextsupplier = timeline.confirmNextStepsSuppliers;
        req.session.deadlinestageone = timeline.deadlineForSubmissionOfStageOne;
        req.session.processstart = timeline.evaluationProcessStartDate;
        req.session.bidder = timeline.bidderPresentationsDate;
        req.session.standstill = timeline.standstillPeriodStartsDate;
        req.session.signaturedate = timeline.expectedSignatureDate;
        req.session.UIDate = date;
      } else if (selected_question_id == 'Question 11') {
        req.session.rfppublishdate = timeline.publish;
        req.session.clarificationend = timeline.clarificationPeriodEnd;
        req.session.deadlinepublishresponse = timeline.publishResponsesClarificationQuestions;
        req.session.supplierresponse = timeline.supplierSubmitResponse;
        req.session.nextsupplier = timeline.confirmNextStepsSuppliers;
        req.session.deadlinestageone = timeline.deadlineForSubmissionOfStageOne;
        req.session.processstart = timeline.evaluationProcessStartDate;
        req.session.bidder = timeline.bidderPresentationsDate;
        req.session.standstill = timeline.standstillPeriodStartsDate;
        req.session.awarddate = timeline.proposedAwardDate;
        req.session.UIDate = date;
      }

      const filtervalues = moment(date, 'DD MMMM YYYY, HH:mm:ss ').format('YYYY-MM-DDTHH:mm:ss') + 'Z';

      const answerformater = {
        value: filtervalues,
        selected: true,
        text: selected_question_id,
      };
      const answerBody = {
        nonOCDS: {
          answered: true,
          options: [answerformater],
        },
      };
      const { SESSION_ID } = req.cookies;
      try {
        const proc_id = req.session.projectId;
        const event_id = req.session.eventId;
        const group_id = 'Key Dates';
        const question_id = selected_question_id;

        let baseURL = `/tenders/projects/${proc_id}/events/${event_id}`;
        baseURL = baseURL + '/criteria';
        const fetch_dynamic_api = await TenderApi.Instance(SESSION_ID).get(baseURL);
        const fetch_dynamic_api_data = fetch_dynamic_api?.data;
        const extracted_criterion_based = fetch_dynamic_api_data?.map((criterian) => criterian?.id).sort();
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
        const Criterian_ID = criterianStorage[0].criterianId;
        const id = Criterian_ID;
        const answerBaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups/${group_id}/questions/${question_id}`;

        await TenderApi.Instance(SESSION_ID).put(answerBaseURL, answerBody);
        res.redirect('/da/response-date');
      } catch (error) {
        delete error?.config?.['headers'];
        const Logmessage = {
          Person_id: TokenDecoder.decoder(SESSION_ID),
          error_location: `${req.headers.host}${req.originalUrl}`,
          sessionId: 'null',
          error_reason: 'DA Timeline - Dyanamic framework throws error - Tender Api is causing problem',
          exception: error,
        };
        const Log = new LogMessageFormatter(
          Logmessage.Person_id,
          Logmessage.error_location,
          Logmessage.sessionId,
          Logmessage.error_reason,
          Logmessage.exception
        );
        LoggTracer.errorTracer(Log, res);
      }
    } else {
      const selectedErrorCause = selected_question_id; //Question 2
      let selector = '';
      let selectorID = '';
      if (!isValid) {
        selector = error;
        selectorID = errorSelector;
      } else {
        switch (selectedErrorCause) {
        case 'Question 1':
          selector =
              ' Publish your DA - You can not set a date and time that is earlier than the previous milestone in the timeline';
          selectorID = 'rfi_clarification_date_expanded_1';

          break;
        case 'Question 2':
          selector =
              'Clarification period ends - You can not set a date and time that is earlier than the previous milestone in the timeline';
          selectorID = 'rfi_clarification_date_expanded_2';
          break;
        case 'Question 3':
          selector =
              'Deadline for publishing responses to DA clarification questions- You can not set a date and time that is earlier than the previous milestone in the timeline';
          selectorID = 'rfi_clarification_date_expanded_3';
          break;
        case 'Question 4':
          selector =
              'Deadline for suppliers to submit their DA response - You can not set a date and time that is earlier than the previous milestone in the timeline';
          selectorID = 'rfp_clarification_date_expanded_4';
          break;
        case 'Question 5':
          selector =
              'Confirm your next steps to suppliers - You can not set a date and time that is earlier than the previous milestone in the timeline';
          selectorID = 'rfi_clarification_date_expanded_5';
          break;
        case 'Question 6':
          selector =
              'Confirm your next steps to suppliers - You can not set a date and time that is earlier than the previous milestone in the timeline';
          selectorID = 'rfi_clarification_date_expanded_6';
          break;
        case 'Question 7':
          selector =
              'Confirm your next steps to suppliers - You can not set a date and time that is earlier than the previous milestone in the timeline';
          selectorID = 'rfi_clarification_date_expanded_7';
          break;
        case 'Question 8':
          selector =
              'Confirm your next steps to suppliers - You can not set a date and time that is earlier than the previous milestone in the timeline';
          selectorID = 'rfi_clarification_date_expanded_8';
          break;
        case 'Question 9':
          selector =
              'Confirm your next steps to suppliers - You can not set a date and time that is earlier than the previous milestone in the timeline';
          selectorID = 'rfi_clarification_date_expanded_9';
          break;
        case 'Question 10':
          selector =
              'Confirm your next steps to suppliers - You can not set a date and time that is earlier than the previous milestone in the timeline';
          selectorID = 'rfi_clarification_date_expanded_10';
          break;
        case 'Question 11':
          selector =
              'Confirm your next steps to suppliers - You can not set a date and time that is earlier than the previous milestone in the timeline';
          selectorID = 'rfi_clarification_date_expanded_11';
          break;
        default:
          selector = ' You can not set a date and time that is earlier than the previous milestone in the timeline';
        }
      }
      const errorItem = {
        text: selector,
        href: selectorID,
      };
      await RESPONSEDATEHELPER(req, res, true, errorItem);
    }
  }
};
