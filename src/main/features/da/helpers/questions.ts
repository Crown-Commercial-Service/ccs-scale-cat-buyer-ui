import { TenderApi } from '@common/util/fetch/procurementService/TenderApiInstance';
import express from 'express';
import { HttpStatusCode } from 'main/errors/httpStatusCodes';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { Logger } from '@hmcts/nodejs-logging';
const logger = Logger.getLogger('questions healper');
import { ShouldEventStatusBeUpdated } from '../../shared/ShouldEventStatusBeUpdated';

/**
 * @Helper
 * helps with question controller to redirect
 */

export class QuestionHelper {
  static AFTER_UPDATINGDATA = async (
    _ErrorView: any,
    DynamicFrameworkInstance: any,
    proc_id: any,
    event_id: any,
    SESSION_ID: string,
    group_id: any,
    agreement_id: any,
    id: any,
    res: express.Response,
    req: express.Request
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
      heading_fetch_dynamic_api_data = heading_fetch_dynamic_api_data.filter(
        (a: any) => a?.OCDS?.id != 'Group 18' && a?.OCDS?.id != 'Group 2'
      ); //exclude group 18 and 2
      heading_fetch_dynamic_api_data = heading_fetch_dynamic_api_data.sort(
        (n1: { nonOCDS: { order: number } }, n2: { nonOCDS: { order: number } }) => n1.nonOCDS.order - n2.nonOCDS.order
      );
      const mandatoryGroupList = heading_fetch_dynamic_api_data.filter(
        (n1: { nonOCDS: { mandatory: any } }) => n1.nonOCDS?.mandatory
      );
      let mandatoryNum = 0;

      for (let i = 0; i < mandatoryGroupList.length; i++) {
        const isMandatory = mandatoryGroupList[i]?.nonOCDS?.mandatory;

        if (isMandatory) {
          const gid = mandatoryGroupList[i]?.OCDS?.id;
          const baseQuestionURL: any = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups/${gid}/questions`;
          const question_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(baseQuestionURL);
          const question_api_data = question_api?.data;
          //let mandatoryMarked=false;//increase mandatory count
          let innerMandatoryNum = 0;
          //let mandatoryNumberinGroup = question_api_data.filter((a: any) => a?.nonOCDS?.mandatory == true)?.length;//no of questions mandatory in group
          const mandatoryNumberinGroup = question_api_data.length;
          //if (mandatoryNumberinGroup != null && mandatoryNumberinGroup.length > 0) {
          for (let k = 0; k < question_api_data.length; k++) {
            //multiple questions on page
            //let isInnerMandatory = question_api_data?.[k]?.nonOCDS?.mandatory;
            const questionType = question_api_data[k]?.nonOCDS.questionType;
            //if (isInnerMandatory) {
            let answer = '';
            let selectedLocation;
            if (questionType == 'Text' || questionType == 'Percentage') {
              const textMandatoryNum = question_api_data[k]?.nonOCDS.options?.length;

              let textNum = 0;
              if (textMandatoryNum != null && textMandatoryNum > 0) {
                for (let j = 0; j < textMandatoryNum; j++) {
                  answer = question_api_data?.[k]?.nonOCDS?.options?.[j]?.value;

                  if (gid != 'Group 16' && answer != '' && answer != undefined) {
                    textNum += 1;
                  }
                }

                if (textMandatoryNum == textNum) {
                  innerMandatoryNum += 1;
                }
              }
            } else if (questionType === 'MultiSelect') {
              let isMultiselect = false;
              for (let j = 0; j < question_api_data?.[k]?.nonOCDS.options?.length; j++) {
                selectedLocation = question_api_data?.[k]?.nonOCDS.options?.[j]['selected'];
                if (selectedLocation && !isMultiselect) {
                  innerMandatoryNum += 1;
                  isMultiselect = true;
                }
              }
            } else if (questionType === 'SingleSelect') {
              let isSingleSelect = false;
              for (let j = 0; j < question_api_data?.[k]?.nonOCDS.options?.length; j++) {
                selectedLocation = question_api_data?.[k]?.nonOCDS.options?.[j]['selected'];
                const value = question_api_data?.[k]?.nonOCDS.options?.[j]['value'];
                if (selectedLocation && !isSingleSelect) {
                  innerMandatoryNum += 1;
                  isSingleSelect = true;
                }
                if (gid === 'Group 16' && value !== undefined && value === 'No' && selectedLocation) {
                  innerMandatoryNum += 1;
                }
                if (gid === 'Group 16' && value !== undefined && value === 'Yes' && selectedLocation) {
                  innerMandatoryNum += 1;
                }
              }
            } else if (questionType === 'Date') {
              let dateValidation = 0;
              for (let j = 0; j < question_api_data?.[k]?.nonOCDS.options?.length; j++) {
                const dateValue = question_api_data?.[k]?.nonOCDS.options?.[j]?.value;
                if (dateValue != undefined && dateValue != null && dateValue != '') {
                  dateValidation += 1;
                }
              }
              if (dateValidation >= 1) {
                //3 for day,month,year
                innerMandatoryNum += 1;
              }
            } else if (questionType === 'Duration') {
              innerMandatoryNum += 1;
            } else if (questionType === 'KeyValuePair') {
              const kvMandatoryNum = question_api_data?.[k]?.nonOCDS.options?.length;
              let kvNum = 0;
              if (kvMandatoryNum != null && kvMandatoryNum > 0) {
                //kvMandatoryNum = -1;
                for (let j = 0; j < kvMandatoryNum; j++) {
                  const kvText = question_api_data?.[k]?.nonOCDS?.options?.[j]?.text;
                  const kvValue = question_api_data?.[k]?.nonOCDS?.options?.[j]?.value;
                  if (kvText != '' && kvValue != '' && kvText != undefined && kvValue != undefined) {
                    kvNum += 1;
                  }
                }
                if (kvNum == kvMandatoryNum) {
                  innerMandatoryNum += 1;
                }
              } //no data is entered
            } else if (questionType === 'ReadMe') {
              innerMandatoryNum += 1;
              //mandatoryNumberinGroup += 1;
            }
          }

          if (
            mandatoryNumberinGroup != null &&
            mandatoryNumberinGroup > 0 &&
            mandatoryNumberinGroup == innerMandatoryNum
          ) {
            mandatoryNum += 1;
          }
        }
      }

      if (mandatoryGroupList != null && mandatoryGroupList.length > 0 && mandatoryGroupList.length == mandatoryNum) {
        //all questions answered
        const response = await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/31`, 'Completed');

        if (response.status == HttpStatusCode.OK) {
          const flag = await ShouldEventStatusBeUpdated(event_id, 32, req);
          if (flag) {
            await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/32`, 'Not started');
          }
        }
      } else {
        const flag = await ShouldEventStatusBeUpdated(event_id, 31, req);
        if (flag) {
          await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/31`, 'In progress');
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
      const sorted_ascendingly = criterianStorage
        .map((aCriterian: any) => {
          const object = aCriterian;
          const tempId = object.criterianId.split('Criterion ').join('') + '000';
          if (object.nonOCDS['mandatory'] === false)
            object.OCDS['description'] = object.OCDS['description'] + ' (Optional)';
          object.OCDS['sortId'] = Number(tempId) + Number(aCriterian.OCDS['id']?.split('Group ').join(''));
          if (!isNaN(object.OCDS['sortId'])) return object;
        })
        .sort((a: any, b: any) => (a.OCDS.sortId < b.OCDS.sortId ? -1 : 1))
        .filter((obj: any) => obj != undefined)
        .filter((obj: any) => obj.OCDS.description !== 'IR35 acknowledgement');
      const current_cursor = sorted_ascendingly?.findIndex(
        (pointer: any) => pointer.OCDS['id'] === group_id && pointer.criterianId === id
      );
      const check_for_overflowing: boolean = current_cursor < sorted_ascendingly.length - 1;
      if (check_for_overflowing) {
        const next_cursor = current_cursor + 1;
        const next_cursor_object = sorted_ascendingly[next_cursor];
        const next_group_id = next_cursor_object.OCDS['id'];
        const next_criterian_id = next_cursor_object['criterianId'];
        const base_url = `/da/questions?agreement_id=${agreement_id}&proc_id=${proc_id}&event_id=${event_id}&id=${next_criterian_id}&group_id=${next_group_id}&section=''`;
        res.redirect(base_url);
      } else {
        res.redirect('/da/task-list');
      }
    } catch (error) {
      console.log('catcherr', error);

      logger.log('Something went wrong in the RFP Journey, please review the logit error log for more information');
      LoggTracer.errorLogger(
        res,
        error,
        'questions healper class',
        null,
        TokenDecoder.decoder(SESSION_ID),
        'DA Questions-Tender agreement failed to be added',
        true
      );
    }
  };
  static AFTER_UPDATINGDATA_DA_Assessment = async (
    _ErrorView: any,
    DynamicFrameworkInstance: any,
    proc_id: any,
    event_id: any,
    SESSION_ID: string,
    group_id: any,
    agreement_id: any,
    id: any,
    res: express.Response,
    req: express.Request
  ) => {
    /**
     * @Path
     * @Next
     * Sorting and following to the next path
     */
    //let baseURL: any = `/tenders/projects/${proc_id}/events/${event_id}/criteria`;
    try {
      //#region Check Mandatory group and question
      const headingBaseURL: any = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups`;
      const heading_fetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(headingBaseURL);
      let heading_fetch_dynamic_api_data = heading_fetch_dynamic_api?.data;
      heading_fetch_dynamic_api_data = heading_fetch_dynamic_api_data.filter(
        (a: any) => a?.OCDS?.id != 'Group 18' && a?.OCDS?.id != 'Group 8' && a?.OCDS?.id != 'Group 7'
      ); //exclude group 18 and 2
      heading_fetch_dynamic_api_data = heading_fetch_dynamic_api_data.sort(
        (n1: { nonOCDS: { order: number } }, n2: { nonOCDS: { order: number } }) => n1.nonOCDS.order - n2.nonOCDS.order
      );
      const mandatoryGroupList = heading_fetch_dynamic_api_data.filter(
        (n1: { nonOCDS: { mandatory: any } }) => n1.nonOCDS?.mandatory
      );
      let mandatoryNum = 0;

      for (let i = 0; i < mandatoryGroupList.length; i++) {
        const isMandatory = mandatoryGroupList[i]?.nonOCDS?.mandatory;

        if (isMandatory) {
          const gid = mandatoryGroupList[i]?.OCDS?.id;
          const baseQuestionURL: any = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups/${gid}/questions`;
          const question_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(baseQuestionURL);
          let question_api_data = question_api?.data;
          //let mandatoryMarked=false;//increase mandatory count
          let innerMandatoryNum = 0;
          //let mandatoryNumberinGroup = question_api_data.filter((a: any) => a?.nonOCDS?.mandatory == true)?.length;//no of questions mandatory in group
          //let mandatoryNumberinGroup = question_api_data.length;
          question_api_data = question_api_data.sort(
            (n1: { nonOCDS: { order: number } }, n2: { nonOCDS: { order: number } }) =>
              n1.nonOCDS.order - n2.nonOCDS.order
          );
          question_api_data =
            gid === 'Group 3' && question_api_data.length > 3
              ? question_api_data.slice(0, question_api_data.length - 1)
              : question_api_data;
          const mandatoryNumberinGroup = question_api_data.length;
          //if (mandatoryNumberinGroup != null && mandatoryNumberinGroup.length > 0) {
          for (let k = 0; k < question_api_data.length; k++) {
            //multiple questions on page
            //let isInnerMandatory = question_api_data?.[k]?.nonOCDS?.mandatory;
            const questionType = question_api_data[k]?.nonOCDS.questionType;
            //if (isInnerMandatory) {
            let answer = '';
            let selectedLocation;
            if (questionType == 'Text' || questionType == 'Percentage') {
              const textMandatoryNum = question_api_data[k]?.nonOCDS.options?.length;
              let textNum = 0;
              if (textMandatoryNum != null && textMandatoryNum > 0) {
                for (let j = 0; j < textMandatoryNum; j++) {
                  answer = question_api_data?.[k]?.nonOCDS?.options?.[j]?.value;
                  if (answer != '' && answer != undefined) {
                    textNum += 1;
                  }
                }
                if (textMandatoryNum == textNum) {
                  innerMandatoryNum += 1;
                }
              }
            } else if (questionType === 'MultiSelect') {
              let isMultiselect = false;
              for (let j = 0; j < question_api_data?.[k]?.nonOCDS.options?.length; j++) {
                selectedLocation = question_api_data?.[k]?.nonOCDS.options?.[j]['selected'];
                if (selectedLocation && !isMultiselect) {
                  innerMandatoryNum += 1;
                  isMultiselect = true;
                }
              }
            } else if (questionType === 'SingleSelect') {
              let isSingleSelect = false;
              for (let j = 0; j < question_api_data?.[k]?.nonOCDS.options?.length; j++) {
                selectedLocation = question_api_data?.[k]?.nonOCDS.options?.[j]['selected'];
                const value = question_api_data?.[k]?.nonOCDS.options?.[j]['value'];
                if (selectedLocation && !isSingleSelect) {
                  innerMandatoryNum += 1;
                  isSingleSelect = true;
                }
                if (gid === 'Group 16' && value !== undefined && value === 'No' && selectedLocation) {
                  innerMandatoryNum += 1;
                }
              }
            } else if (questionType === 'Date') {
              let dateValidation = 0;
              for (let j = 0; j < question_api_data?.[k]?.nonOCDS.options?.length; j++) {
                const dateValue = question_api_data?.[k]?.nonOCDS.options?.[j]?.value;
                if (dateValue != undefined && dateValue != null && dateValue != '') {
                  dateValidation += 1;
                }
              }
              if (dateValidation >= 3) {
                //3 for day,month,year
                innerMandatoryNum += 1;
              }
            } else if (questionType === 'Duration') {
              innerMandatoryNum += 1;
            } else if (questionType === 'KeyValuePair') {
              const kvMandatoryNum = question_api_data?.[k]?.nonOCDS.options?.length;
              let kvNum = 0;
              if (kvMandatoryNum != null && kvMandatoryNum > 0) {
                //kvMandatoryNum = -1;
                for (let j = 0; j < kvMandatoryNum; j++) {
                  const kvText = question_api_data?.[k]?.nonOCDS?.options?.[j]?.text;
                  const kvValue = question_api_data?.[k]?.nonOCDS?.options?.[j]?.value;
                  if (kvText != '' && kvValue != '' && kvText != undefined && kvValue != undefined) {
                    kvNum += 1;
                  }
                }
                if (kvNum == kvMandatoryNum) {
                  innerMandatoryNum += 1;
                }
              } //no data is entered
            } else if (questionType === 'ReadMe') {
              innerMandatoryNum += 1;
              //mandatoryNumberinGroup += 1;
            }
          }

          if (
            mandatoryNumberinGroup != null &&
            mandatoryNumberinGroup > 0 &&
            mandatoryNumberinGroup == innerMandatoryNum
          ) {
            mandatoryNum += 1;
          }
        }
      }

      if (mandatoryGroupList != null && mandatoryGroupList.length > 0 && mandatoryGroupList.length == mandatoryNum) {
        //all questions answered
        const response = await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/33`, 'Completed');

        if (response.status == HttpStatusCode.OK) {
          const flag = await ShouldEventStatusBeUpdated(event_id, 34, req);
          if (flag) {
            await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/34`, 'Not started');
          }
        }
      } else {
        const flag = await ShouldEventStatusBeUpdated(event_id, 33, req);
        if (flag) {
          await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/33`, 'In progress');
        }
      }

      heading_fetch_dynamic_api_data?.map((obj: any) => {
        obj.criterianId = id;
      });
      const current_cursor = heading_fetch_dynamic_api_data?.findIndex(
        (pointer: any) => pointer.OCDS['id'] === group_id && pointer.criterianId === id
      );

      const check_for_overflowing: boolean = current_cursor < heading_fetch_dynamic_api_data.length - 1;
      if (check_for_overflowing && current_cursor != -1) {
        const next_cursor = current_cursor + 1;
        const next_cursor_object = heading_fetch_dynamic_api_data[next_cursor];
        const next_group_id = next_cursor_object.OCDS['id'];
        const next_criterian_id = id; //next_cursor_object['criterianId'];
        const base_url = `/da/assesstment-question?agreement_id=${agreement_id}&proc_id=${proc_id}&event_id=${event_id}&id=${next_criterian_id}&group_id=${next_group_id}&section=${res.req?.query?.section}=&step${res.req?.query?.step}`;
        res.redirect(base_url);
      } else {
        res.redirect('/da/task-list');
        //}
      }
    } catch (error) {
      logger.log('Something went wrong in the RFP Journey, please review the logit error log for more information');
      LoggTracer.errorLogger(
        res,
        error,
        'questions healper class',
        null,
        TokenDecoder.decoder(SESSION_ID),
        'DA Questions-Tender agreement failed to be added',
        true
      );
    }
  };

  static GET_GROUP_LIST = async (
    proc_id: any,
    event_id: any,
    id: any,
    SESSION_ID: any,
    DynamicFrameworkInstance: any
  ) => {
    const headingBaseURL: any = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups`;
    const heading_fetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(headingBaseURL);
    return heading_fetch_dynamic_api?.data;
  };
}
