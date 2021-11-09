import * as axios from 'axios';

export class contentAPI {

    static Instance : axios.AxiosInstance = axios.default.create({
        baseURL: process.env['AGREEMENTS_SERVICE_API_URL'],
        timeout: 1000 * 5, // Wait for 5 seconds
        headers: {
        'Content-Type': 'application/json'
        }
    })
}
