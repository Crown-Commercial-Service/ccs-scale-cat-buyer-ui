import * as axios from 'axios'

export class TenderApi {

    static Instance = (secret_token: string) : axios.AxiosInstance  => {
        return axios.default.create({
            baseURL: process.env.TENDERS_SERVICE_API_URL,
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${secret_token}`   
            }
        })
    }
}