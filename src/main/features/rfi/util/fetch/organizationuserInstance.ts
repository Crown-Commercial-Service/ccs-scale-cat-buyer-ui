import * as axios from 'axios'

export class OrganizationInstance {

    static OrganizationUserInstance = () => {

            return  axios.default.create({
                baseURL: process.env['AUTH_SERVER_BASE_URL'],
                headers: {
                'Content-Type': 'application/json',
                'x-api-key': `${process.env['CONCLAVE_KEY']}`
                }
            })
    }
}
