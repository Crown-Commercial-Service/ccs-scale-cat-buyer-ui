import { Request, Response } from 'express';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import * as saveYourSearchData from '../../../resources/content/gcloud/saveYourSearch.json';
import { logConstant } from '../../../common/logtracer/logConstant';
import moment from 'moment-business-days';
import { gCloud } from 'main/services/gCloud';
import { formatURL } from 'main/services/helpers/url';
import { QueryParams } from 'main/services/types/helpers/url';

type ServiceResult = {
  serviceName: string
  supplier: {
    name: string
  }
  serviceDescription: string,
  serviceLink: string
}

const getSearchResults = async (queryParamsForSearchAPI: QueryParams, hostURL: string): Promise<ServiceResult[]> => {
  const result: ServiceResult[] = [];

  const servicesList = (await gCloud.api.search.getServicesSearch(queryParamsForSearchAPI)).unwrap();

  servicesList.documents.forEach((document) => {
    result.push({
      serviceName: document.serviceName,
      supplier: {
        name: document.supplierName
      },
      serviceDescription: document.serviceDescription,
      serviceLink: formatURL({
        baseURL: hostURL,
        path: '/g-cloud/services',
        queryParams: {
          id: document.id
        }
      })
    });
  });

  if (servicesList.links.next !== undefined) {
    const nextURLParams = (new URL(servicesList.links.next)).searchParams;

    result.push(...await getSearchResults(nextURLParams, hostURL));
  }

  return result;
};

export const POST_SAVE_YOUR_SEARCH_RESULTS = async (req: Request, res: Response) => {
  const { SESSION_ID } = req.cookies;
  try {
    const { criteria, searchQuery } = req.body;
    req.session['searchQuery'] = '';
    req.session['searchQuery'] = searchQuery == undefined ? '' : searchQuery;
    if (criteria !== undefined) {
      req.session.criteriaData = criteria;
    } else {
      req.session.criteriaData = '';
    }
    res.redirect('/g-cloud/save-your-search');
  } catch (error) {
    LoggTracer.errorLogger(
      req,
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

export const GET_SAVE_YOUR_SEARCH = async (req: Request, res: Response) => {
  const { SESSION_ID } = req.cookies;

  try {
    const releatedContent = req.session.releatedContent;
    const { isJaggaerError, isJaggaerErrorsearchname, criteriaData } = req.session;
    req.session['isJaggaerError'] = false;
    req.session['isJaggaerErrorsearchname'] = false;
    const baseURL = '/assessments';
    const assessment = await TenderApi.Instance(SESSION_ID).get(baseURL);
    //CAS-INFO-LOG
    LoggTracer.infoLogger(assessment, logConstant.assessmentDetail, req);

    let assessments = assessment.data;
    assessments = assessments.sort((a: any, b: any) => (a['assessment-id'] < b['assessment-id'] ? -1 : 1));
    const savedDetails = assessments?.filter(
      (item: any) => item.assessmentName !== undefined && item.status === 'active' && item['external-tool-id'] === '14'
    );

    const appendData = {
      data: saveYourSearchData,
      searchResults: criteriaData,
      savedDetails: savedDetails,
      releatedContent: releatedContent,
      lotId: req.session.lotId,
      agreementLotName: req.session.agreementLotName,
      error: isJaggaerError,
      errorName: isJaggaerErrorsearchname,
      searchKeywords: req.session.searchKeywords,
      returnto: `/g-cloud/search${req.session.searchResultsUrl == undefined ? '' : '?' + req.session.searchResultsUrl}`,
    };

    //CAS-INFO-LOG
    LoggTracer.infoLogger(null, logConstant.saveYourSearch, req);

    res.render('saveYourSearch', appendData);
  } catch (error) {
    LoggTracer.errorLogger(
      req,
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

export const POST_SAVE_YOUR_SEARCH = async (req: Request, res: Response) => {
  const { SESSION_ID } = req.cookies;

  try {
    const { criteriaData } = req.session;
    const { searchUrlQuery, searchResultsUrl } = req.session;
    const { search_name, savesearch, saveandcontinue, saveforlater } = req.body;
    const hostURL = `${req.protocol}://${req.headers.host}`;
    const lastUpdate =
      moment(new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' }), 'DD/MM/YYYY hh:mm:ss').format(
        'YYYY-MM-DDTHH:mm:ss'
      ) + 'Z';
    if (savesearch !== undefined) {
      const queryParamsForSearchAPI = new URLSearchParams(searchUrlQuery);
      queryParamsForSearchAPI.delete('filter_parentCategory');
      if (savesearch == 'new' && search_name !== '') {
        if (search_name.length <= 250) {
          const assessmentsBaseURL = '/assessments';
          let { data: assessments } = await TenderApi.Instance(SESSION_ID).get(assessmentsBaseURL);
          assessments = assessments.sort((a: any, b: any) => (a['assessment-id'] < b['assessment-id'] ? -1 : 1));

          const savedDetails = await assessments?.filter(
            (item: any) =>
              item.assessmentName !== undefined &&
              item['external-tool-id'] === '14' &&
              item.assessmentName.toLowerCase() == search_name.toLowerCase()
          );
          // unique search name
          if (savedDetails.length === 0) {
            const allServicesList = await getSearchResults(queryParamsForSearchAPI, hostURL);
            if (allServicesList.length <= 0) {
              req.session['isJaggaerError'] = 'Search results not found';
              res.redirect('/g-cloud/search');
            }
            const _requestBody = {
              assessmentName: search_name,
              'external-tool-id': '14',
              status: 'active',
              dimensionRequirements: searchResultsUrl,
              resultsSummary: criteriaData,
              lastUpdate: lastUpdate,
              results: allServicesList,
            };
            const baseURL = '/assessments/gcloud';
            const response = await TenderApi.Instance(SESSION_ID).post(baseURL, _requestBody);
            //CAS-INFO-LOG
            LoggTracer.infoLogger(response, logConstant.saveSearch, req);

            if (response.status == 200) {
              req.session.savedassessmentID = response.data;

              if (saveandcontinue !== undefined) {
                res.redirect('/g-cloud/export-results');
              }
              if (saveforlater !== undefined) {
                res.redirect('/g-cloud/saved-searches');
              }
            } else {
              res.redirect('/g-cloud/save-your-search');
            }
          } else {
            req.session['isJaggaerErrorsearchname'] =
              'This is an existing search name. Please enter a unique search name.';
            res.redirect('/g-cloud/save-your-search');
          }
        } else {
          req.session['isJaggaerErrorsearchname'] = 'You must be 250 characters or fewer';
          res.redirect('/g-cloud/save-your-search');
        }
      } else if (savesearch !== 'new') {
        const baseURL = `/assessments/${savesearch}/gcloud`;
        const { data: assessment } = await TenderApi.Instance(SESSION_ID).get(baseURL);
        const allServicesList = await getSearchResults(queryParamsForSearchAPI, hostURL);
        if (allServicesList.length <= 0) {
          req.session['isJaggaerError'] = 'Search results not found';
          res.redirect('/g-cloud/search');
        }
        const _requestBody = {
          assessmentName: assessment.assessmentName,
          'external-tool-id': '14',
          status: 'active',
          dimensionRequirements: searchResultsUrl,
          resultsSummary: criteriaData,
          lastUpdate: lastUpdate,
          results: allServicesList,
        };

        const response = await TenderApi.Instance(SESSION_ID).put(baseURL, _requestBody);
        //CAS-INFO-LOG
        LoggTracer.infoLogger(response, logConstant.saveSearch, req);

        if (response.status == 200) {
          req.session.savedassessmentID = savesearch;

          if (saveandcontinue !== undefined) {
            res.redirect('/g-cloud/export-results');
          }
          if (saveforlater !== undefined) {
            res.redirect('/g-cloud/saved-searches');
          }
        } else {
          res.redirect('/g-cloud/save-your-search');
        }
      } else {
        req.session['isJaggaerErrorsearchname'] = 'Please enter a search name';
        res.redirect('/g-cloud/save-your-search');
      }
    } else {
      req.session['isJaggaerError'] = true;
      res.redirect('/g-cloud/save-your-search');
    }
  } catch (error) {
    LoggTracer.errorLogger(
      req,
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
