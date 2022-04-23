import * as express from 'express'
import { LoggTracer } from '@common/logtracer/tracer'
import { TokenDecoder } from '@common/tokendecoder/tokendecoder'
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance'
import moment from 'moment';
import { Message } from '../model/messages'
import * as inboxData from '../../../resources/content/event-management/messaging-inbox.json'

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
    const projectId = req.session['projectId']
    const eventId = req.session['eventId']
    try {

        const baseReceivedMessageURL = `/tenders/projects/${projectId}/events/${eventId}/messages?message-direction=RECEIVED`
        const draftReceivedMessage = await TenderApi.Instance(SESSION_ID).get(baseReceivedMessageURL)

        const receivedMessages: Message[] = draftReceivedMessage.data.messages
        
        if (receivedMessages != undefined) {
            receivedMessages.sort((a, b) => (a.OCDS.date < b.OCDS.date) ? 1 : -1)
            for (let i = 0; i < receivedMessages.length; i++) {
                receivedMessages[i].OCDS.date = (moment(receivedMessages[i].OCDS.date)).format('DD-MMM-YYYY hh:mm')
            }
        }
        const appendData = { data: inboxData, created, messages: receivedMessages, eventId: req.session['eventId'], eventType: req.session.eventManagement_eventType }
        res.locals.agreement_header = req.session.agreement_header
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