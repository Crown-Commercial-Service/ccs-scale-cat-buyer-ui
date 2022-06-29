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
  RFP_POST_DELETE_COLLABORATOR_TO_JAGGER = '/rfp/delete-collaborators',
  RFP_POST_PROCEED_COLLABORATORS = '/rfp/proceed-collaborators',

  // RFP Scoring Criteria
  RFP_GET_SCORING_CRITERIA = '/rfp/set-scoring-criteria',
  RFP_POST_SCORING_CRITERIA = '/rfp/set-scoring-criteria',

  //RFP Resource type and Quantity
  RFP_GET_VETTING_AND_WEIGHTING = '/rfp/vetting-weighting',
  RFP_POST_VETTING_AND_WEIGHTING = '/rfp/vetting-weighting',

  // Proc lead rfp
  RFP_GET_NAME_PROJECT = '/rfp/name-your-project',
  RFP_POST_NAME_PROJECT = '/rfp/name',
  RFP_GET_LEAD_PROCUREMENT = '/rfp/procurement-lead',
  RFP_PUT_LEAD_PROCUREMENT = '/rfp/procurement-lead',
  RFP_GET_USER_PROCUREMENT = '/rfp/users-procurement-lead',

  // Add Context
  RFP_ADD_CONTEXT = '/rfp/add-context',
  // Your Assesstment bases and evaluation weightings
  RFP_YOUR_ASSESSMENT = '/rfp/your-assesstment',
  RFP_GET_YOUR_ASSESSMENT_QUESTION = '/rfp/assesstment-question',
  RFP_POST_YOUR_ASSESSMENT_QUESTION = '/rfp/assesstment-question',

  //RFP ir35
  RFP_GET_IR35 = '/rfp/IR35',
  RFP_POST_IR35 = '/rfp/IR35',

  // Upload doc rfp
  RFP_UPLOAD = '/rfp/upload',
  RFP_GET_UPLOAD_ATTACHMENT = '/rfp/upload-attachment',
  RFP_POST_UPLOAD_ATTACHMENT = '/rfp/upload-attachment',
  RFP_POST_UPLOAD_ATTACHMENT_PROCEED = '/rfp/upload-attachment/proceed',
  RFP_GET_UPLOAD_DOC = '/rfp/upload-doc',
  RFP_POST_UPLOAD_DOC = '/rfp/upload-doc',
  RFP_POST_UPLOAD_PROCEED = '/rfp/upload-doc/proceed',
  RFP_GET_REMOVE_FILES = '/rfp/files/remove',
  RFP_GET_REMOVE_FILES_ATTACHMENT = '/rfp/files-att/remove',
  RFP_GET_CHOOSE_REQUIREMENTS = '/rfp/choose-security-requirements',
  RFP_POST_CHOOSE_REQUIREMENTS = '/rfp/choose-security-requirements',

  // Add collaborator ca
  CA_GET_ADD_COLLABORATOR = '/ca/add-collaborators',
  CA_POST_ADD_COLLABORATOR_JSENABLED = '/ca/get-collaborator-detail/js-enabled',
  CA_POST_ADD_COLLABORATOR = '/ca/get-collaborator-detail',
  CA_POST_ADD_COLLABORATOR_TO_JAGGER = '/ca/add-collaborator-detail',
  CA_POST_PROCEED_COLLABORATORS = '/ca/proceed-collaborators',
  CA_GET_CHOOSE_REQUIREMENTS = '/ca/choose-security-requirements',
  CA_POST_CHOOSE_REQUIREMENTS = '/ca/choose-security-requirements',
  //supplier
  GET_RFP_SUPPLIERS = '/rfp/suppliers',
  POST_RFP_SUPPLIER = '/rfp/suppliers',

  //RFP Quality Group
  RFP_GET_QUALITY_GROUP = '/rfp/ratio-quality-group',
  RFP_POST_QUALITY_GROUP = '/rfp/ratio-quality-group',

  // Proc lead ca
  CA_GET_NAME_PROJECT = '/ca/name-your-project',
  CA_POST_NAME_PROJECT = '/ca/name',
  CA_GET_LEAD_PROCUREMENT = '/ca/procurement-lead',
  CA_PUT_LEAD_PROCUREMENT = '/ca/procurement-lead',
  CA_GET_USER_PROCUREMENT = '/ca/users-procurement-lead',

  // Upload doc ca
  CA_GET_UPLOAD_DOC = '/ca/upload-doc',
  CA_POST_UPLOAD_DOC = '/ca/upload-doc',
  CA_POST_UPLOAD_PROCEED = '/ca/upload-doc/proceed',

  // Upload  pricing supporting doc ca
  CA_GET_UPLOAD_PRICING_SUPPORTING_DOCUMENT = '/ca/upload-pricing-supporting-doc',
  CA_POST_UPLOAD_PRICING_SUPPORTING_DOCUMENT = '/ca/upload-pricing-supporting-doc',

  // Upload  pricing supporting doc ca
  CA_GET_UPLOAD_PRICING = '/ca/upload-pricing',
  CA_POST_UPLOAD_PRICING = '/ca/upload-pricing',

  // Upload  pricing supporting doc ca
  CA_GET_UPLOAD_SUPPORTING_DOCUMENT = '/ca/upload-supporting-doc',
  CA_POST_UPLOAD_SUPPORTING_DOCUMENT = '/ca/upload-supporting-doc',

  // ca type
  CA_TYPE = '/ca/type',
  CA_POST_TYPE = '/ca/type',
  CA_OFFLINE_JOURNEY_PAGE = '/ca/offline',

  CA_REQUIREMENT_TASK_LIST = '/ca/task-list',
  CA_GET_LEARN = '/ca/learn-about-capability-assessment',
  CA_POST_LEARN = '/ca/learn-about-capability-assessment',
  DA_GET_LEARN = '/da/learn-about-capability-assessment',
  DA_POST_LEARN = '/da/learn-about-capability-assessment',
  GET_LEARN = '/ca/learnabout-capability-assessment',
  DA_GET_LEARN_START = '/da/learnabout-CA',
  DA_POST_LEARN_START = '/da/learnabout-CA',
  POST_LEARN = '/ca/learnabout-capability-assessment',
  CA_GET_WEIGHTINGS = '/ca/enter-your-weightings',
  CA_POST_WEIGHTINGS = '/ca/enter-your-weightings',
  CA_GET_SUPPLIERS_FORWARD = '/ca/suppliers-to-forward',
  CA_POST_SUPPLIERS_FORWARD = '/ca/suppliers-to-forward',
  CA_GET_SUBCONTRACTORS = '/ca/accept-subcontractors',
  CA_POST_SUBCONTRACTORS = '/ca/accept-subcontractors',

  CA_GET_NEXTSTEPS = '/ca/next-steps',
  CA_POST_NEXTSTEPS = '/ca/next-steps',
  CA_GET_TEAM_SCALE = '/ca/team-scale',
  CA_POST_TEAM_SCALE = '/ca/team-scale',
  CA_GET_WHERE_WORK_DONE = '/ca/where-work-done',
  CA_POST_WHERE_WORK_DONE = '/ca/where-work-done',
  CA_GET_RESOURCES_VETTING_WEIGHTINGS = '/ca/resources-vetting-weightings',
  CA_POST_RESOURCES_VETTING_WEIGHTINGS = '/ca/resources-vetting-weightings',
  CA_GET_LEARN_ASSESSMENT_BASES = '/ca/learn-assessments-bases',
  CA_POST_LEARN_ASSESSMENT_BASES = '/ca/learn-assessments-bases',

  DA_GET_WEIGHTINGS = '/da/enter-your-weightings',
  DA_POST_WEIGHTINGS = '/da/enter-your-weightings',
  DA_GET_TEAM_SCALE = '/da/team-scale',
  DA_POST_TEAM_SCALE = '/da/team-scale',
  DA_GET_NEXTSTEPS = '/da/next-steps',
  DA_POST_NEXTSTEPS = '/da/next-steps',
  DA_GET_CANCEL = '/da/cancel',
  CA_GET_CANCEL = '/ca/cancel',

  CA_GET_REVIEW_RANKED_SUPPLIERS = '/ca/review-ranked-suppliers',
  CA_POST_REVIEW_RANKED_SUPPLIERS = '/ca/review-ranked-suppliers',

  CA_GET_SERVICE_CAPABILITIES = '/ca/service-capabilities',
  CA_POST_SERVICE_CAPABILITIES = '/ca/service-capabilities',

  //RFP questions
  RFP_GET_QUESTIONS = '/rfp/questions',
  RFP_POST_QUESTIONS = '/rfp/questionnaire',

  //RFP Response dates
  RFP_GET_RESPONSE_DATE = '/rfp/response-date',
  RFP_POST_RESPONSE_DATE = '/rfp/response-date',
  RFP_POST_ADD_RESPONSEDATE = '/rfp/add/response-date',

  DA_GET_WHERE_WORK_DONE = '/da/where-work-done',
  DA_POST_WHERE_WORK_DONE = '/da/where-work-done',

  // da type
  DA_TYPE = '/da/type',
  DA_POST_TYPE = '/da/type',
  DA_OFFLINE_JOURNEY_PAGE = '/da/offline',
  DA_REQUIREMENT_TASK_LIST = '/da/task-list',

  //da vetting weighting

  DA_GET_RESOURCES_VETTING_WEIGHTINGS = '/da/resources-vetting-weightings',
  DA_POST_RESOURCES_VETTING_WEIGHTINGS = '/da/resources-vetting-weightings',

  DA_GET_SUBCONTRACTORS = '/da/accept-subcontractors',
  DA_POST_SUBCONTRACTORS = '/da/accept-subcontractors',

  DA_GET_REVIEW_RANKED_SUPPLIERS = '/da/review-ranked-suppliers',
  DA_POST_REVIEW_RANKED_SUPPLIERS = '/da/review-ranked-suppliers',

  DA_GET_SERVICE_CAPABILITIES = '/da/service-capabilities',
  DA_POST_SERVICE_CAPABILITIES = '/da/service-capabilities',

  DA_GET_CHOOSE_REQUIREMENTS = '/da/choose-security-requirements',
  DA_POST_CHOOSE_REQUIREMENTS = '/da/choose-security-requirements',

  //Capability assessment summary
  CA_GET_SUMMARY = '/ca/summary',
  CA_POST_SUMMARY = '/ca/summary',

  //RFP Enter Your weighting

  RFP_GET_WEIGHTINGS = '/rfp/enter-your-weightings',
  RFP_POST_WEIGHTINGS = '/rfp/enter-your-weightings',


  //RFP Capability service
  RFP_GET_SERVICE_CAPABILITIES = '/rfp/service-capabilities',
  RFP_POST_SERVICE_CAPABILITIES = '/rfp/service-capabilities',
  //RFP Location
  RFP_GET_WHERE_WORK_DONE = '/rfp/where-work-done',
  RFP_POST_WHERE_WORK_DONE = '/rfp/where-work-done',

  RFP_GET_WORK_COMPLETED = '/rfp/get-work-completed',
  RFP_POST_WORK_COMPLETED = '/rfp/get-work-completed',

  CA_GET_REVIEW = '/ca/review',
  CA_POST_REVIEW = '/ca/review',
 
  RFP_GET_EVENT_PUBLISHED='/rfp/rfp-eventpublished',


  GET_UNPUBLISHED_EVENT_MANAGEMENT='/rfp/rfp-unpublishedeventmanagement',
  GET_RFP_CLOSE_PROJECT='/rfp/rfp-closeproject',

  GET_RFP_REVIEW='/rfp/review',
  POST_RFP_REVIEW='/rfp/review',

  GET_DA_REVIEW_SUPPLIER='/da/reviewsupplier',
  POST_DA_REVIEW_SUPPLIER='/da/reviewsupplier',

}
