import * as axios from 'axios';

export class DynamicFrameworkInstance {
  static Instance = (SESSION_ID: string) => {
    return axios.default.create({
      baseURL: process.env.TENDERS_SERVICE_API_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SESSION_ID}`,
        'Cache-Control': 'must-revalidate, no-store, no-cache, private',
      },
    });
  };
}
