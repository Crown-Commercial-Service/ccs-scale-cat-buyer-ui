import * as axios from 'axios';

export class AgreementAPI {

    static Instance: axios.AxiosInstance = axios.default.create({
        baseURL: process.env['AGREEMENTS_SERVICE_API_URL'],
        headers: {
            'Content-Type': 'application/json'
        }
    })

}