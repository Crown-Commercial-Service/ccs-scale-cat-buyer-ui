import * as express from 'express';
import * as cmsData from '../../../resources/content/RFI/review.json';

//@GET /rfi/review
export const GET_RFI_REVIEW  = (req: express.Request, res: express.Response) => {
    const appendData = {
        data: cmsData
    }
res.render('review', appendData)

}




//@POST  /rfi/review


export const POST_RFI_REVIEW  = (req: express.Request, res: express.Response) => {
   
    res.redirect('/rfi/rfi-tasklist')
}