import * as express from 'express'
import { TenderApi } from '../../../common/util/fetch/tenderService/tenderApiInstance'
import { LoggTracer } from '@common/logtracer/tracer'
import { TokenDecoder } from '@common/tokendecoder/tokendecoder'
import * as inboxData from '../../../resources/content/event-management/qa.json'
import { EventEngagementMiddleware } from '@common/middlewares/event-management/activeevents'
import { ParsedQs } from 'qs'
/**
 * 
 * @Rediect 
 * @endpoint /message/sent
 * @param req 
 * @param res 
 */
export const EVENT_MANAGEMENT_QA = async (req: express.Request, res: express.Response) => {
    const { SESSION_ID } = req.cookies
    const isSupplierQA = req.session['IsSupplierQA'];
    let appendData: any;
    try {
        res.locals.agreement_header = req.session.agreement_header
        if (isSupplierQA != undefined && isSupplierQA) {
            await EventEngagementMiddleware.GetEventList(req, res);
            const events = req.session.openProjectActiveEvents;
            let agreementName: string, agreementLotName: string, projectId: string, lotid: string, title: string, agreementId_session: string, projectName: string, status: string, eventId: string, eventType: string, end_date: string;

            events.forEach((element: { activeEvent: { id: string | ParsedQs | string[] | ParsedQs[]; status: string; eventType: string; title: string; tenderPeriod: { startDate: string; endDate: string; } }; agreementName: string; lotName: string; agreementId: string; projectName: string; projectId: string; lotId: string; end_date: string; }) => {
                if (element.activeEvent.id == req.session.eventId) {
                    agreementName = element.agreementName
                    agreementLotName = element.lotName
                    agreementId_session = element.agreementId
                    status = element?.activeEvent?.status?.toLowerCase()
                    projectName = element.projectName
                    eventId = element.activeEvent.id.toString()
                    eventType = element.activeEvent.eventType
                    projectId = element.projectId
                    lotid = element.lotId
                    title = element.activeEvent.title
                    end_date = element?.activeEvent?.tenderPeriod?.endDate
                }
            });
            projectId = projectId;
            end_date = end_date;
            eventType = eventType;
            eventId = eventId;
            status = status;
            projectName = projectName;
            agreementId_session = agreementId_session;
            title = title;
            // Event header
            res.locals.agreement_header = { project_name: projectName, agreementName, agreementId_session, agreementLotName, lotid }
            req.session.agreement_header = res.locals.agreement_header

            // supplier Qa end point 
        }

        const baseURL = `/tenders/projects/${req.session.projectId}/events/${req.session.eventId}/q-and-a`;
        const fetchData = await TenderApi.Instance(SESSION_ID).get(baseURL);
        appendData = { data: inboxData, QAs: fetchData.data, eventId: req.session['eventId'], eventType: req.session.eventManagement_eventType, isSupplierQA }
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

export const EVENT_MANAGEMENT_SUPPLIER_QA = async (req: express.Request, res: express.Response) => {
    const { supplier_qa_url } = req.session;
    req.session.eventId = supplier_qa_url != undefined ? supplier_qa_url.split('?')[1].split('eventId=')[1] : undefined
    req.session.projectId = supplier_qa_url != undefined ? supplier_qa_url.split('?')[1].split('projectId=')[1].split('&')[0] : undefined
    req.session['IsSupplierQA'] = true;
    if (req.session.eventId != undefined) {
        res.redirect(`/event/qa?projectId=${req.session.projectId}&eventId=${req.session.eventId}`);
    }
   
}

export const EVENT_MANAGEMENT_SUPPLIER_DATA_QA = async (req: express.Request, res: express.Response) => {
    const { supplier_qa_url } = req.session;
    req.session.eventId = supplier_qa_url != undefined ? supplier_qa_url.split('?')[1].split('eventId=')[1] : undefined
    req.session.projectId = supplier_qa_url != undefined ? supplier_qa_url.split('?')[1].split('projectId=')[1].split('&')[0] : undefined
    req.session['IsSupplierQA'] = true;
    res.redirect('/event/qa');
}