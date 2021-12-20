//@ts-nocheck
import * as express from 'express';
import * as cmsData from '../../../resources/content/RFI/review.json';
import {DynamicFrameworkInstance} from '../util/fetch/dyanmicframeworkInstance'
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';



//@GET /rfi/review
export const GET_RFI_REVIEW  = async (req: express.Request, res: express.Response) => {
    const {SESSION_ID} = req.cookies;
    const ProjectID = req.session['projectId'];
    const EventID = req.session['eventId'];
    const BaseURL = `/tenders/projects/${ProjectID}/events/${EventID}`
    try {
        const FetchReviewData = await DynamicFrameworkInstance.Instance(SESSION_ID).get(BaseURL);
        const ReviewData = FetchReviewData.data;
    
        
        //Buyer Questions
        const BuyerQuestions = ReviewData.nonOCDS.buyerQuestions;
        const BuyerAnsweredAnswers = BuyerQuestions.map(buyer => {
            const data = buyer.requirementGroups.map(group=> {
                const OCDS = group.OCDS;
                const nonOCDS = group.nonOCDS;
                nonOCDS.criterian = buyer.id;
                return {"nonOCDS": nonOCDS, "OCDS": OCDS}
            });
            return {"requirement": data}}
        ).flat();


        const appendData = {
            data: cmsData
        }
        res.render('review', appendData)

    } catch (error) {
        console.log('Something went wrong, please review the logit error log for more information');
        delete error?.config?.['headers'];
        const Logmessage = {
          Person_id: TokenDecoder.decoder(SESSION_ID),
          error_location: `${req.headers.host}${req.originalUrl}`,
          sessionId: 'null',
          error_reason: 'Dyanamic framework throws error - Tender Api is causing problem',
          exception: error,
        };
        const Log = new LogMessageFormatter(
          Logmessage.Person_id,
          Logmessage.error_location,
          Logmessage.sessionId,
          Logmessage.error_reason,
          Logmessage.exception,
        );
        LoggTracer.errorTracer(Log, res);
    }
  



}




//@POST  /rfi/review


export const POST_RFI_REVIEW  = (req: express.Request, res: express.Response) => {
   
    res.redirect('/rfi/event-sent')
}