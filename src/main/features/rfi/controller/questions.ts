import * as express from 'express'
import { operations } from '../../../utils/operations/operations';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import {OrganizationInstance} from '../util/fetch/organizationuserInstance'
import { ObjectModifiers } from '../util/operations/objectremoveEmptyString';
import { ErrorView } from '../../../common/shared/error/errorView';
import { QuestionHelper } from '../helpers/question'
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('questions page');
import {LogMessageFormatter} from '../../../common/logtracer/logmessageformatter'



/**
 * @Controller
 * @GET
 * @summary switches query related to specific parameter 
 * @validation false
 */
export const GET_QUESTIONS = async (req: express.Request, res: express.Response) => {
   let { SESSION_ID } = req.cookies;
   let {
      agreement_id,
      proc_id,
      event_id,
      id,
      group_id
   } = req.query;
   
   try {
      let baseURL: any = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups/${group_id}/questions`;
      let fetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(baseURL);
      let fetch_dynamic_api_data = fetch_dynamic_api?.data;
      let headingBaseURL: any = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups`;
      let heading_fetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(headingBaseURL);

      let organizationID = req.session.user.payload.ciiOrgId;
      let organisationBaseURL = `/organisation-profiles/${organizationID}`
      let getOrganizationDetails = await OrganizationInstance.OrganizationUserInstance().get(organisationBaseURL);
      let name = getOrganizationDetails.data.identifier.legalName;
      let organizationName = name;
      
      let matched_selector = heading_fetch_dynamic_api?.data.filter((agroupitem: any) => {
         return agroupitem?.OCDS?.['id'] === group_id;
      })

      matched_selector = matched_selector?.[0];
      let { OCDS, nonOCDS } = matched_selector;
      let titleText = OCDS?.description;
      let promptData = nonOCDS?.prompt;

      let form_name = fetch_dynamic_api_data?.map((aSelector: any) => {

         if (aSelector.nonOCDS.questionType === 'SingleSelect' && aSelector.nonOCDS.multiAnswer === false) {
            return 'ccs_rfi_vetting_form'
         }
         else if (aSelector.nonOCDS.questionType === 'Value' && aSelector.nonOCDS.multiAnswer === true) {
            return 'ccs_rfi_questions_form'
         }
         else if (aSelector.nonOCDS.questionType === 'Value' && aSelector.nonOCDS.multiAnswer == false) {
            return 'ccs_rfi_who_form'
         }
         else if (aSelector.nonOCDS.questionType === 'KeyValuePair' && aSelector.nonOCDS.multiAnswer == true) {
            return 'ccs_rfi_acronyms_form'
         }
         else if (aSelector.nonOCDS.questionType === 'Text' && aSelector.nonOCDS.multiAnswer == false) {
            return 'ccs_rfi_about_proj'
         }
         else if (aSelector.nonOCDS.questionType === 'MultiSelect' && aSelector.nonOCDS.multiAnswer === true) {
            return 'ccs_rfi_location'
         }

         else {
            return '';
         }
      })

      let data = {
         "data": fetch_dynamic_api_data,
         "agreement_id": agreement_id,
         "proc_id": proc_id,
         "event_id": event_id,
         "group_id": group_id,
         "criterian_id": id,
         "form_name": form_name?.[0],
         "rfiTitle": titleText,
         "prompt": promptData,
        "organizationName" : organizationName
      }

 

      res.render('questions', data);
   }
   catch (error) {

      logger.log("Something went wrong, please review the logit error log for more information")
      delete error?.config?.['headers'];
      let Logmessage = {
         "Person_id": TokenDecoder.decoder(SESSION_ID),
         "error_location": `${req.headers.host}${req.originalUrl}`,
         "sessionId": "null",
         "error_reason": "RFI Dynamic framework throws error - Tenders Api is causing problem",
         "exception": error
      }
      let Log = new LogMessageFormatter(
         Logmessage.Person_id,
         Logmessage.error_location,
         Logmessage.sessionId,
         Logmessage.error_reason,
         Logmessage.exception
      )
      LoggTracer.errorTracer(Log, res);
   }

}


export var array: any = [];


/**
 * @Controller
 * @POST
 * @param rfi_questions
 * @summary 
 * @validation true
 */
// path = '/rfi/questionnaire'
export const POST_QUESTION = async (req: express.Request, res: express.Response) => {
   var { agreement_id, proc_id, event_id, id, group_id } = req.query;

   //console.log(req.body)

   var { SESSION_ID } = req.cookies;
   let started_progress_check: Boolean = operations.isUndefined(req.body, 'rfi_build_started');

   if (operations.equals(started_progress_check, false)) {
      let { rfi_build_started, question_id, questionType } = req.body;
      if (rfi_build_started === "true") {
         let remove_objectWithKeyIdentifier = ObjectModifiers._deleteKeyofEntryinObject(req.body, 'rfi_build_started');    
         remove_objectWithKeyIdentifier = ObjectModifiers._deleteKeyofEntryinObject(remove_objectWithKeyIdentifier, 'question_id');   
         remove_objectWithKeyIdentifier = ObjectModifiers._deleteKeyofEntryinObject(remove_objectWithKeyIdentifier, 'questionType');      
         let _RequestBody: any = remove_objectWithKeyIdentifier;
         let filtered_object_with_empty_keys = ObjectModifiers._removeEmptyStringfromObjectValues(_RequestBody);
         let object_values = Object.values(filtered_object_with_empty_keys
         ).map(an_answer => {
            return { "value": an_answer }
         })



            
         if(questionType === "Valuetrue"){

         
            let answerValueBody = {
               "nonOCDS": {
                  "answered": true,
                  "options": [
                     ...object_values
                  ]
               }
            }
            try {
               let answerBaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups/${group_id}/questions/${question_id}`;
               await DynamicFrameworkInstance.Instance(SESSION_ID).put(answerBaseURL, answerValueBody);

               QuestionHelper.AFTER_UPDATINGDATA(ErrorView, DynamicFrameworkInstance, proc_id, event_id, SESSION_ID, group_id, agreement_id, id, res);
            } catch (error) {
               logger.log("Something went wrong, please review the logit error log for more information")
               delete error?.config?.['headers'];
               let Logmessage = {
                  "Person_id": TokenDecoder.decoder(SESSION_ID),
                  "error_location": `${req.headers.host}${req.originalUrl}`,
                  "sessionId": "null",
                  "error_reason": "Dyanamic framework throws error - Tender Api is causing problem",
                  "exception": error
               }
               let Log = new LogMessageFormatter(
                  Logmessage.Person_id,
                  Logmessage.error_location,
                  Logmessage.sessionId,
                  Logmessage.error_reason,
                  Logmessage.exception
               )
               LoggTracer.errorTracer(Log, res)
            }
         }


         

         else if (questionType === "KeyValuePairtrue"){
            let {term, value} = req.body;
            let TAStorage = [];
            term = term.filter((akeyTerm : any)=> akeyTerm !== "" );
            value = value.filter((aKeyValue : any)=> aKeyValue !== "" );

            for(let item=0; item < term.length; item++){
               let termObject = {value: term[item], text: value[item], selected: true}
               TAStorage.push(termObject);
            }


            let answerBody = {
               "nonOCDS": {
                  "answered": true,
                  "options": [
                     ...TAStorage
                  ]
               }
            };

            try {
               let answerBaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups/${group_id}/questions/${question_id}`;
               await DynamicFrameworkInstance.Instance(SESSION_ID).put(answerBaseURL, answerBody);
   
               QuestionHelper.AFTER_UPDATINGDATA(ErrorView, DynamicFrameworkInstance, proc_id, event_id, SESSION_ID, group_id, agreement_id, id, res);
            } catch (error) {
              // console.log(error)
               logger.log("Something went wrong, please review the logit error log for more information")
               delete error?.config?.['headers'];
               let Logmessage = {
                  "Person_id": TokenDecoder.decoder(SESSION_ID),
                  "error_location": `${req.headers.host}${req.originalUrl}`,
                  "sessionId": "null",
                  "error_reason": "Dyanamic framework throws error - Tender Api is causing problem",
                  "exception": error
               }
               let Log = new LogMessageFormatter(
                  Logmessage.Person_id,
                  Logmessage.error_location,
                  Logmessage.sessionId,
                  Logmessage.error_reason,
                  Logmessage.exception
               )
               LoggTracer.errorTracer(Log, res)
            }

            

         }      

         else{
       
         let question_array_check: Boolean = Array.isArray(question_id);
         if (question_array_check) {
            var sortedStorage = []
            for (let start = 0; start < question_id.length; start++) {
               var comparisonObject = {
                  "questionNo": question_id[start],
                  "answer": object_values[start]
               }
               sortedStorage.push(comparisonObject)
            }
            for (let iteration of sortedStorage) {
               let answerBody = {
                  "nonOCDS": {
                     "answered": true,
                     "options": [
                        iteration.answer,
                     ]
                  }
               };

               try {

               
                  let answerBaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups/${group_id}/questions/${iteration.questionNo}`;
                   await DynamicFrameworkInstance.Instance(SESSION_ID).put(answerBaseURL, answerBody);
                  QuestionHelper.AFTER_UPDATINGDATA(ErrorView, DynamicFrameworkInstance, proc_id, event_id, SESSION_ID, group_id, agreement_id, id, res);
               } catch (error) {
                 // console.log(error)
                  logger.log("Something went wrong, please review the logit error log for more information")
                  delete error?.config?.['headers'];
                  let Logmessage = {
                     "Person_id": TokenDecoder.decoder(SESSION_ID),
                     "error_location": `${req.headers.host}${req.originalUrl}`,
                     "sessionId": "null",
                     "error_reason": "RFI Dynamic framework throws error - Tender Api is causing problem",
                     "exception": error
                  }
                  let Log = new LogMessageFormatter(
                     Logmessage.Person_id,
                     Logmessage.error_location,
                     Logmessage.sessionId,
                     Logmessage.error_reason,
                     Logmessage.exception
                  )
                  LoggTracer.errorTracer(Log, res);
               }
            }
         }
         else {
            let selectedOptionToggle = [...object_values].map((anObject : any)=> {
               let check = Array.isArray(anObject?.value);
               if(check){
                  let arrayOFArrayedObjects = anObject?.value.map((anItem: any)=> {
                     return {value: anItem, selected: true}
                  });
                  arrayOFArrayedObjects = arrayOFArrayedObjects.flat().flat()
                  return arrayOFArrayedObjects;
               }
               else return {value: anObject.value, selected: true}
            })

            selectedOptionToggle = selectedOptionToggle.map((anItem: any)=> {
               if(Array.isArray(anItem)){
                  return anItem;
               }
               else{
                  return [anItem];
               }
            });

            let answerBody = {
               "nonOCDS": {
                  "answered": true,
                  "options": [
                     ...selectedOptionToggle[0],
                  ]
               }
            };

            try {
               let answerBaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups/${group_id}/questions/${question_id}`;
               await DynamicFrameworkInstance.Instance(SESSION_ID).put(answerBaseURL, answerBody);

               QuestionHelper.AFTER_UPDATINGDATA(ErrorView, DynamicFrameworkInstance, proc_id, event_id, SESSION_ID, group_id, agreement_id, id, res);
            } catch (error) {
              // console.log(error)
               logger.log("Something went wrong, please review the logit error log for more information")
               delete error?.config?.['headers'];
               let Logmessage = {
                  "Person_id": TokenDecoder.decoder(SESSION_ID),
                  "error_location": `${req.headers.host}${req.originalUrl}`,
                  "sessionId": "null",
                  "error_reason": "Dyanamic framework throws error - Tender Api is causing problem",
                  "exception": error
               }
               let Log = new LogMessageFormatter(
                  Logmessage.Person_id,
                  Logmessage.error_location,
                  Logmessage.sessionId,
                  Logmessage.error_reason,
                  Logmessage.exception
               )
               LoggTracer.errorTracer(Log, res)
            }

            
                   

      }

      }
     
   }
   else {
      logger.log("Something went wrong")
      res.redirect('/error')
   }
}
   else {
      logger.log("Something went wrong")
      res.redirect('/error')
   }

}
