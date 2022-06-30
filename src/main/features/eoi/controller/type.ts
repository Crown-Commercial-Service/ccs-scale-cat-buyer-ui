import * as express from 'express';
import * as cmsData from '../../../resources/content/eoi/eoiType.json';
import { ObjectModifiers } from '../util/operations/objectremoveEmptyString';
import { EOI_PATHS } from '../model/eoiconstant';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { HttpStatusCode } from 'main/errors/httpStatusCodes';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';

// eoi TaskList
export const GET_TYPE = (req: express.Request, res: express.Response) => {
  const { agreement_id } = req.query;
  const releatedContent = req.session.releatedContent;
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

export const POST_TYPE = async (req: express.Request, res: express.Response) => {
  const { agreement_id } = req.query;
  const projectId = req.session['projectId'];
  const event_id = req.session['eventId'];
  const { SESSION_ID } = req.cookies;
  try {
    const response = await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/19`, 'Completed');
    if (response.status == HttpStatusCode.OK) {
      await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/20`, 'Not started');
    }
    const filtered_body_content_removed_eoi_key = ObjectModifiers._deleteKeyofEntryinObject(
      req.body,
      'choose_eoi_type',
    );

    const { ccs_eoi_type } = filtered_body_content_removed_eoi_key;

    switch (ccs_eoi_type) {
      case 'all_online':
        // eslint-disable-next-line no-case-declarations
        const redirect_address = `/eoi/online-task-list?agreement_id=${agreement_id}&proc_id=${projectId}&event_id=${event_id}`;
        res.redirect(redirect_address);
        break;

      case 'all_offline':
        // eslint-disable-next-line no-case-declarations
        const newAddress = EOI_PATHS.GET_OFFLINE;
        res.redirect(newAddress);
        break;

      default:
        res.redirect('/404');
    }
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - Put failed - EOI type page',
      true,
    );
  }
};
