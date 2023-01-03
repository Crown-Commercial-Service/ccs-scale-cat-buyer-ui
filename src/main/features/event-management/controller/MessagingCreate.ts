import * as express from 'express'
import { LoggTracer } from '@common/logtracer/tracer'
import { TokenDecoder } from '@common/tokendecoder/tokendecoder'
import { CreateMessage } from '../model/createMessage'
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance'
import * as inboxData from '../../../resources/content/event-management/messaging-create.json'
import * as dos6InboxData from '../../../resources/content/event-management/messaging-createdos6.json'
//import { GetLotSuppliers } from '../../shared/supplierService';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';

export class ValidationErrors {
    static readonly SUPPLIER_REQUIRED: string = 'message cannot be broadcast unless a Supplier has been defined - broadcast cannot be completed'
    static readonly CLASSIFICATION_REQUIRED: string = 'Message cannot be broadcast unless a Classification has been defined - broadcast cannot be completed'
    static readonly MESSAGE_REQUIRED: string = 'Message cannot be broadcast unless a Message Body has been defined - broadcast cannot be completed'
    static readonly SUBJECT_REQUIRED: string = 'message cannot be broadcast unless a Subject has been defined - broadcast cannot be completed'
    
    static readonly SINGLE_SUPPLIER_REQUIRED: string = 'message cannot be sent unless a Supplier has been defined - message cannot be completed'
    static readonly SINGLE_CLASSIFICATION_REQUIRED: string = 'Message cannot be sent unless a Classification has been defined - message cannot be completed'
    static readonly SINGLE_MESSAGE_REQUIRED: string = 'Message cannot be sent unless a Message Body has been defined - message cannot be completed'
    static readonly SINGLE_SUBJECT_REQUIRED: string = 'message cannot be sent unless a Subject has been defined - message cannot be completed'
    
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
    const agreementId = req.session.agreement_id;
    try {
        res.locals.agreement_header = req.session.agreement_header

        switch (req.session.eventManagement_eventType) {
            case 'EOI':
                res.locals.supplier_link = "/eoi/suppliers?fromMessage=1"
                break;

            case 'RFI':
                res.locals.supplier_link = "/rfi/suppliers?fromMessage=1"
                break;
                case 'FC':
                    res.locals.supplier_link = "/rfp/suppliers?fromMessage=1"
                    break;
                    case 'DA':
                    res.locals.supplier_link = "/da/suppliers?fromMessage=1"
                    break;
            default: res.locals.supplier_link = "#"
            
            // case 'EOI':
            //     res.locals.supplier_link = "/eoi/suppliers"
            //     break;

            // case 'RFI':
            //     res.locals.supplier_link = "/rfi/suppliers"
            //     break;

            // default: res.locals.supplier_link = "#"
        }
        const message: CreateMessage = {
            create_message: ["Unclassified","Qualification Clarification", "Technical Clarification","Commercial Clarification",
                "System Query", "General Clarification","Compliance Clarification", "Procurement Outcome"],
                create_supplier_message:null,
            create_message_input: null,
            create_subject_input: null,
            IsSupplierNotDefined:false,
            IsClassificationNotDefined: false,
            IsSubjectNotDefined: false,
            IsMessageNotDefined: false,
            classificationErrorMessage: ValidationErrors.CLASSIFICATION_REQUIRED,
            subjectErrorMessage: ValidationErrors.SUBJECT_REQUIRED,
            messageErrorMessage: ValidationErrors.MESSAGE_REQUIRED,
            selected_message: ''
        }
        let data;
        if(agreementId == 'RM1043.8') { //DOS6
            data = dos6InboxData;
          } else { 
            data = inboxData;
          }
          
          
        const appendData = { data, message: message, validationError: false, eventId: req.session['eventId'], eventType: req.session.eventManagement_eventType, agreementId}
        
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
    const agreementId = req.session.agreement_id;
    
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

        const message: CreateMessage = {
            create_message: ["Unclassified","Qualification Clarification", "Technical Clarification","Commercial Clarification",
                "System Query", "General Clarification","Compliance Clarification", "Procurement Outcome"],
                create_supplier_message: _body.create_supplier_message,
            selected_message: _body.create_message,
            create_message_input: _body.create_message_input,
            create_subject_input: _body.create_subject_input,
            IsSupplierNotDefined:false,
            IsClassificationNotDefined: IsClassificationNotDefined,
            IsSubjectNotDefined: IsSubjectNotDefined,
            IsMessageNotDefined: IsMessageNotDefined,
            classificationErrorMessage: ValidationErrors.CLASSIFICATION_REQUIRED,
            subjectErrorMessage: ValidationErrors.SUBJECT_REQUIRED,
            messageErrorMessage: ValidationErrors.MESSAGE_REQUIRED
        }
        if (validationError) {
            res.locals.agreement_header = req.session.agreement_header
           
            switch (req.session.eventManagement_eventType) {
                case 'EOI':
                    res.locals.supplier_link = "/eoi/suppliers?fromMessage=1"
                    break;

                    case 'RFI':
                        res.locals.supplier_link = "/rfi/suppliers?fromMessage=1"
                        break;
                        case 'FC':
                            res.locals.supplier_link = "/rfp/suppliers?fromMessage=1"
                            break;
                            case 'DA':
                            res.locals.supplier_link = "/rfp/suppliers?fromMessage=1"
                            break;
                default: res.locals.supplier_link = "#"

                // case 'EOI':
                //     res.locals.supplier_link = "/eoi/suppliers"
                //     break;

                // case 'RFI':
                //     res.locals.supplier_link = "/rfi/suppliers"
                //     break;

                // default: res.locals.supplier_link = "#"
            }
            let data;
        if(agreementId == 'RM1043.8') { //DOS6
            data = dos6InboxData;
          } else { 
            data = inboxData;
          }
            const appendData = { data, message: message, validationError: validationError, errorText: errorText,eventId: req.session['eventId'], eventType: req.session.eventManagement_eventType, agreementId }
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


// SUPPLIER BASED MESAGING SEND

export const EVENT_MANAGEMENT_MESSAGING_SUBBLIER_CREATE = async (req: express.Request, res: express.Response) => {
//export const EVENT_MANAGEMENT_MESSAGING_SUBBLIER_CREATE = (req: express.Request, res: express.Response) => {
    const { SESSION_ID } = req.cookies
    const { projectId } = req.session;
    const agreementId = req.session.agreement_id;
    try {
        res.locals.agreement_header = req.session.agreement_header

        switch (req.session.eventManagement_eventType) {
            case 'EOI':
                res.locals.supplier_link = "/eoi/suppliers?fromMessage=1"
                break;

            case 'RFI':
                res.locals.supplier_link = "/rfi/suppliers?fromMessage=1"
                break;
                case 'FC':
                    res.locals.supplier_link = "/rfp/suppliers?fromMessage=1"
                    break;
                    case 'DA':
                    res.locals.supplier_link = "/da/suppliers?fromMessage=1"
                    break;
            default: res.locals.supplier_link = "#"
            
            // case 'EOI':
            //     res.locals.supplier_link = "/eoi/suppliers"
            //     break;

            // case 'RFI':
            //     res.locals.supplier_link = "/rfi/suppliers"
            //     break;

            // default: res.locals.supplier_link = "#"
        }

        //let supplierList = [];

        const supplierBaseURL: any = `/tenders/projects/${projectId}/events/${req.session.eventId}/suppliers`;

        const SUPPLIERS = await DynamicFrameworkInstance.Instance(SESSION_ID).get(supplierBaseURL);
        let SUPPLIER_DATA = SUPPLIERS?.data;//saved suppliers
        //SCAT-8083
        SUPPLIER_DATA = SUPPLIER_DATA.suppliers.sort((a: any, b: any) => (a.name < b.name ? -1 : 1));

        const message: CreateMessage = {
            create_message: ["Unclassified","Qualification Clarification", "Technical Clarification","Commercial Clarification",
                "System Query", "General Clarification","Compliance Clarification", "Procurement Outcome"],
                create_supplier_message:null,
            create_message_input: null,
            create_subject_input: null,
            IsSupplierNotDefined:false,
            IsClassificationNotDefined: false,
            IsSubjectNotDefined: false,
            IsMessageNotDefined: false,
            classificationErrorMessage: ValidationErrors.CLASSIFICATION_REQUIRED,
            subjectErrorMessage: ValidationErrors.SUBJECT_REQUIRED,
            messageErrorMessage: ValidationErrors.MESSAGE_REQUIRED,
            selected_message: ''
        }
        let data;
        if(agreementId == 'RM1043.8') { //DOS6
            data = dos6InboxData;
          } else { 
            data = inboxData;
          }
          
        const appendData = { supplierList:SUPPLIER_DATA,data, message: message, validationError: false, eventId: req.session['eventId'], eventType: req.session.eventManagement_eventType, agreementId}
        
        
        res.render('MessaginSupplierCreate', appendData)
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
export const POST_MESSAGING_SUBBLIER_CREATE = async (req: express.Request, res: express.Response) => {
    const { SESSION_ID } = req.cookies
    const projectId = req.session['projectId']
    const eventId = req.session['eventId']
    const agreementId = req.session.agreement_id;
    
    try {
        const _body = req.body
        let IsSupplierNotDefined,IsClassificationNotDefined, IsSubjectNotDefined, IsMessageNotDefined, validationError = false
        const errorText = [];
        
        if (!_body.create_supplier_message) {
            IsSupplierNotDefined = true
            validationError = true
            errorText.push({
                text: ValidationErrors.SINGLE_SUPPLIER_REQUIRED,
                href: '#create_supplier_message'
            });
        } else {
            IsSupplierNotDefined = false
        }

        if (!_body.create_message) {
            IsClassificationNotDefined = true
            validationError = true
            errorText.push({
                text: ValidationErrors.SINGLE_CLASSIFICATION_REQUIRED,
                href: '#create_message'
            });
        } else {
            IsClassificationNotDefined = false
        }

        if (!_body.create_message_input) {
            IsMessageNotDefined = true
            validationError = true
            errorText.push({
                text: ValidationErrors.SINGLE_MESSAGE_REQUIRED,
                href: '#create_message_input'
            });
        } else {
            IsMessageNotDefined = false
        }

        if (!_body.create_subject_input) {
            IsSubjectNotDefined = true
            validationError = true
            errorText.push({
                text: ValidationErrors.SINGLE_SUBJECT_REQUIRED,
                href: '#create_subject_input'
            });
        } else {
            IsSubjectNotDefined = false
        }

        const supplierBaseURL: any = `/tenders/projects/${projectId}/events/${req.session.eventId}/suppliers`;

        const SUPPLIERS = await DynamicFrameworkInstance.Instance(SESSION_ID).get(supplierBaseURL);
        let SUPPLIER_DATA = SUPPLIERS?.data;//saved suppliers
        

        const message: CreateMessage = {
            create_message: ["Unclassified","Qualification Clarification", "Technical Clarification","Commercial Clarification",
                "System Query", "General Clarification","Compliance Clarification", "Procurement Outcome"],
            create_supplier_message: _body.create_supplier_message,
            selected_message: _body.create_message,
            create_message_input: _body.create_message_input,
            create_subject_input: _body.create_subject_input,
            IsSupplierNotDefined:IsSupplierNotDefined,
            IsClassificationNotDefined: IsClassificationNotDefined,
            IsSubjectNotDefined: IsSubjectNotDefined,
            IsMessageNotDefined: IsMessageNotDefined,
            //supplier_required: ValidationErrors.SINGLE_SUPPLIER_REQUIRED,
            classificationErrorMessage: ValidationErrors.SINGLE_CLASSIFICATION_REQUIRED,
            subjectErrorMessage: ValidationErrors.SINGLE_SUBJECT_REQUIRED,
            messageErrorMessage: ValidationErrors.SINGLE_MESSAGE_REQUIRED,
            
        }
        if (validationError) {
            res.locals.agreement_header = req.session.agreement_header
           
            switch (req.session.eventManagement_eventType) {
                case 'EOI':
                    res.locals.supplier_link = "/eoi/suppliers?fromMessage=1"
                    break;

                    case 'RFI':
                        res.locals.supplier_link = "/rfi/suppliers?fromMessage=1"
                        break;
                        case 'FC':
                            res.locals.supplier_link = "/rfp/suppliers?fromMessage=1"
                            break;
                            case 'DA':
                            res.locals.supplier_link = "/rfp/suppliers?fromMessage=1"
                            break;
                default: res.locals.supplier_link = "#"

                // case 'EOI':
                //     res.locals.supplier_link = "/eoi/suppliers"
                //     break;

                // case 'RFI':
                //     res.locals.supplier_link = "/rfi/suppliers"
                //     break;

                // default: res.locals.supplier_link = "#"
            }
            let data;
            if(agreementId == 'RM1043.8') { //DOS6
                data = dos6InboxData;
              } else { 
                data = inboxData;
              }

            const appendData = { supplierList:SUPPLIER_DATA.suppliers,data, message: message, validationError: validationError, errorText: errorText,eventId: req.session['eventId'], eventType: req.session.eventManagement_eventType, agreementId }
            res.render('MessaginSupplierCreate', appendData)
        } else {
           
            // const _requestBody = {
            //     "OCDS": {
            //         "title": _body.create_subject_input,
            //         "description": _body.create_message_input
            //     },
            //     "nonOCDS": {
            //         "isBroadcast": true,
            //         "classification": _body.create_message.toString()
            //     }
            // };
            const supplierBaseURL: any = `/tenders/projects/${projectId}/events/${req.session.eventId}/suppliers`;
            const SUPPLIERS = await DynamicFrameworkInstance.Instance(SESSION_ID).get(supplierBaseURL);
        let SUPPLIER_DATA = SUPPLIERS?.data;//saved suppliers
     
        
        const MatchedSupplierIDS : any = [];
        for(let i=0;i<SUPPLIER_DATA.suppliers.length;i++){
          if(SUPPLIER_DATA.suppliers[i].id==_body.create_supplier_message) MatchedSupplierIDS.push(SUPPLIER_DATA.suppliers[i].name);
        }
       
            const _requestBody = {
                "OCDS": {
                    "title": _body.create_subject_input,
                    "description": _body.create_message_input
                },
                "nonOCDS": {
                    "isBroadcast": false,
                    "classification":  _body.create_message.toString(),
                    "receiverList":[           
                    {
                        "id":_body.create_supplier_message,
                        "name":MatchedSupplierIDS[0]
                    }            
                  ]
                
                }};
                
             req.session['SupplierNameforMessagereply'] = MatchedSupplierIDS[0];
            const baseURL = `/tenders/projects/${projectId}/events/${eventId}/messages`
            const response = await TenderApi.Instance(SESSION_ID).post(baseURL, _requestBody);
            if (response.status == 200) {
                res.redirect('/message/inbox?createdreply=true')
            } else {
                res.redirect('/message/inbox?createdreply=false')
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

