import * as express from 'express'
import * as cmsData from '../../../resources/content/RFI/rfionlineTaskList.json'

// RFI TaskList
export const RFI_ONLINE_TASKLIST = (req : express.Request, res : express.Response)=> {
   var windowAppendData = {data : cmsData}
   res.render('onlinetasklist', windowAppendData); 
}