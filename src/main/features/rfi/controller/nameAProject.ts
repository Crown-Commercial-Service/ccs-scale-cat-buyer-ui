import * as express from 'express'
import * as cmsData from '../../../resources/content/RFI/nameYourProject.json'
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { ObjectModifiers } from '../util/operations/objectremoveEmptyString';
import {RFI_PATHS} from '../model/rficonstant'


export const GET_NAME_PROJECT = async (req : express.Request, res : express.Response)=> {
    var {agreement_id, proc_id, event_id, id, group_id} = req.query;
    var {SESSION_ID, state} = req.cookies;
    var PageData = {data : cmsData, agreement_id: agreementId}
    res.render('name', PageData); 
}

export const POST_NAME_PROJECT = async (req : express.Request, res : express.Response)=> {
    
}