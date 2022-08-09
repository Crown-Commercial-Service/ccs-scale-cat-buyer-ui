import * as axios from 'axios'

export class GCloud_SearchAPI_Instance {

    static Instance = (SESSION_ID: string) => {
        return axios.default.create({
          baseURL: process.env.GCLOUD_SEARCH_API_BASE_URL,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${SESSION_ID}`,
          },
        });
      };
    
}

export class GCloud_Supplier_API_Instance {

    static Instance = (SESSION_ID: string) => {
        return axios.default.create({
          baseURL: process.env.GCLOUD_SUPPLIER_API_BASE_URL,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${SESSION_ID}`,
          },
        });
      };
    
}


