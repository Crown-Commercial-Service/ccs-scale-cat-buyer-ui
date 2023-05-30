import * as express from 'express';
import * as cmsData from '../../../resources/content/eoi/eoiType.json';
import * as mcf3cmsData from '../../../resources/content/MCF3/eoi/eoiType.json';
import { ObjectModifiers } from '../util/operations/objectremoveEmptyString';
import { EOI_PATHS } from '../model/eoiconstant';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
//import { HttpStatusCode } from 'main/errors/httpStatusCodes';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { logConstant } from '../../../common/logtracer/logConstant';

//import { ShouldEventStatusBeUpdated } from '../../shared/ShouldEventStatusBeUpdated';

// eoi TaskList
export const GET_TYPE = async (req: express.Request, res: express.Response) => {
  const { agreement_id } = req.session;
  const { SESSION_ID } = req.cookies;
  const { eventId } = req.session;
  const releatedContent = req.session.releatedContent;
  const agreementId_session = req.session.agreement_id;
  let forceChangeDataJson;
  if (agreementId_session == 'RM6187') {
    //MCF3
    forceChangeDataJson = mcf3cmsData;
  } else {
    forceChangeDataJson = cmsData;
  }

  const { data: journeySteps } = await TenderApi.Instance(SESSION_ID).get(`journeys/${eventId}/steps`);

  const journeys = journeySteps.find((item: { step: number }) => item.step == 19);

  let checked = false;
  if (journeys.state == 'Completed') {
    checked = true;
  }

  const windowAppendData = { data: forceChangeDataJson, agreement_id: agreement_id, releatedContent, checked };

  //CAS-INFO-LOG
  LoggTracer.infoLogger(null, logConstant.chooseHowBuildYourEoiPageLog, req);

  res.render('typeEoi', windowAppendData);
};

/**
 * @POSTController
 * @description
 *
 */
//POST 'eoi/type'
/**
 *
 * @param req
 * @param res
 * @GETController
 */

export const POST_TYPE = async (req: express.Request, res: express.Response) => {
  const { agreement_id } = req.query;
  const { eventId, projectId } = req.session;
  const { SESSION_ID } = req.cookies;
  try {
    //let flag = await ShouldEventStatusBeUpdated(eventId, 19, req);
    //await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/19`, 'In progress');
    //if (flag) {

    await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/19`, 'Completed');
    //}
    // if (response.status == HttpStatusCode.OK) {
    //   await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/20`, 'Not started');
    // }
    const filtered_body_content_removed_eoi_key = ObjectModifiers._deleteKeyofEntryinObject(
      req.body,
      'choose_eoi_type'
    );

    const { ccs_eoi_type } = filtered_body_content_removed_eoi_key;

    switch (ccs_eoi_type) {
    case 'all_online':
      // eslint-disable-next-line no-case-declarations
      const redirect_address = `/eoi/online-task-list?agreement_id=${agreement_id}&proc_id=${projectId}&event_id=${eventId}`;

      //CAS-INFO-LOG
      LoggTracer.infoLogger(null, logConstant.chooseHowBuildYourEoiUpdated, req);

      res.redirect(redirect_address);
      break;

    case 'all_offline':
      // eslint-disable-next-line no-case-declarations
      const newAddress = EOI_PATHS.GET_OFFLINE;
      res.redirect(newAddress);
      break;

    default:
      res.redirect('/404');
    }
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - Put failed - EOI type page',
      true
    );
  }
};
