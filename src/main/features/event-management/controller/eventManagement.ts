import * as express from 'express'
import { ParsedQs } from 'qs'
import { LoggTracer } from '@common/logtracer/tracer'
import { TokenDecoder } from '@common/tokendecoder/tokendecoder'
import * as eventManagementData from '../../../resources/content/event-management/event-management.json'

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
    let agreementName: string, agreementLotName: string, agreementId_session: string, projectName: string, status: string, eventId: string

    events.forEach((element: { activeEvent: { id: string | ParsedQs | string[] | ParsedQs[]; agreement: string; lot: string; AgreementID: string; status: string }; projectName: string }) => {
      if (element.activeEvent.id == id) {
        agreementName = element.activeEvent.agreement
        agreementLotName = element.activeEvent.lot
        agreementId_session = element.activeEvent.AgreementID
        status = element.activeEvent.status
        projectName = element.activeEvent.id + " / " + element.projectName
        eventId = element.activeEvent.id.toString()
      }
    });


    // Code Block ends

    const appendData = { data: eventManagementData, status, projectName, eventId }
    res.locals.event_header = { agreementName, agreementLotName, agreementId_session }
    req.session.event_header = res.locals.event_header
    res.render('eventManagement', appendData)
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