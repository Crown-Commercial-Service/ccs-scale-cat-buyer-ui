//@ts-nocheck
import * as express from 'express';
import {DynamicFrameworkInstance} from '../util/fetch/dyanmicframeworkInstance'
import {LoggTracer} from '../../../common/logtracer/tracer'
import {TokenDecoder} from '../../../common/tokendecoder/tokendecoder'
import { LoggTracer } from '../../../common/logtracer/tracer';
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';
import  moment from 'moment-business-days'
import * as cmsData from '../../../resources/content/RFI/rfi-response-date.json';


export const RESPONSEDATEHELPER = async(req: express.Request, res: express.Response, errorTriggered, errorItem)=> {
    const proc_id = req.session.projectId;
    const event_id = req.session.eventId;
    const {SESSION_ID} = req.cookies;
    let baseURL = `/tenders/projects/${proc_id}/events/${event_id}`;
    baseURL = baseURL+ '/criteria'
    const keyDateselector = "Key Dates";
 
 
    try {
        
        const fetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(baseURL);
        const fetch_dynamic_api_data = fetch_dynamic_api?.data;
        const extracted_criterion_based = fetch_dynamic_api_data?.map((criterian) => criterian?.id);
        let criterianStorage = [];
        for (const aURI of extracted_criterion_based) {
           const criterian_bas_url = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${aURI}/groups`;
           const fetch_criterian_group_data = await DynamicFrameworkInstance.Instance(SESSION_ID).get(criterian_bas_url);
           const criterian_array = fetch_criterian_group_data?.data;
           const rebased_object_with_requirements = criterian_array?.map((anItem) => {
              const object = anItem;
              object['criterianId'] = aURI;
              return object;
           })
           criterianStorage.push(rebased_object_with_requirements)
        }
 
        criterianStorage = criterianStorage.flat();
        criterianStorage = criterianStorage.filter(AField => AField.OCDS.id === keyDateselector)
        const prompt = criterianStorage[0].nonOCDS.prompt;
        const apiData_baseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 2/groups/${keyDateselector}/questions`;
        const fetchQuestions = await DynamicFrameworkInstance.Instance(SESSION_ID).get(apiData_baseURL);
        let  fetchQuestionsData = fetchQuestions.data;
        const  rfi_clarification_date = new Date().toLocaleDateString('en-uk', { weekday:"long", year:"numeric", month:"short", day:"numeric", hour: "2-digit", minute: "2-digit", second: "2-digit"})
        
 
        const  clarification_period_end_date = new Date();
        const  clarification_period_end_date_parsed = `${clarification_period_end_date.getDate()}-${clarification_period_end_date.getMonth()+1}-${clarification_period_end_date.getFullYear()}`;
        const rfi_clarification_period_end = moment(clarification_period_end_date_parsed, 'DD-MM-YYYY').businessAdd(4)._d 
        rfi_clarification_period_end.setHours(23);
        rfi_clarification_period_end.setMinutes(59);
        const DeadlinePeriodDate = rfi_clarification_period_end;
 
        const DeadlinePeriodDate_Parsed = `${DeadlinePeriodDate.getDate()}-${DeadlinePeriodDate.getMonth()+1}-${DeadlinePeriodDate.getFullYear()}`;
        const deadline_period_for_clarification_period  = moment(DeadlinePeriodDate_Parsed, 'DD-MM-YYYY').businessAdd(2)._d 
         deadline_period_for_clarification_period.setHours(23);
         deadline_period_for_clarification_period.setMinutes(59);
 
 
         const SupplierPeriodDate = deadline_period_for_clarification_period;
        const SupplierPeriodDate_Parsed = `${SupplierPeriodDate.getDate()}-${SupplierPeriodDate.getMonth()+1}-${SupplierPeriodDate.getFullYear()}`;
        const supplier_period_for_clarification_period  = moment(SupplierPeriodDate_Parsed, 'DD-MM-YYYY').businessAdd(4)._d 
         supplier_period_for_clarification_period.setHours(23);
         supplier_period_for_clarification_period.setMinutes(59);
 
 
         const SupplierPeriodDeadLine = supplier_period_for_clarification_period;
         const SupplierPeriodDeadLine_Parsed = `${SupplierPeriodDeadLine.getDate()}-${SupplierPeriodDeadLine.getMonth()+1}-${SupplierPeriodDeadLine.getFullYear()}`;
         const supplier_dealine_for_clarification_period  = moment(SupplierPeriodDeadLine_Parsed, 'DD-MM-YYYY').businessAdd(6)._d 
         supplier_dealine_for_clarification_period.setHours(23);
         supplier_dealine_for_clarification_period.setMinutes(59);
 
 
         fetchQuestionsData  =fetchQuestionsData.sort((current_element, next_element) =>{
            const currentElementID = Number(current_element.OCDS.id.split("Question ").join(""));
            const nextElementID = Number(next_element.OCDS.id.split("Question ").join(""));
            return currentElementID - nextElementID;
         });
 
        let appendData = {
            data: cmsData,
            prompt: prompt,
            framework: fetchQuestionsData,
            rfi_clarification_date,
            rfi_clarification_period_end: rfi_clarification_period_end.toLocaleTimeString('en-uk', { weekday:"long", year:"numeric", month:"short", day:"numeric", hour: "2-digit", minute: "2-digit"}),
            deadline_period_for_clarification_period : deadline_period_for_clarification_period.toLocaleTimeString('en-uk', { weekday:"long", year:"numeric", month:"short", day:"numeric", hour: "2-digit", minute: "2-digit"}),
            supplier_period_for_clarification_period: supplier_period_for_clarification_period.toLocaleTimeString('en-uk', { weekday:"long", year:"numeric", month:"short", day:"numeric", hour: "2-digit", minute: "2-digit"}),
            supplier_dealine_for_clarification_period : supplier_dealine_for_clarification_period.toLocaleTimeString('en-uk', { weekday:"long", year:"numeric", month:"short", day:"numeric", hour: "2-digit", minute: "2-digit"})
        
         }

         if(errorTriggered){
             appendData = {...appendData, error: true, errorMessage : errorItem}
         }
         
     
     res.render('response-date', appendData)
   
      } catch (error) {
         LoggTracer.errorLogger(res, error, `${req.headers.host}${req.originalUrl}`, null,
         TokenDecoder.decoder(SESSION_ID), "Tenders Service Api cannot be connected", true)        
      }
 
}