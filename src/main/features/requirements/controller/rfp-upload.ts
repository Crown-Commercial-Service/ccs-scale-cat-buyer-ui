//@ts-nocheck
import * as express from 'express';
import FormData from 'form-data';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { TenderApi } from '../../../common/util/fetch/tenderService/tenderApiInstance';
import { FILEUPLOADHELPER } from '../helpers/upload';
import { FileValidations } from '../util/file/filevalidations';
import * as cmsData from '../../../resources/content/requirements/offline-doc.json';
import { logConstant } from '../../../common/logtracer/logConstant';

import {ShouldEventStatusBeUpdated} from '../../shared/ShouldEventStatusBeUpdated';
let tempArray = [];

// requirements Upload document
/**
 *
 * @param req
 * @param res
 * @GETController
 */

export const RFP_GET_UPLOAD_DOC: express.Handler = (req: express.Request, res: express.Response) => {
  FILEUPLOADHELPER(req, res, false, null);
};

/**
 *
 * @param req
 * @param res
 * @POSTController
 */

export const RFP_POST_UPLOAD_DOC: express.Handler = async (req: express.Request, res: express.Response) => {
  let { selectedRoute,stage2_value } = req.session;
  if (selectedRoute === 'FC') selectedRoute = 'RFP';
  if (selectedRoute === 'dos') selectedRoute = 'RFP';
  const selRoute = selectedRoute.toLowerCase();
  const file_started = req.body[`${selRoute}_file_started`];
  const { SESSION_ID } = req.cookies;
  const ProjectId = req.session['projectId'];
  const EventId = req.session['eventId'];
  const journeyStatus = req.session['journey_status'];

  if (req.files != undefined && req.files != null) {
    const FILE_PUBLISHER_BASEURL = `/tenders/projects/${ProjectId}/events/${EventId}/documents`;
    const FileFilterArray = [];

    if (file_started) {
      const offline_document = req.files[`${selRoute}_offline_document`] || req.files[`${selRoute}_attachment_document`];

      const multipleFileCheck = Array.isArray(offline_document);
      if (multipleFileCheck) {
        
        for (const file of offline_document) {
          const fileName = file.name;
          const fileMimeType = file.mimetype;
          const fileSize = file.size;

          const validateMimeType = FileValidations.formatValidation(fileMimeType);
          const validateFileSize = FileValidations.sizeValidation(fileSize);

          if (validateMimeType && validateFileSize) {
            const formData = new FormData();
            formData.append('data', file.data, {
              contentType: file.mimetype,
              filename: file.name,
            });
            if(stage2_value == 'Stage 2'){
              formData.append('description', 'mandatorysecond');
            }else{
              formData.append('description', 'mandatorysecond');
            }
            // formData.append('description', "mandatorysecond");
            formData.append('audience', 'supplier');
            const formHeaders = formData.getHeaders();
            try {
              // ------file duplicate check start
            const FetchDocuments = await DynamicFrameworkInstance.Instance(SESSION_ID).get(FILE_PUBLISHER_BASEURL);
            const FETCH_FILEDATA = FetchDocuments.data;
            
            //CAS-INFO-LOG 
            LoggTracer.infoLogger(FETCH_FILEDATA, logConstant.getUploadDocument, req);
            
            let duplicateFile = false;
            for(const item of FETCH_FILEDATA){
              // if (item.description === "mandatorysecond") {
                if(item.fileName == file.name){
                  duplicateFile = true;
                }
              // }
            }
            // ------file duplicate check end
            if(duplicateFile){
              req.session['isTcUploaded'] = false
              req.session["fileDuplicateError"]=true;
              FileFilterArray.push({
                href: '#documents_upload',
                text: fileName,
              });
              FILEUPLOADHELPER(req, res, true, FileFilterArray);
            }else{
              await DynamicFrameworkInstance.file_Instance(SESSION_ID).put(FILE_PUBLISHER_BASEURL, formData, {
                headers: {
                  ...formHeaders,
                },
              });
              req.session['isTcUploaded'] = true
            //CAS-INFO-LOG 
           LoggTracer.infoLogger(null, logConstant.UploadDocumentUpdated, req);

            }
            } catch (error) {
              LoggTracer.errorLogger(
                res,
                error,
                `${req.headers.host}${req.originalUrl}`,
                null,
                TokenDecoder.decoder(SESSION_ID),
                'Multiple File Upload Error',
                false,
              );
            }
          } else {
            FileFilterArray.push({
              href: '#documents_upload',
              text: fileName,
            });
          }
        }

        if (FileFilterArray.length > 0) {
          FILEUPLOADHELPER(req, res, true, FileFilterArray);
        } else res.redirect(`/${selRoute}/upload-doc`);
      } else {
    
        const fileName = offline_document.name;
        const fileMimeType = offline_document.mimetype;
        const fileSize = offline_document.size;

        const validateMimeType = FileValidations.formatValidation(fileMimeType);
        const validateFileSize = FileValidations.sizeValidation(fileSize);

        if (validateMimeType && validateFileSize) {
          const formData = new FormData();
          formData.append('data', offline_document.data, {
            contentType: offline_document.mimetype,
            filename: offline_document.name,
            
          });
          if(stage2_value == 'Stage 2'){
            formData.append('description', 'mandatorysecond');
          }else{
            formData.append('description', 'mandatorysecond');
          }
          // formData.append('description', "mandatorysecond");
          formData.append('audience', 'supplier');
          //formData.append('uploadSta','asdasdasd');
          const formHeaders = formData.getHeaders();
          try {
            // ------file duplicate check start
            const FetchDocuments = await DynamicFrameworkInstance.Instance(SESSION_ID).get(FILE_PUBLISHER_BASEURL);
            const FETCH_FILEDATA = FetchDocuments.data;

            //CAS-INFO-LOG 
            LoggTracer.infoLogger(FETCH_FILEDATA, logConstant.getUploadDocument, req);

            let duplicateFile = false;
            for(const item of FETCH_FILEDATA){
              // if (item.description === "mandatorysecond") {
                if(item.fileName == offline_document.name){
                  duplicateFile = true;
                }
              // }
            }
            // ------file duplicate check end
            if(duplicateFile){
              req.session['isTcUploaded'] = false
              req.session["fileDuplicateError"]=true;
              FileFilterArray.push({
                href: '#documents_upload',
                text: fileName,
              });
              FILEUPLOADHELPER(req, res, true, FileFilterArray);
            }else{
            await DynamicFrameworkInstance.file_Instance(SESSION_ID).put(FILE_PUBLISHER_BASEURL, formData, {
              headers: {
                ...formHeaders,
              },
            });
            
            //CAS-INFO-LOG 
            LoggTracer.infoLogger(null, logConstant.UploadDocumentUpdated, req);

            res.redirect(`/${selRoute}/upload-doc`);
          }
          } catch (error) {
            delete error?.config?.['headers'];
            const Logmessage = {
              Person_id: TokenDecoder.decoder(SESSION_ID),
              error_location: `${req.headers.host}${req.originalUrl}`,
              sessionId: 'null',
              error_reason: `File uploading Causes Problem in ${selRoute}  - Tenders Api throws error`,
              exception: error,
            };
            const Log = new LogMessageFormatter(
              Logmessage.Person_id,
              Logmessage.error_location,
              Logmessage.sessionId,
              Logmessage.error_reason,
              Logmessage.exception,
            );
            LoggTracer.errorTracer(Log, res);
          }
        } else {
          FileFilterArray.push({
            href: '#documents_upload',
            text: fileName,
          });

          FILEUPLOADHELPER(req, res, true, FileFilterArray);
        }
      }
    } else {
      res.render('error/500')
    };
  } else {
    req.session["fileObjectIsEmpty"] = true;
    res.redirect(req.url);
    //res.redirect(`/${selRoute}/upload-doc`);
    //const journey = journeyStatus.find(journey => journey.step === 37)?.state;
    //const routeRedirect = journey === 'Optional' ? `/${selRoute}/suppliers` : `/${selRoute}/upload-doc`;
    //res.redirect(routeRedirect);
  }


};

export const RFP_GET_REMOVE_FILES = (express.Handler = async (req: express.Request, res: express.Response) => {
  let { selectedRoute } = req.session
  const agreementId_session = req.session.agreement_id;
  if (selectedRoute === 'FC') selectedRoute = 'RFP'
  const { SESSION_ID } = req.cookies //jwt
  const { projectId } = req.session
  const EventId = req.session['eventId']
  const { file_id } = req.query
  const baseURL = `/tenders/projects/${projectId}/events/${EventId}/documents/${file_id}`
  try {
    await DynamicFrameworkInstance.Instance(SESSION_ID).delete(baseURL)

    //CAS-INFO-LOG 
    LoggTracer.infoLogger(null, logConstant.UploadDocumentDeleted, req);

    if(agreementId_session == 'RM1043.8'){
      res.redirect(`/rfp/upload-additional`)
    }else{
      res.redirect(`/${selectedRoute.toLowerCase()}/upload-doc`)
    }
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Remove document failed',
      true,
    );
  }
});

export const RFP_POST_UPLOAD_PROCEED = (express.Handler = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId,eventId } = req.session;
  let { selectedRoute } = req.session;
  const agreement_id =req.session.agreement_id;
  const stage2_value = req.session.stage2_value;

  if (req.session['isTcUploaded']) {
  
    if (selectedRoute === 'FC') selectedRoute = 'RFP';
    if (selectedRoute === 'dos') selectedRoute = 'RFP';
    const step = selectedRoute.toLowerCase() === 'rfp' ? 32 : 71;
    
    
    const FILE_PUBLISHER_BASEURL = `/tenders/projects/${projectId}/events/${eventId}/documents`;
    const FetchDocuments = await DynamicFrameworkInstance.Instance(SESSION_ID).get(FILE_PUBLISHER_BASEURL);
    const FETCH_FILEDATA = FetchDocuments?.data;
    
    //CAS-INFO-LOG 
    LoggTracer.infoLogger(FETCH_FILEDATA, logConstant.getUploadDocument, req);

    let fileNameStorageTermsnCond = [];
    let fileNameStoragePricing = [];
    let uploadadditional=[];
    let additionalfile=[];
    FETCH_FILEDATA?.map(file => {
      
      if (file.description === "mandatoryfirst") {
        fileNameStoragePricing.push(file.fileName);
      }
      if (file.description === "mandatorysecond") {
        fileNameStorageTermsnCond.push(file.fileName);
      }

      if (file.description === "mandatorythirtd") {
        uploadadditional.push(file.fileName);
      }

      if (file.description === "optional") {
        additionalfile.push(file.fileName);
      }

     });

    if(agreement_id === 'RM1043.8' && stage2_value !== undefined && stage2_value === "Stage 2"){
      if(additionalfile.length>0 && fileNameStoragePricing.length>0)
      {
          //  let flag = await ShouldEventStatusBeUpdated(eventId, 31, req);
          //  await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/31`, 'Completed');
          //  flag = await ShouldEventStatusBeUpdated(eventId, 32, req);
          //  if (flag) {
          //    await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/32`, 'Not started');
          //  }
      }
    }
   
    if(fileNameStorageTermsnCond.length>0 && fileNameStoragePricing.length>0)
     {
      
        if(agreement_id === 'RM1043.8' && stage2_value !== undefined && stage2_value === "Stage 2"){

          //  let flag = await ShouldEventStatusBeUpdated(eventId, 31, req);
          //     await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/31`, 'Completed');
          //     flag = await ShouldEventStatusBeUpdated(eventId, 32, req);
          //     if (flag) {
          //       await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/32`, 'Not started');
          //     }
        }else{
          await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/${step}`, 'Completed');
          let flag=await ShouldEventStatusBeUpdated(eventId,33,req);
          if(flag)
          {
          await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/33`, 'Not started');
          }
          if(agreement_id=='RM6187'){
            
            let flags=await ShouldEventStatusBeUpdated(eventId,34,req);
            if(flags){
           // await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/34`, 'Not started');
            }
          }
         
          //}
        }
      }
    
   


    if(agreement_id == 'RM6187' || agreement_id == 'RM1557.13') {
      if(agreement_id == 'RM1557.13'){
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/32`, 'Completed');
        let flag = await ShouldEventStatusBeUpdated(eventId, 33, req);
        if(flag) {
          await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/33`, 'Not started');
        } 
      }
      res.redirect('/rfp/upload-additional');
    }else{
      if(agreement_id == 'RM1043.8' && stage2_value !== undefined && stage2_value === "Stage 2"){
        
        res.redirect(`/rfp/upload-additional`);
      }
      else{
        res.redirect(`/rfp/IR35`);
      }
      
    }
    
  } else {
    if(agreement_id === 'RM1043.8' && stage2_value == "Stage 2"){
     let flag = await ShouldEventStatusBeUpdated(eventId, 31, req);
      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/31`, 'Completed');
      flag = await ShouldEventStatusBeUpdated(eventId, 32, req);
      if (flag) {
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/32`, 'Not started');
      }
      res.redirect(`/rfp/upload-additional`);
    }else{
      const lotId = req.session?.lotId;
      const agreementLotName = req.session.agreementLotName;
      const releatedContent = req.session.releatedContent;
      const agreement_id =req.session.agreement_id;
      let windowAppendData = {
        lotId,
        agreementLotName,
        data: cmsData,
        files: null,
        releatedContent: releatedContent,
        storage: 0,
        agreement_id:agreement_id,
      }
      
      windowAppendData = Object.assign({}, { ...windowAppendData, error: 'true' });
      //res.render('rfp-uploadDocument.njk', windowAppendData)

      //res.render('rfp-uploadDocument',windowAppendData);
      //req.session.uploaderrorStatus = false;
      req.session["termsNcond"] = { "IsDocumentError": true, "IsFile": req.session['isTcUploaded'] ? true : false };
      res.redirect(`/rfp/upload-doc`);

    }
    

  }

});
