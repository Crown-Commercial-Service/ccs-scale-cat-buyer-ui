import * as express from 'express'


/**
 * 
 * @Rediect 
 * @endpoint '/oauth/login
 * @param req 
 * @param res 
 */
export const Receiver = (req : express.Request, res : express.Response)=> {
  res.redirect('/dashboard');
}