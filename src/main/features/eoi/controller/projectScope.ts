import * as express from 'express';
import Mcf3cmsData from '../../../resources/content/MCF3/eoi/projectscope.json';

/**
 *
 * @Rediect
 * @param req
 * @param res
 *
 *
 */
export const GET_EOI_PROJECT_SCOPE = async (req: express.Request, res: express.Response) => {
  const { lotId, agreementLotName, agreement_id, isEmptyProjscoptextareaError, releatedContent } = req.session;
  req.session['isEmptyProjscoptextareaError'] = false;
  let forceChangeDataJson = Mcf3cmsData;
  if (agreement_id == 'RM6187') {
    //MCF3
    forceChangeDataJson = Mcf3cmsData;
  }
  const windowAppendData = {
    data: forceChangeDataJson,
    lotId,
    error: isEmptyProjscoptextareaError,
    agreementLotName,
    releatedContent,
    agreement_id,
  };

  res.render('projectScope', windowAppendData);
};

export const POST_EOI_PROJECT_SCOPE = async (req: express.Request, res: express.Response) => {
  const { lotId, agreementLotName, agreement_id, releatedContent } = req.session;
  let forceChangeDataJson = Mcf3cmsData;
  if (agreement_id == 'RM6187') {
    //MCF3
    forceChangeDataJson = Mcf3cmsData;
  }
  const windowAppendData = { data: forceChangeDataJson, lotId, agreementLotName, releatedContent, agreement_id };

  if (req.body.prject_scope == undefined || req.body.prject_scope == '') {
    req.session['isEmptyProjscoptextareaError'] = true;
    res.redirect('/eoi/project-scope');
  } else {
    res.render('projectScope', windowAppendData);
  }
};
