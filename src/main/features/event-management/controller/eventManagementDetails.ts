import * as express from 'express'
import { ObjectModifiers } from '../util/operations/objectremoveEmptyString'
import { LoggTracer } from '@common/logtracer/tracer'
import { TokenDecoder } from '@common/tokendecoder/tokendecoder'
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance'
import { MessageDetails } from '../model/messgeDetails'
import * as inboxData from '../../../resources/content/event-management/event-management-message-details.json'
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';

/**
 * 
 * @Rediect 
 * @endpoint '/message/details'
 * @param req 
 * @param res 
 */
export const EVENT_MANAGEMENT_MESSAGE_DETAILS_GET = async (req: express.Request, res: express.Response) => {
    const { SESSION_ID } = req.cookies
    const { id,attachmentId } = req.query
    const projectId = req.session['projectId']
    const eventId = req.session['eventId']
    req.session['messageID']=req.query
    try {
        res.locals.agreement_header = req.session.agreement_header
        if(attachmentId !== undefined)
        {
            const FileDownloadURL = `/tenders/projects/${projectId}/events/${eventId}/messages/${id}/attachments/${attachmentId}`;
      
            const FetchDocuments = await DynamicFrameworkInstance.file_dowload_Instance(SESSION_ID).get(FileDownloadURL, {
                responseType: 'arraybuffer',
            });
            const file = FetchDocuments;
            const fileName = file.headers['content-disposition'].split('filename=')[1].split('"').join('');
            const fileData = file.data;
            const type = file.headers['content-type'];
            const ContentLength = file.headers['content-length'];
            res.status(200);
            res.set({
                'Cache-Control': 'no-cache',
                'Content-Type': type,
                'Content-Length': ContentLength,
                'Content-Disposition': 'attachment; filename=' + fileName,
            });
            res.send(fileData);
        }
        else{
            const baseMessageURL = `/tenders/projects/${projectId}/events/${eventId}/messages/`+id
            const draftMessage = await TenderApi.Instance(SESSION_ID).get(baseMessageURL)

            const message: MessageDetails = draftMessage.data
            req.session['msgClassification']=draftMessage.data.nonOCDS.classification;
            const appendData = { data: inboxData, messageDetails: message, eventId: eventId, eventType: req.session.eventManagement_eventType,id:id }
            res.render('eventManagementDetails', appendData)
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