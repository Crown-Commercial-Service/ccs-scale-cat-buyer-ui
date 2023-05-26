import * as express from 'express';
import * as fcaSupplierScreenContent from '../../../resources/content/fca/supplier.json';

/**
 *
 * @Rediect
 * @param req
 * @param res
 *
 *
 */
export const SUPPLIERS = async (req: express.Request, res: express.Response) => {
  //axios
  const resultSet: any[] = [];
  const appendData = { data: fcaSupplierScreenContent, result: resultSet };
  res.render('fca_supplier', appendData);
};
