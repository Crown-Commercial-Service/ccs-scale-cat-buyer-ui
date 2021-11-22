import * as express from 'express';


// RFI Upload document
export const GET_UPLOAD_DOC: express.Handler = (req: express.Request, res: express.Response) => {
      const lotId = req.session?.lotId;
      const agreementLotName = req.session.agreementLotName;
      var windowAppendData = { lotId, agreementLotName }
      res.render('uploadDocument', windowAppendData);
}