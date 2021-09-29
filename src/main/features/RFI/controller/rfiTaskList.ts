import * as express from 'express'
import * as cmsData from '../../../resources/content/RFI/rfiTaskList.json'

// RFI TaskList
export const RFI_TASKLIST = (req : express.Request, res : express.Response)=> {

   var {rfi_information} = req.cookies;
   var parsedJsondata = JSON.parse(rfi_information);

   var windowAppendData = {data : cmsData, project_header: parsedJsondata}
   res.render('Tasklist', windowAppendData); 
}