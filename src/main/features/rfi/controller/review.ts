//@ts-nocheck
import * as express from 'express';
import * as cmsData from '../../../resources/content/RFI/review.json';
import * as Mcf3cmsData from '../../../resources/content/MCF3/RFI/review.json';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import moment from 'moment';
import { HttpStatusCode } from '../../../errors/httpStatusCodes';
import { RFI_REVIEW_HELPER } from '../helpers/review';
import { logConstant } from '../../../common/logtracer/logConstant';
import moment from 'moment-business-days';
import momentz from 'moment-timezone';
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

  /** Daylight saving fix start */
  const isDayLight = momentz(new Date(CurrentTimeStamp)).tz('Europe/London').isDST();
  if (isDayLight) {
    CurrentTimeStamp = momentz(new Date(CurrentTimeStamp)).tz('Europe/London').utc().format('YYYY-MM-DD HH:mm');
    CurrentTimeStamp = moment(new Date(CurrentTimeStamp)).format('YYYY-MM-DDTHH:mm:ss+01:00'); //+01:00
    CurrentTimeStamp = momentz(new Date(CurrentTimeStamp)).tz('Europe/London').utc().toISOString();
  } else {
    CurrentTimeStamp = new Date(CurrentTimeStamp).toISOString();
  }
  /** Daylight saving fix end */

  const _bodyData = {
    endDate: CurrentTimeStamp,
  };
  //Fix for SCAT-3440
  const publishactiveprojects = [];
  publishactiveprojects.push(ProjectID);
  req.session['publishclickevents'] = publishactiveprojects;
  const agreementName = req.session.agreementName;
  const lotid = req.session?.lotId;
  const project_name = req.session.project_name;
  const agreementId_session = req.session.agreement_id;
  const agreementLotName = req.session.agreementLotName;
  res.locals.agreement_header = { agreementName, project_name, agreementId_session, agreementLotName, lotid };

  const BaseURL2 = `/tenders/projects/${ProjectID}/events/${EventID}`;
  const FetchReviewData2 = await DynamicFrameworkInstance.Instance(SESSION_ID).get(BaseURL2);
  const ReviewData2 = FetchReviewData2.data;
  const eventStatus2 = ReviewData2.OCDS.status == 'active' ? 'published' : null;
  let review_publish = 0;
  if (eventStatus2 == 'published') {
    review_publish = 1;
  } else {
    if (finished_pre_engage && rfi_publish_confirmation === '1') {
      review_publish = 1;
    }
  }

  if (review_publish == '1') {
    try {
      const response = await TenderApi.Instance(SESSION_ID).put(`journeys/${EventID}/steps/2`, 'Completed');
      if (response.status == Number(HttpStatusCode.OK)) {
        await TenderApi.Instance(SESSION_ID).put(`journeys/${EventID}/steps/14`, 'Completed');
      }

      if (agreementId_session == 'RM1557.13') {
        const agreementPublishedRaw = TenderApi.Instance(SESSION_ID).put(BASEURL, _bodyData);

        setTimeout(function () {
          res.redirect('/rfi/event-sent');
        }, 5000);
        //CAS-INFO-LOG
        // LoggTracer.infoLogger(null, logConstant.rfiPublishLog, req);
      } else {
        await TenderApi.Instance(SESSION_ID).put(BASEURL, _bodyData);

        //CAS-INFO-LOG
        LoggTracer.infoLogger(null, logConstant.rfiPublishLog, req);

        // const response = await TenderApi.Instance(SESSION_ID).put(`journeys/${EventID}/steps/2`, 'Completed');
        // if (response.status == Number(HttpStatusCode.OK)) {
        //   await TenderApi.Instance(SESSION_ID).put(`journeys/${EventID}/steps/14`, 'Completed');
        // }

        res.redirect('/rfi/event-sent');
      }
    } catch (error) {
      LoggTracer.errorLogger(
        res,
        error,
        `${req.headers.host}${req.originalUrl}`,
        null,
        TokenDecoder.decoder(SESSION_ID),
        'RFI Review - Dyanamic framework throws error - Tender Api is causing problem',
        false
      );
      RFI_REVIEW_HELPER(req, res, true, true);
    }
  } else {
    RFI_REVIEW_HELPER(req, res, true, false);
  }
};
