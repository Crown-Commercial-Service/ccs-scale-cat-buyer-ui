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

    let matched_selector = heading_fetch_dynamic_api?.data.filter((agroupitem: any) => {
      return agroupitem?.OCDS?.['id'] === group_id;
    });

    matched_selector = matched_selector?.[0];
    const { OCDS, nonOCDS } = matched_selector;
    const bcTitleText = OCDS?.description;
    const titleText = nonOCDS.mandatory === false ? OCDS?.description + ' (Optional)' : OCDS?.description;
    const promptData = nonOCDS?.prompt;
    const nonOCDSList = [];
    const form_name = fetch_dynamic_api_data?.map((aSelector: any) => {
      const questionNonOCDS = {
        groupId: group_id,
        questionId: aSelector.OCDS.id,
        questionType: aSelector.nonOCDS.questionType,
        mandatory: aSelector.nonOCDS.mandatory,
        multiAnswer: aSelector.nonOCDS.multiAnswer,
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
      } else {
        return '';
      }
    });
    req.session?.nonOCDSList = nonOCDSList;
    const releatedContent = req.session.releatedContent;
    fetch_dynamic_api_data = fetch_dynamic_api_data.sort((a, b) => (a.OCDS.id < b.OCDS.id ? -1 : 1));
    const errorText = findErrorText(fetch_dynamic_api_data, req);
    const { isFieldError } = req.session;
    const data = {
      data: fetch_dynamic_api_data,
      agreement_id: agreement_id,
      proc_id: proc_id,
      event_id: event_id,
      group_id: group_id,
      criterian_id: id,
      form_name: form_name?.[0],
      eoiTitle: titleText,
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
    const { agreement_id, proc_id, event_id, id, group_id, stop_page_navigate } = req.query;
    const { SESSION_ID } = req.cookies;
    await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/20`, 'In progress');
    const regex = /questionnaire/gi;
    const url = req.originalUrl.toString();
    const nonOCDS = req.session?.nonOCDSList?.filter(anItem => anItem.groupId == group_id);
    const started_progress_check: boolean = operations.isUndefined(req.body, 'eoi_build_started');
    let { eoi_build_started, question_id } = req.body;
    let question_ids = [];

    if (!Array.isArray(question_id) && question_id !== undefined) question_ids = [question_id];
    else question_ids = question_id;

    if (operations.equals(started_progress_check, false)) {
      if (eoi_build_started === 'true' && nonOCDS.length > 0) {
        let remove_objectWithKeyIdentifier = ObjectModifiers._deleteKeyofEntryinObject(req.body, 'eoi_build_started');
        remove_objectWithKeyIdentifier = ObjectModifiers._deleteKeyofEntryinObject(
          remove_objectWithKeyIdentifier,
          'question_id',
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
            if (questionNonOCDS.mandatory == true && object_values.length == 0) {
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
              break;
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

            if (selectedOptionToggle.length == 0) {
              answerValueBody = {
                nonOCDS: {
                  answered: true,
                  options: [],
                },
              };
            } else if (
              selectedOptionToggle[0].find(
                x => x.value === 'No specific location, for example they can work remotely',
              ) &&
              selectedOptionToggle[0].length > 1
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
                options: [...slideObj],
              },
            };
          } else if (questionNonOCDS.questionType === 'Duration') {
            const slideObj = object_values.slice(3);
            answerValueBody = {
              nonOCDS: {
                answered: true,
                options: [...slideObj],
              },
            };
          } else {
            if (
              (questionNonOCDS.mandatory == true && object_values.length == 0) ||
              object_values[0]?.value.length == 0
            ) {
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
                  options: [{ value: object_values[0].value[i] }],
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
          try {
            const answerBaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups/${group_id}/questions/${question_ids[i]}`;
            await DynamicFrameworkInstance.Instance(SESSION_ID).put(answerBaseURL, answerValueBody);
          } catch (error) {}
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

const KeyValuePairValidation = (object_values: any, req: express.Request) => {
  if (object_values.length == 2) {
    let key = object_values[0];
    let keyValue = object_values[1];
    if (Array.isArray(key.value) && Array.isArray(keyValue.value)) {
      let eitherElementEmptys = [];
      for (var i = 0; i < key.value.length; i++) {
        if ((key.value[i] === '' && keyValue.value[i] !== '') || (key.value[i] !== '' && keyValue.value[i] === '')) {
          eitherElementEmptys.push({ index: i, isError: true });
        }
      }
      if (eitherElementEmptys.length > 0) {
        req.session.isFieldError = true;
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
      errorText.push({ text: 'You must add at least one objective' });
    else if (requirement.nonOCDS.questionType == 'SingleSelect' && requirement.nonOCDS.multiAnswer === false)
      errorText.push({ text: 'Please select an option' });
    else if (requirement.nonOCDS.questionType == 'Text' && requirement.nonOCDS.multiAnswer === false)
      errorText.push({ text: 'You must enter information here' });
    else if (requirement.nonOCDS.questionType == 'MultiSelect' && req.session['isLocationError'] == true)
      errorText.push({ text: 'Select regions where your staff will be working, or select "No specific location...."' });
  });
  return errorText;
};
