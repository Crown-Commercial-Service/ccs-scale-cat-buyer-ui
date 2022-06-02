//@ts-nocheck
import { TenderApi } from '@common/util/fetch/procurementService/TenderApiInstance';
import * as express from 'express';
import { GetLotSuppliers } from '../../shared/supplierService';
import { HttpStatusCode } from 'main/errors/httpStatusCodes';
import * as cmsData from '../../../resources/content/requirements/suppliers.json';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import config from 'config';
import { Blob } from 'buffer';
import { JSDOM } from 'jsdom';
import { Parser } from 'json2csv';
import {ShouldEventStatusBeUpdated} from '../../shared/ShouldEventStatusBeUpdated';

// RFI Suppliers
export const GET_RFP_SUPPLIERS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId } = req.session;
  const { download,previous,next } = req.query
  const releatedContent = req.session.releatedContent
  let lotid=req.session.lotId;
  lotid=lotid.replace('Lot ','')
  const lotSuppliers = config.get('CCS_agreements_url') + req.session.agreement_id + ":" + lotid + "/lot-suppliers";
  try {
    let flag=await ShouldEventStatusBeUpdated(projectId,39,req);
    if(flag)
    {
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/39`, 'In progress');
    }
    let supplierList = [];
    supplierList = await GetLotSuppliers(req);
    const rowCount=10;let showPrevious=false,showNext=false;
    supplierList=supplierList.sort((a, b) => a.organization.name.replace("-"," ").toLowerCase() < b.organization.name.replace("-"," ").toLowerCase() ? -1 : a.organization.name.replace("-"," ").toLowerCase() > b.organization.name.replace("-"," ").toLowerCase() ? 1 : 0);
    const supplierLength=supplierList.length;
    let appendData = {
      data: cmsData,
      suppliers_list: supplierList,
      releatedContent: releatedContent,
      lotSuppliers: lotSuppliers,
      supplierLength
    };
    if(download!=undefined)
  {
    let csvSupplierList=[];
    csvSupplierList=appendData.suppliers_list.map(a=>a.organization);
    let fields = ["name"];
    const json2csv = new Parser({fields});
    const csv = json2csv.parse(csvSupplierList);
    res.header('Content-Type', 'text/csv');
    res.attachment("Suppliers_List.csv");         
    res.send(csv);
  }
  else{
    let noOfPages=Math.ceil(supplierList.length/rowCount);
    if(previous==undefined && next==undefined)
    {
      req.session.supplierpagenumber=1;
      if(supplierList.length<=rowCount)
      {
        showPrevious=false;
        showNext=false;
        appendData = {
          data: cmsData,
          suppliers_list: supplierList,
          lotSuppliers: lotSuppliers,
          releatedContent: releatedContent,
          showPrevious,
          showNext,
          supplierLength,
        };
      }
      else
      {
        showPrevious=false;
        showNext=true;
        
        supplierList=supplierList.slice(0,rowCount);
        appendData = {
          data: cmsData,
          suppliers_list: supplierList,
          lotSuppliers: lotSuppliers,
          releatedContent: releatedContent,
          showPrevious,
          showNext,
          supplierLength,
          currentpagenumber:1,
          noOfPages,
        };
      }
    }
    else
    {
      if(previous!=undefined)
      {
          let currentpagenumber=req.session.supplierpagenumber;
          let previouspagenumber=currentpagenumber-1;
          let lastindex=previouspagenumber*rowCount;
          supplierList=supplierList.slice(lastindex-rowCount,lastindex);
          req.session.supplierpagenumber=previouspagenumber;
          if(previouspagenumber==1)
          {
            showPrevious=false;
          }
          else
          {
            showPrevious=true;
          }
          showNext=true;
          appendData = {
            data: cmsData,
            suppliers_list: supplierList,
            lotSuppliers: lotSuppliers,
            releatedContent: releatedContent,
            showPrevious,
            showNext,
            supplierLength,
            currentpagenumber:previouspagenumber,
            noOfPages,
          };
      }
      else{//next is undefined
        let currentpagenumber=req.session.supplierpagenumber;
        let nextpagenumber=currentpagenumber+1;
        let lastindex=nextpagenumber*rowCount;
        let firstindex=0;
        if(lastindex > supplierList.length)
        {
          lastindex=supplierList.length;
          firstindex=currentpagenumber*rowCount;
        }
        else
        {
          firstindex=lastindex-rowCount;
        }
        supplierList=supplierList.slice(firstindex,lastindex);
        req.session.supplierpagenumber=nextpagenumber;
        
        if(nextpagenumber==noOfPages)
        {
          showNext=false;
        }
        else
        {
          showNext=true;
        }
        showPrevious=true;
        appendData = {
          data: cmsData,
          suppliers_list: supplierList,
          lotSuppliers: lotSuppliers,
          releatedContent: releatedContent,
          showPrevious,
          showNext,
          supplierLength,
          currentpagenumber:nextpagenumber,
          noOfPages,
        };
      }
    }
    res.render('rfp-suppliers', appendData);
  }
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Suppliers page error - RFP',
      true,
    );
  }
};

export const POST_RFP_SUPPLIERS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId } = req.session;
  try {
    const response = await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/39`, 'Completed');
    if (response.status == HttpStatusCode.OK) {
      let flag=await ShouldEventStatusBeUpdated(projectId,40,req);
      if(flag)
      {
      await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/40`, 'Not started');
    }
  }
     res.redirect('/rfp/response-date');
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Suppliers page error - RFP',
      true,
    );
  }
};
