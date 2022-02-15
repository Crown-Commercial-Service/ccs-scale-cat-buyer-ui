//@ts-nocheck
import * as express from 'express';
import * as dataWWD from '../../../resources/content/requirements/daWhereWorkDone.json';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';

export const CA_GET_WHERE_WORK_DONE = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId, releatedContent, isError, errorText } = req.session;
  req.session.isError = false;
  req.session.errorText = '';
  const appendData = { ...dataWWD, releatedContent, isError, errorText };
  try {
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/54`, 'In progress');
    res.render('da-whereWorkDone', appendData);
  } catch (error) {

    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'GET failed - CA where work done Page',
      true,
    );
  }
};

function checkErrors(total) {
  let isError = false;
  let errorText = [];

  if (total > 100) {
    isError = true;
    errorText.push({ text: 'Location value should be less or equal to 100%' });
  } else if (total < 100) {
    isError = true;
    errorText.push({ text: 'The sum of the weighting values across all locations should be equal to 100%' });
  }

  return { isError, errorText };
}

export const CA_POST_WHERE_WORK_DONE = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId, releatedContent } = req.session;
  const { da_weight: weights } = req['body'];
  const total = weights.reduce((accum, elem) => (accum += parseInt(elem)), 0);
  const { isError, errorText } = checkErrors(total);
  if (isError) {
    req.session.errorText = errorText;
    req.session.isError = isError;
    res.redirect('/ca/get-work-done');
  } else {
    try {
      await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/54`, 'Completed');
      res.redirect('/da/task-list');
    } catch (error) {

      LoggTracer.errorLogger(
        res,
        error,
        `${req.headers.host}${req.originalUrl}`,
        null,
        TokenDecoder.decoder(SESSION_ID),
        'POST failed - CA where work done Page',
        true,
      );
    }
  }
};
