//@ts-nocheck
import * as express from 'express';
import { operations } from '../../../utils/operations/operations';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { OrganizationInstance } from '../util/fetch/organizationuserInstance';
import { ObjectModifiers } from '../util/operations/objectremoveEmptyString';
import { ErrorView } from '../../../common/shared/error/errorView';
import { QuestionHelper } from '../helpers/question';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { Logger } from '@hmcts/nodejs-logging';
const logger = Logger.getLogger('questionsPage');
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';
import { TenderApi } from '@common/util/fetch/procurementService/TenderApiInstance';
import moment from 'moment-business-days';
import moment from 'moment';
import { AgreementAPI } from '../../../common/util/fetch/agreementservice/agreementsApiInstance';
import { logConstant } from '../../../common/logtracer/logConstant';


/**
 * @Controller
 * @GET
 * @summary switches query related to specific parameter
 * @validation false
 */
export const GET_QUESTIONS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { agreement_id, proc_id, event_id, id, group_id } = req.query;

  try {

    if(agreement_id == 'RM6187'){
     
    const { data: journeySteps } = await TenderApi.Instance(SESSION_ID).get(`journeys/${event_id}/steps`);
    const journeys=journeySteps.find(item => item.step == 20);
    
    if(journeys.state !='Completed'){
      await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/20`, 'In progress');
    }
  }

    const baseURL: any = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups/${group_id}/questions`;
    
    const fetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(baseURL);
    let fetch_dynamic_api_data = fetch_dynamic_api?.data;
       
    //CAS-INFO-LOG 
    LoggTracer.infoLogger(fetch_dynamic_api_data, logConstant.questionDetails, req);


    const headingBaseURL: any = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups`;
    const heading_fetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(headingBaseURL);

    const organizationID = req.session.user.payload.ciiOrgId;
    const organisationBaseURL = `/organisation-profiles/${organizationID}`;
    const getOrganizationDetails = await OrganizationInstance.OrganizationUserInstance().get(organisationBaseURL);
    const name = getOrganizationDetails.data.identifier.legalName;
    const organizationName = name;

    let matched_selector = heading_fetch_dynamic_api?.data.filter((agroupitem: any) => {
      return agroupitem?.OCDS?.['id'] === group_id;
    });

    matched_selector = matched_selector?.[0];
    const { OCDS, nonOCDS } = matched_selector;
    const bcTitleText = OCDS?.description;
    const titleText = nonOCDS.mandatory === false ? OCDS?.description + ' (Optional)' : OCDS?.description;
    const promptData = nonOCDS?.prompt;
    const splitOn = ' <br> ';
    const promptSplit = promptData.split(splitOn);
    const nonOCDSList = [];
    const form_name = fetch_dynamic_api_data?.map((aSelector: any) => {
      const questionNonOCDS = {
        groupId: group_id,
        questionId: aSelector.OCDS.id,
        questionType: aSelector.nonOCDS.questionType,
        mandatory: aSelector.nonOCDS.mandatory,
        multiAnswer: aSelector.nonOCDS.multiAnswer,
        length: aSelector.nonOCDS.length,
      };
      
      nonOCDSList.push(questionNonOCDS);
      if (aSelector.nonOCDS.questionType === 'SingleSelect' && aSelector.nonOCDS.multiAnswer === false) {
        return 'ccs_eoi_vetting_form';
      } else if (aSelector.nonOCDS.questionType === 'Value' && aSelector.nonOCDS.multiAnswer === true) {
        return 'ccs_eoi_questions_form';
      } else if (aSelector.nonOCDS.questionType === 'Value' && aSelector.nonOCDS.multiAnswer == false) {
        return 'ccs_eoi_who_form';
      } else if (aSelector.nonOCDS.questionType === 'KeyValuePair' && aSelector.nonOCDS.multiAnswer == true) {
        return 'ccs_eoi_acronyms_form';
      } else if (aSelector.nonOCDS.questionType === 'Text' && aSelector.nonOCDS.multiAnswer == false) {
        return 'ccs_eoi_about_proj';
      } else if (aSelector.nonOCDS.questionType === 'MultiSelect' && aSelector.nonOCDS.multiAnswer === true) {
        return 'eoi_location';
      } else if (aSelector.nonOCDS.questionType === 'Text' && aSelector.nonOCDS.multiAnswer == true) {
        return 'ccs_eoi_splterms_form';
      } else if (aSelector.nonOCDS.questionType === 'Monetary' && aSelector.nonOCDS.multiAnswer === false) {
        return 'eoi_budget_form';
      } else if (aSelector.nonOCDS.questionType === 'Date' && aSelector.nonOCDS.multiAnswer == false) {
        return 'ccs_eoi_date_form';
      } else if (aSelector.nonOCDS.questionType === 'Duration' && aSelector.nonOCDS.multiAnswer == false) {
        return 'ccs_eoi_date_form';  
      } else {
        return '';
      }
    });
    
    const ChoosenAgreement = req.session.agreement_id;
    const FetchAgreementServiceData = await AgreementAPI.Instance(null).get(`/agreements/${ChoosenAgreement}`);
    const AgreementEndDate = FetchAgreementServiceData.data.endDate;
    
    req.session?.nonOCDSList = nonOCDSList;
    const releatedContent = req.session.releatedContent;
    fetch_dynamic_api_data = fetch_dynamic_api_data.sort((a, b) => (a.OCDS.id < b.OCDS.id ? -1 : 1));
    const errorText = findErrorText(fetch_dynamic_api_data, req);
    const { isFieldError } = req.session;
    if(group_id=='Group 7')
    {
      form_name[0]='ccs_eoi_vetting_form';
      form_name[1]='ccs_eoi_vetting_form';
      if(fetch_dynamic_api_data[1] == undefined) {
        fetch_dynamic_api_data[0].nonOCDS.multiAnswer=false;
      } else {
        fetch_dynamic_api_data[1].nonOCDS.multiAnswer=false;
      }
    }

    fetch_dynamic_api_data = fetch_dynamic_api_data.map(item => {
      const newItem = item;
      if (item.nonOCDS.dependency == undefined) {
        newItem.nonOCDS.dependant = false;
        newItem.nonOCDS.childern = [];
      } else {
        newItem.nonOCDS.dependant = true;
        newItem.nonOCDS.childern = [];
      }
      return newItem;
    });

    const TemporaryObjStorage = [];
    for (const ITEM of fetch_dynamic_api_data) {
      if (ITEM.nonOCDS.dependant && ITEM.nonOCDS.dependency.relationships) {
        const RelationsShip = ITEM.nonOCDS.dependency.relationships;
        for (const Relation of RelationsShip) {
          const { dependentOnId } = Relation;
          const findElementInData = fetch_dynamic_api_data.filter(item => item.OCDS.id === dependentOnId)[0];
          findElementInData.nonOCDS.childern = [...findElementInData.nonOCDS.childern, ITEM];
          TemporaryObjStorage.push(findElementInData);
        }
      } else {
        TemporaryObjStorage.push(ITEM);
      }
    }
    const data = {
      data: fetch_dynamic_api_data,
      agreement: AgreementEndDate,
      agreement_id: agreement_id,
      proc_id: proc_id,
      event_id: event_id,
      group_id: group_id,
      criterian_id: id,
      form_name: form_name?.[0],
      eoiTitle: titleText,
      bcTitleText,
      prompt: promptSplit,
      organizationName: organizationName,
      emptyFieldError: req.session['isValidationError'],
      errorText: errorText,
      releatedContent: releatedContent,
    };
    
    if (isFieldError) {
      delete data.data[0].nonOCDS.options;
      data.data[0].nonOCDS.options = req.session['errorFields'];
    }

    if (group_id === 'Group 7' && id === 'Criterion 1') {
      data?.data?.[0]?.nonOCDS?.childern.push(TemporaryObjStorage?.[1]);
      data?.data?.[0]?.nonOCDS?.childern?.[0]?.nonOCDS?.questionType = '';
    }

    req.session['isFieldError'] = false;
    req.session['isValidationError'] = false;
    req.session['fieldLengthError'] = [];
    req.session['emptyFieldError'] = false;
 
    //CAS-INFO-LOG
    LoggTracer.infoLogger(null, data.eoiTitle, req);

   res.render('questionsEoi', data);
   
  } catch (error) {
    delete error?.config?.['headers'];
    const Logmessage = {
      Person_id: TokenDecoder.decoder(SESSION_ID),
      error_location: `${req.headers.host}${req.originalUrl}`,
      sessionId: 'null',
      error_reason: 'EOI Dynamic framework throws error - Tenders Api is causing problem',
      exception: error,
    };
    const Log = new LogMessageFormatter(
      Logmessage.Person_id,
      Logmessage.error_location,
      Logmessage.sessionId,
      Logmessage.error_reason,
      Logmessage.exception,
    );
    LoggTracer.errorTracer(Log, res);
  }
};

/**
 * @Controller
 * @POST
 * @param eoi_questions
 * @summary
 * @validation true
 */
// path = '/eoi/questionnaire'
export const POST_QUESTION = async (req: express.Request, res: express.Response) => {

  try {
    const { proc_id, event_id, id, group_id, stop_page_navigate } = req.query;
    const agreement_id = req.session.agreement_id;
    const { SESSION_ID } = req.cookies;
    const { eventId } = req.session;
   
    const { data: journeySteps } = await TenderApi.Instance(SESSION_ID).get(`journeys/${event_id}/steps`);
    const journeys=journeySteps.find(item => item.step == 20);
    
    if(journeys.state !='Completed'){
      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/20`, 'In progress');
    }
    
    const regex = /questionnaire/gi;
    const url = req.originalUrl.toString();
    const nonOCDS = req.session?.nonOCDSList?.filter(anItem => anItem.groupId == group_id);
    const started_progress_check: boolean = operations.isUndefined(req.body, 'eoi_build_started');
    let { eoi_build_started, question_id } = req.body;
    let question_ids = [];
    //Added for SCAT-3315- Agreement expiry date
    const BaseUrlAgreement = `/agreements/${agreement_id}`;
    const retrieveAgreement = await AgreementAPI.Instance(null).get(BaseUrlAgreement);
     
    //CAS-INFO-LOG
     LoggTracer.infoLogger(retrieveAgreement, logConstant.aggrementDetailFetch, req);

    const agreementExpiryDate = retrieveAgreement.data.endDate;
    if (!Array.isArray(question_id) && question_id !== undefined) question_ids = [question_id];
    else question_ids = question_id;

    if (operations.equals(started_progress_check, false)) {
      if (eoi_build_started === 'true' && nonOCDS.length > 0) {
        let remove_objectWithKeyIdentifier = ObjectModifiers._deleteKeyofEntryinObject(req.body, 'eoi_build_started');
        remove_objectWithKeyIdentifier = ObjectModifiers._deleteKeyofEntryinObject(
          remove_objectWithKeyIdentifier,
          'question_id'
        );
        remove_objectWithKeyIdentifier = ObjectModifiers._deleteKeyofEntryinObject(
          remove_objectWithKeyIdentifier,
          '_csrf'
        );
        const _RequestBody: any = remove_objectWithKeyIdentifier;
        const filtered_object_with_empty_keys = ObjectModifiers._removeEmptyStringfromObjectValues(_RequestBody);
        const object_values = Object.values(filtered_object_with_empty_keys).map(an_answer => {
          return { value: an_answer, selected: true };
        });

        let validationError = false;
        let answerValueBody = {};
    
        
        for (let i = 0; i < question_ids.length; i++) {
          const questionNonOCDS = nonOCDS.find(item => item.questionId == question_ids[i]);

         
          
         if (questionNonOCDS.questionType === 'Value' && questionNonOCDS.multiAnswer === true) {
            if (KeyPairMultiValidation(object_values, req)) { 
              validationError = true;
              break;
            }
            answerValueBody = {
              nonOCDS: {
                answered: true,
                options: [...object_values],
              },
            };
          } else if (questionNonOCDS.questionType === 'KeyValuePair') {
            
            if (KeyValuePairValidation(object_values, req)) {
              validationError = true;
            }

            let { term, value } = req.body;
            const TAStorage = [];
            term = term.filter((akeyTerm: any) => akeyTerm !== '');
            value = value.filter((aKeyValue: any) => aKeyValue !== '');

            for (let item = 0; item < term.length; item++) {
              const termObject = { value: term[item], text: value[item], selected: true };
              TAStorage.push(termObject);
            }
            
            answerValueBody = {
              nonOCDS: {
                answered: true,
                options: [...TAStorage],
              },
            };
          } else if (questionNonOCDS.questionType === 'MultiSelect') {
            let selectedOptionToggle = [...object_values].map((anObject: any) => {
              const check = Array.isArray(anObject?.value);
              if (check) {
                let arrayOFArrayedObjects = anObject?.value.map((anItem: any) => {
                  return { value: anItem, selected: true };
                });
                arrayOFArrayedObjects = arrayOFArrayedObjects.flat().flat();
                return arrayOFArrayedObjects;
              } else return { value: anObject.value, selected: true };
            });
            selectedOptionToggle = selectedOptionToggle.map((anItem: any) => {
              if (Array.isArray(anItem)) {
                return anItem;
              } else {
                return [anItem];
              }
            });
            req.session['isLocationMandatoryError'] = false;
            if (selectedOptionToggle.length == 0) {
              validationError = true;
              req.session['isLocationError'] = true;
              req.session['isLocationMandatoryError'] = true;
              break;
            } else if (
              selectedOptionToggle[0].find(
                x => x.value === 'Not No specific location, for example they can work remotely',
              ) &&
              selectedOptionToggle[0].length > 2
            ) {
              validationError = true;
              req.session['isLocationError'] = true;
              break;
            } else if (selectedOptionToggle.length > 0) {
              answerValueBody = {
                nonOCDS: {
                  answered: true,
                  options: [...selectedOptionToggle[0]],
                },
              };
            }
          } else if (questionNonOCDS.questionType === 'Date') {
            
            const slideObj = object_values.slice(0, 3);

            answerValueBody = {
              nonOCDS: {
                answered: true,
                options: [{ value: slideObj[2].value+'-'+slideObj[1].value+'-'+slideObj[0].value, selected: true }],
              },
            };
          } else if (questionNonOCDS.questionType === 'Duration') {
            // SCAT-6028 - Date format issue changed from DD-MM-YYYY to YYYY-MM-DD
            let currentDate = moment(new Date(), 'DD/MM/YYYY').format('YYYY-MM-DD');
            // let inputDate = object_values[0].value + '-' + object_values[1].value + '-' + object_values[2].value;
            let inputDate = object_values[2].value + '-' + object_values[1].value + '-' + object_values[0].value;
            let agreementExpiryDateFormated = moment(agreementExpiryDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
           
            let isInputDateLess = moment(inputDate).isBefore(currentDate);
            let isExpiryDateLess = moment(inputDate).isAfter(agreementExpiryDate);
            req.session['IsInputDateLessError'] = false;
            req.session['IsExpiryDateLessError'] = false;
            if (isInputDateLess) {
              validationError = true;
              req.session['IsInputDateLessError'] = true;
              break;
            } else if (isExpiryDateLess) {
              validationError = true;
              req.session['IsExpiryDateLessError'] = true;
              break;
            } else {
              const slideObj = object_values.slice(3);
              answerValueBody = {
                nonOCDS: {
                  answered: true,
                  options: [...slideObj],
                },
              };
            }
          } else if (questionNonOCDS.questionType === 'Text' && questionNonOCDS.multiAnswer === true) {
            if (KeyValuePairValidation(object_values, req)) {
              validationError = true;
              break;
            }

            let splterm = req.body.term;
            let splTermvalue = req.body.value;
            const TAStorage = [];
            splterm = splterm.filter((akeyTerm: any) => akeyTerm !== '');

            if(splTermvalue != undefined && splTermvalue != ""){
            splTermvalue = splTermvalue.filter((aKeyValue: any) => aKeyValue !== '');

            for (let item = 0; item < splterm.length; item++) {
              const spltermObject = { value: splterm[item], text: splTermvalue[item], selected: true };
              TAStorage.push(spltermObject);
            }
          }
            else{
              for (let item = 0; item < splterm.length; item++) {
                const spltermObject = { value: splterm[item], selected: true };
                TAStorage.push(spltermObject);
              }
            }  
            answerValueBody = {
              nonOCDS: {
                answered: true,
                options: [...TAStorage],
              },
            };
          } 
          else if (questionNonOCDS.questionType === 'SingleSelect') {
            
            if (KeyValuePairValidation(object_values, req)) {
              validationError = true;
              break;
            }
            answerValueBody = {
              nonOCDS: {
                answered: true,
                multiAnswer: questionNonOCDS.multiAnswer,
                //options: [{ value: req.body["ccs_vetting_type"]?.trim(), selected: true }],
                options: [{ value: req.body["ccs_vetting_type"], selected: true }],
              },
            };
          }
          else if (questionNonOCDS.questionType === 'Text' && req.body.rfp_security_confirmation != undefined &&  req.body.rfp_security_confirmation != null) {
            let res = /^[a-zA-Z ]+$/;
            let optionsData = [];
            if (req.body.rfp_security_confirmation != undefined && req.body.rfp_security_confirmation != null && req.body.rfp_security_confirmation != undefined && req.body.rfp_security_confirmation!=='' && res.test(req.body.rfp_security_confirmation)) {
            
              optionsData = [];
              optionsData.push({ value: req.body.rfp_security_confirmation, selected: true })
            } else {
              
              optionsData.push({ value: req.body.rfp_security_confirmation, selected: true })
            }
            
            if (!validationError) {
              
              answerValueBody = {
                nonOCDS: {
                  answered: true,
                  multiAnswer: questionNonOCDS.multiAnswer,
                  options: [...optionsData],
                },
              };
            }
          }
          else {
                    if (
                      (questionNonOCDS.mandatory == true && object_values.length == 0) ||
                      object_values[0]?.value.length == 0
                    ) {
                      validationError = true;
                      break;
                    }

                   

                    if(req.body.eoi_prob_statement===''){
                      validationError = true;
                      break;
                    }
                    if(req.body.ccs_vetting_type===''){
                      validationError = true;
                      break;
                    }
                    if (KeyPairValidation(object_values, req)) { 
                      validationError = true;
                      break;
                    }
                      let objValueArrayCheck = false;
                      object_values.map(obj => {
                        if (Array.isArray(obj.value)) objValueArrayCheck = true;
                      });
                    if (objValueArrayCheck) {
                      answerValueBody = {
                        nonOCDS: {
                          answered: true,
                          options: [{ value: object_values[0].value[i], selected: true }],
                        },
                      };
                    } else {
                      answerValueBody = {
                        nonOCDS: {
                          answered: true,
                          options: [...object_values],
                        },
                      };
                    }
          }
          if (!validationError) {
            try {
              
              const answerBaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups/${group_id}/questions/${question_ids[i]}`;

              let questionResponse = await DynamicFrameworkInstance.Instance(SESSION_ID).put(answerBaseURL, answerValueBody);
              
              //CAS-INFO-LOG 
              LoggTracer.infoLogger(questionResponse, logConstant.questionUpdated, req);

            } catch (error) {
              // if (error.response?.status < 500) { logger.info(error.response.data.errors[0].detail) } else { }
              LoggTracer.errorLogger(res, error, `${req.headers.host}${req.originalUrl}`, state,
                  TokenDecoder.decoder(SESSION_ID), "Agreement Service Api cannot be connected", true);
            }
          }
        }
        if (validationError) {
          req.session['isValidationError'] = true;
          res.redirect(url.replace(regex, 'questions'));
        } else if (stop_page_navigate == null || stop_page_navigate == undefined) {
          
          QuestionHelper.AFTER_UPDATINGDATA(
            ErrorView,
            DynamicFrameworkInstance,
            proc_id,
            event_id,
            SESSION_ID,
            group_id,
            agreement_id,
            id,
            res,
            req,
          );
        } else {
          res.send();
          return;
        }
      } else {
        res.redirect('/error');
      }
    } else {
      res.redirect('/error');
    }
  } catch (err) {
    LoggTracer.errorTracer(err, res);
  }
};





const KeyPairValidation = (object_values: any, req: express.Request) => {

 
  if (object_values.length == 1) {
    let key = object_values[0]?.value;
    let keyErrorIndex = '';
    if (key !==''){
      let eitherElementEmptys = [];

      if(req.body.Name_of_the_organisation_using_the_products_or_services_that_are_being_procured){
        if ((key === '')) {
          eitherElementEmptys.push({ index: '1', isEmpty: true });
        } else {
          if (key.length > 500) {
            // keyErrorIndex = keyErrorIndex + '1' + ',';
          }
          
        }
      }else{
           if ((key === '')) {
            eitherElementEmptys.push({ index: '1', isEmpty: true });
          } else {
            if (key.length > 10000) {
              // keyErrorIndex = keyErrorIndex + '1' + ',';
            }
            
          }
      }
      
        
        
      if (eitherElementEmptys.length > 0 || keyErrorIndex !== '') {
        req.session.isFieldError = true;
        req.session.emptyFieldError = eitherElementEmptys.length > 0;
        req.session.fieldLengthError = [keyErrorIndex];
        
        return true;
      }
    }
  }
  return false;
};


const KeyPairMultiValidation = (object_values: any, req: express.Request) => {
  

  if (object_values.length >= 1) {
    let key = object_values;
    let keyErrorIndex = '';
     
    if (Array.isArray(key) ) {
     
      let eitherElementEmptys = [];

      for (var i = 0; i < key.length; i++) {
      
          if (key[i].value.length > 10000) {
            // keyErrorIndex = keyErrorIndex + i + ',';
          }
          
       
      }
      if (eitherElementEmptys.length > 0 || keyErrorIndex !== '' ) {
        req.session.isFieldError = true;
        req.session.emptyFieldError = eitherElementEmptys.length > 0;
        req.session.fieldLengthError = [keyErrorIndex];
        return true;
      }
    }
  }
  return false;
};

const KeyValuePairValidation = (object_values: any, req: express.Request) => {
  if (object_values.length == 2) {
    let key = object_values[0];
    let keyValue = object_values[1];
    let keyErrorIndex = '',
      keyValueErrorIndex = '';

    if (Array.isArray(key.value) && Array.isArray(keyValue.value)) {
      let eitherElementEmptys = [];
      for (var i = 0; i < key.value.length; i++) {
        if ((key.value[i] === '' && keyValue.value[i] !== '') || (key.value[i] !== '' && keyValue.value[i] === '')) {
          eitherElementEmptys.push({ index: i, isEmpty: true });
        } else {
          if (key.value[i].length > 500) {
            // keyErrorIndex = keyErrorIndex + i + ',';
          }
          if (keyValue.value[i].length > 10000) {
            // keyValueErrorIndex = keyValueErrorIndex + i + ',';
          }
        }
      }
      if (eitherElementEmptys.length > 0 || keyErrorIndex !== '' || keyValueErrorIndex !== '') {
        req.session.isFieldError = true;
        req.session.emptyFieldError = eitherElementEmptys.length > 0;
        req.session.fieldLengthError = [keyErrorIndex, keyValueErrorIndex];
        const { term, value } = req.body;
        const TAStorage = [];
        for (let item = 0; item < 20; item++) {
          const termObject = { value: term[item], text: value[item], selected: true };
          TAStorage.push(termObject);
        }
        req.session['errorFields'] = TAStorage;
        return true;
      }
    }
  }
  return false;
};

const findErrorText = (data: any, req: express.Request) => {
  
  let errorText = [];
  data.forEach(requirement => {
    if (requirement.nonOCDS.questionType == 'KeyValuePair')
      errorText.push({ text: 'You must add information in both fields.' });
    else if (requirement.nonOCDS.questionType == 'Value' && requirement.nonOCDS.multiAnswer === true)
    if (req.session.fieldLengthError?.length == 1 && req.session.fieldLengthError[0] !== '')
      errorText.push({ text: 'You must be 10000 characters or fewer' });
      else{
        if(req.session.agreement_id == 'RM6187'){
          errorText.push({ text: 'Enter at least 1 project objective' });
        }else{
          errorText.push({ text: 'You must add at least one objective' });
        }
      }
    else if (requirement.nonOCDS.questionType == 'Text' && requirement.nonOCDS.multiAnswer === false)

    if (req.session.fieldLengthError?.length !== 1 ){
      if(req.session.agreement_id == 'RM6187'){
        errorText.push({ text: 'You must add background information about your procurement' });
      }
      else{
        errorText.push({ text: 'You must be 10000 characters or fewer' });
      }
    }
   else
      errorText.push({ text: 'You must enter information here' });
    else if (
      requirement.nonOCDS.questionType == 'Text' &&
      requirement.nonOCDS.multiAnswer === true &&
      requirement.OCDS.id == 'Question 1'
    ) 
    {
      if (req.session.emptyFieldError) errorText.push({ text: 'You must add information in both fields.' });
      if (req.session.fieldLengthError?.length == 2 && req.session.fieldLengthError[0] !== '')
        errorText.push({
          text: 'Term and condition title ' + req.session.fieldLengthError[0] + ' must be 100 characters or fewer',
        });
      if (req.session.fieldLengthError?.length == 2 && req.session.fieldLengthError[1] !== '')
        errorText.push({
          text:
            'Term and condition definition ' + req.session.fieldLengthError[1] + ' must be 1000 characters or fewer',
        });
    } else if (
      requirement.nonOCDS.questionType == 'MultiSelect' &&
      req.session['isLocationError'] == true &&
      req.session['isLocationMandatoryError'] == false
    )
      errorText.push({ text: 'Select regions where your staff will be working, or select "No specific location...."' });
    else if (
      requirement.nonOCDS.questionType == 'MultiSelect' &&
      req.session['isLocationError'] == true &&
      req.session['isLocationMandatoryError'] == true
    )
      errorText.push({
        text: 'You must select at least one region where your staff will be working, or select "No specific location...."',
      });
    else if (requirement.nonOCDS.questionType == 'Duration' && req.session['IsInputDateLessError'] == true)
      errorText.push({ text: 'Start date must be a valid future date' });
    else if (requirement.nonOCDS.questionType == 'Duration' && req.session['IsExpiryDateLessError'] == true)
      errorText.push({ text: 'It is recommended that your project does not start after lot expiry date' });
      else if (requirement.nonOCDS.questionType == 'Value' && requirement.nonOCDS.multiAnswer === false)
      errorText.push({ text: 'You must be 500 characters or fewer' });
      else if (requirement.nonOCDS.questionType == 'SingleSelect')
      errorText.push({ text: 'You must select at least one option' });  
  });
  
  return errorText;
};

const isDateOlder = (date1: any, date2: any) => {
  return (
    date1.getFullYear() >= date2.getFullYear() ||
    date1.getMonth() >= date2.getMonth() ||
    date1.getDate() >= date2.getDate()
  );
};