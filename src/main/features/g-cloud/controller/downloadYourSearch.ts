import * as express from 'express';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { gCloudApi } from '../util/fetch/apiInstance';
import * as downloadYourSearchData from '../../../resources/content/gcloud/downloadYourSearch.json';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { logConstant } from '../../../common/logtracer/logConstant';
import moment from 'moment-business-days';

export const GET_DOWNLOAD_YOUR_SEARCH = async (req: express.Request, res: express.Response) => {
    const { SESSION_ID } = req.cookies;
    const { download,assessmentID } = req.query;
    
    try {

      if(assessmentID!=undefined){
        req.session.downloadassessmentID=assessmentID;
      }

      if(download!=undefined)
    {
      const downloadURL=`/assessments/${req.session.downloadassessmentID}/export/gcloud`;
      const FetchDocuments = await gCloudApi.file_dowload_Instance(SESSION_ID).get(downloadURL, {
        responseType: 'arraybuffer',
      });
      //CAS-INFO-LOG
      LoggTracer.infoLogger(FetchDocuments, logConstant.exportGcloud, req);
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
    }
    else{

      const baseURL=`/assessments/${req.session.downloadassessmentID}/gcloud`;

      let assessmentDetail = await TenderApi.Instance(SESSION_ID).get(baseURL);

       //CAS-INFO-LOG
       LoggTracer.infoLogger(assessmentDetail, logConstant.assessmentDetail, req);

       let assessmentDetails = assessmentDetail.data;

       let exporteddate =assessmentDetails.lastUpdate!=undefined?`${moment(assessmentDetails.lastUpdate).format('dddd DD MMMM YYYY')} at ${new Date(assessmentDetails.lastUpdate).toLocaleTimeString('en-GB',
      { timeStyle: 'short', hour12: true, timeZone: 'Europe/London' })} BST`:'';

      const releatedContent = req.session.releatedContent;
      const appendData = {
        data: downloadYourSearchData,
        releatedContent: releatedContent,
        lotId:req.session.lotId,
        agreementLotName:req.session.agreementLotName,
        assessmentID,
        exporteddate,
        returnto: `/g-cloud/search${req.session.searchResultsUrl == undefined ?'':'?'+ req.session.searchResultsUrl}`
        
      };
    //CAS-INFO-LOG
    LoggTracer.infoLogger(null, logConstant.downloadYourSearch, req);
      res.render('downloadYourSearch', appendData);
    }

      
        
    } catch (error) {
        LoggTracer.errorLogger( res, error, `${req.headers.host}${req.originalUrl}`, null,
          TokenDecoder.decoder(SESSION_ID), 'G-Cloud 13 throws error - Tenders Api is causing problem', true,
        );
    }
};

