import * as express from 'express';
import Mcf3cmsData from '../../../resources/content/MCF3/eoi/projectobjective.json';

/**
 *
 * @Rediect
 * @param req
 * @param res
 *
 *
 */
 export const GET_EOI_PROJECT_OBJECTIVE = async (req: express.Request, res: express.Response) => {

  const { lotId, agreementLotName, agreement_id , isEmptytextareaError, releatedContent } = req.session;
  req.session['isEmptytextareaError'] = false;
  let forceChangeDataJson = Mcf3cmsData;
  if(agreement_id == 'RM6187') { //MCF3
    forceChangeDataJson = Mcf3cmsData;
  }

  const windowAppendData = { data: forceChangeDataJson, lotId, error:isEmptytextareaError, agreementLotName, releatedContent, agreement_id };
 
  res.render('projectObjective', windowAppendData);
}

export const POST_EOI_PROJECT_OBJECTIVE = async (req: express.Request, res: express.Response) => {

  //PUT/tenders/projects/{proc-id}/events/{event-id}/criteria/{criterion-id}/groups/{group-id}/questions/{question-id}
  const { lotId, agreementLotName, agreement_id ,releatedContent } = req.session;
  let forceChangeDataJson = Mcf3cmsData;
  if(agreement_id == 'RM6187') { //MCF3
    forceChangeDataJson = Mcf3cmsData;
  }
  const windowAppendData = { data: forceChangeDataJson, lotId, agreementLotName, releatedContent, agreement_id };

  if(req.body.prject_objective == undefined || req.body.prject_objective == ''){
    req.session['isEmptytextareaError'] = true;
    res.redirect('/eoi/project-objective');
  }else{
    res.render('projectObjective', windowAppendData);
  }
}