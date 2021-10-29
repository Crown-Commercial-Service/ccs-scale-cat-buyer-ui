import * as axios from 'axios'

export class TenderApiInstance {

    static Instance : axios.AxiosInstance = axios.default.create({
        baseURL: process.env.TENDERS_SERVICE_API_URL,
        headers: {
        'Content-Type': 'application/json'
        }
    })

}