import * as axios from 'axios'
import config from 'config'

export class contentAPI {

    static Instance : axios.AxiosInstance = axios.default.create({

        baseURL: config.get('contentService.BASEURL'),
        headers: {
        'Content-Type': 'application/json'
        }

    })

}