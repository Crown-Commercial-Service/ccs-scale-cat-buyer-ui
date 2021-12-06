//@ts-nocheck
import express from 'express'
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
      const baseURL: any = `/tenders/projects/${proc_id}/events/${event_id}/criteria`;
      try {
         const fetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(baseURL);
         const fetch_dynamic_api_data = fetch_dynamic_api?.data;
         const extracted_criterion_based = fetch_dynamic_api_data?.map((criterian: any) => criterian?.id);
         let criterianStorage: any = [];
         for (const aURI of extracted_criterion_based) {
            const criterian_bas_url = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${aURI}/groups`;
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
         criterianStorage = criterianStorage.filter(AField => AField.OCDS.id !== "Key Dates")
         const sorted_ascendingly = criterianStorage.map((aCriterian: any) => {
            const object = aCriterian;
            object.OCDS['id'] = aCriterian.OCDS['id']?.split('Group ').join('');
            return object;
         }).sort((current_cursor: any, iterator_cursor: any) => Number(current_cursor.OCDS['id']) - Number(iterator_cursor.OCDS['id'])).map((aCriterian: any) => {
            const object = aCriterian;
            object.OCDS['id'] = `Group ${aCriterian.OCDS['id']}`
            return object;
         });
         const current_cursor = sorted_ascendingly?.findIndex((pointer: any) => pointer.OCDS['id'] === group_id);
         const check_for_overflowing: boolean = current_cursor < sorted_ascendingly.length - 1;
         if (check_for_overflowing) {
            const next_cursor = current_cursor + 1;
            const next_cursor_object = sorted_ascendingly[next_cursor];
            const next_group_id = next_cursor_object.OCDS['id'];
            const next_criterian_id = next_cursor_object['criterianId'];
            const base_url = `/rfi/questions?agreement_id=${agreement_id}&proc_id=${proc_id}&event_id=${event_id}&id=${next_criterian_id}&group_id=${next_group_id}`
            res.redirect(base_url)
         }
         else {
            res.redirect('/rfi/rfi-tasklist')
         }
      } catch (error) {
         logger.log("Something went wrong in the RFI Journey, please review the logit error log for more information")
         LoggTracer.errorLogger(res, error, "questions healper class", null,
            TokenDecoder.decoder(SESSION_ID), "Tender agreement failed to be added", true)
      }
   }
}