import {
  DA_GET_CHOOSE_SECURITY_REQUIREMENTS,
  DA_POST_CHOOSE_SECURITY_REQUIREMENTS,
} from './da-chooseSecurityRequirements';
import {
  RFP_GET_CHOOSE_SECURITY_REQUIREMENTS,
  RFP_POST_CHOOSE_SECURITY_REQUIREMENTS,
} from './rfp-chooseSecurityRequirements';
import { CA_GET_LEARN_ASSESSMENT_BASES, CA_POST_LEARN_ASSESSMENT_BASES } from './ca-learnAssessmentBases';
import { CA_GET_SERVICE_CAPABILITIES, CA_POST_SERVICE_CAPABILITIES } from './ca-serviceCapabilites';
import { CA_GET_REVIEW_RANKED_SUPPLIERS, CA_POST_REVIEW_RANKED_SUPPLIERS } from './ca-reviewRankedSuppliers';
import { DA_GET_WHERE_WORK_DONE, DA_POST_WHERE_WORK_DONE } from './da-whereWorkDone';
import { REQUIREMENT_CHOOSE_ROUTE, POST_REQUIREMENT_CHOOSE_ROUTE } from './choose-route';
import {
  RFP_GET_ADD_COLLABORATOR,
  RFP_POST_ADD_COLLABORATOR_JSENABLED,
  RFP_POST_ADD_COLLABORATOR,
  RFP_POST_ADD_COLLABORATOR_TO_JAGGER,
  RFP_POST_PROCEED_COLLABORATORS,
} from './rfp-addcollaborator';
import { RFP_REQUIREMENT_TYPE, RFP_POST_TYPE } from './rfp-type';
import { RFP_REQUIREMENT_TASK_LIST } from './rfp-taskList';
import { RFP_GET_LEAD_PROCUREMENT, RFP_PUT_LEAD_PROCUREMENT, RFP_GET_USER_PROCUREMENT } from './rfp-leadProcurement';
import { RFP_GET_NAME_PROJECT, RFP_POST_NAME_PROJECT } from './rfp-nameAProject';
import { RFP_OFFLINE_JOURNEY_PAGE } from './rfp-offline';
import { RFP_UPLOAD } from './rfp-uploadOverview';
import {
  RFP_GET_UPLOAD_ATTACHMENT,
  RFP_POST_UPLOAD_ATTACHMENT,
  RFP_GET_REMOVE_ATTACHMENT_FILES,
  RFP_POST_UPLOAD_ATTACHMENT_PROCEED,
} from './rfp-uploadAttachment';
import { RFP_GET_UPLOAD_DOC, RFP_POST_UPLOAD_DOC, RFP_GET_REMOVE_FILES, RFP_POST_UPLOAD_PROCEED } from './rfp-upload';
import { RFP_GET_ADD_CONTEXT } from './rfp-addcontext';
import { GET_RFP_SUPPLIERS, POST_RFP_SUPPLIERS } from './rfp-suppliers';
import { RFP_GET_QUESTIONS, RFP_POST_QUESTION } from './rfp-questions';
import {
  CA_GET_ADD_COLLABORATOR,
  CA_POST_ADD_COLLABORATOR_JSENABLED,
  CA_POST_ADD_COLLABORATOR,
  CA_POST_ADD_COLLABORATOR_TO_JAGGER,
  CA_POST_PROCEED_COLLABORATORS,
} from './ca-addcollaborator';
import { CA_REQUIREMENT_TYPE, CA_POST_TYPE } from './ca-type';
import { CA_REQUIREMENT_TASK_LIST } from './ca-taskList';
import { CA_GET_LEAD_PROCUREMENT, CA_PUT_LEAD_PROCUREMENT, CA_GET_USER_PROCUREMENT } from './ca-leadProcurement';
import { CA_GET_NAME_PROJECT, CA_POST_NAME_PROJECT } from './ca-nameAProject';
import { CA_OFFLINE_JOURNEY_PAGE } from './ca-offline';
import { CA_GET_UPLOAD_DOC, CA_POST_UPLOAD_DOC, CA_GET_REMOVE_FILES, CA_POST_UPLOAD_PROCEED } from './ca-upload';
import { CA_GET_LEARN, CA_POST_LEARN } from './ca-learnAboutCapabilityAssessment';
import { GET_LEARN, POST_LEARN } from './learnAboutCapabilityAssessment';
import { CA_GET_WEIGHTINGS, CA_POST_WEIGHTINGS } from './ca-enterYourWeightings';
import { CA_GET_CANCEL } from './ca-cancel';
import { CA_GET_SUPPLIERS_FORWARD, CA_POST_SUPPLIERS_FORWARD } from './ca-suppliersToForward';
import { CA_GET_SUBCONTRACTORS, CA_POST_SUBCONTRACTORS } from './ca-SubContractors';
import { CA_GET_NEXTSTEPS, CA_POST_NEXTSTEPS } from './ca-nextSteps';
import { CA_GET_TEAM_SCALE, CA_POST_TEAM_SCALE } from './ca-teamScale';
import { CA_GET_WHERE_WORK_DONE, CA_POST_WHERE_WORK_DONE } from './ca-whereWorkDone';
import {
  CA_GET_RESOURCES_VETTING_WEIGHTINGS,
  CA_POST_RESOURCES_VETTING_WEIGHTINGS,
} from './ca-resourcesVettingsWeightings';

import {
  CA_GET_UPLOAD_PRICING_SUPPORTING_DOCUMENT,
  CA_POST_UPLOAD_PRICING_SUPPORTING_DOCUMENT,
} from './ca-uploadPriceAndDoc';

import { CA_GET_UPLOAD_SUPPORTING_DOCUMENT, CA_POST_UPLOAD_SUPPORTING_DOCUMENT } from './ca-uploadDoc';
import { CA_GET_UPLOAD_PRICING, CA_POST_UPLOAD_PRICING } from './ca-uploadPrice';

import {
  DA_GET_RESOURCES_VETTING_WEIGHTINGS,
  DA_POST_RESOURCES_VETTING_WEIGHTINGS,
} from './da-resourcesVettingsWeightings';

import { DA_GET_TEAM_SCALE, DA_POST_TEAM_SCALE } from './da-teamScale';
import { RFP_GET_SCORING_CRITERIA, RFP_POST_SCORING_CRITERIA } from './rfp-scoringCriteria';
import { RFP_GET_I35, RFP_POST_I35 } from './rfp-Ir35';

import { DA_REQUIREMENT_TYPE, DA_POST_TYPE } from './da-type';
import { DA_OFFLINE_JOURNEY_PAGE } from './da-offline';
import { DA_REQUIREMENT_TASK_LIST } from './da-taskList';
import { DA_GET_NEXTSTEPS, DA_POST_NEXTSTEPS } from './da-nextSteps';
import { GET_RESPONSE_DATE, POST_ADD_RESPONSE_DATE, POST_RESPONSE_DATE } from './rfp-responsedate';
import { DA_GET_CANCEL, DA_POST_CANCEL } from './da-cancel';
import { DA_GET_SUBCONTRACTORS, DA_POST_SUBCONTRACTORS } from './da-SubContractors';
import { DA_GET_SERVICE_CAPABILITIES, DA_POST_SERVICE_CAPABILITIES } from './da-serviceCapabilities';
import { RFP_GET_YOUR_ASSESSTMENT } from './rfp-yourassesstment';
import { DA_GET_REVIEW_RANKED_SUPPLIERS, DA_POST_REVIEW_RANKED_SUPPLIERS } from './da-reviewRankedSuppliers';
import { DA_GET_LEARN, DA_POST_LEARN } from './da-learnAboutCapabilityAssessment';
import { DA_GET_WEIGHTINGS, DA_POST_WEIGHTINGS } from './da-enterYourWeightings';
import { DA_GET_LEARN_START, DA_POST_LEARN_START } from './dalearnAboutCapabilityAssessment';
import { RFP_GET_VETTING_AND_WEIGHTING, RFP_POST_VETTING_AND_WEIGHTING } from './rfp-vetting-and-weighting';
import { CA_GET_SUMMARY, CA_POST_SUMMARY } from './ca-summary';
import { RFP_GET_SERVICE_CAPABILITIES, RFP_POST_SERVICE_CAPABILITIES } from './rfp-serviceCapabilities';
import { RFP_GET_QUALITY_GROUP, RFP_POST_QUALITY_GROUP } from './rfp-quality_group';
import { RFP_GET_WHERE_WORK_DONE, RFP_POST_WHERE_WORK_DONE } from './rfp-whereWorkDone';
import {CA_GET_review, CA_POST_review} from './ca-review'
import {RFP_GET_WORK_COMPLETED, RFP_POST_WORK_COMPLETED} from './rfp-work-completed'

import {RFP_GET_WEIGHTINGS, RFP_POST_WEIGHTINGS} from './rfp-enterYourWeightings'


/**
 * @BaseController
 * @Provider
 *
 * @description Provides as Base for all Controller
 */
export const REQUIREMENT_CONTROLLER = {
  REQUIREMENT_CHOOSE_ROUTE,
  POST_REQUIREMENT_CHOOSE_ROUTE,
  DA_GET_LEARN_START,
  DA_POST_LEARN_START,

  //Response Date
  GET_RESPONSE_DATE,
  POST_RESPONSE_DATE,
  POST_ADD_RESPONSE_DATE,
  RFP_REQUIREMENT_TYPE,
  RFP_POST_TYPE,
  RFP_REQUIREMENT_TASK_LIST,
  RFP_GET_ADD_COLLABORATOR,
  RFP_POST_ADD_COLLABORATOR_JSENABLED,
  RFP_POST_ADD_COLLABORATOR,
  RFP_POST_ADD_COLLABORATOR_TO_JAGGER,
  RFP_POST_PROCEED_COLLABORATORS,
  RFP_GET_NAME_PROJECT,
  RFP_POST_NAME_PROJECT,
  RFP_GET_LEAD_PROCUREMENT,
  RFP_PUT_LEAD_PROCUREMENT,
  RFP_GET_USER_PROCUREMENT,
  RFP_OFFLINE_JOURNEY_PAGE,
  RFP_UPLOAD,
  RFP_GET_UPLOAD_ATTACHMENT,
  RFP_POST_UPLOAD_ATTACHMENT,
  RFP_GET_REMOVE_ATTACHMENT_FILES,
  RFP_POST_UPLOAD_ATTACHMENT_PROCEED,
  RFP_GET_UPLOAD_DOC,
  RFP_POST_UPLOAD_DOC,
  RFP_GET_REMOVE_FILES,
  RFP_POST_UPLOAD_PROCEED,
  RFP_GET_ADD_CONTEXT,
  RFP_GET_QUESTIONS,
  RFP_POST_QUESTION,
  RFP_GET_I35,
  RFP_POST_I35,
  RFP_GET_SERVICE_CAPABILITIES,
  RFP_POST_SERVICE_CAPABILITIES,
  GET_RFP_SUPPLIERS,
  POST_RFP_SUPPLIERS,
  RFP_GET_SCORING_CRITERIA,
  RFP_POST_SCORING_CRITERIA,
  CA_REQUIREMENT_TYPE,
  CA_POST_TYPE,
  CA_REQUIREMENT_TASK_LIST,
  CA_GET_ADD_COLLABORATOR,
  CA_POST_ADD_COLLABORATOR_JSENABLED,
  CA_POST_ADD_COLLABORATOR,
  CA_POST_ADD_COLLABORATOR_TO_JAGGER,
  CA_POST_PROCEED_COLLABORATORS,
  CA_GET_NAME_PROJECT,
  CA_POST_NAME_PROJECT,
  CA_GET_LEAD_PROCUREMENT,
  CA_PUT_LEAD_PROCUREMENT,
  CA_GET_USER_PROCUREMENT,
  CA_OFFLINE_JOURNEY_PAGE,
  CA_GET_UPLOAD_DOC,
  CA_POST_UPLOAD_DOC,
  CA_GET_REMOVE_FILES,
  CA_POST_UPLOAD_PROCEED,
  CA_GET_LEARN,
  CA_POST_LEARN,
  GET_LEARN,
  POST_LEARN,
  CA_GET_WEIGHTINGS,
  CA_GET_SUPPLIERS_FORWARD,
  CA_POST_SUPPLIERS_FORWARD,
  CA_GET_SUBCONTRACTORS,
  CA_POST_SUBCONTRACTORS,
  CA_GET_NEXTSTEPS,
  CA_POST_WEIGHTINGS,
  CA_POST_NEXTSTEPS,
  CA_GET_RESOURCES_VETTING_WEIGHTINGS,
  CA_POST_RESOURCES_VETTING_WEIGHTINGS,
  CA_GET_REVIEW_RANKED_SUPPLIERS,
  CA_POST_REVIEW_RANKED_SUPPLIERS,
  CA_GET_SERVICE_CAPABILITIES,
  CA_POST_SERVICE_CAPABILITIES,
  CA_GET_TEAM_SCALE,
  CA_POST_TEAM_SCALE,
  CA_GET_WHERE_WORK_DONE,
  CA_POST_WHERE_WORK_DONE,
  CA_GET_CANCEL,
  CA_GET_LEARN_ASSESSMENT_BASES,
  CA_POST_LEARN_ASSESSMENT_BASES,

  CA_GET_UPLOAD_PRICING_SUPPORTING_DOCUMENT,
  CA_POST_UPLOAD_PRICING_SUPPORTING_DOCUMENT,
  CA_GET_UPLOAD_PRICING,
  CA_POST_UPLOAD_PRICING,
  CA_GET_UPLOAD_SUPPORTING_DOCUMENT,
  CA_POST_UPLOAD_SUPPORTING_DOCUMENT,

  CA_GET_SUMMARY,
  CA_POST_SUMMARY,
  DA_GET_NEXTSTEPS,
  DA_POST_NEXTSTEPS,
  DA_GET_WHERE_WORK_DONE,
  DA_POST_WHERE_WORK_DONE,
  DA_REQUIREMENT_TYPE,
  DA_POST_TYPE,
  DA_OFFLINE_JOURNEY_PAGE,
  DA_REQUIREMENT_TASK_LIST,
  DA_GET_TEAM_SCALE,
  DA_POST_TEAM_SCALE,
  DA_GET_LEARN,
  DA_POST_LEARN,
  DA_GET_WEIGHTINGS,
  DA_POST_WEIGHTINGS,
  DA_GET_RESOURCES_VETTING_WEIGHTINGS,
  DA_POST_RESOURCES_VETTING_WEIGHTINGS,
  DA_GET_CANCEL,
  DA_POST_CANCEL,
  DA_GET_SUBCONTRACTORS,
  DA_POST_SUBCONTRACTORS,
  DA_GET_SERVICE_CAPABILITIES,
  DA_POST_SERVICE_CAPABILITIES,
  DA_GET_REVIEW_RANKED_SUPPLIERS,
  DA_POST_REVIEW_RANKED_SUPPLIERS,
  RFP_GET_YOUR_ASSESSTMENT,
  RFP_POST_VETTING_AND_WEIGHTING,
  RFP_GET_VETTING_AND_WEIGHTING,
  RFP_GET_CHOOSE_SECURITY_REQUIREMENTS,
  RFP_POST_CHOOSE_SECURITY_REQUIREMENTS,
  DA_GET_CHOOSE_SECURITY_REQUIREMENTS,
  DA_POST_CHOOSE_SECURITY_REQUIREMENTS,
  RFP_POST_QUALITY_GROUP,
  RFP_GET_QUALITY_GROUP,
  RFP_GET_WHERE_WORK_DONE,
  RFP_POST_WHERE_WORK_DONE,
  RFP_GET_WORK_COMPLETED,
  RFP_POST_WORK_COMPLETED,
  CA_POST_review,
  CA_GET_review,
  RFP_POST_WEIGHTINGS,
  RFP_GET_WEIGHTINGS
};
