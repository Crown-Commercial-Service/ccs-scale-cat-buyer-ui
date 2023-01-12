//@ts-nocheck
import * as express from 'express';
import FormData from 'form-data';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { TenderApi } from '../../../common/util/fetch/tenderService/tenderApiInstance';
import { ATTACHMENTUPLOADHELPER } from '../helpers/uploadAttachment';
import { FileValidations } from '../util/file/filevalidations';
import {ShouldEventStatusBeUpdated} from '../../shared/ShouldEventStatusBeUpdated';
import { logConstant } from '../../../common/logtracer/logConstant';

let tempArray = [];

// requirements Upload document
/**
 *
 * @param req
 * @param res
 * @GETController
 */

export const RFP_GET_UPLOAD_ATTACHMENT: express.Handler = (req: express.Request, res: express.Response) => {
  ATTACHMENTUPLOADHELPER(req, res, false, null);
};

/**
 *
 * @param req
 * @param res
 * @POSTController
 */

export const RFP_POST_UPLOAD_ATTACHMENT: express.Handler = async (req: express.Request, res: express.Response) => {
  
  let { selectedRoute } = req.session;
  if (selectedRoute === 'FC') selectedRoute = 'RFP';
  if (selectedRoute === 'dos') selectedRoute = 'RFP';//FOR DOS6
  const selRoute = selectedRoute.toLowerCase();
  const file_started = req.body[`${selRoute}_file_started`];

  const { SESSION_ID } = req.cookies;
  const ProjectId = req.session['projectId'];
  const EventId = req.session['eventId'];
  const journeyStatus = req.session['journey_status'];
  

  if (req.files !=null && req.files !=undefined) {
    const FILE_PUBLISHER_BASEURL = `/tenders/projects/${ProjectId}/events/${EventId}/documents`;
    const FileFilterArray = [];
    

    if (file_started && file_started != undefined) {
      const offline_document = req.files[`${selRoute}_offline_document`];

      const multipleFileCheck = Array.isArray(offline_document);
      if (multipleFileCheck) {
        for (const file of offline_document) {
          const fileName = file.name;
          let fileMimeType = file.mimetype;
          const fileSize = file.size;
          if(fileMimeType == 'application/zip') fileMimeType = "application/x-zip-compressed";
          const validateMimeType = FileValidations.formatValidation(fileMimeType);
          const validateFileSize = FileValidations.sizeValidation(fileSize);

          if (validateMimeType && validateFileSize) {
            const formData = new FormData();
            formData.append('data', file.data, {
              contentType: file.mimetype,
              filename: file.name,
            });
            formData.append('description', "mandatoryfirst");
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
              // if (item.description === "mandatoryfirst") {
                if(item.fileName == file.name){
                  duplicateFile = true;
                }
              // }
            }
            // ------file duplicate check end
            if(duplicateFile){
              req.session['isTcUploaded'] = false
              FileFilterArray.push({
                href: '#documents_upload',
                text: fileName,
              });
              ATTACHMENTUPLOADHELPER(req, res, true, FileFilterArray);
            }else{
              await DynamicFrameworkInstance.file_Instance(SESSION_ID).put(FILE_PUBLISHER_BASEURL, formData, {
                headers: {
                  ...formHeaders,
                },
              });

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
          ATTACHMENTUPLOADHELPER(req, res, true, FileFilterArray);
        } else {
          // res.redirect(`/${selRoute}/upload-doc`);
          res.redirect(`/${selRoute}/upload-attachment`);
        }
      } else {
        
        const fileName = offline_document.name;
        let fileMimeType = offline_document.mimetype;
        const fileSize = offline_document.size;
        if(fileMimeType == 'application/zip') fileMimeType = "application/x-zip-compressed";
        const validateMimeType = FileValidations.formatValidation(fileMimeType);
        const validateFileSize = FileValidations.sizeValidation(fileSize);

        if (validateMimeType && validateFileSize) {
          const formData = new FormData();
          formData.append('data', offline_document.data, {
            contentType: offline_document.mimetype,
            filename: offline_document.name,
          });
          formData.append('description', "mandatoryfirst");
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
              // if (item.description === "mandatoryfirst") {
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
              ATTACHMENTUPLOADHELPER(req, res, true, FileFilterArray);
            }else{
            await DynamicFrameworkInstance.file_Instance(SESSION_ID).put(FILE_PUBLISHER_BASEURL, formData, {
              headers: {
                ...formHeaders,
              },
            });

             //CAS-INFO-LOG 
             LoggTracer.infoLogger(null, logConstant.UploadDocumentUpdated, req);

            req.session['isTcUploaded'] = true
            res.redirect(`/${selRoute}/upload-attachment`);
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

          ATTACHMENTUPLOADHELPER(req, res, true, FileFilterArray);
        }
      }
    } else res.render('error/500');
  }
  else {
    
    req.session["fileObjectIsEmpty"]=true;
    res.redirect(req.url);
    //const journey = journeyStatus.find(journey => journey.step === 37)?.state; // check step number
    //const routeRedirect = journey === 'Optional' ? `/${selRoute}/suppliers` : `/${selRoute}/upload-doc`;
    //res.redirect(routeRedirect);
    
  }
};

export const RFP_GET_REMOVE_FILES_ATTACHMENT = (express.Handler = async (req: express.Request, res: express.Response) => {
  
  const { SESSION_ID } = req.cookies //jwt
  const { projectId } = req.session
  const EventId = req.session['eventId']
  const { file_id } = req.query
  const baseURL = `/tenders/projects/${projectId}/events/${EventId}/documents/${file_id}`
  try {
    await DynamicFrameworkInstance.Instance(SESSION_ID).delete(baseURL)
    
    
    //CAS-INFO-LOG 
    LoggTracer.infoLogger(null, logConstant.UploadDocumentDeleted, req);

    res.redirect(`/rfp/upload-attachment`)
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

export const RFP_POST_UPLOAD_ATTACHMENT_PROCEED = (express.Handler = async (
  req: express.Request,
  res: express.Response,
) => {

 
  const { SESSION_ID } = req.cookies;
  const { projectId,eventId } = req.session;
  let { selectedRoute } = req.session;
  let rfp_confirm_upload = req.body.rfp_confirm_upload;
  if (selectedRoute === 'FC') selectedRoute = 'RFP';
  if (selectedRoute === 'dos') selectedRoute = 'RFP';
  const step = selectedRoute.toLowerCase() === 'rfp' ? 32 : 71; // check step number changed step 37 to 30 balwinder
  const stage2 = false; //FOR DOS6 STAGE2 PURPOSE
  
  const FILE_PUBLISHER_BASEURL = `/tenders/projects/${projectId}/events/${eventId}/documents`;
    const FetchDocuments = await DynamicFrameworkInstance.Instance(SESSION_ID).get(FILE_PUBLISHER_BASEURL);
    const FETCH_FILEDATA = FetchDocuments?.data;
    
    //CAS-INFO-LOG 
    LoggTracer.infoLogger(FETCH_FILEDATA, logConstant.getUploadDocument, req);

    let fileNameStorageTermsnCond = [];
    let fileNameStoragePricing = [];
    let additionalfile=[];
    FETCH_FILEDATA?.map(file => {
      
      if (file.description === "mandatoryfirst") {
        fileNameStoragePricing.push(file.fileName);
      }
      if (file.description === "mandatorysecond") {
        fileNameStorageTermsnCond.push(file.fileName);
      }
      if (file.description === "optional") {
        additionalfile.push(file.fileName);
      }
    });
   
    if(fileNameStorageTermsnCond.length>0 && fileNameStoragePricing.length>0)
     {
      
      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/${step}`, 'Completed');
        let flag=await ShouldEventStatusBeUpdated(eventId,33,req);
        if(flag)
        {
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/33`, 'Not started');
        } 

        if(req.session.agreement_id=='RM6187'){
          
          let flags=await ShouldEventStatusBeUpdated(eventId,34,req);
          if(flags){
          //await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/34`, 'Not started');
          }
        }
        

    // await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/${step}`, 'Completed');
    // let flag=await ShouldEventStatusBeUpdated(eventId,31,req);
    // if(flag)
    // {
    // await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/31`, 'Not started');
    // }

      }

  
      if(req.session.agreement_id=='RM1043.8'&&req.session?.stage2_value !== undefined && req.session?.stage2_value === "Stage 2"){
        rfp_confirm_upload="confirm";
      }
      if(req.session.agreement_id=='RM1557.13'){
        rfp_confirm_upload="confirm";
      }
  
  if (req.session['isTcUploaded'] && rfp_confirm_upload === "confirm") {
   // await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/${step}`, 'Completed');
    
      if(req.session.agreement_id=='RM1043.8'&&req.session?.stage2_value !== undefined && req.session?.stage2_value === "Stage 2"){
        let flag = await ShouldEventStatusBeUpdated(eventId, 30, req);
        if (flag) {
          await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/30`, 'Completed');
        }
        flag = await ShouldEventStatusBeUpdated(eventId, 31, req);
        if (flag) {
          await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/31`, 'Optional');
        }
        flag = await ShouldEventStatusBeUpdated(eventId, 32, req);
        if (flag) {
          await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/32`, 'Not started');
        }
        if(req.session?.stage2_value === "Stage 2"){
          res.redirect(`/${selectedRoute.toLowerCase()}/upload-doc`);
        }else{
          res.redirect(`/rfp/task-list`);
        }
      }else{
        res.redirect(`/${selectedRoute.toLowerCase()}/upload-doc`);
      }
    
  } else {
    req.session["pricingSchedule"] = { "IsDocumentError": true, "IsFile": !req.session['isTcUploaded'] ? true : false, "rfp_confirm_upload": rfp_confirm_upload == undefined ? true : false };
    res.redirect(`/rfp/upload-attachment`);
  }

});
