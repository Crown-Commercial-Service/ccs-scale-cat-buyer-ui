import * as express from 'express';
import * as fileData from '../../../resources/content/digital-outcomes/oppertunities.json';
//import * as sampleJson from '../../../resources/content/digital-outcomes/sampleOpper.json';
// import * as procdata from '../../../resources/content/digital-outcomes/procdetails.json';
import { TenderApi } from '../../../common/util/fetch/tenderService/tenderApiInstance';

import { DynamicFrameworkInstance } from 'main/features/event-management/util/fetch/dyanmicframeworkInstance';

export const GET_OPPORTUNITIES = async (req: express.Request, res: express.Response) => {
  try {
    const { lot, status, q, page } = req.query;
    const NoOfRecordsPerPage = 20;
    const usingObjectAssign = Object.assign([], status);
    let statusArray: any = [];
    const FilterQuery: any = [];
    usingObjectAssign.forEach((val, i) => {
      let options = {
        id: i,
        text: val,
        selected: true,
        count: 0,
      };
      statusArray.push(options);
    });
    let querydata = {
      name: 'status',
      options: statusArray,
    };
    FilterQuery.push(querydata);
    let finalquery = {
      filters: FilterQuery,
    };
    const searchKeywordsQuery: any = q;
    const keywordsQuery = q != undefined ? `&keyword=${encodeURIComponent(searchKeywordsQuery)}` : '';
    const statusQuery = status != undefined ? `&filters=${btoa(JSON.stringify(finalquery))}` : '';
    const lotsQuery = lot != undefined ? `&lot-id=${lot}` : '';
    const pageQuery = page != undefined ? `&page=${page}` : '';
    const baseURL = `/tenders/projects/search?agreement-id=RM1043.8${keywordsQuery}${statusQuery}${lotsQuery}${pageQuery}`;
    const clearFilterURL = `/digital-outcomes-and-specialists/opportunities?${keywordsQuery}${statusQuery}${lotsQuery}`;
    const fetch_dynamic_api = await TenderApi.InstanceSupplierQA().get(baseURL);
    let response_data = fetch_dynamic_api?.data;
    // let response_data = {
    //   totalResults: 4,
    //   results: [
    //     {
    //       projectId: 22147,
    //       projectName: 'Security Architect April 2023 - April 2024',
    //       buyerName: 'Department of Work & Pensions',
    //       location: 'North East England',
    //       budgetRange: '1000-5000',
    //       agreement: 'Digital Outcomes',
    //       lot: '3',
    //       status: 'open',
    //       subStatus: 'awaiting outcome',
    //       description:
    //         'Lead, deliver and support the technical and security architecture design elements of DWP Digital projects / initiatives. Own the security product architecture, develop security product roadmaps and represent product designs at governance forums. Provide clear communication of security architecture design and decision making.',
    //     },
    //     {
    //       projectId: 123457,
    //       projectName: 'Dorset ICS Integration and Interoperability Review & Recommendation',
    //       buyerName: 'The NHS providers within the Dorset Integrated Care System (ICS)',
    //       location: 'South West England',
    //       budgetRange: '1000-7000',
    //       agreement: 'Digital Outcomes',
    //       lot: 'Lot 1',
    //       status: 'Closed',
    //       subStatus: 'not-yet-awarded',
    //       description:
    //         'The Objectives of the Engagement are to review the current integration and interoperability landscape within NHS Dorset and propose a target architecture that would be required to realise the strategic digital objectives of the ICS, with a priority focus on the active ICS PAS/EPR programme across DCH, UHD, DHC.',
    //     },
    //     {
    //       projectId: 123458,
    //       projectName: 'VR Dev',
    //       buyerName: 'Department for Work and Pensions',
    //       location: 'Off-site',
    //       budgetRange: '1000-2000',
    //       agreement: 'Digital outcomes',
    //       lot: 'Lot 1',
    //       status: 'Closed',
    //       subStatus: 'awarded',
    //       description: 'VR Dev in Service Now',
    //     },
    //     {
    //       projectId: 123459,
    //       projectName: 'ISO 27001 surveillance audit and gap analysis for the VMD',
    //       buyerName: 'ISO 27001 surveillance audit and gap analysis for the VMD',
    //       location: 'South East England',
    //       budgetRange: '1000-2000',
    //       agreement: 'Digital outcomes',
    //       lot: 'Lot 1',
    //       status: 'Closed',
    //       subStatus: 'before-the-deadline-passes',
    //       description:
    //         'Qualified and certified ISO 27001 Lead auditor to review and measure the VMD IT activity in line with the ISO 27001 standard. Identify gaps and highlight specific actions to assist in transition from 2013 version to the 2022 version of the standard.',
    //     },
    //     {
    //       projectId: 123459,
    //       projectName: 'ISO 27001 surveillance audit and gap analysis for the VMD',
    //       buyerName: 'ISO 27001 surveillance audit and gap analysis for the VMD',
    //       location: 'South East England',
    //       budgetRange: '1000-2000',
    //       agreement: 'Digital outcomes',
    //       lot: 'Lot 1',
    //       status: 'Closed',
    //       subStatus: 'after-the-deadline-passes',
    //       description:
    //         'Qualified and certified ISO 27001 Lead auditor to review and measure the VMD IT activity in line with the ISO 27001 standard. Identify gaps and highlight specific actions to assist in transition from 2013 version to the 2022 version of the standard.',
    //     },
    //   ],
    //   searchCriteria: {
    //     keyword: 'string',
    //     lots: [
    //       {
    //         id: 1,
    //         text: 'Digital outcomes',
    //         selected: true,
    //         count: 3108,
    //       },
    //       {
    //         id: 2,
    //         text: 'Digital specialists',
    //         selected: true,
    //         count: 2239,
    //       },
    //       {
    //         id: 3,
    //         text: 'User research participants',
    //         selected: true,
    //         count: 118,
    //       },
    //     ],
    //     filters: [
    //       {
    //         id: 0,
    //         text: 'Digital specialists',
    //         selected: true,
    //         count: 3108,
    //       },
    //     ],
    //   },
    //   links: {
    //     next: '/tenders/projects/search?agreement-id=RM1043.8&keyword=test&page=2&page-size=20',
    //     prev: '/tenders/projects/search?agreement-id=RM1043.8&keyword=test&page=1&page-size=20',
    //     last: '/tenders/projects/search?agreement-id=RM1043.8&keyword=test&page=2&page-size=20',
    //     self: '/tenders/projects/search?agreement-id=RM1043.8&keyword=test&page=1&page-size=20',

    //     first: '/tenders/projects/search?agreement-id=RM1043.8&keyword=test&page=1&page-size=20',
    //   },
    // };
    // let totalpages =
    //   response_data.totalResults > NoOfRecordsPerPage ? response_data.totalResults / NoOfRecordsPerPage : 1;
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
    let totalpages = response_data.totalResults > NoOfRecordsPerPage ? parseInt(lastPageData) : 1;

    let njkDatas = {
      currentLot: lot,
      lotInfos: {
        lots: [
          { key: 'Digital outcomes', count: 3108, slug: '1', sno: 1 },
          { key: 'Digital specialists', count: 2239, slug: 'digital-specialists', sno: 2 },
          { key: 'User research participants', count: 118, slug: '3', sno: 3 },
        ],
      },
      haveLot: false,
      choosedLot: 'All Categories',
      haveserviceCategory: false,
      NextPageUrl: NextPagedata == undefined ? '' : `page=${parseInt(NextPagedata)}`,
      PrvePageUrl: PrevPagedata == undefined ? '' : `page=${parseInt(PrevPagedata)}`,
      noOfPages: totalpages,
      CurrentPageNumber: parseInt(currentPageData),
      LastPageNumber: parseInt(lastPageData),
      PreviousPageNumber: parseInt(PrevPagedata),
      NextPageNumber: parseInt(NextPagedata),
    };
    const display_fetch_data = {
      file_data: fileData,
      search_data: response_data,
      njkDatas,
      clearFilterURL: clearFilterURL,
      currentLot: lot,
    };
    console.log('currentLot', lot);
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
    let howWillScore: any = [];
    let assessmentquestions: any = [];

    const baseServiceURL: any = `/tenders/projects/${projectId}`;
    const fetch_dynamic_api = await TenderApi.InstanceSupplierQA().get(baseServiceURL);

    // const fetch_dynamic_service_api = await TenderApi.Instance(SESSION_ID).get(baseServiceURL);
    const fetch_dynamic_service_api_data = fetch_dynamic_api?.data;

    let fetch_dynamic_api_data = fetch_dynamic_service_api_data.records[0].compiledRelease.tender.criteria;
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
              if (value.id == 'Group 11') {
                let rowVal = val.pattern[0].tableDefinition ? val.pattern[0].tableDefinition.titles.rows : [];
                let dataVal = val.pattern[0].tableDefinition ? val.pattern[0].tableDefinition.data : [];
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
    };

    res.render('opportunitiesReview', display_fetch_data);
  } catch (error) {
    console.log('error in opportunities', error);
  }
};

export const GET_OPPORTUNITIES_API = async (req: express.Request, res: express.Response) => {
  const { lot, status, q, page } = req.query;
  const NoOfRecordsPerPage = 20;
  try {
    const usingObjectAssign = Object.assign([], status);
    // const reqUrl = req.url;
    let statusArray: any = [];
    const FilterQuery: any = [];

    if (Array.isArray(status)) {
      usingObjectAssign.forEach((val, i) => {
        let options = {
          id: i,
          text: val,
          selected: true,
          count: 2,
        };
        statusArray.push(options);
      });
    } else {
      let options = {
        id: 1,
        text: status,
        selected: true,
        count: 1,
      };
      statusArray.push(options);
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
    let querydata = {
      name: 'status',
      options: statusArray,
    };
    FilterQuery.push(querydata);
    let finalquery = {
      filters: FilterQuery,
    };
    const searchKeywordsQuery: any = q;
    //console.log('filter url', btoa(JSON.stringify(finalquery)));
    const keywordsQuery = q != undefined ? `&keyword=${encodeURIComponent(searchKeywordsQuery)}` : '';
    const statusQuery = status != undefined ? `&filters=${btoa(JSON.stringify(finalquery))}` : '';
    const lotsQuery = lot != undefined ? `&lot-id=${lot}` : '';
    const pageQuery = page != undefined ? `&page=${page}` : '';
    const baseURL = `/tenders/projects/search?agreement-id=RM1043.8${keywordsQuery}${statusQuery}${lotsQuery}${pageQuery}`;
    const clearFilterURL = `/digital-outcomes-and-specialists/opportunities?${keywordsQuery}${statusQuery}${lotsQuery}`;
    const fetch_dynamic_api = await TenderApi.InstanceSupplierQA().get(baseURL);
    let response_data = fetch_dynamic_api?.data;

    // const keywordsQuery = q != undefined ? `&keyword=${encodeURIComponent(searchKeywordsQuery)}` : '';
    // const statusQuery = status != undefined ? `&filters=${JSON.stringify(finalquery)}` : '';
    // const lotsQuery = lot != undefined ? `&lot-id=${lot}` : '';

    // // const baseURL = `/tenders/projects/search?agreement-id=RM1043.8${keywordsQuery}${statusQuery}${lotsQuery}`;
    // const clearFilterURL = `/digital-outcomes-and-specialists/opportunities?${keywordsQuery}${statusQuery}${lotsQuery}`;

    // const response_data = {
    //   totalResults: 4,
    //   results: [
    //     {
    //       projectId: 123456,
    //       projectName: 'Security Architect April 2023 - April 2024',
    //       buyerName: 'Department of Work & Pensions',
    //       location: 'North East England',
    //       budgetRange: '1000-5000',
    //       agreement: 'Digital Outcomes',
    //       lot: 'Lot 1',
    //       status: 'open',
    //       subStatus: 'awaiting outcome',
    //       description:
    //         'Lead, deliver and support the technical and security architecture design elements of DWP Digital projects / initiatives. Own the security product architecture, develop security product roadmaps and represent product designs at governance forums. Provide clear communication of security architecture design and decision making.',
    //     },
    //     {
    //       projectId: 123457,
    //       projectName: 'Dorset ICS Integration and Interoperability Review & Recommendation',
    //       buyerName: 'The NHS providers within the Dorset Integrated Care System (ICS)',
    //       location: 'South West England',
    //       budgetRange: '1000-7000',
    //       agreement: 'Digital Outcomes',
    //       lot: 'Lot 1',
    //       status: 'Closed',
    //       subStatus: 'not-yet-awarded',
    //       description:
    //         'The Objectives of the Engagement are to review the current integration and interoperability landscape within NHS Dorset and propose a target architecture that would be required to realise the strategic digital objectives of the ICS, with a priority focus on the active ICS PAS/EPR programme across DCH, UHD, DHC.',
    //     },
    //     {
    //       projectId: 123458,
    //       projectName: 'VR Dev',
    //       buyerName: 'Department for Work and Pensions',
    //       location: 'Off-site',
    //       budgetRange: '1000-2000',
    //       agreement: 'Digital outcomes',
    //       lot: 'Lot 1',
    //       status: 'Closed',
    //       subStatus: 'awarded',
    //       description: 'VR Dev in Service Now',
    //     },
    //     {
    //       projectId: 123459,
    //       projectName: 'ISO 27001 surveillance audit and gap analysis for the VMD',
    //       buyerName: 'ISO 27001 surveillance audit and gap analysis for the VMD',
    //       location: 'South East England',
    //       budgetRange: '1000-2000',
    //       agreement: 'Digital outcomes',
    //       lot: 'Lot 1',
    //       status: 'Closed',
    //       subStatus: 'before-the-deadline-passes',
    //       description:
    //         'Qualified and certified ISO 27001 Lead auditor to review and measure the VMD IT activity in line with the ISO 27001 standard. Identify gaps and highlight specific actions to assist in transition from 2013 version to the 2022 version of the standard.',
    //     },
    //     {
    //       projectId: 123459,
    //       projectName: 'ISO 27001 surveillance audit and gap analysis for the VMD',
    //       buyerName: 'ISO 27001 surveillance audit and gap analysis for the VMD',
    //       location: 'South East England',
    //       budgetRange: '1000-2000',
    //       agreement: 'Digital outcomes',
    //       lot: 'Lot 1',
    //       status: 'Closed',
    //       subStatus: 'after-the-deadline-passes',
    //       description:
    //         'Qualified and certified ISO 27001 Lead auditor to review and measure the VMD IT activity in line with the ISO 27001 standard. Identify gaps and highlight specific actions to assist in transition from 2013 version to the 2022 version of the standard.',
    //     },
    //   ],
    //   searchCriteria: {
    //     keyword: 'string',
    //     lots: [
    //       {
    //         id: 1,
    //         text: 'Digital Outcomes',
    //         selected: true,
    //         count: 3108,
    //       },
    //       {
    //         id: 2,
    //         text: 'Digital Specialists',
    //         selected: false,
    //         count: 2239,
    //       },
    //       {
    //         id: 3,
    //         text: 'User Research Participants',
    //         selected: false,
    //         count: 118,
    //       },
    //     ],
    //     filters: [
    //       {
    //         id: 0,
    //         text: 'string',
    //         selected: true,
    //       },
    //     ],
    //   },
    //   links: {
    //     next: '/tenders/projects/search?agreement-id=RM1043.8&keyword=test&page=2&page-size=20',
    //     prev: '',
    //     last: '/tenders/projects/search?agreement-id=RM1043.8&keyword=test&page=2&page-size=20',
    //     self: '/tenders/projects/search?agreement-id=RM1043.8&keyword=test&page=1&page-size=20',
    //     first: '/tenders/projects/search?agreement-id=RM1043.8&keyword=test&page=1&page-size=20',
    //   },
    // };

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
    let njkDatas = {
      currentLot: lot,
      lotInfos: {
        lots: [
          { key: 'Digital outcomes', count: 3108, slug: '1', sno: 1 },
          { key: 'Digital specialists', count: 2239, slug: 'digital-specialists', sno: 2 },
          { key: 'User research participants', count: 118, slug: '3', sno: 3 },
        ],
      },
      haveLot: false,
      choosedLot: 'All Categories',
      haveserviceCategory: false,
      NextPageUrl: NextPagedata == undefined ? '' : `page=${parseInt(NextPagedata)}`,
      PrvePageUrl: PrevPagedata == undefined ? '' : `page=${parseInt(PrevPagedata)}`,
      noOfPages: totalpages,
      CurrentPageNumber: parseInt(currentPageData),
      LastPageNumber: parseInt(lastPageData),
      PreviousPageNumber: parseInt(PrevPagedata),
      NextPageNumber: parseInt(NextPagedata),
    };
    const display_fetch_data = {
      file_data: fileData,
      search_data: response_data,
      njkDatas,
      clearFilterURL: clearFilterURL,
      currentLot: lot,
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
      const FileDownloadURL = `/tenders/projects/download`;
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
