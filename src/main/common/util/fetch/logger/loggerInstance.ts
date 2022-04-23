import * as axios from 'axios'
import  config from 'config'

/**
 * @Logger
 */
export class LoggerInstance {
    /**
     * @AxiosInstance
     */
    static Instance : axios.AxiosInstance = axios.default.create({
        baseURL: config.get('logger.baseURL'),
        headers: {
        'Content-Type': 'application/json',
        'ApiKey': process.env.LOGIT_API_KEY
        }
    })

}