import * as express from 'express'
import * as cmsData from '../../../resources/content/RFI/rfiTaskList.json'
import * as QuestionCmsData from '../../../resources/content/RFI/rfiquestions/information.json'
import * as whoCmsData from '../../../resources/content/RFI/rfiquestions/who.json'

/**
 * @Controller
 * @GET
 * @summary switches query related to specific parameter 
 * @validation false
 */
export const GET_QUESTIONS = (req : express.Request, res : express.Response)=> {

   var {path_view} = req.query;

   var path_view_loaded_data: any = {};
   
   switch(path_view){

      case 'rfi_questions':
         var rfi_questions_data: Object = {data : QuestionCmsData}
         Object.assign(path_view_loaded_data, rfi_questions_data);
      break;

      case 'rfi_who':
         var rfi_who : Object = {data : whoCmsData}
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
  console.log(req.body)

 }