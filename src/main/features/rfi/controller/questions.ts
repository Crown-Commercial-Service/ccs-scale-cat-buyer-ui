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
const logger = Logger.getLogger('questions page');
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';

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
    const titleText = OCDS?.description;
    const promptData = nonOCDS?.prompt;
    const nonOCDSList = [];
    const form_name = fetch_dynamic_api_data?.map((aSelector: any) => {
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
    let errorText = findErrorText(fetch_dynamic_api_data);
    const data = {
      data: fetch_dynamic_api_data,
      agreement_id: agreement_id,
      proc_id: proc_id,
      event_id: event_id,
      group_id: group_id,
      criterian_id: id,
      form_name: form_name?.[0],
      rfiTitle: titleText,
      prompt: promptData,
      organizationName: organizationName,
      error: req.session['isLocationError'],
      emptyFieldError: req.session['isValidationError'],
      errorText: errorText,
      relatedTitle: 'Related content',
      lotURL:
        '/agreement/lot?agreement_id=' + req.session.agreement_id + '&lotNum=' + req.session.lotId.replace(/ /g, '%20'),
      lotText: req.session.agreementName + ', ' + req.session.agreementLotName,
    };
    req.session['isValidationError'] = false;
    res.render('questions', data);
  } catch (error) {
    logger.log('Something went wrong, please review the logit error log for more information');
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
  logger.log('questions.POST_QUESTION.init.query:', req.query);
  logger.log('questions.POST_QUESTION.init.body:', req.body);

  try {
    const { agreement_id, proc_id, event_id, id, group_id, stop_page_navigate } = req.query;
    const { SESSION_ID } = req.cookies;
    req.session['isLocationError'] = false;
    logger.log('questions.POST_QUESTION.session:', req.session);
    const started_progress_check: boolean = operations.isUndefined(req.body, 'rfi_build_started');
    if (operations.equals(started_progress_check, false)) {
      const { rfi_build_started, question_id, questionType } = req.body;
      const nonOCDS = req.session?.nonOCDSList.find(x => x.question_id === question_id);
      if (rfi_build_started === 'true') {
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
          logger.log('questions.POST_QUESTION.isValidationError.redirection', url.replace(regex, 'questions'));
          res.redirect(url.replace(regex, 'questions'));
        } else {
          if (questionType === 'Valuetrue') {
            logger.log('questions.POST_QUESTION.Valuetrue');
            const answerValueBody = {
              nonOCDS: {
                answered: true,
                options: [...object_values],
              },
            };
            try {
              console.log('answerValueBody', answerValueBody);
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
                );
              } else {
                res.send();
                return;
              }
            } catch (error) {
              logger.log('Something went wrong, please review the logit error log for more information');
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
            logger.log('questions.POST_QUESTION.KeyValuePairtrue');
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
                );
              } else {
                res.send();
                return;
              }
            } catch (error) {
              // console.log(error)
              logger.log('Something went wrong, please review the logit error log for more information');
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
            logger.log('questions.POST_QUESTION.others');
            const question_array_check: boolean = Array.isArray(question_id);
            if (question_array_check) {
              logger.log('questions.POST_QUESTION.others.question_array_check');
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
                  );
                } catch (error) {
                  logger.log('Something went wrong, please review the logit error log for more information');
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
              logger.log('questions.POST_QUESTION.others.noQuestion_array_check');
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
                  req.session['isLocationError'] = true;
                  res.redirect(url.replace(regex, 'questions'));
                } else if (selectedOptionToggle.length > 0) {
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
                  );
                }
              } catch (error) {
                logger.log('questions.POST_QUESTION.errorException:', err);
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
        logger.log('questions.POST_QUESTION.error.rfi_build_started');
        res.redirect('/error');
      }
    } else {
      logger.log('questions.POST_QUESTION.error.started_progress_check');
      res.redirect('/error');
    }
  } catch (err) {
    logger.log('questions.POST_QUESTION.errorException:', err);
    LoggTracer.errorTracer(err, res);
  }
};

const findErrorText = (data: any) => {
  let errorText = '';
  data.forEach(requirement => {
    if (requirement.nonOCDS.questionType == 'KeyValuePair') errorText = 'You must add information in both fields.';
    else if (requirement.nonOCDS.questionType == 'Value' && requirement.nonOCDS.multiAnswer === true)
      errorText = 'You must add at least one question';
    else if (requirement.nonOCDS.questionType == 'SingleSelect' && requirement.nonOCDS.multiAnswer === false)
      errorText = 'You must provide a security clearance level before proceeding';
    else if (requirement.nonOCDS.questionType == 'Text' && requirement.nonOCDS.multiAnswer === false)
      errorText = 'You must enter information here';
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
