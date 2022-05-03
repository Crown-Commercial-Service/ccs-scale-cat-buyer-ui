import * as express from 'express'
import { TenderApi } from '../../../common/util/fetch/tenderService/tenderApiInstance'
import { LoggTracer } from '@common/logtracer/tracer'
import { TokenDecoder } from '@common/tokendecoder/tokendecoder'
import * as inboxData from '../../../resources/content/event-management/qa.json'

/**
 * 
 * @Rediect 
 * @endpoint /message/sent
 * @param req 
 * @param res 
 */
export const EVENT_MANAGEMENT_QA =  async (req: express.Request, res: express.Response) => {
    const { SESSION_ID } = req.cookies
  
    try {    
        res.locals.agreement_header = req.session.agreement_header 
             
        const baseURL = `/tenders/projects/${req.session.projectId}/events/${req.session.eventId}/q-and-a`;
        const fetchData = await TenderApi.Instance(SESSION_ID).get(baseURL);

        const appendData = {data: inboxData, QAs: fetchData.data, eventId: req.session['eventId'], eventType: req.session.eventManagement_eventType }
        res.render('viewQA', appendData)
    } catch (err) {
        LoggTracer.errorLogger(
            res,
            err,
            `${req.headers.host}${req.originalUrl}`,
            null,
            TokenDecoder.decoder(SESSION_ID),
            'Tenders Service Api cannot be connected',
            true,
        );
    }
}