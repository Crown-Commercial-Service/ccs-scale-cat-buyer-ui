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

// @ts-ignore
// const gCloudServiceQueryFliter = (reqUrl: any, baseUrl: any, overUrl: any) => {
//   var url_parts = url.parse(reqUrl, true);
//   let queryObj: any = url_parts.query;
//   for (const key in queryObj) {
//    
//   }
// }


export const GET_SEARCH = async (req: express.Request, res: express.Response) => {
    const { SESSION_ID } = req.cookies;
    const { lot,serviceCategories,parentCategory,q} = req.query;
    const GCLOUD_TOKEN = process.env.GCLOUD_TOKEN;
    const GCLOUD_SEARCH_API_TOKEN = process.env.GCLOUD_SEARCH_API_TOKEN;
    const GCLOUD_INDEX = process.env.GCLOUD_INDEX;
    try {

      var CountsUrl = `${GCLOUD_INDEX}/services/aggregations?aggregations=serviceCategories&aggregations=lot`;
    let countUrl = req.url;
    let jointCountUrlRetrieve = await gCloudCountQueryFliter(countUrl, CountsUrl, null);
    let JointCountURL: string = `${GCLOUD_INDEX}/services/aggregations?aggregations=serviceCategories&aggregations=lot${jointCountUrlRetrieve}`;
   
    const { data: CategoryData} = await gCloudApi.searchInstance(GCLOUD_SEARCH_API_TOKEN).get(JointCountURL);
    var countsObject = Object.assign({}, CategoryData.aggregations.lot, CategoryData.aggregations.serviceCategories);
     
    var keywordsQuery= q!= undefined ?`&q=${q}`:'';
    var lotsQuery= lot!= undefined ?`&lot=${lot}`:'';
   
    let serviceCategoriesQuery='';
    let parentCategoryQuery='';
      if(lot != undefined){
        var lotQuery = `?lot=${lot}`;
         serviceCategoriesQuery =  serviceCategories != undefined ?`&serviceCategories=${serviceCategories}`:'';
         parentCategoryQuery =  parentCategory != undefined ? `&parentCategory=${parentCategory}`:'';
        var filterURL = `g-cloud-filters${lotQuery}${serviceCategoriesQuery}${parentCategoryQuery}`;
        
      }else{
        filterURL = `g-cloud-filters`;
        
      }
      
      var clearFilterURL=`/g-cloud/search?${keywordsQuery}${lotsQuery}${serviceCategoriesQuery}${parentCategoryQuery}`;

      const { data: filterData} = await gCloudApi.supplierInstance(GCLOUD_TOKEN).get(filterURL);
      const mainLots = Object.keys(filterData);
      const mainLotswithcount = [];
      for(let i=0;i <= mainLots.length;i++){
        let currentlot = mainLots[i];
          if(currentlot != undefined){
          mainLotswithcount.push({"key":(currentlot as string).replace("-"," "), "count":countsObject[currentlot], "slug":currentlot });
          }
      }

   

      let filterDatas;
      let lotInfo = {};
      if(lot != undefined ){
        filterDatas = filterData[`${lot}`];

        let lotSubserviceswithCount : any = [];
        let lotChildrenswithCount = [];
        for(let i=0;i <= filterDatas.categories.filters.length;i++){
          let currentObj = filterDatas.categories.filters[i];
          if(currentObj != undefined){
            if(serviceCategories != undefined){

              if(parentCategory != undefined){
                var parentCategoryValue : any  = parentCategory;
              }else{
                parentCategoryValue = serviceCategories;
              }

              if(currentObj?.children?.length > 0){
                if(currentObj.value == parentCategoryValue){
                  
                  for(let j=0;j <= currentObj.children.length;j++){
                      let currentchild =  currentObj.children[j];
                      if(currentchild != undefined){
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
            }else{
              currentObj['count'] = countsObject[currentObj.label];
              lotSubserviceswithCount.push(currentObj);
            }
          }
        }

        lotInfo = { 
          subservices : lotSubserviceswithCount,
          currentserviceCategory : serviceCategories,
          currentparentCategory : parentCategory == undefined ? '':parentCategory,
          label : (lot as string).replace("-"," ") ,
          slug : lot,
        }
      }else{
        lotInfo = {lots:mainLotswithcount};
        filterDatas = filterData[`cloud-support`];
      }

      let reqUrl = req.url;
      
      let URL: string = `${GCLOUD_INDEX}/services/search`; 
      const jointUrlRetrieve = await gCloudServiceQueryFliter(reqUrl, URL, 1);
      const searchUrl = await gCloudServiceQueryFliter(reqUrl, URL, 2);
      const searchResultsUrl = await gCloudServiceQueryResults(reqUrl, URL, 2);
      req.session.searchUrl=searchUrl.replace("?", "");
      req.session.searchResultsUrl=searchResultsUrl.replace("?", "");
      let JointURL: string = `${GCLOUD_INDEX}/services/search${jointUrlRetrieve}`; 
      try{
        var {data: servicesList} = await gCloudApi.searchInstance(GCLOUD_SEARCH_API_TOKEN).get(JointURL);
      }catch(error){
        servicesList = {};


      }

      req.session.searchednoOfPages=Math.round(Number(servicesList?.meta?.total)/Number(servicesList?.meta?.results_per_page));
    
      if(servicesList?.links?.next) var NextPageUrl = servicesList?.links?.next.substring(servicesList?.links?.next.indexOf('?') + 1);
      if(servicesList?.links?.prev) var PrvePageUrl = servicesList?.links?.prev.substring(servicesList?.links?.prev.indexOf('?') + 1);
      
      NextPageUrl=await gCloudServiceQueryReplace(NextPageUrl, "filter_");
      PrvePageUrl=await gCloudServiceQueryReplace(PrvePageUrl, "filter_");

      
      
      var njkDatas = {
        currentLot:lot,
        lotInfos:lotInfo,
        haveLot:lot == undefined ? false:true ,
        choosedLot:lot == undefined ? 'All Categories':lot ,
        haveserviceCategory:serviceCategories == undefined ? false:true,
        NextPageUrl:NextPageUrl == undefined ? '' : NextPageUrl,
        PrvePageUrl:PrvePageUrl == undefined ? '' : PrvePageUrl,
        noOfPages:Math.round(Number(servicesList?.meta?.total)/Number(servicesList?.meta?.results_per_page)),
        CurrentPageNumber:Number(servicesList?.meta?.query?.page ?servicesList?.meta?.query?.page:1 )
      }

    
      
      const releatedContent = req.session.releatedContent;
      const appendData = { data: servicesList,njkDatas,filters:filterDatas,releatedContent: releatedContent, lotId:req.session.lotId,agreementLotName:req.session.agreementLotName,clearFilterURL:clearFilterURL,jsondata: saveYourSearchData,};
      
       //CAS-INFO-LOG
     LoggTracer.infoLogger(null, logConstant.gcSearch, req);
      res.render('search',appendData);
    } catch (error) {
      console.log(error);
        LoggTracer.errorLogger( res, error, `${req.headers.host}${req.originalUrl}`, null,
          TokenDecoder.decoder(SESSION_ID), 'G-Cloud 13 throws error - Tenders Api is causing problem', true,
        );
    }
};

export const GET_SEARCH_API = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { lot,serviceCategories,parentCategory,q} = req.query;
  const GCLOUD_TOKEN = process.env.GCLOUD_TOKEN;
  const GCLOUD_SEARCH_API_TOKEN = process.env.GCLOUD_SEARCH_API_TOKEN;
  const GCLOUD_INDEX = process.env.GCLOUD_INDEX;
  try {

    var CountsUrl = `${GCLOUD_INDEX}/services/aggregations?aggregations=serviceCategories&aggregations=lot`;
    let countUrl = req.url;
    let jointCountUrlRetrieve = await gCloudCountQueryFliter(countUrl, CountsUrl, null);
    let JointCountURL: string = `${GCLOUD_INDEX}/services/aggregations?aggregations=serviceCategories&aggregations=lot${jointCountUrlRetrieve}`;
    const { data: CategoryData} = await gCloudApi.searchInstance(GCLOUD_SEARCH_API_TOKEN).get(JointCountURL);
    var countsObject = Object.assign({}, CategoryData.aggregations.lot, CategoryData.aggregations.serviceCategories);
       
    var keywordsQuery= q!= undefined ?`&q=${q}`:'';
    var lotsQuery= lot!= undefined ?`&lot=${lot}`:'';
  
    let serviceCategoriesQuery='';
    let parentCategoryQuery='';

    if(lot != undefined){
      var lotQuery = `?lot=${lot}`;
       serviceCategoriesQuery =  serviceCategories != undefined ?`&serviceCategories=${serviceCategories}`:'';
       parentCategoryQuery =  parentCategory != undefined ? `&parentCategory=${parentCategory}`:'';
      var filterURL = `g-cloud-filters${lotQuery}${serviceCategoriesQuery}${parentCategoryQuery}`;
    }else{
      filterURL = `g-cloud-filters`;
    }

    var clearFilterURL=`/g-cloud/search?${keywordsQuery}${lotsQuery}${serviceCategoriesQuery}${parentCategoryQuery}`;
   
    const { data: filterData} = await gCloudApi.supplierInstance(GCLOUD_TOKEN).get(filterURL);
    const mainLots = Object.keys(filterData);
    const mainLotswithcount = [];
    for(let i=0;i <= mainLots.length;i++){
      let currentlot = mainLots[i];
        if(currentlot != undefined){
        mainLotswithcount.push({"key":(currentlot as string).replace("-"," "), "count":countsObject[currentlot], "slug":currentlot });
        }
    }

    let filterDatas;
    let lotInfo = {};
    if(lot != undefined ){
      filterDatas = filterData[`${lot}`];

      let lotSubserviceswithCount : any = [];
      let lotChildrenswithCount = [];
      for(let i=0;i <= filterDatas.categories.filters.length;i++){
        let currentObj = filterDatas.categories.filters[i];
        if(currentObj != undefined){
          if(serviceCategories != undefined){

            if(parentCategory != undefined){
              var parentCategoryValue : any  = parentCategory;
            }else{
              parentCategoryValue = serviceCategories;
            }

            if(currentObj?.children?.length > 0){
              if(currentObj.value == parentCategoryValue){
                
                for(let j=0;j <= currentObj.children.length;j++){
                    let currentchild =  currentObj.children[j];
                    if(currentchild != undefined){
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
          }else{
            currentObj['count'] = countsObject[currentObj.label];
            lotSubserviceswithCount.push(currentObj);
          }
        }
      }

      lotInfo = { 
        subservices : lotSubserviceswithCount,
        currentserviceCategory : serviceCategories,
        currentparentCategory : parentCategory == undefined ? '':parentCategory,
        label : (lot as string).replace("-"," ") ,
        slug : lot,
      }
    }else{
      lotInfo = {lots:mainLotswithcount};
      filterDatas = filterData[`cloud-support`];
    }

    let reqUrl = req.url;
    let URL: string = `${GCLOUD_INDEX}/services/search`; 
    const jointUrlRetrieve = await gCloudServiceQueryFliter(reqUrl, URL, 1);
    const searchUrl = await gCloudServiceQueryFliter(reqUrl, URL, 2);
    const searchResultsUrl = await gCloudServiceQueryResults(reqUrl, URL, 2);
      req.session.searchUrl=searchUrl.replace("?", "");
      req.session.searchResultsUrl=searchResultsUrl.replace("?", "");
    let JointURL: string = `${GCLOUD_INDEX}/services/search${jointUrlRetrieve}`; 
   
    try{
      var {data: servicesList} = await gCloudApi.searchInstance(GCLOUD_SEARCH_API_TOKEN).get(JointURL);
    }catch(error){
      servicesList = {};
    }

    req.session.searchednoOfPages=Math.round(Number(servicesList?.meta?.total)/Number(servicesList?.meta?.results_per_page));
    
    
    if(servicesList?.links?.next) var NextPageUrl = servicesList?.links?.next.substring(servicesList?.links?.next.indexOf('?') + 1);
    if(servicesList?.links?.prev) var PrvePageUrl = servicesList?.links?.prev.substring(servicesList?.links?.prev.indexOf('?') + 1);
    NextPageUrl=await gCloudServiceQueryReplace(NextPageUrl, "filter_");
    PrvePageUrl=await gCloudServiceQueryReplace(PrvePageUrl, "filter_");
    var njkDatas = {
      currentLot:lot,
     lotInfos:lotInfo,
      haveLot:lot == undefined ? false:true ,
      choosedLot:lot == undefined ? 'All Categories':lot ,
      haveserviceCategory:serviceCategories == undefined ? false:true,
      NextPageUrl:NextPageUrl == undefined ? '' : NextPageUrl,
      PrvePageUrl:PrvePageUrl == undefined ? '' : PrvePageUrl,
      noOfPages:Math.round(Number(servicesList?.meta?.total)/Number(servicesList?.meta?.results_per_page)),
      CurrentPageNumber:Number(servicesList?.meta?.query?.page ?servicesList?.meta?.query?.page:1 )
    }
   
    const appendData = { data: servicesList,njkDatas,filters:filterDatas,clearFilterURL};
    res.json(appendData);
  } catch (error) {
   
      LoggTracer.errorLogger( res, error, `${req.headers.host}${req.originalUrl}`, null,
        TokenDecoder.decoder(SESSION_ID), 'G-Cloud 13 throws error - Tenders Api is causing problem', true,
      );
  }
};



