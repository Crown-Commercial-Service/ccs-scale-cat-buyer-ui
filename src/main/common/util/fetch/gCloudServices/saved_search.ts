import * as axios from 'axios';

export class SavedSearchApi {
  static Instance = (secret_token: string): axios.AxiosInstance => {
    let API = axios.default.create({
      baseURL: process.env.TENDERS_SERVICE_API_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secret_token}`,
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
}
