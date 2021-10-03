import * as express from 'express'
import * as cmsData from '../../../resources/content/RFI/rfiType.json'

// RFI TaskList
export const GET_TYPE = (req : express.Request, res : express.Response)=> {
   var windowAppendData = {data : cmsData}
   res.render('type', windowAppendData); 
}