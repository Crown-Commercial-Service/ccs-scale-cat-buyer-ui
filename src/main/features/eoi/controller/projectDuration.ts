import * as express from 'express';

/**
 *
 * @Rediect
 * @param req
 * @param res
 *
 *
 */
 export const GET_EOI_PROJECT_DURATION = async (req: express.Request, res: express.Response) => {
  const { lotId, agreementLotName, agreement_id ,releatedContent } = req.session;
  const windowAppendData = { lotId, agreementLotName, releatedContent, agreement_id };
  res.render('projectDuration',windowAppendData);
}