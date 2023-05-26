//@ts-nocheck
import * as express from 'express';
import { LoggTracer } from '@common/logtracer/tracer';
import { TokenDecoder } from '@common/tokendecoder/tokendecoder';
import * as localTableData from '../../../resources/content/event-management/local-QAEditClerificationQuestion.json'; // Replace this with API endpoint
import * as dos6LocalTableData from '../../../resources/content/event-management/local-QAEditClerificationQuestionDos6.json';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import { QuestionAndAnswer } from '../model/qaModel';
import { MessageDetails } from '../model/messgeDetails';
import { logConstant } from '../../../common/logtracer/logConstant';

export class ValidationErrors {
  static readonly Clarification_REQUIRED: string = 'Enter a clarification';
  static readonly Question_REQUIRED: string = 'Enter a question';
  static readonly Clarification_REQUIRED_count: string = 'Please enter <=5000 characters';
  static readonly Question_REQUIRED_count: string = 'Please enter <=5000 characters';
}
/**
 *
 * @Rediect
 * @endpoint /QA/add
 * @param req
 * @param res
 */
//GET QA
export const EVENT_MANAGEMENT_GET_QA_Edit = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { id, qaid } = req.query;
  const projectId = req.session['projectId'];
  const eventId = req.session['eventId'];
  const agreementId = req.session.agreement_id;
  req.session['qaid'] = qaid;
  req.session['messageID'] = req.query;
  try {
    res.locals.agreement_header = req.session.agreement_header;
    const QaContent: QuestionAndAnswer = {
      IsquestionNotDefined: false,
      IsclarificationNotDefined: false,
      questionErrorMessage: ValidationErrors.Question_REQUIRED,
      clarificationErrorMessage: ValidationErrors.Clarification_REQUIRED,
    };
    const messageDetails = await getMessageDetails(id.toString(), projectId, eventId, SESSION_ID);
    const qsDetails = await getQADetails(qaid.toString(), projectId, eventId, SESSION_ID);

    let data;
    if (agreementId == 'RM1043.8') {
      //DOS6
      data = dos6LocalTableData;
    } else {
      data = localTableData;
    }

    const appendData = {
      data,
      QA: qsDetails,
      message: messageDetails,
      QaContent: QaContent,
      validationError: false,
      eventId: req.session['eventId'],
      eventType: req.session.eventManagement_eventType,
      agreementId,
    };

    //CAS-INFO-LOG
    LoggTracer.infoLogger(null, logConstant.QAEditLogger, req);

    res.render('QAEdit', appendData);
  } catch (err) {
    LoggTracer.errorLogger(
      res,
      err,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Event management page message details QA Add clerification question',
      true
    );
  }
};

//POST QA
export const EVENT_MANAGEMENT_POST_QA_Edit = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { id } = req.session['messageID'];
  const projectId = req.session['projectId'];
  const eventId = req.session['eventId'];
  const agreementId = req.session.agreement_id;
  res.locals.agreement_header = req.session.agreement_header;
  try {
    const _body = req.body;
    let IsQuestionNotDefined,
      Question_count,
      clarification_count,
      IsClerificationNotDefined,
      validationError = false;
    const errorText = [];
    if (!_body.message_QA_Edit_Question_input) {
      IsQuestionNotDefined = true;
      validationError = true;
      errorText.push({
        text: ValidationErrors.Question_REQUIRED,
        href: '#message_QA_Edit_Question_input',
      });
    } else {
      IsQuestionNotDefined = false;
    }

    if (!_body.message_QA_Edit_Answer_input) {
      IsClerificationNotDefined = true;
      validationError = true;
      errorText.push({
        text: ValidationErrors.Clarification_REQUIRED,
        href: '#message_QA_Edit_Answer_input',
      });
    } else {
      IsClerificationNotDefined = false;
    }
    if (_body.message_QA_Edit_Question_input.length > 5000) {
      Question_count = true;
      validationError = true;
      errorText.push({
        text: ValidationErrors.Question_REQUIRED_count,
        href: '#message_QA_Edit_Question_input',
      });
    } else {
      Question_count = false;
    }

    if (_body.message_QA_Edit_Answer_input.length > 5000) {
      clarification_count = true;
      validationError = true;
      errorText.push({
        text: ValidationErrors.Clarification_REQUIRED_count,
        href: '#message_QA_Edit_Answer_input',
      });
    } else {
      clarification_count = false;
    }
    if (
      errorText.length > 0 &&
      (IsClerificationNotDefined || IsQuestionNotDefined || clarification_count || Question_count)
    ) {
      const QaContent: QuestionAndAnswer = {
        IsquestionNotDefined: IsQuestionNotDefined,
        IsclarificationNotDefined: IsClerificationNotDefined,
        questionErrorMessage: ValidationErrors.Question_REQUIRED,
        clarificationErrorMessage: ValidationErrors.Clarification_REQUIRED,
        Question_count: Question_count,
        clarification_count: clarification_count,
        questionErrorMessage_count: ValidationErrors.Question_REQUIRED_count,
        clarificationErrorMessage_count: ValidationErrors.Clarification_REQUIRED_count,
      };
      const QA: QuestionAndAnswer = {
        question: _body.message_QA_Edit_Question_input,
        answer: _body.message_QA_Edit_Answer_input,
      };

      const messageDetails = await getMessageDetails(id.toString(), projectId, eventId, SESSION_ID);
      const appendData = {
        data: localTableData,
        message: messageDetails,
        QA: QA,
        QaContent: QaContent,
        validationError: validationError,
        errorText: errorText,
        eventId: req.session['eventId'],
        eventType: req.session.eventManagement_eventType,
        agreementId,
      };

      //CAS-INFO-LOG
      LoggTracer.infoLogger(null, logConstant.QAEditLogger, req);
      res.render('QAEdit', appendData);
    } else {
      const _requestBody = {
        question: _body.message_QA_Edit_Question_input,
        answer: _body.message_QA_Edit_Answer_input,
      };

      const baseURL = `/tenders/projects/${projectId}/events/${eventId}/q-and-a/${req.session['qaid']}`;
      const response = await TenderApi.Instance(SESSION_ID).put(baseURL, _requestBody);
      //CAS-INFO-LOG
      LoggTracer.infoLogger(response, logConstant.saveQuestionAndAnsDetails, req);

      const host = req.get('host');
      const urlMain = 'https://' + req.get('host') + '/event/qa?id=' + eventId + '&prId=' + projectId;

      const textContent =
        'The questions and answers for this project have been updated. You can access this, and any future updates, using the following link:\n\n' +
        urlMain +
        '\n\nIf you are already authenticated, you will be able to see this page. If not, you will need to authenticate through the Public Procurement Gateway before being able to access the page.';
      const _requestBodys = {
        OCDS: {
          title: 'Question clarification for event ' + eventId,
          description: textContent,
        },
        nonOCDS: {
          isBroadcast: true,
          classification: 'Qualification Clarification',
        },
      };

      const baseURLs = `/tenders/projects/${projectId}/events/${eventId}/messages`;

      const responses = await TenderApi.Instance(SESSION_ID).post(baseURLs, _requestBodys);

      //CAS-INFO-LOG
      LoggTracer.infoLogger(responses, logConstant.saveMessages, req);

      // var host = req.get('host');
      // var urlMain = 'https://'+req.get('host')+"/event/qa?id="+eventId+'&prId='+projectId;

      // var textContent = 'The questions and answers for this project have been updated. You can access this, and any future updates, using the following link:\n\n'+urlMain+'\n\nIf you are already authenticated, you will be able to see this page. If not, you will need to authenticate through the Public Procurement Gateway before being able to access the page.';
      // const _requestBodys = {
      //     "OCDS": {
      //         "title": 'Question clarification for event '+eventId,
      //         "description": textContent
      //     },
      //     "nonOCDS": {
      //         "isBroadcast": true,
      //         "classification": 'Qualification Clarification'
      //     }
      // };

      // const baseURLs = `/tenders/projects/${projectId}/events/${eventId}/messages`

      if (response.status == 200) {
        req.session['createdqaedit'] = true;
        res.redirect('/message/inbox');
      } else {
        req.session['createdqaedit'] = false;
        res.redirect('/message/inbox');
      }
    }
  } catch (err) {
    console.log('err', err);

    LoggTracer.errorLogger(
      res,
      err,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Event management page message details QA Add clerification question',
      true
    );
  }
};
//'Private Method
async function getQADetails(qsId: string, projectId: string, eventId: string, SESSION_ID: string) {
  const baseMessageURL = `/tenders/projects/${projectId}/events/${eventId}/q-and-a/`;
  const eventQAObject = await TenderApi.Instance(SESSION_ID).get(baseMessageURL);
  const eventQAList: QuestionAndAnswer[] = eventQAObject.data.QandA.length > 0 ? eventQAObject.data.QandA : [];
  const qsObject = eventQAList.filter(function (x) {
    if (x.id == qsId) {
      return x;
    }
  });
  return qsObject != undefined && qsObject != null ? qsObject[0] : null;
}

//'Private Method
async function getMessageDetails(messageId: string, projectId: string, eventId: string, SESSION_ID: string) {
  const baseMessageURL = `/tenders/projects/${projectId}/events/${eventId}/messages/` + messageId;
  const messageDetails = await TenderApi.Instance(SESSION_ID).get(baseMessageURL);
  const message: MessageDetails = messageDetails.data;
  return message;
}
