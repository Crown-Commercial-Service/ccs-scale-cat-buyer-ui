import * as axios from 'axios'

export class OrganizationInstance {

    static OrganizationUserInstance = () => {

        return axios.default.create({
            baseURL: process.env['CONCLAVE_WRAPPER_API_BASE_URL'],
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': `${process.env['CONCLAVE_WRAPPER_API_KEY']}`
            }
        })
    }
}



