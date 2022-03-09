import * as express from 'express'
import { LoggTracer } from '@common/logtracer/tracer'
import { TokenDecoder } from '@common/tokendecoder/tokendecoder'
import * as inboxData from '../../../resources/content/event-management/messaging-sent.json'
import * as localTableData from '../../../resources/content/event-management/local-message-sent.json' // Replace this with API endpoint

/**
 * 
 * @Rediect 
 * @endpoint /message/sent
 * @param req 
 * @param res 
 */
export const EVENT_MANAGEMENT_MESSAGING_SENT = (req: express.Request, res: express.Response) => {
    const { SESSION_ID } = req.cookies
    try {
        res.locals.agreement_header = req.session.agreement_header
        
        const appendData = { data: inboxData, messageData: localTableData, eventId: req.session['eventId'], eventType: req.session.eventManagement_eventType }
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