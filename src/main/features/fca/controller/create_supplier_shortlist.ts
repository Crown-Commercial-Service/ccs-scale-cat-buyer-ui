//@ts-nocheck
import * as express from 'express';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { statusStepsDataFilter } from '../../../utils/statusStepsDataFilter';
import * as fcaCreateSupplierShortlistContent from '../../../resources/content/MCF3/fcaCreateSupplierSecondList.json';
//import * as fcaCreateSupplierShortlistContent from '../../../resources/content/MCF3/fcaCreateSupplierShortlist.json';
import { ShouldEventStatusBeUpdated } from '../../shared/ShouldEventStatusBeUpdated';

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

        let flag = await ShouldEventStatusBeUpdated(eventId, 75, req);
    if(flag) { await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/75`, 'Not started'); }
   
    let { data: journeyStepsNameJourney } = await TenderApi.Instance(SESSION_ID).get(`journeys/${eventId}/steps`);
    
    let nameJourneysts = journeyStepsNameJourney.filter((el: any) => {
      if(el.step == 75 && el.state == 'Completed') return true;
      return false;
    });
  
    if(nameJourneysts.length > 0){
      
      let addcontsts = journeyStepsNameJourney.filter((el: any) => { 
        if(el.step == 78) return true;
        return false;
      });
     
      if(addcontsts[0].state == 'Cannot start yet'){
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/78`, 'Not started'); 
      }
      
    }else{
     
      let flagaddCont = await ShouldEventStatusBeUpdated(eventId, 78, req);
      if(flagaddCont) await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/78`, 'Cannot start yet'); 
    }


        const {data: getEventsData} = await TenderApi.Instance(SESSION_ID).get(`tenders/projects/${projectId}/events`);
        let { data: journeySteps } = await TenderApi.Instance(SESSION_ID).get(`journeys/${eventId}/steps`);

        let btnBottom = false;
        if(agreement_id == 'RM6187') { //MCF3
            const overWritePaJoury = getEventsData.find(item => item.eventType == 'PA' && item.dashboardStatus == 'ASSESSMENT');
            if(overWritePaJoury)  {
                const bottomLinkChange = journeySteps.filter((el: any) => {
                    if(el.step == 1 || el.step == 80) {
                       // if(el.state == 'Completed') {
                            return true;
                       // }
                    }
                    return false;
                });
                if(bottomLinkChange.length > 0) { btnBottom = true; }
            }
        }

        journeySteps.forEach(function (element, i) {
            //if(element.step == 75 && element.state == 'Cannot start yet') { element.state = 'Not started'; }
            if(element.step == 76 && element.state == 'Cannot start yet') { element.state = 'Optional'; }
            if(element.step == 77 && element.state == 'Cannot start yet') { element.state = 'Optional'; }
            //if(element.step == 78 && element.state == 'Cannot start yet') { element.state = 'Cannot start yet'; }
        });

        const agreementName = req.session.agreementName;
        const project_name = req.session.project_name;
        let agreementId_session = agreement_id;
        const lotid=lotId;

        // const { data: journeySteps } = await TenderApi.Instance(SESSION_ID).get(`journeys/${eventId}/steps`);
        
        statusStepsDataFilter(fcaCreateSupplierShortlistContent, journeySteps, 'FCA', agreement_id, projectId, eventId);
        res.locals.agreement_header = { agreementName, project_name, projectId, agreementId_session, agreementLotName, lotid };
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
