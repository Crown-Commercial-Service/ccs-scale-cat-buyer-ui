const axios = require('axios');
import { getToken } from 'test/utils/getToken';

export async function getLots () {
    const OauthTokens =  await getToken();
    console.log("OauthTokens1212",OauthTokens)
  return axios({
    method: 'get',
            url:  `https://dev-ccs-scale-shared-agreements-service.london.cloudapps.digital/agreements/RM6187`,
            headers: {
              'accept': 'application/json',
              'Authorization': `Bearer ${OauthTokens}`,   
              },
}).then(function (response:any) {
    return response;
    });

}



     
