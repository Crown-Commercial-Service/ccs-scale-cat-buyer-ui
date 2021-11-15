import express from 'express'
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';
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
         let sorted_ascendingly = criterianStorage.map((aCriterian: any) => {
            let object = aCriterian;
            object.OCDS['id'] = aCriterian.OCDS['id']?.split('Group ').join('');
            return object;
         }).sort((current_cursor: any, iterator_cursor: any) => Number(current_cursor.OCDS['id']) - Number(iterator_cursor.OCDS['id'])).map((aCriterian: any) => {
            var object = aCriterian;
            object.OCDS['id'] = `Group ${aCriterian.OCDS['id']}`
            return object;
         });
         let current_cursor = sorted_ascendingly?.findIndex((pointer: any) => pointer.OCDS['id'] === group_id);
         let check_for_overflowing: Boolean = current_cursor < sorted_ascendingly.length;
         if (check_for_overflowing) {
            let next_cursor = current_cursor + 1;
            let next_cursor_object = sorted_ascendingly[next_cursor];
            let next_group_id = next_cursor_object.OCDS['id'];
            let next_criterian_id = next_cursor_object['criterianId'];
            let base_url = `/rfi/questions?agreement_id=${agreement_id}&proc_id=${proc_id}&event_id=${event_id}&id=${next_criterian_id}&group_id=${next_group_id}`
            console.log(id)
            res.redirect(base_url)
         }
         else {
            // do some logic here 
         }
      } catch (error) {
         logger.log("Something went wrong, please review the logit error log for more information")
         delete error?.config?.['headers'];
         let Logmessage = {
            "Person_id": TokenDecoder.decoder(SESSION_ID),
            "error_location": "questions healper class",
            "sessionId": "null",
            "error_reason": "Tender agreement failed to be added",
            "exception": error
         }
         let Log = new LogMessageFormatter(
            Logmessage.Person_id,
            Logmessage.error_location,
            Logmessage.sessionId,
            Logmessage.error_reason,
            Logmessage.exception
         )
         LoggTracer.errorTracer(Log, res);
      }
   }
}