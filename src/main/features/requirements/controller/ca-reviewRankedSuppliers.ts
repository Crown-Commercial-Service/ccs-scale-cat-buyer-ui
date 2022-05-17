//@ts-nocheck
import * as express from 'express';
import * as dataRRS from '../../../resources/content/requirements/caReviewRankedSuppliers.json';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import config from 'config';

export const CA_GET_REVIEW_RANKED_SUPPLIERS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId, releatedContent, isError, errorText, eventId, currentEvent } = req.session;
  const { data: eventData } = await TenderApi.Instance(SESSION_ID).get(
    `/tenders/projects/${projectId}/events/${eventId}`,
  );
  let lotid=req.session.lotId;
  lotid=lotid.replace('Lot ','')
  const lotSuppliers =
    config.get('CCS_agreements_url') + req.session.agreement_id + ':' + lotid + '/lot-suppliers';
  const { assessmentSupplierTarget: numSuppliers } = eventData.nonOCDS;
  let dataRRSMod = { ...dataRRS };
  dataRRSMod.p1 = dataRRSMod.p1.replace(new RegExp('X', 'g'), numSuppliers);
  const ASSESSTMENT_BASEURL = `/assessments/${currentEvent.assessmentId}`;
  const { data: assessments } = await TenderApi.Instance(SESSION_ID).get(ASSESSTMENT_BASEURL);
  const suppliersResponse = await TenderApi.Instance(SESSION_ID).get(
    `/tenders/projects/${projectId}/events/${eventId}/suppliers`,
  );
  req.session.isError = false;
  req.session.errorText = '';
  const appendData = { ...dataRRSMod, numSuppliers, lotSuppliers: lotSuppliers, releatedContent, isError, errorText };
  try {
    //await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/54`, 'In progress');
    res.render('ca-reviewRankedSuppliers', appendData);
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - update the status failed - CA TaskList Page',
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
else {
  isError= false;
}
  return { isError, errorText };
}

export const CA_POST_REVIEW_RANKED_SUPPLIERS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId, releatedContent } = req.session;
  const { additional_ranks: ranks, justification } = req['body'];
  const { isError, errorText } = checkErrors(ranks, justification);
  if (isError) {
    req.session.errorText = errorText;
    req.session.isError = isError;
    res.redirect('/ca/review-ranked-suppliers');
  } else {
    try {
      await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/54`, 'Completed');
      res.redirect('/ca/next-steps');
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
