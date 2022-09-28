import * as express from 'express'
import { TenderApi } from '../../../common/util/fetch/tenderService/tenderApiInstance'
import { LoggTracer } from '@common/logtracer/tracer'
import { TokenDecoder } from '@common/tokendecoder/tokendecoder'
import * as inboxData from '../../../resources/content/event-management/qa.json'
// import { EventEngagementMiddleware } from '@common/middlewares/event-management/activeevents'
// import { ParsedQs } from 'qs'
/**
 * 
 * @Rediect 
 * @endpoint /message/sent
 * @param req 
 * @param res 
 */
export const EVENT_MANAGEMENT_QA = async (req: express.Request, res: express.Response) => {
    const { SESSION_ID } = req.cookies
    let appendData: any;
    try {
        res.locals.agreement_header = req.session.agreement_header
        const baseURL = `/tenders/projects/${req.session.projectId}/events/${req.session.eventId}/q-and-a`;
        const fetchData = await TenderApi.Instance(SESSION_ID).get(baseURL);
        appendData = { data: inboxData, QAs: (fetchData.data.QandA.length > 0 ? fetchData.data.QandA : []), eventId: req.session['eventId'], eventType: req.session.eventManagement_eventType, eventName: req.session.project_name, isSupplierQA: false }
        res.render('viewQA', appendData)
    } catch (err) {
        LoggTracer.errorLogger(
            res,
            err,
            `${req.headers.host}${req.originalUrl}`,
            null,
            TokenDecoder.decoder(SESSION_ID),
            'Q&A page Tenders Service Api cannot be connected',
            true,
        );
    }
}



export const EVENT_MANAGEMENT_SUPPLIER_QA = async (req: express.Request, res: express.Response) => {
    const { supplier_qa_url } = req.session;
    const { SESSION_ID } = req.cookies
    let eventId = supplier_qa_url != undefined ? atob(supplier_qa_url.split('Id=')[1]).split("_")[1] : undefined
    var projectId = supplier_qa_url != undefined ? atob(supplier_qa_url.split('Id=')[1]).split("_")[0] : undefined
    let appendData: any;
    try {
        if (eventId != undefined && projectId != undefined) {
            const baseURL = `/tenders/projects/${projectId}/events/${eventId}/q-and-a`;
            const fetchData = await TenderApi.Instance(SESSION_ID).get(baseURL);
            if (fetchData != undefined && fetchData != null && fetchData.data.QandA?.length > 0) {
                res.locals.agreement_header = { projectId: projectId, eventId: eventId, project_name: fetchData.data.projectName, agreementName: fetchData.data.agreementName, agreementId_session: fetchData.data.agreementId, agreementLotName: fetchData.data.lotName, lotid: fetchData.data.lotId }
                req.session.agreement_header = res.locals.agreement_header
                appendData = { data: inboxData, QAs: fetchData.data.QandA, eventId: eventId,eventName:req.session.eventManagement_eventType, eventType: req.session.eventManagement_eventType, isSupplierQA: true }
            }
        }
        res.render('viewQA', appendData)
    } catch (err) {
        LoggTracer.errorLogger(
            res,
            err,
            `${req.headers.host}${req.originalUrl}`,
            null,
            TokenDecoder.decoder(SESSION_ID),
            'Q&A supplier page Tenders Service Api cannot be connected',
            true,
        );
    }

}
