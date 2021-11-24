
import * as express from 'express';
import * as cmsData from '../../../resources/content/RFI/offline-doc.json'

// RFI Upload document
export const GET_UPLOAD_DOC: express.Handler = (req: express.Request, res: express.Response) => {
      const lotId = req.session?.lotId;
      const agreementLotName = req.session.agreementLotName;
      var windowAppendData = { lotId, agreementLotName, data: cmsData }
      res.render('uploadDocument', windowAppendData);
}