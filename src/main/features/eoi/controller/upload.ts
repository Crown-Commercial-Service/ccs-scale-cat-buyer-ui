//@ts-nocheck
import * as express from 'express';
import * as cmsData from '../../../resources/content/eoi/offline-doc.json';

let tempArray = [];

// eoi Upload document
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
  res.render('uploadDocumentEoi', windowAppendData);
};

/**
 *
 * @param req
 * @param res
 * @POSTController
 */

export const POST_UPLOAD_DOC: express.Handler = (req: express.Request, res: express.Response) => {
  const { eoi_file_started } = req.body;
  if (eoi_file_started) {
    const { eoi_offline_document } = req.files;
    const multipleFileCheck = Array.isArray(eoi_offline_document);

    if (multipleFileCheck) {
      for (const file of eoi_offline_document) {
        tempArray.push(file);
      }
      res.redirect('/eoi/upload-doc');
    } else {
      tempArray.push(eoi_offline_document);
      res.redirect('/eoi/upload-doc');
    }
  } else res.render('error/500');
};

export const GET_REMOVE_FILES = (express.Handler = (req: express.Request, res: express.Response) => {
  const { file } = req.query;
  tempArray = tempArray.filter(afile => afile.name !== file);
  res.redirect('/eoi/upload-doc');
});
