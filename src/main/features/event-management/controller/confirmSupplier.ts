import * as express from 'express'
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance'
import * as localContent from '../../../resources/content/event-management/event-management.json'
import { AgreementAPI } from '../../../common/util/fetch/agreementservice/agreementsApiInstance'
import { SupplierDetails,SupplierAddress } from '../model/supplierDetailsModel';
import { LoggTracer } from '../../../common/logtracer/tracer'
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder'
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';

export const GET_CONFIRM_SUPPLIER = async (req: express.Request, res: express.Response) => {

  const { SESSION_ID } = req.cookies;
  let { projectId, eventId, projectName} = req.session;
  const { supplierid } = req.query;
  const agreement_id = req.session?.agreement_id;
  const lotId = req.session?.lotId;
  //LOCAL VERIABLE agreement_id, lotId
  let status: string;

  //#region supplier information
  const baseurl_Supplier = `/agreements/${agreement_id}/lots/${lotId}/suppliers`
  let supplierDataList = await (await AgreementAPI.Instance.get(baseurl_Supplier)).data;

  try {

    res.locals.agreement_header = req.session.agreement_header;
    let showallDownload = false;
    let supplierDetailsList: SupplierDetails[] = [];
    let supplierDetails = {} as SupplierDetails;

    //Supplier of interest
    const supplierInterestURL = `tenders/projects/${projectId}/events/${eventId}/responses`
    const supplierdata = await TenderApi.Instance(SESSION_ID).get(supplierInterestURL)
    //Supplier score
    const supplierScoreURL = `tenders/projects/${projectId}/events/${eventId}/scores`
    const supplierScore = await TenderApi.Instance(SESSION_ID).get(supplierScoreURL)

    for (let i = 0; i < supplierdata?.data?.responders?.length; i++) {
      let id = supplierdata.data.responders[i]?.supplier?.id;
      let score = supplierScore?.data?.filter((x: any) => x.organisationId == id)[0]?.score
      if (supplierdata.data.responders[i]?.responseState == 'Submitted') {
        showallDownload = true;
      }
      if (id == supplierid) {

        supplierDetails.supplierName = supplierdata.data.responders[i].supplier?.name;
        supplierDetails.responseState = supplierdata.data.responders[i]?.responseState;
        supplierDetails.responseDate = supplierdata.data.responders[i]?.responseDate;
        supplierDetails.score = (score != undefined) ? score : 0;

        supplierDetails.supplierId = id;
        supplierDetailsList.push(supplierDetails);
        req.session['supplierName'] = supplierDetails.supplierName;
        req.session['supplierId'] = id;
      }
      //supplierDetailsList.push(dataPrepared);
    }
    if (supplierid != undefined && supplierid != null) {
      var supplierFiltedData = supplierDataList?.filter((a: any) => a.organization.id == supplierid)[0]?.organization;
      if (supplierFiltedData != null && supplierFiltedData != undefined) {
      supplierDetails.supplierAddress = {} as SupplierAddress;
      supplierDetails.supplierAddress = supplierFiltedData.address != undefined && supplierFiltedData.address != null ? supplierFiltedData?.address : null
      supplierDetails.supplierContactName = supplierFiltedData.contactPoint != undefined && supplierFiltedData.contactPoint != null && supplierFiltedData.contactPoint?.name !=undefined && supplierFiltedData.contactPoint?.name !=null ? supplierFiltedData.contactPoint?.name : null;
      supplierDetails.supplierContactEmail = supplierFiltedData.contactPoint != undefined? supplierFiltedData.contactPoint?.email : null;
      supplierDetails.supplierWebsite = supplierFiltedData.contactPoint != undefined && supplierFiltedData.contactPoint != null ? supplierFiltedData.contactPoint?.url : null;
      }
    }

    //SELECTED EVENT DETAILS FILTER FORM LIST
    const baseurl = `/tenders/projects/${projectId}/events`
    const apidata = await TenderApi.Instance(SESSION_ID).get(baseurl)
    //status=apidata.data[0].dashboardStatus;
    const selectedEventData = apidata?.data?.filter((d: any) => d.id == eventId);
    status = selectedEventData?.[0].dashboardStatus


    //Final Object
    let eventManagementData = {
      projectId,
      eventId,
      supplierid,
      projectName,
      status,
      supplierDetails,
      showallDownload
    };
    const appendData = { eventManagementData, contentData: localContent, supplierDetailsList, projectName };
    res.render('confirmSupplier', appendData);
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Tenders Service Api cannot be connected',
      true,
    );
  }
  //All locol object

}

export const POST_CONFIRM_SUPPLIER = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { supplierId } = req.query;

  try {
    res.redirect('/award-supplier?supplierId=' + supplierId)
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Tenders Service Api cannot be connected',
      true,
    );
  }
  //
}
export const Download_SUPPLIER_RESPONCE = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { supplierid } = req.query;
  let { projectId, eventId } = req.session;


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
      'Tenders Service Api cannot be connected',
      true,
    );
  }
  //
}

