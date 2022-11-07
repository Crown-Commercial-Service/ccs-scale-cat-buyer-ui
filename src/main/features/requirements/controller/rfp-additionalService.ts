//@ts-nocheck
import * as express from 'express';
import * as cmsData from '../../../resources/content/requirements/rfp-additionalService.json';
import procurementDetail from '../model/procurementDetail';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { HttpStatusCode } from '../../../errors/httpStatusCodes';

/**
 *
 * @param req
 * @param res
 * @GETController
 */
export const RFP_GET_ADDITIONAL_SERVICES = async (req: express.Request, res: express.Response) => {
  const { isEmptyProjectError } = req.session;
  const { choosenViewPath } = req.session;
  req.session['isEmptyProjectError'] = false;
  const procurements = req.session.procurements;
  const lotId = req.session.lotId;
  const procurement: procurementDetail = procurements.find((proc: any) => proc.defaultName.components.lotId === lotId);
  const project_name = req.session.project_name;
  const agreementLotName = req.session.agreementLotName;
  const releatedContent = req.session.releatedContent;
  const viewData: any = {
    data: cmsData,
    procId: procurement.procurementID,
    projectLongName: project_name,
    lotId,
    agreementLotName,
    error: isEmptyProjectError,
    releatedContent: releatedContent,
    choosenViewPath: choosenViewPath,
  };
  res.render('rfp-additionalService', viewData);
};

/**
 *
 * @param req
 * @param res
 * @POSTController
 */

export const RFP_POST_ADDITIONAL_SELECT_SERVICES = async (req: express.Request, res: express.Response) => {
    
    const  rfp_selected_services = req.body;
    

   const { eventId } = req.session;
   const { SESSION_ID } = req.cookies;
    
     //req.session.rfp_selected_services = rfp_selected_services;
     
     await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/30`, 'Completed');
     await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/31`, 'Not started');
     res.redirect('/rfp/task-list');


     // const assessmentId = 1;
     // let Weightings=[];
     // const toolId = req.session['CapAss'].toolId;
     //  const dimensions = await GET_DIMENSIONS_BY_ID(SESSION_ID, toolId);
          /*for(let i=1;i<=5;i++)
          {
              let dim=dimensions.filter(x=>x["dimension-id"] === i)
              Weightings.push(...dim)
          }
     for (var dimension of Weightings) {
        const body = {
          name: dimension.name,
          weighting: req.body[dimension['dimension-id']],
          includedCriteria: dimension.evaluationCriteria
        };
        
        await TenderApi.Instance(SESSION_ID).put(
          `/assessments/${assessmentId}/dimensions/${dimension['dimension-id']}`,
          body,
        );
    
        
      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/1`, 'Completed');
      let flag = await ShouldEventStatusBeUpdated(eventId, 47, req);
      if (flag) {
      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/47`, 'Not started');
      }
    }*/
    
    // if(rfp_selected_services.selected_services == undefined){
    //   req.session['isEmptySelectedServicesError'] = true;
    //   res.redirect('/rfp/selected_service');
    // }else{
    //   await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/30`, 'Completed');
    //   await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/31`, 'Not started');
    //   res.redirect('/rfp/task-list');
    // }
     


};
