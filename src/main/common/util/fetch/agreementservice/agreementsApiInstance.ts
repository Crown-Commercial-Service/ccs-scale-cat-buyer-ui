import * as axios from 'axios'
import  config from 'config'

export class AgreementAPI {

    static Instance : axios.AxiosInstance = axios.default.create({
        baseURL: config.get('AgreementService.BASEURL'),
        headers: {
        'Content-Type': 'application/json'
        }
    })

}