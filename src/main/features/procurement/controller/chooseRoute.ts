//@ts-nocheck
import * as express from 'express'
import * as cmsData from '../../../resources/content/procurement/chooseRoute.json';
import { ObjectModifiers } from '../../eoi/util/operations/objectremoveEmptyString';
import { RFI_PATHS } from 'main/features/rfi/model/rficonstant';
import { EOI_PATHS } from 'main/features/eoi/model/eoiconstant';
const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('choseRoute');

/**
 * 
 * @Rediect 
 * @param req 
 * @param res 
 * 
 * 
 */
export const GET_CHOOSE_ROUTE = (req: express.Request, res: express.Response) => {
  const windowAppendData = { data: cmsData }
  res.render('chooseRoute', windowAppendData);
}


/**
* @POSTController
* @description
* 
*/
//POST 'rfi/type'
/**
* 
* @param req 
* @param res 
* @GETController
*/

export const POST_CHOOSE_ROUTE= (req: express.Request, res: express.Response) => {

   const choose_eoi_type = req.body['choose_eoi_type'][0]
  
  switch (choose_eoi_type) {
     case 'EOI':
        // eslint-disable-next-line no-case-declarations
        const redirect_address = EOI_PATHS.GET_TASKLIST;
        logger.info("EOI Route selected");
        res.redirect(redirect_address);
        break;

     case 'RFI':
        // eslint-disable-next-line no-case-declarations
        const newAddress = RFI_PATHS.GET_TASKLIST;
        logger.info("RFI Route selected");
        res.redirect(newAddress);
        break;

     default: res.redirect('/404');
  }

}