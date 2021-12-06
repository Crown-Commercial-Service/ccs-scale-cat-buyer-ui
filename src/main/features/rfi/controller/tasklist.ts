//@ts-nocheck
import * as express from 'express'
import * as cmsData from '../../../resources/content/RFI/rfiTaskList.json'

// RFI TaskList
/**
 * 
 * @param req 
 * @param res 
 * @GETController
 */
export const GET_TASKLIST = (req: express.Request, res: express.Response) => {
   const lotId = req.session?.lotId;
   const agreementLotName = req.session.agreementLotName;


   const windowAppendData = { data: cmsData, lotId, agreementLotName }
     
   res.render('Tasklist', windowAppendData);
   
 
 
  
}