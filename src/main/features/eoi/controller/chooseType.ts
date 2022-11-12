import * as express from 'express';
import Mcf3cmsData from '../../../resources/content/MCF3/eoi/choose-type.json';

/**
 *
 * @Rediect
 * @param req
 * @param res
 *
 *
 */
export const GET_EOI_CHOOSE_TYPE = async (req: express.Request, res: express.Response) => {
  const { lotId, agreementLotName, agreement_id ,releatedContent } = req.session;
  const { isEmptyChooseTypeError } = req.session;
  req.session['isEmptyChooseTypeError'] = false;
  let forceChangeDataJson = Mcf3cmsData;
  if(agreement_id == 'RM6187') { //MCF3
    forceChangeDataJson = Mcf3cmsData;
  }
  const windowAppendData = { data: forceChangeDataJson,error: isEmptyChooseTypeError, lotId, agreementLotName, releatedContent, agreement_id };
   res.render('chooseType',windowAppendData);
}

export const POST_EOI_CHOOSE_TYPE = async (req: express.Request, res: express.Response) => {

  const { lotId, agreementLotName, agreement_id ,releatedContent } = req.session;
  let forceChangeDataJson = Mcf3cmsData;
  if(agreement_id == 'RM6187') { //MCF3
    forceChangeDataJson = Mcf3cmsData;
  }
  const  chooseType = req.body;
  if(chooseType.choose_type){
    const windowAppendData = { data: forceChangeDataJson, lotId, agreementLotName, releatedContent, agreement_id };
 
    res.render('chooseType', windowAppendData);
  }else{
    req.session['isEmptyChooseTypeError'] = true;
    res.redirect('/eoi/choose-type');
  }
  
  
}