import * as express from 'express';
import * as fileData from '../../../resources/content/digital-outcomes/oppertunities.json';
//import { TenderApi } from '../../../common/util/fetch/tenderService/tenderApiInstance';
import * as sampleJson from '../../../resources/content/digital-outcomes/sampleOpper.json';
import * as procdata from '../../../resources/content/digital-outcomes/procdetails.json';

import moment from 'moment-business-days';

export const GET_OPPORTUNITIES = async (req: express.Request, res: express.Response) => {
  try {
    const { lot, status, q } = req.query;
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

    //   const baseURL = `/tenders/projects/search?agreement-id=RM1043.8${keywordsQuery}${statusQuery}${lotsQuery}`;

    const clearFilterURL = `/digital-outcomes-and-specialists/opportunities?${keywordsQuery}${statusQuery}${lotsQuery}`;
    //const fetch_dynamic_api = await TenderApi.Instance().get(baseURL);
    let response_data = {
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
          subStatus: 'awarded',
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
          subStatus: ' awaiting outcome',
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
          subStatus: ' awarded',
          description:
            'Qualified and certified ISO 27001 Lead auditor to review and measure the VMD IT activity in line with the ISO 27001 standard. Identify gaps and highlight specific actions to assist in transition from 2013 version to the 2022 version of the standard.',
        },
      ],
      searchCriteria: {
        keyword: 'string',
        lots: [
          {
            id: 0,
            text: 'string',
            selected: true,
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
        next: 'string',
        prev: 'string',
        self: 'string',
        last: 'string',
        first: 'string',
      },
    };
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
      NextPageUrl: 'page=2',
      PrvePageUrl: '',
      noOfPages: 1413,
      CurrentPageNumber: 1,
    };

    const display_fetch_data = {
      file_data: fileData,
      search_data: response_data,
      njkDatas,
      clearFilterURL: clearFilterURL,
    };

    res.render('opportunities', display_fetch_data);
  } catch (error) {}
};
export const GET_OPPORTUNITIES_DETAILS = async (req: express.Request, res: express.Response) => {
  try {
    let contextRequirements, contextRequirementsGroups, assessmentCriteria, timeline;

    let fetch_dynamic_api_data = procdata.records[0].compiledRelease.tender.criteria;
    fetch_dynamic_api_data.forEach((value) => {
      if (value.id == 'Criterion 1') {
        timeline = value;
      } else if (value.id == 'Criterion 2') {
        assessmentCriteria = value;
      } else if (value.id == 'Criterion 3') {
        contextRequirements = value;
        contextRequirementsGroups = contextRequirements?.requirementGroups?.sort((a, b) =>
          parseInt(a.id?.replace('Group ', '')) < parseInt(b.id?.replace('Group ', '')) ? -1 : 1
        );
      }
    });

    //console.log('contextRequirementsGroups', contextRequirementsGroups);
    // if(contextRequirements){
    //  ContextGroups =contextRequirements?.requirementGroups
    // }
    // fetch_dynamic_api_data = fetch_dynamic_api_data.sort((a, b) => (a.OCDS.id < b.OCDS.id ? -1 : 1));
    const display_fetch_data = {
      context_data: contextRequirementsGroups,
    };
    console.log(req.params.id);
    res.render('opportunitiesReview', display_fetch_data);
  } catch (error) {}
};

export const GET_OPPORTUNITIES_DETAILS_REVIE_RECOMMENDATION = async (req: express.Request, res: express.Response) => {
  try {
    //tenderers
    const { projectId } = req.query;
    const display_fetch_data = {
      tenderer: sampleJson.records[0].compiledRelease.tender,
      tenderers: sampleJson.records[0].compiledRelease.tender.tenderers,
      parties: sampleJson.records[0].compiledRelease.parties[0],
      awards: sampleJson.records[0].compiledRelease.awards[0],
      awardDate: moment(sampleJson.records[0].compiledRelease.awards[0].date).format('DD/MM/YYYY'),
      projectId: projectId,
    };
    res.render('opportunitiesDetails', display_fetch_data);
  } catch (error) {}
};

export const GET_OPPORTUNITIES_API = async (req: express.Request, res: express.Response) => {
  const { lot, status, q } = req.query;
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
          subStatus: 'awarded',
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
          subStatus: ' awaiting outcome',
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
          subStatus: ' awarded',
          description:
            'Qualified and certified ISO 27001 Lead auditor to review and measure the VMD IT activity in line with the ISO 27001 standard. Identify gaps and highlight specific actions to assist in transition from 2013 version to the 2022 version of the standard.',
        },
      ],
      searchCriteria: {
        keyword: 'string',
        lots: [
          {
            id: 1,
            text: 'Digital Outcomes (3108)',
            selected: true,
          },
          {
            id: 2,
            text: 'Digital Specialists (2239)',
            selected: false,
          },
          {
            id: 3,
            text: 'User Research Participants (118)',
            selected: false,
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
        next: 'string',
        prev: 'string',
        self: 'string',
        last: 'string',
        first: 'string',
      },
    };

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
      NextPageUrl: 'page=2',
      PrvePageUrl: '',
      noOfPages: 1413,
      CurrentPageNumber: 1,
    };
    const display_fetch_data = {
      file_data: fileData,
      search_data: response_data,
      njkDatas,
      clearFilterURL: clearFilterURL,
    };
    res.json(display_fetch_data);

    //res.render('opportunities', display_fetch_data);
  } catch (error) {}
};
