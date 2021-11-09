import * as express from 'express'
import {OrganizationInstance} from '../util/fetch/organizationuserInstance'


export const GET_LEAD_PROCUREMENT = async (req : express.Request, res : express.Response)=> { 
    let organization_id = req.session.user.payload.ciiOrgId;
   req.session['organizationId'] = organization_id;

   let organisation_user_endpoint = `organisation-profiles/${req.session?.['organizationId']}/users`
   let organisation_user_data  = await OrganizationInstance.OrganizationUserInstance().get(organisation_user_endpoint);
   organisation_user_data = organisation_user_data?.data
   const windowAppendData = { userdata: organisation_user_data}
    res.render('procurementlead', windowAppendData);
}