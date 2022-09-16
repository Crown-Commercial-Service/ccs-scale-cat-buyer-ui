import * as express from 'express'
import { TenderApi } from '../../../common/util/fetch/tenderService/tenderApiInstance'
import { LoggTracer } from '@common/logtracer/tracer'
import { TokenDecoder } from '@common/tokendecoder/tokendecoder'
import * as inboxData from '../../../resources/content/event-management/qa.json'
// import { EventEngagementMiddleware } from '@common/middlewares/event-management/activeevents'
// import { ParsedQs } from 'qs'
import { ActiveEvents } from '@common/middlewares/models/active-events'
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
        appendData = { data: inboxData, QAs: fetchData.data, eventId: req.session['eventId'], eventType: req.session.eventManagement_eventType, isSupplierQA: false }
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
    if (eventId != undefined && projectId != undefined) {
        const baseURL = `/tenders/projects/${projectId}/events/${eventId}/q-and-a`;
        const fetchData = await TenderApi.Instance(SESSION_ID).get(baseURL);
        const baseActiveEventsURL = `/tenders/projects`
        const retrieveProjetActiveEventsPromise = TenderApi.Instance(SESSION_ID).get(baseActiveEventsURL)
        retrieveProjetActiveEventsPromise
            .then(async (data) => {
                const events: ActiveEvents[] = data.data.sort((a: { projectId: number }, b: { projectId: number }) => (a.projectId < b.projectId) ? 1 : -1)
                let filterProject = [...events.filter(pro => pro.projectId?.toString() === projectId && pro.activeEvent.id == eventId)];
                appendData={isSupplierQA: true};
                if (filterProject != undefined && filterProject != null && filterProject.length > 0) {
                    res.locals.agreement_header = { projectId: projectId, eventId: eventId, project_name: filterProject.length > 0 ? filterProject?.[0].projectName : "", agreementName: filterProject?.[0].agreementName, agreementId_session: filterProject?.[0].agreementId, agreementLotName: filterProject?.[0].lotName, lotid: filterProject?.[0].lotId }
                    req.session.agreement_header = res.locals.agreement_header
                    appendData = { data: inboxData, QAs: fetchData.data, eventId: eventId, eventType: req.session.eventManagement_eventType, isSupplierQA: true }
                }

                res.render('viewQA', appendData);
            })
            .catch(err => {
                LoggTracer.errorLogger(
                    res,
                    err,
                    `${req.headers.host}${req.originalUrl}`,
                    "",
                    TokenDecoder.decoder(SESSION_ID),
                    'Tenders API for getting the list of Active Events Q&A page',
                    false,
                );
            });
    }
}
