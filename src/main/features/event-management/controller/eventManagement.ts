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
     const assessmentId=data.data.nonOCDS.assessmentId
     req.session.currentEvent={assessmentId}

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

//Get Q&A Count
    const baseQandAURL = `/tenders/projects/${req.session.projectId}/events/${req.session.eventId}/q-and-a`;
        const fetchData = await TenderApi.Instance(SESSION_ID).get(baseQandAURL);


    if (status == "Published" || status == "Response period closed" || status == "To be Evaluated") {
      let redirectUrl_: string
      switch (eventType) {
       
        case "RFI":
          let showCloseProject=false;
          if(status == "Published" || status == "To be Evaluated")
          {
            showCloseProject=true;
          }
          const appendData = { data: eventManagementData, status, projectName, eventId, eventType,QAs: fetchData.data, suppliers: localData, unreadMessage: unreadMessage ,showCloseProject}
          res.render('eventManagement', appendData)
          break
          case "FC":
            redirectUrl_="/rfp/rfp-unpublishedeventmanagement"    
            res.redirect(redirectUrl_)     
            break
          default:
            redirectUrl_ = '/event/management'
            break
        }
       
  } else {
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