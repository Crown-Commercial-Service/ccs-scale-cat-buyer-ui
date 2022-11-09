import * as express from 'express';
import * as fcaServicesScreenContent from '../../../resources/content/fca/service.json';

/**
 *
 * @Rediect
 * @param req
 * @param res
 *
 *
 */
 export const SELECTED_SERVICES = async (req: express.Request, res: express.Response) => {
    res.render('fca_services', { data: fcaServicesScreenContent });
 }
