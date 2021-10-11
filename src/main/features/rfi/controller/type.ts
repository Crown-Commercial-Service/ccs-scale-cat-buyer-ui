import * as express from 'express'
import * as cmsData from '../../../resources/content/RFI/rfiType.json'
import { ObjectModifiers } from '../util/operations/objectremoveEmptyString';

// RFI TaskList
export const GET_TYPE = (req : express.Request, res : express.Response)=> {
   var {agreement_id} = req.query;
   var windowAppendData = {data : cmsData, agreement_id: agreement_id}
   res.render('type', windowAppendData); 
}


/**
 * @POSTController
 * @description
 * 
 */

//POST 'rfi/type'
export const POST_TYPE = (req : express.Request, res : express.Response)=> {
   let {agreement_id} = req.query;
   let filtered_body_content_removed_rfi_key =    ObjectModifiers._deleteKeyofEntryinObject(req.body, 'choose_rfi_type');

   let {ccs_rfi_type} = filtered_body_content_removed_rfi_key;

   switch(ccs_rfi_type){
      case 'all_online':
         let redirect_address = `/rfi/online-task-list?agreement_id=${agreement_id}`;
          res.redirect(redirect_address);
      break;

      case 'all_offline':
         // implement the logic here. 
      break;

      default: res.redirect('/404');
   }
  
}