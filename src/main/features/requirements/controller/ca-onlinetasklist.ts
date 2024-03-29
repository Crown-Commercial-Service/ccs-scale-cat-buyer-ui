//@ts-nocheck
import * as express from 'express';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import fileData from '../../../resources/content/requirements/caonlineTaskList.json';
import { operations } from '../../../utils/operations/operations';
import { ErrorView } from '../../../common/shared/error/errorView';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';

// RFI TaskList
/**
 *
 * @param req
 * @param res
 * @GETController
 */
export const GET_ONLINE_TASKLIST = async (req: express.Request, res: express.Response) => {
  if (
    operations.isUndefined(req.query, 'agreement_id') ||
    operations.isUndefined(req.query, 'proc_id') ||
    operations.isUndefined(req.query, 'event_id')
  ) {
    res.redirect(ErrorView.notfound);
  } else {
    const { agreement_id, proc_id, event_id } = req.query;
    const { SESSION_ID } = req.cookies;
    const baseURL: any = `/tenders/projects/${proc_id}/events/${event_id}/criteria`;
    try {
      const fetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(baseURL);
      const fetch_dynamic_api_data = fetch_dynamic_api?.data;
      const extracted_criterion_based = fetch_dynamic_api_data?.map((criterian: any) => criterian?.id);
      let criterianStorage: any = [];
      for (const aURI of extracted_criterion_based) {
        const criterian_bas_url = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${aURI}/groups`;
        const fetch_criterian_group_data = await DynamicFrameworkInstance.Instance(SESSION_ID).get(criterian_bas_url);
        const criterian_array = fetch_criterian_group_data?.data;
        const rebased_object_with_requirements = criterian_array?.map((anItem: any) => {
          const object = anItem;
          object['criterianId'] = aURI;
          return object;
        });
        criterianStorage.push(rebased_object_with_requirements);
      }
      criterianStorage = criterianStorage.flat();
      const sorted_ascendingly = criterianStorage
        .map((aCriterian: any) => {
          const object = aCriterian;
          object.OCDS['id'] = aCriterian.OCDS['id']?.split('Group ').join('');
          return object;
        })
        .sort((a, b) => (a.OCDS.id < b.OCDS.id ? -1 : 1))
        .map((aCriterian: any) => {
          const object = aCriterian;
          object.OCDS['id'] = `Group ${aCriterian.OCDS['id']}`;
          if (object.nonOCDS['mandatory'] === false)
            object.OCDS['description'] = object.OCDS['description'] + ' (Optional)';
          return object;
        });
      const select_default_data_from_fetch_dynamic_api = sorted_ascendingly;
      const lotId = req.session?.lotId;
      const agreementLotName = req.session.agreementLotName;
      const ExcludingKeyDates = select_default_data_from_fetch_dynamic_api.filter(
        (AField) => AField.OCDS.id !== 'Group Key Dates'
      );
      const releatedContent = req.session.releatedContent;
      const display_fetch_data = {
        data: ExcludingKeyDates,
        agreement_id: agreement_id,
        file_data: fileData,
        proc_id: proc_id,
        event_id: event_id,
        lotId,
        agreementLotName,
        releatedContent: releatedContent,
      };
      res.render('onlinetasklist', display_fetch_data);
    } catch (error) {
      LoggTracer.errorLogger(
        res,
        error,
        `${req.headers.host}${req.originalUrl}`,
        null,
        TokenDecoder.decoder(SESSION_ID),
        'Tenders Service Api cannot be connected',
        true
      );
    }
  }
};
