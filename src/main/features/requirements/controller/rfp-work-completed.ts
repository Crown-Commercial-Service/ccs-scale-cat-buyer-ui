//@ts-nocheck
import { TenderApi } from '@common/util/fetch/procurementService/TenderApiInstance';
import * as express from 'express';
import { HttpStatusCode } from 'main/errors/httpStatusCodes';
import * as cmsData from '../../../resources/content/requirements/rfp-get-work-completed.json';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import config from 'config';


export const RFP_GET_WORK_COMPLETED = async (req: express.Request, res: express.Response) => {
    const { SESSION_ID } = req.cookies;
    const {
      lotId,
      agreementLotName,
      agreementName,
      projectId,
      agreement_id,
      releatedContent,
      project_name,
      isError,
      errorText,
      currentEvent,
      choosenViewPath,
      eventId
    } = req.session;

    try {
        const CriterianId = 'Criterion 3'
        const GroupId = 'Group 7';
    
        
        const BaseURL = `/tenders/projects/${projectId}/events/${eventId}/criteria/${CriterianId}/groups/${GroupId}/questions`
        const Response = await TenderApi.Instance(SESSION_ID).get(BaseURL);
        const ocdData = Response.data[0];

        console.log(ocdData)
    
    
        const windowAppendData = {
            data: cmsData,
            releatedContent,
            choosenViewPath,
            response: ocdData
        }
    
        await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/54`, 'In progress');
        res.render('rfp-work-completed.njk', windowAppendData)
    } catch (error) {
        LoggTracer.errorLogger(
            res,
            error,
            `${req.headers.host}${req.originalUrl}`,
            null,
            TokenDecoder.decoder(SESSION_ID),
            'FC- GET - Work completed Error',
            true,
        )
    }

   

}




export const RFP_POST_WORK_COMPLETED = async (req: express.Request, res: express.Response) => {


    try {
        const {completed_text} = req.body;
        const { SESSION_ID } = req.cookies;
        const { 
          projectId,
          eventId
        } = req.session;
        const CriterianId = 'Criterion 3'
        const GroupId = 'Group 7';
        const QuestionID = 'Question 8';
        const BaseURL = `/tenders/projects/${projectId}/events/${eventId}/criteria/${CriterianId}/groups/${GroupId}/questions/${QuestionID}`

        const REQUESTBODY = {
            "nonOCDS": {
                "answered": true,
                "options": [
                    {
                        "value": completed_text
                    }
                ]
            }
        }

        await TenderApi.Instance(SESSION_ID).put(BaseURL, REQUESTBODY);
        await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/54`, 'Completed');
        res.redirect('/rfp/task-list');


    } catch (error) {
        LoggTracer.errorLogger(
          res,
          error,
          `${req.headers.host}${req.originalUrl}`,
          null,
          TokenDecoder.decoder(SESSION_ID),
          'FC - POST - Work completed Error ',
          true,
        );
      }
    


}
