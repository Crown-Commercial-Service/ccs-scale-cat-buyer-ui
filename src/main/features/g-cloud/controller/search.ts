import { Request, Response } from 'express';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { QueryParamType, extractQueryParamsForSearchAPI } from '../util/filter/searchQueryFliter';
import * as saveYourSearchData from '../../../resources/content/gcloud/saveYourSearch.json';
import { logConstant } from '../../../common/logtracer/logConstant';
import { gCloud } from 'main/services/gCloud';
import { formatRelativeURL } from 'main/services/helpers/url';
import { QueryParams } from 'main/services/types/helpers/url';
import { GCloudServiceSearch } from 'main/services/types/gCloud/search/api';

export const GET_SEARCH = async (req: Request, res: Response) => {
  const { SESSION_ID } = req.cookies;
  const { lot, serviceCategories, parentCategory, q } = req.query;
  try {
    const queryParamsForServicesAggregationsAPI = extractQueryParamsForSearchAPI(req.query, QueryParamType.AGGREGATIONS);

    const servicesAggregations = (await gCloud.api.search.getServicesAggregations([
      ['aggregations', 'serviceCategories'],
      ['aggregations', 'lot'],
      ...queryParamsForServicesAggregationsAPI
    ])).unwrap();

    const countsObject = Object.assign({}, servicesAggregations.aggregations.lot, servicesAggregations.aggregations.serviceCategories);

    const clearFilterQueryParams: QueryParams = {
      q,
      lot,
      serviceCategories,
      parentCategory
    } as QueryParams;

    Object.keys(clearFilterQueryParams).forEach((key: keyof typeof clearFilterQueryParams) => clearFilterQueryParams[key] === undefined && delete clearFilterQueryParams[key]);

    const clearFilterURL = formatRelativeURL({
      path: '/g-cloud/search',
      queryParams: clearFilterQueryParams
    });

    const filterData = (await gCloud.api.supplier.getGCloudFilters(lot as string, serviceCategories as string, parentCategory as string)).unwrap();
    const mainLots = Object.keys(filterData);
    const mainLotswithcount = [];
    for (let i = 0; i <= mainLots.length; i++) {
      const currentlot = mainLots[i];
      if (currentlot != undefined) {
        mainLotswithcount.push({
          key: (currentlot as string).replace('-', ' '),
          count: countsObject[currentlot] || 0,
          slug: currentlot,
        });
      }
    }

    let filterDatas;
    let lotInfo = {};
    if (lot != undefined) {
      filterDatas = filterData[`${lot}`];

      const lotSubserviceswithCount: any = [];
      const lotChildrenswithCount = [];
      for (let i = 0; i <= filterDatas.categories.filters.length; i++) {
        const currentObj = filterDatas.categories.filters[i];
        if (currentObj != undefined) {
          if (serviceCategories != undefined) {
            let parentCategoryValue: any;

            if (parentCategory != undefined) {
              parentCategoryValue = parentCategory;
            } else {
              parentCategoryValue = serviceCategories;
            }

            if (currentObj?.children?.length > 0) {
              if (currentObj.value == parentCategoryValue) {
                for (let j = 0; j <= currentObj.children.length; j++) {
                  const currentchild = currentObj.children[j];
                  if (currentchild != undefined) {
                    currentchild['count'] = countsObject[currentchild.label];
                    lotChildrenswithCount.push(currentchild);
                  }
                }
                currentObj['childrens'] = lotChildrenswithCount;
                currentObj['childrenssts'] = true;
                currentObj['count'] = countsObject[currentObj.label] || 0;
                lotSubserviceswithCount.push(currentObj);
              }
            }
          } else {
            currentObj['count'] = countsObject[currentObj.label] || 0;
            lotSubserviceswithCount.push(currentObj);
          }
        }
      }

      lotInfo = {
        subservices: lotSubserviceswithCount,
        currentserviceCategory: serviceCategories,
        currentparentCategory: parentCategory == undefined ? '' : parentCategory,
        label: (lot as string).replace('-', ' '),
        slug: lot,
      };
    } else {
      lotInfo = { lots: mainLotswithcount };
      filterDatas = filterData['cloud-support'];
    }

    const queryParamsForSearchAPI = extractQueryParamsForSearchAPI(req.query, QueryParamType.SEARCH);
    const searchUrlQuery = extractQueryParamsForSearchAPI(req.query, QueryParamType.SEARCH_URL);
    const searchResultsUrlQuery = extractQueryParamsForSearchAPI(req.query, QueryParamType.SEARCH_URL, false);
    req.session.searchUrlQuery = searchUrlQuery;
    req.session.searchResultsUrl = new URLSearchParams(searchResultsUrlQuery).toString();
    let servicesList: GCloudServiceSearch;

    try {
      servicesList = (await gCloud.api.search.getServicesSearch(queryParamsForSearchAPI)).unwrap();
    } catch (error) {
      servicesList = {} as GCloudServiceSearch;
    }

    const numberOfPages = Math.ceil(Number(servicesList?.meta?.total) / Number(servicesList?.meta?.results_per_page));

    req.session.searchednoOfPages = numberOfPages;

    let [nextPageUrl, prevPageUrl] = ['', ''];

    if (servicesList?.links?.next)
      nextPageUrl = servicesList?.links?.next.substring(servicesList?.links?.next.indexOf('?') + 1);
    if (servicesList?.links?.prev)
      prevPageUrl = servicesList?.links?.prev.substring(servicesList?.links?.prev.indexOf('?') + 1);

    nextPageUrl = nextPageUrl.replace(/filter_/g, '');
    prevPageUrl = prevPageUrl.replace(/filter_/g, '');

    const njkDatas = {
      currentLot: lot,
      lotInfos: lotInfo,
      haveLot: lot == undefined ? false : true,
      choosedLot: lot == undefined ? 'All Categories' : lot,
      haveserviceCategory: serviceCategories == undefined ? false : true,
      NextPageUrl: nextPageUrl,
      PrvePageUrl: prevPageUrl,
      noOfPages: numberOfPages,
      CurrentPageNumber: Number(servicesList?.meta?.query?.page ? servicesList?.meta?.query?.page : 1),
    };

    const baseAppendData = { data: servicesList, njkDatas, filters: filterDatas, clearFilterURL };

    if (req.get('Content-Type') === 'application/json') {
      res.json(baseAppendData);
    } else {
      const { isJaggaerError } = req.session;
      req.session['isJaggaerError'] = false;
      const releatedContent = req.session.releatedContent;
      const appendData = {
        ...baseAppendData,
        releatedContent: releatedContent,
        lotId: req.session.lotId,
        agreementLotName: req.session.agreementLotName,
        jsondata: saveYourSearchData,
        error: isJaggaerError,
      };

      //CAS-INFO-LOG
      LoggTracer.infoLogger(null, logConstant.gcSearch, req);
      res.render('search', appendData);
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
