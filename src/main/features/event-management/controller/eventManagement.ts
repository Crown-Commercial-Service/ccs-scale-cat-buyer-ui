import * as express from 'express'
import { ParsedQs } from 'qs'
import { LoggTracer } from '@common/logtracer/tracer'
import { TokenDecoder } from '@common/tokendecoder/tokendecoder'
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance'
import { Procurement } from '../../procurement/model/project';
import { ReleatedContent } from '../../agreement/model/related-content'
import * as eventManagementData from '../../../resources/content/event-management/event-management.json'
import { Message } from '../model/messages'
import * as localData from '../../../resources/content/event-management/local-SOI.json' // replace this JSON with API endpoint
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { SupplierAddress, SupplierDetails } from '../model/supplierDetailsModel';
import { HttpStatusCode } from 'main/errors/httpStatusCodes';
import { AgreementAPI } from './../../../common/util/fetch/agreementservice/agreementsApiInstance';

/**
 * 
 * @Rediect 
 * @endpoint /event/management
 * @param req 
 * @param res 
 */
export const EVENT_MANAGEMENT = async (req: express.Request, res: express.Response) => {
  const { id } = req.query
  const events = req.session.openProjectActiveEvents
  const { SESSION_ID } = req.cookies

  // const projectId = req.session['projectId']
  //const eventId = req.session['eventId']
  try {
    // Code Block start - Replace this block with API endpoint
    let agreementName: string, agreementLotName: string, projectId: string, lotid: string, title: string, agreementId_session: string, projectName: string, status: string, eventId: string, eventType: string

    events.forEach((element: { activeEvent: { id: string | ParsedQs | string[] | ParsedQs[]; status: string; eventType: string; title: string; }; agreementName: string; lotName: string; agreementId: string; projectName: string; projectId: string; lotId: string; }) => {
      if (element.activeEvent.id == id) {
        agreementName = element.agreementName
        agreementLotName = element.lotName
        agreementId_session = element.agreementId
        status = element?.activeEvent?.status?.toLowerCase()
        projectName = element.projectName
        eventId = element.activeEvent.id.toString()
        eventType = element.activeEvent.eventType
        projectId = element.projectId
        lotid = element.lotId
        title = element.activeEvent.title

      }
    });

    //#region supplier information
    const baseurl_Supplier = `/agreements/${agreementId_session}/lots/${lotid}/suppliers`
    let supplierDataList = await (await AgreementAPI.Instance.get(baseurl_Supplier)).data;
    //#endregion

    const baseurl = `/tenders/projects/${projectId}/events`
    const apidata = await TenderApi.Instance(SESSION_ID).get(baseurl)
    //status=apidata.data[0].dashboardStatus;
    status = apidata.data.filter((d: any) => d.id == eventId)[0].dashboardStatus;

    // Code Block ends

    // Update procurement data into (redis) session
    const proc: Procurement = {
      procurementID: projectId,
      eventId: eventId,
      defaultName: {
        name: projectName,
        components: {
          agreementId: agreementId_session,
          lotId: lotid,
          org: "COGNIZANT BUSINESS SERVICES UK LIMITED",
        }
      },
      started: true
    }
    req.session.procurements.push(proc)
    // Added required session values for accessign the pre-market pages
    req.session.eventManagement_eventType = eventType
    req.session.agreement_id = agreementId_session
    req.session.agreementLotName = agreementLotName
    req.session.agreementName = agreementName
    req.session.lotId = lotid
    req.session['projectId'] = projectId
    req.session['eventId'] = eventId
    req.session['evetTitle'] = title
    req.session['Projectname'] = projectName
    req.session['project_name'] = projectName
    req.session.selectedeventtype = ''

    // Releated content session values
    const releatedContent: ReleatedContent = new ReleatedContent();
    releatedContent.name = agreementName
    releatedContent.lotName = lotid + " : " + agreementLotName
    releatedContent.lotUrl = "/agreement/lot?agreement_id=RM6263&lotNum=" + req.session.lotId.replace(/ /g, "%20");
    releatedContent.title = 'Related content'
    req.session.releatedContent = releatedContent

    //Related to AssessmentID
    const baseURL = `tenders/projects/${projectId}/events/${eventId}`;
    const data = await TenderApi.Instance(SESSION_ID).get(baseURL)
    const assessmentId = data.data.nonOCDS.assessmentId
    req.session.currentEvent = { assessmentId }

    // Event header
    res.locals.agreement_header = { project_name: projectName, agreementName, agreementId_session, agreementLotName, lotid }
    req.session.agreement_header = res.locals.agreement_header

    // Get unread Message count
    const baseMessageURL = `/tenders/projects/${projectId}/events/${eventId}/messages?message-direction=RECEIVED`
    const message = await TenderApi.Instance(SESSION_ID).get(baseMessageURL)
    let unreadMessage = 0
    const msg: Message[] = message.data.messages
    if (message.data.counts != undefined) {
      msg.forEach(element => {
        if (!element.nonOCDS.read) {
          unreadMessage = unreadMessage + 1
        }
      });
    }
    //Supplier of interest
    const supplierInterestURL = `tenders/projects/${projectId}/events/${eventId}/responses`
    const supplierdata = await TenderApi.Instance(SESSION_ID).get(supplierInterestURL)
    //Supplier score
    const supplierScoreURL = `tenders/projects/${projectId}/events/${eventId}/scores`
    const supplierScore = await TenderApi.Instance(SESSION_ID).get(supplierScoreURL)
    let supplierDetailsDataList: SupplierDetails[] = [];
    let showallDownload = false;
    for (let i = 0; i < supplierdata?.data?.responders?.length; i++) {
      let id = supplierdata.data.responders[i].supplier.id;
      let score = supplierScore?.data?.filter((x: any) => x.organisationId == id)[0]?.score
      if (supplierdata.data.responders[i].responseState == 'Submitted') {
        showallDownload = true;
      }
      let supplierDetailsObj = {} as SupplierDetails;

      supplierDetailsObj.supplierName = supplierdata.data.responders[i].supplier.name;
      supplierDetailsObj.responseState = supplierdata.data.responders[i].responseState;
      supplierDetailsObj.responseDate = supplierdata.data.responders[i].responseDate;
      supplierDetailsObj.score = (score != undefined) ? score : 0;

      var supplierFiltedData = supplierDataList.filter((a: any) => { a.organization.id == id });
      supplierDetailsObj.supplierAddress = {} as SupplierAddress// supplierFiltedData != null ? supplierFiltedData.address : "";
      supplierDetailsObj.supplierAddress = supplierFiltedData !=undefined && supplierFiltedData != null && supplierFiltedData.length >0? supplierFiltedData.address : {} as SupplierAddress;
      supplierDetailsObj.supplierContactName =supplierFiltedData !=undefined &&  supplierFiltedData != null && supplierFiltedData.length >0 ? supplierFiltedData.contactPoint.name : "";
      supplierDetailsObj.supplierContactEmail = supplierFiltedData !=undefined && supplierFiltedData != null && supplierFiltedData.length >0 ? supplierFiltedData.contactPoint.email : "";
      supplierDetailsObj.supplierWebsite =supplierFiltedData !=undefined &&  supplierFiltedData != null && supplierFiltedData.length >0 ? supplierFiltedData.contactPoint.telephone : "";
      supplierDetailsObj.supplierId = id;
      supplierDetailsDataList.push(supplierDetailsObj);
      if (supplierdata.data.responders[i].responseState.trim().toLowerCase() == 'submitted') {
        showallDownload = true;
      }
    }
    const supplierSummary = supplierdata.data;
    supplierDetailsDataList.sort((a, b) => (Number(a.score) > Number(b.score) ? -1 : 1));

    let rankCount = 0;
    for (let i = 0; i < supplierDetailsDataList.length; i++) {
      rankCount = rankCount + 1
      supplierDetailsDataList[i].rank = "" + rankCount;
    }

    //if (status == "Published" || status == "Response period closed" || status == "Response period open" || status=="To be evaluated" ) {
    //Get Q&A Count
    const baseQandAURL = `/tenders/projects/${req.session.projectId}/events/${req.session.eventId}/q-and-a`;
    const fetchData = await TenderApi.Instance(SESSION_ID).get(baseQandAURL);
    let showCloseProject = false;
    if (status.toLowerCase() == "published" || status.toLowerCase() == "to-be-evaluated") {
      showCloseProject = true;
    }
    const procurementId = req.session['projectId'];
    const collaboratorsBaseUrl = `/tenders/projects/${procurementId}/users`;
    let collaboratorData = await DynamicFrameworkInstance.Instance(SESSION_ID).get(collaboratorsBaseUrl);
    collaboratorData = collaboratorData.data;
    const appendData = { data: eventManagementData, Colleagues: collaboratorData, status, projectName, eventId, eventType, apidata, supplierDetailsDataList, supplierSummary, showallDownload, QAs: fetchData.data, suppliers: localData, unreadMessage: unreadMessage, showCloseProject }

    let redirectUrl: string
    if (status.toLowerCase() == "in-progress") {
      switch (eventType) {
        case "RFI":
          redirectUrl = '/rfi/rfi-tasklist'
          break
        case "EOI":
          redirectUrl = '/eoi/eoi-tasklist'
          break
        case "DA":
          redirectUrl = '/rfp/task-list'
          req.session.selectedeventtype = "DA"
          break
        case "FC":
          redirectUrl = '/rfp/task-list'
          break
        default:
          redirectUrl = '/event/management'
          break
      }
      res.redirect(redirectUrl)
    }
    else if (status.toLowerCase() == 'assessment') {
      switch (eventType) {
        case "DAA":
          redirectUrl = '/da/task-list?path=B1'
          break
        case "FCA":
          redirectUrl = '/ca/task-list?path=A1'
          break
        default:
          redirectUrl = '/event/management'
          break
      }
      res.redirect(redirectUrl)
    } else if (status.toLowerCase() == 'unknown') {
      switch (eventType) {
        case "TBD":
          const { eventId, projectId, procurements } = req.session;
          const currentProcNum = procurements.findIndex(
            (proc: any) => proc.eventId === eventId && proc.procurementID === projectId,
          );
          req.session.procurements[currentProcNum].started = false;
          redirectUrl = '/projects/create-or-choose'
          break
        default:
          redirectUrl = '/event/management'
          break
      }
      res.redirect(redirectUrl)
    }
    else {
      let redirectUrl_: string
      switch (eventType) {

        case "RFI":
          if (status != undefined && status.toLowerCase() == "pre-award" || status.toLowerCase() == "awarded" || status.toLowerCase() == "complete") {
            res.render('awardEventManagement', appendData)
          }
          else {
            res.render('eventManagement', appendData)
          }

          break
        case "FC":
          if (status != undefined && status.toLowerCase() == "pre-award" || status.toLowerCase() == "awarded" || status.toLowerCase() == "complete") {
            res.render('awardEventManagement', appendData)
          }
          else {
            res.render('eventManagement', appendData)
          }
          break
        case "DA":
          req.session.selectedeventtype = "DA"
          if (status != undefined && status.toLowerCase() == "pre-award" || status.toLowerCase() == "awarded" || status.toLowerCase() == "complete") {
            res.render('awardEventManagement', appendData)
          }
          else {
            res.render('eventManagement', appendData)
          }
          break
        default:
          redirectUrl_ = '/event/management'
          res.redirect(redirectUrl_)
          break
      }
    }
  } catch (err) {
    LoggTracer.errorLogger(
      res,
      err,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Event management page',
      true,
    );
  }
}
export const EVENT_MANAGEMENT_DOWNLOAD = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId } = req.session;
  const { eventId } = req.session;
  const { supplierid } = req.query;

  try {
    if (supplierid != undefined) {

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
    }

    else {

      const FileDownloadURL = `/tenders/projects/${projectId}/events/${eventId}/responses/export`;
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
      res.send(fileData)
    }
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

}
//publisheddoc?download=1
export const PUBLISHED_PROJECT_DOWNLOAD = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId } = req.session;
  const { eventId } = req.session;
  const { download } = req.query;

  try {
    if (download != undefined) {
      const FileDownloadURL = `/tenders/projects/${projectId}/events/${eventId}/documents/export`;
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
    } 
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
}

//supplieranswer?supplierid=1
export const SUPPLIER_ANSWER_DOWNLOAD = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId } = req.session;
  const { eventId } = req.session;
  const { supplierid } = req.query;

  try {
    if (supplierid != undefined) {
      // /tenders/projects/{proc-id}/events/{event-id}/responses/{supplier-id]}/export
      const FileDownloadURL = `/tenders/projects/${projectId}/events/${eventId}/responses/${supplierid}/documents`;
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
    }
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
}

//supplieranswer?download=1
export const SUPPLIER_ANSWER_DOWNLOAD_ALL = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId } = req.session;
  const { eventId } = req.session;
  const { download,download_all} = req.query;

  try {
    if (download != undefined) {
      const FileDownloadURL = `/tenders/projects/${projectId}/events/${eventId}/responses/export`;
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
    }
    else if(download_all != undefined)
    {
      //Download all for awarded supplier
      const FileDownloadURL = `/tenders/projects/${projectId}/events/${eventId}/awards/templates/export`;
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
    }
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
}

//unsuccessful?download=1
export const UNSUCCESSFUL_SUPPLIER_DOWNLOAD = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId } = req.session;
  const { eventId } = req.session;
  const { download } = req.query;

  try {
    if (download != undefined) {
      const FileDownloadURL = `/tenders/projects/${projectId}/events/${eventId}/awards/templates`;
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
    }
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
  
}


//supplieranswer?download=1
export const SUPPLIER_EVALUATION = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId } = req.session;
  const { eventId } = req.session;
  const { download } = req.query;

  try {
    if (download != undefined ) {
      const FileDownloadURL = `/tenders/projects/${projectId}/events/${eventId}/responses/export`;
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
    }
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
}

//confirm-supplier-award
export const CONFIRM_SUPPLIER_AWARD = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId, eventId } = req.session;
  const { pre_award_supplier_confirmation, supplier_id, status_flag } = req.body;

  if (pre_award_supplier_confirmation != undefined && pre_award_supplier_confirmation === '1') {
    let awardId = 1;
    let state = "";
    if (status_flag.toUpparCase() == "AWARDED") {
      state = "COMPLETE"
      // const signedURL = `tenders/projects/${projectId}/events/${eventId}/signed`    
    }
    else {
      state = "AWARD"
    }
    const awardURL = `tenders/projects/${projectId}/events/${eventId}/awards/${awardId}?award-state=${state}`
    //const awardURL = `tenders/projects/${projectId}/events/${eventId}/state/${state}/awards/${awardId}`
    const putBody = {
      "suppliers": [
        {
          "id": supplier_id
        }
      ]
    };
    const response = await TenderApi.Instance(SESSION_ID).put(awardURL, putBody);
    if (response.status == Number(HttpStatusCode.OK)) {
      res.redirect('/event/management?id=' + eventId);
    }
  }
}