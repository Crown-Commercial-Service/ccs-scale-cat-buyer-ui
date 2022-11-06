//@ts-nocheck
import * as express from 'express';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import fileData from '../../../resources/content/eoi/eoionlineTaskList.json';
import Mcf3cmsData from '../../../resources/content/MCF3/eoi/eoionlineTaskList.json';
import { operations } from '../../../utils/operations/operations';
import { ErrorView } from '../../../common/shared/error/errorView';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';

// eoi TaskList
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
          let tempId = object.criterianId.split('Criterion ').join('') + '000'
          if (object.nonOCDS['mandatory'] === false)
            object.OCDS['description'] = object.OCDS['description'] + ' (Optional)'
          object.OCDS['sortId'] = Number(tempId) + Number(aCriterian.OCDS['id']?.split('Group ').join(''))
          if (!isNaN(object.OCDS['sortId']))
            return object;
        })
        .sort((a: any, b: any) => (a.OCDS.sortId < b.OCDS.sortId ? -1 : 1))
        .filter(obj => obj != undefined);

      const select_default_data_from_fetch_dynamic_api = sorted_ascendingly;
      const lotId = req.session?.lotId;
      const agreementLotName = req.session.agreementLotName;
      const releatedContent = req.session?.releatedContent;

      let forceChangeDataJson;
      if (agreement_id == 'RM6187') { //MCF3
        forceChangeDataJson = Mcf3cmsData;
      } else {
        forceChangeDataJson = fileData;
      }
      
      for (let index = 0; index < select_default_data_from_fetch_dynamic_api.length; index++) {
        select_default_data_from_fetch_dynamic_api[index].questionStatus = 'todo';
        const baseURLQ: any = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${select_default_data_from_fetch_dynamic_api[index].criterianId}/groups/${select_default_data_from_fetch_dynamic_api[index].OCDS.id}/questions`;
        const fetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(baseURLQ);
        let fetch_dynamic_api_data = fetch_dynamic_api?.data;
        fetch_dynamic_api_data = fetch_dynamic_api_data.sort((a, b) => (a.OCDS.id < b.OCDS.id ? -1 : 1));
        for (let j = 0; j < fetch_dynamic_api_data.length; j++) {
          if (fetch_dynamic_api_data[j].nonOCDS.questionType == 'SingleSelect' || fetch_dynamic_api_data[j].nonOCDS.questionType == 'MultiSelect') {
            let questionOptions = fetch_dynamic_api_data[j].nonOCDS.options;
            let item1 = questionOptions.find(i => i.selected === true);
            if(item1){
              select_default_data_from_fetch_dynamic_api[index].questionStatus = 'Done';
            }

          } else {
            
            if (fetch_dynamic_api_data[j].nonOCDS.options.length > 0) {
              
              select_default_data_from_fetch_dynamic_api[index].questionStatus = 'Done';
            } else {
            }
          }
        }

      }

      const display_fetch_data = {
        data: select_default_data_from_fetch_dynamic_api,
        agreement_id: agreement_id,
        file_data: forceChangeDataJson,
        proc_id: proc_id,
        event_id: event_id,
        lotId,
        agreementLotName,
        releatedContent: releatedContent
      };
      res.render('onlinetasklistEoi', display_fetch_data);
    } catch (error) {
      LoggTracer.errorLogger(
        res,
        error,
        `${req.headers.host}${req.originalUrl}`,
        null,
        TokenDecoder.decoder(SESSION_ID),
        'EOI - Tenders Service Api cannot be connected',
        true,
      );
    }
  }
};