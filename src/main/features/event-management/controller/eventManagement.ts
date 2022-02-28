import * as express from 'express'
import { ParsedQs } from 'qs'
import { LoggTracer } from '@common/logtracer/tracer'
import { TokenDecoder } from '@common/tokendecoder/tokendecoder'
import { Procurement } from '../../procurement/model/project';
import { ReleatedContent } from '../../agreement/model/related-content'
import * as eventManagementData from '../../../resources/content/event-management/event-management.json'
import * as localData from '../../../resources/content/event-management/local-SOI.json' // replace this JSON with API endpoint

/**
 * 
 * @Rediect 
 * @endpoint /event/management
 * @param req 
 * @param res 
 */
export const EVENT_MANAGEMENT = (req: express.Request, res: express.Response) => {
  const { id } = req.query
  const events = req.session.openProjectActiveEvents
  const { SESSION_ID } = req.cookies
  try {
    // Code Block start - Replace this block with API endpoint
    let agreementName: string, agreementLotName: string, projectId: string, lotid: string, title: string, agreementId_session: string, projectName: string, status: string, eventId: string, eventType: string

    events.forEach((element: { projectId: string, activeEvent: { id: string | ParsedQs | string[] | ParsedQs[]; projectId: string; title: string; lotid: string; agreement: string; eventType: string; lot: string; AgreementID: string; status: string }; projectName: string }) => {
      if (element.activeEvent.id == id) {
        agreementName = element.activeEvent.agreement
        agreementLotName = element.activeEvent.lot
        agreementId_session = element.activeEvent.AgreementID
        status = element.activeEvent.status
        projectName = element.activeEvent.id + " / " + element.projectName
        eventId = element.activeEvent.id.toString()
        eventType = element.activeEvent.eventType
        projectId = element.projectId
        lotid = element.activeEvent.lotid
        title = element.activeEvent.title
      }
    });

    // Code Block ends

    // Update procurement data into (redis) session
    const proc: Procurement = {
      procurementID: projectId,
      eventId: eventId,
      defaultName: {
        name: title,
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

    // Releated content session values
    const releatedContent: ReleatedContent = new ReleatedContent();
    releatedContent.name = agreementName
    releatedContent.lotName = lotid +" : "+agreementLotName
    releatedContent.lotUrl = "/agreement/lot?agreement_id=RM6263&lotNum=" + req.session.lotId.replace(/ /g, "%20");
    releatedContent.title = 'Related content'
    req.session.releatedContent = releatedContent

    // Event header
    res.locals.agreement_header = { project_name: title, agreementName, agreementId_session, agreementLotName, lotid }
    req.session.agreement_header = res.locals.agreement_header
    const appendData = { data: eventManagementData, status, projectName, eventId, eventType, suppliers: localData }

    if (status == "Published") {
      res.render('eventManagement', appendData)
    } else {
      if (eventType == "RFI")
      {
        res.redirect("/rfi/rfi-tasklist");
      } else if (eventType == "EOI") {
        res.redirect("/eoi/eoi-tasklist"); 
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