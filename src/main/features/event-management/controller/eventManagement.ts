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
        status = element.activeEvent.status
        projectName = element.projectName
        eventId = element.activeEvent.id.toString()
        eventType = element.activeEvent.eventType
        projectId = element.projectId
        lotid = element.lotId
        title = element.activeEvent.title

      }
    });
    const baseurl = `/tenders/projects/${projectId}/events`
    const apidata = await TenderApi.Instance(SESSION_ID).get(baseurl)


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
    let supplierName = [];

    let showallDownload = false;
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
      supplierName.push(dataPrepared)
    }
    const supplierSummary = supplierdata.data;

    //if (status == "Published" || status == "Response period closed" || status == "Response period open" || status=="To be evaluated" ) {
    //Get Q&A Count
    const baseQandAURL = `/tenders/projects/${req.session.projectId}/events/${req.session.eventId}/q-and-a`;
    const fetchData = await TenderApi.Instance(SESSION_ID).get(baseQandAURL);
    let showCloseProject = false;
          if (status == "Published" || status == "To be Evaluated") {
            showCloseProject = true;
          }
          
          const appendData = { data: eventManagementData, status, projectName, eventId, eventType, apidata, supplierName, supplierSummary, showallDownload, QAs: fetchData.data, suppliers: localData, unreadMessage: unreadMessage, showCloseProject }
    if (status == "IN PROGRESS" || status == "In Progress") {
      let redirectUrl: string
      switch (eventType) {
        case "RFI":
          redirectUrl = '/rfi/rfi-tasklist'
          break
        case "EOI":
          redirectUrl = '/eoi/eoi-tasklist'
          break
        case "TBD":
          redirectUrl = '/projects/create-or-choose'
          break
        case "DA":
          redirectUrl = '/da/task-list?path=B1'
          break
        case "FC":
          redirectUrl = '/rfp/task-list'
          break
        case "DAA":
          redirectUrl = '/projects/create-or-choose' // Path needs to be updated as per the AC
          break
        case "FCA":
          redirectUrl = '/projects/create-or-choose' // Path needs to be updated as per the AC
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


          //const appendData = { data: eventManagementData, status, projectName, eventId, eventType,apidata,supplierName,supplierSummary,showallDownload, suppliers: localData, unreadMessage: unreadMessage }
          
          
          res.render('eventManagement', appendData)

          break
        case "FC":
          // redirectUrl_ = "/rfp/rfp-unpublishedeventmanagement"
          // res.redirect(redirectUrl_)
          res.render('eventManagement', appendData)
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

}
//publisheddoc?download=1
export const PUBLISHED_PROJECT_DOWNLOAD = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId } = req.session;
  const { eventId } = req.session;
  const { download } = req.query;

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
}