//@ts-nocheck
import { TenderApi } from '@common/util/fetch/procurementService/TenderApiInstance';
import * as express from 'express';
import { GetLotSuppliers } from '../../shared/supplierService';
import { HttpStatusCode } from 'main/errors/httpStatusCodes';
import * as cmsData from '../../../resources/content/requirements/suppliers.json';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import config from 'config';

// RFI Suppliers
export const GET_RFP_SUPPLIERS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { eventId } = req.session;
  const releatedContent = req.session.releatedContent
  const lotSuppliers = config.get('CCS_agreements_url') + req.session.agreement_id + ":" + req.session.lotId + "/lot-suppliers";
  try {
    await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/38`, 'In progress');
    let supplierList = [];
    supplierList = await GetLotSuppliers(req);
    const appendData = {
      data: cmsData,
      suppliers_list: supplierList,
      releatedContent: releatedContent,
      lotSuppliers: lotSuppliers,
    };
    res.render('rfp-suppliers', appendData);
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
  const { eventId } = req.session;
  try {
    const response = await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/38`, 'Completed');
    if (response.status == HttpStatusCode.OK) {
      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/39`, 'Not started');
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
