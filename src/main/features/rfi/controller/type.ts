import * as express from 'express'
import * as cmsData from '../../../resources/content/RFI/rfiType.json'

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

   // do something else 
   let redirect_address = `/rfi/online-task-list?agreement_id=${agreement_id}`;
   res.redirect(redirect_address);
}