import * as express from 'express';
import * as fileData from '../../../resources/content/digital-outcomes/oppertunities.json';

export const GET_OPPORTUNITIES = async (req: express.Request, res: express.Response) => {
  try {
    const { lot } = req.query;
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
      njkDatas,
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

export const GET_OPPORTUNITIES_API = async (req: express.Request, res: express.Response) => {
  try {
    const display_fetch_data = {
      file_data: fileData,
    };

    res.json(display_fetch_data);

    //res.render('opportunities', display_fetch_data);
  } catch (error) {}
};
