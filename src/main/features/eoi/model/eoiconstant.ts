

export enum eoi_PATHS {

    /**
     * @GETROUTES
     */
    //@ All of the Path related Request for information
    GET_TASKLIST = '/eoi/eoi-tasklist',
    GET_TYPE = '/eoi/type',
    GET_ONLINE_TASKLIST = '/eoi/online-task-list',
    GET_QUESTIONS = '/eoi/questions',
    GET_UPLOAD_DOC = '/eoi/upload-doc',
    GET_NAME_YOUR_PROJECT = '/eoi/name-your-project',
    GET_LEAD_PROCUEMENT = '/eoi/procurement-lead',
    GET_ADD_COLLABORATOR = '/eoi/add-collaborators',
    GET_USER_PROCUREMENT = '/rft/users-procurement-lead',
    GET_REMOVE_FILE = "/eoi/files/remove",

    
    



    /**
     * @POSTROUTES
     */
    //@ All of the Path related Request for information
    POST_QUESTIONS_QUESTIONNAIRE = '/eoi/questionnaire',
    POST_TYPE_TYPE = '/eoi/type',
    POST_QUESTIONS_WHO = '/eoi/questions/who',
    POST_PROJECT_NAME = '/eoi/name',
    POST_ADD_COLLABORATOR = '/eoi/get-collaborator-detail',
    POST_ADD_COLLABORATOR_TO_JAGGER  = "/eoi/add-collaborator-detail",
    PUT_LEAD_PROCUREMENT = '/eoi/procurement-lead',
    POST_PROCEED_COLLABORTORS = '/eoi/proceed-collaborators',
    POST_ADD_COLLABORATOR_JSENABLED = "/eoi/get-collaborator-detail/js-enabled",
    POST_UPLOAD_DOC = "/eoi/upload-doc"
  

}