import * as express from 'express';
import * as fcaShortlistSupplierNextstepScreenContent from '../../../resources/content/fca/shortlist_supplier_nextstep.json';

/**
 *
 * @Rediect
 * @param req
 * @param res
 *
 *
 */
export const SHORTLIST_SUPPLIER_NEXTSTEP = async (req: express.Request, res: express.Response) => {
  const appendData = { data: fcaShortlistSupplierNextstepScreenContent };
  res.render('shortlist_supplier_nextstep', appendData);
};
