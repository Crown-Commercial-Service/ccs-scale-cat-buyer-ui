import * as express from 'express';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import * as savedSearchsjson from '../../../resources/content/gcloud/savedSearchs.json';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import moment from 'moment-business-days';
import { logConstant } from '../../../common/logtracer/logConstant';

export const GET_SAVED_SEARCHES = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  try {
    const releatedContent = req.session.releatedContent;
    const { isJaggaerError } = req.session;

    req.session['isJaggaerError'] = false;

    const baseURL = '/assessments';
    const assessment = await TenderApi.Instance(SESSION_ID).get(baseURL);

    //CAS-INFO-LOG
    LoggTracer.infoLogger(assessment, logConstant.assessmentDetail, req);
    let assessments = assessment.data;

    assessments = assessments.sort((a: any, b: any) => (a['assessment-id'] < b['assessment-id'] ? -1 : 1));
    const savedDetails = assessments?.filter(
      (item: any) => item.assessmentName !== undefined && item['external-tool-id'] === '14' && item.status === 'active'
    );
    const exportedDetails = assessments?.filter(
      (item: any) =>
        item.assessmentName !== undefined && item['external-tool-id'] === '14' && item.status === 'complete'
    );

    const savedData = [];
    const exportedData: any = [];

    for (const item of savedDetails) {
      const baseURL = `/assessments/${item['assessment-id']}/gcloud`;
      const { data: assessmentDetails } = await TenderApi.Instance(SESSION_ID).get(baseURL);
      savedData.push({
        ass_id: item['assessment-id'],
        name: item['assessmentName'],
        criteria: assessmentDetails.resultsSummary != undefined ? assessmentDetails.resultsSummary : '',
        saved_date:
          assessmentDetails.lastUpdate != undefined
            ? `${moment(assessmentDetails.lastUpdate).format('dddd DD MMMM YYYY')} at ${new Date(
              assessmentDetails.lastUpdate
            ).toLocaleTimeString('en-GB', { timeStyle: 'short', hour12: true, timeZone: 'Europe/London' })} BST`
            : '',
        search_status: 'statuss',
        searchKeys: assessmentDetails.dimensionRequirements,
      });
    }

    for (const item of exportedDetails) {
      const baseURL = `/assessments/${item['assessment-id']}/gcloud`;
      const { data: assessmentDetails } = await TenderApi.Instance(SESSION_ID).get(baseURL);
      exportedData.push({
        ass_id: item['assessment-id'],
        name: item['assessmentName'],
        criteria: assessmentDetails.resultsSummary != undefined ? assessmentDetails.resultsSummary : '',
        exported_date:
          assessmentDetails.lastUpdate != undefined
            ? `${moment(assessmentDetails.lastUpdate).format('dddd DD MMMM YYYY')} at ${new Date(
              assessmentDetails.lastUpdate
            ).toLocaleTimeString('en-GB', { timeStyle: 'short', hour12: true, timeZone: 'Europe/London' })} BST`
            : '',
        search_status: 'statuss',
        searchKeys: assessmentDetails.dimensionRequirements,
      });
    }

    const appendData = {
      releatedContent: releatedContent,
      lotId: req.session.lotId,
      agreementLotName: req.session.agreementLotName,
      searchKeywords: req.session.searchKeywords,
      error: isJaggaerError,
      data: savedSearchsjson,
      savedData,
      exportedData,
    };
    //CAS-INFO-LOG
    LoggTracer.infoLogger(null, logConstant.savedSearches, req);
    res.render('savedSearches', appendData);
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

export const DELETE_SAVED_SEARCHES = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;

  try {
    if (req.query.ass_id !== undefined) {
      const baseURL = `/assessments/${req.query.ass_id}`;

      const response = await TenderApi.Instance(SESSION_ID).delete(baseURL);
      //CAS-INFO-LOG
      LoggTracer.infoLogger(response, logConstant.deleteSavedSearch, req);

      res.redirect('/g-cloud/saved-searches');
    } else {
      req.session['isJaggaerError'] = true;
      res.redirect('/g-cloud/saved-searches');
    }
  } catch (error) {
    res.redirect('/g-cloud/saved-searches');
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
