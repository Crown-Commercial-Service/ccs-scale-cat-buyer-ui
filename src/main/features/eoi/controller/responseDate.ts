//@ts-nocheck
import * as express from 'express';
import { TenderApi } from '../../../common/util/fetch/tenderService/tenderApiInstance';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';
import { RESPONSEDATEHELPER } from '../helpers/responsedate';
import { HttpStatusCode } from 'main/errors/httpStatusCodes';
import moment from 'moment-business-days';
import { logConstant } from '../../../common/logtracer/logConstant';
import { bankHolidays } from 'main/services/bankHolidays';
import { BankHolidays } from 'main/services/types/bankHolidays/api';

///eoi/response-date
export const GET_RESPONSE_DATE = async (req: express.Request, res: express.Response) => {
  //CAS-INFO-LOG
  LoggTracer.infoLogger(null, logConstant.eoiSetYourTimeLinePageLog, req);

  RESPONSEDATEHELPER(req, res);
};

export const POST_RESPONSE_DATE = async (req: express.Request, res: express.Response) => {
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
  const { projectId } = req.session;
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
    const Criterian_ID = criterianStorage[0].criterianId;
    criterianStorage = criterianStorage.filter((AField) => AField.OCDS.id === keyDateselector);
    const apiData_baseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${Criterian_ID}/groups/${keyDateselector}/questions`;
    const fetchQuestions = await TenderApi.Instance(SESSION_ID).get(apiData_baseURL);
    const fetchQuestionsData = fetchQuestions.data;

    //CAS-INFO-LOG
    LoggTracer.infoLogger(fetchQuestionsData, logConstant.rfiGetTimeLineQuestions, req);

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
      await TenderApi.Instance(SESSION_ID).put(answerBaseURL, answerBody);

      //CAS-INFO-LOG
      LoggTracer.infoLogger(null, logConstant.eoiyourTimeLineUpdate, req);
    }
    const response = await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/23`, 'Completed');
    if (response.status == HttpStatusCode.OK) {
      await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/24`, 'Not started');
    }

    res.redirect('/eoi/review');
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'EOI Timeline - Tenders Service Api cannot be connected',
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
  bankholidaydata: BankHolidays
) {
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

  let bankHolidayEnglandWales;
  if (bankholidaydata) {
    bankHolidayEnglandWales = bankholidaydata['england-and-wales'].events;
  }
  const questionInputDate = new Date(year, month, day);

  const bankHolidayResult = checkBankHoliday(questionInputDate, bankHolidayEnglandWales);
  if (bankHolidayResult) {
    isValid = false;
    error = 'You cannot set a date that falls on a bank holiday';
  }

  const questionNewDate = new Date(year, month, day, timeinHoursBased, minute);

  const dayOfWeek = new Date(questionNewDate).getDay();

  if (dayOfWeek === 6 || dayOfWeek === 0) {
    isValid = false;
    error = 'Enter a date that falls on a weekday';
  }
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
      errorSelector = 'rfi_clarification_date_expanded_5';
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

// @POST "/eoi/add/response-date"
export const POST_ADD_RESPONSE_DATE = async (req: express.Request, res: express.Response) => {
  try {
    const { clarification_date_hourFormat, selected_question_id } = req.body;
    let {
      clarification_date_day,
      clarification_date_month,
      clarification_date_year,
      clarification_date_hour,
      clarification_date_minute,
    } = req.body;

    const { timeline } = req.session;

    clarification_date_day = Number(clarification_date_day);
    clarification_date_month = Number(clarification_date_month);
    clarification_date_year = Number(clarification_date_year);
    clarification_date_hour = Number(clarification_date_hour);
    clarification_date_minute = Number(clarification_date_minute);

    clarification_date_month = clarification_date_month - 1;

    const bankholidaydata = (await bankHolidays.api.getBankHolidays()).unwrap();

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
      bankholidaydata
    );

    if (date.getTime() >= nowDate.getTime() && isValid) {
      date = moment(date).format('DD MMMM YYYY, HH:mm');
      req.session.questionID = selected_question_id;

      if (selected_question_id == 'Question 2') {
        req.session.eoipublishdate = timeline.publish;
        req.session.clarificationend = timeline.clarificationPeriodEnd;
        req.session.deadlinepublishresponse = timeline.publishResponsesClarificationQuestions;
        req.session.supplierresponse = timeline.supplierSubmitResponse;
        req.session.confirmNextStepsSuppliers = timeline.confirmNextStepsSuppliers;
        //req.session.UIDate = date;
      } else if (selected_question_id == 'Question 3') {
        req.session.eoipublishdate = timeline.publish;
        req.session.clarificationend = timeline.clarificationPeriodEnd;
        req.session.deadlinepublishresponse = timeline.publishResponsesClarificationQuestions;
        req.session.supplierresponse = timeline.supplierSubmitResponse;
        req.session.confirmNextStepsSuppliers = timeline.confirmNextStepsSuppliers;
        //req.session.UIDate = date;
      } else if (selected_question_id == 'Question 4') {
        req.session.eoipublishdate = timeline.publish;
        req.session.clarificationend = timeline.clarificationPeriodEnd;
        req.session.deadlinepublishresponse = timeline.publishResponsesClarificationQuestions;
        req.session.supplierresponse = timeline.supplierSubmitResponse;
        req.session.confirmNextStepsSuppliers = timeline.confirmNextStepsSuppliers;
        //req.session.UIDate = date;
      } else if (selected_question_id == 'Question 5') {
        req.session.eoipublishdate = timeline.publish;
        req.session.clarificationend = timeline.clarificationPeriodEnd;
        req.session.deadlinepublishresponse = timeline.publishResponsesClarificationQuestions;
        req.session.supplierresponse = timeline.supplierSubmitResponse;
        req.session.confirmNextStepsSuppliers = timeline.confirmNextStepsSuppliers;
        //req.session.UIDate = date;
      }

      req.session.UIDate = date;

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
        const Criterian_ID = criterianStorage[0].criterianId;
        const id = Criterian_ID;
        const answerBaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups/${group_id}/questions/${question_id}`;
        await TenderApi.Instance(SESSION_ID).put(answerBaseURL, answerBody);

        //CAS-INFO-LOG
        LoggTracer.infoLogger(null, logConstant.eoiyourTimeLineUpdate, req);

        res.redirect('/eoi/response-date');
      } catch (error) {
        LoggTracer.errorLogger(res, error, null, null, null, null, false);
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
              ' Publish your EoI - You can not set a date and time that is earlier than the previous milestone in the timeline';

            selectorID = 'rfi_clarification_date_expanded_1';
            break;

          case 'Question 2':
            selector =
              'Clarification period ends - You can not set a date and time that is earlier than the previous milestone in the timeline';

            selectorID = 'rfi_clarification_date_expanded_2';
            break;

          case 'Question 3':
            selector =
              'Deadline for publishing responses to EoI clarification questions- You can not set a date and time that is earlier than the previous milestone in the timeline';

            selectorID = 'rfi_clarification_date_expanded_3';
            break;

          case 'Question 4':
            selector =
              'Deadline for suppliers to submit their EoI response - You can not set a date and time that is earlier than the previous milestone in the timeline';

            selectorID = 'rfi_clarification_date_expanded_4';
            break;

          case 'Question 5':
            selector =
              'Confirm your next steps to suppliers - You can not set a date and time that is earlier than the previous milestone in the timeline';

            selectorID = 'rfi_clarification_date_expanded_5';
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
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'EOI Timeline - Tender Api - getting users from organization or from tenders failed',
      true
    );
  }
};
