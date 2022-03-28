//@ts-nocheck
import { TenderApi } from '@common/util/fetch/procurementService/TenderApiInstance';
import * as express from 'express';
import { GetLotSuppliers } from '../../shared/supplierService';
import { HttpStatusCode } from 'main/errors/httpStatusCodes';
import * as cmsData from '../../../resources/content/RFI/suppliers.json';
import config from 'config';

// RFI Suppliers
export const GET_RFI_SUPPLIERS = async (req: express.Request, res: express.Response) => {
  const lotSuppliers = config.get('CCS_agreements_url')+req.session.agreement_id+":"+req.session.lotId+"/lot-suppliers";
  const releatedContent = req.session.releatedContent
  let supplierList = [];
  supplierList = await GetLotSuppliers(req);
  const appendData = {
    data: cmsData,
    suppliers_list: supplierList,
    lotSuppliers: lotSuppliers,
    releatedContent: releatedContent,
  };
  res.render('supplier', appendData);
};

export const POST_RFI_SUPPLIER = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId } = req.session;
  const response = await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/12`, 'Completed');
  if (response.status == HttpStatusCode.OK) {
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/13`, 'Not started');
  }
  res.redirect('/rfi/response-date');
};

//agreement_suppliers_list
