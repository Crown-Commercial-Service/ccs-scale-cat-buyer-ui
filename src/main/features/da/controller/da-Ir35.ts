//@ts-nocheck
import * as express from 'express';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import {ShouldEventStatusBeUpdated} from '../../shared/ShouldEventStatusBeUpdated';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import * as cmsDataMCF from '../../../resources/content/da/da-ir35.json';

export const DA_GET_I35: express.Handler = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId, eventId, releatedContent } = req.session;


  try {
    const IR35Dataset = {
      id: 'Criterion 3',
      group_id: 'Group 2',
      question: 'Question 1',
    };

    const BaseURL = `/tenders/projects/${projectId}/events/${eventId}/criteria/${IR35Dataset.id}/groups/${IR35Dataset.group_id}/questions`;
    
    const Response = await TenderApi.Instance(SESSION_ID).get(BaseURL);
    const ResponseData = Response.data;
   let text=ResponseData[0].nonOCDS;
    for(let i=0;i<=ResponseData.length;i++)
    {
    //  let changecontent=text.options[i].value;
    //   switch(changecontent){
    //     case 'Contracted out services the off-payroll rules do not apply':
    //       text.options[i].value='Yes,the Off-payroll working rules apply';
    //     break
    //     case 'Supply of resource':
    //       text.options[i].value='No,the off-payroll rules do not apply';
    //     break
    //  }
    }
    const windowAppendData = {
      apiData: ResponseData,
      data:cmsDataMCF,
      releatedContent,
    };
    let flag=await ShouldEventStatusBeUpdated(eventId,33,req);
    if(flag)
    {
    await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/33`, 'In progress');
    }
    res.render('daw-ir35.njk', windowAppendData);
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'IR35 DA - Tenders Service Api cannot be connected',
      true,
    );
  }
};

export const DA_POST_I35: express.Handler = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId, eventId } = req.session;
  const { rfp_acknowledgement } = req.body;
  let { selectedRoute } = req.session;

  try {
    const IR35Dataset = {
      id: 'Criterion 3',
      group_id: 'Group 2',
      question_id: 'Question 1',
    };

    const BaseURL = `/tenders/projects/${projectId}/events/${eventId}/criteria/${IR35Dataset.id}/groups/${IR35Dataset.group_id}/questions/${IR35Dataset.question_id}`;

    const REQUESTBODY = {
      nonOCDS: {
        answered: true,
        options: [
          {
            value: rfp_acknowledgement,
            selected: true,
          },
        ],
      },
    };
    if (REQUESTBODY?.nonOCDS?.options?.length >0 && REQUESTBODY.nonOCDS.options[0].value !==undefined) {
    
       //const step = selectedRoute.toUpperCase() === 'DA' ? 32 : 71;
      //  const FILE_PUBLISHER_BASEURL = `/tenders/projects/${projectId}/events/${eventId}/documents`;
      //   const fetchDocuments = await DynamicFrameworkInstance.Instance(SESSION_ID).get(FILE_PUBLISHER_BASEURL);
        
      const step = selectedRoute.toLowerCase() === 'da' ? 32 : 71;
  
      const FILE_PUBLISHER_BASEURL = `/tenders/projects/${projectId}/events/${eventId}/documents`;
      const FetchDocuments = await DynamicFrameworkInstance.Instance(SESSION_ID).get(FILE_PUBLISHER_BASEURL);
      const FETCH_FILEDATA = FetchDocuments?.data;
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
        
         await TenderApi.Instance(SESSION_ID).put(BaseURL, REQUESTBODY);
    await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/33`, 'Completed');
    let flag=await ShouldEventStatusBeUpdated(eventId,34,req);
    if(flag){
      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/34`, 'Not started');
    } 
  
        }
      
    
    
      
    
    res.redirect('/da/task-list');
    }else{
      res.redirect("/da/IR35");
    }
    
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'IR35 DA - Tenders Service Api cannot be connected',
      true,
    );
  }
};
