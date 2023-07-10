import * as express from 'express';
import * as fileData from '../../../resources/content/digital-outcomes/oppertunities.json';
//import * as sampleJson from '../../../resources/content/digital-outcomes/sampleOpper.json';
//import * as procdata from '../../../resources/content/digital-outcomes/procdetails.json';
import { TenderApi } from '../../../common/util/fetch/tenderService/tenderApiInstance';
import * as inboxData from '../../../resources/content/event-management/qa.json';

import moment from 'moment-business-days';

export const GET_OPPORTUNITIES = async (req: express.Request, res: express.Response) => {
  try {
    const { lot, status, q } = req.query;
    const NoOfRecordsPerPage = 2;
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
    const statusQuery = status != undefined ? `&filters=${JSON.stringify(finalquery)}` : '';
    const lotsQuery = lot != undefined ? `&lot-id=${lot}` : '';

    //const baseURL = `/tenders/projects/search?agreement-id=RM1043.8${keywordsQuery}${statusQuery}${lotsQuery}`;

    const clearFilterURL = `/digital-outcomes-and-specialists/opportunities?${keywordsQuery}${statusQuery}${lotsQuery}`;
    //const fetch_dynamic_api = await TenderApi.InstanceSupplierQA().get(baseURL);
    let response_data = {
      totalResults: 4,
      results: [
        {
          projectId: 22111,
          projectName: 'Security Architect April 2023 - April 2024',
          buyerName: 'Department of Work & Pensions',
          location: 'North East England',
          budgetRange: '1000-5000',
          agreement: 'Digital Outcomes',
          lot: 'Lot 3',
          status: 'open',
          subStatus: 'awaiting outcome',
          description:
            'Lead, deliver and support the technical and security architecture design elements of DWP Digital projects / initiatives. Own the security product architecture, develop security product roadmaps and represent product designs at governance forums. Provide clear communication of security architecture design and decision making.',
        },
        {
          projectId: 22133,
          projectName: 'Dorset ICS Integration and Interoperability Review & Recommendation',
          buyerName: 'The NHS providers within the Dorset Integrated Care System (ICS)',
          location: 'South West England',
          budgetRange: '1000-7000',
          agreement: 'Digital Outcomes',
          lot: 'Lot 1',
          status: 'Closed',
          subStatus: 'not-yet-awarded',
          description:
            'The Objectives of the Engagement are to review the current integration and interoperability landscape within NHS Dorset and propose a target architecture that would be required to realise the strategic digital objectives of the ICS, with a priority focus on the active ICS PAS/EPR programme across DCH, UHD, DHC.',
        },
        {
          projectId: 21955,
          projectName: 'VR Dev',
          buyerName: 'Department for Work and Pensions',
          location: 'Off-site',
          budgetRange: '1000-2000',
          agreement: 'Digital outcomes',
          lot: 'Lot 1',
          status: 'Closed',
          subStatus: 'awarded',
          description: 'VR Dev in Service Now',
        },
        {
          projectId: 22124,
          projectName: 'ISO 27001 surveillance audit and gap analysis for the VMD',
          buyerName: 'ISO 27001 surveillance audit and gap analysis for the VMD',
          location: 'South East England',
          budgetRange: '1000-2000',
          agreement: 'Digital outcomes',
          lot: 'Lot 1',
          status: 'Closed',
          subStatus: 'before-the-deadline-passes',
          description:
            'Qualified and certified ISO 27001 Lead auditor to review and measure the VMD IT activity in line with the ISO 27001 standard. Identify gaps and highlight specific actions to assist in transition from 2013 version to the 2022 version of the standard.',
        },
        {
          projectId: 22111,
          projectName: 'ISO 27001 surveillance audit and gap analysis for the VMD',
          buyerName: 'ISO 27001 surveillance audit and gap analysis for the VMD',
          location: 'South East England',
          budgetRange: '1000-2000',
          agreement: 'Digital outcomes',
          lot: 'Lot 1',
          status: 'Closed',
          subStatus: 'after-the-deadline-passes',
          description:
            'Qualified and certified ISO 27001 Lead auditor to review and measure the VMD IT activity in line with the ISO 27001 standard. Identify gaps and highlight specific actions to assist in transition from 2013 version to the 2022 version of the standard.',
        },
        {
          projectId: 21737,
          projectName: 'AWARDS',
          buyerName: 'ISO 27001 surveillance audit and gap analysis for the VMD',
          location: 'South East England',
          budgetRange: '1000-2000',
          agreement: 'Digital outcomes',
          lot: 'Lot 1',
          status: 'Closed',
          subStatus: 'awarded',
          description:
            'Qualified and certified ISO 27001 Lead auditor to review and measure the VMD IT activity in line with the ISO 27001 standard. Identify gaps and highlight specific actions to assist in transition from 2013 version to the 2022 version of the standard.',
        },
      ],
      searchCriteria: {
        keyword: 'string',
        lots: [
          {
            id: 1,
            text: 'Digital outcomes',
            selected: true,
            count: 3108,
          },
          {
            id: 2,
            text: 'Digital specialists',
            selected: true,
            count: 2239,
          },
          {
            id: 3,
            text: 'User research participants',
            selected: true,
            count: 118,
          },
        ],
        filters: [
          {
            id: 0,
            text: 'Digital specialists',
            selected: true,
            count: 3108,
          },
        ],
      },
      links: {
        next: '/tenders/projects/search?agreement-id=RM1043.8&keyword=test&page=2&page-size=20',
        prev: '/tenders/projects/search?agreement-id=RM1043.8&keyword=test&page=1&page-size=20',
        last: '/tenders/projects/search?agreement-id=RM1043.8&keyword=test&page=2&page-size=20',
        self: '/tenders/projects/search?agreement-id=RM1043.8&keyword=test&page=1&page-size=20',

        first: '/tenders/projects/search?agreement-id=RM1043.8&keyword=test&page=1&page-size=20',
      },
    };
    let totalpages =
      response_data.totalResults > NoOfRecordsPerPage ? response_data.totalResults / NoOfRecordsPerPage : 1;
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

    let njkDatas = {
      currentLot: lot,
      lotInfos: {
        lots: [
          { key: 'Digital outcomes', count: 3108, slug: 'digital-outcomes', sno: 1 },
          { key: 'Digital specialists', count: 2239, slug: 'digital-specialists', sno: 2 },
          { key: 'User research participants', count: 118, slug: 'User-research-participants', sno: 3 },
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
    };
    const display_fetch_data = {
      file_data: fileData,
      search_data: response_data,
      njkDatas,
      clearFilterURL: clearFilterURL,
      currentLot: lot,
    };
    res.render('opportunities', display_fetch_data);
  } catch (error) {}
};
export const GET_OPPORTUNITIES_DETAILS = async (req: express.Request, res: express.Response) => {
  const { projectId, lot } = req.query;
  try {
    let contextRequirements, contextRequirementsGroups, assessmentCriteria, assessmentCriteriaGroups, timeline;
    const baseServiceURL: any = `/tenders/projects/${projectId}`;
    const fetch_dynamic_api = await TenderApi.InstanceSupplierQA().get(baseServiceURL);

    // const fetch_dynamic_service_api = await TenderApi.Instance(SESSION_ID).get(baseServiceURL);
    const fetch_dynamic_service_api_data = fetch_dynamic_api?.data;

    let fetch_dynamic_api_data = fetch_dynamic_service_api_data.records[0].compiledRelease.tender.criteria;
    fetch_dynamic_api_data.forEach((value: any) => {
      if (value.id == 'Criterion 1') {
        timeline = value;
      } else if (value.id == 'Criterion 2') {
        assessmentCriteria = value;

        assessmentCriteriaGroups = assessmentCriteria?.requirementGroups?.sort((a: any, b: any) =>
          parseInt(a.id?.replace('Group ', '')) < parseInt(b.id?.replace('Group ', '')) ? -1 : 1
        );
        assessmentCriteriaGroups.map((value: any) => {
          value.requirements.forEach((val: any) => {
            if (val['pattern']) {
              console.log('val', val);
              val.pattern = val.pattern ? JSON.parse(val.pattern) : [];
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
      currentLot: lot,
    };

    res.render('opportunitiesReview', display_fetch_data);
  } catch (error) {
    console.log('error in opportunities', error);
  }
};

export const GET_OPPORTUNITIES_DETAILS_REVIE_RECOMMENDATION = async (req: express.Request, res: express.Response) => {
  try {
    const { projectId, status, subStatus, lot } = req.query;

    //const eventTypeURL = 'https://dev-ccs-scale-cat-service.london.cloudapps.digital/tenders/projects/21737';
    //let projectIds = '22111';
    //let projectIds = '21737';

    const eventTypeURL = `/tenders/projects/${projectId}`;

    let getOppertunitiesData = await TenderApi.InstanceSupplierQA().get(eventTypeURL);
    let getOppertunities = getOppertunitiesData?.data;
    let awards: any = '';
    let awardDate = '';
    let awardsupplierId = '';
    let part;
    let award_matched_selector = [];
    if (getOppertunities.records[0].compiledRelease?.awards) {
      awards = getOppertunities.records[0].compiledRelease?.awards[0];
      awardDate = moment(getOppertunities.records[0].compiledRelease?.awards[0]?.date).format('DD/MM/YYYY');
      awardsupplierId = awards.suppliers[0].id;
      part = getOppertunities.records[0].compiledRelease.parties;
      //GB-COH-02299747

      award_matched_selector = part?.filter((agroupitem: any) => {
        //console.log('agroupitem?.id', agroupitem?.id);
        return agroupitem?.id === awardsupplierId;
      });

      award_matched_selector = award_matched_selector[0];
    }

    let bids = getOppertunities.records[0].compiledRelease.bids;

    let supplierSummeryCount = bids.map((item: any) => {
      let result: any[] = [];
      //   const newItem = item;
      item.statistics.map((sta: any) => {
        let measure = sta.measure;
        let value = sta.value;
        result[measure] = value;
      });
      return result;
    });

    const display_fetch_data = {
      buyer: getOppertunities.records[0].compiledRelease.buyer,
      tenderer: getOppertunities.records[0].compiledRelease.tender,
      tenderers: getOppertunities.records[0].compiledRelease.tender.tenderers,
      //parties: getOppertunities.records[0].compiledRelease.parties[0],
      parties: award_matched_selector,

      awards: awards,
      awardDate: awardDate,
      //endDate: moment(getOppertunities.records[0].compiledRelease.tenderPeriod.endDate).format('dddd DD MMMM YYYY'),
      endDate: moment(getOppertunities.records[0].compiledRelease.tender.tenderPeriod.endDate).format(
        'dddd DD MMMM YYYY'
      ),
      supplierSummeryCount: supplierSummeryCount,
      suppliersResponded: supplierSummeryCount[0]['suppliersResponded'],
      suppliersNotResponded: supplierSummeryCount[0]['suppliersNotResponded'],
      ocid: getOppertunities.records[0].compiledRelease.ocid,
      projectId: projectId,
      status: status,
      subStatus: subStatus,
      currentLot: lot,
    };

    res.render('opportunitiesDetails', display_fetch_data);
  } catch (error) {}
};

export const GET_OPPORTUNITIES_QA = async (req: express.Request, res: express.Response) => {
  let appendData: any;
  let eventIds: any;
  let projectIds: any;
  let isSupplierQA = false;
  let projectId;

  try {
    if (req.query.id != undefined) {
      eventIds = req.query.id;
      projectIds = req.query.prId;
      isSupplierQA = true;
      projectId = req.query.prId;
    } else {
      eventIds = req.session.eventId;
      projectIds = req.session.projectId;
      projectId = req.session.projectId;
      isSupplierQA = false;
      res.locals.agreement_header = req.session.agreement_header;
    }

    //const baseURL = `/tenders/supplier/projects/${projectIds}/events/${eventIds}/q-and-a`;
    //const fetchData = await TenderApi.InstanceSupplierQA().get(baseURL);
    const data = inboxData;

    const eventTypeURL = `/tenders/projects/${projectIds}`;

    let getOppertunitiesData = await TenderApi.InstanceSupplierQA().get(eventTypeURL);
    let getOppertunities = getOppertunitiesData?.data;

    appendData = {
      tender: getOppertunities.records[0].compiledRelease.tender,
      lot: getOppertunities.records[0].compiledRelease.tender.lots[0].id,
      data,
      projectId: projectId,
      //QAs: fetchData.data.QandA.length > 0 ? fetchData.data.QandA : [],
      QAs:
        getOppertunities.records[0].compiledRelease.tender.enquiries.length > 0
          ? getOppertunities.records[0].compiledRelease.tender.enquiries
          : [],

      eventId: eventIds,
      eventType: req.session.eventManagement_eventType,
      //  eventName: projectName,
      isSupplierQA,
    };

    res.render('viewQAList', appendData);
  } catch (error) {
    if (error.response.status === 401) {
      res.redirect('/401');
    } else if (error.response.status === 404) {
      res.redirect('/401');
    } else {
      console.log('error ***************');
      console.log(error);
      res.redirect('/401');
    }
  }
};

export const GET_OPPORTUNITIES_API = async (req: express.Request, res: express.Response) => {
  const { lot, status, q } = req.query;
  const NoOfRecordsPerPage = 2;
  const usingObjectAssign = Object.assign([], status);
  // const reqUrl = req.url;
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
  const statusQuery = status != undefined ? `&filters=${JSON.stringify(finalquery)}` : '';
  const lotsQuery = lot != undefined ? `&lot-id=${lot}` : '';

  // const baseURL = `/tenders/projects/search?agreement-id=RM1043.8${keywordsQuery}${statusQuery}${lotsQuery}`;
  const clearFilterURL = `/digital-outcomes-and-specialists/opportunities?${keywordsQuery}${statusQuery}${lotsQuery}`;
  try {
    const response_data = {
      totalResults: 4,
      results: [
        {
          projectId: 123456,
          projectName: 'Security Architect April 2023 - April 2024',
          buyerName: 'Department of Work & Pensions',
          location: 'North East England',
          budgetRange: '1000-5000',
          agreement: 'Digital Outcomes',
          lot: 'Lot 1',
          status: 'open',
          subStatus: 'awaiting outcome',
          description:
            'Lead, deliver and support the technical and security architecture design elements of DWP Digital projects / initiatives. Own the security product architecture, develop security product roadmaps and represent product designs at governance forums. Provide clear communication of security architecture design and decision making.',
        },
        {
          projectId: 123457,
          projectName: 'Dorset ICS Integration and Interoperability Review & Recommendation',
          buyerName: 'The NHS providers within the Dorset Integrated Care System (ICS)',
          location: 'South West England',
          budgetRange: '1000-7000',
          agreement: 'Digital Outcomes',
          lot: 'Lot 1',
          status: 'Closed',
          subStatus: 'not-yet-awarded',
          description:
            'The Objectives of the Engagement are to review the current integration and interoperability landscape within NHS Dorset and propose a target architecture that would be required to realise the strategic digital objectives of the ICS, with a priority focus on the active ICS PAS/EPR programme across DCH, UHD, DHC.',
        },
        {
          projectId: 123458,
          projectName: 'VR Dev',
          buyerName: 'Department for Work and Pensions',
          location: 'Off-site',
          budgetRange: '1000-2000',
          agreement: 'Digital outcomes',
          lot: 'Lot 1',
          status: 'Closed',
          subStatus: 'awarded',
          description: 'VR Dev in Service Now',
        },
        {
          projectId: 123459,
          projectName: 'ISO 27001 surveillance audit and gap analysis for the VMD',
          buyerName: 'ISO 27001 surveillance audit and gap analysis for the VMD',
          location: 'South East England',
          budgetRange: '1000-2000',
          agreement: 'Digital outcomes',
          lot: 'Lot 1',
          status: 'Closed',
          subStatus: 'before-the-deadline-passes',
          description:
            'Qualified and certified ISO 27001 Lead auditor to review and measure the VMD IT activity in line with the ISO 27001 standard. Identify gaps and highlight specific actions to assist in transition from 2013 version to the 2022 version of the standard.',
        },
        {
          projectId: 123459,
          projectName: 'ISO 27001 surveillance audit and gap analysis for the VMD',
          buyerName: 'ISO 27001 surveillance audit and gap analysis for the VMD',
          location: 'South East England',
          budgetRange: '1000-2000',
          agreement: 'Digital outcomes',
          lot: 'Lot 1',
          status: 'Closed',
          subStatus: 'after-the-deadline-passes',
          description:
            'Qualified and certified ISO 27001 Lead auditor to review and measure the VMD IT activity in line with the ISO 27001 standard. Identify gaps and highlight specific actions to assist in transition from 2013 version to the 2022 version of the standard.',
        },
      ],
      searchCriteria: {
        keyword: 'string',
        lots: [
          {
            id: 1,
            text: 'Digital Outcomes',
            selected: true,
            count: 3108,
          },
          {
            id: 2,
            text: 'Digital Specialists',
            selected: false,
            count: 2239,
          },
          {
            id: 3,
            text: 'User Research Participants',
            selected: false,
            count: 118,
          },
        ],
        filters: [
          {
            id: 0,
            text: 'string',
            selected: true,
          },
        ],
      },
      links: {
        next: '/tenders/projects/search?agreement-id=RM1043.8&keyword=test&page=2&page-size=20',
        prev: '',
        last: '/tenders/projects/search?agreement-id=RM1043.8&keyword=test&page=2&page-size=20',
        self: '/tenders/projects/search?agreement-id=RM1043.8&keyword=test&page=1&page-size=20',
        first: '/tenders/projects/search?agreement-id=RM1043.8&keyword=test&page=1&page-size=20',
      },
    };

    let totalpages =
      response_data.totalResults > NoOfRecordsPerPage ? response_data.totalResults / NoOfRecordsPerPage : 1;
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

    let njkDatas = {
      currentLot: lot,
      lotInfos: {
        lots: [
          { key: 'Digital outcomes', count: 3108, slug: 'digital-outcomes', sno: 1 },
          { key: 'Digital specialists', count: 2239, slug: 'digital-specialists', sno: 2 },
          { key: 'User research participants', count: 118, slug: 'User-research-participants', sno: 3 },
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
  } catch (error) {}
};
