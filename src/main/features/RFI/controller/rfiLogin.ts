import * as express from 'express'

// RFI Loging
export const RFI_LOGIN = (req : express.Request, res : express.Response)=> {
   res.render('login'); 
}