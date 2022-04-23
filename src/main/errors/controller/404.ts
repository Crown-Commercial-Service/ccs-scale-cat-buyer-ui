import * as express from 'express'
const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('Not found page (404)');
/**
 * 
 * @Rediect 
 * @endpoint '/oauth/login
 * @param req 
 * @param res 
 */
export const Error_404 = (req : express.Request, res : express.Response)=> {
   logger.info("User landed in 404 page");
   res.render('error/404')
}