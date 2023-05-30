import * as express from 'express';
import { LoggTracer } from '../../../common/logtracer/tracer';
import * as cmsData from '../../../resources/content/gcloud/exportResults.json';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import moment from 'moment-business-days';
import { logConstant } from '../../../common/logtracer/logConstant';

export const GET_EXPORT_RESULTS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  try {
    const releatedContent = req.session.releatedContent;
    const { isJaggaerError } = req.session;
    req.session['isJaggaerError'] = false;
    if (req.query.ass_id !== undefined) {
      req.session.savedassessmentID = req.query.ass_id;
    }

    const baseURL = `/assessments/${req.session.savedassessmentID}/gcloud`;

    const assessmentDetail = await TenderApi.Instance(SESSION_ID).get(baseURL);

    //CAS-INFO-LOG
    LoggTracer.infoLogger(assessmentDetail, logConstant.assessmentDetail, req);

    const assessmentDetails = assessmentDetail.data;

    const searchResults = assessmentDetails.resultsSummary;
    if (req.query.ass_id !== undefined) {
      req.session.searchResultsUrl = assessmentDetails.dimensionRequirements;
    }

    const appendData = {
      data: cmsData,
      searchResults: searchResults,
      releatedContent: releatedContent,
      lotId: req.session.lotId,
      agreementLotName: req.session.agreementLotName,
      error: isJaggaerError,
      returnto: `/g-cloud/search${req.session.searchResultsUrl == undefined ? '' : '?' + req.session.searchResultsUrl}`,
    };
    //CAS-INFO-LOG
    LoggTracer.infoLogger(null, logConstant.exportResults, req);
    res.render('exportResults', appendData);
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

export const POST_EXPORT_RESULTS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { savedassessmentID } = req.session;
  const { exportassessment } = req.body;
  try {
    if (exportassessment !== undefined) {
      const lastUpdate =
        moment(new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' }), 'DD/MM/YYYY hh:mm:ss').format(
          'YYYY-MM-DDTHH:mm:ss'
        ) + 'Z';
      const baseURL = `/assessments/${savedassessmentID}/gcloud`;
      const assessmentDetail = await TenderApi.Instance(SESSION_ID).get(baseURL);
      //CAS-INFO-LOG
      LoggTracer.infoLogger(assessmentDetail, logConstant.assessmentDetail, req);

      const assessmentDetails = assessmentDetail.data;

      const _requestBody = {
        assessmentName: assessmentDetails.assessmentName,
        'external-tool-id': '14',
        status: 'complete',
        dimensionRequirements: assessmentDetails.dimensionRequirements,
        resultsSummary: assessmentDetails.resultsSummary,
        lastUpdate: lastUpdate,
        results: assessmentDetails.results,
      };

      const response = await TenderApi.Instance(SESSION_ID).put(baseURL, _requestBody);
      //CAS-INFO-LOG
      LoggTracer.infoLogger(response, logConstant.exportResultsUpdate, req);

      res.redirect('/g-cloud/download-your-search?assessmentID=' + savedassessmentID);
    } else {
      req.session['isJaggaerError'] = true;
      res.redirect('/g-cloud/export-results');
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
