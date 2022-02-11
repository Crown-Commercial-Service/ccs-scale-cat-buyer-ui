import * as express from 'express'
import * as dashboarData from '../../../resources/content/dashboard/ccs-dashboard.json'

/**
 * 
 * @Rediect 
 * @endpoint '/oauth/login
 * @param req 
 * @param res 
 */
export const DASHBOARD = (req: express.Request, res: express.Response) => {
  const appendData = { data: dashboarData, events: req.session.openProjectActiveEvents }
  res.render('dashboard', appendData);
}