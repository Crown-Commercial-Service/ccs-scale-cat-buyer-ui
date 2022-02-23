//@ts-nocheck
import * as express from 'express';
import * as data from '../../../resources/content/requirements/rfpChooseSecurityRequirementsType.json';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';

export const RFP_GET_CHOOSE_SECURITY_REQUIREMENTS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { releatedContent, isError, errorText } = req.session;
  req.session.isError = false;
  req.session.errorText = '';
  const appendData = { ...data, releatedContent, isError, errorText };
  try {
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

function checkErrors(selected) {
  let isError = false;
  let errorText = [];

  if (!selected) {
    isError = true;
    errorText.push({ text: 'You must provide a security clearance level before proceeding' });
  }

  return { isError, errorText };
}

export const RFP_POST_CHOOSE_SECURITY_REQUIREMENTS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId, releatedContent } = req.session;
  const { ccs_rfp_choose_security: selected, ccs_rfp_resources } = req.body;
  const resources = ccs_rfp_resources.filter(elem => elem != '')[0];
  const { isError, errorText } = checkErrors(selected);
  if (isError) {
    req.session.errorText = errorText;
    req.session.isError = isError;
    res.redirect('/rfp/choose-security-requirements');
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
