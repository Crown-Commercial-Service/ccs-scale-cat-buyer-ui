import * as express from 'express';
import * as cmsData from '../../../resources/content/RFI/rfi-response-date.json';

///rfi/response-date
export const GET_RESPONSE_DATE = (req: express.Request, res: express.Response) => {
    const appendData = {
        data: cmsData,
    }


res.render('response-date', appendData)

}


///rfi/response-date

export const POST_RESPONSE_DATE = (req: express.Request, res: express.Response) => {
 
res.redirect('/rfi/review')

}