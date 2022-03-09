// @ts-nocheck
import * as express from 'express';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import * as CMSData from '../../../resources/content/requirements/ca-review.json';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { REQUIREMENT_PATHS } from '../model/requirementConstants';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';

/**
 *
 * @param req
 * @param res
 * @GETController
 */
export const CA_GET_review = async (req: express.Request, res: express.Response) => {
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
      designations,
      tableItems,
      dimensions,
    } = req.session;

    const windowAppendData = {
        releatedContent,
        data: CMSData
    }
res.render('ca-review.njk', windowAppendData)

}



/**
 *
 * @param req
 * @param res
 * @POSTController
 */
 export const CA_POST_review = async (req: express.Request, res: express.Response) => {


}

