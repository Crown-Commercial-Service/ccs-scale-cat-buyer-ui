//@ts-nocheck
import * as express from 'express'
import { LoggTracer } from '@common/logtracer/tracer'
import { TokenDecoder } from '@common/tokendecoder/tokendecoder'
import { CreateMessage } from '../model/createMessage'
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance'
import * as inboxData from '../../../resources/content/event-management/messaging-create.json'

export class ValidationErrors {
    static readonly CLASSIFICATION_REQUIRED: string = 'Message cannot be broadcast unless a Classification has been defined - broadcast cannot be completed'
    static readonly MESSAGE_REQUIRED: string = 'Message cannot be broadcast unless a Message Body has been defined - broadcast cannot be completed'
    static readonly SUBJECT_REQUIRED: string = 'message cannot be broadcast unless a Subject Line has been defined - broadcast cannot be completed'
    static readonly SUBJECT_REQUIRED_count: string = 'Message cannot be broadcast unless a Subject Line has <=5000 characters'
}

/**
 * 
 * @Rediect 
 * @endpoint /message/create
 * @param req 
 * @param res 
 */
export const EVENT_MANAGEMENT_MESSAGING_CREATE = (req: express.Request, res: express.Response) => {
    const { SESSION_ID } = req.cookies
    try {
        res.locals.agreement_header = req.session.agreement_header

        switch (req.session.eventManagement_eventType) {
            case 'EOI':
                res.locals.supplier_link = "/eoi/suppliers"
                break;

            case 'RFI':
                res.locals.supplier_link = "/rfi/suppliers"
                break;

            default: res.locals.supplier_link = "#"
        }
        const message: CreateMessage = {
            create_message: ["unclassified","Qualification Clarification", "Technical Clarification","Commercial Clarification",
                "System Query", "General Clarification","Compliance Clarification", "Procurement Outcome"],
            create_message_input: null,
            create_subject_input: null,
            IsClassificationNotDefined: false,
            IsSubjectNotDefined: false,
            IsMessageNotDefined: false,
            classificationErrorMessage: ValidationErrors.CLASSIFICATION_REQUIRED,
            subjectErrorMessage: ValidationErrors.SUBJECT_REQUIRED,
            messageErrorMessage: ValidationErrors.MESSAGE_REQUIRED,
        }

        const appendData = { data: inboxData, message: message, validationError: false, eventId: req.session['eventId'], eventType: req.session.eventManagement_eventType }
        res.render('MessagingCreate', appendData)
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

// /message/create
export const POST_MESSAGING_CREATE = async (req: express.Request, res: express.Response) => {
    const { SESSION_ID } = req.cookies
    const projectId = req.session['projectId']
    const eventId = req.session['eventId']
    try {
        const _body = req.body
        let IsClassificationNotDefined, IsSubjectNotDefined,IsSubjectNotDefinedcount, IsMessageNotDefined, validationError = false
        const errorText = [];
        if (!_body.create_message) {
            IsClassificationNotDefined = true
            validationError = true
            errorText.push({
                text: ValidationErrors.CLASSIFICATION_REQUIRED,
                href: '#create_message'
            });
        } else {
            IsClassificationNotDefined = false
        }

        if (!_body.create_message_input) {
            IsMessageNotDefined = true
            validationError = true
            errorText.push({
                text: ValidationErrors.MESSAGE_REQUIRED,
                href: '#create_message_input'
            });
        } else {
            IsMessageNotDefined = false
        }

        if (!_body.create_subject_input) {
            IsSubjectNotDefined = true
            validationError = true
            errorText.push({
                text: ValidationErrors.SUBJECT_REQUIRED,
                href: '#create_subject_input'
            });
        } else {
            IsSubjectNotDefined = false
        }
        if (_body.create_message_input.length > 5000) {
            IsSubjectNotDefinedcount = true
            validationError = true
            errorText.push({
                text: ValidationErrors.SUBJECT_REQUIRED_count,
                href: '#create_message_input'
            });
        } else {
            IsSubjectNotDefinedcount = false
        }

        const message: CreateMessage = {
            create_message: ["unclassified","Qualification Clarification", "Technical Clarification","Commercial Clarification",
                "System Query", "General Clarification","Compliance Clarification", "Procurement Outcome"],
            selected_message: _body.create_message,
            create_message_input: _body.create_message_input,
            create_subject_input: _body.create_subject_input,
            IsClassificationNotDefined: IsClassificationNotDefined,
            IsSubjectNotDefined: IsSubjectNotDefined,
            IsMessageNotDefined: IsMessageNotDefined,
            classificationErrorMessage: ValidationErrors.CLASSIFICATION_REQUIRED,
            subjectErrorMessage: ValidationErrors.SUBJECT_REQUIRED,
            messageErrorMessage: ValidationErrors.MESSAGE_REQUIRED,
            SUBJECT_REQUIRED_count: ValidationErrors.SUBJECT_REQUIRED_count
        }
        if (validationError) {
            res.locals.agreement_header = req.session.agreement_header

            switch (req.session.eventManagement_eventType) {
                case 'EOI':
                    res.locals.supplier_link = "/eoi/suppliers"
                    break;

                case 'RFI':
                    res.locals.supplier_link = "/rfi/suppliers"
                    break;

                default: res.locals.supplier_link = "#"
            }
            const appendData = { data: inboxData, message: message, validationError: validationError, errorText: errorText,eventId: req.session['eventId'], eventType: req.session.eventManagement_eventType }
            res.render('MessagingCreate', appendData)
        } else {
            const _requestBody = {
                "OCDS": {
                    "title": _body.create_subject_input,
                    "description": _body.create_message_input
                },
                "nonOCDS": {
                    "isBroadcast": true,
                    "classification": _body.create_message.toString()
                }
            };
            const baseURL = `/tenders/projects/${projectId}/events/${eventId}/messages`
            const response = await TenderApi.Instance(SESSION_ID).post(baseURL, _requestBody);
            if (response.status == 200) {
                res.redirect('/message/inbox?created=true')
            } else {
                res.redirect('/message/inbox?created=false')
            }

        }
    } catch (err) {
        LoggTracer.errorLogger(
            res,
            err,
            `${req.headers.host}${req.originalUrl}`,
            null,
            TokenDecoder.decoder(SESSION_ID),
            'Event management page',
            false,
        );
        res.redirect('/message/inbox?created=false')
    }
}