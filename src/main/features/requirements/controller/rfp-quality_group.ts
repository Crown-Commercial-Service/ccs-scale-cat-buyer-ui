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
    const Reponse = await TenderApi.Instance(SESSION_ID).get(TENDERS_BASEENDPOINT);

    const windowAppendData = {
        ...data
    }

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



export const RFP_POST_QUALITY_GROUP = async (req: express.Request, res: express.Response) => {

    res.json({msg: 'working all good'})
}


