//@ts-nocheck
import * as express from 'express';
import * as cmsData from '../../../resources/content/RFI/review.json';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import { HttpStatusCode } from '../../../errors/httpStatusCodes';
import { RFI_REVIEW_HELPER } from '../helpers/review';
//@GET /rfi/review

export const GET_RFI_REVIEW = async (req: express.Request, res: express.Response) => {
  RFI_REVIEW_HELPER(req, res, false, false);
};

//@POST  /rfi/review

export const POST_RFI_REVIEW = async (req: express.Request, res: express.Response) => {
  const { rfi_publish_confirmation, finished_pre_engage } = req.body;
  const ProjectID = req.session['projectId'];
  const EventID = req.session['eventId'];
  const BASEURL = `/tenders/projects/${ProjectID}/events/${EventID}/publish`;
  const { SESSION_ID } = req.cookies;
  let CurrentTimeStamp = req.session.endDate;
  CurrentTimeStamp = new Date(CurrentTimeStamp.split('*')[1]).toISOString();

  const _bodyData = {
    endDate: CurrentTimeStamp,
  };
  //Fix for SCAT-3440
  const agreementName = req.session.agreementName;
  const lotid = req.session?.lotId;
  const project_name = req.session.project_name;
  const agreementId_session = req.session.agreement_id;
  const agreementLotName = req.session.agreementLotName;
  res.locals.agreement_header = { agreementName, project_name, agreementId_session, agreementLotName, lotid };

  if (finished_pre_engage && rfi_publish_confirmation === '1') {
    try {
      await TenderApi.Instance(SESSION_ID).put(BASEURL, _bodyData);
      const response = await TenderApi.Instance(SESSION_ID).put(`journeys/${ProjectID}/steps/2`, 'Completed');
      if (response.status == Number(HttpStatusCode.OK)) {
        await TenderApi.Instance(SESSION_ID).put(`journeys/${ProjectID}/steps/14`, 'Completed');
      }

      res.redirect('/rfi/event-sent');
    } catch (error) {
      LoggTracer.errorLogger(res, error, `${req.headers.host}${req.originalUrl}`, null,
        TokenDecoder.decoder(SESSION_ID), "Dyanamic framework throws error - Tender Api is causing problem", false)
      RFI_REVIEW_HELPER(req, res, true, true);
    }
  } else {
    RFI_REVIEW_HELPER(req, res, true, false);
  }
};
