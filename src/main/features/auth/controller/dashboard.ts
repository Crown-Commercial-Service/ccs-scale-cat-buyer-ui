import * as express from 'express'


/**
 * 
 * @Rediect 
 * @endpoint '/oauth/login
 * @param req 
 * @param res 
 */
export const DASHBOARD = (req : express.Request, res : express.Response)=> {
  res.render('dashboard');
}