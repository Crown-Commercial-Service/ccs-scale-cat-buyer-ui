import * as express from 'express'
import { LoggTracer } from '@common/logtracer/tracer'
import { TokenDecoder } from '@common/tokendecoder/tokendecoder'
import * as inboxData from '../../../resources/content/event-management/qa.json'
import * as localTableData from '../../../resources/content/event-management/local-QA.json' // Replace this with API endpoint

/**
 * 
 * @Rediect 
 * @endpoint /message/sent
 * @param req 
 * @param res 
 */
export const EVENT_MANAGEMENT_QA = (req: express.Request, res: express.Response) => {
    const { SESSION_ID } = req.cookies
    try {
        res.locals.event_header = req.session.event_header
        
        const appendData = { data: inboxData, QAs: localTableData }
        res.render('viewQA', appendData)
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