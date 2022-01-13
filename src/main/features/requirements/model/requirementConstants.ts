export enum REQUIREMENT_PATHS {
  //@ All of the Path related Request for dashboard
  CHOOSE_ROUTE = '/requirements/choose-route',
  RFP_TYPE = '/rfp/type',
  POST_ROUTE = '/requirements/choose-route',
  POST_RFP_TYPE = '/rfp/type',
  REQUIREMENT_RFP_TASK_LIST = '/rfp/task-list',
  OFFLINE_JOURNEY_PAGE = '/rfp/offline',
  REQUIREMENT_CA_TASK_LIST = '/ca/task-list',
  GET_CA_LEARN = '/ca/learn-about-capability-assessment',
  POST_CA_LEARN = 'ca/learn',
  GET_CA_WEIGHTINGS = '/ca/enter-your-weightings',

  // Add collaborator rfp
  GET_ADD_COLLABORATOR = '/rfp/add-collaborators',
  POST_ADD_COLLABORATOR_JSENABLED = '/rfp/get-collaborator-detail/js-enabled',
  POST_ADD_COLLABORATOR = '/rfp/get-collaborator-detail',
  POST_ADD_COLLABORATOR_TO_JAGGER = '/rfp/add-collaborator-detail',
  POST_PROCEED_COLLABORATORS = '/rfp/proceed-collaborators',

  // Proc lead rfp
  GET_NAME_PROJECT = '/rfp/name-your-project',
  POST_NAME_PROJECT = '/rfp/name',
  GET_LEAD_PROCUREMENT = '/rfp/procurement-lead',
  POST_PROJECT_NAME = '/rfp/name',
  PUT_LEAD_PROCUREMENT = '/rfp/procurement-lead',
  GET_USER_PROCUREMENT = '/rfp/users-procurement-lead',

  // Upload doc rfp
  RFP_GET_UPLOAD_DOC = '/rfp/upload-doc',
  RFP_POST_UPLOAD_DOC = '/rfp/upload-doc',
  RFP_POST_UPLOAD_PROCEED = '/rfp/upload-doc/proceed',

  // Add collaborator ca
  CA_GET_ADD_COLLABORATOR = '/ca/add-collaborators',
  CA_POST_ADD_COLLABORATOR_JSENABLED = '/ca/get-collaborator-detail/js-enabled',
  CA_POST_ADD_COLLABORATOR = '/ca/get-collaborator-detail',
  CA_POST_ADD_COLLABORATOR_TO_JAGGER = '/ca/add-collaborator-detail',
  CA_POST_PROCEED_COLLABORATORS = '/ca/proceed-collaborators',

  // Proc lead ca
  CA_GET_NAME_PROJECT = '/ca/name-your-project',
  CA_POST_NAME_PROJECT = '/ca/name',
  CA_GET_LEAD_PROCUREMENT = '/ca/procurement-lead',
  CA_POST_PROJECT_NAME = '/ca/name',
  CA_PUT_LEAD_PROCUREMENT = '/ca/procurement-lead',
  CA_GET_USER_PROCUREMENT = '/ca/users-procurement-lead',

  // Upload doc ca
  CA_GET_UPLOAD_DOC = '/ca/upload-doc',
  CA_POST_UPLOAD_DOC = '/ca/upload-doc',
  CA_POST_UPLOAD_PROCEED = '/ca/upload-doc/proceed',
}
