import * as express from 'express'
import * as cmsData from '../../../resources/content/RFI/rfiTaskList.json'

// RFI TaskList
export const GET_TASKLIST = (req : express.Request, res : express.Response)=> {
   var windowAppendData = {data : cmsData}
   res.render('Tasklist', windowAppendData); 
}