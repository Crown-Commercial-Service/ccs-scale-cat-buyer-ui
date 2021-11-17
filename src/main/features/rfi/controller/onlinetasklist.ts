import * as express from 'express'
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import fileData from '../../../resources/content/RFI/rfionlineTaskList.json'
import { operations } from '../../../utils/operations/operations';
import { ErrorView } from '../../../common/shared/error/errorView';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';

// RFI TaskList
export const GET_ONLINE_TASKLIST = async (req: express.Request, res: express.Response) => {
   if (operations.isUndefined(req.query, 'agreement_id') || operations.isUndefined(req.query, 'proc_id') || operations.isUndefined(req.query, 'event_id')) {
      res.redirect(ErrorView.notfound)
   }
   else {
      var { agreement_id, proc_id, event_id } = req.query;
      let { SESSION_ID } = req.cookies;
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
         let select_default_data_from_fetch_dynamic_api = sorted_ascendingly;
         var display_fetch_data = {
            data: select_default_data_from_fetch_dynamic_api,
            agreement_id: agreement_id,
            file_data: fileData,
            proc_id: proc_id,
            event_id: event_id
         }
         res.render('onlinetasklist', display_fetch_data);
      } catch (error) {
         LoggTracer.errorLogger(res, error, `${req.headers.host}${req.originalUrl}`, null,
            TokenDecoder.decoder(SESSION_ID), "Agreement Service Api cannot be connected", true)
      }
   }
}
