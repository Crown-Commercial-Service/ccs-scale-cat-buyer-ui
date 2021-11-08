import * as express from 'express'
import * as cmsData from '../../../resources/content/RFI/rfiTaskList.json'
import { OrganizationInstance } from '../util/fetch/organizationuserInstance'

// RFI ADD_Collaborator
export const GET_ADD_COLLABORATOR = async (req: express.Request, res: express.Response) => {

    let organization_id = '849851633428287029'
    req.session['organizationId'] = organization_id;

    let organisation_user_endpoint = `organisation-profiles/${req.session?.['organizationId']}/users`
    let organisation_user_data = await OrganizationInstance.OrganizationUserInstance().get(organisation_user_endpoint);
    organisation_user_data = organisation_user_data?.data
    const windowAppendData = { data: cmsData, userdata: organisation_user_data }
    res.render('add-collaborator', windowAppendData);
}