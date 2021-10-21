import * as express from 'express'
import {operations } from '../../../utils/operations/operations';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { ObjectModifiers } from '../util/operations/objectremoveEmptyString';
import { ErrorView } from '../../../common/shared/error/errorView';
import {QuestionHelper} from '../helpers/question'

/**
 * @Controller
 * @GET
 * @summary switches query related to specific parameter 
 * @validation false
 */
export const GET_QUESTIONS = async (req : express.Request, res : express.Response)=> {
   let {SESSION_ID} = req.cookies;
   let {
      agreement_id,
      proc_id,
      event_id,
      id,
      group_id
    } =  req.query;
    try {
      let baseURL : any = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups/${group_id}/questions`;
      let fetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(baseURL);
      let fetch_dynamic_api_data = fetch_dynamic_api?.data; 
      let find_validtor = fetch_dynamic_api_data?.map((aSelector: any)=> {

         if(aSelector.nonOCDS.questionType === 'SingleSelect' && aSelector.nonOCDS.multiAnswer === false){
            return 'ccs_rfi_type_form'
        }
        else if (aSelector.nonOCDS.questionType === 'Value' && aSelector.nonOCDS.multiAnswer === true){
          return 'ccs_rfi_questions_form'
        }
        else if (aSelector.nonOCDS.questionType === 'Value' && aSelector.nonOCDS.multiAnswer == false){
        return 'ccs_rfi_who_form'
        }
        else{
          return '';
        }
      })

      console.log(find_validtor?.[0])

      let data =  {
         "data": fetch_dynamic_api_data,
         "agreement_id": agreement_id,
         "proc_id": proc_id,
         "event_id": event_id,
         "group_id": group_id,
         "criterian_id": id,
         "validation": find_validtor?.[0]      
        }     
      res.render('questions', data );
    }
    catch(err){
       res.redirect(ErrorView.notfound)
    }

}
export var array : any = [];


/**
 * @Controller
 * @POST
 * @param rfi_questions
 * @summary 
 * @validation true
 */
// path = '/rfi/questionnaire'
 export const POST_QUESTION =  async (req : express.Request, res : express.Response)=> {
    var {agreement_id, proc_id, event_id, id, group_id} = req.query;

    var {SESSION_ID} = req.cookies;
   let started_progress_check : Boolean = operations.isUndefined(req.body, 'rfi_build_started');
   
   if(operations.equals(started_progress_check, false)){
      let {rfi_build_started, question_id} = req.body;
      if(rfi_build_started === "true"){

        let remove_objectWithKeyIdentifier =  ObjectModifiers._deleteKeyofEntryinObject(req.body, 'rfi_build_started');
        remove_objectWithKeyIdentifier = ObjectModifiers._deleteKeyofEntryinObject(remove_objectWithKeyIdentifier, 'question_id' )
         let _RequestBody: any = remove_objectWithKeyIdentifier;
         let filtered_object_with_empty_keys= ObjectModifiers._removeEmptyStringfromObjectValues(_RequestBody);
         let object_values = Object.values(filtered_object_with_empty_keys
            ).map(an_answer => {
               return {"value" : an_answer}
            })
          let question_array_check : Boolean = Array.isArray(question_id);
          if(question_array_check){
             var sortedStorage = []
               for(let start = 0; start < question_id.length ; start++){
                  var comparisonObject = {
                     "questionNo": question_id[start],
                     "answer": object_values[start]
                  }
                  sortedStorage.push(comparisonObject)
               }
               for(let iteration of sortedStorage){
                  let answerBody = {
                     "nonOCDS": {
                       "answered": true,
                       "options": [
                        iteration.answer,
                       ]
                     }
                   };
                
                   try {
                     let answerBaseURL =  `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups/${group_id}/questions/${iteration.questionNo}`;
                     let postData = await DynamicFrameworkInstance.Instance(SESSION_ID).put(answerBaseURL, answerBody);
                     console.log(postData)
                     QuestionHelper.AFTER_UPDATINGDATA(ErrorView,DynamicFrameworkInstance,proc_id, event_id, SESSION_ID, group_id, agreement_id, id, res);
                   } catch (error) {
                      res.redirect('/404')
                   }
               }
          }
          else{
           
             let answerBody = {
               "nonOCDS": {
                 "answered": true,
                 "options": [
                  ...object_values,
                 ]
               }
             };
             try {
               let answerBaseURL =  `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups/${group_id}/questions/${question_id}`;
               let postData = await DynamicFrameworkInstance.Instance(SESSION_ID).put(answerBaseURL, answerBody);
               console.log(postData)
               QuestionHelper.AFTER_UPDATINGDATA(ErrorView,DynamicFrameworkInstance,proc_id, event_id, SESSION_ID, group_id, agreement_id, id, res);
             } catch (error) {
                res.redirect('/404')
             }

          }
                 
      }
      else{
         res.redirect('/error')
      }
   }
   else {
      res.redirect('/error')
   }
 }



 