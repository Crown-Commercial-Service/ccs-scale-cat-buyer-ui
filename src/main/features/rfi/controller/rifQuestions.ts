import * as express from 'express'
import * as cmsData from '../../../resources/content/RFI/rfiTaskList.json'
// RFI TaskList
export const RFI_QUESTIONS = (req : express.Request, res : express.Response)=> {

   var {path_view} = req.query;

   var path_view_loaded_data: any = {};
   
   switch(path_view){

      case 'rfi_questions':
         var rfi_questions_data: Object = {data : cmsData}
         Object.assign(path_view_loaded_data, rfi_questions_data);
      break;

      case 'online_task_list':
         var online_task_list : Object = {data : cmsData}
         Object.assign(path_view_loaded_data, online_task_list);
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