//@ts-nocheck
import * as express from 'express';
import * as data from '../../../resources/content/requirements/rfpChooseSecurityRequirementsType.json';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';

export const RFP_GET_CHOOSE_SECURITY_REQUIREMENTS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { releatedContent, isError, errorText, currentEvent } = req.session;

  //const { assessmentId } = currentEvent;
  const assessmentId = 13;

  const ASSESSTMENT_BASEURL = `/assessments/${assessmentId}`;
  try {
    const { data: assessments } = await TenderApi.Instance(SESSION_ID).get(ASSESSTMENT_BASEURL);

    const { 'external-tool-id': extToolId, dimensionRequirements } = assessments;

    let selectedOption;
    if (dimensionRequirements.length > 0) {
      selectedOption = dimensionRequirements[0].requirements[0].values[0].value;
      data.form.radioOptions.items.find(item => item.value === selectedOption).checked = true;
    }

    const DIMENSION_BASEURL = `assessments/tools/${extToolId}/dimensions`;
    const { data: dimensions } = await TenderApi.Instance(SESSION_ID).get(DIMENSION_BASEURL);

    const options = dimensions
      .find(dim => dim.name === 'Security Clearance')
      .evaluationCriteria.find(criteria => criteria['criterion-id'] === '0').options;
    req.session.isError = false;
    req.session.errorText = '';
    const appendData = { ...data, releatedContent, isError, errorText };

    //await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/54`, 'In progress');
    res.render('rfp-chooseSecurityRequirements', appendData);
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'update the status failed - RFP TaskList Page',
      true,
    );
  }
};

function checkErrors(selectedNumber) {
  let isError = false;
  let errorText = [];

  if (!selectedNumber) {
    isError = true;
    errorText.push({ text: 'You must provide a security clearance level before proceeding' });
  }

  return { isError, errorText };
}

export const RFP_POST_CHOOSE_SECURITY_REQUIREMENTS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId, releatedContent, currentEvent } = req.session;
  //const { assessmentId } = currentEvent;
  const assessmentId = 13;
  const { ccs_rfp_choose_security: selectedValue, ccs_rfp_resources } = req.body;
  const resources = ccs_rfp_resources.filter(elem => elem != '')[0];
  const { isError, errorText } = checkErrors(selectedValue);
  if (isError) {
    req.session.errorText = errorText;
    req.session.isError = isError;
    res.redirect('/rfp/choose-security-requirements');
  } else {
    try {
      const requirementsData = [
        {
          name: 'Performance analysis and data',
          'requirement-id': 1,
          weighting: 100,
          values: [
            {
              'criterion-id': '0',
              value: selectedValue,
            },
          ],
        },
      ];

      const body = {
        name: 'Security Clearance',
        'requirement-id': 1,
        weighting: 100,
        includedCriteria: [{ 'criterion-id': '0' }],
        requirements: requirementsData,
      };
      await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/34`, 'Completed');
      await TenderApi.Instance(SESSION_ID).put(`/assessments/${assessmentId}/dimensions/2`, body);
      res.redirect('/rfp/task-list');
    } catch (error) {
      LoggTracer.errorLogger(
        res,
        error,
        `${req.headers.host}${req.originalUrl}`,
        null,
        TokenDecoder.decoder(SESSION_ID),
        'Tender agreement failed to be added',
        true,
      );
    }
  }
};
