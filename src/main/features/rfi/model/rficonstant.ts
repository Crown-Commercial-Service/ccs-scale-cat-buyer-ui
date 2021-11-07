
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
<<<<<<< HEAD
    GET_NAME_YOUR_PROJECT = '/rfi/name-your-project',
    GET_LEAD_PROCUEMENT = '/rfi/lead-procurement',
    GET_ADD_COLLABORATOR = '/rfi/add-collaborators',
=======
>>>>>>> bc1a6d01 (rebase refactoring)



    /**
     * @POSTROUTES
     */
    //@ All of the Path related Request for information
    POST_QUESTIONS_QUESTIONNAIRE = '/rfi/questionnaire',
    POST_TYPE_TYPE = '/rfi/type',
    POST_QUESTIONS_WHO = '/rfi/questions/who',
    POST_PROJECT_NAME = '/rfi/name'

}