import * as express from 'express'
import { LoggTracer } from '@common/logtracer/tracer'
import { TokenDecoder } from '@common/tokendecoder/tokendecoder'
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance'
import { Message } from '../model/messages'
import moment from 'moment';
import * as inboxData from '../../../resources/content/event-management/messaging-sent.json'
import * as dos6InboxData from '../../../resources/content/event-management/messaging-sent dos6.json'
import { logConstant } from '../../../common/logtracer/logConstant';

/**
 * 
 * @Rediect 
 * @endpoint /message/sent
 * @param req 
 * @param res 
 */
export const EVENT_MANAGEMENT_MESSAGING_SENT = async (req: express.Request, res: express.Response) => {
    const { SESSION_ID } = req.cookies
    const projectId = req.session['projectId']
    const eventId = req.session['eventId']
    const agreementId = req.session.agreement_id;
    try {
        res.locals.agreement_header = req.session.agreement_header

        const baseSentMessageURL = `/tenders/projects/${projectId}/events/${eventId}/messages?message-direction=SENT`
        const draftSentMessage = await TenderApi.Instance(SESSION_ID).get(baseSentMessageURL)
        
        //CAS-INFO-LOG 
        LoggTracer.infoLogger(draftSentMessage, logConstant.messageSent, req);

        const sentMessage: Message[] = draftSentMessage.data.messages
        
        if (sentMessage != undefined) {
            sentMessage.sort((a, b) => (a.OCDS.date < b.OCDS.date) ? 1 : -1)
            for (let i = 0; i < sentMessage.length; i++) {
                sentMessage[i].OCDS.date = (moment(sentMessage[i].OCDS.date)).format('DD/MMM/YYYY - HH:mm')
            }
        }
        let data;
        if(agreementId == 'RM1043.8' || agreementId == 'RM1557.13') { //DOS6
            data = dos6InboxData;
          } else { 
            data = inboxData;
          }

        const appendData = {selectedReceived:"",selectedSent:"selected", data, messages: sentMessage, eventId: req.session['eventId'], eventType: req.session.eventManagement_eventType, agreementId }
        
        //CAS-INFO-LOG 
        LoggTracer.infoLogger(null, logConstant.messageSentPageLogger, req);

        res.render('MessagingSent', appendData)
    } catch (err) {
        LoggTracer.errorLogger(
            res,
            err,
            `${req.headers.host}${req.originalUrl}`,
            null,
            TokenDecoder.decoder(SESSION_ID),
            'Event management page',
            true,
        );
    }
}