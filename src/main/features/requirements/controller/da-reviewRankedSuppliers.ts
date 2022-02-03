//@ts-nocheck
import * as express from 'express';
import * as dataRRS from '../../../resources/content/requirements/daReviewRankedSuppliers.json';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';

export const DA_GET_REVIEW_RANKED_SUPPLIERS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId, releatedContent, isError, errorText } = req.session;
  req.session.isError = false;
  req.session.errorText = '';
  const appendData = { ...dataRRS, releatedContent, isError, errorText };
  try {
    //await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/54`, 'In progress');
    res.render('da-reviewRankedSuppliers', appendData);
  } catch (error) {
    console.log(error);

    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - update the status failed - DA review & ranked suppliers ',
      true,
    );
  }
};

function checkErrors(ranks, justification) {
  let isError = false;
  let errorText = [];

  if (ranks.length > 0 && !justification) {
    isError = true;
    errorText.push({
      text: 'A justification must be provided whether or not a supplier from this tie rank is selected to take forward or not',
    });
  }

  return { isError, errorText };
}

export const DA_POST_REVIEW_RANKED_SUPPLIERS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId, releatedContent } = req.session;
  const { additional_ranks: ranks, justification } = req['body'];
  const { isError, errorText } = checkErrors(ranks, justification);
  if (isError) {
    req.session.errorText = errorText;
    req.session.isError = isError;
    res.redirect('/da/review-ranked-suppliers');
  } else {
    try {
      //await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/54`, 'Completed');
      res.redirect('/da/task-list');
    } catch (error) {
      console.log(error);

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
