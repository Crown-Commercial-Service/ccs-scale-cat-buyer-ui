import * as express from 'express'
import {operations } from '../../../utils/operations/operations';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { ObjectModifiers } from '../util/operations/objectremoveEmptyString';
import { ErrorView } from '../../../common/shared/error/errorView';

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

                   } catch (error) {
                      res.redirect('/404')
                   }
              

               }
             
          }
          else{
             console.log(question_id)
          }


        
        

    












       
            /**
             * @Path
             * @Next
             * Sorting and following to the next path
             */

            let baseURL : any = `/tenders/projects/${proc_id}/events/${event_id}/criteria`;
            try {
               let fetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(baseURL);
               let fetch_dynamic_api_data = fetch_dynamic_api?.data; 
               let extracted_criterion_based = fetch_dynamic_api_data?.map((criterian : any)=> criterian?.id);
               var criterianStorage: any = [];
               for (let aURI of extracted_criterion_based) {
                  let criterian_bas_url =  `/tenders/projects/${proc_id}/events/${event_id}/criteria/${aURI}/groups`;
                  let fetch_criterian_group_data = await DynamicFrameworkInstance.Instance(SESSION_ID).get(criterian_bas_url);
                  let criterian_array = fetch_criterian_group_data?.data;
                  let rebased_object_with_requirements = criterian_array?.map((anItem: any)=> {
                     let object = anItem;
                     object['criterianId'] = aURI;
                     return object;
                  })
                  criterianStorage.push(rebased_object_with_requirements)
               }
               criterianStorage = criterianStorage.flat();
               let sorted_ascendingly = criterianStorage.map((aCriterian : any) => {
                  let object = aCriterian;
                  object.OCDS['id'] = aCriterian.OCDS['id']?.split('Group ').join('');
                  return object;
               }).sort((current_cursor: any, iterator_cursor : any) => Number(current_cursor.OCDS['id']) - Number(iterator_cursor.OCDS['id'])).map((aCriterian : any ) => {
                  var object = aCriterian;
                  object.OCDS['id'] = `Group ${aCriterian.OCDS['id']}`
                  return object;
               });
               let current_cursor = sorted_ascendingly?.findIndex((pointer : any) => pointer.OCDS['id'] === group_id);
               let check_for_overflowing : Boolean = current_cursor < sorted_ascendingly.length;
               if(check_for_overflowing){
                  let next_cursor = current_cursor + 1;
                  let next_cursor_object = sorted_ascendingly[next_cursor];
                  let next_group_id = next_cursor_object.OCDS['id'];
                  let next_criterian_id = next_cursor_object['criterianId'];
                  let base_url = `/rfi/questions?agreement_id=${agreement_id}&proc_id=${proc_id}&event_id=${event_id}&id=${next_criterian_id}&group_id=${next_group_id}`
                  console.log(id)
                  res.redirect(base_url)
               }
               else{
                  // do some logic here 
               }
            } catch (error) {
               res.redirect(ErrorView.notfound)
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
