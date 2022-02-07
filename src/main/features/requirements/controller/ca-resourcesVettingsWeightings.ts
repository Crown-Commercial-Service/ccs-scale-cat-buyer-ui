//@ts-nocheck
import * as express from 'express';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import * as caResourcesVetting from '../../../resources/content/requirements/caResourcesVetting.json';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';

/**
 *
 * @param req
 * @param res
 * @GETController
 */
export const CA_GET_RESOURCES_VETTING_WEIGHTINGS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const {
    lotId,
    agreementLotName,
    agreementName,
    projectId,
    agreement_id,
    releatedContent,
    project_name,
    isError,
    errorText,
    currentEvent
  } = req.session;
  const {assessmentId} = currentEvent;
  const agreementId_session = agreement_id;
  const { isJaggaerError } = req.session;
  req.session['isJaggaerError'] = false;
  res.locals.agreement_header = {
    agreementName,
    project_name,
    agreementId_session,
    agreementLotName,
    lotId,
    error: isJaggaerError,
  };
  try {
  

    const ASSESSTMENT_BASEURL = `/assessments/${assessmentId}`;
    const ALL_ASSESSTMENTS  = await TenderApi.Instance(SESSION_ID).get(ASSESSTMENT_BASEURL);
    const ALL_ASSESSTMENTS_DATA = ALL_ASSESSTMENTS.data;
    const EXTERNAL_ID = ALL_ASSESSTMENTS_DATA['external-tool-id']

    const CAPACITY_BASEURL = `assessments/tools/${EXTERNAL_ID}/dimensions`;
    const CAPACITY_DATA  = await TenderApi.Instance(SESSION_ID).get(CAPACITY_BASEURL);
    const CAPACITY_DATASET = CAPACITY_DATA.data;

    const UNIQUEJOBSOPTIONS = CAPACITY_DATASET.map(aField => aField.options).flat().map(JOBDESGINATION => {
      const {name, groups} = JOBDESGINATION;
      const REFORMEDDATA = groups.map(data => {
        const REFORMEDOBJECT = {...data, GroupName: name};
        return REFORMEDOBJECT;
      })
      return REFORMEDDATA;
    }).flat();
    const UNIQUEFIELDNAME = [...new Set(UNIQUEJOBSOPTIONS.map(designation => designation.name))];
    const UNIQUESORTEDDESINGATIONS = UNIQUEFIELDNAME.map(designation => {
      const JOB_RELATED_TO_DESIGNATION = UNIQUEJOBSOPTIONS.filter(jobRole => jobRole.name === designation);
      return JOB_RELATED_TO_DESIGNATION
    }) 
  
    const windowAppendData = { ...caResourcesVetting, lotId, agreementLotName, releatedContent, isError, errorText ,
    designations: UNIQUESORTEDDESINGATIONS
    };

    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/54`, 'In progress');
    res.render('ca-resourcesVettingWeightings', windowAppendData);
  } catch (error) {
    req.session['isJaggaerError'] = true;
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - Get failed - CA learn page',
      true,
    );
  }
};

export const CA_POST_RESOURCES_VETTING_WEIGHTINGS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId } = req.session;
  try {
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/48`, 'Completed');
    res.redirect('/ca/enter-your-weightings');
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - Post failed - CA learn page',
      true,
    );
  }
};
