import * as express from 'express'
//import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';

export const STAND_PERIOD_DECISION_GET = async (req: express.Request, res: express.Response) => {
   // const { SESSION_ID } = req.cookies
   const { projectName,isError } =req.session
   res.locals.agreement_header = req.session.agreement_header;
   
   const supplierName  =  req.session['supplierName'];
   const appendData = { projectName,isError,supplierName };
 
    res.render('standstillPeriodDecision', appendData)
}

//stand-period
export const STAND_PERIOD_DECISION_POST = async (req: express.Request, res: express.Response) => {
    const { SESSION_ID } = req.cookies;
    const {standstill_period_yes, standstill_period_no } =req.body;
    const {  eventId } = req.session;
   // let state = "";

    try {
        if (standstill_period_yes != undefined && standstill_period_yes === 'yes') {
            req.session['status'] = 'Pre-Award'
           // state = "Pre-Award";
           
        }
        else if (standstill_period_no != undefined && standstill_period_no === 'no') {
            req.session['status'] = 'Awarded'
            //res.redirect("/event/management");
           // state = "Awarded";
        }
        else
        {
            req.session["isError"] = true;
            res.redirect("/stand-period");
        }
       
        // const body = {
        //     "suppliers": [
        //         {
        //           "id": "GB-COH-9652035"
        //         }
        //       ]
        //   };

       //const awardURL = `tenders/projects/${projectId}/events/${eventId}/state/${state}/awards`
        // await TenderApi.Instance(SESSION_ID).post(awardURL,body);
       res.redirect('/event/management?id='+eventId);

    } catch (error) {
        LoggTracer.errorLogger(
            res,
            error,
            `${req.headers.host}${req.originalUrl}`,
            null,
            TokenDecoder.decoder(SESSION_ID),
            'Tenders Service Api cannot be connected',
            true,
        );
    }
    
}