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

// RFI Suppliers
export const GET_RFP_SUPPLIERS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId } = req.session;
  const { download } = req.query
  const releatedContent = req.session.releatedContent
  let lotid=req.session.lotId;
  lotid=lotid.replace('Lot ','')
  const lotSuppliers = config.get('CCS_agreements_url') + req.session.agreement_id + ":" + lotid + "/lot-suppliers";
  try {
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/39`, 'In progress');
    let supplierList = [];
    supplierList = await GetLotSuppliers(req);
    const appendData = {
      data: cmsData,
      suppliers_list: supplierList.sort((a, b) => a.organization.name.replace("-"," ").toLowerCase() < b.organization.name.replace("-"," ").toLowerCase() ? -1 : a.organization.name.replace("-"," ").toLowerCase() > b.organization.name.replace("-"," ").toLowerCase() ? 1 : 0),
      releatedContent: releatedContent,
      lotSuppliers: lotSuppliers,
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
      await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/40`, 'Not started');
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
