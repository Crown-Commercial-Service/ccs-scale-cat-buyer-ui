import * as express from 'express'
import { LoggTracer } from '@common/logtracer/tracer'
import { TokenDecoder } from '@common/tokendecoder/tokendecoder'
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance'
import { Message } from '../model/messages'
import moment from 'moment';
import * as inboxData from '../../../resources/content/event-management/messaging-sent.json'

/**
 * 
 * @Rediect 
 * @endpoint /message/sent
 * @param req 
 * @param res 
 */
export const EVENT_MANAGEMENT_MESSAGING_SENT = async (req: express.Request, res: express.Response) => {
    const { SESSION_ID } = req.cookies
    const projectId = req.session['projectId']
    const eventId = req.session['eventId']
    try {
        res.locals.agreement_header = req.session.agreement_header

        const baseSentMessageURL = `/tenders/projects/${projectId}/events/${eventId}/messages?message-direction=SENT`
        const draftSentMessage = await TenderApi.Instance(SESSION_ID).get(baseSentMessageURL)

        const sentMessage: Message[] = draftSentMessage.data.messages

        if (sentMessage != undefined) {
            sentMessage.sort((a, b) => (a.OCDS.date < b.OCDS.date) ? 1 : -1)
            for (let i = 0; i < sentMessage.length; i++) {
                sentMessage[i].OCDS.date = moment(sentMessage[i].OCDS.date,'YYYY-MM-DD, hh:mm a',).format('DD/MM/YYYY hh:mm')
            }
        }
        const appendData = {selectedReceived:"",selectedSent:"selected", data: inboxData, messages: sentMessage, eventId: req.session['eventId'], eventType: req.session.eventManagement_eventType }
        res.render('MessagingSent', appendData)
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