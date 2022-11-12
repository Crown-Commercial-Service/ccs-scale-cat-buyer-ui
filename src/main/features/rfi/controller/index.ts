import { GET_TASKLIST } from './tasklist'
import { GET_TYPE, POST_TYPE } from './type'
import { GET_ONLINE_TASKLIST } from './onlinetasklist'
import { GET_QUESTIONS, POST_QUESTION } from './questions'
import { GET_UPLOAD_DOC, POST_UPLOAD_DOC, GET_REMOVE_FILES, POST_UPLOAD_PROCEED } from './upload'
import { GET_NAME_PROJECT, POST_NAME_PROJECT } from './nameAProject'
import { GET_LEAD_PROCUREMENT, PUT_LEAD_PROCUREMENT, GET_USER_PROCUREMENT } from './leadProcurement'
import { GET_ADD_COLLABORATOR, POST_ADD_COLLABORATOR, POST_ADD_COLLABORATOR_TO_JAGGER, POST_PROCEED_COLLABORATORS, POST_ADD_COLLABORATOR_JSENABLED,POST_DELETE_COLLABORATOR_TO_JAGGER } from './addcollaborator'
import {GET_RFI_REVIEW, POST_RFI_REVIEW} from './review'
import {GET_RFI_SUPPLIERS, POST_RFI_SUPPLIER} from './suppliers'
import {GET_RESPONSE_DATE, POST_RESPONSE_DATE, POST_ADD_RESPONSE_DATE} from './responsedate'
import {GET_EVENT_PUBLISHED} from './eventpublished'
import { OFFLINE_JOURNEY_PAGE } from './offline'
import {RFI_GET_NEXT_STEPS, RFI_POST_NEXT_STEPS} from './nextsteps'
import {RFI_GET_CLOSE} from './closerfi'
import { CHOOSE_YOUR_ROUTE_MARKET } from './choose_your_route_market'
import {CONFIRMATION_REVIEW} from './confirmationReview';
import { BUILD_RFI, POST_BUILD_RFI } from './buildRfi'
export const associatedViews = {
    /**
     * @GET_VIEW
     */
    GET_ONLINE_TASKLIST,
    GET_TASKLIST,
    GET_TYPE,
    GET_QUESTIONS,
    GET_UPLOAD_DOC,
    GET_NAME_PROJECT,
    GET_LEAD_PROCUREMENT,
    GET_USER_PROCUREMENT,
    GET_ADD_COLLABORATOR,
    GET_REMOVE_FILES,
    GET_RESPONSE_DATE,
    GET_RFI_SUPPLIERS,
    GET_RFI_REVIEW,
    GET_EVENT_PUBLISHED,
    RFI_GET_NEXT_STEPS,
    RFI_GET_CLOSE,
    OFFLINE_JOURNEY_PAGE,
    CHOOSE_YOUR_ROUTE_MARKET,
    BUILD_RFI,
    CONFIRMATION_REVIEW,


    /**
    * @POST_VIEW
    */
    POST_QUESTION,
    POST_TYPE,
    POST_NAME_PROJECT,
    POST_ADD_COLLABORATOR,
    POST_ADD_COLLABORATOR_TO_JAGGER,
    PUT_LEAD_PROCUREMENT,
    POST_PROCEED_COLLABORATORS,
    POST_ADD_COLLABORATOR_JSENABLED,
    POST_UPLOAD_DOC,
    POST_RFI_SUPPLIER,
    POST_RESPONSE_DATE,
    POST_RFI_REVIEW,
    POST_ADD_RESPONSE_DATE,
    POST_UPLOAD_PROCEED,
    POST_DELETE_COLLABORATOR_TO_JAGGER,
    RFI_POST_NEXT_STEPS,
    POST_BUILD_RFI
}