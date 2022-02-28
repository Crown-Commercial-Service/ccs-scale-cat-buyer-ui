import * as express from 'express'
import { LoggTracer } from '@common/logtracer/tracer'
import { TokenDecoder } from '@common/tokendecoder/tokendecoder'
import * as inboxData from '../../../resources/content/event-management/messaging-inbox.json'
import * as localTableData from '../../../resources/content/event-management/local-message-inbox.json' // Replace this with API endpoint

/**
 * 
 * @Rediect 
 * @endpoint /message/inbox
 * @param req 
 * @param res 
 */
export const EVENT_MANAGEMENT_MESSAGING = (req: express.Request, res: express.Response) => {
    const { SESSION_ID } = req.cookies
    const { created } = req.query
    try {
        const appendData = { data: inboxData, created, messageData: localTableData }
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