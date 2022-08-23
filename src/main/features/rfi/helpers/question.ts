//@ts-nocheck
import express from 'express';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { HttpStatusCode } from 'main/errors/httpStatusCodes';
const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('questions healper');
import {ShouldEventStatusBeUpdated} from '../../shared/ShouldEventStatusBeUpdated';
/**
 * @Helper
 * helps with question controller to redirect
 */

export class QuestionHelper {
  static AFTER_UPDATINGDATA = async (
    ErrorView: any,
    DynamicFrameworkInstance: any,
    proc_id: any,
    event_id: any,
    SESSION_ID: string,
    group_id: any,
    agreement_id: any,
    id: any,
    res: express.Response,
    req:express.Request,
  ) => {
    /**
     * @Path
     * @Next
     * Sorting and following to the next path
     */
    const baseURL: any = `/tenders/projects/${proc_id}/events/${event_id}/criteria`;
    try {
      //update section 3 status start
      const headingBaseURL: any = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups`;
      const heading_fetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(headingBaseURL);
      let heading_fetch_dynamic_api_data = heading_fetch_dynamic_api?.data;
      heading_fetch_dynamic_api_data = heading_fetch_dynamic_api_data.filter((a: any) => (a?.OCDS?.id != "Key Dates"));//exclude key dates
      const mandatoryGroupList = heading_fetch_dynamic_api_data.filter((n1: { nonOCDS: { mandatory: any; }; }) => n1.nonOCDS?.mandatory);
      let mandatoryNum = 0;
      for (let i = 0; i < mandatoryGroupList.length; i++) {
        
        let isMandatory = mandatoryGroupList[i]?.nonOCDS?.mandatory;
        if (isMandatory) {
          let gid = mandatoryGroupList[i]?.OCDS?.id;
          let baseQuestionURL: any = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups/${gid}/questions`;
          let question_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(baseQuestionURL);
          let question_api_data = question_api?.data;
          //let mandatoryMarked=false;//increase mandatory count
          let innerMandatoryNum = 0;
          //let mandatoryNumberinGroup = question_api_data.filter((a: any) => a?.nonOCDS?.mandatory == true)?.length;//no of questions mandatory in group
          let mandatoryNumberinGroup = question_api_data.length;
          //if (mandatoryNumberinGroup != null && mandatoryNumberinGroup.length > 0) {
          for (let k = 0; k < question_api_data.length; k++) {//multiple questions on page
            //let isInnerMandatory = question_api_data?.[k]?.nonOCDS?.mandatory;
            let questionType = question_api_data[k]?.nonOCDS.questionType;
            //if (isInnerMandatory) {
            let answer = ''
            let selectedLocation;
            if (questionType == 'Text' || questionType == 'Percentage' || questionType === 'Value') {
              let textMandatoryNum = question_api_data[k]?.nonOCDS.options?.length;
              let textNum = 0;
              if (textMandatoryNum != null && textMandatoryNum > 0) {
                for (let j = 0; j < textMandatoryNum; j++) {
                  answer = question_api_data?.[k]?.nonOCDS?.options?.[j]?.value;
                  if (answer != '' && answer != undefined) { textNum += 1; }
                }
                if (textMandatoryNum == textNum) { innerMandatoryNum += 1; }
              }
            }
            else if (questionType === 'MultiSelect') {
              let isMultiselect = false;
              for (let j = 0; j < question_api_data?.[k]?.nonOCDS.options?.length; j++) {
                selectedLocation = question_api_data?.[k]?.nonOCDS.options?.[j]['selected'];
                if (selectedLocation && !isMultiselect) { innerMandatoryNum += 1; isMultiselect = true; }
              }
            }
            else if (questionType === 'SingleSelect') {
              let isSingleSelect = false;
              for (let j = 0; j < question_api_data?.[k]?.nonOCDS.options?.length; j++) {
                selectedLocation = question_api_data?.[k]?.nonOCDS.options?.[j]['selected'];
                let value = question_api_data?.[k]?.nonOCDS.options?.[j]['value'];
                if (selectedLocation && !isSingleSelect) { innerMandatoryNum += 1; isSingleSelect = true; }
                if (gid === 'Group 16' && value !== undefined && value === 'No' && selectedLocation) {
                  innerMandatoryNum += 1;
                }
              }
            }
            else if (questionType === 'Date') {
              let dateValidation = 0;
              for (let j = 0; j < question_api_data?.[k]?.nonOCDS.options?.length; j++) {
                let dateValue = question_api_data?.[k]?.nonOCDS.options?.[j]?.value;
                if (dateValue != undefined && dateValue != null && dateValue != '') { dateValidation += 1; }
              }
              if (dateValidation >= 3)//3 for day,month,year
              {
                innerMandatoryNum += 1;
              }
            }
            else if (questionType === 'Duration') {
              innerMandatoryNum += 1;
            }
            else if (questionType === 'KeyValuePair') {
              let kvMandatoryNum = question_api_data?.[k]?.nonOCDS.options?.length;
              let kvNum = 0;
              if (kvMandatoryNum != null && kvMandatoryNum > 0) {
                //kvMandatoryNum = -1;
                for (let j = 0; j < kvMandatoryNum; j++) {
                  let kvText = question_api_data?.[k]?.nonOCDS?.options?.[j]?.text;
                  let kvValue = question_api_data?.[k]?.nonOCDS?.options?.[j]?.value;
                  if (kvText != '' && kvValue != '' && kvText != undefined && kvValue != undefined) { kvNum += 1; }
                }
                if (kvNum == kvMandatoryNum) { innerMandatoryNum += 1; }
              }//no data is entered
            }
            else if (questionType === 'ReadMe') {
              innerMandatoryNum += 1;
              //mandatoryNumberinGroup += 1;
            }
          }
          if (mandatoryNumberinGroup != null && mandatoryNumberinGroup > 0 && mandatoryNumberinGroup == innerMandatoryNum) { mandatoryNum += 1; }
        }
      
      }

      if (mandatoryGroupList != null && mandatoryGroupList.length > 0 && mandatoryGroupList.length == mandatoryNum) {//all questions answered
        const response = await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/10`, 'Completed');
        if (response.status == HttpStatusCode.OK) {
          let flag = await ShouldEventStatusBeUpdated(event_id, 11, req);
          if (flag) {
            await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/11`, 'Optional');
          }
          flag=await ShouldEventStatusBeUpdated(event_id,12,req);
          if(flag)
          {
                await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/12`, 'Not started');
          }
        }
      }
      else {
        let flag = await ShouldEventStatusBeUpdated(event_id, 10, req);
        if (flag) {
          await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/10`, 'In progress');
        }
      }
      //update section 3 status end


      const fetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(baseURL);
      const fetch_dynamic_api_data = fetch_dynamic_api?.data;
      const extracted_criterion_based = fetch_dynamic_api_data?.map((criterian: any) => criterian?.id);
      let criterianStorage: any = [];
      let criterian_array: any = [];
      for (const aURI of extracted_criterion_based) {
        const criterian_bas_url = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${aURI}/groups`;
        const fetch_criterian_group_data = await DynamicFrameworkInstance.Instance(SESSION_ID).get(criterian_bas_url);
        criterian_array = fetch_criterian_group_data?.data;
        const rebased_object_with_requirements = criterian_array?.map((anItem: any) => {
          const object = anItem;
          object['criterianId'] = aURI;
          return object;
        });
        criterianStorage.push(rebased_object_with_requirements);
      }

      criterianStorage = criterianStorage.flat();
      criterianStorage = criterianStorage.filter(AField => AField.OCDS.id !== 'Key Dates');
      const sorted_ascendingly = criterianStorage
        .map((aCriterian: any) => {
          const object = aCriterian;
          object.OCDS['id'] = aCriterian.OCDS['id']?.split('Group ').join('');
          return object;
        })
        .sort(
          (current_cursor: any, iterator_cursor: any) =>
            Number(current_cursor.OCDS['id']) - Number(iterator_cursor.OCDS['id']),
        )
        .map((aCriterian: any) => {
          const object = aCriterian;
          object.OCDS['id'] = `Group ${aCriterian.OCDS['id']}`;
          return object;
        });
      const current_cursor = sorted_ascendingly?.findIndex((pointer: any) => pointer.OCDS['id'] === group_id);
      const check_for_overflowing: boolean = current_cursor < sorted_ascendingly.length - 1;
      if (check_for_overflowing) {
        const next_cursor = current_cursor + 1;
        const next_cursor_object = sorted_ascendingly[next_cursor];
        const next_group_id = next_cursor_object.OCDS['id'];
        const next_criterian_id = next_cursor_object['criterianId'];
        const base_url = `/rfi/questions?agreement_id=${agreement_id}&proc_id=${proc_id}&event_id=${event_id}&id=${next_criterian_id}&group_id=${next_group_id}`;
        res.redirect(base_url);
      } else {
        let mandatoryNum = 0;
        for (let i = 0; i < criterian_array.length; i++) {
          const groupId = criterian_array[i].OCDS['id'];
          const mandatory = criterian_array[i].nonOCDS['mandatory'];
          if (mandatory) {
            const baseURL: any = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups/${groupId}/questions`;
            const fetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(baseURL);
            const fetch_dynamic_api_data = fetch_dynamic_api?.data;
            let answered;
            const questionType = fetch_dynamic_api_data[0].nonOCDS['questionType'];
            let selectedLocation;
            if (fetch_dynamic_api_data[0].nonOCDS.options[0]) {
              if (questionType === 'Value' || questionType === 'Text') {
                answered = fetch_dynamic_api_data[0].nonOCDS.options[0]['value'];
                if (answered !== '') mandatoryNum += 1;
              }
              if (questionType === 'SingleSelect' || questionType === 'MultiSelect') {
                for (let j = 0; j < fetch_dynamic_api_data[0].nonOCDS.options.length; j++) {
                  selectedLocation = fetch_dynamic_api_data[0].nonOCDS.options[j]['selected'];
                  if (selectedLocation) mandatoryNum += 1;
                }
              }
            }        
          }
        }
    //     const response = await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/10`, 'Completed');
    //     if (response.status == HttpStatusCode.OK) {
    //       let flag=await ShouldEventStatusBeUpdated(event_id,11,req);
    // if(flag)
    // {
    //       await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/11`, 'Optional');
    // }
    //       flag=await ShouldEventStatusBeUpdated(event_id,12,req);
    // if(flag)
    // {
    //       await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/12`, 'Not started');
    // }
        //}
        res.redirect('/rfi/rfi-tasklist');
      }
    } catch (error) {
      logger.log('Something went wrong in the RFI Journey, please review the logit error log for more information');
      LoggTracer.errorLogger(
        res,
        error,
        'questions healper class',
        null,
        TokenDecoder.decoder(SESSION_ID),
        'Tender agreement failed to be added',
        true,
      );
    }
  };
}
