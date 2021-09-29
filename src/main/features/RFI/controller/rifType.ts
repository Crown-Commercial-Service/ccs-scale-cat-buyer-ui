import * as express from 'express'
import * as cmsData from '../../../resources/content/RFI/rfiType.json'

// RFI TaskList
export const RFI_TYPE = (req : express.Request, res : express.Response)=> {
   var windowAppendData = {data : cmsData}
   res.render('features/RFI/type', windowAppendData); 
}