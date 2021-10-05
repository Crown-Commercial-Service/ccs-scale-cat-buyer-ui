import * as express from 'express'
import * as cmsData from '../../../resources/content/RFI/rfiTaskList.json'
import * as QuestionCmsData from '../../../resources/content/RFI/rfiquestions/information.json'
import * as whoCmsData from '../../../resources/content/RFI/rfiquestions/who.json'
import * as online_task_list from '../../../resources/content/RFI/rfionlineTaskList.json'

/**
 * @Controller
 * @GET
 * @summary switches query related to specific parameter 
 * @validation false
 */
export const GET_QUESTIONS = (req : express.Request, res : express.Response)=> {

   var {path_view, agreement_id} = req.query;

   let template = online_task_list.template;
   let related_template_data : any = template[1].requirementGroups;

   var path_view_loaded_data: Object = {};
   
   switch(path_view){

      case 'rfi_questions':
         var rfi_questions_data: Object = {data : QuestionCmsData}
         Object.assign(path_view_loaded_data, rfi_questions_data);
      break;

      case 'rfi_who':
         var group_2_data = related_template_data.filter((anItem : any) => anItem?.id === 'Group 2');
         var rfi_who : Object = {data : whoCmsData, template: group_2_data[0]}
         Object.assign(path_view_loaded_data, rfi_who);
      break;

      case 'rfi_vetting':
         var rfi_vetting : Object = {data : cmsData}
         Object.assign(path_view_loaded_data, rfi_vetting);
      break;

      case 'rfi_acronyms':
         var rfi_acronyms : Object = {data : cmsData}
         Object.assign(path_view_loaded_data, rfi_acronyms);
      break;

      case 'rfi_address':
         var rfi_address : Object = {data : cmsData}
         Object.assign(path_view_loaded_data, rfi_address);
      break;


      case 'rfi_budget':
         var rfi_budget : Object = {data : cmsData}
         Object.assign(path_view_loaded_data, rfi_budget);
      break;

      case 'rfi_budget_step_two':
         var rfi_budget_step_two : Object = {data : cmsData}
         Object.assign(path_view_loaded_data, rfi_budget_step_two);
      break;

      case 'rfi_project':
         var rfi_project : Object = {data : cmsData}
         Object.assign(path_view_loaded_data, rfi_project);
      break;

      case 'rfi_project_status':
         var rfi_project_status : Object = {data : cmsData}
         Object.assign(path_view_loaded_data, rfi_project_status);
      break;

      default:  path_view_loaded_data = null;
   }

      if(path_view_loaded_data === null){
         res.redirect('/error?page=404')
      }
      else{
         path_view_loaded_data = {...path_view_loaded_data, agreement_id : agreement_id}
         res.render('questions', path_view_loaded_data); 
      }
     
}

/**
 * @Controller
 * @POST
 * @param rfi_questions
 * @summary 
 * @validation true
 */

// path = /rfi/questions/question
 export const POST_QUESTION = (req : express.Request, res : express.Response)=> {
    var {agreement_id} = req.query;
    //api 
    let redirect_path = `/rfi/questions?agreement_id=${agreement_id}&path_view=rfi_who`
    res.redirect(redirect_path);

 }

// path = /rfi/questions/who
 export const POST_WHO = (req : express.Request, res : express.Response)=> {
   var {agreement_id} = req.query;
   //-> backend api posting -> 
   let redirect_path = `/rfi/questions?agreement_id=${agreement_id}&path_view=rfi_vetting`
   res.redirect(redirect_path);
}