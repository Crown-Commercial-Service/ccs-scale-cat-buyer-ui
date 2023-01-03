//@ts-nocheck
import * as express from 'express'
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import fileData from '../../../resources/content/RFI/rfionlineTaskList.json'
import { operations } from '../../../utils/operations/operations';
import { ErrorView } from '../../../common/shared/error/errorView';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { HttpStatusCode } from 'main/errors/httpStatusCodes';
import {ShouldEventStatusBeUpdated} from '../../shared/ShouldEventStatusBeUpdated';
import { logConstant } from '../../../common/logtracer/logConstant';

// RFI TaskList
/**
 * 
 * @param req 
 * @param res 
 * @GETController
 */
export const GET_ONLINE_TASKLIST = async (req: express.Request, res: express.Response) => {
   // if (operations.isUndefined(req.query, 'agreement_id') || operations.isUndefined(req.query, 'proc_id') || operations.isUndefined(req.query, 'event_id')) {
   //    res.redirect(ErrorView.notfound)
   // }
   // else {
      const { agreement_id, projectId, eventId } = req.session;
      
      const { SESSION_ID } = req.cookies;

      const baseURL: any = `/tenders/projects/${projectId}/events/${eventId}/criteria`;
      
     // let response = await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/10`, status);
        

      try {
         
          let { data: journeySteps } = await TenderApi.Instance(SESSION_ID).get(`journeys/${eventId}/steps`);
        let journeys=journeySteps.find(item => item.step == 10);
        
        if(journeys.state !='Completed'){
          await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/10`, 'In progress');
        }
      

         let fetch_dynamic_api_data;
         if(agreement_id == 'RM6263') {   //DSP
            const fetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(baseURL);
            fetch_dynamic_api_data = fetch_dynamic_api?.data;
         } else if(agreement_id == 'RM6187' || agreement_id == 'RM1557.13') {  //MCF3
            const fetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(baseURL);//new Object([{"offlineNonOCDS":false,"id":"Criterion 1","title":"Buyer Details","description":"For Information Only"}]);
            fetch_dynamic_api_data = fetch_dynamic_api?.data;
         }else if(agreement_id == 'RM1043.8') {  //DOS
            const fetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(baseURL);
            fetch_dynamic_api_data = fetch_dynamic_api?.data;
         }
      
         //CAS-INFO-LOG 
         LoggTracer.infoLogger(fetch_dynamic_api_data, logConstant.buildYourRfiQuestionList, req);

         const extracted_criterion_based = fetch_dynamic_api_data?.map((criterian: any) => criterian?.id);
         let criterianStorage: any = [];
         for (const aURI of extracted_criterion_based) {
            let criterian_array;
            if(agreement_id == 'RM6263') {   //DSP
               const criterian_bas_url = `/tenders/projects/${projectId}/events/${eventId}/criteria/${aURI}/groups`;
               const fetch_criterian_group_data = await DynamicFrameworkInstance.Instance(SESSION_ID).get(criterian_bas_url);
               criterian_array = fetch_criterian_group_data?.data;
            } else if(agreement_id == 'RM6187') {  //MCF3
               const criterian_bas_url = `/tenders/projects/${projectId}/events/${eventId}/criteria/${aURI}/groups`;
               const fetch_criterian_group_data = await DynamicFrameworkInstance.Instance(SESSION_ID).get(criterian_bas_url);//new Object([{"nonOCDS":{"prompt":"Select the highest level of security clearance that staff supplied to the project will need to have.","task":"Add security and vetting requirements","mandatory":true,"order":5},"OCDS":{"id":"Group 5","description":"Security and vetting requirements"}},{"nonOCDS":{"prompt":"Select the locations where you would expect the staff supplied to work. You can select multiple locations or if you do not need them to work in an office you can select ‘No specific location’.","task":"Add location","mandatory":true,"order":6},"OCDS":{"id":"Group 6","description":"Where the supplied staff will work"}},{"nonOCDS":{"prompt":"<p class=\"govuk-body\">Name the organisation who will use the products or services you are buying through this procurement.</p><p class=\"govuk-body\">Some organisations might procure products and services on behalf of another organisation who then use and pay for what was procured.</p>","task":"Add buyer details","mandatory":false,"order":4},"OCDS":{"id":"Group 4","description":"Who the buying organization is"}},{"nonOCDS":{"prompt":"You can ask suppliers up to 10 questions. These questions can help you to better understand costs, time needed for the work and the types of products and services they can offer. You can edit and remove questions before you save and continue or before you publish your RfI.","task":"Add up to 10 questions for suppliers to answer","mandatory":true,"order":1},"OCDS":{"id":"Group 1","description":"Ask suppliers questions"}},{"nonOCDS":{"prompt":"<p>To help suppliers understand what problem you want to solve, you will need to give them more\n      information about what you are looking for, for example:</p> <ul class=\"govuk-list govuk-list--bullet\">\n      <li>information about your company or the users</li>\n      <li>outcomes you want to achieve</li>\n      <li>the timeframes for completing the work</li>\n      <li> reasons for the change ( for example legal, regulatory or replacing an existing service)</li>\n      <li> any risks or challenges they should be aware of</li>\n      <li> any impacts on the organisation if you do not do the work needed or complete it in the timeframes given</li>\n    </ul>","task":"Add information about the project","mandatory":true,"order":3},"OCDS":{"id":"Group 3","description":"Background for your procurement"}},{"nonOCDS":{"prompt":"  <p class=\"govuk-body\">A suggested timeline of 10 working days is already entered below. This takes the process up to when suppliers have submitted their responses, and allows a further 6 working days for you to decide what to do next and confirm that to the suppliers.</p> \n        \n        <p class=\"govuk-body\">There are:\n           </p><ul class=\"govuk-list govuk-list--bullet\" style=\"margin-left: 10px;margin-top: -13px;\"><li> 4 working days from publishing the RfI until the clarification period closes</li> \n           <li>2 working days from the clarification period closing to publishing your responses to the clarification questions</li>\n        <li>4 working days from publishing responses to the clarification questions to the deadline for suppliers to submit their response</li></ul><p></p>\n\n        <p class=\"govuk-body\">The clarification period is when suppliers can ask you further questions before submitting their information. You must meet the deadline you set for responding to their questions.</p>\n\n        <p class=\"govuk-body\"><strong>You can change the length of time for each section to more suitable times for you.</strong></p>\n       <br>","task":"Your RfI timeline","mandatory":true,"order":7},"OCDS":{"id":"Key Dates","description":"Your RfI timeline"}},{"nonOCDS":{"prompt":"Define any terms and acronyms that suppliers may not be familiar with. This will help all suppliers to understand what they mean.","task":"Add another term or acronym","mandatory":false,"order":2},"OCDS":{"id":"Group 2","description":"Terms and acronyms"}}]);
               criterian_array = fetch_criterian_group_data?.data;
            } else if(agreement_id == 'RM1043.8') {  //DOS
               const criterian_bas_url = `/tenders/projects/${projectId}/events/${eventId}/criteria/${aURI}/groups`;
               const fetch_criterian_group_data = await DynamicFrameworkInstance.Instance(SESSION_ID).get(criterian_bas_url);//new Object([{"nonOCDS":{"prompt":"Select the highest level of security clearance that staff supplied to the project will need to have.","task":"Add security and vetting requirements","mandatory":true,"order":5},"OCDS":{"id":"Group 5","description":"Security and vetting requirements"}},{"nonOCDS":{"prompt":"Select the locations where you would expect the staff supplied to work. You can select multiple locations or if you do not need them to work in an office you can select ‘No specific location’.","task":"Add location","mandatory":true,"order":6},"OCDS":{"id":"Group 6","description":"Where the supplied staff will work"}},{"nonOCDS":{"prompt":"<p class=\"govuk-body\">Name the organisation who will use the products or services you are buying through this procurement.</p><p class=\"govuk-body\">Some organisations might procure products and services on behalf of another organisation who then use and pay for what was procured.</p>","task":"Add buyer details","mandatory":false,"order":4},"OCDS":{"id":"Group 4","description":"Who the buying organization is"}},{"nonOCDS":{"prompt":"You can ask suppliers up to 10 questions. These questions can help you to better understand costs, time needed for the work and the types of products and services they can offer. You can edit and remove questions before you save and continue or before you publish your RfI.","task":"Add up to 10 questions for suppliers to answer","mandatory":true,"order":1},"OCDS":{"id":"Group 1","description":"Ask suppliers questions"}},{"nonOCDS":{"prompt":"<p>To help suppliers understand what problem you want to solve, you will need to give them more\n      information about what you are looking for, for example:</p> <ul class=\"govuk-list govuk-list--bullet\">\n      <li>information about your company or the users</li>\n      <li>outcomes you want to achieve</li>\n      <li>the timeframes for completing the work</li>\n      <li> reasons for the change ( for example legal, regulatory or replacing an existing service)</li>\n      <li> any risks or challenges they should be aware of</li>\n      <li> any impacts on the organisation if you do not do the work needed or complete it in the timeframes given</li>\n    </ul>","task":"Add information about the project","mandatory":true,"order":3},"OCDS":{"id":"Group 3","description":"Background for your procurement"}},{"nonOCDS":{"prompt":"  <p class=\"govuk-body\">A suggested timeline of 10 working days is already entered below. This takes the process up to when suppliers have submitted their responses, and allows a further 6 working days for you to decide what to do next and confirm that to the suppliers.</p> \n        \n        <p class=\"govuk-body\">There are:\n           </p><ul class=\"govuk-list govuk-list--bullet\" style=\"margin-left: 10px;margin-top: -13px;\"><li> 4 working days from publishing the RfI until the clarification period closes</li> \n           <li>2 working days from the clarification period closing to publishing your responses to the clarification questions</li>\n        <li>4 working days from publishing responses to the clarification questions to the deadline for suppliers to submit their response</li></ul><p></p>\n\n        <p class=\"govuk-body\">The clarification period is when suppliers can ask you further questions before submitting their information. You must meet the deadline you set for responding to their questions.</p>\n\n        <p class=\"govuk-body\"><strong>You can change the length of time for each section to more suitable times for you.</strong></p>\n       <br>","task":"Your RfI timeline","mandatory":true,"order":7},"OCDS":{"id":"Key Dates","description":"Your RfI timeline"}},{"nonOCDS":{"prompt":"Define any terms and acronyms that suppliers may not be familiar with. This will help all suppliers to understand what they mean.","task":"Add another term or acronym","mandatory":false,"order":2},"OCDS":{"id":"Group 2","description":"Terms and acronyms"}}]);
               criterian_array = fetch_criterian_group_data?.data;
            } else { //Default
               const criterian_bas_url = `/tenders/projects/${projectId}/events/${eventId}/criteria/${aURI}/groups`;
               const fetch_criterian_group_data = await DynamicFrameworkInstance.Instance(SESSION_ID).get(criterian_bas_url);
               criterian_array = fetch_criterian_group_data?.data;
            }

            const rebased_object_with_requirements = criterian_array?.map((anItem: any) => {
               const object = anItem;
               object['criterianId'] = aURI;
               return object;
            })
            criterianStorage.push(rebased_object_with_requirements)
         }
         criterianStorage = criterianStorage.flat();
         const sorted_ascendingly = criterianStorage.map((aCriterian: any) => {
            const object = aCriterian;
            object.OCDS['id'] = aCriterian.OCDS['id']?.split('Group ').join('');
            return object;
         }).sort((a, b) => (a.OCDS.id < b.OCDS.id ? -1 : 1)).map((aCriterian: any) => {
            const object = aCriterian;
            object.OCDS['id'] = `Group ${aCriterian.OCDS['id']}`;
            if(object.nonOCDS['mandatory'] === false)
               object.OCDS['description'] = object.OCDS['description']+' (Optional)'
            return object;
         });
         const select_default_data_from_fetch_dynamic_api = sorted_ascendingly;
         const lotId = req.session?.lotId;
         const agreementLotName = req.session.agreementLotName;
         let ExcludingKeyDates = select_default_data_from_fetch_dynamic_api.filter(AField => AField.OCDS.id !== "Group Key Dates");
         let text="";
         for (var i=0;i<ExcludingKeyDates.length;i++)
         {
            text=ExcludingKeyDates[i].OCDS.description;
            switch(text)
            {
               case "Who the buying organization is (Optional)":
                  ExcludingKeyDates[i].OCDS.description="The buying organisation (optional)";
                  ExcludingKeyDates[i].nonOCDS.task="Add who the procurement is for";
                  break;
               case "Where the supplied staff will work":
                  ExcludingKeyDates[i].nonOCDS.task="Select location";
                  break;
               case "Terms and acronyms (Optional)":
                  ExcludingKeyDates[i].OCDS.description="Terms and acronyms (optional)";
                  break;
               case "Background for your procurement":
                  ExcludingKeyDates[i].nonOCDS.task="Add more information for suppliers";
                  break;
               case "Security and vetting requirements":
               ExcludingKeyDates[i].nonOCDS.task="Choose the highest level of clearance needed";
               break;
            }
         }
         const releatedContent = req.session.releatedContent;

         // const questionOverideInit = ExcludingKeyDates.map(async (el: any, i: any) => {
         //    const baseURLFetch: any = `/tenders/projects/${projectId}/events/${eventId}/criteria/${el.criterianId}/groups/${el.OCDS.id}/questions`;
         //    const fetch = await DynamicFrameworkInstance.Instance(SESSION_ID).get(baseURLFetch);
         //    let fetchData = fetch?.data;
         //    ExcludingKeyDates[i].push({'questionStatus': 'Done'});
         // });         
         for (let index = 0; index < ExcludingKeyDates.length; index++) {
            ExcludingKeyDates[index].questionStatus = 'todo';
            const baseURLQ: any = `/tenders/projects/${projectId}/events/${eventId}/criteria/${ExcludingKeyDates[index].criterianId}/groups/${ExcludingKeyDates[index].OCDS.id}/questions`;            
            const fetch_dynamic_api2 = await DynamicFrameworkInstance.Instance(SESSION_ID).get(baseURLQ);
            let fetch_dynamic_api_data2 = fetch_dynamic_api2?.data;
            fetch_dynamic_api_data2 = fetch_dynamic_api_data2.sort((a, b) => (a.OCDS.id < b.OCDS.id ? -1 : 1));
            for (let j = 0; j < fetch_dynamic_api_data2.length; j++) {
              if (fetch_dynamic_api_data2[j].nonOCDS.questionType == 'SingleSelect' || fetch_dynamic_api_data2[j].nonOCDS.questionType == 'MultiSelect') {
                let questionOptions = fetch_dynamic_api_data2[j].nonOCDS.options;
                let item1 = questionOptions.find(i => i.selected === true);
                if(item1){
                  ExcludingKeyDates[index].questionStatus = 'Done';
                }
    
              } else {
                
                if (fetch_dynamic_api_data2[j].nonOCDS.options.length > 0) {
                  
                  ExcludingKeyDates[index].questionStatus = 'Done';
                } else {
                }
              }
            }
    
          }
          
         const display_fetch_data = {
            data: ExcludingKeyDates,
            agreement_id: agreement_id,
            file_data: fileData,
            proc_id: projectId,
            event_id: eventId,
            lotId,
            agreementLotName,
            releatedContent: releatedContent
         }
         
      //CAS-INFO-LOG 
      LoggTracer.infoLogger(null, logConstant.buildYourRfiPageLog, req);

         res.render('onlinetasklist', display_fetch_data);
         // const response = await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/9`, 'Completed');
         // if (response.status == HttpStatusCode.OK){
            // await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/10`, 'Completed');
            // await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/11`, 'Completed');
            
           
      } catch (error) {
         
         LoggTracer.errorLogger(res, error, `${req.headers.host}${req.originalUrl}`, null,
            TokenDecoder.decoder(SESSION_ID), "RFI Online Task List - Tenders Service Api cannot be connected", true)
      }
   }
//}
