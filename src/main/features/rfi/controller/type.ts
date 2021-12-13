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
   const releatedContent = req.session.releatedContent 
   const windowAppendData = { data: cmsData, agreement_id: agreement_id, releatedContent }
   res.render('type', windowAppendData);
}


/**
 * @POSTController
 * @description
 * 
 */
//POST 'rfi/type'
/**
 * 
 * @param req 
 * @param res 
 * @GETController
 */

export const POST_TYPE = (req: express.Request, res: express.Response) => {
   const { agreement_id } = req.query;
   const projectId = req.session['projectId']
   const event_id = req.session['eventId'];

   const filtered_body_content_removed_rfi_key = ObjectModifiers._deleteKeyofEntryinObject(req.body, 'choose_rfi_type');

   const { ccs_rfi_type } = filtered_body_content_removed_rfi_key;

   switch (ccs_rfi_type) {
      case 'all_online':
         // eslint-disable-next-line no-case-declarations
         const redirect_address = `/rfi/online-task-list?agreement_id=${agreement_id}&proc_id=${projectId}&event_id=${event_id}`;
         res.redirect(redirect_address);
         break;

      case 'all_offline':
         // eslint-disable-next-line no-case-declarations
         const newAddress = RFI_PATHS.GET_OFFLINE;
         res.redirect(newAddress);
         break;

      default: res.redirect('/404');
   }

}