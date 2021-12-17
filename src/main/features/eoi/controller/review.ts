import * as express from 'express';
import * as reviewData from '../../../resources/content/eoi/review.json';

//@GET /eoi/review
export const GET_EOI_REVIEW = (req: express.Request, res: express.Response) => {
  const appendData = {
    data: reviewData,
  };
  res.render('reviewEoi', appendData);
};

//@POST  /eoi/review
export const POST_EOI_REVIEW = (req: express.Request, res: express.Response) => {
  res.redirect('/eoi/event-sent');
};
