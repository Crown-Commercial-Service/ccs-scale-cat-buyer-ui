import * as express from 'express'
import { LoggTracer } from '@common/logtracer/tracer'
import { TokenDecoder } from '@common/tokendecoder/tokendecoder'
import * as inboxData from '../../../resources/content/event-management/messaging-create.json'

/**
 * 
 * @Rediect 
 * @endpoint /message/create
 * @param req 
 * @param res 
 */
export const EVENT_MANAGEMENT_MESSAGING_CREATE = (req: express.Request, res: express.Response) => {
    const { SESSION_ID } = req.cookies
    try {
        res.locals.event_header = req.session.event_header

        const classificationData: any = {classification : "General Classification"} // this value needs to be taken from API or move it to JSON
        const messageDescription: any = "" // this value needs to be taken from API
        const messageSubject = "" // this value needs to be taken from API

        const appendData = { data: inboxData, classificationData, messageSubject, messageDescription }
        res.render('MessagingCreate', appendData)
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
export const POST_MESSAGING_CREATE = (req: express.Request, res: express.Response) => {
    const { SESSION_ID } = req.cookies
    try {
        res.locals.event_header = req.session.event_header

        res.redirect('/message/inbox?created=true')
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