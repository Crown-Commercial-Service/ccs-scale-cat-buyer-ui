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
    const isSupplierQA = req.session['IsSupplierQA'];
    let appendData: any;
    try {
        res.locals.agreement_header = req.session.agreement_header
        const baseURL = `/tenders/projects/${req.session.projectId}/events/${req.session.eventId}/q-and-a`;
        const fetchData = await TenderApi.Instance(SESSION_ID).get(baseURL);
        if (isSupplierQA != undefined && isSupplierQA) {
            //let eventType: string, title: string, lotid: string, agreementName: string, agreementLotName: string, agreementId_session: string, projectName: string, status: string, eventId: string;
            const baseActiveEventsURL = `/tenders/projects`
            const historicalEvents: ActiveEvents[] = []
            const retrieveProjetActiveEventsPromise = TenderApi.Instance(SESSION_ID).get(baseActiveEventsURL)
            retrieveProjetActiveEventsPromise
                .then(async (data) => {
                    const events: ActiveEvents[] = data.data.sort((a: { projectId: number }, b: { projectId: number }) => (a.projectId < b.projectId) ? 1 : -1)
                    for (let i = 0; i < events.length; i++) {
                        // eventType = RFI & EOI (Active and historic events)
                        const eventsURL = `tenders/projects/${events[i].projectId}/events`;
                        let getEvents = await TenderApi.Instance(SESSION_ID).get(eventsURL);
                        let getEventsData = getEvents.data;
                        for (let j = 0; j < getEventsData.length; j++) {
                            let singleEvent: ActiveEvents = {
                                projectId: events[i].projectId,
                                projectName: events[i].projectName,
                                agreementId: events[i].agreementId,
                                agreementName: events[i].agreementName,
                                lotId: events[i].lotId,
                                lotName: events[i].lotName,
                                activeEvent: getEventsData[j]
                            }
                            historicalEvents.push(singleEvent)
                            //let singleEvent=undefined;
                            //*NOTE THIS CONDATION ADDED FOR G-CLOUD EVENT NOT TO DISPLAY
                            if (getEventsData[j].id == req.session.eventId) {
                                let ttt = events[i].agreementName;
                                ttt = ttt;
                                //agreementName = events[i].agreementName
                                //agreementLotName = events[i].lotName
                                //agreementId_session = events[i].agreementId
                                //status = events[i]?.activeEvent?.status?.toLowerCase()
                                //projectName = events[i].projectName
                                //eventId = getEventsData[j].id.toString()
                                //eventType = getEventsData[j].eventType
                                //projectId = events[i].projectId
                                //lotid = events[i].lotId
                                //title = getEventsData[j].title
                                // end_date = events[i]?.activeEvent?.tenderPeriod?.endDate
                            }
                        }
                    }
                    let filterData = historicalEvents.filter(event => event.projectId === req.session.projectId && event.activeEvent.id == req.session.eventId);
                    filterData = filterData;
                    appendData = { data: inboxData, QAs: fetchData.data, eventId: req.session['eventId'], eventType: req.session.eventManagement_eventType, isSupplierQA }
                    res.render('viewQA', appendData)
                })
                .catch(err => {
                    // LoggTracer.errorLogger(
                    //   res,
                    //   err,
                    //   `${req.headers.host}${req.originalUrl}`,
                    //   state,
                    //   TokenDecoder.decoder(SESSION_ID),
                    //   'Tenders API for getting the list of Active Events',
                    //   false,
                    // );
                });
           

            // supplier Qa end point 
        } else {
            appendData = { data: inboxData, QAs: fetchData.data, eventId: req.session['eventId'], eventType: req.session.eventManagement_eventType, isSupplierQA }
            res.render('viewQA', appendData)
        }


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
    req.session.eventId = supplier_qa_url != undefined ? atob(supplier_qa_url.split('?')[1].split('eventId=')[1]) : undefined
    req.session.projectId = supplier_qa_url != undefined ? atob(supplier_qa_url.split('?')[1].split('projectId=')[1].split('&')[0]) : undefined
    req.session['IsSupplierQA'] = true;
    
    if (req.session.eventId != undefined) {
        res.redirect(`/event/qa?projectId=${req.session.projectId}&eventId=${req.session.eventId}`);
    }
}

export const EVENT_MANAGEMENT_SUPPLIER_DATA_QA = async (req: express.Request, res: express.Response) => {
    const { supplier_qa_url } = req.session;
    req.session.eventId = supplier_qa_url != undefined ? atob(supplier_qa_url.split('?')[1].split('eventId=')[1]) : undefined
    req.session.projectId = supplier_qa_url != undefined ? atob(supplier_qa_url.split('?')[1].split('projectId=')[1].split('&')[0]) : undefined
    req.session['IsSupplierQA'] = true;
    res.redirect('/event/qa');
}