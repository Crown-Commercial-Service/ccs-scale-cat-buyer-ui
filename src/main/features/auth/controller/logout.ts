import * as express from 'express'
const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('logout');

/**
 * 
 * @Rediect 
 * @endpoint '/logout
 * @param req 
 * @param res 
 */
export const LOGOUT = (req : express.Request, res : express.Response)=> {
  req.session.destroy(function(err) {
    logger.info(err);
  })
  res.redirect('/');
}