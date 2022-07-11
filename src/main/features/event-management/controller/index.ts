import { EVENT_MANAGEMENT,CONFIRM_SUPPLIER_AWARD } from './eventManagement'
import { GET_AWARD_SUPPLIER_DOCUMENT } from './awardDocumentComplete'
import { GET_AWARD_SUPPLIER, POST_AWARD_SUPPLIER} from './awardSupplier'
import { STAND_PERIOD_DECISION_GET,STAND_PERIOD_DECISION_POST } from './standstillPeriodDecision'
import { EVENT_MANAGEMENT_MESSAGING } from './MessagingInbox'
import { EVENT_MANAGEMENT_MESSAGING_CREATE, POST_MESSAGING_CREATE } from './MessagingCreate'
import { EVENT_MANAGEMENT_MESSAGING_SENT } from './MessagingSent'
import { EVENT_MANAGEMENT_QA } from './viewQA'
import { EVENT_MANAGEMENT_NEXT_STEP_GET,POST_EVENT_MANAGEMENT_NEXT_STEP } from './eventManagementNextStep'
import { EVENT_MANAGEMENT_MESSAGE_DETAILS_GET, POST_EVENT_MANAGEMENT_MESSAGE_DETAILS } from './eventManagementDetails'
import { EVENT_MANAGEMENT_MESSAGE_REPLY } from './MessagingReply'
import { POST_EVENT_MANAGEMENT_MESSAGE_REPLY } from './MessagingReply'
import { EVENT_MANAGEMENT_GET_QA_ADD,EVENT_MANAGEMENT_POST_QA_ADD,EVENT_MANAGEMENT_GET_QA_ADD_TWO_STEP } from './QAAdd'
import { EVENT_MANAGEMENT_GET_QA_Edit,EVENT_MANAGEMENT_POST_QA_Edit } from './QAEdit'
import { EVENT_MANAGEMENT_DOWNLOAD } from './eventManagement'
import { GET_STEPS_TO_CONTINUE } from './steps-to-continue'
import { POST_STEPS_TO_CONTINUE } from './steps-to-continue'
import { EVALUATE_SUPPLIERS } from './evaluateSuppliers'
import { EVALUATE_SUPPLIERS_DOWNLOAD } from './evaluateSuppliers'
import { ENTER_EVALUATION } from './enterEvaluation'
import { ENTER_EVALUATION_POST } from './enterEvaluation'
import { PUBLISHED_PROJECT_DOWNLOAD,SUPPLIER_ANSWER_DOWNLOAD,SUPPLIER_ANSWER_DOWNLOAD_ALL,SUPPLIER_EVALUATION } from './eventManagement'
import { GET_CONFIRM_SUPPLIER,POST_CONFIRM_SUPPLIER,Download_SUPPLIER_RESPONCE } from './confirmSupplier'

/**
 * @BaseController
 * @Provider
 * 
 * @description Provides as Base for all Controller
 */
export const EVENT_MANAGEMENT_CONTROLLER = {
    EVENT_MANAGEMENT,
    EVENT_MANAGEMENT_MESSAGING,
    EVENT_MANAGEMENT_MESSAGING_CREATE,
    POST_MESSAGING_CREATE,
    POST_EVENT_MANAGEMENT_MESSAGE_REPLY,
    EVENT_MANAGEMENT_MESSAGING_SENT,
    EVENT_MANAGEMENT_QA,
    EVENT_MANAGEMENT_NEXT_STEP_GET,
    POST_EVENT_MANAGEMENT_NEXT_STEP,
    EVENT_MANAGEMENT_MESSAGE_DETAILS_GET,
    POST_EVENT_MANAGEMENT_MESSAGE_DETAILS,
    EVENT_MANAGEMENT_MESSAGE_REPLY,
    //Q&A
    EVENT_MANAGEMENT_GET_QA_ADD,
    EVENT_MANAGEMENT_GET_QA_ADD_TWO_STEP,
    EVENT_MANAGEMENT_POST_QA_ADD,
    EVENT_MANAGEMENT_GET_QA_Edit,
    EVENT_MANAGEMENT_POST_QA_Edit,
    EVENT_MANAGEMENT_DOWNLOAD,
    GET_STEPS_TO_CONTINUE,
    POST_STEPS_TO_CONTINUE,
    PUBLISHED_PROJECT_DOWNLOAD,

    EVALUATE_SUPPLIERS,
    EVALUATE_SUPPLIERS_DOWNLOAD,
    ENTER_EVALUATION,
    ENTER_EVALUATION_POST,

    SUPPLIER_ANSWER_DOWNLOAD,
    SUPPLIER_ANSWER_DOWNLOAD_ALL,
    SUPPLIER_EVALUATION,
    GET_CONFIRM_SUPPLIER,
    POST_CONFIRM_SUPPLIER,
    GET_AWARD_SUPPLIER,
    POST_AWARD_SUPPLIER,
    GET_AWARD_SUPPLIER_DOCUMENT,
    CONFIRM_SUPPLIER_AWARD,
    Download_SUPPLIER_RESPONCE,
    STAND_PERIOD_DECISION_GET,
    STAND_PERIOD_DECISION_POST
}