import { GET_TASKLIST } from './tasklist'
import { GET_TYPE, POST_TYPE } from './type'
import { GET_ONLINE_TASKLIST } from './onlinetasklist'
import { GET_QUESTIONS, POST_QUESTION } from './questions'
import { GET_UPLOAD_DOC } from './upload'
import { GET_NAME_PROJECT, POST_NAME_PROJECT } from './nameAProject'
import { GET_LEAD_PROCUREMENT } from './leadProcurement'
import { GET_ADD_COLLABORATOR, POST_ADD_COLLABORATOR, POST_ADD_COLLABORATOR_TO_JAGGER } from './addcollaborator'


export var associatedViews = {
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
    GET_ADD_COLLABORATOR,



    /**
    * @POST_VIEW
    */
    POST_QUESTION,
    POST_TYPE,
    POST_NAME_PROJECT,
    POST_ADD_COLLABORATOR,
    POST_ADD_COLLABORATOR_TO_JAGGER

}