//@ts-nocheck
const axios = require('axios');
import { getToken } from 'test/utils/getToken';
import * as journyData from '../data/taskList.json';

 module.exports.getProJson = [];
// module.exports.assessment_datas = [];
 module.exports.context_nonOCDS = [];
// module.exports.assessment_nonOCDS = [];

async function getProcurmentJson(cid=1) {
console.log("JSONNNN");
// const _body = {
//     'journey-id': req.session.eventId,
//     states: journyData.states,
//   };

// await TenderApi.Instance(SESSION_ID).post(`journeys`, _body);
// const JourneyStatus = await TenderApi.Instance(SESSION_ID).get(`journeys/${req.session.eventId}/steps`);
// req.session['journey_status'] = JourneyStatus?.data;

 const OauthToken = await getToken();
    return axios({
      method: 'post',
      //url: `https://dev-ccs-scale-cat-service.london.cloudapps.digital/tenders/projects/13808/events/ocds-pfhb7i-14385/criteria/Criterion ${cid}/groups`,
      url:"https://dev-ccs-scale-cat-service.london.cloudapps.digital/tenders/projects/agreements",
      data: {
        agreementId: 'RM6187',
        lotId: 'Lot 2'
      },
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${OauthToken}`,   
        },
    }).then(function (response:any) {
        let responseData = {
            "lotId": "Lot 2",
            "agreementLotName": "test",
            "agreementName": "test",
            "agreement_id": "RM6187",
            "isRFIComplete": false,
            "cookie": {},
            "procurements":response.data,
            "projectId": response.data.procurementID,
            "eventId": response.data.eventId,
            "project_name":response.data['defaultName']['name'],
            "selectedRoute":"RFI",  
            "types":[
                'DA',  'DAA',
                'FCA', 'PA',
                'EOI', 'FC',
                'RFI'
              ]
        }
        responseData.procurements.started=true;
        module.exports.getProJson = responseData;
        return responseData;

    }).then(async function (groupDatas) {

        const _body = {
            'journey-id': groupDatas.eventId,
            states: journyData.states,
          };
console.log("update")
         let journeyUpdate = await axios({
           method: 'post',
           url:  `https://dev-ccs-scale-cat-service.london.cloudapps.digital/journeys`,
           data: _body,
           headers: {
             'accept': 'application/json',
             'Authorization': `Bearer ${OauthToken}`,   
             },
         })

         let journDummy = await axios({
            method: 'get',
            url:  `https://dev-ccs-scale-cat-service.london.cloudapps.digital/journeys/${groupDatas.eventId}/steps`,
            headers: {
              'accept': 'application/json',
              'Authorization': `Bearer ${OauthToken}`,   
              },
          }).then(function (journeyVa) {
            //groupDatas.selectedRoute="RFI";
            groupDatas['journey_status']=journeyVa.data;
            return groupDatas;
       // console.log("RESPONSE DATA",res.data)
        })

       // tenders/projects/18509/events/ocds-pfhb7i-19281
        // FOR TBD data: {
        //     nonOCDS: {
        //         eventType:"RFI"
        //     },
            
        //   },
    console.log("groupDatas",groupDatas);
           let singlenonOCDSList = [];
            let singlenonOCDSLists = await axios({
              method: 'put',
              url:  `https://dev-ccs-scale-cat-service.london.cloudapps.digital/tenders/projects/${groupDatas.projectId}/events/${groupDatas.eventId}`,
              data: {
                  eventType:"RFI"
              },
              headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${OauthToken}`,   
                },
            }).then(function (res) {
                groupDatas.currentEvent=res.data;
                return groupDatas;
            })

      });
    
}

module.exports.getProcurmentJson = getProcurmentJson



     
