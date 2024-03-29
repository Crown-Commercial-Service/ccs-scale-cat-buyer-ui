import * as axios from 'axios';

export class DynamicFrameworkInstance {
  static Instance = (SESSION_ID: string) => {
    return axios.default.create({
      baseURL: process.env.TENDERS_SERVICE_API_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SESSION_ID}`,
      },
    });
  };

  static file_Instance = (SESSION_ID: string) => {
    return axios.default.create({
      baseURL: process.env.TENDERS_SERVICE_API_URL,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${SESSION_ID}`,
      },
    });
  };

  static file_dowload_Instance = (SESSION_ID: string) => {
    return axios.default.create({
      baseURL: process.env.TENDERS_SERVICE_API_URL,
      headers: {
        Authorization: `Bearer ${SESSION_ID}`,
      },
      responseType: 'stream',
    });
  };
}
