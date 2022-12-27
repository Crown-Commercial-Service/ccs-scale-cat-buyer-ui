import * as axios from 'axios';
import * as http from 'http'; //ES 6
import * as https from 'https'; //ES 6

export class TenderApi {

    static InstanceKeepAlive = (secret_token: string) : axios.AxiosInstance  => {
        const httpAgent = new http.Agent({ keepAlive: true });
        const httpsAgent = new https.Agent({ keepAlive: true });
        return axios.default.create({
            baseURL: process.env.TENDERS_SERVICE_API_URL,
            httpAgent,  // httpAgent: httpAgent -> for non es6 syntax
            httpsAgent,
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${secret_token}`   
            }
        })
    }
    
    // static Instance = (secret_token: string) : axios.AxiosInstance  => {
    //     return axios.default.create({
    //         baseURL: process.env.TENDERS_SERVICE_API_URL,
    //         headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${secret_token}`   
    //         }
    //     })
    // }

    static Instance = (secret_token: string) : axios.AxiosInstance  => {
        let API = axios.default.create({
            baseURL: process.env.TENDERS_SERVICE_API_URL,
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${secret_token}`   
            }
        })

        
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
    }


    //For Getting Supplier ratecard
    static supplierInstance = (secret_token: string) : axios.AxiosInstance  => {
        return axios.default.create({
            baseURL: process.env.TENDERS_SERVICE_API_URL,
            headers: {
            'Content-Type': 'application/json',
            'mime-Type':'application/json',
            'Authorization': `Bearer ${secret_token}`   
            }
        })
    }
}