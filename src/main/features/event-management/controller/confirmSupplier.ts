import { LoggTracer } from '@common/logtracer/tracer';
import { TokenDecoder } from '@common/tokendecoder/tokendecoder';
import * as express from 'express'
//import { LoggTracer } from '@common/logtracer/tracer'
//import { TokenDecoder } from '@common/tokendecoder/tokendecoder'
//import { CreateMessage } from '../model/createMessage'
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance'
//import * as inboxData from '../../../resources/content/event-management/messaging-create.json'
import * as localContent from '../../../resources/content/event-management/event-management.json'
import { AgreementAPI } from '../../../common/util/fetch/agreementservice/agreementsApiInstance'


export const GET_CONFIRM_SUPPLIER = async (req: express.Request, res: express.Response) => {

  const { SESSION_ID } = req.cookies;
  let { projectId, eventId, projectName, agreement_id, lotId } = req.session;
  const { supplierid } = req.query;
  //LOCAL VERIABLE agreement_id, lotId
  let status: string;
  //eventType: string,agreementName: string, agreementLotName: string, lotid: string, title: string, agreementId_session: string,
  try {

    res.locals.agreement_header = req.session.agreement_header;
    let supplierDetailsList = [];
    let showallDownload = false;
    let supplierDetails = {
      supplierName: "",
      supplierAddress: "",
      supplierContactName: "",
      supplierContactEmail: "",
      supplierWebsite: "",
      supplierId: ""
    };
    //Supplier of interest
    const supplierInterestURL = `tenders/projects/${projectId}/events/${eventId}/responses`
    const supplierdata = await TenderApi.Instance(SESSION_ID).get(supplierInterestURL)
    //agreements/{agreement-id}/lots/{lot-id}/suppliers
    const baseurl_Supplier = `agreements/${agreement_id}/lots/${lotId}/suppliers`
    const supplierDataList = await (await AgreementAPI.Instance.get(baseurl_Supplier))?.data;


    for (let i = 0; i < supplierdata.data.responders.length; i++) {
      let dataPrepared = {
        "id": supplierdata.data.responders[i].supplier.id,
        "name": supplierdata.data.responders[i].supplier.name,
        "responseState": supplierdata.data.responders[i].responseState,
        "responseDate": supplierdata.data.responders[i].responseDate
      }
      if (supplierdata.data.responders[i].responseState == 'Submitted') {
        showallDownload = true;
      }
      if (supplierdata.data.responders[i].supplier.id == supplierid) {

        // let supplierData = supplierDataList.filter((x: any) => x.);
        supplierDetails.supplierName = supplierdata.data.responders[i].supplier.name;
        supplierDetails.supplierAddress = supplierDataList != null ? "" : "";
        supplierDetails.supplierContactName = supplierDataList != null ? "" : "";
        supplierDetails.supplierContactEmail = supplierDataList != null ? "" : "";
        supplierDetails.supplierWebsite = supplierDataList != null ? "" : "";
        supplierDetails.supplierId = supplierid.toString();
        supplierDetailsList.push(dataPrepared);
      }
      //supplierDetailsList.push(dataPrepared);
    }
    if (supplierid != undefined && supplierid != null && supplierdata.data.responders != null && supplierdata.data.responders.length > 0) {
      supplierdata.data.responders.filter((x: any) => {
        if (x != null && x.supplier.id == supplierid) {
          supplierDetails.supplierName = x.supplier.name;
          // supplierDetails.supplierAddress=x.supplier.name;
        }
      })
    }

    //SELECTED EVENT DETAILS FILTER FORM LIST
    const baseurl = `/tenders/projects/${projectId}/events`
    const apidata = await TenderApi.Instance(SESSION_ID).get(baseurl)
    //status=apidata.data[0].dashboardStatus;
    const selectedEventData = apidata.data.filter((d: any) => d.id == eventId);
    status = selectedEventData[0].dashboardStatus


    //Final Object
    let eventManagementData = {
      projectId,
      eventId,
      projectName,
      status,
      supplierDetails,
      showallDownload,
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
    res.redirect('/award-supplier?supplierId='+supplierId)
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