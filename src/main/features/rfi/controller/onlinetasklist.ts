//@ts-nocheck
import * as express from 'express'
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import fileData from '../../../resources/content/RFI/rfionlineTaskList.json'
import { operations } from '../../../utils/operations/operations';
import { ErrorView } from '../../../common/shared/error/errorView';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { HttpStatusCode } from 'main/errors/httpStatusCodes';
import {ShouldEventStatusBeUpdated} from '../../shared/ShouldEventStatusBeUpdated';
// RFI TaskList
/**
 * 
 * @param req 
 * @param res 
 * @GETController
 */
export const GET_ONLINE_TASKLIST = async (req: express.Request, res: express.Response) => {
   // if (operations.isUndefined(req.query, 'agreement_id') || operations.isUndefined(req.query, 'proc_id') || operations.isUndefined(req.query, 'event_id')) {
   //    res.redirect(ErrorView.notfound)
   // }
   // else {
      const { agreement_id, projectId, eventId } = req.session;
      const { SESSION_ID } = req.cookies;
      const baseURL: any = `/tenders/projects/${projectId}/events/${eventId}/criteria`;
      try {
         const fetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(baseURL);
         const fetch_dynamic_api_data = fetch_dynamic_api?.data;
         const extracted_criterion_based = fetch_dynamic_api_data?.map((criterian: any) => criterian?.id);
         let criterianStorage: any = [];
         for (const aURI of extracted_criterion_based) {
            const criterian_bas_url = `/tenders/projects/${projectId}/events/${eventId}/criteria/${aURI}/groups`;
            const fetch_criterian_group_data = await DynamicFrameworkInstance.Instance(SESSION_ID).get(criterian_bas_url);
            const criterian_array = fetch_criterian_group_data?.data;
            const rebased_object_with_requirements = criterian_array?.map((anItem: any) => {
               const object = anItem;
               object['criterianId'] = aURI;
               return object;
            })
            criterianStorage.push(rebased_object_with_requirements)
         }
         criterianStorage = criterianStorage.flat();
         const sorted_ascendingly = criterianStorage.map((aCriterian: any) => {
            const object = aCriterian;
            object.OCDS['id'] = aCriterian.OCDS['id']?.split('Group ').join('');
            return object;
         }).sort((a, b) => (a.OCDS.id < b.OCDS.id ? -1 : 1)).map((aCriterian: any) => {
            const object = aCriterian;
            object.OCDS['id'] = `Group ${aCriterian.OCDS['id']}`;
            if(object.nonOCDS['mandatory'] === false)
               object.OCDS['description'] = object.OCDS['description']+' (Optional)'
            return object;
         });
         const select_default_data_from_fetch_dynamic_api = sorted_ascendingly;
         const lotId = req.session?.lotId;
         const agreementLotName = req.session.agreementLotName;
         let ExcludingKeyDates = select_default_data_from_fetch_dynamic_api.filter(AField => AField.OCDS.id !== "Group Key Dates");
         let text="";
         for (var i=0;i<ExcludingKeyDates.length;i++)
         {
            text=ExcludingKeyDates[i].OCDS.description;
            switch(text)
            {
               case "Who the buying organization is (Optional)":
                  ExcludingKeyDates[i].OCDS.description="The buying organisation (optional)";
                  ExcludingKeyDates[i].nonOCDS.task="Add who the procurement is for";
                  break;
               case "Where the work will be done":
                  ExcludingKeyDates[i].nonOCDS.task="Select location";
                  ExcludingKeyDates[i].OCDS.description="Where the supplied staff will work";
                  break;
               case "Terms and acronyms (Optional)":
                  ExcludingKeyDates[i].OCDS.description="Terms and acronyms (optional)";
                  break;
               case "Background for your procurement":
                  ExcludingKeyDates[i].nonOCDS.task="Add more information for suppliers";
                  break;
               case "Security and vetting requirements":
               ExcludingKeyDates[i].nonOCDS.task="Choose the highest level of clearance needed";
               break;
            }
         }
         const releatedContent = req.session.releatedContent;
         const display_fetch_data = {
            data: ExcludingKeyDates,
            agreement_id: agreement_id,
            file_data: fileData,
            proc_id: projectId,
            event_id: eventId,
            lotId,
            agreementLotName,
            releatedContent: releatedContent
         }
         res.render('onlinetasklist', display_fetch_data);
         // const response = await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/9`, 'Completed');
         // if (response.status == HttpStatusCode.OK){
            let flag=await ShouldEventStatusBeUpdated(eventId,10,req);
    if(flag)
    {
             await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/10`, 'In progress');
          }
      } catch (error) {
         LoggTracer.errorLogger(res, error, `${req.headers.host}${req.originalUrl}`, null,
            TokenDecoder.decoder(SESSION_ID), "Tenders Service Api cannot be connected", true)
      }
   }
//}
