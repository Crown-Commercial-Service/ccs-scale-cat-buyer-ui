const axios = require('axios');

export function getToken () {
  const _body = {
    "username": "cas_uat_28@yopmail.com",
    "password": "Password1234!",
    "client_id": "zyicrDa0oJsH4hULIWTNdadxQV477w45",
    "client_secret": "qW5Fl8VeJfF8JANFTFB8D4k_atevoBXVs3as5O-mDI2cG56eLqGiZtV0oMPgdt3T"
  };

    axios({
      method: 'post',
      url: 'https://tst.api.crowncommercial.gov.uk/security/test/oauth/token',
      headers: {
        'accept': 'application/json',
        'X-API-Key': `ff60479b004b4424916e062228e600eb`   
        },
      data: _body
    }).then(function (response:any) {
      return response.data.accessToken;
    });
}



     
