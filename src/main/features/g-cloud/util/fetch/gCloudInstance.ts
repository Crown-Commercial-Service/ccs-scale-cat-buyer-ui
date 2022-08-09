import * as axios from 'axios'

export class GCloudInstanceInstance {

    static Instance = (SESSION_ID: string) => {
        return axios.default.create({
          baseURL: process.env.GCLOUD_API_BASE_URL,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${SESSION_ID}`,
          },
        });
      };
    
}


