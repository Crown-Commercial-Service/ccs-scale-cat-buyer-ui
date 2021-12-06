//@ts-nocheck
import * as express from 'express';
import * as cmsData from '../../../resources/content/RFI/rfi-response-date.json';
import {DynamicFrameworkInstance} from '../util/fetch/dyanmicframeworkInstance'
import {LoggTracer} from '../../../common/logtracer/tracer'
import {TokenDecoder} from '../../../common/tokendecoder/tokendecoder'

///rfi/response-date
export const GET_RESPONSE_DATE = async  (req: express.Request, res: express.Response) => {

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
        const fetchQuestionsData = fetchQuestions.data;
       
        const appendData = {
            data: cmsData,
            prompt: prompt,
            framework: fetchQuestionsData
        }
    
    
    res.render('response-date', appendData)
  
     } catch (error) {
        LoggTracer.errorLogger(res, error, `${req.headers.host}${req.originalUrl}`, null,
        TokenDecoder.decoder(SESSION_ID), "Tenders Service Api cannot be connected", true)        
     }


}


export const POST_RESPONSE_DATE = (req: express.Request, res: express.Response) => {
 
res.redirect('/rfi/review')

}