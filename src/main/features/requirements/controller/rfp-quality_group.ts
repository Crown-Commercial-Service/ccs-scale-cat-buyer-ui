//@ts-nocheck
import * as express from 'express';
import * as data from '../../../resources/content/requirements/rfp-quality-groups.json';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';

export const RFP_GET_QUALITY_GROUP = async (req: express.Request, res: express.Response) => {
    const {projectId, eventId} = req.session;
    const {SESSION_ID} = req.cookies;

    const CriteranID = 'Criterion 2';
    const GroupID = 'Group 3';


    try {
        

    const TENDERS_BASEENDPOINT = `/tenders/projects/${projectId}/events/${eventId}/criteria/${CriteranID}/groups/${GroupID}/questions`
    const Response = await TenderApi.Instance(SESSION_ID).get(TENDERS_BASEENDPOINT);
    const ReponseData = Response.data.filter(items => items.OCDS.title !== 'Price');

    const windowAppendData = {
        ...data,
        ReponseData
    }

   // res.json(ReponseData)
    res.render('rfp-quality_group.njk', windowAppendData);


    } catch (error) {

        LoggTracer.errorLogger(
          res,
          error,
          `${req.headers.host}${req.originalUrl}`,
          null,
          TokenDecoder.decoder(SESSION_ID),
          'Journey service - Get failed - CA learn page',
          true,
        );
      }

}


// /rfp/ratio-quality-group

export const RFP_POST_QUALITY_GROUP = async (req: express.Request, res: express.Response) => {
    const Request = req.body;
    const {projectId, eventId} = req.session;
    const {SESSION_ID} = req.cookies;


    const {quality_name_questionID, quality_name} = Request;
    try {
    for(var start =0; start < quality_name_questionID.length; start++){
        const QuestionID =quality_name_questionID[start];
        const value = quality_name[start];
        const answerBaseURL = `/tenders/projects/${projectId}/events/${eventId}/criteria/Criterion 2/groups/Group 3/questions/${QuestionID}`;
        const object_values = {
            "value": value
        }

        const  answerValueBody = {
            nonOCDS: {
              answered: true,
              options: [object_values],
        }}

            await TenderApi.Instance(SESSION_ID).put(answerBaseURL, answerValueBody);
     
    }
    res.redirect('/rfp/ratio-quality-group');

} catch (error) {
    LoggTracer.errorTracer(error, res);
}
}


