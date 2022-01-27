//@ts-nocheck
import { TenderApi } from '@common/util/fetch/procurementService/TenderApiInstance';
import * as express from 'express';
import { GetLotSuppliers } from '../../shared/supplierService';
import { HttpStatusCode } from 'main/errors/httpStatusCodes';
import * as cmsData from '../../../resources/content/requirements/suppliers.json';
import config from 'config';

// RFI Suppliers
export const GET_RFP_SUPPLIERS = async (req: express.Request, res: express.Response) => {
  const releatedContent = req.session.releatedContent
  const lotSuppliers = config.get('CCS_agreements_url')+req.session.agreement_id+":"+req.session.lotId+"/lot-suppliers";
  let supplierList = [];
  supplierList = await GetLotSuppliers(req);
  const appendData = {
    data: cmsData,
    suppliers_list: supplierList,
    releatedContent: releatedContent,
    lotSuppliers: lotSuppliers,
  };
  res.render('rfp-suppliers', appendData);
};

export const POST_RFP_SUPPLIERS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { eventId } = req.session;
  const response = await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/22`, 'Completed');
  if (response.status == HttpStatusCode.OK) {
    await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/23`, 'Not started');
  }
  res.redirect('/rfp/response-date');
};
