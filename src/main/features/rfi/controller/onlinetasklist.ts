import * as express from 'express'
import * as cmsData from '../../../resources/content/RFI/rfionlineTaskList.json'

// RFI TaskList
export const GET_ONLINE_TASKLIST = (req : express.Request, res : express.Response)=> {
   var {agreement_id} = req.query;
   var windowAppendData = {data : cmsData, agreement_id: agreement_id}
   res.render('onlinetasklist', windowAppendData); 
}