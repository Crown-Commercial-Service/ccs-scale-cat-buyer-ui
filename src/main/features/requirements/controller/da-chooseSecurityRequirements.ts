//@ts-nocheck
import * as express from 'express';
import * as data from '../../../resources/content/requirements/daChooseSecurityRequirementsType.json';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';

export const DA_GET_CHOOSE_SECURITY_REQUIREMENTS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { releatedContent, isError, errorText } = req.session;
  req.session.isError = false;
  req.session.errorText = '';
  const appendData = { ...data, releatedContent, isError, errorText };
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

  if (!selected) {
    errorText.push({ text: 'You must provide a security clearance level before proceeding' });
  } else if (selected && ['2', '3', '4', '5'].includes(selected) && !resources) {
    errorText.push({ text: 'A Quantity must be specified' });
  } else if (selected && ['2', '3', '4', '5'].includes(selected) && resources < 0) {
    errorText.push({ text: 'A Quantity must be between 0 to [Quantity] - 1' });
  }
  const isError = errorText.length > 0;
  return { isError, errorText };
}

export const DA_POST_CHOOSE_SECURITY_REQUIREMENTS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId, releatedContent } = req.session;
  const { ccs_da_choose_security: selected, ccs_da_resources } = req.body;
  const resources = ccs_da_resources.filter(elem => elem != '')[0];
  const { isError, errorText } = checkErrors(selected, resources);
  if (isError) {
    req.session.errorText = errorText;
    req.session.isError = isError;
    res.redirect('/da/choose-security-requirements');
  } else {
    try {
      //await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/54`, 'Completed');
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
