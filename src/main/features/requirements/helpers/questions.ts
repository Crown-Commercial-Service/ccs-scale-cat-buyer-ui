import { TenderApi } from '@common/util/fetch/procurementService/TenderApiInstance';
import express from 'express';
import { HttpStatusCode } from 'main/errors/httpStatusCodes';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
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
    let baseURL: any = `/tenders/projects/${proc_id}/events/${event_id}/criteria`;
    try {
      //update section 3 status start
      const headingBaseURL: any = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups`;
        const heading_fetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(headingBaseURL);
        let heading_fetch_dynamic_api_data=heading_fetch_dynamic_api?.data;
        heading_fetch_dynamic_api_data=heading_fetch_dynamic_api_data.filter((a:any)=>(a?.OCDS?.id!='Group 18' && a?.OCDS?.id!='Group 2'));//exclude group 18 and 2
        // heading_fetch_dynamic_api_data=heading_fetch_dynamic_api_data.filter((a:any)=>a?.OCDS?.id!='Group 2');//exclude group 2
        let mandatoryNum = 0;
        let maxNum = 0;//number of mandatory screens
        for(let i=0;i<heading_fetch_dynamic_api_data.length;i++)
        {
            let isMandatory=heading_fetch_dynamic_api_data[i]?.nonOCDS?.mandatory;
            if(isMandatory){
              maxNum=maxNum+1;
              let gid=heading_fetch_dynamic_api_data[i]?.OCDS?.id;
              let baseQuestionURL: any = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups/${gid}/questions`;
              let question_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(baseQuestionURL);
              let question_api_data = question_api?.data;
              //let mandatoryMarked=false;//increase mandatory count
              let innerMandatoryNum=0;
              let mandatoryNumberinGroup=question_api_data.filter((a:any)=>a?.nonOCDS?.mandatory==true)?.length;//no of questions mandatory in group
              for(let k=0;k<question_api_data.length;k++){//multiple questions on page
              let isInnerMandatory=question_api_data?.[k]?.nonOCDS?.mandatory;
              if(isInnerMandatory){
                let questionType=question_api_data?.[k]?.nonOCDS?.questionType;
              let answer=''
              let selectedLocation;
              if(questionType=='Text' || questionType=='Percentage')
              {
                let textMandatoryNum=question_api_data?.[k]?.nonOCDS?.options?.length;
                let textNum=0;
                if(textMandatoryNum==0){textMandatoryNum=-1;}//no data is entered
                for(let j=0;j<textMandatoryNum;j++){
                answer=question_api_data?.[k]?.nonOCDS?.options?.[j]?.value;
                if(answer!='' && answer!=undefined){textNum+=1;}
                }
                if(textMandatoryNum==textNum){innerMandatoryNum+=1;}
              }
              else if (questionType === 'SingleSelect')
              {
                for (let j = 0; j < question_api_data?.[k]?.nonOCDS?.options?.length; j++) {
                  selectedLocation = question_api_data?.[k]?.nonOCDS?.options[j]['selected'];
                  if (selectedLocation) {innerMandatoryNum+=1;}
                }
              }
              else if(questionType === 'Date')
              {
                let dateValidation=0;
                for (let j = 0; j < question_api_data?.[k]?.nonOCDS?.options?.length; j++) {
                  let dateValue = question_api_data?.[k]?.nonOCDS?.options[j]?.value;
                  if (dateValue!=''  && dateValue!=undefined) {dateValidation+=1;}
                }
                if(dateValidation==3)//3 for day,month,year
                {
                  innerMandatoryNum+=1;
                }
              }
              else if(questionType==='KeyValuePair'){
                let kvMandatoryNum=question_api_data?.[k]?.nonOCDS?.options?.length;
                let kvNum=0;
                if(kvMandatoryNum==0){kvMandatoryNum=-1;}//no data is entered
                for(let j=0;j<kvMandatoryNum;j++){
                let kvText=question_api_data?.[k]?.nonOCDS?.options?.[j]?.text;
                let kvValue=question_api_data?.[k]?.nonOCDS?.options?.[j]?.value;
                if(kvText!='' && kvValue!=''  && kvText!=undefined  && kvValue!=undefined){kvNum+=1;} 
                }
                if(kvNum==kvMandatoryNum){innerMandatoryNum+=1;}
              }
              else if(questionType==='ReadMe'){
                innerMandatoryNum+=1;
              }
              }
              
            }
            if(mandatoryNumberinGroup==innerMandatoryNum){mandatoryNum+=1;}
          }
        }

        if(maxNum==mandatoryNum){//all questions answered
          const response = await TenderApi.Instance(SESSION_ID).put(`journeys/${proc_id}/steps/32`, 'Completed');
        
        if (response.status == HttpStatusCode.OK) {
          let flag=await ShouldEventStatusBeUpdated(proc_id,33,req);
            if(flag){
          await TenderApi.Instance(SESSION_ID).put(`journeys/${proc_id}/steps/33`, 'Not started');
          }
        }
        }
        else{
          let flag=await ShouldEventStatusBeUpdated(proc_id,32,req);
            if(flag){
          await TenderApi.Instance(SESSION_ID).put(`journeys/${proc_id}/steps/32`, 'In progress');
            }
        }
      //update section 3 status end
      let fetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(baseURL);
      let fetch_dynamic_api_data = fetch_dynamic_api?.data;
      let extracted_criterion_based = fetch_dynamic_api_data?.map((criterian: any) => criterian?.id);
      let criterianStorage: any = [];
      let criterian_array: any = [];
      for (let aURI of extracted_criterion_based) {
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
          let tempId = object.criterianId.split('Criterion ').join('') + '000';
          if (object.nonOCDS['mandatory'] === false)
            object.OCDS['description'] = object.OCDS['description'] + ' (Optional)';
          object.OCDS['sortId'] = Number(tempId) + Number(aCriterian.OCDS['id']?.split('Group ').join(''));
          if (!isNaN(object.OCDS['sortId'])) return object;
        })
        .sort((a: any, b: any) => (a.OCDS.sortId < b.OCDS.sortId ? -1 : 1))
        .filter((obj: any) => obj != undefined)
        .filter((obj: any) => obj.OCDS.description !== 'IR35 acknowledgement');
      let current_cursor = sorted_ascendingly?.findIndex(
        (pointer: any) => pointer.OCDS['id'] === group_id && pointer.criterianId === id,
      );
      let check_for_overflowing: Boolean = current_cursor < sorted_ascendingly.length - 1;
      if (check_for_overflowing) {
        let next_cursor = current_cursor + 1;
        let next_cursor_object = sorted_ascendingly[next_cursor];
        let next_group_id = next_cursor_object.OCDS['id'];
        let next_criterian_id = next_cursor_object['criterianId'];
        let base_url = `/rfp/questions?agreement_id=${agreement_id}&proc_id=${proc_id}&event_id=${event_id}&id=${next_criterian_id}&group_id=${next_group_id}&section=${res.req?.query?.section}`;
        res.redirect(base_url);
      } else {
           
        res.redirect('/rfp/task-list');
      }
    } catch (error) {
      logger.log('Something went wrong in the RFP Journey, please review the logit error log for more information');
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
  static AFTER_UPDATINGDATA_RFP_Assessment = async (
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
    let baseURL: any = `/tenders/projects/${proc_id}/events/${event_id}/criteria`;
    try {
      
      let fetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(baseURL);
      let fetch_dynamic_api_data = fetch_dynamic_api?.data;
      let extracted_criterion_based = fetch_dynamic_api_data?.map((criterian: any) => criterian?.id);
      let criterianStorage: any = [];
      let criterian_array: any = [];
      for (let aURI of extracted_criterion_based) {
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
          let tempId = object.criterianId.split('Criterion ').join('') + '000';
          if (object.nonOCDS['mandatory'] === false)
            object.OCDS['description'] = object.OCDS['description'] + ' (Optional)';
          object.OCDS['sortId'] = Number(tempId) + Number(aCriterian.OCDS['id']?.split('Group ').join(''));
          if (!isNaN(object.OCDS['sortId'])) return object;
        })
        .sort((a: any, b: any) => (a.OCDS.sortId < b.OCDS.sortId ? -1 : 1))
        .filter((obj: any) => obj != undefined)
        .filter((obj: any) => obj.OCDS.description !== 'IR35 acknowledgement');
      let current_cursor = sorted_ascendingly?.findIndex(
        (pointer: any) => pointer.OCDS['id'] === group_id && pointer.criterianId === id,
      );
      let check_for_overflowing: Boolean = current_cursor < sorted_ascendingly.length - 1;
      if (check_for_overflowing) {
        let next_cursor = current_cursor + 1;
        let next_cursor_object = sorted_ascendingly[next_cursor];
        let next_group_id = next_cursor_object.OCDS['id'];
        let next_criterian_id = next_cursor_object['criterianId'];
        let base_url = `/rfp/assesstment-question?agreement_id=${agreement_id}&proc_id=${proc_id}&event_id=${event_id}&id=${next_criterian_id}&group_id=${next_group_id}&section=${res.req?.query?.section}=&step${res.req?.query?.step}`;
        if (next_group_id === 'Group 8' && next_criterian_id === 'Criterion 2') {
          
          const response = await TenderApi.Instance(SESSION_ID).put(`journeys/${proc_id}/steps/37`, 'Completed');
          if (response.status == HttpStatusCode.OK) {
            let flag=await ShouldEventStatusBeUpdated(proc_id,38,req);
            if(flag)
            {
                      await TenderApi.Instance(SESSION_ID).put(`journeys/${proc_id}/steps/38`, 'Not started');
            }//await TenderApi.Instance(SESSION_ID).put(`journeys/${proc_id}/steps/39`, 'Cannot start yet');
            //await TenderApi.Instance(SESSION_ID).put(`journeys/${proc_id}/steps/40`, 'Cannot start yet');
            //await TenderApi.Instance(SESSION_ID).put(`journeys/${proc_id}/steps/41`, 'Cannot start yet');
          }
        
          res.redirect('/rfp/task-list');
        } else
          res.redirect(base_url);
      } else {
        let mandatoryNum = 0;
        const maxNum = 8;
        //let status = 'In progress';
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
              if (
                questionType === 'Value' ||
                questionType === 'Text' ||
                questionType === 'Monetary' ||
                questionType === 'Duration' ||
                questionType === 'Date'
              ) {
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
            mandatoryNum === maxNum ? (status = 'Completed') : (status = 'In progress');
          }
        }

        const response = await TenderApi.Instance(SESSION_ID).put(`journeys/${proc_id}/steps/66`, 'Completed');
        if (response.status == HttpStatusCode.OK) {
          await TenderApi.Instance(SESSION_ID).put(`journeys/${proc_id}/steps/70`, 'Not started');
        }
        res.redirect('/rfp/task-list');
      }
    } catch (error) {
      logger.log('Something went wrong in the RFP Journey, please review the logit error log for more information');
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


