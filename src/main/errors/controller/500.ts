import * as express from 'express'
/**
 * 
 * @Rediect 
 * @endpoint '/oauth/login
 * @param req 
 * @param res 
 */
export const Error_500 = (req : express.Request, res : express.Response)=> {
   res.render('error/500')
}