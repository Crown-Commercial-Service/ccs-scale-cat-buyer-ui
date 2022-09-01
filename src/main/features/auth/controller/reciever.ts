import * as express from 'express'


/**
 * 
 * @Rediect 
 * @endpoint '/oauth/login
 * @param req 
 * @param res 
 */
export const Receiver = (req : express.Request, res : express.Response)=> {
  const {url}=req;
  if (url.indexOf("?projectId")==1) {
    
  }
  res.redirect('/dashboard');
}