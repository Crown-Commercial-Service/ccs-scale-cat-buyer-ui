

export enum RFI_PATHS {

    /**
     * @GETROUTES
     */
    //@ All of the Path related Request for information
    GET_TASKLIST = '/rfi/rfi-tasklist',
    GET_TYPE = '/rfi/type',
    GET_ONLINE_TASKLIST = '/rfi/online-task-list',
    GET_QUESTIONS = '/rfi/questions',
    GET_UPLOAD_DOC = '/rfi/upload-doc',
    GET_NAME_YOUR_PROJECT = '/rfi/name-your-project',
    GET_LEAD_PROCUEMENT = '/rfi/procurement-lead',
    GET_ADD_COLLABORATOR = '/rfi/add-collaborators',
    GET_USER_PROCUREMENT = '/rft/users-procurement-lead',
    GET_REMOVE_FILE = "/rfi/files/remove",
    GET_RFI_SUPPLIERS = "/rfi/suppliers",
    GET_RESPONSE_DATE = "/rfi/response-date",
    GET_RFI_REVIEW = "/rfi/review",

    
    
    /**
     * @POSTROUTES
     */
    //@ All of the Path related Request for information
    POST_QUESTIONS_QUESTIONNAIRE = '/rfi/questionnaire',
    POST_TYPE_TYPE = '/rfi/type',
    POST_QUESTIONS_WHO = '/rfi/questions/who',
    POST_PROJECT_NAME = '/rfi/name',
    POST_ADD_COLLABORATOR = '/rfi/get-collaborator-detail',
    POST_ADD_COLLABORATOR_TO_JAGGER  = "/rfi/add-collaborator-detail",
    PUT_LEAD_PROCUREMENT = '/rfi/procurement-lead',
    POST_PROCEED_COLLABORTORS = '/rfi/proceed-collaborators',
    POST_ADD_COLLABORATOR_JSENABLED = "/rfi/get-collaborator-detail/js-enabled",
    POST_UPLOAD_DOC = "/rfi/upload-doc",
    POST_RFI_SUPPLIER = "/rfi/suppliers",
    POST_RESPONSE_DATE = "/rfi/response-date"
  

}