//@ts-nocheck
import * as express from 'express';
//import * as cmsData from '../../../resources/content/requirements/nameYourProject.json';
import * as cmsData from '../../../resources/content/MCF3/requirements/confirmation_review.json';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import procurementDetail from '../model/procurementDetail';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { HttpStatusCode } from '../../../errors/httpStatusCodes';
import moment from 'moment';
/**
 *
 * @param req
 * @param res
 * @GETController
 */
export const RFP_GET_CONFIRMATION_REVIEW = async (req: express.Request, res: express.Response) => {
  const { isEmptyProjectError } = req.session;
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
  };
  res.render('rfp-confirmation_review', viewData);
};

/**
 *
 * @param req
 * @param res
 * @POSTController
 */

export const RFP_POST_NAME_PROJECT = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { procid } = req.query;
  const { projectId ,eventId} = req.session;
  const name = req.body['rfi_projLongName'];
  const nameUpdateUrl = `tenders/projects/${procid}/name`;
  try {
    if (name) {
      const _body = {
        name: name,
      };
      const response = await TenderApi.Instance(SESSION_ID).put(nameUpdateUrl, _body);
      if (response.status == HttpStatusCode.OK) req.session.project_name = name;
      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/27`, 'Completed');
      res.redirect('/rfp/procurement-lead');
    } else {
      req.session['isEmptyProjectError'] = true;
      res.redirect('/rfp/name-your-project');
    }
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Tender Api - getting users from organization or from tenders failed',
      true,
    );
  }
};
//CAS-32
export const PUBLISH_DATE_MISMATCH = async (req: express.Request, res: express.Response) => {
  // const { SESSION_ID } = req.cookies; //jwt
   const projectId = req.session.projectId;
   const proc_id = req.session.projectId;
   const event_id = req.session.eventId;
   const { SESSION_ID } = req.cookies;
   const stage2_value = req.session.stage2_value;
   const agreementId_session = req.session.agreement_id;


   const eventType = req.session.eventManagement_eventType;

   let baseURL = `/tenders/projects/${proc_id}/events/${event_id}`;
   baseURL = baseURL + '/criteria';
   const keyDateselector = 'Key Dates';
   let selectedeventtype=req.session.selectedeventtype;
   try {

     const fetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(baseURL);
     const fetch_dynamic_api_data = fetch_dynamic_api?.data;
     const extracted_criterion_based = fetch_dynamic_api_data?.map(criterian => criterian?.id);

     let criterianStorage = [];
     for (const aURI of extracted_criterion_based) {

       const criterian_bas_url = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${aURI}/groups`;
       const fetch_criterian_group_data = await DynamicFrameworkInstance.Instance(SESSION_ID).get(criterian_bas_url);
       const criterian_array = fetch_criterian_group_data?.data;
       const rebased_object_with_requirements = criterian_array?.map(anItem => {
         const object = anItem;
         object['criterianId'] = aURI;
         return object;
       });

       criterianStorage.push(rebased_object_with_requirements);
     }

     criterianStorage = criterianStorage.flat();
     criterianStorage = criterianStorage.filter(AField => AField.OCDS.id === keyDateselector);
     const Criterian_ID = criterianStorage[0].criterianId;
     const prompt = criterianStorage[0].nonOCDS.prompt;
     const apiData_baseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${Criterian_ID}/groups/${keyDateselector}/questions`;

     const fetchQuestions = await DynamicFrameworkInstance.Instance(SESSION_ID).get(apiData_baseURL);
     let fetchQuestionsData = fetchQuestions.data;

     let publishDate = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 1").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;	
     let currentDate = moment(new Date(), 'DD/MM/YYYY').format("YYYY-MM-DD");
     publishDate = moment(publishDate, 'YYYY-MM-DD').format("YYYY-MM-DD");
    let warning = false;

     if(publishDate < currentDate) {
         warning = true;

         req.session.isTimelineRevert = true;
         if(eventType == 'FC' && req.session.agreement_id == 'RM1043.8') {
           if(stage2_value !== undefined && stage2_value === "Stage 2"){
             //Stage 2 --> DOS6
             await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/33`, 'Not started'); 
             await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/34`, 'Cannot start yet'); 
           } else {
             //Stage 1 --> DOS6
             //Journey need to be revert 34, 35
             await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/34`, 'Not started');
             await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/35`, 'Cannot start yet');
           }
         }
         else if(eventType == 'FC' && req.session.agreement_id == 'RM6187') {
          await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/36`, 'Not started'); 
          await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/37`, 'Cannot start yet'); 
        }
        if(req.session.agreement_id == 'RM1557.13' && eventType == 'FC'){
          await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/36`, 'Not started'); 
          await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/37`, 'Cannot start yet'); 
         }
         if(eventType == 'RFI' && (req.session.agreement_id == 'RM1557.13' || req.session.agreement_id == 'RM6187') ){
          await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/13`, 'Not started'); 
          await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/14`, 'Cannot start yet'); 
         }else if(eventType == 'DA' && req.session.agreement_id == 'RM6187') {
          await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/35`, 'Not started');
        await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/36`, 'Cannot start yet');
         }else if(eventType == 'EOI' && req.session.agreement_id == 'RM6187') {
          await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/23`, 'Not started'); 
           await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/24`, 'Cannot start yet');
        }

     } else {
         warning = false;
       }
     res.json({ warning: warning, eventType: eventType});

   } catch (error) {
      LoggTracer.errorLogger(
       res,
       error,
       `${req.headers.host}${req.originalUrl}`,
       null,
       TokenDecoder.decoder(SESSION_ID),
       'Tender Api - getting users from organization or from tenders failed',
       true,
     );
   }
 };
//CAS-32
 export const PUBLISH_DATE_MISMATCH_CANCEL = async (req: express.Request, res: express.Response) => {
   req.session.isTimelineRevert = false;
   res.sendStatus(200);
 };
