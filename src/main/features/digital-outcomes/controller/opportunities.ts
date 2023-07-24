import * as express from 'express';
import * as fileData from '../../../resources/content/digital-outcomes/oppertunities.json';
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
    let statusLotsQuery = '';
    let statusqry = '';

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
        if (q != undefined) {
          if (i == 0) {
            statusqry += `&status=${val}`;
          }
          if (i == 1) {
            statusqry += `&status=${val}`;
          }
          statusLotsQuery = status != undefined ? statusqry : '';
        } else {
          if (i == 0) {
            statusqry += `status=${val}`;
          }
          if (i == 1) {
            statusqry += `&status=${val}`;
          }
          statusLotsQuery = status != undefined ? statusqry : '';
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
      if (q != undefined) {
        statusqry += `&status=${status}`;
        statusLotsQuery = status != undefined ? statusqry : '';
      } else {
        statusqry = `status=${status}`;
        statusLotsQuery = status != undefined ? statusqry : '';
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
    const lotsQueryclearUrl = lot != undefined ? `&lot=${lot}` : '';
    const clearFilterURL = `/digital-outcomes-and-specialists/opportunities?${keywordsQuery1}${lotsQueryclearUrl}`;
    const keywordsLotsQuery = q != undefined ? `q=${encodeURIComponent(searchKeywordsQuery)}` : '';
    const AllLotsFilterURL = `/digital-outcomes-and-specialists/opportunities?${keywordsLotsQuery}${statusLotsQuery}`;
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
    const lotsQuerypage = lot != undefined ? `&lot=${lot}` : '';
    let titletxt = 'All lots';
    response_data.searchCriteria.lots.forEach((value: any) => {
      if (value.selected == true) {
        titletxt = value.text;
      }
    });
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
      if (response_data.totalResults != 0) {
        njkDatas.lotDetails.map((value: any) => {
          response_data.searchCriteria.lots.forEach((res: any) => {
            if (response_data.searchCriteria.lots.length == 1) {
              if (res.id == value.id) {
                value.count = res.count;
              } else if (res.id != value.id) {
                value.count = 0;
              }
            } else {
              if (res.id == value.id) {
                value.count = res.count;
              }
            }
          });
        });
      } else {
        njkDatas.lotDetails.map((value: any) => {
          value.count = 0;
        });
      }
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
      AllLotsFilterURL,
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
    const contextGroup9Questions: any = [];
    let indicativedurationYear = '';
    let indicativedurationMonth = '';
    let indicativedurationDay = '';
    let extentionindicativedurationYear = '';
    let extentionindicativedurationMonth = '';
    let extentionindicativedurationDay = '';
    const baseServiceURL: any = `/tenders/projects/${projectId}`;
    const fetch_dynamic_api = await TenderApi.InstanceSupplierQA().get(baseServiceURL);
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
                if (lot == '1' && (value.id == 'Group 8' || value.id == 'Group 9')) {
                  if (val.id == 'Question 4') {
                    weightageVal = val.pattern;
                  }
                } else {
                  if (val.id == 'Question 2') {
                    weightageVal = val.pattern;
                  }
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
          let usertypeVal: any, definitionVal: any;

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
              if (value.id == 'Group 9' && lot == '1') {
                let questionvalue;
                let questiondatas: any = [];
                if (val.id == 'Question 1') {
                  usertypeVal = val.pattern;
                }
                if (val.id == 'Question 2') {
                  definitionVal = val.pattern;
                }

                if (usertypeVal != undefined && definitionVal != undefined) {
                  usertypeVal.forEach((des: any, i: number) => {
                    questionvalue = {
                      usertype: usertypeVal[i].value,
                      description: definitionVal[i].value,
                    };
                    questiondatas.push(questionvalue);
                  });

                  let questiondata = {
                    groupId: value.id,
                    data: questiondatas,
                  };
                  contextGroup9Questions.push(questiondata);
                }
              }
            }
          });
        });
      }
    });
    const display_fetch_data = {
      context_data: contextRequirementsGroups,
      assessment_Criteria: assessmentCriteriaGroups,
      assessmentquestions_data: assessmentquestions,
      contextGroup9Questions_data: contextGroup9Questions,
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
    let statusArray: any = [];
    const FilterQuery: any = [];
    let locationArray: any = [];
    let statusqry = '';
    let statusLotsQuery = '';
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
      });
    } else {
      let options = {
        id: 1,
        text: location,
        selected: true,
        count: 1,
      };
      locationArray.push(options);
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
        if (q != undefined) {
          if (i == 0) {
            statusqry += `&status=${val}`;
          }
          if (i == 1) {
            statusqry += `&status=${val}`;
          }
          statusLotsQuery = status != undefined ? statusqry : '';
        } else {
          if (i == 0) {
            statusqry += `status=${val}`;
          }
          if (i == 1) {
            statusqry += `&status=${val}`;
          }
          statusLotsQuery = status != undefined ? statusqry : '';
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
      if (q != undefined) {
        statusqry += `&status=${status}`;
        statusLotsQuery = status != undefined ? statusqry : '';
      } else {
        statusqry = `status=${status}`;
        statusLotsQuery = status != undefined ? statusqry : '';
      }
    }
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
    let finalquery = {
      filters: FilterQuery,
    };

    const statusPageQuery = status != undefined ? pageUrl : '';
    const searchKeywordsQuery: any = q;
    const keywordsQuery = q != undefined ? `&keyword=${encodeURIComponent(searchKeywordsQuery)}` : '';
    const keywordsQuery1 = q != undefined ? `&q=${encodeURIComponent(searchKeywordsQuery)}` : '';
    const statusQuery = status != undefined ? `&filters=${btoa(JSON.stringify(finalquery))}` : '';
    const lotsQuery = lot != undefined ? `&lot-id=${lot}` : '';
    const pageQuery = page != undefined ? `&page=${page}` : '';
    const baseURL = `/tenders/projects/search?agreement-id=RM1043.8${keywordsQuery}${statusQuery}${lotsQuery}${pageQuery}`;
    const lotsQueryclearUrl = lot != undefined ? `&lot=${lot}` : '';
    const clearFilterURL = `/digital-outcomes-and-specialists/opportunities?${keywordsQuery1}${lotsQueryclearUrl}`;
    const keywordsLotsQuery = q != undefined ? `q=${encodeURIComponent(searchKeywordsQuery)}` : '';
    const AllLotsFilterURL = `/digital-outcomes-and-specialists/opportunities?${keywordsLotsQuery}${statusLotsQuery}`;

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
    const lotsQuerypage = lot != undefined ? `&lot=${lot}` : '';
    let titletxt = 'All lots';
    response_data.searchCriteria.lots.forEach((value: any) => {
      if (value.selected == true) {
        titletxt = value.text;
      }
    });
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
          if (response_data.searchCriteria.lots.length == 1) {
            if (res.id == value.id) {
              value.count = res.count;
            } else if (res.id != value.id) {
              value.count = 0;
            }
          } else {
            if (res.id == value.id) {
              value.count = res.count;
            }
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
      AllLotsFilterURL,
    };
    res.json(display_fetch_data);
  } catch (error) {
    console.log('error', error);
  }
};

export const OPPORTUNITIES_DOWNLOAD = async (req: express.Request, res: express.Response) => {
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
  }
};
