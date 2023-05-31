import * as express from 'express';
import * as fcabuildRfiContent from '../../../resources/content/RFI/choose-buildrfi.json';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { ShouldEventStatusBeUpdated } from '../../shared/ShouldEventStatusBeUpdated';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { logConstant } from '../../../common/logtracer/logConstant';
/**
 *
 * @Rediect
 * @param req
 * @param res
 *
 *
 */
export const BUILD_RFI = async (req: express.Request, res: express.Response) => {
  let appendData: any = { ...fcabuildRfiContent };

  const releatedContent = req.session.releatedContent;
  const { buildYorrfierror } = req.session;
  const { SESSION_ID } = req.cookies;
  const { eventId } = req.session;
  req.session['buildYorrfierror'] = false;
  const agreementName = req.session.agreementName;
  const lotid = req.session?.lotId;
  const project_name = req.session.project_name;
  const agreementId_session = req.session.agreement_id;
  const agreementLotName = req.session.agreementLotName;
  const projectId = req.session.projectId;
  res.locals.agreement_header = {
    agreementName,
    projectName: project_name,
    projectId,
    agreementIdSession: agreementId_session,
    agreementLotName,
    lotid,
  };
  const { data: journeySteps } = await TenderApi.Instance(SESSION_ID).get(`journeys/${eventId}/steps`);
  const journeys = journeySteps.find((item: { step: number }) => item.step == 81);
  let checked = false;
  if (journeys.state == 'Completed') {
    checked = true;
  }
  appendData = {
    ...appendData,
    agreementName,
    error: buildYorrfierror,
    releatedContent,
    agreementId_session,
    agreementLotName,
    lotid,
    checked,
  };

  //CAS-INFO-LOG
  LoggTracer.infoLogger(null, logConstant.chooseHowBuildYourRfiPageLog, req);

  res.render('chooseBuildrfi', appendData);
};

export const POST_BUILD_RFI = async (req: express.Request, res: express.Response) => {
  const { eventId } = req.session;
  const { SESSION_ID } = req.cookies;
  try {
    if (req.body.goto_choose == undefined || req.body.goto_choose == '') {
      req.session['buildYorrfierror'] = true;
      res.redirect('/rfi/choose-build-your-rfi');
    } else {
      const flag = await ShouldEventStatusBeUpdated(eventId, 81, req);

      if (flag) {
        // await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/81`, 'In progress');
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/81`, 'Completed');
      }

      //CAS-INFO-LOG
      LoggTracer.infoLogger(null, logConstant.chooseHowBuildYourRfiUpdated, req);

      res.redirect('/rfi/online-task-list');
    }
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - update the status failed - RFI Publish Page',
      true
    );
  }
};
