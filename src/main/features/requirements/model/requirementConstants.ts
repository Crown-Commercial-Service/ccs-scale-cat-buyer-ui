export enum REQUIREMENT_PATHS {
  //@ All of the Path related Request for dashboard
  CHOOSE_ROUTE = '/requirements/choose-route',
  POST_ROUTE = '/requirements/choose-route',

  RFP_TYPE = '/rfp/type',
  RFP_POST_TYPE = '/rfp/type',
  RFP_REQUIREMENT_TASK_LIST = '/rfp/task-list',
  RFP_OFFLINE_JOURNEY_PAGE = '/rfp/offline',

  // Add collaborator rfp
  RFP_GET_ADD_COLLABORATOR = '/rfp/add-collaborators',
  RFP_POST_ADD_COLLABORATOR_JSENABLED = '/rfp/get-collaborator-detail/js-enabled',
  RFP_POST_ADD_COLLABORATOR = '/rfp/get-collaborator-detail',
  RFP_POST_ADD_COLLABORATOR_TO_JAGGER = '/rfp/add-collaborator-detail',
  RFP_POST_PROCEED_COLLABORATORS = '/rfp/proceed-collaborators',

  // Proc lead rfp
  RFP_GET_NAME_PROJECT = '/rfp/name-your-project',
  RFP_POST_NAME_PROJECT = '/rfp/name',
  RFP_GET_LEAD_PROCUREMENT = '/rfp/procurement-lead',
  RFP_PUT_LEAD_PROCUREMENT = '/rfp/procurement-lead',
  RFP_GET_USER_PROCUREMENT = '/rfp/users-procurement-lead',

  // Add Context 
  RFP_ADD_CONTEXT = '/rfp/add-context',

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

  CA_REQUIREMENT_TASK_LIST = '/ca/task-list',
  CA_GET_LEARN = '/ca/learn-about-capability-assessment',
  CA_POST_LEARN = '/ca/learn-about-capability-assessment',
  CA_GET_WEIGHTINGS = '/ca/enter-your-weightings',

  //RFP questions 
  RFP_GET_QUESTIONS = '/rfp/questions'
}
