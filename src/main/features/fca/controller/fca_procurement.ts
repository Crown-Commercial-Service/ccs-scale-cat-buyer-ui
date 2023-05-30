//@ts-nocheck
import * as express from 'express';
import * as fcaProcurementOverviewScreenContent from '../../../resources/content/fca/fca_procurement.json';

/**
 *
 * @Rediect
 * @param req
 * @param res
 *
 *
 */
export const FCA_PROCUREMENT = async (req: express.Request, res: express.Response) => {
  res.render('fca_procurement', { data: fcaProcurementOverviewScreenContent });
};
