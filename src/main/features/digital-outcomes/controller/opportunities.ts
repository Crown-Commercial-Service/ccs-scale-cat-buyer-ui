import * as express from 'express';
import * as fileData from '../../../resources/content/digital-outcomes/oppertunities.json';
import * as sampleJson from '../../../resources/content/digital-outcomes/sampleOpper.json';
import moment from 'moment-business-days';

export const GET_OPPORTUNITIES = async (req: express.Request, res: express.Response) => {
  try {
    const { lot, q } = req.query;
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
    const searchKeywordsQuery: any = q;
    const keywordsQuery = q != undefined ? `&q=${encodeURIComponent(searchKeywordsQuery)}` : '';
    const lotsQuery = lot != undefined ? `&lot=${lot}` : '';
    const clearFilterURL = `/digital-outcomes-and-specialists/opportunities?${keywordsQuery}${lotsQuery}`;
    const display_fetch_data = {
      file_data: fileData,
      njkDatas,
      clearFilterURL: clearFilterURL,
    };

    res.render('opportunities', display_fetch_data);
  } catch (error) {}
};
export const GET_OPPORTUNITIES_DETAILS = async (req: express.Request, res: express.Response) => {
  try {
    console.log(req.params.id);
    res.render('opportunitiesReview');
  } catch (error) {}
};

export const GET_OPPORTUNITIES_DETAILS_REVIE_RECOMMENDATION = async (req: express.Request, res: express.Response) => {
  try {
    //tenderers
    const display_fetch_data = {
      tenderer: sampleJson.records[0].compiledRelease.tender,
      tenderers: sampleJson.records[0].compiledRelease.tender.tenderers,
      parties: sampleJson.records[0].compiledRelease.parties[0],
      awards: sampleJson.records[0].compiledRelease.awards[0],
      awardDate: moment(sampleJson.records[0].compiledRelease.awards[0].date).format('DD/MM/YYYY'),
    };
    res.render('opportunitiesDetails', display_fetch_data);
  } catch (error) {}
};

export const GET_OPPORTUNITIES_API = async (req: express.Request, res: express.Response) => {
  try {
    const display_fetch_data = {
      totalResults: 3,
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
          subStatus: '????',
          description:
            'Lead, deliver and support the technical and security architecture design elements of DWP Digital projects / initiatives. Own the security product architecture, develop security product roadmaps and represent product designs at governance forums. Provide clear communication of security architecture design and decision making.',
        },
        {
          projectId: 123456,
          projectName: '22Security Architect April 2023 - April 2024',
          buyerName: 'Department of Work & Pensions',
          location: 'North East England',
          budgetRange: '2000-5000',
          agreement: 'Digital Outcomes',
          lot: 'Lot 1',
          status: 'open',
          subStatus: '????',
          description:
            'Lead, deliver and support the technical and security architecture design elements of DWP Digital projects / initiatives. Own the security product architecture, develop security product roadmaps and represent product designs at governance forums. Provide clear communication of security architecture design and decision making.',
        },
        {
          projectId: 3333333123456,
          projectName: '33Security Architect April 2023 - April 2024',
          buyerName: 'Department of Work & Pensions',
          location: 'North East England',
          budgetRange: '3000-5000',
          agreement: 'Digital Outcomes',
          lot: 'Lot 1',
          status: 'open',
          subStatus: '????',
          description:
            'Lead, deliver and support the technical and security architecture design elements of DWP Digital projects / initiatives. Own the security product architecture, develop security product roadmaps and represent product designs at governance forums. Provide clear communication of security architecture design and decision making.',
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

    // const display_fetch_data = {
    //   file_data: fileData,
    // };

    res.json(display_fetch_data);

    //res.render('opportunities', display_fetch_data);
  } catch (error) {}
};
