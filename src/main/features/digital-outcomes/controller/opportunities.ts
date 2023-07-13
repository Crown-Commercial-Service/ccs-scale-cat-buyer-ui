import * as express from 'express';
import * as fileData from '../../../resources/content/digital-outcomes/oppertunities.json';
//import * as sampleJson from '../../../resources/content/digital-outcomes/sampleOpper.json';
// import * as procdata from '../../../resources/content/digital-outcomes/procdetails.json';
import { TenderApi } from '../../../common/util/fetch/tenderService/tenderApiInstance';

import { DynamicFrameworkInstance } from 'main/features/event-management/util/fetch/dyanmicframeworkInstance';

export const GET_OPPORTUNITIES = async (req: express.Request, res: express.Response) => {
  try {
    const { lot, status, q, page, location } = req.query;

    //const queryParameters = req.query;

    // const queryUrl = Object.keys(queryParameters)
    //   .map((key) => `${key}=${queryParameters[key]}`)
    //   .join('&');

    const NoOfRecordsPerPage = 20;
    const usingObjectAssign = Object.assign([], status);
    const statusArray: any = [];
    const FilterQuery: any = [];
    let checkedOpen = '';
    let checkedClose = '';
    let pageUrl = '';
    // const url = req.originalUrl.toString();
    // console.log('url', url.indexOf('?'));
    // if (url.indexOf('?') != -1) {
    //   pageUrl = url.substring(url.indexOf('?') + 1);
    // }

    // usingObjectAssign.forEach((val, i) => {
    //   let options = {
    //     id: i,
    //     text: val,
    //     selected: true,
    //     count: 0,
    //   };
    //   console
    //   statusArray.push(options);
    // });

    if (Array.isArray(status)) {
      usingObjectAssign.forEach((val, i) => {
        let options = {
          id: i,
          text: val,
          selected: true,
          count: 2,
        };
        statusArray.push(options);
        if (val == 'open') {
          checkedOpen = 'checked';
          pageUrl = `&status=${val}`;
        }
        if (val == 'closed') {
          checkedClose = 'checked';
          pageUrl += `&status=${val}`;
        }
      });
    } else {
      const options = {
        id: 1,
        text: status,
        selected: true,
        count: 1,
      };
      statusArray.push(options);
      if (status == 'open') {
        checkedOpen = 'checked';
        pageUrl = `&status=${status}`;
      }
      if (status == 'closed') {
        checkedClose = 'checked';
        pageUrl = `&status=${status}`;
      }
    }
    const statusPageQuery = status != undefined ? pageUrl : '';
    const querydata = {
      name: 'status',
      options: statusArray,
    };
    FilterQuery.push(querydata);
    const finalquery = {
      filters: FilterQuery,
    };

    const searchKeywordsQuery: any = q;
    const keywordsQuery = q != undefined ? `&keyword=${encodeURIComponent(searchKeywordsQuery)}` : '';
    const keywordsQuery1 = q != undefined ? `&q=${encodeURIComponent(searchKeywordsQuery)}` : '';
    const statusQuery = status != undefined ? `&filters=${btoa(JSON.stringify(finalquery))}` : '';
    const lotsQuery = lot != undefined ? `&lot-id=${lot}` : '';
    const pageQuery = page != undefined ? `&page=${page}` : '';
    const baseURL = `/tenders/projects/search?agreement-id=RM1043.8${keywordsQuery}${statusQuery}${lotsQuery}${pageQuery}`;
    //const clearFilterURL = `/digital-outcomes-and-specialists/opportunities?${keywordsQuery}${statusQuery}${lotsQuery}`;
    const clearFilterURL = '/digital-outcomes-and-specialists/opportunities';
    const fetch_dynamic_api = await TenderApi.InstanceSupplierQA().get(baseURL);
    const response_data = fetch_dynamic_api?.data;
    let NextPagedata, PrevPagedata, currentPageData, lastPageData;
    if (response_data?.links?.next != '') {
      NextPagedata = response_data?.links?.next.substring(response_data?.links?.next.indexOf('?') + 1);
      const urlParams = new URLSearchParams(NextPagedata);
      const params = Object.fromEntries(urlParams);
      NextPagedata = params.page;
    }
    if (response_data?.links?.prev != '') {
      PrevPagedata = response_data?.links?.prev.substring(response_data?.links?.prev.indexOf('?') + 1);
      const urlParams = new URLSearchParams(PrevPagedata);
      const params = Object.fromEntries(urlParams);
      PrevPagedata = params.page;
    }

    if (response_data?.links?.self != '') {
      currentPageData = response_data?.links?.self.substring(response_data?.links?.self.indexOf('?') + 1);
      const urlParams = new URLSearchParams(currentPageData);
      const params = Object.fromEntries(urlParams);
      currentPageData = params.page;
    }

    if (response_data?.links?.last != '') {
      lastPageData = response_data?.links?.last.substring(response_data?.links?.last.indexOf('?') + 1);
      const urlParams = new URLSearchParams(lastPageData);
      const params = Object.fromEntries(urlParams);
      lastPageData = params.page;
    }
    const totalpages = response_data.totalResults > NoOfRecordsPerPage ? parseInt(lastPageData) : 1;
    //let nextPageUrl = `page=${parseInt(NextPagedata)}${keywordsQuery}${statusQuery}${lotsQuery}${pageQuery}`;
    const lotsQuerypage = lot != undefined ? `&lot=${lot}` : '';

    let titletxt = 'All lots';
    response_data.searchCriteria.lots.forEach((value: any) => {
      if (value.selected == true) {
        titletxt = value.text;
      }
    });
    // if (q != undefined) {
    //   titletxt = ' containing ' + q + ' ' + titletxt;
    // }
    // console.log('titletxt', titletxt);
    const njkDatas = {
      currentLot: lot,
      lotDetails: [
        {
          id: 1,
          text: 'Digital outcomes',
          selected: false,
          count: 606,
        },
        {
          id: 3,
          text: 'User research participants',
          selected: false,
          count: 405,
        },
      ],
      lotInfos: {
        lots: [
          { key: 'Digital outcomes', count: 3108, slug: '1', sno: 1 },
          { key: 'User research participants', count: 118, slug: '3', sno: 3 },
        ],
      },
      haveLot: lot == undefined ? false : true,
      choosedLot: 'All Categories',
      haveserviceCategory: false,
      NextPageUrl:
        NextPagedata == undefined
          ? ''
          : `page=${parseInt(NextPagedata)}${keywordsQuery1}${lotsQuerypage}${statusPageQuery}`,
      PrvePageUrl:
        PrevPagedata == undefined
          ? ''
          : `page=${parseInt(PrevPagedata)}${keywordsQuery1}${lotsQuerypage}${statusPageQuery}`,
      noOfPages: totalpages,
      CurrentPageNumber: parseInt(currentPageData),
      LastPageNumber: parseInt(lastPageData),
      PreviousPageNumber: parseInt(PrevPagedata),
      NextPageNumber: parseInt(NextPagedata),
    };

    let qtext: any = '';
    if (q != undefined) {
      qtext = q;
    }

    const locations = [
      'Scotland',
      'ScotlandNorth East England',
      'North West England',
      'Yorkshire and the Humber',
      'East Midlands',
      'West Midlands',
      'East of England',
      'London',
      'South East England',
      'South West England',
      'Wales',
      'Northern Ireland',
      'International (outside the UK)',
      'Off-site',
    ];

    let lotDetails;
    if (q == undefined && status == undefined && lot == undefined && page == undefined) {
      lotDetails = response_data.searchCriteria.lots;
      njkDatas.lotDetails = lotDetails;
    }
    if (q != undefined || status != undefined || lot != undefined || page != undefined) {
      njkDatas.lotDetails.map((value: any) => {
        response_data.searchCriteria.lots.forEach((res: any) => {
          if (res.id == value.id) {
            value.count = res.count;
          }
        });
      });
    }
    const display_fetch_data = {
      file_data: fileData,
      search_data: response_data,
      njkDatas,
      clearFilterURL: clearFilterURL,
      currentLot: lot,
      status: status,
      checkedOpen,
      checkedClose,
      lot,
      titletxt,
      searchdata: q,
      qtext: qtext,
      locations: locations,
      locationFilter: location,
    };
    res.render('opportunities', display_fetch_data);
  } catch (error) {
    console.log('error in opportunities', error);
  }
};
export const GET_OPPORTUNITIES_DETAILS = async (req: express.Request, res: express.Response) => {
  const { projectId, lot } = req.query;
  try {
    let contextRequirements,
      contextRequirementsGroups,
      assessmentCriteria,
      assessmentCriteriaGroups,
      timeline,
      timelineQuestionGroups;
    const howWillScore: any = [];
    const assessmentquestions: any = [];
    let indicativedurationYear = '';
    let indicativedurationMonth = '';
    let indicativedurationDay = '';
    let extentionindicativedurationYear = '';
    let extentionindicativedurationMonth = '';
    let extentionindicativedurationDay = '';

    const baseServiceURL: any = `/tenders/projects/${projectId}`;
    const fetch_dynamic_api = await TenderApi.InstanceSupplierQA().get(baseServiceURL);

    // const fetch_dynamic_service_api = await TenderApi.Instance(SESSION_ID).get(baseServiceURL);
    const fetch_dynamic_service_api_data = fetch_dynamic_api?.data;
    const tenderer = fetch_dynamic_service_api_data.records[0].compiledRelease.tender;

    const fetch_dynamic_api_data = fetch_dynamic_service_api_data.records[0].compiledRelease.tender.criteria;
    fetch_dynamic_api_data.forEach((value: any) => {
      if (value.id == 'Criterion 1') {
        timeline = value;
        timelineQuestionGroups = timeline?.requirementGroups[0].requirements.sort((a: any, b: any) =>
          parseInt(a.id?.replace('Question ', '')) < parseInt(b.id?.replace('Question ', '')) ? -1 : 1
        );
        timelineQuestionGroups.map((value: any) => {
          if (value['pattern']) {
            value.pattern = value.pattern ? JSON.parse(value.pattern) : [];
          }
        });
      } else if (value.id == 'Criterion 2') {
        assessmentCriteria = value;

        assessmentCriteriaGroups = assessmentCriteria?.requirementGroups?.sort((a: any, b: any) =>
          parseInt(a.id?.replace('Group ', '')) < parseInt(b.id?.replace('Group ', '')) ? -1 : 1
        );
        assessmentCriteriaGroups.map((value: any) => {
          let descVal: any, weightageVal: any;
          value.requirements.forEach((val: any) => {
            if (val['pattern']) {
              val.pattern = val.pattern ? JSON.parse(val.pattern) : [];
              if ((value.id == 'Group 11' && lot == '3') || (value.id == 'Group 13' && lot == '1')) {
                const rowVal = val.pattern[0].tableDefinition ? val.pattern[0].tableDefinition.titles.rows : [];
                const dataVal = val.pattern[0].tableDefinition ? val.pattern[0].tableDefinition.data : [];
                rowVal.forEach((rowvalue: any) => {
                  dataVal.forEach((dataval: any) => {
                    if (rowvalue.id == dataval.row) {
                      let scorevalue = {
                        level: rowvalue.name,
                        score: dataval.cols[0],
                        description: dataval.cols[1],
                      };
                      howWillScore.push(scorevalue);
                    }
                  });
                });
              }
              if (
                value.id == 'Group 5' ||
                value.id == 'Group 6' ||
                value.id == 'Group 7' ||
                (lot == '3' && value.id == 'Group 8') ||
                (lot == '1' && value.id == 'Group 8') ||
                (lot == '1' && value.id == 'Group 9')
              ) {
                let questionvalue;
                let questiondatas: any = [];
                if (val.id == 'Question 1') {
                  descVal = val.pattern;
                }
                if (val.id == 'Question 2') {
                  weightageVal = val.pattern;
                }

                if (descVal != undefined && weightageVal != undefined) {
                  descVal.forEach((des: any, i: number) => {
                    questionvalue = {
                      description: descVal[i].value,
                      weightage: weightageVal[i].value,
                    };
                    questiondatas.push(questionvalue);
                  });

                  let questiondata = {
                    groupId: value.id,
                    data: questiondatas,
                  };
                  assessmentquestions.push(questiondata);
                }
              }
            }
          });
        });
      } else if (value.id == 'Criterion 3') {
        contextRequirements = value;
        contextRequirementsGroups = contextRequirements?.requirementGroups?.sort((a: any, b: any) =>
          parseInt(a.id?.replace('Group ', '')) < parseInt(b.id?.replace('Group ', '')) ? -1 : 1
        );
        contextRequirementsGroups.map((value: any) => {
          value.requirements.forEach((val: any) => {
            if (val['pattern']) {
              val.pattern = val.pattern ? JSON.parse(val.pattern) : [];
              if (value.id == 'Group 18' && lot == '1') {
                if (val.id == 'Question 12') {
                  let contractValue = val.pattern?.[0]?.value;
                  if (contractValue != undefined) {
                    indicativedurationYear = contractValue?.substring(1)?.split('Y')?.[0] + ' years';
                    indicativedurationMonth = contractValue?.substring(1)?.split('Y')?.[1]?.split('M')?.[0] + ' months';
                    indicativedurationDay =
                      contractValue?.substring(1)?.split('Y')?.[1]?.split('M')?.[1].replace('D', '') + ' days';
                  }
                }
                if (val.id == 'Question 13') {
                  let extensionValue = val.pattern?.[0]?.value;
                  if (extensionValue != undefined) {
                    extentionindicativedurationYear = extensionValue?.substring(1)?.split('Y')?.[0] + ' years';
                    extentionindicativedurationMonth =
                      extensionValue?.substring(1)?.split('Y')?.[1]?.split('M')?.[0] + ' months';
                    extentionindicativedurationDay =
                      extensionValue?.substring(1)?.split('Y')?.[1]?.split('M')?.[1].replace('D', '') + ' days';
                  }
                }
              }
            }
          });
        });
      }
    });
    //  console.log('assessmentquestions', JSON.stringify(assessmentquestions));
    // if(contextRequirements){
    //  ContextGroups =contextRequirements?.requirementGroups
    // }
    // fetch_dynamic_api_data = fetch_dynamic_api_data.sort((a, b) => (a.OCDS.id < b.OCDS.id ? -1 : 1));
    // let Pattern = JSON.parse(
    //   '[{"value":"North East England","select":false,"text":null,"tableDefinition":null},{"value":"North West England","select":false,"text":null,"tableDefinition":null},{"value":"Yorkshire and the Humber","select":false,"text":null,"tableDefinition":null},{"value":"East Midlands","select":true,"text":null,"tableDefinition":null},{"value":"West Midlands","select":true,"text":null,"tableDefinition":null},{"value":"East of England","select":false,"text":null,"tableDefinition":null},{"value":"London","select":false,"text":null,"tableDefinition":null},{"value":"South East England","select":false,"text":null,"tableDefinition":null},{"value":"South West England","select":false,"text":null,"tableDefinition":null},{"value":"Scotland","select":false,"text":null,"tableDefinition":null},{"value":"Wales","select":false,"text":null,"tableDefinition":null},{"value":"Northern Ireland","select":false,"text":null,"tableDefinition":null},{"value":"International (outside the UK)","select":false,"text":null,"tableDefinition":null}]'
    // );
    const display_fetch_data = {
      context_data: contextRequirementsGroups,
      assessment_Criteria: assessmentCriteriaGroups,
      assessmentquestions_data: assessmentquestions,
      timeline_data: timelineQuestionGroups,
      howWillScore_data: howWillScore,
      currentLot: lot,
      indicativedurationYear:
        indicativedurationYear != undefined && indicativedurationYear != null ? indicativedurationYear : null,
      indicativedurationMonth:
        indicativedurationMonth != undefined && indicativedurationMonth != null ? indicativedurationMonth : null,
      indicativedurationDay:
        indicativedurationDay != undefined && indicativedurationDay != null ? indicativedurationDay : null,

      extentionindicativedurationYear:
        extentionindicativedurationYear != undefined && extentionindicativedurationYear != null
          ? extentionindicativedurationYear
          : null,
      extentionindicativedurationMonth:
        extentionindicativedurationMonth != undefined && extentionindicativedurationMonth != null
          ? extentionindicativedurationMonth
          : null,
      extentionindicativedurationDay:
        extentionindicativedurationDay != undefined && extentionindicativedurationDay != null
          ? extentionindicativedurationDay
          : null,
      tenderer: tenderer,
      projectId: projectId,
    };

    res.render('opportunitiesReview', display_fetch_data);
  } catch (error) {
    console.log('error in opportunities', error);
  }
};

export const GET_OPPORTUNITIES_API = async (req: express.Request, res: express.Response) => {
  const { lot, status, q, page, location } = req.query;

  const NoOfRecordsPerPage = 20;
  let pageUrl = '';
  try {
    const usingObjectAssign = Object.assign([], status);
    const usingObjectAssignLocation = Object.assign([], location);
    // const reqUrl = req.url;
    let statusArray: any = [];
    const FilterQuery: any = [];
    let locationArray: any = [];

    //Location
    if (Array.isArray(location)) {
      usingObjectAssignLocation.forEach((val, i) => {
        let options = {
          id: i,
          text: val,
          selected: true,
          count: 2,
        };
        locationArray.push(options);
        // if (val == 'open') {
        //   pageUrl = `&status=${val}`;
        // }
        // if (val == 'closed') {
        //   pageUrl += `&status=${val}`;
        // }
      });
    } else {
      let options = {
        id: 1,
        text: location,
        selected: true,
        count: 1,
      };
      locationArray.push(options);
      // if (status == 'open') {
      //   pageUrl = `&status=${status}`;
      // }
      // if (status == 'closed') {
      //   pageUrl = `&status=${status}`;
      // }
    }

    if (Array.isArray(status)) {
      usingObjectAssign.forEach((val, i) => {
        let options = {
          id: i,
          text: val,
          selected: true,
          count: 2,
        };
        statusArray.push(options);
        if (val == 'open') {
          pageUrl = `&status=${val}`;
        }
        if (val == 'closed') {
          pageUrl += `&status=${val}`;
        }
      });
    } else {
      let options = {
        id: 1,
        text: status,
        selected: true,
        count: 1,
      };
      statusArray.push(options);
      if (status == 'open') {
        pageUrl = `&status=${status}`;
      }
      if (status == 'closed') {
        pageUrl = `&status=${status}`;
      }
    }
    // usingObjectAssign.forEach((val, i) => {
    //   let options = {
    //     id: i,
    //     text: val,
    //     selected: true,
    //     count: 0,
    //   };
    //   statusArray.push(options);
    // });
    let locationdata = {
      name: 'location',
      options: locationArray,
    };
    console.log('locationdata', locationdata);

    let querydata = {
      name: 'status',
      options: statusArray,
    };
    FilterQuery.push(querydata);
    //FilterQuery.push(locationdata);

    let finalquery = {
      filters: FilterQuery,
    };

    console.log('finalquery', JSON.stringify(finalquery));

    const statusPageQuery = status != undefined ? pageUrl : '';
    const searchKeywordsQuery: any = q;
    //console.log('filter url', btoa(JSON.stringify(finalquery)));
    const keywordsQuery = q != undefined ? `&keyword=${encodeURIComponent(searchKeywordsQuery)}` : '';
    const keywordsQuery1 = q != undefined ? `&q=${encodeURIComponent(searchKeywordsQuery)}` : '';

    // let statusQuery = '';
    // if (status != undefined || location != undefined) {
    //   statusQuery = `&filters=${btoa(JSON.stringify(finalquery))}`;
    // }
    const statusQuery = status != undefined ? `&filters=${btoa(JSON.stringify(finalquery))}` : '';

    const lotsQuery = lot != undefined ? `&lot-id=${lot}` : '';
    const pageQuery = page != undefined ? `&page=${page}` : '';
    const baseURL = `/tenders/projects/search?agreement-id=RM1043.8${keywordsQuery}${statusQuery}${lotsQuery}${pageQuery}`;
    // const clearFilterURL = `/digital-outcomes-and-specialists/opportunities?${keywordsQuery}${statusQuery}${lotsQuery}`;
    const clearFilterURL = '/digital-outcomes-and-specialists/opportunities';

    const fetch_dynamic_api = await TenderApi.InstanceSupplierQA().get(baseURL);

    let response_data = fetch_dynamic_api?.data;

    let NextPagedata, PrevPagedata, currentPageData, lastPageData;
    if (response_data?.links?.next) {
      NextPagedata = response_data?.links?.next.substring(response_data?.links?.next.indexOf('?') + 1);
      const urlParams = new URLSearchParams(NextPagedata);
      const params = Object.fromEntries(urlParams);
      NextPagedata = params.page;
    }
    if (response_data?.links?.prev) {
      PrevPagedata = response_data?.links?.prev.substring(response_data?.links?.prev.indexOf('?') + 1);
      const urlParams = new URLSearchParams(PrevPagedata);
      const params = Object.fromEntries(urlParams);
      PrevPagedata = params.page;
    }
    if (response_data?.links?.self) {
      currentPageData = response_data?.links?.self.substring(response_data?.links?.self.indexOf('?') + 1);
      const urlParams = new URLSearchParams(currentPageData);
      const params = Object.fromEntries(urlParams);
      currentPageData = params.page;
    }
    if (response_data?.links?.last != '') {
      lastPageData = response_data?.links?.last.substring(response_data?.links?.last.indexOf('?') + 1);
      const urlParams = new URLSearchParams(lastPageData);
      const params = Object.fromEntries(urlParams);
      lastPageData = params.page;
    }
    let totalpages = response_data.totalResults > NoOfRecordsPerPage ? parseInt(lastPageData) : 1;
    // let nextPageUrl = `page=${parseInt(NextPagedata)}${keywordsQuery}${statusQuery}${lotsQuery}${pageQuery}`;
    const lotsQuerypage = lot != undefined ? `&lot=${lot}` : '';
    let titletxt = 'All lots';
    response_data.searchCriteria.lots.forEach((value: any) => {
      if (value.selected == true) {
        titletxt = value.text;
      }
    });
    // if (q != undefined) {
    //   titletxt = ' containing ' + q + '' + titletxt;
    // }

    let njkDatas = {
      currentLot: lot,
      lotDetails: [
        {
          id: 1,
          text: 'Digital outcomes',
          selected: false,
          count: 606,
        },
        {
          id: 3,
          text: 'User research participants',
          selected: false,
          count: 405,
        },
      ],
      lotInfos: {
        lots: [
          { key: 'Digital outcomes', count: 3108, slug: '1', sno: 1 },
          { key: 'Digital specialists', count: 2239, slug: 'digital-specialists', sno: 2 },
          { key: 'User research participants', count: 118, slug: '3', sno: 3 },
        ],
      },
      haveLot: lot == undefined ? false : true,
      choosedLot: 'All Categories',
      haveserviceCategory: false,
      NextPageUrl:
        NextPagedata == undefined
          ? ''
          : `page=${parseInt(NextPagedata)}${keywordsQuery1}${lotsQuerypage}${statusPageQuery}`,
      PrvePageUrl:
        PrevPagedata == undefined
          ? ''
          : `page=${parseInt(PrevPagedata)}${keywordsQuery1}${lotsQuerypage}${statusPageQuery}`,
      noOfPages: totalpages,
      CurrentPageNumber: parseInt(currentPageData),
      LastPageNumber: parseInt(lastPageData),
      PreviousPageNumber: parseInt(PrevPagedata),
      NextPageNumber: parseInt(NextPagedata),
    };

    let lotDetails;
    if (q == undefined && status == undefined && lot == undefined && page == undefined) {
      lotDetails = response_data.searchCriteria.lots;
      njkDatas.lotDetails = lotDetails;
    }
    if (q != undefined || status != undefined || lot != undefined || page != undefined) {
      njkDatas.lotDetails.map((value: any) => {
        response_data.searchCriteria.lots.forEach((res: any) => {
          if (res.id == value.id) {
            value.count = res.count;
          }
        });
      });
    }

    const display_fetch_data = {
      file_data: fileData,
      search_data: response_data,
      njkDatas,
      totalResults: response_data.totalResults,
      clearFilterURL: clearFilterURL,
      currentLot: lot,
      titletxt,
      searchdata: q,
    };
    res.json(display_fetch_data);

    //res.render('opportunities', display_fetch_data);
  } catch (error) {
    console.log('error', error);
  }
};

export const OPPORTUNITIES_DOWNLOAD = async (req: express.Request, res: express.Response) => {
  // const { projectId } = req.session;
  // const { eventId } = req.session;
  const { download } = req.query;

  try {
    if (download != undefined) {
      const FileDownloadURL = '/tenders/projects/download';
      const FetchDocuments = await DynamicFrameworkInstance.file_dowload_Instance_Public().get(FileDownloadURL, {
        responseType: 'arraybuffer',
      });
      const file = FetchDocuments;
      const fileName = file.headers['content-disposition'].split('filename=')[1].split('"').join('');
      const fileData = file.data;
      const type = file.headers['content-type'];
      const ContentLength = file.headers['content-length'];
      res.status(200);
      res.set({
        'Cache-Control': 'no-cache',
        'Content-Type': type,
        'Content-Length': ContentLength,
        'Content-Disposition': 'attachment; filename=' + fileName,
      });
      res.send(fileData);
    }
  } catch (error) {
    console.log('error', error);
    // LoggTracer.errorLogger(
    //   res,
    //   error,
    //   `${req.headers.host}${req.originalUrl}`,
    //   null,
    //   TokenDecoder.decoder(SESSION_ID),
    //   'Event management - Tenders Service Api cannot be connected',
    //   true
    // );
  }
};
