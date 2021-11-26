import * as express from 'express'
import * as dashboarData from '../../../resources/content/choose-agreement/agreement.json'

/**
 * 
 * @Rediect 
 * @endpoint '/oauth/login
 * @param req 
 * @param res 
 */
export const CHOOSE_AGREEMENT = (req: express.Request, res: express.Response) => {
  const agreement_id = 'RM6263'
  const appendData = { data: dashboarData, agreement_id }
  res.render('agreement', appendData)
}