import * as express from 'express'
import { ObjectModifiers } from '../util/operations/objectremoveEmptyString'
import { LoggTracer } from '@common/logtracer/tracer'
import { TokenDecoder } from '@common/tokendecoder/tokendecoder'
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import * as inboxData from '../../../resources/content/event-management/event-management-next-step.json'

/**
 * 
 * @Rediect 
 * @endpoint /event/next
 * @param req 
 * @param res 
 */
export const EVENT_MANAGEMENT_NEXT_STEP_GET = (req: express.Request, res: express.Response) => {
    const { SESSION_ID } = req.cookies
    try {
        res.locals.agreement_header = req.session.agreement_header

        const classificationData: unknown = { classification: "General Classification" } // this value needs to be taken from API or move it to JSON
        const messageDescription: unknown = "" // this value needs to be taken from API
        const messageSubject = "" // this value needs to be taken from API
        const appendData = { data: inboxData, classificationData, messageSubject, messageDescription, error: req.session['isJaggaerError'], eventType: req.session.eventManagement_eventType, eventId: req.session['eventId'] }
        req.session['isJaggaerError'] = false;
        res.render('eventManagementNextStep', appendData)
    } catch (err) {
        LoggTracer.errorLogger(
            res,
            err,
            `${req.headers.host}${req.originalUrl}`,
            null,
            TokenDecoder.decoder(SESSION_ID),
            'Event management page',
            true,
        );
    }
}

// /event/next
export const POST_EVENT_MANAGEMENT_NEXT_STEP = (req: express.Request, res: express.Response) => {
    const { SESSION_ID } = req.cookies
    const filtered_body_content_removed_event_key = ObjectModifiers._deleteKeyofEntryinObject(
        req.body,
        'choose_event_management_next_step',
    );
    const { event_management_next_step } = filtered_body_content_removed_event_key;
    let redirect_address
    try {
        if (event_management_next_step) {
            switch (event_management_next_step) {
                case 'pre-market':    
                const successPreMar= GetStatus(req);
                if (successPreMar)  
                {
                    redirect_address = "/projects/create-or-choose";
                    res.redirect(redirect_address);
                    break;
                }          
                   else{
                    res.redirect('/404');
                   }

                case 'write-publish':
                    const successWnP= GetStatus(req);
                if (successWnP)  
                {              
                    redirect_address = "/projects/create-or-choose"
                    res.redirect(redirect_address);
                    break;
                }          
                else{
                 res.redirect('/404');
                }
                case 'move-from-cat':
                    const statusMfCat= GetStatus(req);
                    if (statusMfCat)  
                    {                                   
                    if (req.session.eventManagement_eventType == "RFI"){
                        redirect_address = "/rfi/review"
                    } else if(req.session.eventManagement_eventType == "EOI"){
                        redirect_address = "/eoi/review"
                    }
                    res.redirect(redirect_address);
                    break;
                }          
                else{
                 res.redirect('/404');
                }
                case 'close':
                    redirect_address= "#"
                    res.redirect(redirect_address);
                    break;

                case 'decide-later':
                    redirect_address = "/dashboard"
                    res.redirect(redirect_address);
                    break;

                default:
                    res.redirect('/404');
            }
        } else {
            req.session['isJaggaerError'] = true;
            res.redirect('/event/next');
        }

    } catch (err) {
        LoggTracer.errorLogger(
            res,
            err,
            `${req.headers.host}${req.originalUrl}`,
            null,
            TokenDecoder.decoder(SESSION_ID),
            'Event management page',
            true,
        );
    }

}

const GetStatus =async(req: express.Request)=>    
{
    const { SESSION_ID } = req.cookies;
    const projectId=req.session['projectId']
    const body = {
        "id": req.session['eventId'],
        "title": req.session['evetTitle'],
        "eventStage": "tender",
        "status": "complete",
        "eventSupportId": "itt_15298",
        "eventType": req.session.eventManagement_eventType,
        "offline": false,
      };
      let success=false;
      const response =await TenderApi.Instance(SESSION_ID).post(`tenders/projects/${projectId}/events`, body);
     if (response.status==200)
     {
        success=true;
     }
      return success;
}