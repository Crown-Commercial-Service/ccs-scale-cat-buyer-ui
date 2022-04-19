import * as express from 'express'
import { LoggTracer } from '@common/logtracer/tracer'
import { TokenDecoder } from '@common/tokendecoder/tokendecoder'
import { MessageReply } from '../model/messageReply'
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance'
import * as replyData from '../../../resources/content/event-management/messaging-reply.json'
import { MessageDetails } from '../model/messgeDetails'

export class ValidationErrors {
   
    static readonly MESSAGE_REQUIRED: string = 'Message cannot be broadcast unless a Subject Line has been defined'
    static readonly SUBJECT_REQUIRED: string = 'message cannot be broadcast unless a Message Body has been defined'
}

/**
 * 
 * @Rediect 
 * @endpoint /message/reply
 * @param req 
 * @param res 
 */
 let messageThreadingList: MessageDetails[];
export const EVENT_MANAGEMENT_MESSAGE_REPLY =async (req: express.Request, res: express.Response) => {
    const { SESSION_ID } = req.cookies
    const { id } = req.session['messageID']
    const projectId = req.session['projectId']
    const eventId = req.session['eventId']
   
    try {
        const baseMessageURL = `/tenders/projects/${projectId}/events/${eventId}/messages/`+id
        const draftMessage = await TenderApi.Instance(SESSION_ID).get(baseMessageURL)

        const messageReply: MessageReply = draftMessage.data

        if (messageReply != undefined && messageReply != null && messageReply.nonOCDS != null && messageReply.nonOCDS.parentId != null) {
            messageThreadingList= [];
          await  getChildMethod(messageReply.nonOCDS.parentId,projectId,eventId,SESSION_ID);
        }
        const appendData = {msgThreadList:messageThreadingList, data: replyData, message: messageReply, validationError: false, eventId: req.session['eventId'], eventType: req.session.eventManagement_eventType }
        console.log(appendData);
        res.render('MessagingReply', appendData)
    } catch (err) {
        LoggTracer.errorLogger(
            res,
            err,
            `${req.headers.host}${req.originalUrl}`,
            null,
            TokenDecoder.decoder(SESSION_ID),
            'Event management page',
            true,
        );
    }
}

// /message/create
export const POST_EVENT_MANAGEMENT_MESSAGE_REPLY = async (req: express.Request, res: express.Response) => {
    const { SESSION_ID } = req.cookies
    const projectId = req.session['projectId']
    const eventId = req.session['eventId']
    try {
        const _body = req.body
        const _requestBody = {
            "OCDS": {
                "title": _body.reply_subject_input,
                "description": _body.reply_message_input
            },
            "nonOCDS": {
                "isBroadcast": true,
                "classification":  req.session['msgClassification'],
                "parentId": "172769",
               

                "receiverList":[
            
                {}
            
              ]
            
            }};
            const baseURL = `/tenders/projects/${projectId}/events/${eventId}/messages`
            const response = await TenderApi.Instance(SESSION_ID).post(baseURL, _requestBody);
            if (response.status == 200) {
                res.redirect('/message/inbox?created=true')
            } else {
                res.redirect('/message/inbox?created=false')
            }
    }
 catch (err) {
    LoggTracer.errorLogger(
        res,
        err,
        `${req.headers.host}${req.originalUrl}`,
        null,
        TokenDecoder.decoder(SESSION_ID),
        'Event management page',
        false,
    );
    res.redirect('/message/inbox?created=false')
}
}

//'Private Method
async function getChildMethod(parentMessageId: string,projectId :string,eventId:string,SESSION_ID:string) {
    const baseMessageChildURL = `/tenders/projects/${projectId}/events/${eventId}/messages/` + parentMessageId
    const childMessage = await TenderApi.Instance(SESSION_ID).get(baseMessageChildURL);
    if (messageThreadingList ==undefined || messageThreadingList ==null) {
        messageThreadingList= [];
    }
    messageThreadingList.push(childMessage.data);
    if (childMessage != undefined && childMessage != null && childMessage.data.nonOCDS != null && childMessage.data.nonOCDS.parentId != 'null') {
        getChildMethod(childMessage.data.nonOCDS.parentId,projectId,eventId,SESSION_ID);
    }
}