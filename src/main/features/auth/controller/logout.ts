import * as express from 'express'


/**
 * 
 * @Rediect 
 * @endpoint '/logout
 * @param req 
 * @param res 
 */
export const LOGOUT = (req : express.Request, res : express.Response)=> {
  res.render('logout');
}