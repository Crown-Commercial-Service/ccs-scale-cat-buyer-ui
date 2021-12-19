export enum REQUIREMENT_PATHS {
    //@ All of the Path related Request for dashboard
    CHOOSE_ROUTE = '/requirements/choose-route',
    RFP_TYPE = '/rfp/type',
    POST_ROUTE = '/requirements/choose-route',
    POST_RFP_TYPE = '/rfp/type',
    REQUIREMENT_RFP_TASK_LIST = '/rfp/task-list',

    // Add collaborator
    GET_ADD_COLLABORATOR = '/rfp/add-collaborators',
    POST_ADD_COLLABORATOR_JSENABLED = '/rfp/get-collaborator-detail/js-enabled',
    POST_ADD_COLLABORATOR = '/rfp/get-collaborator-detail',
    POST_ADD_COLLABORATOR_TO_JAGGER = '/rfp/add-collaborator-detail',
    POST_PROCEED_COLLABORATORS = '/rfp/proceed-collaborators',

    // Proc lead
    GET_NAME_YOUR_PROJECT = '/rfp/name-your-project',
    GET_LEAD_PROCUEMENT = '/rfp/procurement-lead',
    POST_PROJECT_NAME = '/rfp/name',
    PUT_LEAD_PROCUREMENT = '/rfp/procurement-lead',
    GET_USER_PROCUREMENT = '/rfp/users-procurement-lead',
}