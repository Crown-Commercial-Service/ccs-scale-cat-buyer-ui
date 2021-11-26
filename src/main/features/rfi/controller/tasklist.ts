//@ts-nocheck
import * as express from 'express'
import * as cmsData from '../../../resources/content/RFI/rfiTaskList.json'

// RFI TaskList
export const GET_TASKLIST = (req: express.Request, res: express.Response) => {
   const lotId = req.session?.lotId;
   const agreementLotName = req.session.agreementLotName;
   var windowAppendData = { data: cmsData, lotId, agreementLotName }
   res.render('Tasklist', windowAppendData);
}