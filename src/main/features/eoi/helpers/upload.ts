//@ts-nocheck
import * as express from 'express';
import * as cmsData from '../../../resources/content/eoi/offline-doc.json';
import * as mcf3cmsData from '../../../resources/content/MCF3/eoi/offline-doc.json';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';
import util from 'util';
import stream from 'stream';
import fileSystem from 'fs';
import { logConstant } from '../../../common/logtracer/logConstant';

export const FILEUPLOADHELPER: express.Handler = async (
  req: express.Request,
  res: express.Response,
  fileError: boolean,
  errorList,
  type = 'eoi'
) => {
  const lotId = req.session?.lotId;
  const { SESSION_ID } = req.cookies;
  const agreementLotName = req.session.agreementLotName;
  const ProjectId = req.session['projectId'];
  const EventId = req.session['eventId'];
  const { file_id } = req.query;
  const { fileDuplicateError, UploadError } = req.session;
  if (file_id !== undefined) {
    try {
      const FileDownloadURL = `/tenders/projects/${ProjectId}/events/${EventId}/documents/${file_id}`;
      const FetchDocuments = await DynamicFrameworkInstance.file_dowload_Instance(SESSION_ID).get(FileDownloadURL, {
        responseType: 'arraybuffer',
      });
      const file = FetchDocuments;
      const fileName = file.headers['content-disposition'].split('filename=')[1].split('"').join('');
      const fileData = file.data;
      const type = file.headers['content-type'];
      const ContentLength = file.headers['content-length'];
      res.status(200);
      res.set({
        'Cache-Control': 'no-cache',
        'Content-Type': type,
        'Content-Length': ContentLength,
        'Content-Disposition': 'attachment; filename=' + fileName,
      });
      res.send(fileData);
    } catch (error) {
      LoggTracer.errorLogger(
        res,
        error,
        null,
        null,
        null,
        null,
        false
      );
    }
  } else {
    try {
      const FileuploadBaseUrl = `/tenders/projects/${ProjectId}/events/${EventId}/documents`;
      const FetchDocuments = await DynamicFrameworkInstance.Instance(SESSION_ID).get(FileuploadBaseUrl);
      const FETCH_FILEDATA = FetchDocuments.data;

      //CAS-INFO-LOG
      LoggTracer.infoLogger(FETCH_FILEDATA, logConstant.getUploadDocument, req);
      const TOTALSUM = FETCH_FILEDATA.reduce((a, b) => a + (b['fileSize'] || 0), 0);
      const releatedContent = req.session.releatedContent;

      const agreementId_session = req.session.agreement_id;
      let forceChangeDataJson;
      if (agreementId_session == 'RM6187') {
        //MCF3
        forceChangeDataJson = mcf3cmsData;
      } else {
        forceChangeDataJson = cmsData;
      }
      if (UploadError) {
        errorList.push({ text: 'Please attach the file before upload. ', href: '#eoi_offline_document' });
      }
      let windowAppendData = {
        lotId,
        agreementLotName,
        data: forceChangeDataJson,
        files: FETCH_FILEDATA,
        releatedContent: releatedContent,
        storage: TOTALSUM,
        agreementId_session: req.session.agreement_id,
        UploadError,
        errorlist: errorList,
      };
      if (fileDuplicateError) {
        fileError = true;
        errorList.push({ text: 'The chosen file already exist ', href: '#eoi_offline_document' });
        delete req.session['fileDuplicateError'];
      }

      if (fileError && errorList !== null) {
        windowAppendData = Object.assign({}, { ...windowAppendData, fileError: 'true', errorlist: errorList });
      }

      //CAS-INFO-LOG
      LoggTracer.infoLogger(null, logConstant.eoiUploadDocumentPageLog, req);

      res.render('uploadDocumentEoi', windowAppendData);
    } catch (error) {
      LoggTracer.errorLogger(
        res,
        error,
        null,
        null,
        null,
        null,
        false
      );
    }
  }
};
