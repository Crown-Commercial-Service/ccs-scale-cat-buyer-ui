//@ts-nocheck
import * as express from 'express';
import { TenderApi } from '../../../common/util/fetch/tenderService/tenderApiInstance';
import { bankholidayContentAPI } from '../../../common/util/fetch/bankholidayservice/bankholidayApiInstance';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';
import { RESPONSEDATEHELPER } from '../helpers/responsedate';
import { HttpStatusCode } from 'main/errors/httpStatusCodes';
import moment from 'moment-business-days';
import { ShouldEventStatusBeUpdated } from '../../shared/ShouldEventStatusBeUpdated';
import { logConstant } from '../../../common/logtracer/logConstant';
import config from 'config';

const momentCssHolidays = async () => {
  const basebankURL = '/bank-holidays.json';
  const bankholidaydata = await bankholidayContentAPI.Instance(null).get(basebankURL);
  let bankholidaydataengland = JSON.stringify(bankholidaydata.data).replace(/england-and-wales/g, 'englandwales'); //convert to JSON string
  bankholidaydataengland = JSON.parse(bankholidaydataengland); //convert back to array
  const bankHolidayEnglandWales = bankholidaydataengland.englandwales.events;
  const holiDaysArr = [];
  for (let h = 0; h < bankHolidayEnglandWales.length; h++) {
    const AsDate = new Date(bankHolidayEnglandWales[h].date);
    holiDaysArr.push(moment(AsDate).format('DD-MM-YYYY'));
  }

  moment.updateLocale('en', {
    holidays: holiDaysArr,
    holidayFormat: 'DD-MM-YYYY'
  });
};

export const RFP_GET_RESPONSE_DATE = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { eventId, stage2_value } = req.session;
  const agreement_id = req.session.agreement_id;


  if (agreement_id == 'RM1043.8') {
    if (stage2_value !== undefined && stage2_value === 'Stage 2') {
      //Stage 2
      const flag = await ShouldEventStatusBeUpdated(eventId, 30, req);
      if (flag) {
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/30`, 'In progress');
      }
    } else {
      const flag = await ShouldEventStatusBeUpdated(eventId, 34, req);
      if (flag) {
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/34`, 'In progress');
      }
    }
  } else {
    const flag = await ShouldEventStatusBeUpdated(eventId, 40, req);
    if (flag) {
      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/40`, 'In progress');
    }
  }
  RESPONSEDATEHELPER(req, res);
};
export const RFP_POST_RESPONSE_DATE = async (req: express.Request, res: express.Response) => {
  const RequestBodyValues = Object.values(req.body);
  const { supplier_period_for_clarification_period } = req.body;
  req.session['endDate'] = supplier_period_for_clarification_period;
  const filterWithQuestions = RequestBodyValues.map((aQuestions) => {
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
      const timeLineRaw = await TenderApi.Instance(SESSION_ID).put(answerBaseURL, answerBody);
      //CAS-INFO-LOG
      LoggTracer.infoLogger(timeLineRaw, logConstant.setYourTimeLineUpdated, req);
    }

    if (agreement_id == 'RM6187') {
      const response = await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/36`, 'Completed');
      if (response.status == HttpStatusCode.OK) {
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/37`, 'Not started');
      }
    } else if (agreement_id == 'RM1557.13') {
      const response = await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/35`, 'Completed');
      if (response.status == HttpStatusCode.OK) {
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/36`, 'Not started');
      }
    } else if (agreement_id == 'RM1043.8') {
      if (stage2_value !== undefined && stage2_value === 'Stage 2') {
        //Stage 2
        const responseData = await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/30`, 'Completed');
        const flag = await ShouldEventStatusBeUpdated(event_id, 34, req);
        if (flag) {
          await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/34`, 'Not started');
        }
      } else {
        const responseData = await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/34`, 'Completed');
        if (responseData.status == HttpStatusCode.OK) {
          await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/35`, 'Not started');
        }
      }
    } else {
      const response = await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/23`, 'Completed');
      if (response.status == HttpStatusCode.OK) {
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/24`, 'Not started');
      }
      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/40`, 'Completed');
      const flag = await ShouldEventStatusBeUpdated(eventId, 41, req);
      if (flag) {
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/41`, 'Not started');
      }
    }
    res.redirect('/rfp/review');
  } catch (error) {
    console.log('************* Errrrr');
    console.log(error);
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
  stage2_value: any,
  bankholidaydata: any,
  selectedOptionList: any
) {
  //const date1 = new Date(year, month, day, timeinHoursBased, minute);
  //let todaydate=new Date();
  let isValid = true,
    isweekendErrorFlag = false,
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
  if (year > 2121) {
    isValid = false;
    error = 'Enter a valid year';
  }
  const questionNewDate = new Date(year, month, day, timeinHoursBased, minute);
  //   const questionNewDate=moment(
  //     questionNewDate12,
  //     'DD MMMM YYYY, HH:mm:ss ',
  //   ).format('YYYY-MM-DDTHH:mm:ss')+'Z';

  // const timeliii=moment(questionNewDate12,'DD MMMM YYYY, HH:mm:ss ',
  // ).format('YYYY-MM-DDTHH:mm:ss')+'Z';
  let bankHolidayEnglandWales;
  //if (agreement_id=='RM1043.8') {
  if (bankholidaydata) {
    let bankholidaydataengland = JSON.stringify(bankholidaydata.data).replace(/england-and-wales/g, 'englandwales'); //convert to JSON string
    bankholidaydataengland = JSON.parse(bankholidaydataengland); //convert back to array
    bankHolidayEnglandWales = bankholidaydataengland.englandwales.events;
  }
  //}
  const questionInputDate = new Date(year, month, day);

  const bankHolidayResult = checkBankHoliday(questionInputDate, bankHolidayEnglandWales);
  if (bankHolidayResult) {
    isValid = false;
    error = 'You cannot set a date in bank holiday';
  }
  const dayOfWeek = new Date(questionNewDate).getDay();

  if (dayOfWeek === 6 || dayOfWeek === 0) {
    isValid = false;
    error = 'You cannot set a date in weekend';
    isweekendErrorFlag = true;
  }

  if (bankHolidayResult) {
    isValid = false;
    error = 'You cannot set a date in bank holiday';
  }

  if (isweekendErrorFlag) {
    isValid = false;
    error = 'You cannot set a date in weekend';
  }

  switch (questionId) {
  case 'Question 1':
    errorSelector = 'rfi_clarification_date_expanded_1';
    break;
  case 'Question 2':
    if (questionNewDate < new Date(timeline.publish)) {
      isValid = false;

      error = 'You cannot set a date and time that is earlier than the previous milestone in the timeline';
    }
    if (questionNewDate > new Date(timeline.publishResponsesClarificationQuestions)) {
      isValid = false;
      error = 'You cannot set a date and time that is greater than the next milestone in the timeline';
    }
    errorSelector = 'rfi_clarification_date_expanded_2';
    break;
  case 'Question 3':
    if (questionNewDate < new Date(timeline.clarificationPeriodEnd)) {
      isValid = false;
      error = 'You cannot set a date and time that is earlier than the previous milestone in the timeline';
    }
    if (questionNewDate > new Date(timeline.supplierSubmitResponse)) {
      isValid = false;
      error = 'You cannot set a date and time that is greater than the next milestone in the timeline';
    }
    errorSelector = 'rfi_clarification_date_expanded_3';
    break;
  case 'Question 4':
    if (questionNewDate < new Date(timeline.publishResponsesClarificationQuestions)) {
      isValid = false;

      error = 'You cannot set a date and time that is earlier than the previous milestone in the timeline';
    }

    //  if (questionNewDate > new Date(timeline.confirmNextStepsSuppliers)) {
    if (questionNewDate > new Date(timeline.deadlineForSubmissionOfStageOne)) {
      isValid = false;
      error = 'You cannot set a date and time that is greater than the next milestone in the timeline';
    }
    errorSelector = 'rfi_clarification_date_expanded_4';
    break;
  case 'Question 5':
    if (questionNewDate < new Date(timeline.supplierSubmitResponse)) {
      isValid = false;
      error = 'You cannot set a date and time that is earlier than the previous milestone in the timeline';
    }
    if (questionNewDate > new Date(timeline.deadlineForSubmissionOfStageOne)) {
      isValid = false;
      error = 'You cannot set a date and time that is greater than the next milestone in the timeline';
    }
    errorSelector = 'rfi_clarification_date_expanded_5';
    break;
  case 'Question 6': {
    let nextDateVal6;
    if (selectedOptionList?.Q7?.selected == false && selectedOptionList?.Q8?.selected == false) {
      nextDateVal6 = timeline.standstillPeriodStartsDate;
    }
    else if (selectedOptionList?.Q7?.selected == false) {
      nextDateVal6 = timeline.bidderPresentationsDate;
    }
    else {
      nextDateVal6 = timeline.evaluationProcessStartDate;
    }

    if (questionNewDate < new Date(timeline.supplierSubmitResponse)) {
      isValid = false;
      error = 'You cannot set a date and time that is earlier than the previous milestone in the timeline';
    }
    if (questionNewDate > new Date(nextDateVal6)) {
      isValid = false;
      error = 'You cannot set a date and time that is greater than the next milestone in the timeline';
    }
    errorSelector = 'rfi_clarification_date_expanded_6';
    break;
  }
  case 'Question 7':

    if (questionNewDate < new Date(timeline.deadlineForSubmissionOfStageOne)) {
      isValid = false;
      error = 'You cannot set a date and time that is earlier than the previous milestone in the timeline';
    }
    if (questionNewDate > new Date(timeline.bidderPresentationsDate)) {
      isValid = false;
      error = 'You cannot set a date and time that is greater than the next milestone in the timeline';
    }
    errorSelector = 'rfi_clarification_date_expanded_7';
    break;
  case 'Question 8': {
    let previousDateVal7;
    if (selectedOptionList?.Q7?.selected == false) {
      previousDateVal7 = timeline.deadlineForSubmissionOfStageOne;
    }
    else {
      previousDateVal7 = timeline.evaluationProcessStartDate;
    }
    if (questionNewDate < new Date(previousDateVal7)) {
      isValid = false;
      error = 'You cannot set a date and time that is earlier than the previous milestone in the timeline';
    }

    if (!(agreement_id == 'RM1043.8' && stage2_value !== undefined && stage2_value === 'Stage 2')) {
      if (questionNewDate > new Date(timeline.standstillPeriodStartsDate)) {
        isValid = false;
        error = 'You cannot set a date and time that is greater than the next milestone in the timeline';
      }
    }

    errorSelector = 'rfi_clarification_date_expanded_8';
    break;
  }
  case 'Question 9': {
    let previousDateVal;
    if (selectedOptionList?.Q8?.selected == false && selectedOptionList?.Q7?.selected == false) {
      previousDateVal = timeline.deadlineForSubmissionOfStageOne;
    }
    else if (selectedOptionList?.Q8?.selected == false) {
      previousDateVal = timeline.evaluationProcessStartDate;
    }
    else {
      previousDateVal = timeline.bidderPresentationsDate;
    }

    if (questionNewDate < new Date(previousDateVal)) {
      isValid = false;
      error = 'You cannot set a date and time that is earlier than the previous milestone in the timeline';
    }
    if (questionNewDate > new Date(timeline.proposedAwardDate)) {
      isValid = false;
      error = 'You cannot set a date and time that is greater than the next milestone in the timeline';
    }
    errorSelector = 'rfi_clarification_date_expanded_9';
    break;
  }
  case 'Question 10':
    if (questionNewDate < new Date(timeline.standstillPeriodStartsDate)) {
      isValid = false;
      error = 'You cannot set a date and time that is earlier than the previous milestone in the timeline';
    }
    if (questionNewDate > new Date(timeline.expectedSignatureDate)) {
      isValid = false;
      error = 'You cannot set a date and time that is greater than the next milestone in the timeline';
    }
    errorSelector = 'rfi_clarification_date_expanded_10';
    break;
  case 'Question 11':
    if (questionNewDate < new Date(timeline.proposedAwardDate)) {
      isValid = false;
      error = 'You cannot set a date and time that is earlier than the previous milestone in the timeline';
    }
    if (agreement_id == 'RM1043.8') {
      //DOS
      if (questionNewDate > new Date(timeline.contractsigneddate)) {
        isValid = false;
        error = 'You cannot set a date and time that is greater than the next milestone in the timeline';
      }
    }
    errorSelector = 'rfi_clarification_date_expanded_11';
    break;

  case 'Question 12':
    if (questionNewDate < new Date(timeline.expectedSignatureDate)) {
      isValid = false;
      error = 'You cannot set a date and time that is earlier than the previous milestone in the timeline';
    }
    if (questionNewDate > new Date(timeline.supplierstartdate)) {
      isValid = false;
      error = 'You cannot set a date and time that is greater than the next milestone in the timeline';
    }
    errorSelector = 'rfi_clarification_date_expanded_12';
    break;

  case 'Question 13':
    if (questionNewDate < new Date(timeline.contractsigneddate)) {
      isValid = false;
      error = 'You cannot set a date and time that is earlier than the previous milestone in the timeline';
    }

    errorSelector = 'rfi_clarification_date_expanded_13';
    break;

  default:
    isValid = true;
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

// @POST "/rfp/add/response-date"
export const RFP_POST_ADD_RESPONSE_DATE = async (req: express.Request, res: express.Response) => {
  const {
    clarification_date_hourFormat,
    selected_question_id,
    selected_question_index,
  } = req.body;
  let {
    clarification_date_day,
    clarification_date_month,
    clarification_date_year,
    clarification_date_hour,
    clarification_date_minute
  } = req.body;

  const { timeline, agreement_id, timlineSession } = req.session;
  const stage2_value = req.session.stage2_value;
  const basebankURL = '/bank-holidays.json';
  const bankholidaydata = await bankholidayContentAPI.Instance(null).get(basebankURL);
  clarification_date_day = Number(clarification_date_day);
  clarification_date_month = Number(clarification_date_month);
  clarification_date_year = Number(clarification_date_year);
  clarification_date_hour = Number(clarification_date_hour);
  // const selected_question_indexte = selected_question_index;
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
    let errorText = '';
    if (
      (clarification_date_day == 0 ||
        isNaN(clarification_date_day) ||
        clarification_date_month == 0 ||
        isNaN(clarification_date_month) ||
        clarification_date_year == 0 ||
        isNaN(clarification_date_year)) &&
      (clarification_date_hour == 0 || isNaN(clarification_date_hour) || clarification_date_minute == '')
    ) {
      errorText = 'Enter a date and time';
    } else if (
      clarification_date_day == 0 ||
      isNaN(clarification_date_day) ||
      clarification_date_month == 0 ||
      isNaN(clarification_date_month) ||
      clarification_date_year == 0 ||
      isNaN(clarification_date_year)
    ) {
      errorText = 'Enter a complete date';
    } else if (clarification_date_hour == 0 || isNaN(clarification_date_hour) || clarification_date_minute == '') {
      errorText = 'Enter a complete time';
    }

    const errorItem = {
      text: errorText,
      href: 'rfp_clarification_date' + selected_question_index,
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
    //add timeline 
    try {
      const { SESSION_ID } = req.cookies;
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
      const apiData_baseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${Criterian_ID}/groups/${group_id}/questions`;
      const fetchQuestions = await TenderApi.Instance(SESSION_ID).get(apiData_baseURL);
      const fetchQuestionsData = fetchQuestions.data;
      const findFilterQuestion = fetchQuestionsData.filter((question) => question.OCDS.id === selected_question_id);
      const findFilterQuestioncheck = fetchQuestionsData.filter((question) => question.nonOCDS.timelineDependency);

      let selectedOptionList = {};
      findFilterQuestioncheck.forEach((data) => {
        const selectedOption = data.nonOCDS.timelineDependency?.nonOCDS?.options;
        const selectedValue = selectedOption.filter((selectVal) => selectVal.value === 'Yes');
        const result = {};

        result['Q' + data.nonOCDS.order] = selectedValue[0];
        selectedOptionList = Object.assign(selectedOptionList, result);
      });
      //add timeline

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
        stage2_value,
        bankholidaydata,
        selectedOptionList
      );

      const dateNewNow = new Date(req.session.timeline.publish);
      if (date.getTime() >= dateNewNow.getTime() && isValid) {
        //date = moment(date).format('DD MMMM YYYY, hh:mm a');
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

          if (agreement_id == 'RM1043.8') {
            //DOS
            req.session.signeddate = timeline.contractsigneddate;
            req.session.startdate = timeline.supplierstartdate;
          }
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
          if (agreement_id == 'RM1043.8') {
            //DOS
            req.session.signeddate = timeline.contractsigneddate;
            req.session.startdate = timeline.supplierstartdate;
          }
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
          if (agreement_id == 'RM1043.8') {
            //DOS
            req.session.signeddate = timeline.contractsigneddate;
            req.session.startdate = timeline.supplierstartdate;
          }
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
          if (agreement_id == 'RM1043.8') {
            //DOS
            req.session.signeddate = timeline.contractsigneddate;
            req.session.startdate = timeline.supplierstartdate;
          }
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
          if (agreement_id == 'RM1043.8') {
            //DOS
            req.session.signeddate = timeline.contractsigneddate;
            req.session.startdate = timeline.supplierstartdate;
          }
          req.session.UIDate = date;
        } else if (selected_question_id == 'Question 7') {
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
          req.session.signaturedate = timeline.expectedSignatureDate;
          if (agreement_id == 'RM1043.8') {
            //DOS
            req.session.signeddate = timeline.contractsigneddate;
            req.session.startdate = timeline.supplierstartdate;
          }
          req.session.UIDate = date;
        } else if (selected_question_id == 'Question 8') {
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
          req.session.signaturedate = timeline.expectedSignatureDate;
          if (agreement_id == 'RM1043.8') {
            //DOS
            req.session.signeddate = timeline.contractsigneddate;
            req.session.startdate = timeline.supplierstartdate;
          }
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
          if (agreement_id == 'RM1043.8') {
            //DOS
            req.session.signeddate = timeline.contractsigneddate;
            req.session.startdate = timeline.supplierstartdate;
          }
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
          if (agreement_id == 'RM1043.8') {
            //DOS
            req.session.signeddate = timeline.contractsigneddate;
            req.session.startdate = timeline.supplierstartdate;
          }
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
          if (agreement_id == 'RM1043.8') {
            //DOS
            req.session.signeddate = timeline.contractsigneddate;
            req.session.startdate = timeline.supplierstartdate;
          }
          req.session.UIDate = date;
        } else if (selected_question_id == 'Question 12') {
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
          req.session.signaturedate = timeline.expectedSignatureDate;
          req.session.startdate = timeline.supplierstartdate;
          req.session.signeddate = timeline.contractsigneddate;

          req.session.UIDate = date;
        } else if (selected_question_id == 'Question 13') {
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
          req.session.signaturedate = timeline.expectedSignatureDate;
          req.session.signeddate = timeline.contractsigneddate;
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


        // try {
        // const proc_id = req.session.projectId;
        // const event_id = req.session.eventId;
        // const group_id = 'Key Dates';
        // const question_id = selected_question_id;
        // let baseURL = `/tenders/projects/${proc_id}/events/${event_id}`;
        // baseURL = baseURL + '/criteria';

        // const fetch_dynamic_api = await TenderApi.Instance(SESSION_ID).get(baseURL);
        // const fetch_dynamic_api_data = fetch_dynamic_api?.data;
        // const extracted_criterion_based = fetch_dynamic_api_data?.map((criterian) => criterian?.id).sort();
        // let criterianStorage = [];
        // for (const aURI of extracted_criterion_based) {
        //   const criterian_bas_url = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${aURI}/groups`;
        //   const fetch_criterian_group_data = await TenderApi.Instance(SESSION_ID).get(criterian_bas_url);
        //   const criterian_array = fetch_criterian_group_data?.data;
        //   const rebased_object_with_requirements = criterian_array?.map((anItem) => {
        //     const object = anItem;
        //     object['criterianId'] = aURI;
        //     return object;
        //   });
        //   criterianStorage.push(rebased_object_with_requirements);
        // }
        // criterianStorage = criterianStorage.flat();
        // const Criterian_ID = criterianStorage[0].criterianId;
        // const id = Criterian_ID;
        const answerBaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups/${group_id}/questions/${question_id}`;
        await TenderApi.Instance(SESSION_ID).put(answerBaseURL, answerBody);
        res.redirect('/rfp/response-date');
        // } catch (error) {
        //   delete error?.config?.['headers'];
        //   const Logmessage = {
        //     Person_id: TokenDecoder.decoder(SESSION_ID),
        //     error_location: `${req.headers.host}${req.originalUrl}`,
        //     sessionId: 'null',
        //     error_reason: 'Dyanamic framework throws error - Tender Api is causing problem',
        //     exception: error,
        //   };
        //   const Log = new LogMessageFormatter(
        //     Logmessage.Person_id,
        //     Logmessage.error_location,
        //     Logmessage.sessionId,
        //     Logmessage.error_reason,
        //     Logmessage.exception
        //   );
        //   LoggTracer.errorTracer(Log, res);
        // }
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
                ' Publish your RFP - You cannot set a date and time that is earlier than the previous milestone in the timeline';
            selectorID = 'rfi_clarification_date_expanded_1';
            break;
          case 'Question 2':
            selector =
                'Clarification period ends - You cannot set a date and time that is earlier than the previous milestone in the timeline';
            selectorID = 'rfi_clarification_date_expanded_2';
            break;
          case 'Question 3':
            selector =
                'Deadline for publishing responses to RFP clarification questions- You cannot set a date and time that is earlier than the previous milestone in the timeline';
            selectorID = 'rfi_clarification_date_expanded_3';
            break;
          case 'Question 4':
            selector =
                'Deadline for suppliers to submit their RFP response - You cannot set a date and time that is earlier than the previous milestone in the timeline';
            selectorID = 'rfi_clarification_date_expanded_4';
            break;
          case 'Question 5':
            selector =
                'Confirm your next steps to suppliers - You cannot set a date and time that is earlier than the previous milestone in the timeline';
            selectorID = 'rfi_clarification_date_expanded_5';
            break;
          case 'Question 6':
            selector =
                'Confirm your next steps to suppliers - You cannot set a date and time that is earlier than the previous milestone in the timeline';
            selectorID = 'rfi_clarification_date_expanded_6';
            break;
          case 'Question 7':
            selector =
                'Confirm your next steps to suppliers - You cannot set a date and time that is earlier than the previous milestone in the timeline';
            selectorID = 'rfi_clarification_date_expanded_7';
            break;
          case 'Question 8':
            selector =
                'Confirm your next steps to suppliers - You cannot set a date and time that is earlier than the previous milestone in the timeline';
            selectorID = 'rfi_clarification_date_expanded_8';
            break;
          case 'Question 9':
            selector =
                'Confirm your next steps to suppliers - You cannot set a date and time that is earlier than the previous milestone in the timeline';
            selectorID = 'rfi_clarification_date_expanded_9';
            break;
          case 'Question 10':
            selector =
                'Confirm your next steps to suppliers - You cannot set a date and time that is earlier than the previous milestone in the timeline';
            selectorID = 'rfi_clarification_date_expanded_10';
            break;
          case 'Question 11':
            selector =
                'Confirm your next steps to suppliers - You cannot set a date and time that is earlier than the previous milestone in the timeline';
            selectorID = 'rfi_clarification_date_expanded_11';
            break;
          case 'Question 12':
            selector =
                'Confirm your next steps to suppliers - You cannot set a date and time that is earlier than the previous milestone in the timeline';
            selectorID = 'rfi_clarification_date_expanded_12';
            break;
          case 'Question 13':
            selector =
                'Confirm your next steps to suppliers - You cannot set a date and time that is earlier than the previous milestone in the timeline';
            selectorID = 'rfi_clarification_date_expanded_13';
            break;
          default:
            selector = ' You cannot set a date and time that is earlier than the previous milestone in the timeline';
          }
        }
        const errorItem = {
          text: selector,
          href: 'rfi_clarification_date_expanded_' + selected_question_index,
        };
        await RESPONSEDATEHELPER(req, res, true, errorItem);
      }
    } catch (error) {
      delete error?.config?.['headers'];
      const Logmessage = {
        Person_id: TokenDecoder.decoder(SESSION_ID),
        error_location: `${req.headers.host}${req.originalUrl}`,
        sessionId: 'null',
        error_reason: 'Dyanamic framework throws error - Tender Api is causing problem',
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
  }

};

// StandstilSupplierPresentation - Start
const MCF3_Days = {
  defaultEndingHour: Number(config.get('predefinedDays.mcf3_fc_defaultEndingHour')),
  defaultEndingMinutes: Number(config.get('predefinedDays.mcf3_fc_defaultEndingMinutes')),
  clarification_days: Number(config.get('predefinedDays.mcf3_fc_clarification_days')),
  clarification_period_end: Number(config.get('predefinedDays.mcf3_fc_clarification_period_end')),
  supplier_period: Number(config.get('predefinedDays.mcf3_fc_supplier_period')),
  supplier_deadline: Number(config.get('predefinedDays.mcf3_fc_supplier_deadline')),
  supplier_period_extra: Number(config.get('predefinedDays.mcf3_fc_supplier_period_extra')),
  supplier_persentation: Number(config.get('predefinedDays.mcf3_fc_supplier_persentation')),
  supplier_award_date: Number(config.get('predefinedDays.mcf3_fc_supplier_award_date')),
  supplier_deadline_extra: Number(config.get('predefinedDays.mcf3_fc_supplier_deadline_extra')),
  stanstill_period_condtional: Number(config.get('predefinedDays.mcf3_fc_stanstillPeriodCondtional'))
};

const DOS_Days = {
  defaultEndingHour: Number(config.get('predefinedDays.dos_defaultEndingHour')),
  defaultEndingMinutes: Number(config.get('predefinedDays.dos_defaultEndingMinutes')),
  clarification_days: Number(config.get('predefinedDays.dos_clarification_days')),
  clarification_period_end: Number(config.get('predefinedDays.dos_clarification_period_end')),
  supplier_period: Number(config.get('predefinedDays.dos_supplier_period')),
  closing_date: Number(config.get('predefinedDays.dos_closing_date')),
  supplier_deadline: Number(config.get('predefinedDays.dos_supplier_deadline')),
  supplier_period_extra: Number(config.get('predefinedDays.dos_supplier_period_extra')),
  supplier_deadline_extra: Number(config.get('predefinedDays.dos_supplier_deadline_extra')),
  stand_stils_date: Number(config.get('predefinedDays.dos_stand_stils_date')),

};
export const TIMELINE_STANDSTILL_SUPPLIERT = async (req: express.Request, res: express.Response) => {
  await momentCssHolidays();

  let resData;
  let apiData;
  const tl_aggrementID = req.body.tl_aggrementID;
  const tl_eventType = req.body.tl_eventType;
  const tl_questionID = req.body.tl_questionID;
  const tl_val = req.body.tl_val;
  req.session.timlineSession = req.body;
  const manipulation = req.body.manipulation;
  const { SESSION_ID } = req.cookies;
  const stage2_value = req.session.stage2_value;
  console.log("stage2_value",stage2_value);

  const proc_id = req.session.projectId;
  const event_id = req.session.eventId;
  const group_id = 'Key Dates';
  const question_id = tl_questionID;
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

  if (tl_aggrementID == 'RM6187' || tl_aggrementID == 'RM1557.13') {

    //console.log("manipulation",manipulation);
    //Q6
    const pre_Q6 = manipulation.Q6.value;
    const Q6 = new Date(pre_Q6);//moment(new Date(pre_Q6), 'DD MMMM YYYY, HH:mm:ss').format('YYYY-MM-DDTHH:mm:ss')+'Z';

    let Q7, Q7_after, Q7_check;
    if (manipulation.Q7.selected) {

      const Q6_Parsed = `${Q6.getDate()}-${Q6.getMonth() + 1
      }-${Q6.getFullYear()}`;
      const Q6_B_add = moment(Q6_Parsed, 'DD-MM-YYYY').businessAdd(MCF3_Days.supplier_persentation)._d;

      Q6_B_add.setHours(MCF3_Days.defaultEndingHour);
      Q6_B_add.setMinutes(MCF3_Days.defaultEndingMinutes);
      Q7 = Q6_B_add;
      Q7_check = Q7;
    } else {
      
      Q7 = Q6;
      Q7_check = undefined;
    }

    let Q8, Q8_after, Q8_check;
    if (manipulation.Q8.selected) {

      const Q7_Parsed = `${Q7.getDate()}-${Q7.getMonth() + 1
      }-${Q7.getFullYear()}`;
      const Q7_B_add = moment(Q7_Parsed, 'DD-MM-YYYY').businessAdd(MCF3_Days.stanstill_period_condtional)._d;

      Q7_B_add.setHours(MCF3_Days.defaultEndingHour);
      Q7_B_add.setMinutes(MCF3_Days.defaultEndingMinutes);
      Q8 = Q7_B_add;
      Q8_check = Q8;
    } else {
      Q8 = Q7;
      Q8_check = undefined;
    }

    const Q9_Parsed = `${Q8.getDate()}-${Q8.getMonth() + 1
    }-${Q8.getFullYear()}`;
    const Q9_B_add = moment(Q9_Parsed, 'DD-MM-YYYY').businessAdd(MCF3_Days.supplier_award_date)._d;
    Q9_B_add.setHours(MCF3_Days.defaultEndingHour);
    Q9_B_add.setMinutes(MCF3_Days.defaultEndingMinutes);
    const Q9 = Q9_B_add;

    const Q10_Parsed = `${Q9.getDate()}-${Q9.getMonth() + 1
    }-${Q9.getFullYear()}`;
    const Q10_B_add = moment(Q10_Parsed, 'DD-MM-YYYY').businessAdd(MCF3_Days.supplier_award_date)._d;
    Q10_B_add.setHours(MCF3_Days.defaultEndingHour);
    Q10_B_add.setMinutes(MCF3_Days.defaultEndingMinutes);
    const Q10 = Q10_B_add;



    const Q11_Parsed = `${Q10.getDate()}-${Q10.getMonth() + 1
    }-${Q10.getFullYear()}`;
    const Q11_B_add = moment(Q11_Parsed, 'DD-MM-YYYY').businessAdd(MCF3_Days.supplier_persentation)._d;
    Q11_B_add.setHours(MCF3_Days.defaultEndingHour);
    Q11_B_add.setMinutes(MCF3_Days.defaultEndingMinutes);
    const Q11 = Q11_B_add;

    //JSON Response Start
    if (Q7_check != undefined) {
      Q7_after = moment(Q7, 'YYYY-MM-DDTHH:mm:ss').format('DD MMMM YYYY, HH:mm');
    } else {
      Q7_after = '';
    }

    if (Q8_check != undefined) {
      Q8_after = moment(Q8, 'YYYY-MM-DDTHH:mm:ss').format('DD MMMM YYYY, HH:mm');
    } else {
      Q8_after = '';
    }
    const Q9_after = moment(Q9, 'YYYY-MM-DDTHH:mm:ss').format('DD MMMM YYYY, HH:mm');
    const Q10_after = moment(Q10, 'YYYY-MM-DDTHH:mm:ss').format('DD MMMM YYYY, HH:mm');
    const Q11_after = moment(Q11, 'YYYY-MM-DDTHH:mm:ss').format('DD MMMM YYYY, HH:mm');
    //JSON Response End

    // console.log(moment(Q6, 'YYYY-MM-DDTHH:mm:ss').format('DD MMMM YYYY, HH:mm'));
    resData = [
      { question: 'Q7', value: `Question 7*${Q7_after}`, order: 1, input_hidden: 'timedate7', label: 'clarification_7' },
      { question: 'Q8', value: `Question 8*${Q8_after}`, order: 2, input_hidden: 'timedate8', label: 'clarification_8' },
      { question: 'Q9', value: `Question 9*${Q9_after}`, order: 3, input_hidden: 'timedate9', label: 'clarification_9' },
      { question: 'Q10', value: `Question 10*${Q10_after}`, order: 4, input_hidden: 'timedate10', label: 'clarification_10' },
      { question: 'Q11', value: `Question 11*${Q11_after}`, order: 5, input_hidden: 'timedate11', label: 'clarification_11' },
    ];


    req.session.timeline.evaluationProcessStartDate = Q7_after;
    req.session.timeline.bidderPresentationsDate = Q8_after;
    req.session.timeline.standstillPeriodStartsDate = Q9_after;
    req.session.timeline.proposedAwardDate = Q10_after;
    req.session.timeline.expectedSignatureDate = Q11_after;


    apiData = {
      7: { question: 'Q7', value: `${Q7_after}`, order: 1, qusId: 7, config: manipulation.Q7.config },
      8: { question: 'Q8', value: `${Q8_after}`, order: 2, qusId: 8, config: manipulation.Q8.config },
      9: { question: 'Q9', value: `${Q9_after}`, order: 3, qusId: 9 },
      10: { question: 'Q10', value: `${Q10_after}`, order: 4, qusId: 10 },
      11: { question: 'Q11', value: `${Q11_after}`, order: 5, qusId: 11 },
    };



  } else {
    //DOS
    const manipulation = req.body.manipulation;
  console.log("stage2_value",stage2_value);
    if(stage2_value=="Stage 2"){
      console.log("stage2222")
      const pre_Q2 = manipulation.Q2.value;

      
      const DOS_Days = {
        defaultEndingHour: Number(config.get('predefinedDays.dos_defaultEndingHour')),
        defaultEndingMinutes: Number(config.get('predefinedDays.dos_defaultEndingMinutes')),
        clarification_days: Number(config.get('predefinedDays.dos_clarification_days')),
        clarification_period_end: Number(config.get('predefinedDays.dos_clarification_period_end')),
        supplier_period: Number(config.get('predefinedDays.dos_supplier_period')),
        closing_date: Number(config.get('predefinedDays.dos_closing_date')),
        supplier_deadline: Number(config.get('predefinedDays.dos_supplier_deadline')),
        supplier_period_extra: Number(config.get('predefinedDays.dos_supplier_period_extra')),
        supplier_deadline_extra: Number(config.get('predefinedDays.dos_supplier_deadline_extra')),
        stand_stils_date: Number(config.get('predefinedDays.dos_stand_stils_date')),
      
      };

      const Q2 = new Date(pre_Q2);//moment(new Date(pre_Q6), 'DD MMMM YYYY, HH:mm:ss').format('YYYY-MM-DDTHH:mm:ss')+'Z';
      console.log("Q3",DOS_Days.clarification_period_end,Q2);

      let Q3, Q3_after, Q3_check;
      if (manipulation.Q3.selected) {
        const Q2_Parsed = `${Q2.getDate()}-${Q2.getMonth() + 1
        }-${Q2.getFullYear()}`;
        const Q2_B_add = moment(Q2_Parsed, 'DD-MM-YYYY').businessAdd(DOS_Days.supplier_deadline)._d;
  
        Q2_B_add.setHours(DOS_Days.defaultEndingHour);
        Q2_B_add.setMinutes(DOS_Days.defaultEndingMinutes);
        Q3 = Q2_B_add;
        Q3_check = Q3;
      } else {
        Q3 = Q2;
        Q3_check = undefined;
      }
      
      console.log("Q4",DOS_Days.supplier_period);
       //Q4
    const Q4_Parsed = `${Q3.getDate()}-${Q3.getMonth() + 1
    }-${Q3.getFullYear()}`;
    const Q4_B_add = moment(Q4_Parsed, 'DD-MM-YYYY').businessAdd(DOS_Days.supplier_period)._d;
    Q4_B_add.setHours(DOS_Days.defaultEndingHour);
    Q4_B_add.setMinutes(DOS_Days.defaultEndingMinutes);
    const Q4 = Q4_B_add;
   
    console.log("Q5",DOS_Days.supplier_deadline);
    let Q5, Q5_after, Q5_check;
    if (manipulation.Q5.selected) {
      const Q4_Parsed = `${Q4.getDate()}-${Q4.getMonth() + 1
      }-${Q4.getFullYear()}`;
      const Q4_B_add = moment(Q4_Parsed, 'DD-MM-YYYY').businessAdd(DOS_Days.supplier_deadline)._d;

      Q4_B_add.setHours(DOS_Days.defaultEndingHour);
      Q4_B_add.setMinutes(DOS_Days.defaultEndingMinutes);
      Q5 = Q4_B_add;
      Q5_check = Q5;
    } else {
      Q5 = Q4;
      Q5_check = undefined;
    }

    console.log("Q6",DOS_Days.supplier_period_extra);
      //Q6
      const Q6_Parsed = `${Q5.getDate()}-${Q5.getMonth() + 1
      }-${Q5.getFullYear()}`;
      const Q6_B_add = moment(Q6_Parsed, 'DD-MM-YYYY').businessAdd(DOS_Days.supplier_period_extra)._d;
      Q6_B_add.setHours(DOS_Days.defaultEndingHour);
      Q6_B_add.setMinutes(DOS_Days.defaultEndingMinutes);
      const Q6 = Q6_B_add;

      console.log("Q7",DOS_Days.closing_date);
       //Q7
       const Q7_Parsed = `${Q6.getDate()}-${Q6.getMonth() + 1
       }-${Q6.getFullYear()}`;
       const Q7_B_add = moment(Q7_Parsed, 'DD-MM-YYYY').businessAdd(DOS_Days.closing_date)._d;
       Q7_B_add.setHours(DOS_Days.defaultEndingHour);
       Q7_B_add.setMinutes(DOS_Days.defaultEndingMinutes);
       const Q7 = Q7_B_add;
       
       console.log("Q8",DOS_Days.supplier_deadline);
         //Q8
         const Q8_Parsed = `${Q7.getDate()}-${Q7.getMonth() + 1
         }-${Q7.getFullYear()}`;
         const Q8_B_add = moment(Q8_Parsed, 'DD-MM-YYYY').businessAdd(DOS_Days.supplier_deadline)._d;
         Q8_B_add.setHours(DOS_Days.defaultEndingHour);
         Q8_B_add.setMinutes(DOS_Days.defaultEndingMinutes);
         const Q8 = Q8_B_add;

         if (Q3_check != undefined) {
          Q3_after = moment(Q3, 'YYYY-MM-DDTHH:mm:ss').format('DD MMMM YYYY, HH:mm');
        } else {
          Q3_after = '';
        }
    
    
        if (Q5_check != undefined) {
          Q5_after = moment(Q5, 'YYYY-MM-DDTHH:mm:ss').format('DD MMMM YYYY, HH:mm');
        } else {
          Q5_after = '';
        }

        const Q4_after = moment(Q4, 'YYYY-MM-DDTHH:mm:ss').format('DD MMMM YYYY, HH:mm');
        // Q10_after = moment(Q10, 'YYYY-MM-DDTHH:mm:ss').format('DD MMMM YYYY, HH:mm');
        const Q6_after = moment(Q6, 'YYYY-MM-DDTHH:mm:ss').format('DD MMMM YYYY, HH:mm');
        const Q7_after = moment(Q7, 'YYYY-MM-DDTHH:mm:ss').format('DD MMMM YYYY, HH:mm');
        const Q8_after = moment(Q8, 'YYYY-MM-DDTHH:mm:ss').format('DD MMMM YYYY, HH:mm');

        resData = [
          //{question: 'Q7', value: `Question 7*${Q7_after}`, order: 1,input_hidden:'timedate7',label:'clarification_7'},
          { question: 'Q3', value: `Question 3*${Q3_after}`, order: 2, input_hidden: 'timedate3', label: 'clarification_3' },
          { question: 'Q4', value: `Question 4*${Q4_after}`, order: 3, input_hidden: 'timedate4', label: 'clarification_4' },
          { question: 'Q5', value: `Question 5*${Q5_after}`, order: 4, input_hidden: 'timedate5', label: 'clarification_5' },
          { question: 'Q6', value: `Question 6*${Q6_after}`, order: 5, input_hidden: 'timedate6', label: 'clarification_6' },
          { question: 'Q7', value: `Question 7*${Q7_after}`, order: 6, input_hidden: 'timedate7', label: 'clarification_7' },
          { question: 'Q8', value: `Question 8*${Q8_after}`, order: 7, input_hidden: 'timedate8', label: 'clarification_8' },
    
        ];

        console.log("resData",resData);
        
        apiData = {
          3: { question: 'Q3', value: `${Q3_after}`, order: 1, qusId: 3, config: manipulation.Q3.config },
          4: { question: 'Q4', value: `${Q4_after}`, order: 2, qusId: 4 },
          5: { question: 'Q5', value: `${Q5_after}`, order: 3, qusId: 5, config: manipulation.Q5.config },
          6: { question: 'Q6', value: `${Q6_after}`, order: 4, qusId: 6 },
          7: { question: 'Q7', value: `${Q7_after}`, order: 5, qusId: 7 },
          8: { question: 'Q8', value: `${Q8_after}`, order: 6, qusId: 8 },
        };

    }else{

      console.log("stage11")
    //Q7

    const pre_Q7 = manipulation.Q7.value;

    const Q7 = new Date(pre_Q7);//moment(new Date(pre_Q6), 'DD MMMM YYYY, HH:mm:ss').format('YYYY-MM-DDTHH:mm:ss')+'Z';

    let Q8, Q8_after, Q8_check;

    if (manipulation.Q8.selected) {
      const Q7_Parsed = `${Q7.getDate()}-${Q7.getMonth() + 1
      }-${Q7.getFullYear()}`;
      const Q7_B_add = moment(Q7_Parsed, 'DD-MM-YYYY').businessAdd(DOS_Days.supplier_deadline)._d;

      Q7_B_add.setHours(DOS_Days.defaultEndingHour);
      Q7_B_add.setMinutes(DOS_Days.defaultEndingMinutes);
      Q8 = Q7_B_add;
      Q8_check = Q8;
    } else {
      Q8 = Q7;
      Q8_check = undefined;
    }

    //Q9
    const Q9_Parsed = `${Q8.getDate()}-${Q8.getMonth() + 1
    }-${Q8.getFullYear()}`;
    const Q9_B_add = moment(Q9_Parsed, 'DD-MM-YYYY').businessAdd(DOS_Days.clarification_period_end)._d;
    Q9_B_add.setHours(DOS_Days.defaultEndingHour);
    Q9_B_add.setMinutes(DOS_Days.defaultEndingMinutes);
    const Q9 = Q9_B_add;
    
    let Q10, Q10_after, Q10_check;
    if (manipulation.Q10.selected) {
      const Q9_Parsed = `${Q9.getDate()}-${Q9.getMonth() + 1
      }-${Q9.getFullYear()}`;
      const Q9_B_add = moment(Q9_Parsed, 'DD-MM-YYYY').businessAdd(DOS_Days.stand_stils_date)._d;

      Q9_B_add.setHours(DOS_Days.defaultEndingHour);
      Q9_B_add.setMinutes(DOS_Days.defaultEndingMinutes);
      Q10 = Q9_B_add;
      Q10_check = Q10;
    } else {
      Q10 = Q9;
      Q10_check = undefined;
    }

    //Q11
    const Q11_Parsed = `${Q10.getDate()}-${Q10.getMonth() + 1
    }-${Q10.getFullYear()}`;
    const Q11_B_add = moment(Q11_Parsed, 'DD-MM-YYYY').businessAdd(DOS_Days.closing_date)._d;
    Q11_B_add.setHours(DOS_Days.defaultEndingHour);
    Q11_B_add.setMinutes(DOS_Days.defaultEndingMinutes);
    const Q11 = Q11_B_add;

    //Q12
    const Q12_Parsed = `${Q11.getDate()}-${Q11.getMonth() + 1
    }-${Q11.getFullYear()}`;
    const Q12_B_add = moment(Q12_Parsed, 'DD-MM-YYYY').businessAdd(DOS_Days.closing_date)._d;
    Q12_B_add.setHours(DOS_Days.defaultEndingHour);
    Q12_B_add.setMinutes(DOS_Days.defaultEndingMinutes);
    const Q12 = Q12_B_add;

    //Q13
    const Q13_Parsed = `${Q12.getDate()}-${Q12.getMonth() + 1
    }-${Q12.getFullYear()}`;
    const Q13_B_add = moment(Q13_Parsed, 'DD-MM-YYYY').businessAdd(DOS_Days.supplier_deadline)._d;
    Q13_B_add.setHours(DOS_Days.defaultEndingHour);
    Q13_B_add.setMinutes(DOS_Days.defaultEndingMinutes);
    const Q13 = Q13_B_add;



    if (Q8_check != undefined) {
      Q8_after = moment(Q8, 'YYYY-MM-DDTHH:mm:ss').format('DD MMMM YYYY, HH:mm');
    } else {
      Q8_after = '';
    }


    if (Q10_check != undefined) {
      Q10_after = moment(Q10, 'YYYY-MM-DDTHH:mm:ss').format('DD MMMM YYYY, HH:mm');
    } else {
      Q10_after = '';
    }

    const Q9_after = moment(Q9, 'YYYY-MM-DDTHH:mm:ss').format('DD MMMM YYYY, HH:mm');
    // Q10_after = moment(Q10, 'YYYY-MM-DDTHH:mm:ss').format('DD MMMM YYYY, HH:mm');
    const Q11_after = moment(Q11, 'YYYY-MM-DDTHH:mm:ss').format('DD MMMM YYYY, HH:mm');
    const Q12_after = moment(Q12, 'YYYY-MM-DDTHH:mm:ss').format('DD MMMM YYYY, HH:mm');
    const Q13_after = moment(Q13, 'YYYY-MM-DDTHH:mm:ss').format('DD MMMM YYYY, HH:mm');


    req.session.timeline.bidderPresentationsDate = Q8_after;
    req.session.timeline.standstillPeriodStartsDate = Q9_after;
    req.session.timeline.proposedAwardDate = Q10_after;
    req.session.timeline.expectedSignatureDate = Q11_after;
    req.session.timeline.contractsigneddate = Q12_after;
    req.session.timeline.supplierstartdate = Q13_after;

    // console.log(moment(Q6, 'YYYY-MM-DDTHH:mm:ss').format('DD MMMM YYYY, HH:mm'));
    resData = [
      //{question: 'Q7', value: `Question 7*${Q7_after}`, order: 1,input_hidden:'timedate7',label:'clarification_7'},
      { question: 'Q8', value: `Question 8*${Q8_after}`, order: 2, input_hidden: 'timedate8', label: 'clarification_8' },
      { question: 'Q9', value: `Question 9*${Q9_after}`, order: 3, input_hidden: 'timedate9', label: 'clarification_9' },
      { question: 'Q10', value: `Question 10*${Q10_after}`, order: 4, input_hidden: 'timedate10', label: 'clarification_10' },
      { question: 'Q11', value: `Question 11*${Q11_after}`, order: 5, input_hidden: 'timedate11', label: 'clarification_11' },
      { question: 'Q12', value: `Question 12*${Q12_after}`, order: 6, input_hidden: 'timedate12', label: 'clarification_12' },
      { question: 'Q13', value: `Question 13*${Q13_after}`, order: 7, input_hidden: 'timedate13', label: 'clarification_13' },

    ];

    apiData = {
      8: { question: 'Q8', value: `${Q8_after}`, order: 1, qusId: 8, config: manipulation.Q8.config },
      9: { question: 'Q9', value: `${Q9_after}`, order: 2, qusId: 9 },
      10: { question: 'Q10', value: `${Q10_after}`, order: 3, qusId: 10, config: manipulation.Q10.config },
      11: { question: 'Q11', value: `${Q11_after}`, order: 4, qusId: 11 },
      12: { question: 'Q12', value: `${Q12_after}`, order: 5, qusId: 12 },
      13: { question: 'Q13', value: `${Q13_after}`, order: 6, qusId: 13 },
    };
  }

  }


  const keyDateselector = 'Key Dates';
  criterianStorage = criterianStorage.flat();
  criterianStorage = criterianStorage.filter((AField) => AField.OCDS.id === keyDateselector);
  const Criterian_ID = criterianStorage[0].criterianId;
  const apiData_baseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${Criterian_ID}/groups/${keyDateselector}/questions`;
  //console.log("apiData_baseURL",apiData_baseURL)
  const fetchQuestionsQus = await TenderApi.Instance(SESSION_ID).get(apiData_baseURL);
  const fetchQuestionsQusData = fetchQuestionsQus.data;
  for (const answersQus of fetchQuestionsQusData) {
    //    console.log("IDD",answersQus.OCDS.id);
    const proc_id = req.session.projectId;
    const event_id = req.session.eventId;
    const id = Criterian_ID;
    const group_id = 'Key Dates';
    const question_id = answersQus.OCDS.id;

    const qusD = question_id.replace('Question ', '');
    const manipulationData = apiData[qusD];

    if (manipulationData != undefined) {
      const answerBaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups/${group_id}/questions/${question_id}`;
      let filtervalues = '';
      if (manipulationData.value != '') {
        const findFilterQuestionValue = new Date(manipulationData.value);
        const findFilterValues = findFilterQuestionValue;
        filtervalues = moment(findFilterValues, 'DD MMMM YYYY, HH:mm:ss ').format('YYYY-MM-DDTHH:mm:ss') + 'Z';

      }

      const answerformater = {
        value: filtervalues,
        selected: true,
        text: question_id,
      };
      let answerBody;
      if (manipulationData.config) {


        if (manipulationData.config != '') {

          let noCheck = false;
          let yesCheck = false;

          if (manipulationData.config == 'yes') {
            yesCheck = true;
          }

          if (manipulationData.config == 'no') {
            noCheck = true;
          }

          const radionArrayOption = [
            {
              value: 'Yes',
              selected: yesCheck,
            },
            {
              value: 'No',
              selected: noCheck,
            }
          ];

          answerBody = {
            nonOCDS: {
              answered: true,
              options: [answerformater],
              timelineDependency: {
                nonOCDS: {
                  answered: true,
                  options: radionArrayOption,
                }
              }
            },
          };
          const answerBaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups/${group_id}/questions/${question_id}`;
          console.log("answerBaseURL",answerBaseURL);
          console.log("answerBody",JSON.stringify(answerBody));
          //await TenderApi.Instance(SESSION_ID).put(answerBaseURL, answerBody);
        }

      } else {
        if (manipulationData.config != '') {
          answerBody = {
            nonOCDS: {
              answered: true,
              options: [answerformater],
            },
          };

          const answerBaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups/${group_id}/questions/${question_id}`;
          console.log("answerBaseURLELSE",answerBaseURL);
          console.log("answerBodyElse",JSON.stringify(answerBody));
          //await TenderApi.Instance(SESSION_ID).put(answerBaseURL, answerBody);
        }
      }
    }
  }


  res.json(resData);
};
// StandstilSupplierPresentation - End
