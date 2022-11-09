import * as axios from 'axios'

export class gCloudApi {

    static searchInstance = (secret_token: string) : axios.AxiosInstance  => {
        return axios.default.create({
            baseURL: process.env.GCLOUD_SEARCH_API_URL,
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${secret_token}`   
            }
        })
    }

    static supplierInstance = (secret_token: string) : axios.AxiosInstance  => {
        return axios.default.create({
            baseURL: process.env.GCLOUD_SUPPLIER_API_URL,
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${secret_token}`   
            }
        })
    }

    static serviceInstance = (secret_token: string) : axios.AxiosInstance  => {
        return axios.default.create({
            baseURL: process.env.GCLOUD_SERVICES_API_URL,
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${secret_token}`   
            }
        })
    }

    static file_dowload_Instance = (SESSION_ID : string) => {

        return  axios.default.create({
            baseURL: process.env.TENDERS_SERVICE_API_URL,
            headers: {
            'Authorization': `Bearer ${SESSION_ID}`
            },
            responseType: 'stream'
        })

    }
    
}