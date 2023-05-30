//@ts-nocheck
import * as express from 'express';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import fileData from '../../../resources/content/requirements/rfpYourAssesstment.json';
import * as fileDataMCF from '../../../resources/content/MCF3/requirements/rfpYourAssesstment.json';
import * as fileDataDOS from '../../../resources/content/MCF3/requirements/DOSrfpYourAssesstment.json';

import { operations } from '../../../utils/operations/operations';
import { ErrorView } from '../../../common/shared/error/errorView';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { ShouldEventStatusBeUpdated } from '../../shared/ShouldEventStatusBeUpdated';
import { logConstant } from '../../../common/logtracer/logConstant';

/**
 *
 * @param req
 * @param res
 * @GETController
 */
export const RFP_GET_YOUR_ASSESSTMENT = async (req: express.Request, res: express.Response) => {
  if (
    operations.isUndefined(req.query, 'agreement_id') ||
    operations.isUndefined(req.query, 'proc_id') ||
    operations.isUndefined(req.query, 'event_id')
  ) {
    const RedirectURL = `/rfp/your-assessment?agreement_id=${req.session.agreement_id}&proc_id=${req.session.projectId}&event_id=${req.session.eventId}`;
    res.redirect(RedirectURL);
  } else {
    const { agreement_id, proc_id, event_id } = req.query;
    const { SESSION_ID } = req.cookies;
    const { eventId } = req.session;

    const baseURL: any = `/tenders/projects/${proc_id}/events/${event_id}/criteria`;
    let socialvalueAccess = false;
    try {
      const fetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(baseURL);

      //CAS-INFO-LOG
      LoggTracer.infoLogger(fetch_dynamic_api, logConstant.criterianEventFetch, req);

      const fetch_dynamic_api_data = fetch_dynamic_api?.data;
      const extracted_criterion_based = fetch_dynamic_api_data?.map((criterian: any) => criterian?.id);
      if (agreement_id === 'RM1557.13') {
        const index = extracted_criterion_based.indexOf('Criterion 4');
        if (index > -1) {
          // only splice array when item is found
          extracted_criterion_based.splice(index, 1); // 2nd parameter means remove one item only
        }
      }

      let criterianStorage: any = [];
      for (const aURI of extracted_criterion_based) {
        const criterian_bas_url = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${aURI}/groups`;
        const fetch_criterian_group_data = await DynamicFrameworkInstance.Instance(SESSION_ID).get(criterian_bas_url);
        const criterian_array = fetch_criterian_group_data?.data;
        const rebased_object_with_requirements = criterian_array?.map((anItem: any) => {
          const object = anItem;
          object.step = getStepNumberWithGroupId(anItem.OCDS.id);
          object['criterianId'] = aURI;
          return object;
        });
        criterianStorage.push(rebased_object_with_requirements);
      }
      criterianStorage = criterianStorage[0];
      const sorted_ascendingly = criterianStorage
        .map((aCriterian: any) => {
          const object = aCriterian;
          object.OCDS['id'] = parseInt(aCriterian.OCDS['id']?.split('Group ').join(''));
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

      let ExcludingKeyDates;
      if (agreement_id == 'RM1043.8') {
        ExcludingKeyDates = select_default_data_from_fetch_dynamic_api.filter(
          (AField) => AField.OCDS.id !== 'Group Key Dates'
        );
      } else {
        ExcludingKeyDates = select_default_data_from_fetch_dynamic_api.filter(
          (AField) => AField.OCDS.id !== 'Group Key Dates' && AField.OCDS.id != 'Group 8' && AField.OCDS.id != 'Group 7'
        );
      }

      const releatedContent = req.session.releatedContent;

      let cmsData;
      if (agreement_id == 'RM6187') {
        //MCF3
        cmsData = fileDataMCF;
      } else if (agreement_id == 'RM6263') {
        //DSP
        cmsData = fileData;
      } else {
        cmsData = fileDataDOS;
      }
      for (let index = 0; index < ExcludingKeyDates.length; index++) {
        ExcludingKeyDates[index].questionStatus = 'todo';
        const baseURLQ: any = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${ExcludingKeyDates[index].criterianId}/groups/${ExcludingKeyDates[index].OCDS.id}/questions`;
        const fetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(baseURLQ);
        let fetch_dynamic_api_data = fetch_dynamic_api?.data;
        fetch_dynamic_api_data = fetch_dynamic_api_data.sort((a, b) => (a.OCDS.id < b.OCDS.id ? -1 : 1));
        for (let j = 0; j < fetch_dynamic_api_data.length; j++) {
          if (
            fetch_dynamic_api_data[j].nonOCDS.questionType == 'SingleSelect' ||
            fetch_dynamic_api_data[j].nonOCDS.questionType == 'MultiSelect'
          ) {
            // let questionOptions = fetch_dynamic_api_data[j].nonOCDS.options;
            // let item1 = questionOptions.find(i => i.selected === true);
            const item1 = fetch_dynamic_api_data[j].nonOCDS.answered;
            if (item1) {
              ExcludingKeyDates[index].questionStatus = 'Done';
            }
          } else {
            if (agreement_id == 'RM1043.8') {
              if (fetch_dynamic_api_data[j].nonOCDS.questionType == 'Percentage') {
                if (
                  ExcludingKeyDates[index].OCDS.id === 'Group 3' &&
                  ExcludingKeyDates[index].criterianId === 'Criterion 2'
                ) {
                  if (fetch_dynamic_api_data[j].nonOCDS.order == 3) {
                    const optiondata = fetch_dynamic_api_data[j].nonOCDS.options;
                    if (optiondata.length > 0) {
                      if (optiondata[0].value == 0) {
                        socialvalueAccess = true;
                      }
                    }
                  }
                }
              }
            }
            if (fetch_dynamic_api_data[j].nonOCDS.options.length > 0) {
              ExcludingKeyDates[index].questionStatus = 'Done';
            } else {
            }
          }
        }
      }

      const display_fetch_data = {
        data: ExcludingKeyDates,
        agreement_id: agreement_id,
        file_data: cmsData,
        proc_id: proc_id,
        event_id: event_id,
        lotId,
        agreementLotName,
        releatedContent: releatedContent,
        socialvalueAccess: socialvalueAccess,
      };
      const flag = await ShouldEventStatusBeUpdated(eventId, 34, req);
      // await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/34`, 'Completed');
      // await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/35`, 'Not started');
      if (flag) {
        //await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/37`, 'In progress');
      }
      // await TenderApi.Instance(SESSION_ID).put(`journeys/${proc_id}/steps/38`, 'Not started');
      //await TenderApi.Instance(SESSION_ID).put(`journeys/${proc_id}/steps/39`, 'Cannot start yet');
      //await TenderApi.Instance(SESSION_ID).put(`journeys/${proc_id}/steps/40`, 'Cannot start yet');
      //await TenderApi.Instance(SESSION_ID).put(`journeys/${proc_id}/steps/41`, 'Cannot start yet');

      //CAS-INFO-LOG
      LoggTracer.infoLogger(fetch_dynamic_api, logConstant.yourassesstments, req);
      res.render('rfp-yourassesstment', display_fetch_data);
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

const getStepNumberWithGroupId = (groupId: string) => {
  switch (groupId) {
  case 'Group 1':
    return 40;
    break;
  case 'Group 2':
    return 41;
    break;
  case 'Group 3':
    return 42;
    break;
  case 'Group 4':
    return 43;
    break;
  case 'Group 5':
    return 44;
    break;
  case 'Group 6':
    return 45;
    break;
  case 'Group 7':
    return 46;
    break;
  case 'Group 8':
    return 48;
    break;
  default:
    break;
  }
};
