import * as axios from 'axios'
import config from 'config'
export class bankholidayContentAPI {

    static Instance : axios.AxiosInstance = axios.default.create({
        
        baseURL: config.get('bankholidayservice.BASEURL'),
        headers: {
        'Content-Type': 'application/json'
            
        }

    })

}