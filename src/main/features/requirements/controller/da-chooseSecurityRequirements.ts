//@ts-nocheck
import * as express from 'express';
import * as data from '../../../resources/content/requirements/daChooseSecurityRequirementsType.json';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';

export const DA_GET_CHOOSE_SECURITY_REQUIREMENTS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { releatedContent, isError, errorText, currentEvent } = req.session;

  const { assessmentId } = currentEvent;

  const ASSESSTMENT_BASEURL = `/assessments/${assessmentId}`;
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
  const appendData = { ...data, selectedOption, releatedContent, isError, errorText };
  try {
    //await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/54`, 'In progress');
    res.render('da-chooseSecurityRequirements', appendData);
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'update the status failed - DA TaskList Page',
      true,
    );
  }
};

function checkErrors(selected, resources) {
  let errorText = [];
  const selectedNumber = selected ? selected.replace(/[^0-9.]/g, '') : null;

  if (!selectedNumber) {
    errorText.push({ text: 'You must provide a security clearance level before proceeding' });
  } else if (selectedNumber && ['2', '3', '4', '5'].includes(selectedNumber) && !resources) {
    errorText.push({ text: 'A Quantity must be specified' });
  } else if (selectedNumber && ['2', '3', '4', '5'].includes(selectedNumber) && resources < 0) {
    errorText.push({ text: 'A Quantity must be between 0 to [Quantity] - 1' });
  }
  const isError = errorText.length > 0;
  return { isError, errorText };
}

export const DA_POST_CHOOSE_SECURITY_REQUIREMENTS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId, releatedContent, currentEvent } = req.session;
  const { assessmentId } = currentEvent;
  const { ccs_da_choose_security: selectedValue, ccs_da_resources } = req.body;
  const resources = ccs_da_resources.filter(elem => elem != '')[0];
  const { isError, errorText } = checkErrors(selectedValue, resources);
  if (isError) {
    req.session.errorText = errorText;
    req.session.isError = isError;
    res.redirect('/da/choose-security-requirements');
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
      await TenderApi.Instance(SESSION_ID).put(`/assessments/${assessmentId}/dimensions/2`, body);
      //await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/54`, 'Completed');
      res.redirect('/da/service-capabilities');
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
