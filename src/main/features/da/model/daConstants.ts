export enum REQUIRMENT_DA_PATHS {
  //@ All of the Path related Request for dashboard
  //DA TYPE
  DA_TYPE = '/da/type',
  DA_REQUIREMENT_TASK_LIST = '/da/task-list',
  DA_OFFLINE_JOURNEY_PAGE = '/da/offline',

  DA_GET_NAME_PROJECT = '/da/name-your-project',
  DA_POST_NAME_PROJECT = '/da/name',
  //DA_PUT_LEAD_PROCUREMENT='/da/procurement-lead',
  DA_GET_LEAD_PROCUREMENT = '/da/procurement-lead',
  // procuremnt-lead
  DA_PUT_LEAD_PROCUREMENT = '/da/procurement-lead',
  DA_GET_USER_PROCUREMENT = '/da/users-procurement-lead',

  // Your Assessment bases and evaluation weightings
  DA_YOUR_ASSESSMENT = '/da/your-assesstment',
  DA_GET_YOUR_ASSESSMENT_QUESTION = '/da/assesstment-question',
  DA_POST_YOUR_ASSESSMENT_QUESTION = '/da/assesstment-question',

  // Add collaborator
  DA_GET_ADD_COLLABORATOR = '/da/add-collaborators',
  DA_POST_ADD_COLLABORATOR_JSENABLED = '/da/get-collaborator-detail/js-enabled',
  DA_POST_ADD_COLLABORATOR = '/da/get-collaborator-detail',
  DA_POST_ADD_COLLABORATOR_TO_JAGGER = '/da/add-collaborator-detail',
  DA_POST_PROCEED_COLLABORATORS = '/da/proceed-collaborators',
  DA_POST_DELETE_COLLABORATOR_TO_JAGGER = '/da/delete-collaborators',

  //Selected service
  DA_GET_SELECTED_SERVICE = '/da/selected_service',
  DA_POST_SELECT_SERVICES = '/da/select-services',

  // Add Context
  DA_ADD_CONTEXT = '/da/add-context',

  //supplier
  GET_DA_SUPPLIERS = '/da/suppliers',
  POST_DA_SUPPLIER = '/da/suppliers',
  SUPPLIER_DA_RATECARD = '/da/supplier/ratecard',

  DA_GET_EVENT_PUBLISHED = '/da/da-eventpublished',

  //DA questions
  DA_GET_QUESTIONS = '/da/questions',
  DA_POST_QUESTIONS = '/da/questionnaire',

  //DA Review
  GET_DA_REVIEW = '/da/review',
  POST_DA_REVIEW = '/da/review',

  // Upload doc DA
  DA_UPLOAD = '/da/upload',
  DA_GET_UPLOAD_ATTACHMENT = '/da/upload-attachment',
  DA_POST_UPLOAD_ATTACHMENT = '/da/upload-attachment',
  DA_POST_UPLOAD_ATTACHMENT_PROCEED = '/da/upload-attachment/proceed',
  DA_GET_UPLOAD_DOC = '/da/upload-doc',
  DA_POST_UPLOAD_DOC = '/da/upload-doc',
  DA_POST_UPLOAD_PROCEED = '/da/upload-doc/proceed',
  DA_GET_REMOVE_FILES = '/da/files/remove',
  DA_GET_REMOVE_FILES_ATTACHMENT = '/da/files-att/remove',

  DA_GET_UPLOAD_ADDITIONAL = '/da/upload-additional',
  DA_POST_UPLOAD_ADDITIONAL = '/da/upload-additional',
  DA_POST_UPLOAD_ADDITIONAL_PROCEED = '/da/upload-additional/proceed',

  //DA ir35
  DA_GET_IR35 = '/da/IR35',
  DA_POST_IR35 = '/da/IR35',

  //DA Response dates
  DA_GET_RESPONSE_DATE = '/da/response-date',
  DA_POST_RESPONSE_DATE = '/da/response-date',
  DA_POST_ADD_RESPONSEDATE = '/da/add/response-date',
}
