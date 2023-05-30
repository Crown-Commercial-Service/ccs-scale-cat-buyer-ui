import * as express from 'express';
import * as Mcf3cmsData from '../../../resources/content/MCF3/eoi/special-terms.json';

/**
 *
 * @Rediect
 * @param req
 * @param res
 *
 *
 */
export const GET_EOI_SPECIAL_TERMS = async (req: express.Request, res: express.Response) => {
  const {
    lotId,
    agreementLotName,
    agreement_id,
    releatedContent,
    errorText,
    emptyspecialtermError,
    emptyExpspecialtermError,
  } = req.session;
  const textAreaerrors = {
    emptyspecialtermError,
    emptyExpspecialtermError,
    errorText,
  };
  req.session['emptyspecialtermError'] = false;
  req.session['emptyExpspecialtermError'] = false;
  req.session['errorText'] = '';
  let forceChangeDataJson = Mcf3cmsData;
  if (agreement_id == 'RM6187') {
    //MCF3
    forceChangeDataJson = Mcf3cmsData;
  }
  const windowAppendData = {
    data: forceChangeDataJson,
    error: textAreaerrors,
    lotId,
    agreementLotName,
    releatedContent,
    agreement_id,
  };

  res.render('specialTerms', windowAppendData);
};

export const POST_EOI_SPECIAL_TERMS = async (req: express.Request, res: express.Response) => {
  const { lotId, agreementLotName, agreement_id, releatedContent } = req.session;
  let forceChangeDataJson = Mcf3cmsData;
  if (agreement_id == 'RM6187') {
    //MCF3
    forceChangeDataJson = Mcf3cmsData;
  }
  const windowAppendData = { data: forceChangeDataJson, lotId, agreementLotName, releatedContent, agreement_id };

  if (req.body.special_term == undefined || req.body.special_term == '') {
    req.session['emptyspecialtermError'] = true;
    req.session['errorText'] = 'Enter the special term or condition';
    res.redirect('/eoi/special-terms');
  } else if (req.body.explain_special_term == undefined || req.body.explain_special_term == '') {
    req.session['emptyExpspecialtermError'] = true;
    req.session['errorText'] = 'Explain the special term or condition';
    res.redirect('/eoi/special-terms');
  } else {
    res.render('specialTerms', windowAppendData);
  }
};
