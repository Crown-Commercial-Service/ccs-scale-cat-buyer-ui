//@ts-nocheck
import * as express from 'express';
import * as cmsData from '../../../resources/content/RFI/review.json';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance'
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance'
import {HttpStatusCode} from '../../../errors/httpStatusCodes'
import {RFI_REVIEW_HELPER} from '../helpers/review'
//@GET /rfi/review



export const GET_RFI_REVIEW = async (req: express.Request, res: express.Response) => {
    RFI_REVIEW_HELPER(req, res, false);
}




//@POST  /rfi/review


export const POST_RFI_REVIEW  = async (req: express.Request, res: express.Response) => {

    const {rfi_publish_confirmation, finished_pre_engage} =req.body;
    const ProjectID = req.session['projectId'];
    const EventID = req.session['eventId'];
    const BASEURL = `/tenders/projects/${ProjectID}/events/${EventID}/publish`;
    const {SESSION_ID} = req.cookies;
    let CurrentTimeStamp = req.session.endDate;
    CurrentTimeStamp = new Date(CurrentTimeStamp.split("*")[1]).toISOString();
    console.log(CurrentTimeStamp)

    const _bodyData = {
        "endDate": CurrentTimeStamp
    }

    if(finished_pre_engage && rfi_publish_confirmation === '1'){
        try {
            await TenderApi.Instance(SESSION_ID).put(BASEURL, _bodyData );          
            const response = await TenderApi.Instance(SESSION_ID).put(`journeys/${EventId}/steps/2`, 'Completed');
            if (response.status == HttpStatusCode.OK) {
                await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/15`, 'Completed');
            }
           
            res.redirect('/rfi/event-sent')

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
    else{
        RFI_REVIEW_HELPER(req, res, true);
    }
   
   
}