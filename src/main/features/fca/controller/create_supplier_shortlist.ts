//@ts-nocheck
import * as express from 'express';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { statusStepsDataFilter } from '../../../utils/statusStepsDataFilter';
import * as fcaCreateSupplierShortlistContent from '../../../resources/content/MCF3/fcaCreateSupplierSecondList.json';
//import * as fcaCreateSupplierShortlistContent from '../../../resources/content/MCF3/fcaCreateSupplierShortlist.json';

/**
 *
 * @Rediect
 * @param req
 * @param res
 *
 */
export const CREATE_SUPPLIER_SHORTLIST = async (req: express.Request, res: express.Response) => {
   
    
    const { SESSION_ID } = req.cookies;
    const { lotId, agreementLotName, eventId, projectId, agreement_id } = req.session;
    
    try {
        const {data: getEventsData} = await TenderApi.Instance(SESSION_ID).get(`tenders/projects/${projectId}/events`);
        let { data: journeySteps } = await TenderApi.Instance(SESSION_ID).get(`journeys/${eventId}/steps`);

        let btnBottom = false;
        if(agreement_id == 'RM6187') { //MCF3
            const overWritePaJoury = getEventsData.find(item => item.eventType == 'PA' && item.dashboardStatus == 'ASSESSMENT');
            if(overWritePaJoury)  {
                const bottomLinkChange = journeySteps.filter((el: any) => {
                    if(el.step == 1 || el.step == 80) {
                        if(el.state == 'Completed') {
                            return true;
                        }
                    }
                    return false;
                });
                if(bottomLinkChange.length > 0) { btnBottom = true; }
            }
        }
        
        journeySteps.forEach(function (element, i) {
            if(element.step == 75 && element.state == 'Cannot start yet') { element.state = 'Optional'; }
            if(element.step == 76 && element.state == 'Cannot start yet') { element.state = 'Optional'; }
            if(element.step == 77 && element.state == 'Cannot start yet') { element.state = 'Optional'; }
            if(element.step == 78 && element.state == 'Cannot start yet') { element.state = 'To do'; }
        });

        const agreementName = req.session.agreementName;
        const project_name = req.session.project_name;
        let agreementId_session = agreement_id;
        const lotid=lotId;
        // const { data: journeySteps } = await TenderApi.Instance(SESSION_ID).get(`journeys/${eventId}/steps`);
        
        statusStepsDataFilter(fcaCreateSupplierShortlistContent, journeySteps, 'FCA', agreement_id, projectId, eventId);
        res.locals.agreement_header = { agreementName, project_name, agreementId_session, agreementLotName, lotid };
        const releatedContent = req.session.releatedContent;
        const windowAppendData = { data: fcaCreateSupplierShortlistContent, lotId, agreementLotName, releatedContent, agreementId_session, btnBottom };
        // req.session.selectedRoute = 'RFI'
        // await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/78`, 'Not started');
        res.render('create_supplier_shortlist', windowAppendData);
        
    } catch (error) {
        LoggTracer.errorLogger(res, error, `${req.headers.host}${req.originalUrl}`, null, TokenDecoder.decoder(SESSION_ID), 'FCA - Journey service - Put failed - task list page', true);
    }
    //   res.render('fca_procurement', fcaProcurementOverviewScreenContent);
}
