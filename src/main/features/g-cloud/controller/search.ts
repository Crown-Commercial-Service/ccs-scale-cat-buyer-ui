import * as express from 'express';
//import url from 'node:url';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { gCloudApi } from '../util/fetch/apiInstance';
import { gCloudServiceQueryFliter } from '../util/filter/serviceQueryFliter';
import { gCloudServiceQueryResults } from '../util/filter/serviceQueryResults';
import { gCloudCountQueryFliter } from '../util/filter/countQueryFliter';
import { gCloudServiceQueryReplace } from '../util/filter/serviceQueryReplace';
import * as saveYourSearchData from '../../../resources/content/gcloud/saveYourSearch.json';
import { logConstant } from '../../../common/logtracer/logConstant';

export const GET_SEARCH = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { lot, serviceCategories, parentCategory, q } = req.query;
  const GCLOUD_TOKEN = process.env.GCLOUD_TOKEN;
  const GCLOUD_SEARCH_API_TOKEN = process.env.GCLOUD_SEARCH_API_TOKEN;
  const GCLOUD_INDEX = process.env.GCLOUD_INDEX;
  try {
    const CountsUrl = `${GCLOUD_INDEX}/services/aggregations?aggregations=serviceCategories&aggregations=lot`;
    const countUrl = req.url;
    const jointCountUrlRetrieve = await gCloudCountQueryFliter(countUrl, CountsUrl, null);
    const JointCountURL = `${GCLOUD_INDEX}/services/aggregations?aggregations=serviceCategories&aggregations=lot${jointCountUrlRetrieve}`;

    const { data: CategoryData } = await gCloudApi.searchInstance(GCLOUD_SEARCH_API_TOKEN).get(JointCountURL);
    const countsObject = Object.assign({}, CategoryData.aggregations.lot, CategoryData.aggregations.serviceCategories);

    const searchKeywordsQuery: any = q;
    const keywordsQuery = q != undefined ? `&q=${encodeURIComponent(searchKeywordsQuery)}` : '';
    const lotsQuery = lot != undefined ? `&lot=${lot}` : '';

    let serviceCategoriesQuery = '';
    let parentCategoryQuery = '';
    let filterURL: string;

    if (lot != undefined) {
      const lotQuery = `?lot=${lot}`;
      serviceCategoriesQuery = serviceCategories != undefined ? `&serviceCategories=${serviceCategories}` : '';
      parentCategoryQuery = parentCategory != undefined ? `&parentCategory=${parentCategory}` : '';
      filterURL = `g-cloud-filters${lotQuery}${serviceCategoriesQuery}${parentCategoryQuery}`;
    } else {
      filterURL = 'g-cloud-filters';
    }

    const clearFilterURL = `/g-cloud/search?${keywordsQuery}${lotsQuery}${serviceCategoriesQuery}${parentCategoryQuery}`;

    const { data: filterData } = await gCloudApi.supplierInstance(GCLOUD_TOKEN).get(filterURL);
    const mainLots = Object.keys(filterData);
    const mainLotswithcount = [];
    for (let i = 0; i <= mainLots.length; i++) {
      const currentlot = mainLots[i];
      if (currentlot != undefined) {
        mainLotswithcount.push({
          key: (currentlot as string).replace('-', ' '),
          count: countsObject[currentlot],
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
                currentObj['count'] = countsObject[currentObj.label];
                lotSubserviceswithCount.push(currentObj);
              }
            }
          } else {
            currentObj['count'] = countsObject[currentObj.label];
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

    const reqUrl = req.url;

    const URL = `${GCLOUD_INDEX}/services/search`;
    const jointUrlRetrieve = await gCloudServiceQueryFliter(reqUrl, URL, 1);
    const searchUrl = await gCloudServiceQueryFliter(reqUrl, URL, 2);
    const searchResultsUrl = await gCloudServiceQueryResults(reqUrl, URL, 2);
    req.session.searchUrl = searchUrl.replace('?', '');
    req.session.searchResultsUrl = searchResultsUrl.replace('?', '');
    const JointURL = `${GCLOUD_INDEX}/services/search${jointUrlRetrieve}`;
    let servicesList;
    try {
      servicesList = (await gCloudApi.searchInstance(GCLOUD_SEARCH_API_TOKEN).get(JointURL)).data;
    } catch (error) {
      servicesList = {};
    }

    req.session.searchednoOfPages = Math.round(
      Number(servicesList?.meta?.total) / Number(servicesList?.meta?.results_per_page)
    );

    let NextPageUrl, PrvePageUrl;

    if (servicesList?.links?.next)
      NextPageUrl = servicesList?.links?.next.substring(servicesList?.links?.next.indexOf('?') + 1);
    if (servicesList?.links?.prev)
      PrvePageUrl = servicesList?.links?.prev.substring(servicesList?.links?.prev.indexOf('?') + 1);

    NextPageUrl = await gCloudServiceQueryReplace(NextPageUrl, 'filter_');
    PrvePageUrl = await gCloudServiceQueryReplace(PrvePageUrl, 'filter_');

    const njkDatas = {
      currentLot: lot,
      lotInfos: lotInfo,
      haveLot: lot == undefined ? false : true,
      choosedLot: lot == undefined ? 'All Categories' : lot,
      haveserviceCategory: serviceCategories == undefined ? false : true,
      NextPageUrl: NextPageUrl == undefined ? '' : NextPageUrl,
      PrvePageUrl: PrvePageUrl == undefined ? '' : PrvePageUrl,
      noOfPages: Math.round(Number(servicesList?.meta?.total) / Number(servicesList?.meta?.results_per_page)),
      CurrentPageNumber: Number(servicesList?.meta?.query?.page ? servicesList?.meta?.query?.page : 1),
    };

    const { isJaggaerError } = req.session;
    req.session['isJaggaerError'] = false;
    const releatedContent = req.session.releatedContent;
    const appendData = {
      data: servicesList,
      njkDatas,
      filters: filterDatas,
      releatedContent: releatedContent,
      lotId: req.session.lotId,
      agreementLotName: req.session.agreementLotName,
      clearFilterURL: clearFilterURL,
      jsondata: saveYourSearchData,
      error: isJaggaerError,
    };

    //CAS-INFO-LOG
    LoggTracer.infoLogger(null, logConstant.gcSearch, req);
    res.render('search', appendData);
  } catch (error) {
    console.log(error);
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

export const GET_SEARCH_API = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { lot, serviceCategories, parentCategory, q } = req.query;
  const GCLOUD_TOKEN = process.env.GCLOUD_TOKEN;
  const GCLOUD_SEARCH_API_TOKEN = process.env.GCLOUD_SEARCH_API_TOKEN;
  const GCLOUD_INDEX = process.env.GCLOUD_INDEX;
  try {
    const CountsUrl = `${GCLOUD_INDEX}/services/aggregations?aggregations=serviceCategories&aggregations=lot`;
    const countUrl = req.url;
    const jointCountUrlRetrieve = await gCloudCountQueryFliter(countUrl, CountsUrl, null);
    const JointCountURL = `${GCLOUD_INDEX}/services/aggregations?aggregations=serviceCategories&aggregations=lot${jointCountUrlRetrieve}`;
    const { data: CategoryData } = await gCloudApi.searchInstance(GCLOUD_SEARCH_API_TOKEN).get(JointCountURL);
    const countsObject = Object.assign({}, CategoryData.aggregations.lot, CategoryData.aggregations.serviceCategories);

    const searchKeywordsQuery: any = q;
    const keywordsQuery = q != undefined ? `&q=${encodeURIComponent(searchKeywordsQuery)}` : '';
    const lotsQuery = lot != undefined ? `&lot=${lot}` : '';

    let serviceCategoriesQuery = '';
    let parentCategoryQuery = '';
    let filterURL: string;

    if (lot != undefined) {
      const lotQuery = `?lot=${lot}`;
      serviceCategoriesQuery = serviceCategories != undefined ? `&serviceCategories=${serviceCategories}` : '';
      parentCategoryQuery = parentCategory != undefined ? `&parentCategory=${parentCategory}` : '';
      filterURL = `g-cloud-filters${lotQuery}${serviceCategoriesQuery}${parentCategoryQuery}`;
    } else {
      filterURL = 'g-cloud-filters';
    }

    const clearFilterURL = `/g-cloud/search?${keywordsQuery}${lotsQuery}${serviceCategoriesQuery}${parentCategoryQuery}`;

    const { data: filterData } = await gCloudApi.supplierInstance(GCLOUD_TOKEN).get(filterURL);
    const mainLots = Object.keys(filterData);
    const mainLotswithcount = [];
    for (let i = 0; i <= mainLots.length; i++) {
      const currentlot = mainLots[i];
      if (currentlot != undefined) {
        mainLotswithcount.push({
          key: (currentlot as string).replace('-', ' '),
          count: countsObject[currentlot],
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
                currentObj['count'] = countsObject[currentObj.label];
                lotSubserviceswithCount.push(currentObj);
              }
            }
          } else {
            currentObj['count'] = countsObject[currentObj.label];
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

    const reqUrl = req.url;
    const URL = `${GCLOUD_INDEX}/services/search`;
    const jointUrlRetrieve = await gCloudServiceQueryFliter(reqUrl, URL, 1);
    const searchUrl = await gCloudServiceQueryFliter(reqUrl, URL, 2);
    const searchResultsUrl = await gCloudServiceQueryResults(reqUrl, URL, 2);
    req.session.searchUrl = searchUrl.replace('?', '');
    req.session.searchResultsUrl = searchResultsUrl.replace('?', '');
    const JointURL = `${GCLOUD_INDEX}/services/search${jointUrlRetrieve}`;
    console.log(JointURL);
    let servicesList;

    try {
      servicesList = (await gCloudApi.searchInstance(GCLOUD_SEARCH_API_TOKEN).get(JointURL)).data;
    } catch (error) {
      servicesList = {};
    }

    req.session.searchednoOfPages = Math.round(
      Number(servicesList?.meta?.total) / Number(servicesList?.meta?.results_per_page)
    );

    let NextPageUrl, PrvePageUrl;

    if (servicesList?.links?.next)
      NextPageUrl = servicesList?.links?.next.substring(servicesList?.links?.next.indexOf('?') + 1);
    if (servicesList?.links?.prev)
      PrvePageUrl = servicesList?.links?.prev.substring(servicesList?.links?.prev.indexOf('?') + 1);
    NextPageUrl = await gCloudServiceQueryReplace(NextPageUrl, 'filter_');
    PrvePageUrl = await gCloudServiceQueryReplace(PrvePageUrl, 'filter_');
    const njkDatas = {
      currentLot: lot,
      lotInfos: lotInfo,
      haveLot: lot == undefined ? false : true,
      choosedLot: lot == undefined ? 'All Categories' : lot,
      haveserviceCategory: serviceCategories == undefined ? false : true,
      NextPageUrl: NextPageUrl == undefined ? '' : NextPageUrl,
      PrvePageUrl: PrvePageUrl == undefined ? '' : PrvePageUrl,
      noOfPages: Math.round(Number(servicesList?.meta?.total) / Number(servicesList?.meta?.results_per_page)),
      CurrentPageNumber: Number(servicesList?.meta?.query?.page ? servicesList?.meta?.query?.page : 1),
    };

    const appendData = { data: servicesList, njkDatas, filters: filterDatas, clearFilterURL };
    res.json(appendData);
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
