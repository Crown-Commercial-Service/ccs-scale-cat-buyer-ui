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
import {ShouldEventStatusBeUpdated} from '../../shared/ShouldEventStatusBeUpdated';

/**
 * @Controller
 * @GET
 * @summary switches query related to specific parameter
 * @validation false
 */
export const GET_QUESTIONS = async (req: express.Request, res: express.Response) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  const { SESSION_ID } = req.cookies;
  const { agreement_id, proc_id, event_id, id, group_id } = req.query;
  const releatedContent = req.session.releatedContent;

  try {
    const baseURL: any = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups/${group_id}/questions`;
    const fetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(baseURL);
    let fetch_dynamic_api_data = fetch_dynamic_api?.data;
    const headingBaseURL: any = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups`;
    const heading_fetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(headingBaseURL);

    const organizationID = req.session.user.payload.ciiOrgId;
    const organisationBaseURL = `/organisation-profiles/${organizationID}`;
    const getOrganizationDetails = await OrganizationInstance.OrganizationUserInstance().get(organisationBaseURL);
    const name = getOrganizationDetails.data.identifier.legalName;
    const organizationName = name;

    let matched_selector = heading_fetch_dynamic_api.data.filter((agroupitem: any) => {
      return agroupitem?.OCDS?.['id'] === group_id;
    });

    matched_selector = matched_selector?.[0];
    const { OCDS, nonOCDS } = matched_selector;
    let bcTitleText = OCDS.description;
    let titleText = nonOCDS.mandatory === false ? OCDS.description + ' (optional)' : OCDS.description;
    const promptData = nonOCDS.prompt;
    const nonOCDSList = [];
    const form_name = fetch_dynamic_api_data.map((aSelector: any) => {
      const nonOCDS = {
        question_id: aSelector.OCDS.id,
        mandatory: aSelector.nonOCDS.mandatory,
      };
      nonOCDSList.push(nonOCDS);
      if (aSelector.nonOCDS.questionType === 'SingleSelect' && aSelector.nonOCDS.multiAnswer === false) {
        return 'ccs_rfi_vetting_form';
      } else if (aSelector.nonOCDS.questionType === 'Value' && aSelector.nonOCDS.multiAnswer === true) {
        return 'ccs_rfi_questions_form';
      } else if (aSelector.nonOCDS.questionType === 'Value' && aSelector.nonOCDS.multiAnswer == false) {
        return 'ccs_rfi_who_form';
      } else if (aSelector.nonOCDS.questionType === 'KeyValuePair' && aSelector.nonOCDS.multiAnswer == true) {
        return 'ccs_rfi_acronyms_form';
      } else if (aSelector.nonOCDS.questionType === 'Text' && aSelector.nonOCDS.multiAnswer == false) {
        return 'ccs_rfi_about_proj';
      } else if (aSelector.nonOCDS.questionType === 'MultiSelect' && aSelector.nonOCDS.multiAnswer === true) {
        return 'rfi_location';
      } else {
        return '';
      }
    });
    req.session?.nonOCDSList = nonOCDSList;
    fetch_dynamic_api_data = fetch_dynamic_api_data.sort((a, b) => (a.OCDS.id < b.OCDS.id ? -1 : 1));
    const errorText = findErrorText(fetch_dynamic_api_data, req);
    const { isFieldError } = req.session;
    if(fetch_dynamic_api_data[0].OCDS.id=='Question 5')
    {
      fetch_dynamic_api_data[0].OCDS.title="Terms and acronyms (optional)";
    }
    if(fetch_dynamic_api_data[0].OCDS.id=='Question 4')
    {
      fetch_dynamic_api_data[0].nonOCDS.options[0].text='For individuals who do not need to have a specific level of security clearance because your organisation has its own pre-employment checks.';
    }
    if(fetch_dynamic_api_data[0].OCDS.id=='Question 6')
    {
      titleText="Where the supplied staff will work";
      bcTitleText="Where the supplied staff will work"
    }
    const data = {
      data: fetch_dynamic_api_data,
      agreement_id: agreement_id,
      proc_id: proc_id,
      event_id: event_id,
      group_id: group_id,
      criterian_id: id,
      form_name: form_name?.[0],
      rfiTitle: titleText,
      bcTitleText,
      prompt: promptData,
      organizationName: organizationName,
      emptyFieldError: req.session['isValidationError'],
      errorText: errorText,
      releatedContent: releatedContent,
    };
    if (isFieldError) {
      delete data.data[0].nonOCDS.options;
      data.data[0].nonOCDS.options = req.session['errorFields'];
    }
    req.session['isFieldError'] = false;
    req.session['isValidationError'] = false;
    res.render('questions', data);
  } catch (error) {
    delete error?.config?.['headers'];
    const Logmessage = {
      Person_id: TokenDecoder.decoder(SESSION_ID),
      error_location: `${req.headers.host}${req.originalUrl}`,
      sessionId: 'null',
      error_reason: 'RFI Dynamic framework throws error - Tenders Api is causing problem',
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
 * @param rfi_questions
 * @summary
 * @validation true
 */
// path = '/rfi/questionnaire'
export const POST_QUESTION = async (req: express.Request, res: express.Response) => {
  try {
    const { agreement_id, proc_id, event_id, id, group_id, stop_page_navigate } = req.query;
    const { SESSION_ID } = req.cookies;
    const { projectId,eventId } = req.session;
    let flag=await ShouldEventStatusBeUpdated(eventId,10,req);
    if(flag)
    {
    await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/10`, 'In progress');
    }
    req.session['isLocationError'] = false;
    const started_progress_check: boolean = operations.isUndefined(req.body, 'rfi_build_started');
    if (operations.equals(started_progress_check, false)) {
      const { rfi_build_started, question_id, questionType } = req.body;
      const nonOCDS = req.session?.nonOCDSList.find(x => x.question_id === question_id);
      if (rfi_build_started === 'true') {
        let validationError = false;
        let remove_objectWithKeyIdentifier = ObjectModifiers._deleteKeyofEntryinObject(req.body, 'rfi_build_started');
        remove_objectWithKeyIdentifier = ObjectModifiers._deleteKeyofEntryinObject(
          remove_objectWithKeyIdentifier,
          'question_id',
        );
        remove_objectWithKeyIdentifier = ObjectModifiers._deleteKeyofEntryinObject(
          remove_objectWithKeyIdentifier,
          'questionType',
        );
        const _RequestBody: any = remove_objectWithKeyIdentifier;
        const filtered_object_with_empty_keys = ObjectModifiers._removeEmptyStringfromObjectValues(_RequestBody);
        const regex = /questionnaire/gi;
        const url = req.originalUrl.toString();
        const object_values = Object.values(filtered_object_with_empty_keys).map(an_answer => {
          return { value: an_answer };
        });
        if (checkFormInputValidationError(nonOCDS, object_values, questionType)) {
          req.session.isValidationError = true;
          if (object_values.length > 0) {
            const object_values_Keyterm = object_values[0].value;
            const object_values_acronyms = object_values[1].value;
            const keyTermsAcronymsSorted = [];
            for (let start = 0; start < object_values_Keyterm.length; start++) {
              const termAndAcryonys = {
                value: object_values_Keyterm[start],
                text: object_values_acronyms[start],
                selected: true,
              };
              keyTermsAcronymsSorted.push(termAndAcryonys);
            }
            req.session['errorFields'] = keyTermsAcronymsSorted;
            req.session.isFieldError = true;
          }
          if (questionType === 'MultiSelecttrue') {
            validationError = true;
            req.session['isLocationError'] = true;
            req.session['isLocationMandatoryError'] = true;
          }

          res.redirect(url.replace(regex, 'questions'));
        } else {
          req.session['isLocationMandatoryError'] = false;
          if (questionType === 'Valuetrue') {
            const answerValueBody = {
              nonOCDS: {
                answered: true,
                options: [...object_values],
              },
            };
            try {
              const answerBaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups/${group_id}/questions/${question_id}`;
              await DynamicFrameworkInstance.Instance(SESSION_ID).put(answerBaseURL, answerValueBody);
              if (stop_page_navigate == null || stop_page_navigate == undefined) {
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
            } catch (error) {
              delete error?.config?.['headers'];
              const Logmessage = {
                Person_id: TokenDecoder.decoder(SESSION_ID),
                error_location: `${req.headers.host}${req.originalUrl}`,
                sessionId: 'null',
                error_reason: 'Dyanamic framework throws error - Tender Api is causing problem',
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
          } else if (questionType === 'KeyValuePairtrue') {
            let { term, value } = req.body;
            const TAStorage = [];
            term = term.filter((akeyTerm: any) => akeyTerm !== '');
            value = value.filter((aKeyValue: any) => aKeyValue !== '');
            for (let item = 0; item < term.length; item++) {
              const termObject = { value: term[item], text: value[item], selected: true };
              TAStorage.push(termObject);
            }
            const answerBody = {
              nonOCDS: {
                answered: true,
                options: [...TAStorage],
              },
            };

            try {
              const answerBaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups/${group_id}/questions/${question_id}`;
              await DynamicFrameworkInstance.Instance(SESSION_ID).put(answerBaseURL, answerBody);

              if (stop_page_navigate == null || stop_page_navigate == undefined) {
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
            } catch (error) {

              delete error?.config?.['headers'];
              const Logmessage = {
                Person_id: TokenDecoder.decoder(SESSION_ID),
                error_location: `${req.headers.host}${req.originalUrl}`,
                sessionId: 'null',
                error_reason: 'Dyanamic framework throws error - Tender Api is causing problem',
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
          } else {
            const question_array_check: boolean = Array.isArray(question_id);
            if (question_array_check) {
              const sortedStorage = [];
              for (let start = 0; start < question_id.length; start++) {
                const comparisonObject = {
                  questionNo: question_id[start],
                  answer: object_values[start],
                };
                sortedStorage.push(comparisonObject);
              }
              for (const iteration of sortedStorage) {
                const answerBody = {
                  nonOCDS: {
                    answered: true,
                    options: [iteration.answer],
                  },
                };

                try {
                  const answerBaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups/${group_id}/questions/${iteration.questionNo}`;
                  await DynamicFrameworkInstance.Instance(SESSION_ID).put(answerBaseURL, answerBody);
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
                } catch (error) {

                  delete error?.config?.['headers'];
                  const Logmessage = {
                    Person_id: TokenDecoder.decoder(SESSION_ID),
                    error_location: `${req.headers.host}${req.originalUrl}`,
                    sessionId: 'null',
                    error_reason: 'RFI Dynamic framework throws error - Tender Api is causing problem',
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
              }
            } else {
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
              try {
                if (selectedOptionToggle.length == 0 && nonOCDS.mandatory == true) {
                  //return error & show
                } else if (selectedOptionToggle.length == 0 && nonOCDS.mandatory == false) {
                  const answerBody = {
                    nonOCDS: {
                      answered: true,
                      options: [],
                    },
                  };
                  const answerBaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups/${group_id}/questions/${question_id}`;
                  await DynamicFrameworkInstance.Instance(SESSION_ID).put(answerBaseURL, answerBody);
                } else if (
                  selectedOptionToggle[0].find(
                    x => x.value === 'No specific location, for example they can work remotely',
                  ) &&
                  selectedOptionToggle[0].length > 1
                ) {
                  validationError = true;
                  req.session['isLocationError'] = true;
                  res.redirect(url.replace(regex, 'questions'));
                } else if (selectedOptionToggle.length > 0) {
                  if(group_id=='Group 4'){
                    //selectedOptionToggle[0].push({'value':'abc','selected':true})
                    //save org data
                    const organizationID = req.session.user.payload.ciiOrgId;
                    const organisationBaseURL = `/organisation-profiles/${organizationID}`;
                    const getOrganizationDetails = await OrganizationInstance.OrganizationUserInstance().get(organisationBaseURL);
                    const name = getOrganizationDetails.data.identifier.legalName;
                    const organizationName = name;
                    let orgData=[]
                    let arrData=[]
                    arrData.push({'value':organizationName,'selected':true})
                    orgData.push(arrData)
                    const answerBodyOrg = {
                      nonOCDS: {
                        answered: true,
                        options: [...orgData[0]],
                      },
                    };
                    const answerBaseURLOrg = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups/${group_id}/questions/Question 2`;
                    await DynamicFrameworkInstance.Instance(SESSION_ID).put(answerBaseURLOrg, answerBodyOrg);
                  }
                  const answerBody = {
                    nonOCDS: {
                      answered: true,
                      options: [...selectedOptionToggle[0]],
                    },
                  };
                  const answerBaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups/${group_id}/questions/${question_id}`;
                  await DynamicFrameworkInstance.Instance(SESSION_ID).put(answerBaseURL, answerBody);
                }
                if (req.session['isLocationError'] === false) {
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
                }
              } catch (error) {
                delete error?.config?.['headers'];
                const Logmessage = {
                  Person_id: TokenDecoder.decoder(SESSION_ID),
                  error_location: `${req.headers.host}${req.originalUrl}`,
                  sessionId: 'null',
                  error_reason: 'Dyanamic framework throws error - Tender Api is causing problem',
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
            }
          }
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

const findErrorText = (data: any, req: express.Request) => {
  let errorText = '';
  data.forEach(requirement => {
    if (requirement.nonOCDS.questionType == 'KeyValuePair') errorText = 'You must add information in both fields.';
    else if (requirement.nonOCDS.questionType == 'Value' && requirement.nonOCDS.multiAnswer === true)
      errorText = 'You must add at least one question';
    else if (requirement.nonOCDS.questionType == 'Value' && requirement.nonOCDS.multiAnswer === false)
      errorText = 'You must provide the organization name';
    else if (requirement.nonOCDS.questionType == 'Text' && requirement.nonOCDS.multiAnswer === false)
      errorText = 'You must enter information here';
    else if (
      requirement.nonOCDS.questionType == 'MultiSelect' &&
      req.session['isLocationError'] == true &&
      req.session['isLocationMandatoryError'] == false
    )
      errorText = 'Select regions where your staff will be working, or select "No specific location...."';
    else if (
      requirement.nonOCDS.questionType == 'MultiSelect' &&
      req.session['isLocationError'] == true &&
      req.session['isLocationMandatoryError'] == true
    )
      errorText =
        'You must select at least one region where your staff will be working, or select "No specific location...."';
  });
  return errorText;
};
const checkFormInputValidationError = (nonOCDS: any, object_values: any, questionType: string) => {
  if (nonOCDS.mandatory == true && object_values.length == 0) {
    return true;
  }
  if (questionType === 'KeyValuePairtrue' && object_values.length == 2) {
    let key = object_values[0];
    let keyValue = object_values[1];
    if (Array.isArray(key.value) && Array.isArray(keyValue.value)) {
      let eitherElementEmptys = [];
      for (var i = 0; i < key.value.length; i++) {
        if ((key.value[i] === '' && keyValue.value[i] !== '') || (key.value[i] !== '' && keyValue.value[i] === '')) {
          eitherElementEmptys.push({ index: i, isError: true });
        }
      }
      return eitherElementEmptys.length > 0;
    }
  }

  return false;
};
