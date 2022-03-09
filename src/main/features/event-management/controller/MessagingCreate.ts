import * as express from 'express'
import { LoggTracer } from '@common/logtracer/tracer'
import { TokenDecoder } from '@common/tokendecoder/tokendecoder'
import { CreateMessage } from '../model/createMessage'
import * as inboxData from '../../../resources/content/event-management/messaging-create.json'


export class ValidationErrors {
    static readonly CLASSIFICATION_REQUIRED: string = 'Message cannot be broadcast unless a Classification has been defined'
    static readonly MESSAGE_REQUIRED: string = 'Message cannot be broadcast unless a Subject Line has been defined'
    static readonly SUBJECT_REQUIRED: string = 'message cannot be broadcast unless a Message Body has been defined'
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
            create_message: ["General Classification"], // this value needs to be taken from API or move it to JSON
            create_message_input: null, // this value needs to be taken from API
            create_subject_input: null, // this value needs to be taken from API
            IsClassificationNotDefined: false,
            IsSubjectNotDefined: false,
            IsMessageNotDefined: false,
            classificationErrorMessage: ValidationErrors.CLASSIFICATION_REQUIRED,
            subjectErrorMessage: ValidationErrors.SUBJECT_REQUIRED,
            messageErrorMessage: ValidationErrors.MESSAGE_REQUIRED
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
export const POST_MESSAGING_CREATE = (req: express.Request, res: express.Response) => {
    const { SESSION_ID } = req.cookies
    try {
        const _body = req.body
        let IsClassificationNotDefined, IsSubjectNotDefined, IsMessageNotDefined, validationError = false
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
                href: '#create_subject_input'
              });
        } else {
            IsMessageNotDefined = false
        }

        if (!_body.create_subject_input) {
            IsSubjectNotDefined = true
            validationError = true
            errorText.push({
                text: ValidationErrors.SUBJECT_REQUIRED,
                href: '#create_message_input'
              });
        } else {
            IsSubjectNotDefined = false
        }

        const message: CreateMessage = {
            create_message: [_body.create_message ? _body.create_message : "General Classification"], // This needs to be revisited
            create_message_input: _body.create_message_input,
            create_subject_input: _body.create_subject_input,
            IsClassificationNotDefined: IsClassificationNotDefined,
            IsSubjectNotDefined: IsSubjectNotDefined,
            IsMessageNotDefined: IsMessageNotDefined,
            classificationErrorMessage: ValidationErrors.CLASSIFICATION_REQUIRED,
            subjectErrorMessage: ValidationErrors.SUBJECT_REQUIRED,
            messageErrorMessage: ValidationErrors.MESSAGE_REQUIRED
        }

        if (validationError) {
            const appendData = { data: inboxData, message: message, validationError: validationError, errorText: errorText }
            res.render('MessagingCreate', appendData)
        } else {
            res.redirect('/message/inbox?created=true')
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