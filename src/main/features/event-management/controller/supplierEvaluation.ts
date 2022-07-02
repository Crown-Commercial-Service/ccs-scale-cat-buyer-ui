import * as express from 'express'
//import { LoggTracer } from '@common/logtracer/tracer'
//import { TokenDecoder } from '@common/tokendecoder/tokendecoder'
import { CreateMessage } from '../model/createMessage'
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance'
import * as inboxData from '../../../resources/content/event-management/messaging-create.json'

export const EVENT_MANAGEMENT_SUPPLIER_EVALUATION = (req: express.Request, res: express.Response) => {
   
        //const appendData = { data: inboxData, message: message, validationError: false, eventId: req.session['eventId'], eventType: req.session.eventManagement_eventType }
       res.render('MessagingCreate')
}