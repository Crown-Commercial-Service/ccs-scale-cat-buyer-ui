//@ts-nocheck
import { TenderApi } from '@common/util/fetch/procurementService/TenderApiInstance';
import * as express from 'express';
import { GetLotSuppliers } from '../../shared/supplierService';
import { HttpStatusCode } from 'main/errors/httpStatusCodes';
import * as cmsData from '../../../resources/content/requirements/caCancel.json';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import config from 'config';

// FC cancel
export const CA_GET_CANCEL = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId } = req.session;
  const releatedContent = req.session.releatedContent;
  const lotSuppliers =
    config.get('CCS_agreements_url') + req.session.agreement_id + ':' + req.session.lotId + '/lot-suppliers';
  try {
    //await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/38`, 'In progress');
    let supplierList = [];
    supplierList = await GetLotSuppliers(req);
    const appendData = {
      data: cmsData,
      suppliers_list: supplierList,
      releatedContent: releatedContent,
      lotSuppliers: lotSuppliers,
    };
    res.render('ca-cancel', appendData);
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Suppliers page error - CapAss',
      true,
    );
  }
};
