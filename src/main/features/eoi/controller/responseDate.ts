//@ts-nocheck
import * as express from 'express';
import * as cmsData from '../../../resources/content/eoi/eoi-response-date.json';
import { TenderApi } from '../../../common/util/fetch/tenderService/tenderApiInstance';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';
import moment from 'moment-business-days';
import { RESPONSEDATEHELPER } from '../../shared/responsedate';
import { HttpStatusCode } from 'main/errors/httpStatusCodes';

///eoi/response-date
export const GET_RESPONSE_DATE = async (req: express.Request, res: express.Response) => {
  let appendData = await RESPONSEDATEHELPER(req, res);
  appendData.data = cmsData;
  res.render('responseDate', appendData);
};

export const POST_RESPONSE_DATE = async (req: express.Request, res: express.Response) => {
  const RequestBodyValues = Object.values(req.body);
  const { supplier_period_for_clarification_period } = req.body;
  req.session['endDate'] = supplier_period_for_clarification_period;
  const filterWithQuestions = RequestBodyValues.map(aQuestions => {
    const anEntry = aQuestions.split('*');
    return { Question: anEntry[0], value: anEntry[1] };
  });
  const proc_id = req.session.projectId;
  const event_id = req.session.eventId;
  const { SESSION_ID } = req.cookies;
  let baseURL = `/tenders/projects/${proc_id}/events/${event_id}`;
  baseURL = baseURL + '/criteria';
  const keyDateselector = 'Key Dates';

  try {
    const fetch_dynamic_api = await TenderApi.Instance(SESSION_ID).get(baseURL);
    const fetch_dynamic_api_data = fetch_dynamic_api?.data;
    const extracted_criterion_based = fetch_dynamic_api_data?.map(criterian => criterian?.id);
    let criterianStorage = [];
    for (const aURI of extracted_criterion_based) {
      const criterian_bas_url = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${aURI}/groups`;
      const fetch_criterian_group_data = await TenderApi.Instance(SESSION_ID).get(criterian_bas_url);
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
    const apiData_baseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${Criterian_ID}/groups/${keyDateselector}/questions`;
    const fetchQuestions = await TenderApi.Instance(SESSION_ID).get(apiData_baseURL);
    const fetchQuestionsData = fetchQuestions.data;
    const allunfilledAnswer = fetchQuestionsData
      .filter(anAswer => anAswer.nonOCDS.options.length == 0)
      .map(aQuestion => aQuestion.OCDS.id);
    for (const answers of allunfilledAnswer) {
      const proc_id = req.session.projectId;
      const event_id = req.session.eventId;
      const id = Criterian_ID;
      const group_id = 'Key Dates';
      const question_id = answers;
      const findFilterQuestion = filterWithQuestions.filter(question => question.Question === question_id);
      const findFilterValues = findFilterQuestion[0].value;
      const answerformater = {
        value: findFilterValues,
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
      'Tenders Service Api cannot be connected',
      true,
    );
  }
};

// @POST "/eoi/add/response-date"
export const POST_ADD_RESPONSE_DATE = async (req: express.Request, res: express.Response) => {
  let {
    clarification_date_day,
    clarification_date_month,
    clarification_date_year,
    clarification_date_hour,
    clarification_date_minute,
    clarification_date_hourFormat,
    selected_question_id,
  } = req.body;

  clarification_date_day = Number(clarification_date_day);
  clarification_date_month = Number(clarification_date_month);
  clarification_date_year = Number(clarification_date_year);
  clarification_date_hour = Number(clarification_date_hour);
  clarification_date_minute = Number(clarification_date_minute);

  clarification_date_month = Number(clarification_date_month) - 1;

  let timeinHoursBased = 0;
  if (clarification_date_hourFormat == 'AM') {
    timeinHoursBased = Number(clarification_date_hour);
  } else {
    timeinHoursBased = Number(clarification_date_hour) + 12;
  }

  let date = new Date(
    clarification_date_year,
    clarification_date_month,
    clarification_date_day,
    timeinHoursBased,
    clarification_date_minute,
  );

  let nowDate = new Date();

  if (date.getTime() >= nowDate.getTime()) {
    date = date.toLocaleDateString('en-uk', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    nowDate = nowDate.toLocaleDateString('en-uk', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const answerformater = {
      value: date,
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
      const id = 'Criterion 2';
      const group_id = 'Key Dates';
      const question_id = selected_question_id;

      const answerBaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups/${group_id}/questions/${question_id}`;
      await TenderApi.Instance(SESSION_ID).put(answerBaseURL, answerBody);
      res.redirect('/eoi/response-date');
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
        Logmessage.exception,
      );
      LoggTracer.errorTracer(Log, res);
    }
  } else {
    const selectedErrorCause = selected_question_id; //Question 2

    let selector = '';
    let selectorID = '';

    switch (selectedErrorCause) {
      case 'Question 1':
        selector = ' Publish your EoI - Date should be in the future';
        selectorID = 'clarification_date';
        break;

      case 'Question 2':
        selector = 'Clarification period ends - Date should be in the future';
        selectorID = 'clarification_period_end';
        break;

      case 'Question 3':
        selector = 'Deadline for publishing responses to EoI clarification questions- Date should be in the future ';
        selectorID = 'deadline_period_for_clarification_period';
        break;

      case 'Question 4':
        selector = 'Deadline for suppliers to submit their EoI response - Date should be in the future';
        selectorID = 'supplier_period_for_clarification_period';
        break;

      case 'Question 5':
        selector = 'Confirm your next steps to suppliers - Date should be in the future';
        selectorID = 'supplier_dealine_for_clarification_period';
        break;

      default:
        selector = ' Date should be in the future';
    }
    const errorItem = {
      text: selector,
      href: selectorID,
    };

    let appendData = await RESPONSEDATEHELPER(req, res, true, errorItem);
    appendData.data = cmsData;
    res.render('response-date', appendData);
  }
};
