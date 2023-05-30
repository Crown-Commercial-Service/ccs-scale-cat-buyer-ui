export enum EOI_PATHS {
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
  GET_USER_PROCUREMENT = '/eoi/users-procurement-lead',
  GET_REMOVE_FILE = '/eoi/files/remove',
  GET_OFFLINE = '/eoi/offline',
  GET_EVENT_PUBLISHED = '/eoi/event-sent',
  GET_RESPONSE_DATE = '/eoi/response-date',
  GET_EOI_REVIEW = '/eoi/review',
  GET_EOI_SUPPLIERS = '/eoi/suppliers',
  GET_EOI_PROJECT_OBJECTIVE = '/eoi/project-objective',
  GET_EOI_PROJECT_SCOPE = '/eoi/project-scope',
  GET_EOI_CHOOSE_TYPE = '/eoi/choose-type',
  GET_EOI_EXISTING_SUPPLIER = '/eoi/existing-supplier',
  GET_EOI_SPECIAL_TERMS = '/eoi/special-terms',
  GET_BUILD_EOI = '/eoi/choose-build-your-eoi',

  GET_EOI_PROJECT_DURATION = '/eoi/project-duration',
  GET_EOI_PROJECT_BUDGET = '/eoi/project-budget',

  GET_CONFIRMATION_REVIEW = '/eoi/confirmation-review',
  /**
   * @POSTROUTES
   */
  //@ All of the Path related Request for information
  POST_QUESTIONS_QUESTIONNAIRE = '/eoi/questionnaire',
  POST_TYPE_TYPE = '/eoi/type',
  POST_QUESTIONS_WHO = '/eoi/questions/who',
  POST_PROJECT_NAME = '/eoi/name',
  POST_ADD_COLLABORATOR = '/eoi/get-collaborator-detail',
  POST_ADD_COLLABORATOR_TO_JAGGER = '/eoi/add-collaborator-detail',
  GET_DELETE_COLLABORATOR_TO_JAGGER = '/eoi/delete-collaborator-detail',
  PUT_LEAD_PROCUREMENT = '/eoi/procurement-lead',
  POST_PROCEED_COLLABORTORS = '/eoi/proceed-collaborators',
  POST_ADD_COLLABORATOR_JSENABLED = '/eoi/get-collaborator-detail/js-enabled',
  POST_UPLOAD_DOC = '/eoi/upload-doc',
  POST_RESPONSE_DATE = '/eoi/response-date',
  POST_ADD_RESPONSE_DATA = '/eoi/add/response-date',
  POST_EOI_REVIEW = '/eoi/review',
  POST_UPLOAD_PROCEED = '/eoi/upload-doc/proceed',
  POST_EOI_SUPPLIER = '/eoi/suppliers',
  POST_EOI_PROJECT_OBJECTIVE = '/eoi/project-objective',
  POST_EOI_PROJECT_SCOPE = '/eoi/project-scope',
  POST_EOI_CHOOSE_TYPE = '/eoi/choose-type',
  POST_EOI_SPECIAL_TERMS = '/eoi/special-terms',
  POST_EOI_EXISTING_SUPPLIER = '/eoi/existing-supplier',
}
