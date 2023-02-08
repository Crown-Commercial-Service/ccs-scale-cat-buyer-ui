//@ts-nocheck
const axios = require('axios');
import { getToken } from 'test/utils/getToken';

 module.exports.context_datas_gcloud = [];
// module.exports.assessment_datas = [];
 module.exports.context_nonOCDS_gcloud = [];
// module.exports.assessment_nonOCDS = [];

async function questionSetupGcloud(cid=1) {

 //return data;
 const OauthToken = await getToken();
    return axios({
      method: 'get',
      //url: `https://dev-ccs-scale-cat-service.london.cloudapps.digital/tenders/projects/13808/events/ocds-pfhb7i-14385/criteria/Criterion ${cid}/groups`,
      
      url:"https://dev-ccs-scale-cat-service.london.cloudapps.digital/tenders/projects/18693/events/ocds-pfhb7i-19465/criteria/Criterion 1/groups",
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${OauthToken}`,   
        },
    }).then(function (response:any) {
        
       // console.log("response.data",response.data);
        module.exports.context_datas_gcloud = response.data;
        return response.data;

      // module.exports.datas = response.data;
    //   if(cid == '2') module.exports.assessment_datas = response.data;
    //   if(cid == '3') module.exports.context_datas = response.data;
    //   return response.data;

    })
    .then(async function (groupDatas) {
       console.log("manytime")
      let nonOCDSDataGcloud = [];
      for(let i=0;i<groupDatas.length;i++){
          let singlenonOCDSListGcloud = [];
          let singlenonOCDSListsGcloud = await axios({
            method: 'get',
            
            //url: `https://dev-ccs-scale-cat-service.london.cloudapps.digital/tenders/projects/13808/events/ocds-pfhb7i-14385/criteria/Criterion ${cid}/groups/${groupDatas[i].OCDS.id}/questions`,
            url: `https://dev-ccs-scale-cat-service.london.cloudapps.digital/tenders/projects/18693/events/ocds-pfhb7i-19465/criteria/Criterion 1/groups/${groupDatas[i].OCDS.id}/questions`,
            headers: {
              'accept': 'application/json',
              'Authorization': `Bearer ${OauthToken}`,   
              },
          }).then(function (res) {
            let fetch_dynamic_api_data = res?.data;
            fetch_dynamic_api_data = fetch_dynamic_api_data.sort((n1, n2) => n1.nonOCDS.order - n2.nonOCDS.order);
            
            //console.log("fetch_dynamic_api_data",JSON.stringify(fetch_dynamic_api_data));

            const form_name = fetch_dynamic_api_data?.map((aSelector: any) => {
              const questionNonOCDS = {
                groupId: groupDatas[i].OCDS.id,
                question_id: aSelector.OCDS.id,
                questionType: aSelector.nonOCDS.questionType,
                mandatory: aSelector.nonOCDS.mandatory,
                multiAnswer: aSelector.nonOCDS.multiAnswer,
                length: aSelector.nonOCDS.length,
              };
              singlenonOCDSListGcloud.push(questionNonOCDS);
            });
            return singlenonOCDSListGcloud;
          });
          
          nonOCDSDataGcloud.push(...singlenonOCDSListsGcloud);
      }
      //console.log('nonOCDSData121212',JSON.stringify(nonOCDSDataGcloud))
        //   if(cid == '2') module.exports.assessment_nonOCDS = nonOCDSData;
        //   if(cid == '3') module.exports.context_nonOCDS = nonOCDSData;
      module.exports.context_nonOCDS_gcloud = nonOCDSDataGcloud
      return nonOCDSDataGcloud;
    });
}

module.exports.questionSetupGcloud = questionSetupGcloud



     
