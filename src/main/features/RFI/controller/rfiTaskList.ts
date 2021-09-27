import * as express from 'express'

// RFI TaskList
export const RFI_TASKLIST = (req : express.Request, res : express.Response)=> {
   res.render('features/RFI/Tasklist'); 
}