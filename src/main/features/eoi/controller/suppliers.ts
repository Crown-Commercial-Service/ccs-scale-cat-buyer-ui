//@ts-nocheck
import { TenderApi } from '@common/util/fetch/procurementService/TenderApiInstance';
import * as express from 'express';
import { GetLotSuppliers } from '../../shared/supplierService';
import { HttpStatusCode } from 'main/errors/httpStatusCodes';
import * as cmsData from '../../../resources/content/eoi/suppliers.json';

// RFI Suppliers
export const GET_EOI_SUPPLIERS = async (req: express.Request, res: express.Response) => {
  let supplierList = [];
  supplierList = await GetLotSuppliers(req);
  const appendData = {
    data: cmsData,
    suppliers_list: supplierList,
  };
  res.render('suppliers', appendData);
};

export const POST_EOI_SUPPLIERS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { eventId } = req.session;
  const response = await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/22`, 'Completed');
  if (response.status == HttpStatusCode.OK) {
    await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/23`, 'Not started');
  }
  res.redirect('/eoi/response-date');
};

//agreement_suppliers_list
