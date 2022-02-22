import { EVENT_MANAGEMENT } from './eventManagement'
import { EVENT_MANAGEMENT_MESSAGING } from './MessagingInbox'
import { EVENT_MANAGEMENT_MESSAGING_CREATE, POST_MESSAGING_CREATE } from './MessagingCreate'
import { EVENT_MANAGEMENT_MESSAGING_SENT } from './MessagingSent'
import { EVENT_MANAGEMENT_QA } from './viewQA'
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
    EVENT_MANAGEMENT_MESSAGING_SENT,
    EVENT_MANAGEMENT_QA
}