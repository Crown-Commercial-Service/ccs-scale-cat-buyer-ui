//@ts-nocheck
import * as express from 'express';
import * as cmsData from '../../../resources/content/RFI/offline-doc.json';

let tempArray = [];

// RFI Upload document
/**
 *
 * @param req
 * @param res
 * @GETController
 */

export const GET_UPLOAD_DOC: express.Handler = (req: express.Request, res: express.Response) => {
  const lotId = req.session?.lotId;
  const agreementLotName = req.session.agreementLotName;
  const windowAppendData = { lotId, agreementLotName, data: cmsData, files: tempArray };
  res.render('uploadDocument', windowAppendData);
};

/**
 *
 * @param req
 * @param res
 * @POSTController
 */

export const POST_UPLOAD_DOC: express.Handler = (req: express.Request, res: express.Response) => {
  const { rfi_file_started } = req.body;
  if (rfi_file_started) {
    const { rfi_offline_document } = req.files;
    const multipleFileCheck = Array.isArray(rfi_offline_document);

    if (multipleFileCheck) {
      for (const file of rfi_offline_document) {
        tempArray.push(file);
      }
      res.redirect('/rfi/upload-doc');
    } else {
      tempArray.push(rfi_offline_document);
      res.redirect('/rfi/upload-doc');
    }
  } else res.render('error/500');
};

export const GET_REMOVE_FILES = (express.Handler = (req: express.Request, res: express.Response) => {
  const { file } = req.query;
  tempArray = tempArray.filter(afile => afile.name !== file);
  res.redirect('/rfi/upload-doc');
});
