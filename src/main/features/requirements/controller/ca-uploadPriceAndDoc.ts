//@ts-nocheck
import { TenderApi } from '@common/util/fetch/procurementService/TenderApiInstance';
import * as express from 'express';
import * as cmsData from '../../../resources/content/requirements/caUploadPriceAndDocs.json';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import config from 'config';

// FC cancel
export const CA_GET_UPLOAD_PRICING_SUPPORTING_DOCUMENT = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId } = req.session;
  const releatedContent = req.session.releatedContent;
  const agreementName = req.session.agreementName;
  const lotid = req.session?.lotId;
  const project_name = req.session.project_name;
  const agreementId_session = req.session.agreement_id;
  const agreementLotName = req.session.agreementLotName;
  const { isJaggaerError, choosenViewPath } = req.session;
  req.session['isJaggaerError'] = false;
  res.locals.agreement_header = { agreementName, project_name, agreementId_session, agreementLotName, lotid };
  try {
    //await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/38`, 'In progress');
    const appendData = { data: cmsData, releatedContent, error: isJaggaerError, choosenViewPath };
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/55`, 'In progress');
    res.render('ca-uploadPriceAndDoc', appendData);
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Suppliers page error - CapAss',
      true,
    );
  }
};

export const CA_POST_UPLOAD_PRICING_SUPPORTING_DOCUMENT = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId } = req.session;
  const assessmentId = req.session.currentEvent.assessmentId;
  const dimension = req.session.dimensions;
  const scalabilityData = dimension.filter(data => data.name === 'Scalability')[0];

  try {
    const body = {
      'dimension-id': scalabilityData['dimension-id'],
      name: scalabilityData['name'],
      weighting: 20,
      includedCriteria: [{ 'criterion-id': '0' }],
      requirements: [
        {
          name: scalabilityData.options.find(data => data['requirement-id'] === Number(req.body.team_option)).name,
          'requirement-id': Number(req.body.team_option),
          weighting: 100,
          values: [{ 'criterion-id': '0', value: '1: Yes' }],
        },
      ],
    };

    if (req.session['CapAss']?.isSubContractorAccepted) {
      body.includedCriteria.push({ 'criterion-id': '1' });
      body.requirements[0].values.push({ 'criterion-id': '1', value: '1: Yes' });
    }

    await TenderApi.Instance(SESSION_ID).put(
      `/assessments/${assessmentId}/dimensions/${scalabilityData['dimension-id']}`,
      body,
    );

    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/58`, 'Cannot start yet');
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/30`, 'In progress');
    // Check 'review ranked suppliers' step number
    // await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/`, 'To do');

    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/53`, 'Completed');
    res.redirect('/ca/get-work-done');
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Post failed - CA team scale page',
      true,
    );
  }
};
