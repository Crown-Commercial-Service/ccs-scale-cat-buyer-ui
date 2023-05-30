import * as express from 'express';
import { ObjectModifiers } from '../util/operations/objectremoveEmptyString';
import { LoggTracer } from '@common/logtracer/tracer';
import { TokenDecoder } from '@common/tokendecoder/tokendecoder';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import { MessageDetails } from '../model/messgeDetails';
import { MessageReply } from '../model/messageReply';
import * as inboxData from '../../../resources/content/event-management/event-management-message-details.json';
import * as dos6InboxData from '../../../resources/content/event-management/event-management-message-detailsdos6.json';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';

/**
 *
 * @Rediect
 * @endpoint '/message/details'
 * @param req
 * @param res
 */
let messageThreadingList: MessageDetails[];
export const EVENT_MANAGEMENT_MESSAGE_DETAILS_GET = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { id, attachmentId } = req.query;
  const projectId = req.session['projectId'];
  const eventId = req.session['eventId'];
  req.session['messageID'] = req.query;
  const { type } = req.query;
  try {
    res.locals.agreement_header = req.session.agreement_header;
    if (attachmentId !== undefined) {
      const FileDownloadURL = `/tenders/projects/${projectId}/events/${eventId}/messages/${id}/attachments/${attachmentId}`;

      const FetchDocuments = await DynamicFrameworkInstance.file_dowload_Instance(SESSION_ID).get(FileDownloadURL, {
        responseType: 'arraybuffer',
      });
      const file = FetchDocuments;
      const fileName = file.headers['content-disposition'].split('filename=')[1].split('"').join('');
      const fileData = file.data;
      const type = file.headers['content-type'];
      const ContentLength = file.headers['content-length'];
      res.status(200);
      res.set({
        'Cache-Control': 'no-cache',
        'Content-Type': type,
        'Content-Length': ContentLength,
        'Content-Disposition': 'attachment; filename=' + fileName,
      });
      res.send(fileData);
    } else {
      console.log('*************** START **************');
      console.log(
        `URL: https://dev-ccs-scale-cat-service.london.cloudapps.digital//tenders/projects/${projectId}/events/${eventId}/messages/` +
          id
      );
      console.log('METHOD: GET');

      const baseMessageURL = `/tenders/projects/${projectId}/events/${eventId}/messages/` + id;
      const draftMessage: any = await TenderApi.Instance(SESSION_ID).get(baseMessageURL);

      //CAS-INFO-LOG
      LoggTracer.infoLogger(draftMessage, 'PRE09121210', req);
      console.log(draftMessage.config.metadata.startTime);
      console.log(draftMessage.config.metadata.endTime);
      console.log(draftMessage.duration);
      console.log('*****************************');
      console.log(JSON.stringify(draftMessage.config));
      console.log(JSON.stringify(draftMessage.config.metadata));
      //  console.log(JSON.stringify(draftMessage));
      console.log('*************** END **************');

      const message: MessageDetails = draftMessage.data;
      const agreementId = req.session.agreement_id;
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
      let data;
      if (agreementId == 'RM1043.8' || agreementId == 'RM1557.13') {
        //DOS6
        data = dos6InboxData;
      } else {
        data = inboxData;
      }
      let attachmentSize = '0 KB';
      if (message.nonOCDS?.attachments.length > 0) {
        const convertMB = Object.values(message.nonOCDS?.attachments[0]);
        const digit = 2;
        if (convertMB[2] > 1024) {
          attachmentSize = byteConverter(convertMB[2], digit, 'MB');
        } else {
          attachmentSize = convertMB[2] + ' KB';
        }
      }

      const appendData = {
        type,
        data,
        msgThreadList: messageThreadingList,
        messageDetails: message,
        eventId: eventId,
        eventType: req.session.eventManagement_eventType,
        id: id,
        agreementId,
        attachmentSize: attachmentSize,
      };

      res.render('eventManagementDetails', appendData);
    }
  } catch (err) {
    if (err.response?.status !== undefined) {
      console.log('*********** error.response.status - ', err.response.status);
    }
    console.log(err.config.metadata.startTime);
    console.log(err.config.metadata.endTime);
    console.log(err.duration);

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

// '/message/details'
export const POST_EVENT_MANAGEMENT_MESSAGE_DETAILS = (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const filtered_body_content_removed_event_key = ObjectModifiers._deleteKeyofEntryinObject(
    req.body,
    'choose_event_management_next_step'
  );
  const { event_management_next_step } = filtered_body_content_removed_event_key;
  let redirect_address;
  try {
    if (event_management_next_step) {
      switch (event_management_next_step) {
      case 'pre-market':
        redirect_address = '/projects/create-or-choose';
        res.redirect(redirect_address);
        break;

      case 'write-publish':
        redirect_address = '/projects/create-or-choose';
        res.redirect(redirect_address);
        break;

      case 'move-from-cat':
        if (req.session.eventManagement_eventType == 'RFI') {
          redirect_address = '/rfi/review';
        } else if (req.session.eventManagement_eventType == 'EOI') {
          redirect_address = '/eoi/review';
        }
        res.redirect(redirect_address);
        break;

      case 'close':
        redirect_address = '#';
        res.redirect(redirect_address);
        break;

      case 'decide-later':
        redirect_address = '/dashboard';
        res.redirect(redirect_address);
        break;

      default:
        res.redirect('/404');
      }
    } else {
      req.session['isJaggaerError'] = true;
      res.redirect('/event/next');
    }
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

function byteConverter(bytes: any, decimals: any, only: any) {
  const K_UNIT = 1024;
  const SIZES = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  if (bytes == 0) return '0 Byte';

  if (only === 'MB') return (bytes / (K_UNIT * K_UNIT)).toFixed(decimals) + ' MB';
  if (only === 'KB') return (bytes / (K_UNIT * K_UNIT)).toFixed(decimals) + ' KB';

  const i = Math.floor(Math.log(bytes) / Math.log(K_UNIT));
  const resp = parseFloat((bytes / Math.pow(K_UNIT, i)).toFixed(decimals)) + ' ' + SIZES[i];

  return resp;
}
