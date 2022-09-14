import * as express from 'express'
import { LoggTracer } from '@common/logtracer/tracer'
import { TokenDecoder } from '@common/tokendecoder/tokendecoder'
import { MessageReply } from '../model/messageReply'
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance'
import * as replyData from '../../../resources/content/event-management/messaging-reply.json'
import { MessageDetails } from '../model/messgeDetails'

export class ValidationErrors {
   
    static readonly MESSAGE_REQUIRED: string = 'Message cannot be broadcast unless a Subject Line has been defined'
    static readonly SUBJECT_REQUIRED: string = 'Message cannot be broadcast unless a Message Body has been defined'
}

/**
 * 
 * @Rediect 
 * @endpoint /message/reply
 * @param req 
 * @param res 
 */
 let messageThreadingList: MessageDetails[];
export const EVENT_MANAGEMENT_MESSAGE_REPLY_TO_ALL =async (req: express.Request, res: express.Response) => {
    const { SESSION_ID } = req.cookies
    const { id } = req.session['messageID']
    const projectId = req.session['projectId']
    const eventId = req.session['eventId']
   
    try {
        switch (req.session.eventManagement_eventType) {
            case 'EOI':
                res.locals.supplier_link = "/eoi/suppliers"
                break;

                case 'RFI':
                    res.locals.supplier_link = "/rfi/suppliers?fromMessage=1"
                    break;
                    case 'FC':
                        res.locals.supplier_link = "/rfp/suppliers?fromMessage=1"
                        break;
                        case 'DA':
                        res.locals.supplier_link = "/rfp/suppliers?fromMessage=1"
                        break;
            default: res.locals.supplier_link = "#"
        }
        const baseMessageURL = `/tenders/projects/${projectId}/events/${eventId}/messages/`+id
        const draftMessage = await TenderApi.Instance(SESSION_ID).get(baseMessageURL)

        const messageReply: MessageReply = draftMessage.data

        if (messageReply != undefined && messageReply != null && messageReply.nonOCDS != null && messageReply.nonOCDS.parentId != null && messageReply.nonOCDS.parentId != 'null') {
            messageThreadingList= [];
          await  getChildMethod(messageReply.nonOCDS.parentId,projectId,eventId,SESSION_ID);
        }
        const appendData = {msgThreadList:messageThreadingList, data: replyData, message: messageReply, validationError: false, 
            eventId: req.session['eventId'], eventType: req.session.eventManagement_eventType }

        res.locals.agreement_header = req.session.agreement_header
        res.render('MessagingReplytoAll', appendData)
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
export const POST_EVENT_MANAGEMENT_MESSAGE_REPLY_TO_ALL = async (req: express.Request, res: express.Response) => {
    const { SESSION_ID } = req.cookies
    const projectId = req.session['projectId']
    const eventId = req.session['eventId']
    const { id } = req.session['messageID']
    try {
        const _body = req.body
        let validationError = false
        const errorText = [];

        if (!_body.reply_subject_input) {         
            validationError = true;
            errorText.push({
                text: ValidationErrors.MESSAGE_REQUIRED,
                href: '#reply_subject_input'
            });
        } 

        if (!_body.reply_message_input) {       
            validationError = true
            errorText.push({
                text: ValidationErrors.SUBJECT_REQUIRED,
                href: '#reply_message_input'
            });
        }
        const baseMessageURL = `/tenders/projects/${projectId}/events/${eventId}/messages/`+id
        const draftMessage = await TenderApi.Instance(SESSION_ID).get(baseMessageURL)

        const messageReply: MessageReply = draftMessage.data
        if (validationError) {
        
            const appendData = { data: replyData, message: messageReply, validationError: validationError,errorText: errorText, eventId: req.session['eventId'], eventType: req.session.eventManagement_eventType }
            res.render('MessagingReplytoAll', appendData)
        }
        else {

        const _requestBody = {
            "OCDS": {
                "title": _body.reply_subject_input,
                "description": _body.reply_message_input
            },
            "nonOCDS": {
                "isBroadcast": true,
                "classification":  draftMessage.data.nonOCDS.classification
                         
            }};
            req.session['SupplierNameforMessagereply']=draftMessage.data.OCDS.author.name;
            const baseURL = `/tenders/projects/${projectId}/events/${eventId}/messages`
            const response = await TenderApi.Instance(SESSION_ID).post(baseURL, _requestBody);
            if (response.status == 200) {
                res.redirect('/message/inbox?created=true')
            } else {
                res.redirect('/message/inbox?created=false')
            }

    }
}
 catch (err) {
    LoggTracer.errorLogger(
        res,
        err,
        `${req.headers.host}${req.originalUrl}`,
        null,
        TokenDecoder.decoder(SESSION_ID),
        'Message reply to all',
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