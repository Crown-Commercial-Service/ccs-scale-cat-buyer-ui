import * as express from 'express'
import * as dashboarData from '../../../resources/content/dashboard/ccs-dashboard.json'

/**
 * 
 * @Rediect 
 * @endpoint '/oauth/login
 * @param req 
 * @param res 
 */
export const DASHBOARD = (req : express.Request, res : express.Response)=> {
  res.cookie('agreement_id', 'RM1043.6', { maxAge: 900000, httpOnly: true });
  var appendData = {data : dashboarData}
  res.render('dashboard', appendData);
}