import * as express from 'express'
import { LoggTracer } from '@common/logtracer/tracer'
import { TokenDecoder } from '@common/tokendecoder/tokendecoder'
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance'
import moment from 'moment';
import { Message } from '../model/messages'
import * as inboxData from '../../../resources/content/event-management/messaging-inbox.json'
import * as dos6InboxData from '../../../resources/content/event-management/messaging-inboxdos6.json'
import { logConstant } from '../../../common/logtracer/logConstant';

/**
 * 
 * @Rediect 
 * @endpoint /message/inbox
 * @param req 
 * @param res 
 */
export const EVENT_MANAGEMENT_MESSAGING = async (req: express.Request, res: express.Response) => {
    const { SESSION_ID } = req.cookies
    const { created } = req.query
    const { createdreply, msgfor, project_status } = req.query
    const { createdqa } = req.session
    const { createdqaedit } = req.session
    const projectId = req.session['projectId']
    const eventId = req.session['eventId']
    const agreementId = req.session.agreement_id;
    try {
        if (createdqa != undefined || createdqaedit != undefined) {
            delete req.session["createdqa"];
            delete req.session["createdqaedit"];
        }
        const baseReceivedMessageURL = `/tenders/projects/${projectId}/events/${eventId}/messages?message-direction=RECEIVED`

        const draftReceivedMessage = await TenderApi.Instance(SESSION_ID).get(baseReceivedMessageURL)

        //CAS-INFO-LOG 
        LoggTracer.infoLogger(draftReceivedMessage, logConstant.messageReceived, req);

        const receivedMessages: Message[] = draftReceivedMessage.data.messages

        if (receivedMessages != undefined) {
            receivedMessages.sort((a, b) => (a.OCDS.date > b.OCDS.date) ? 1 : -1)
            for (let i = 0; i < receivedMessages.length; i++) {
                receivedMessages[i].OCDS.date = (moment(receivedMessages[i].OCDS.date)).format('DD/MMM/YYYY - HH:mm')
            }
        }

        let suppliernameforreplymessage = '';

        if (createdreply) {
            suppliernameforreplymessage = req.session['SupplierNameforMessagereply']
        }

        let data;
        if (agreementId == 'RM1043.8' || agreementId == 'RM1557.13') { //DOS6
            data = dos6InboxData;
        } else {
            data = inboxData;
        }


        const breadcrumbs: any = genarateBreadcrumbs({agreementId, eventId, eventType : req.session.eventManagement_eventType, project_status})

        const appendData = { 
             data,
             createdQA: createdqa,
             createdQAEdit: createdqaedit,
             created,
             createdreply,
             msgfor,
             suppliernameforreplymessage,
             messages: receivedMessages,
             eventId: req.session['eventId'],
             eventType: req.session.eventManagement_eventType,
             agreementId,
             breadcrumbs }

        res.locals.agreement_header = req.session.agreement_header


        //CAS-INFO-LOG 
        LoggTracer.infoLogger(null, logConstant.messageInboxPageLogger, req);
        
        res.render('MessagingInbox', appendData)
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

const genarateBreadcrumbs = ({agreementId, eventId, eventType, project_status}: any) => {
    let eventCrumbs = {}
    let messageCrumbs = {}
    if (project_status !== undefined && project_status === 'COMPLETE') {
        eventCrumbs = {
            "text": `${eventId} / ${eventType}`,
            "href": `/event/management_close?id=${eventId}`
        }
    } else {
        eventCrumbs = {
            "text": `${eventId} / ${eventType}`,
            "href": `/event/management?id=${eventId}`
        }
    }

    if (agreementId == 'RM1043.8' || agreementId == 'RM1557.13' || agreementId == 'RM6187') {
        messageCrumbs = {
            "text": "Your inbox",
            "href": "#"
        }
    } else {
        messageCrumbs = {
            "text": "Message",
            "href": "#"
        }
    }

    return [{
        "text": "Dashboard",
        "href": "/dashboard"
    }, eventCrumbs, messageCrumbs]
}