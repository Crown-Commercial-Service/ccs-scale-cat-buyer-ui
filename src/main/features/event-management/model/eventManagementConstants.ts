export enum EVENT_MANAGEMENT_PATHS {
    //@ All of the Path related Request for event management
    EVENT_MANAGEMENT = '/event/management',
    EVENT_MANAGEMENT_MESSAGING = '/message/inbox',
    EVENT_MANAGEMENT_MESSAGING_CREATE = '/message/create',
    POST_MESSAGING_CREATE = '/message/create',
    EVENT_MANAGEMENT_MESSAGING_SENT = '/message/sent',
    EVENT_MANAGEMENT_QA = '/event/qa',
    EVENT_MANAGEMENT_QA_Add_GET = '/event/qa-add',
    EVENT_MANAGEMENT_GET_QA_ADD_TWO_STEP = '/event/qa-add-2nd-step',
    EVENT_MANAGEMENT_QA_Add_POST = '/event/qa-add',
    EVENT_MANAGEMENT_QA_Edit_GET = '/event/qa-edit',
    EVENT_MANAGEMENT_QA_Edit_POST = '/event/qa-edit',
    EVENT_MANAGEMENT_NEXT_STEP_GET = '/event/next',
    POST_EVENT_MANAGEMENT_NEXT_STEP = '/event/next',
    EVENT_MANAGEMENT_MESSAGE_DETAILS_GET = '/message/details',
    POST_EVENT_MANAGEMENT_MESSAGE_DETAILS = '/message/details',
    EVENT_MANAGEMENT_MESSAGE_REPLY='/message/reply',
    POST_EVENT_MANAGEMENT_MESSAGE_REPLY='/message/reply',
    EVENT_MANAGEMENT_DOWNLOAD='/eventmanagement',
    STEPS_TO_CONTINUE='/steps-to-continue',
    PUBLISHED_PROJECT_DOWNLOAD='/publisheddoc',

    EVALUATE_SUPPLIERS='/evaluate-suppliers',
    EVALUATE_SUPPLIERS_DOWNLOAD='/evaluate-download',
    ENTER_EVALUATION='/enter-evaluation',
    ENTER_EVALUATION_POST='/enter-evaluation'

    SUPPLIER_ANSWER_DOWNLOAD='/supplieranswer',
    SUPPLIER_ANSWER_DOWNLOAD_ALL='/supplieranswerall',
    SUPPLIER_EVALUATION='/supplierevaluation',
    EVENT_MANAGEMENT_SUPPLIER_EVALUATION='/selectsupplierevaluation'
    
    

}