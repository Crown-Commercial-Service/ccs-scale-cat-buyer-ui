import * as express from 'express'
// import * as dashboarData from '../../../resources/content/choose-agreement/agreement.json'

/**
 * 
 * @Rediect 
 * @endpoint '/oauth/login
 * @param req 
 * @param res 
 */
export const LOT_BEFORE_START_PAGE = (req: express.Request, res: express.Response) => {
  // var agreement_id = 'RM6263'
  // var appendData = { data: dashboarData, agreement_id }
  // res.render('lot', appendData)
  res.render('lot')
}