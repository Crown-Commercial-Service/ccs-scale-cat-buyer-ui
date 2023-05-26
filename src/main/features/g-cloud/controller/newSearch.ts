import * as express from 'express';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import * as cmsData from '../../../resources/content/gcloud/newSearch.json';
import { logConstant } from '../../../common/logtracer/logConstant';

export const GET_NEW_SEARCH = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  try {
    const releatedContent = req.session.releatedContent;
    const { isJaggaerError } = req.session;
    req.session['isJaggaerError'] = false;
    const appendData = {
      data: cmsData,
      releatedContent: releatedContent,
      lotId: req.session.lotId,
      agreementLotName: req.session.agreementLotName,
      searchKeywords: req.session.searchKeywords,
      error: isJaggaerError,
      returnto: `/g-cloud/search${req.session.searchResultsUrl == undefined ? '' : '?' + req.session.searchResultsUrl}`,
    };
    //CAS-INFO-LOG
    LoggTracer.infoLogger(null, logConstant.newSearch, req);

    res.render('newSearch', appendData);
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'G-Cloud 13 throws error - Tenders Api is causing problem',
      true
    );
  }
};

export const POST_NEW_SEARCH = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;

  try {
    if (req.body.search !== '') {
      if (typeof req.session.searchKeywords !== 'undefined') {
        req.session.searchKeywords.push(req.body.search);
      } else {
        req.session.searchKeywords = [];
        req.session.searchKeywords.push(req.body.search);
      }
      res.redirect('/g-cloud/save-your-search');
    } else {
      req.session['isJaggaerError'] = true;
      res.redirect('/g-cloud/new-search');
    }
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'G-Cloud 13 throws error - Tenders Api is causing problem',
      true
    );
  }
};
