//@ts-nocheck
const axios = require('axios');
import { getToken } from 'test/utils/getToken';

module.exports.context_datas = [];
module.exports.assessment_datas = [];
module.exports.context_nonOCDS = [];
module.exports.assessment_nonOCDS = [];

async function questionSetup(cid) {

 //return data;
 const OauthToken = await getToken();
    return axios({
      method: 'get',
      url: `https://dev-ccs-scale-cat-service.london.cloudapps.digital/tenders/projects/13808/events/ocds-pfhb7i-14385/criteria/Criterion ${cid}/groups`,
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${OauthToken}`,   
        },
    }).then(function (response:any) {
      // module.exports.datas = response.data;
      if(cid == '2') module.exports.assessment_datas = response.data;
      if(cid == '3') module.exports.context_datas = response.data;
      return response.data;
    }).then(async function (groupDatas) {
      let nonOCDSData = [];
      for(let i=0;i<groupDatas.length;i++){
          let singlenonOCDSList = [];
          let singlenonOCDSLists = await axios({
            method: 'get',
            url: `https://dev-ccs-scale-cat-service.london.cloudapps.digital/tenders/projects/13808/events/ocds-pfhb7i-14385/criteria/Criterion ${cid}/groups/${groupDatas[i].OCDS.id}/questions`,
            headers: {
              'accept': 'application/json',
              'Authorization': `Bearer ${OauthToken}`,   
              },
          }).then(function (res) {
            let fetch_dynamic_api_data = res?.data;
            fetch_dynamic_api_data = fetch_dynamic_api_data.sort((n1, n2) => n1.nonOCDS.order - n2.nonOCDS.order);
            const form_name = fetch_dynamic_api_data?.map((aSelector: any) => {
              const questionNonOCDS = {
                groupId: groupDatas[i].OCDS.id,
                questionId: aSelector.OCDS.id,
                questionType: aSelector.nonOCDS.questionType,
                mandatory: aSelector.nonOCDS.mandatory,
                multiAnswer: aSelector.nonOCDS.multiAnswer,
                length: aSelector.nonOCDS.length,
              };
              singlenonOCDSList.push(questionNonOCDS);
            });
            return singlenonOCDSList;
          });
          
          nonOCDSData.push(...singlenonOCDSLists);
      }
      //console.log('nonOCDSData',nonOCDSData)
      if(cid == '2') module.exports.assessment_nonOCDS = nonOCDSData;
      if(cid == '3') module.exports.context_nonOCDS = nonOCDSData;

      return nonOCDSData;
    });
}

module.exports.questionSetup = questionSetup



     
