import { TenderApi } from '@common/util/fetch/procurementService/TenderApiInstance';
import express from 'express'
import { HttpStatusCode } from 'main/errors/httpStatusCodes';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('questions healper');
/**
 * @Helper
 * helps with question controller to redirect
 */


export class QuestionHelper {

   static AFTER_UPDATINGDATA = async (ErrorView: any, DynamicFrameworkInstance: any, proc_id: any, event_id: any, SESSION_ID: string, group_id: any, agreement_id: any, id: any, res: express.Response) => {
      /**
             * @Path
             * @Next
             * Sorting and following to the next path
             */
      let baseURL: any = `/tenders/projects/${proc_id}/events/${event_id}/criteria`;
      try {
         let fetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(baseURL);
         let fetch_dynamic_api_data = fetch_dynamic_api?.data;
         let extracted_criterion_based = fetch_dynamic_api_data?.map((criterian: any) => criterian?.id);
         var criterianStorage: any = [];
         for (let aURI of extracted_criterion_based) {
            let criterian_bas_url = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${aURI}/groups`;
            let fetch_criterian_group_data = await DynamicFrameworkInstance.Instance(SESSION_ID).get(criterian_bas_url);
            let criterian_array = fetch_criterian_group_data?.data;
            let rebased_object_with_requirements = criterian_array?.map((anItem: any) => {
               let object = anItem;
               object['criterianId'] = aURI;
               return object;
            })
            criterianStorage.push(rebased_object_with_requirements)
         }
         criterianStorage = criterianStorage.flat();
         const sorted_ascendingly = criterianStorage
            .map((aCriterian: any) => {          
                  const object = aCriterian;
                  let tempId = object.criterianId.split('Criterion ').join('')+'000'
                  if(object.nonOCDS['mandatory'] === false)
                     object.OCDS['description'] = object.OCDS['description']+' (Optional)'
                  object.OCDS['sortId'] =Number(tempId)+Number(aCriterian.OCDS['id']?.split('Group ').join(''))
                  if(!isNaN(object.OCDS['sortId']) )          
                  return object;
            })
            .sort((a: any, b: any) => (a.OCDS.sortId < b.OCDS.sortId ? -1 : 1))
            .filter((obj:any) => obj != undefined);
         let current_cursor = sorted_ascendingly?.findIndex((pointer: any) => pointer.OCDS['id'] === group_id && pointer.criterianId === id);
         let check_for_overflowing: Boolean = current_cursor < sorted_ascendingly.length - 1;
         if (check_for_overflowing) {
            let next_cursor = current_cursor + 1;
            let next_cursor_object = sorted_ascendingly[next_cursor];
            let next_group_id = next_cursor_object.OCDS['id'];
            let next_criterian_id = next_cursor_object['criterianId'];
            let base_url = `/eoi/questions?agreement_id=${agreement_id}&proc_id=${proc_id}&event_id=${event_id}&id=${next_criterian_id}&group_id=${next_group_id}`
            res.redirect(base_url)
         }
         else {
            const response = await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/10`, 'Completed');
            if (response.status == HttpStatusCode.OK) {
               await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/21`, 'Optional');
               await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/22`, 'Not started');
            }
            res.redirect('/eoi/eoi-tasklist')
         }
      } catch (error) {
         logger.log("Something went wrong in the EOI Journey, please review the logit error log for more information")
         LoggTracer.errorLogger(res, error, "questions healper class", null,
            TokenDecoder.decoder(SESSION_ID), "Tender agreement failed to be added", true)
      }
   }
}