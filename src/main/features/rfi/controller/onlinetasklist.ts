import * as express from 'express'
// import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import fileData from '../../../resources/content/RFI/rfionlineTaskList.json'

// RFI TaskList
export const GET_ONLINE_TASKLIST = async (req : express.Request, res : express.Response)=> {

   var {agreement_id} = req.query;
   
   try {
      // let fetch_dynamic_api = await DynamicFrameworkInstance.Instance.get('');
      // let fetch_dynamic_api_data = fetch_dynamic_api.data; 
      let select_default_data_from_fetch_dynamic_api = fileData;
      var display_fetch_data = {data : select_default_data_from_fetch_dynamic_api, agreement_id: agreement_id, file_data: fileData}
      res.render('onlinetasklist', display_fetch_data); 
   } catch (error) {
      res.redirect('/error')
   }
  
}