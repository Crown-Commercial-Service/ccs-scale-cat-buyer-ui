import * as express from 'express';
import * as Mcf3cmsData from '../../../resources/content/MCF3/eoi/existing-supplier.json';

/**
 *
 * @Rediect
 * @param req
 * @param res
 *
 *
 */
export const GET_EOI_EXISTING_SUPPLIER = async (req: express.Request, res: express.Response) => {
  const { lotId, agreementLotName, agreement_id, releatedContent } = req.session;
  const { isEmptyExistingSuppliersError } = req.session;
  req.session['isEmptyExistingSuppliersError'] = false;
  let forceChangeDataJson = Mcf3cmsData;
  if (agreement_id == 'RM6187') {
    //MCF3
    forceChangeDataJson = Mcf3cmsData;
  }
  const windowAppendData = {
    data: forceChangeDataJson,
    error: isEmptyExistingSuppliersError,
    lotId,
    agreementLotName,
    releatedContent,
    agreement_id,
  };

  res.render('existingSupplier', windowAppendData);
};

export const POST_EOI_EXISTING_SUPPLIER = async (req: express.Request, res: express.Response) => {
  const { lotId, agreementLotName, agreement_id, releatedContent } = req.session;
  const existingSupplier = req.body;
  if (existingSupplier.existing_supplier) {
    let forceChangeDataJson = Mcf3cmsData;
    if (agreement_id == 'RM6187') {
      //MCF3
      forceChangeDataJson = Mcf3cmsData;
    }
    const windowAppendData = { data: forceChangeDataJson, lotId, agreementLotName, releatedContent, agreement_id };
    res.render('existingSupplier', windowAppendData);
  } else {
    req.session['isEmptyExistingSuppliersError'] = true;
    res.redirect('/eoi/existing-supplier');
  }
};
