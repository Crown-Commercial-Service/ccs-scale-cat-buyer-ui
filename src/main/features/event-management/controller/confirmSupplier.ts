import * as express from 'express';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import * as localContent from '../../../resources/content/event-management/event-management.json';
import { SupplierAddress, SupplierDetails } from '../model/supplierDetailsModel';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { logConstant } from '../../../common/logtracer/logConstant';
import { agreementsService } from 'main/services/agreementsService';

export const GET_CONFIRM_SUPPLIER = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId, eventId, projectName, agreement_id, lotId } = req.session;
  const { supplierid } = req.query;
  //LOCAL VERIABLE agreement_id, lotId
  let status: string;
  //eventType: string,agreementName: string, agreementLotName: string, lotid: string, title: string, agreementId_session: string,
  try {
    res.locals.agreement_header = req.session.agreement_header;
    let showallDownload = false;
    const supplierDetailsList: SupplierDetails[] = [];
    const supplierDetails = {} as SupplierDetails;

    //Supplier of interest
    const supplierInterestURL = `tenders/projects/${projectId}/events/${eventId}/responses`;
    const supplierdata = await TenderApi.Instance(SESSION_ID).get(supplierInterestURL);

    //CAS-INFO-LOG
    LoggTracer.infoLogger(supplierdata, logConstant.getSupplierResponse, req);

    //agreements/{agreement-id}/lots/{lot-id}/suppliers
    const supplierDataList = (await agreementsService.api.getAgreementLotSuppliers(agreement_id, lotId)).unwrap();
    //Supplier score
    const supplierScoreURL = `tenders/projects/${projectId}/events/${eventId}/scores`;
    const supplierScore = await TenderApi.Instance(SESSION_ID).get(supplierScoreURL);

    //CAS-INFO-LOG
    LoggTracer.infoLogger(supplierScore, logConstant.getSupplierScore, req);

    for (let i = 0; i < supplierdata.data.responders.length; i++) {
      const id = supplierdata.data.responders[i].supplier.id;
      const score = supplierScore?.data?.filter((x: any) => x.organisationId == id)[0]?.score;
      if (supplierdata.data.responders[i].responseState == 'Submitted') {
        showallDownload = true;
      }
      if (supplierdata.data.responders[i].supplier.id == supplierid) {
        let supplierFiltedData;
        for (const sdata of supplierDataList) {
          if (sdata.organization.id == id) {
            supplierFiltedData = sdata.organization;
          }
        }
        // var supplierFiltedData = supplierDataList.filter((a: any) => { a.organization.id == id });
        supplierDetails.supplierName = supplierdata.data.responders[i].supplier.name;
        supplierDetails.responseState = supplierdata.data.responders[i].responseState;
        supplierDetails.responseDate = supplierdata.data.responders[i].responseDate;
        supplierDetails.score = score != undefined ? score : 0;

        supplierDetails.supplierAddress = {} as SupplierAddress; // supplierFiltedData != null ? supplierFiltedData.address : "";
        supplierDetails.supplierAddress =
          supplierFiltedData != undefined && supplierFiltedData != null
            ? supplierFiltedData.address !== undefined
              ? supplierFiltedData.address
              : 'Nil'
            : ({} as SupplierAddress);
        // supplierDetails.supplierAddress = supplierFiltedData != undefined && supplierFiltedData != null ? (supplierFiltedData.address !== undefined) ? supplierFiltedData.address.streetAddress : "Nil" : {} as SupplierAddress;
        supplierDetails.supplierContactName =
          supplierFiltedData != undefined && supplierFiltedData != null
            ? supplierFiltedData.contactPoint !== undefined
              ? supplierFiltedData.contactPoint.name
              : 'Nil'
            : '';
        supplierDetails.supplierContactEmail =
          supplierFiltedData != undefined && supplierFiltedData != null
            ? supplierFiltedData.contactPoint !== undefined
              ? supplierFiltedData.contactPoint.email
              : 'Nil'
            : '';
        supplierDetails.supplierWebsite =
          supplierFiltedData != undefined && supplierFiltedData != null
            ? supplierFiltedData.identifier !== undefined
              ? supplierFiltedData.identifier.uri
              : 'Nil'
            : '';

        supplierDetails.supplierId = id;
        supplierDetailsList.push(supplierDetails);
        req.session['supplierName'] = supplierDetails.supplierName;
        req.session['supplierId'] = id;
      }
      //supplierDetailsList.push(dataPrepared);
    }

    //SELECTED EVENT DETAILS FILTER FORM LIST
    const baseurl = `/tenders/projects/${projectId}/events`;
    const apidata = await TenderApi.Instance(SESSION_ID).get(baseurl);
    //status=apidata.data[0].dashboardStatus;
    const selectedEventData = apidata.data.filter((d: any) => d.id == eventId);
    status = selectedEventData[0].dashboardStatus;

    //Final Object
    const eventManagementData = {
      projectId,
      eventId,
      projectName,
      status,
      supplierDetails,
      showallDownload,
    };
    const stage2BaseUrl = `/tenders/projects/${projectId}/events`;
    const stage2_dynamic_api = await TenderApi.Instance(SESSION_ID).get(stage2BaseUrl);
    const stage2_dynamic_api_data = stage2_dynamic_api.data;
    const stage2_data = stage2_dynamic_api_data?.filter(
      (anItem: any) => anItem.id == eventId && (anItem.templateGroupId == '13' || anItem.templateGroupId == '14')
    );

    let stage2_value = 'Stage 1';
    if (stage2_data.length > 0) {
      stage2_value = 'Stage 2';
    }

    const appendData = {
      eventManagementData,
      contentData: localContent,
      supplierDetailsList,
      projectName,
      stage2_value,
    };

    //CAS-INFO-LOG
    LoggTracer.infoLogger(null, logConstant.supplierToBeAwardedPageLogg, req);

    res.render('confirmSupplier', appendData);
  } catch (error) {
    console.log('error', error);
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Event Management - Confirm Supplier - Tenders Service Api cannot be connected',
      true
    );
  }
  //All locol object
};

export const POST_CONFIRM_SUPPLIER = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { supplierId } = req.query;

  try {
    res.redirect('/award-supplier?supplierId=' + supplierId);
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Event Management - Confirm Supplier - Tenders Service Api cannot be connected',
      true
    );
  }
  //
};
export const Download_SUPPLIER_RESPONCE = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { supplierid } = req.query;
  const { projectId, eventId } = req.session;

  try {
    const FileDownloadURL = `/tenders/projects/${projectId}/events/${eventId}/responses/${supplierid}/export`;

    const FetchDocuments = await DynamicFrameworkInstance.file_dowload_Instance(SESSION_ID).get(FileDownloadURL, {
      responseType: 'arraybuffer',
    });

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
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Evnt Mgmt - Confirm Supplier - Tenders Service Api cannot be connected',
      true
    );
  }
  //
};
