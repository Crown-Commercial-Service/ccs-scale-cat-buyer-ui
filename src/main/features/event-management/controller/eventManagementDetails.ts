import * as express from 'express'
import { ObjectModifiers } from '../util/operations/objectremoveEmptyString'
import { LoggTracer } from '@common/logtracer/tracer'
import { TokenDecoder } from '@common/tokendecoder/tokendecoder'
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance'
import { MessageDetails } from '../model/messgeDetails'
import * as inboxData from '../../../resources/content/event-management/event-management-message-details.json'

/**
 * 
 * @Rediect 
 * @endpoint '/message/details'
 * @param req 
 * @param res 
 */
export const EVENT_MANAGEMENT_MESSAGE_DETAILS_GET = async (req: express.Request, res: express.Response) => {
    const { SESSION_ID } = req.cookies
    const { id } = req.query
    const projectId = req.session['projectId']
    const eventId = req.session['eventId']
    try {
        res.locals.agreement_header = req.session.agreement_header
        const baseMessageURL = `/tenders/projects/${projectId}/events/${eventId}/messages/`+id
        const draftMessage = await TenderApi.Instance(SESSION_ID).get(baseMessageURL)

        const message: MessageDetails = draftMessage.data

        const appendData = { data: inboxData, messageDetails: message }
        res.render('eventManagementDetails', appendData)
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

// '/message/details'
export const POST_EVENT_MANAGEMENT_MESSAGE_DETAILS = (req: express.Request, res: express.Response) => {
    const { SESSION_ID } = req.cookies
    const filtered_body_content_removed_event_key = ObjectModifiers._deleteKeyofEntryinObject(
        req.body,
        'choose_event_management_next_step',
    );
    const { event_management_next_step } = filtered_body_content_removed_event_key;
    let redirect_address
    try {
        if (event_management_next_step) {
            switch (event_management_next_step) {
                case 'pre-market':
                    redirect_address = "/projects/create-or-choose";
                    res.redirect(redirect_address);
                    break;

                case 'write-publish':
                    redirect_address = "/projects/create-or-choose"
                    res.redirect(redirect_address);
                    break;

                case 'move-from-cat':
                    if (req.session.eventManagement_eventType == "RFI"){
                        redirect_address = "/rfi/review"
                    } else if(req.session.eventManagement_eventType == "EOI"){
                        redirect_address = "/eoi/review"
                    }
                    res.redirect(redirect_address);
                    break;

                case 'close':
                    redirect_address= "#"
                    res.redirect(redirect_address);
                    break;

                case 'decide-later':
                    redirect_address = "/dashboard"
                    res.redirect(redirect_address);
                    break;

                default:
                    res.redirect('/404');
            }
        } else {
            req.session['isJaggaerError'] = true;
            res.redirect('/event/next');
        }

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