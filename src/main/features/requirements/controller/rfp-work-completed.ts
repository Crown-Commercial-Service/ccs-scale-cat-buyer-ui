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
      choosenViewPath
    } = req.session;


    const windowAppendData = {
        data: cmsData,
        releatedContent,
        choosenViewPath
    }


    res.render('rfp-work-completed.njk', windowAppendData)

}




export const RFP_POST_WORK_COMPLETED = async (req: express.Request, res: express.Response) => {
    const {completed_text} = req.body;
    console.log(completed_text)

}
