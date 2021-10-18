import * as axios from 'axios'
import config from 'config'



export class DynamicFrameworkInstance {

    static Instance = axios.default.create({
        baseURL: config.get('dynamic_framework.BASEURL'),
        headers: {
        'Content-Type': 'application/json'
        }
    })

}