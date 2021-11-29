//@ts-nocheck
import * as express from 'express'
import * as cmsData from '../../../resources/content/RFI/rfiType.json'
import { ObjectModifiers } from '../util/operations/objectremoveEmptyString';
import { RFI_PATHS } from '../model/rficonstant'


// RFI TaskList
export const GET_TYPE = (req: express.Request, res: express.Response) => {

   const { agreement_id } = req.query;

   const relatedTitle = "Related content";
   const lotURL = "/agreement/lot?agreement_id="+req.session.agreement_id+"&lotNum="+req.session.lotId.replace(/ /g,"%20");
   const lotText = req.session.agreementName+', '+ req.session.agreementLotName;

   const windowAppendData = { data: cmsData, agreement_id: agreement_id, relatedTitle, lotURL, lotText }
   res.render('type', windowAppendData);
}


/**
 * @POSTController
 * @description
 * 
 */
//POST 'rfi/type'
export const POST_TYPE = (req: express.Request, res: express.Response) => {
   let { agreement_id } = req.query;
   let projectId = req.session['projectId']
   let event_id = req.session['eventId'];



   let filtered_body_content_removed_rfi_key = ObjectModifiers._deleteKeyofEntryinObject(req.body, 'choose_rfi_type');

   let { ccs_rfi_type } = filtered_body_content_removed_rfi_key;

   switch (ccs_rfi_type) {
      case 'all_online':
         let redirect_address = `/rfi/online-task-list?agreement_id=${agreement_id}&proc_id=${projectId}&event_id=${event_id}`;
         res.redirect(redirect_address);
         break;

      case 'all_offline':
         const newAddress = RFI_PATHS.GET_UPLOAD_DOC;
         res.redirect(newAddress);
         break;

      default: res.redirect('/404');
   }

}