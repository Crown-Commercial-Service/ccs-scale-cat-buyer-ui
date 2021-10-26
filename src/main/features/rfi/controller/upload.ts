import * as express from 'express';


// RFI Upload document
export const GET_UPLOAD_DOC : express.Handler = (req : express.Request, res : express.Response)=> {
      res.render('uploadDocument'); 
}