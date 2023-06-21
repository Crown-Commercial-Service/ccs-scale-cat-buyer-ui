import * as express from 'express';
import * as fileData from '../../../resources/content/digital-outcomes/oppertunities.json';

export const GET_OPPORTUNITIES = async (req: express.Request, res: express.Response) => {
  try {
    const display_fetch_data = {
      file_data: fileData,
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
