import * as express from 'express'
import {operations } from '../../../utils/operations/operations';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { ObjectModifiers } from '../util/operations/objectremoveEmptyString';

/**
 * @Controller
 * @GET
 * @summary switches query related to specific parameter 
 * @validation false
 */
export const GET_QUESTIONS = async (req : express.Request, res : express.Response)=> {

   let {id,path_view, agreement_id} = req.query;
   let fetch_dynamic_api = await DynamicFrameworkInstance.Instance.get('');
   let fetch_dynamic_api_data = fetch_dynamic_api.data; 
   let CriterionId: any = id;
  let filter_according_criterion = fetch_dynamic_api_data?.default.filter((aCriterion: any )=> aCriterion.id === CriterionId.split('_').join(' '))[0];
   let route_path_address : any = path_view;
  let match_according_to_path = filter_according_criterion?.requirementGroups.filter((routed_path: any)=> routed_path.description === route_path_address.split('_').join(' '))[0];

   res.render('questions',{"data": match_according_to_path, "agreement_id": agreement_id, "path_view": path_view, "id": id});
     
}

/**
 * @Controller
 * @POST
 * @param rfi_questions
 * @summary 
 * @validation true
 */


export var array : any = [];





// path = '/rfi/questionnaire'
 export const POST_QUESTION =  async (req : express.Request, res : express.Response)=> {
    var {agreement_id, path_view} = req.query;
   var started_progress_check : Boolean = operations.isUndefined(req.body, 'rfi_build_started');

   if(operations.equals(started_progress_check, false)){
      var {rfi_build_started} = req.body;
      if(rfi_build_started === "true"){

        var remove_objectWithKeyIdentifier =  ObjectModifiers._deleteKeyofEntryinObject(req.body, 'rfi_build_started')
         var _RequestBody: any = remove_objectWithKeyIdentifier;
         var filtered_object_with_empty_keys= ObjectModifiers._removeEmptyStringfromObjectValues(_RequestBody);
         array.push(filtered_object_with_empty_keys)
        let fetch_dynamic_api = await DynamicFrameworkInstance.Instance.get('');
         let fetch_dynamic_api_data = fetch_dynamic_api.data; 
         let criterion_items = fetch_dynamic_api_data.default.map((Items: any)=> Items.requirementGroups).flat();
     
         let sorted_criterion_items_according_href = criterion_items.map((Items: any)=> Items.description );
     
         let current_path : any = path_view;
         let total_pagination_tab_length = sorted_criterion_items_according_href?.length ;
     
         let current_tab_index_cursor = sorted_criterion_items_according_href?.indexOf(current_path.split('_').join(' '));
     
         let next_index_cursor  = current_tab_index_cursor ;
         
         if(next_index_cursor < total_pagination_tab_length){
           let next_index_cursor_path = sorted_criterion_items_according_href[next_index_cursor + 1];
           let parsed_next_index_cursor_path = next_index_cursor_path.split(' ').join('_');
     
           let find_criteriongrouped = fetch_dynamic_api_data.default.map((aSub_criterian_item: any)=> {
              var {id, requirementGroups} = aSub_criterian_item;
              var refined_array_consisting_id = requirementGroups.map((item_in_requirementGroups : Object) => {
                 var newly_assigned_requirementGroup : any = item_in_requirementGroups;
                 newly_assigned_requirementGroup['id'] = id;
                 return newly_assigned_requirementGroup;
              })
              return refined_array_consisting_id;
           })
           find_criteriongrouped = find_criteriongrouped.flat();
           let find_criterion_id = find_criteriongrouped.filter((search_query: any) => search_query.description === parsed_next_index_cursor_path.split('_').join(' '))[0];
           let criterion_id  = find_criterion_id.id.split(' ').join('_');
           let base_redirect_url = `/rfi/questions?agreement_id=${agreement_id}&id=${criterion_id}&path_view=${parsed_next_index_cursor_path}`
            let redirect_path = base_redirect_url;
           res.redirect(redirect_path);
         }
         else if(next_index_cursor === (total_pagination_tab_length -1)){
           console.log('api storage');
         }
         else{
            res.redirect('/error')
         }
      }
      res.redirect('/error')
   }

   res.redirect('/error')

   


 }
