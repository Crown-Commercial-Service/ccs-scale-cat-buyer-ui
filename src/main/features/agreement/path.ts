import { AUTH } from '../../common/middlewares/oauthservice/authstatecheck';
import {CHOOSE_AGREEMENT_CONTROLLER} from './controller/index';
import {CHOOSE_AGREEMENT_PATHS} from './model/agreementConstants';
import { Application } from 'express';


export default function(app: Application): void {
 // 
 app.get(CHOOSE_AGREEMENT_PATHS.CHOOSE_AGREEMENT, AUTH, CHOOSE_AGREEMENT_CONTROLLER.CHOOSE_AGREEMENT);

}