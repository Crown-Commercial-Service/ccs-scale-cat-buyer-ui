import * as express from 'express'
import { ObjectModifiers } from '../util/operations/objectremoveEmptyString'
import { LoggTracer } from '@common/logtracer/tracer'
import { TokenDecoder } from '@common/tokendecoder/tokendecoder'
import * as inboxData from '../../../resources/content/event-management/event-management-next-step.json'
import { Procurement } from '../../procurement/model/project';
import { ReleatedContent } from '../../agreement/model/related-content'

/**
 * 
 * @Rediect 
 * @endpoint /event/next
 * @param req 
 * @param res 
 */
export const EVENT_MANAGEMENT_NEXT_STEP_GET = (req: express.Request, res: express.Response) => {
    const { SESSION_ID } = req.cookies
    try {
        res.locals.event_header = req.session.event_header

        const classificationData: any = { classification: "General Classification" } // this value needs to be taken from API or move it to JSON
        const messageDescription: any = "" // this value needs to be taken from API
        const messageSubject = "" // this value needs to be taken from API

        const appendData = { data: inboxData, classificationData, messageSubject, messageDescription, error: req.session['isJaggaerError'] }
        req.session['isJaggaerError'] = false;
        res.render('eventManagementNextStep', appendData)
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

// /event/next
export const POST_EVENT_MANAGEMENT_NEXT_STEP = (req: express.Request, res: express.Response) => {
    const { SESSION_ID } = req.cookies
    const filtered_body_content_removed_event_key = ObjectModifiers._deleteKeyofEntryinObject(
        req.body,
        'choose_event_management_next_step',
    );
    const { event_management_next_step } = filtered_body_content_removed_event_key;

    const proc: Procurement = {
        procurementID: "3667",
        eventId: "ocds-b5fd17-3782",
        defaultName: {
            name: "RM6263-Lot 1-COGNIZANT BUSINESS SERVICES UK LIMITED",
            components: {
                agreementId: "RM6263",
                lotId: "Lot 1",
                org: "COGNIZANT BUSINESS SERVICES UK LIMITED",
            }
        },
        started: true
    }
    req.session.procurements.push(proc);
    req.session.agreement_id = "RM6263";
    req.session.agreementLotName = "Digital Programmes"
    req.session.agreementName = "Digital Specialists and Programmes"
    req.session.lotId = "Lot 1"

    const releatedContent: ReleatedContent = new ReleatedContent();
    releatedContent.name = "Digital Specialists and Programmes"
    releatedContent.lotName = "Lot 1: Digital Programmes"
    releatedContent.lotUrl = "/agreement/lot?agreement_id=RM6263&lotNum="+req.session.lotId.replace(/ /g,"%20");
    releatedContent.title = 'Related content'
    req.session.releatedContent = releatedContent



    try {
        if (event_management_next_step) {
            switch (event_management_next_step) {
                case 'pre-market':
                    // eslint-disable-next-line no-case-declarations
                    const redirect_address = "/projects/create-or-choose";
                    res.redirect(redirect_address);
                    break;

                case 'write-publish':
                    // eslint-disable-next-line no-case-declarations
                    const newAddress1 = "/projects/create-or-choose"
                    res.redirect(newAddress1);
                    break;

                case 'move-from-cat':
                    // eslint-disable-next-line no-case-declarations
                    const nextAddress2 = "#"
                    res.redirect(nextAddress2);
                    break;

                case 'close':
                    // eslint-disable-next-line no-case-declarations
                    const newAddress3 = "#"
                    res.redirect(newAddress3);
                    break;

                case 'decide-later':
                    // eslint-disable-next-line no-case-declarations
                    const nextAddress = "/dashboard"
                    res.redirect(nextAddress);
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