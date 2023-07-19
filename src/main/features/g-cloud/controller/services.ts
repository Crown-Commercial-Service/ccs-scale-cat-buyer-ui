import * as express from 'express';
import * as path from 'path';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { ServiceModel, SupplierModel } from '../model/searchModel';
import { logConstant } from '../../../common/logtracer/logConstant';
import { gCloud } from 'main/services/gCloud';

export const GET_SERVICES = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { id } = req.query;

  try {
    const serviceData = (await gCloud.api.service.getService(id as string)).unwrap();
    const supplierData = (await gCloud.api.service.getSupplier(serviceData.services.supplierId)).unwrap();
    const supplierSlaveryDocumentData = (await gCloud.api.service.getSupplierFramework(serviceData.services.supplierId)).unwrap();

    const supplierDetails = {} as SupplierModel;
    if (supplierData !== null) {
      supplierDetails.contactName = supplierData.suppliers.contactInformation[0].contactName;
      supplierDetails.email = supplierData.suppliers.contactInformation[0].email;
      supplierDetails.phoneNumber = supplierData.suppliers.contactInformation[0].phoneNumber;

      supplierDetails.modernSlaveryStatement = supplierSlaveryDocumentData.frameworkInterest.declaration.modernSlaveryStatement;
      supplierDetails.modernSlaveryStatementEXTENTION = getExtension(supplierSlaveryDocumentData.frameworkInterest.declaration.modernSlaveryStatement);

      supplierDetails.modernSlaveryStatementOption = supplierSlaveryDocumentData.frameworkInterest.declaration.modernSlaveryStatementOptional;
      supplierDetails.modernSlaveryStatementOptionEXTENTION = getExtension(supplierSlaveryDocumentData.frameworkInterest.declaration.modernSlaveryStatementOptional);
    }

    const serviceDetails: ServiceModel = serviceData.services ?? {} as ServiceModel;
    if (serviceData !== null) {
      serviceDetails.priceUnit = priceContent(serviceDetails.priceUnit);
      serviceDetails.priceInterval = priceContent(serviceDetails.priceInterval);
      serviceDetails.freeVersionLink = addHttp(serviceDetails.freeVersionLink);

      serviceDetails.pricingDocumentEXTENTION = getExtension(serviceDetails.pricingDocumentURL);
      serviceDetails.sfiaRateDocumentEXTENTION = getExtension(serviceDetails.sfiaRateDocumentURL);
      serviceDetails.serviceDefinitionDocumentEXTENTION = getExtension(serviceDetails.serviceDefinitionDocumentURL);
      serviceDetails.termsAndConditionsDocumentEXTENTION = getExtension(serviceDetails.termsAndConditionsDocumentURL);
    }

    const releatedContent = req.session.releatedContent;
    const appendData = {
      releatedContent: releatedContent,
      lotId: req.session.lotId,
      agreementLotName: req.session.agreementLotName,
      serviceDetails,
      supplierDetails,
      returnto: `/g-cloud/search${req.session.searchResultsUrl == undefined ? '' : '?' + req.session.searchResultsUrl}`,
    };
    //CAS-INFO-LOG
    LoggTracer.infoLogger(null, logConstant.gcServices, req);
    res.render('services', appendData);
  } catch (error) {
    LoggTracer.errorLogger(
      req,
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'G-Cloud 13 throws error - Tenders Api is causing problem',
      true
    );
  }
};

const priceContent = (name?: string): string => {
  if (name === undefined || name === null) return '';

  const result = ['a', 'e', 'i', 'o', 'hour'].some((word) => name.startsWith(word));

  const indefiniteArticle = result ? 'an' : 'a';

  return `${indefiniteArticle} ${name}`;
};

const addHttp = (url?: string): string | null => {
  if (url === undefined || url === null) return null;

  if (!/^(?:f|ht)tps?:\/\//.test(url)) {
    url = 'http://' + url;
  }

  return url;
};

const getExtension = (documentURL?: string): string => {
  if (documentURL === undefined || documentURL === null) return '';

  return path.extname(documentURL).replace('.', '');
};
