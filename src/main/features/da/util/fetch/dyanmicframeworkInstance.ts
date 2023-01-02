import * as axios from 'axios';

export class DynamicFrameworkInstance {
  static Instance = (SESSION_ID: string) => {
    let API = axios.default.create({
      baseURL: process.env.TENDERS_SERVICE_API_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SESSION_ID}`,
      },
    });
    API.interceptors.request.use(
      (config :any) => {
        const newConfig = { ...config }
        newConfig.metadata = { startTime: new Date() }
        return newConfig
      },
      error => {
        return Promise.reject(error)
      }
    )
    API.interceptors.response.use(
      (response :any) => {
        const newRes = { ...response }
        newRes.config.metadata.endTime = new Date()
        newRes.duration =
          newRes.config.metadata.endTime - newRes.config.metadata.startTime
        return newRes
      },
      error => {
        const newError = { ...error }
        newError.config.metadata.endTime = new Date()
        newError.duration =
          newError.config.metadata.endTime - newError.config.metadata.startTime
        return Promise.reject(newError)
      }
    )
  return API;
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
