import * as express from 'express'
import * as data from '../../../resources/content/procurement/ccs-procurement.json'

/**
 * 
 * @Rediect 
 * @endpoint '/oauth/login
 * @param req 
 * @param res 
 */
export const PROCUREMENT = (req : express.Request, res : express.Response)=> {
  var appendData = { data }
  res.render('template', appendData);
}