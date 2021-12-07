//@ts-nocheck
import * as express from 'express';
import * as cmsData from '../../../resources/content/eoi/eoiType.json';
import { ObjectModifiers } from '../util/operations/objectremoveEmptyString';
import { EOI_PATHS } from '../model/eoiconstant';

// eoi TaskList
export const GET_TYPE = (req: express.Request, res: express.Response) => {
  const { agreement_id } = req.query;

  const relatedTitle = 'Related content';
  const lotURL =
    '/agreement/lot?agreement_id=' + req.session.agreement_id + '&lotNum=' + req.session.lotId.replace(/ /g, '%20');
  const lotText = req.session.agreementName + ', ' + req.session.agreementLotName;
  const releatedContent = req.session.releatedContent 
  const windowAppendData = { data: cmsData, agreement_id: agreement_id, releatedContent };
  res.render('typeEoi', windowAppendData);
};

/**
 * @POSTController
 * @description
 *
 */
//POST 'eoi/type'
/**
 *
 * @param req
 * @param res
 * @GETController
 */

export const POST_TYPE = (req: express.Request, res: express.Response) => {
  const { agreement_id } = req.query;
  const projectId = req.session['projectId'];
  const event_id = req.session['eventId'];

  const filtered_body_content_removed_eoi_key = ObjectModifiers._deleteKeyofEntryinObject(req.body, 'choose_eoi_type');

  const { ccs_eoi_type } = filtered_body_content_removed_eoi_key;

  switch (ccs_eoi_type) {
    case 'all_online':
      // eslint-disable-next-line no-case-declarations
      const redirect_address = `/eoi/online-task-list?agreement_id=${agreement_id}&proc_id=${projectId}&event_id=${event_id}`;
      res.redirect(redirect_address);
      break;

    case 'all_offline':
      // eslint-disable-next-line no-case-declarations
      const newAddress = EOI_PATHS.GET_UPLOAD_DOC;
      res.redirect(newAddress);
      break;

    default:
      res.redirect('/404');
  }
};
