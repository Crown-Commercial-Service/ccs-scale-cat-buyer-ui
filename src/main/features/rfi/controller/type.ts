import * as express from 'express';
import * as cmsData from '../../../resources/content/RFI/rfiType.json';
import * as MCFcmsData from '../../../resources/content/MCF3/RFI/rfiType.json';
import { ObjectModifiers } from '../util/operations/objectremoveEmptyString';
import { RFI_PATHS } from '../model/rficonstant';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { HttpStatusCode } from 'main/errors/httpStatusCodes';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';

// RFI TaskList
export const GET_TYPE = (req: express.Request, res: express.Response) => {
  // const { agreement_id } = req.query;
  const { agreement_id } = req.session;
  const ccs_rfi_type = req.session.ccs_rfi_type;
  const agreementId_session = req.session.agreement_id;
  const releatedContent = req.session.releatedContent;
  let fetchCmsData = cmsData;
  if (agreement_id == 'RM1557.13') {
    fetchCmsData = MCFcmsData;
  }
  const windowAppendData = {
    data: fetchCmsData,
    agreement_id: agreement_id,
    agreementId_session,
    releatedContent,
    ccs_rfi_type,
  };
  res.render('type', windowAppendData);
};

/**
 * @POSTController
 * @description
 *
 */
//POST 'rfi/type'
/**
 *
 * @param req
 * @param res
 * @GETController
 */

export const POST_TYPE = async (req: express.Request, res: express.Response) => {
  const { agreement_id } = req.session;
  const projectId = req.session['projectId'];
  const event_id = req.session['eventId'];
  const { SESSION_ID } = req.cookies;
  try {
    let step;
    if (agreement_id == 'RM1557.13') {
      step = 81;
    } else {
      step = 9;
    }
    const response = await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/${step}`, 'Completed');
    if (response.status == HttpStatusCode.OK) {
      await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/10`, 'Not started');
    }

    const filtered_body_content_removed_rfi_key = ObjectModifiers._deleteKeyofEntryinObject(
      req.body,
      'choose_rfi_type'
    );

    const { ccs_rfi_type } = filtered_body_content_removed_rfi_key;
    req.session.ccs_rfi_type = ccs_rfi_type;
    switch (ccs_rfi_type) {
    case 'all_online': {
      const redirect_address = `/rfi/online-task-list?agreement_id=${agreement_id}&proc_id=${projectId}&event_id=${event_id}`;
      res.redirect(redirect_address);
      break;
    }
    case 'all_offline': {
      const newAddress = RFI_PATHS.GET_OFFLINE;
      res.redirect(newAddress);
      break;
    }
    default:
      res.redirect('/404');
    }
  } catch (error) {
    LoggTracer.errorLogger(
      req,
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'RFI Type page - Journey Api - put failed',
      true
    );
  }
};
