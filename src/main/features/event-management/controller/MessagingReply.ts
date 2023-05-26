import * as express from 'express';
import { LoggTracer } from '@common/logtracer/tracer';
import { TokenDecoder } from '@common/tokendecoder/tokendecoder';
import { MessageReply } from '../model/messageReply';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import * as replyData from '../../../resources/content/event-management/messaging-reply.json';
import * as dos6ReplyData from '../../../resources/content/event-management/messaging-reply dos6.json';
import { MessageDetails } from '../model/messgeDetails';
import { logConstant } from '../../../common/logtracer/logConstant';

export class ValidationErrors {
  static readonly MESSAGE_REQUIRED: string = 'Message cannot be sent unless a Subject Line has been defined';
  static readonly SUBJECT_REQUIRED: string = 'Enter a message';
}

/**
 *
 * @Rediect
 * @endpoint /message/reply
 * @param req
 * @param res
 */
let messageThreadingList: MessageDetails[];
export const EVENT_MANAGEMENT_MESSAGE_REPLY = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { id } = req.session['messageID'];
  const projectId = req.session['projectId'];
  const eventId = req.session['eventId'];
  const agreementId = req.session.agreement_id;
  const { replyto } = req.query;

  try {
    const baseMessageURL = `/tenders/projects/${projectId}/events/${eventId}/messages/` + id;
    const draftMessage = await TenderApi.Instance(SESSION_ID).get(baseMessageURL);
    //CAS-INFO-LOG
    LoggTracer.infoLogger(draftMessage, logConstant.messageReceived, req);

    const messageReply: MessageReply = draftMessage.data;
    messageThreadingList = [];
    if (
      messageReply != undefined &&
      messageReply != null &&
      messageReply.nonOCDS != null &&
      messageReply.nonOCDS.parentId != null &&
      messageReply.nonOCDS.parentId != 'null'
    ) {
      await getChildMethod(messageReply.nonOCDS.parentId, projectId, eventId, SESSION_ID);
    }

    if (agreementId == 'RM1043.8' || agreementId == 'RM1557.13') {
      res.locals.agreement_header = req.session.agreement_header;
      switch (req.session.eventManagement_eventType) {
      case 'EOI':
        res.locals.supplier_link = '/eoi/suppliers?fromMessage=1';
        break;

      case 'RFI':
        res.locals.supplier_link = '/rfi/suppliers?fromMessage=1';
        break;
      case 'FC':
        res.locals.supplier_link = '/rfp/suppliers?fromMessage=1';
        break;
      case 'DA':
        res.locals.supplier_link = '/da/suppliers?fromMessage=1';
        break;
      default:
        res.locals.supplier_link = '#';
      }
    }

    let data;
    if (agreementId == 'RM1043.8' || agreementId == 'RM1557.13') {
      //DOS6
      data = dos6ReplyData;
    } else {
      data = replyData;
    }

    const appendData = {
      replyto,
      msgThreadList: messageThreadingList,
      data,
      message: messageReply,
      validationError: false,
      eventId: req.session['eventId'],
      eventType: req.session.eventManagement_eventType,
      agreementId,
    };
    res.locals.agreement_header = req.session.agreement_header;
    //CAS-INFO-LOG
    LoggTracer.infoLogger(null, logConstant.MessagingReplyLogger, req);
    res.render('MessagingReply', appendData);
  } catch (err) {
    LoggTracer.errorLogger(
      res,
      err,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Event management page',
      true
    );
  }
};

// /message/create
export const POST_EVENT_MANAGEMENT_MESSAGE_REPLY = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const projectId = req.session['projectId'];
  const eventId = req.session['eventId'];
  const { id } = req.session['messageID'];
  const agreementId = req.session.agreement_id;
  const { replyto } = req.query;
  try {
    const _body = req.body;
    let validationError = false;
    const errorText = [];
    let errorMsg = '';

    if (!_body.reply_subject_input) {
      validationError = true;
      errorText.push({
        text: ValidationErrors.MESSAGE_REQUIRED,
        href: '#reply_subject_input',
      });
    }

    if (!_body.reply_message_input) {
      validationError = true;
      errorText.push({
        text: ValidationErrors.SUBJECT_REQUIRED,
        href: '#reply_message_input',
      });
      errorMsg = ValidationErrors.SUBJECT_REQUIRED;
    }
    const baseMessageURL = `/tenders/projects/${projectId}/events/${eventId}/messages/` + id;
    const draftMessage = await TenderApi.Instance(SESSION_ID).get(baseMessageURL);
    //CAS-INFO-LOG
    LoggTracer.infoLogger(draftMessage, logConstant.messageReceived, req);

    const messageReply: MessageReply = draftMessage.data;
    if (validationError) {
      if (agreementId == 'RM1043.8' || agreementId == 'RM1557.13') {
        res.locals.agreement_header = req.session.agreement_header;
        switch (req.session.eventManagement_eventType) {
        case 'EOI':
          res.locals.supplier_link = '/eoi/suppliers?fromMessage=1';
          break;

        case 'RFI':
          res.locals.supplier_link = '/rfi/suppliers?fromMessage=1';
          break;
        case 'FC':
          res.locals.supplier_link = '/rfp/suppliers?fromMessage=1';
          break;
        case 'DA':
          res.locals.supplier_link = '/rfp/suppliers?fromMessage=1';
          break;
        default:
          res.locals.supplier_link = '#';
        }
      }

      let data;
      if (agreementId == 'RM1043.8' || agreementId == 'RM1557.13') {
        //DOS6
        data = dos6ReplyData;
      } else {
        data = replyData;
      }
      const appendData = {
        replyto,
        data,
        message: messageReply,
        validationError: validationError,
        errorText: errorText,
        errorMsg,
        eventId: req.session['eventId'],
        eventType: req.session.eventManagement_eventType,
        agreementId,
      };
      res.render('MessagingReply', appendData);
    } else {
      let _requestBody;
      if (
        (replyto && replyto == 'all' && agreementId == 'RM1043.8') ||
        (replyto && replyto == 'all' && agreementId == 'RM1557.13')
      ) {
        _requestBody = {
          OCDS: {
            title: _body.reply_subject_input,
            description: _body.reply_message_input,
          },
          nonOCDS: {
            isBroadcast: true,
            classification: draftMessage.data.nonOCDS.classification,
          },
        };
      } else {
        _requestBody = {
          OCDS: {
            title: _body.reply_subject_input,
            description: _body.reply_message_input,
          },
          nonOCDS: {
            isBroadcast: false,
            classification: draftMessage.data.nonOCDS.classification,
            parentId: id,
            receiverList: [
              {
                id: draftMessage.data.OCDS.author.id,
                name: draftMessage.data.OCDS.author.name,
              },
            ],
          },
        };
      }

      req.session['SupplierNameforMessagereply'] = draftMessage.data.OCDS.author.name;
      const baseURL = `/tenders/projects/${projectId}/events/${eventId}/messages`;
      // const response = await
      TenderApi.Instance(SESSION_ID).post(baseURL, _requestBody);

      // if (response.status == 200) {
      //     if(replyto && replyto == 'all' && agreementId == 'RM1043.8' || replyto && replyto == 'all' && agreementId == 'RM1557.13'){
      //         res.redirect('/message/inbox?createdreply=true&msgfor=all')
      //     }else{
      //         res.redirect('/message/inbox?createdreply=true')
      //     }
      // } else {
      //     res.redirect('/message/inbox?createdreply=false')
      // }

      if (
        (replyto && replyto == 'all' && agreementId == 'RM1043.8') ||
        (replyto && replyto == 'all' && agreementId == 'RM1557.13')
      ) {
        res.redirect('/message/inbox?createdreply=true&msgfor=all');
      } else {
        res.redirect('/message/inbox?createdreply=true');
      }
    }
  } catch (err) {
    LoggTracer.errorLogger(
      res,
      err,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Event management page',
      false
    );
    res.redirect('/message/inbox?created=false');
  }
};

//'Private Method
async function getChildMethod(parentMessageId: string, projectId: string, eventId: string, SESSION_ID: string) {
  const baseMessageChildURL = `/tenders/projects/${projectId}/events/${eventId}/messages/` + parentMessageId;
  const childMessage = await TenderApi.Instance(SESSION_ID).get(baseMessageChildURL);
  if (messageThreadingList == undefined || messageThreadingList == null) {
    messageThreadingList = [];
  }
  messageThreadingList.push(childMessage.data);
  if (
    childMessage != undefined &&
    childMessage != null &&
    childMessage.data.nonOCDS != null &&
    childMessage.data.nonOCDS.parentId != 'null'
  ) {
    await getChildMethod(childMessage.data.nonOCDS.parentId, projectId, eventId, SESSION_ID);
  }
  return messageThreadingList;
}
