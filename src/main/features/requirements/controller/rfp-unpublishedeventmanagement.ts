import * as express from 'express';
import * as chooseRouteData from '../../../resources/content/requirements/rfp-unpublishedeventmanagement.json';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { getValue } from '../../../utils/statusStepsDataFilter';

//@GET /rfi/event-sent
export const GET_UNPUBLISHED_EVENT_MANAGEMENT  = async (req: express.Request, res: express.Response) => {
    const agreementName = req.session.agreementName;
    const agreementId_session = req.session.agreement_id;
    const { SESSION_ID } = req.cookies; //jwt
    const projectId = req.session.projectId;
    const agreementLotName = req.session.agreementLotName;
    req.session.unpublishedeventmanagement="true";
    const lotid = req.session?.lotId;
    const { data: journeySteps } = await TenderApi.Instance(SESSION_ID).get(`journeys/${projectId}/steps`);
    chooseRouteData.events[0].eventTask[0].status=getValue(journeySteps.filter((d:any) => d.step==28)?.[0]?.state);//procurement lead
    chooseRouteData.events[0].eventTask[1].status=getValue(journeySteps.filter((d:any) => d.step==29)?.[0]?.state);//collaborator
    const appendData = {
        data: chooseRouteData,
        projPersistID: req.session['project_name'],
        rfi_ref_no : req.session.eventId,
        agreementName:agreementName,
        agreementId_session:agreementId_session,
        agreementLotName:agreementLotName,
        lotid:lotid,
        journeySteps:journeySteps
    }
    
    //const { projectId } = req.session;

try {
    res.render('rfp-unpublishedeventmanagement.njk', appendData)
  }catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - update the status failed - RFI Publish Page',
      true,
    );
  }

}





