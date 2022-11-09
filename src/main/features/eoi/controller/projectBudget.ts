import * as express from 'express';
import * as Mcf3cmsData from  '../../../resources/content/MCF3/eoi/project-budjet.json';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
/**
 *
 * @Rediect
 * @param req
 * @param res
 *
 *
 */
 export const GET_EOI_PROJECT_BUDGET = async (req: express.Request, res: express.Response) => {
  const { lotId, agreementLotName, agreement_id ,releatedContent } = req.session;
  const { SESSION_ID } = req.cookies;
  try {
  let forceChangeDataJson = Mcf3cmsData;
  if(agreement_id == 'RM6187') { //MCF3
    forceChangeDataJson = Mcf3cmsData;
  }
  const windowAppendData = { data: forceChangeDataJson, lotId, agreementLotName, releatedContent, agreement_id };
  res.render('projectBudget',windowAppendData);
}catch (error){
  LoggTracer.errorLogger(
    res,
    error,
    `${req.headers.host}${req.originalUrl}`,
    null,
    TokenDecoder.decoder(SESSION_ID),
    'EOI - Tenders Service Api cannot be connected',
    true,
  );
}
}