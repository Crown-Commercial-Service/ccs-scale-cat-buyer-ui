//@ts-nocheck
import * as express from 'express';
import { operations } from '../../../utils/operations/operations';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { ObjectModifiers } from '../util/operations/objectremoveEmptyString';
import { ErrorView } from '../../../common/shared/error/errorView';
import { QuestionHelper } from '../helpers/questions';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { Logger } from '@hmcts/nodejs-logging';
const logger = Logger.getLogger('questionsPage');
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';
import { TenderApi } from '@common/util/fetch/procurementService/TenderApiInstance';
import moment from 'moment-business-days';
import moment from 'moment';
import { logConstant } from '../../../common/logtracer/logConstant';
import { agreementsService } from 'main/services/agreementsService';
import { ppg } from 'main/services/publicProcurementGateway';

/**
 * @Controller
 * @GET
 * @summary switches query related to specific parameter
 * @validation false
 */
export const DA_Assesstment_GET_QUESTIONS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { agreement_id, proc_id, event_id, id, group_id, section, step } = req.query;
  const { eventManagement_eventType } = req.session;
  const model_eventType = req.session.selectedRoute;

  try {
    const baseURL: any = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups/${group_id}/questions`;
    const fetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(baseURL);
    //CAS-INFO-LOG
    LoggTracer.infoLogger(fetch_dynamic_api, logConstant.fetchedAssesstmentsQuestions, req);
    let fetch_dynamic_api_data = fetch_dynamic_api?.data;

    const headingBaseURL: any = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups`;
    const heading_fetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(headingBaseURL);
    //CAS-INFO-LOG
    LoggTracer.infoLogger(heading_fetch_dynamic_api, logConstant.fetchedAssesstmentsQuestions, req);
    const organizationID = req.session.user.ciiOrgId;
    const getOrganizationDetails = (await ppg.api.organisation.getOrganisation(organizationID)).unwrap();
    //CAS-INFO-LOG
    LoggTracer.infoLogger(getOrganizationDetails, logConstant.collaboratorDetailFetch, req);

    const name = getOrganizationDetails.identifier.legalName;
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
    const promptSplit = promptData?.split(splitOn);
    const nonOCDSList = [];
    fetch_dynamic_api_data = fetch_dynamic_api_data.sort((n1, n2) => n1.nonOCDS.order - n2.nonOCDS.order);

    if (group_id === 'Group 3' && id === 'Criterion 2') {
      fetch_dynamic_api_data.pop();
    }
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
        return 'rfp_singleselect';
      } else if (aSelector.nonOCDS.questionType === 'Value' && aSelector.nonOCDS.multiAnswer === true) {
        return 'ccs_rfp_questions_form';
      } else if (aSelector.nonOCDS.questionType === 'Value' && aSelector.nonOCDS.multiAnswer == false) {
        return 'ccs_rfp_who_form';
      } else if (aSelector.nonOCDS.questionType === 'KeyValuePair' && aSelector.nonOCDS.multiAnswer == true) {
        return 'ccs_rfp_acronyms_form';
      } else if (aSelector.nonOCDS.questionType === 'Text' && aSelector.nonOCDS.multiAnswer == false) {
        return 'ccs_rfp_exit_strategy_form';
      } else if (aSelector.nonOCDS.questionType === 'MultiSelect' && aSelector.nonOCDS.multiAnswer === true) {
        return 'rfp_location';
      } else if (aSelector.nonOCDS.questionType === 'Text' && aSelector.nonOCDS.multiAnswer == true) {
        return 'da_multianswer_question_form';
      } else if (aSelector.nonOCDS.questionType === 'Monetary' && aSelector.nonOCDS.multiAnswer === false) {
        return 'rfp_budget_for';
      } else if (aSelector.nonOCDS.questionType === 'ReadMe') {
        return 'read_me';
      } else if (
        aSelector.nonOCDS.questionType === 'Duration' ||
        (aSelector.nonOCDS.questionType === 'Date' && aSelector.nonOCDS.multiAnswer == false)
      ) {
        return 'rfp_date';
      } else if (aSelector.nonOCDS.questionType === 'Percentage') {
        return 'rfp_percentage_form';
      } else if (aSelector.nonOCDS.questionType === 'Table' || aSelector.nonOCDS.questionType === 'Integer') {
        return 'ccs_rfp_scoring_criteria';
      } else {
        return '';
      }
    });
    const agreementId = req.session.agreement_id;
    const FetchAgreementServiceData = (await agreementsService.api.getAgreement(agreementId)).unwrap();
    const AgreementEndDate = FetchAgreementServiceData.endDate;

    req.session?.nonOCDSList = nonOCDSList;
    const releatedContent = req.session.releatedContent;
    //fetch_dynamic_api_data = fetch_dynamic_api_data.sort((a, b) => (a.OCDS.id < b.OCDS.id ? -1 : 1));
    const errorText = findErrorText(fetch_dynamic_api_data, req);
    fetch_dynamic_api_data = fetch_dynamic_api_data.map((item) => {
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

    let TemporaryObjStorage = [];
    for (const ITEM of fetch_dynamic_api_data) {
      if (ITEM.nonOCDS.dependant && ITEM.nonOCDS.dependency.relationships) {
        const RelationsShip = ITEM.nonOCDS.dependency.relationships;
        for (const Relation of RelationsShip) {
          const { dependentOnId } = Relation;
          const findElementInData = fetch_dynamic_api_data.filter((item) => item.OCDS.id === dependentOnId)[0];
          findElementInData.nonOCDS.childern = [...findElementInData.nonOCDS.childern, ITEM];
          TemporaryObjStorage.push(findElementInData);
        }
      } else {
        TemporaryObjStorage.push(ITEM);
      }
    }
    const POSITIONEDELEMENTS = [...new Set(TemporaryObjStorage.map(JSON.stringify))]
      .map(JSON.parse)
      .filter((item) => !item.nonOCDS.dependant);

    const formNameValue = form_name.find((fn) => fn !== '');
    if (group_id === 'Group 8' && id === 'Criterion 2') {
      TemporaryObjStorage.forEach((x) => {
        //x.nonOCDS.childern=[];
        if (x.nonOCDS.questionType === 'Table') {
          x.nonOCDS.options.forEach((element) => {
            element.optiontableDefination = mapTableDefinationData(element);
            element.optiontableDefinationJsonString = JSON.stringify(mapTableDefinationData(element));
          });
        }
      });
      TemporaryObjStorage = TemporaryObjStorage.slice(0, 2);
    }

    // res.json(POSITIONEDELEMENTS)
    const { isFieldError } = req.session;
    const data = {
      data: group_id === 'Group 8' && id === 'Criterion 2' ? TemporaryObjStorage : POSITIONEDELEMENTS,
      agreement: AgreementEndDate,
      agreementEndDate: AgreementEndDate,
      agreement_id: agreement_id,
      proc_id: proc_id,
      event_id: event_id,
      group_id: group_id,
      criterian_id: id,
      form_name: formNameValue,
      rfpTitle: titleText,
      shortTitle: mapTitle(group_id),
      bcTitleText,
      prompt: promptSplit,
      organizationName: organizationName,
      emptyFieldError: req.session['isValidationError'],
      errorText: errorText,
      releatedContent: releatedContent,
      section: section,
      step: step,
      eventManagement_eventType: model_eventType,
    };
    if (isFieldError) {
      delete data.data[0].nonOCDS.options;
      data.data[0].nonOCDS.options = req.session['errorFields'];
    }
    //Balwinder 1FC step 44
    if (group_id === 'Group 5' && id === 'Criterion 2') {
      data.form_name = 'da_multianswer_question_form';
    }
    if (group_id === 'Group 1' && id === 'Criterion 2') {
      data.data = [];
      data.form_name = 'read_me';
    }
    req.session['isFieldError'] = false;
    req.session['isValidationError'] = false;
    req.session['fieldLengthError'] = [];
    req.session['emptyFieldError'] = false;
    //CAS-INFO-LOG
    LoggTracer.infoLogger(null, logConstant.yourassesstments, req);

    res.render('daw-question-assessment', data);
  } catch (error) {
    LoggTracer.errorLogger(res, error, null, null, null, null, false);
  }
};

/**
 * @Controller
 * @POST
 * @param rfp_questions
 * @summary
 * @validation true
 */
// path = '/rfp/questionnaire'
export const DA_Assesstment_POST_QUESTION = async (req: express.Request, res: express.Response) => {
  try {
    const { proc_id, event_id, id, group_id, stop_page_navigate, section, step } = req.query;
    const agreement_id = req.session.agreement_id;
    const { SESSION_ID } = req.cookies;
    const { projectId } = req.session;

    const regex = /questionnaire/gi;
    const url = req.originalUrl.toString();
    const nonOCDS = req.session?.nonOCDSList?.filter((anItem) => anItem.groupId == group_id);
    const started_progress_check: boolean = operations.isUndefined(req.body, 'rfp_build_started');

    const { rfp_build_started } = req.body;
    let { question_id } = req.body;

    if (question_id === undefined) {
      question_id = Object.keys(req.body).filter((x) => x.includes('Question'));
    }
    let question_ids = [];
    //Added for SCAT-3315- Agreement expiry date
    const retrieveAgreement = (await agreementsService.api.getAgreement(agreement_id)).unwrap();
    //CAS-INFO-LOG
    LoggTracer.infoLogger(retrieveAgreement, logConstant.aggrementDetailFetch, req);
    const agreementExpiryDate = retrieveAgreement.endDate;
    if (!Array.isArray(question_id) && question_id !== undefined) question_ids = [question_id];
    else question_ids = question_id;
    const question_idsFilrtedList = [];

    question_ids.forEach((x) => {
      if (question_idsFilrtedList.length > 0) {
        const existing = question_idsFilrtedList.filter((xx) => xx.trim() == x.trim());
        if (existing == undefined || existing == null || existing.length <= 0) {
          question_idsFilrtedList.push(x);
        }
      } else {
        question_idsFilrtedList.push(x);
      }
    });
    question_ids = question_idsFilrtedList;
    if (operations.equals(started_progress_check, false)) {
      if (rfp_build_started === 'true' && nonOCDS !== null && nonOCDS.length > 0) {
        let remove_objectWithKeyIdentifier = ObjectModifiers._deleteKeyofEntryinObject(req.body, 'rfp_build_started');
        remove_objectWithKeyIdentifier = ObjectModifiers._deleteKeyofEntryinObject(
          remove_objectWithKeyIdentifier,
          'question_id'
        );
        const _RequestBody: any = remove_objectWithKeyIdentifier;
        const filtered_object_with_empty_keys = ObjectModifiers._removeEmptyStringfromObjectValues(_RequestBody);
        const object_values = Object.values(filtered_object_with_empty_keys).map((an_answer) => {
          return { value: an_answer, selected: true };
        });

        if (req.body.rfp_read_me) {
          //For only readme type question
          const urlReadmeDetail = `/tenders/projects/${req.query.proc_id}/events/${req.query.event_id}/criteria/${req.query.id}/groups/${req.query.group_id}/questions`;
          const { data: getReadmeDetail } = await TenderApi.Instance(SESSION_ID).get(urlReadmeDetail);
          const dataSetReadme = getReadmeDetail.find((el) => el.nonOCDS.questionType === 'ReadMe');
          if (dataSetReadme !== undefined) {
            const readmeQuestionID = dataSetReadme.OCDS.id;
            const readmeMultiAnswer = dataSetReadme.nonOCDS.multiAnswer;
            const ReadmeBody = {
              nonOCDS: {
                answered: true,
                multiAnswer: readmeMultiAnswer,
                options: [{ selected: true }],
              },
            };
            const ReadmeBaseURL = `/tenders/projects/${req.query.proc_id}/events/${req.query.event_id}/criteria/${req.query.id}/groups/${req.query.group_id}/questions/${readmeQuestionID}`;
            const response = await DynamicFrameworkInstance.Instance(SESSION_ID).put(ReadmeBaseURL, ReadmeBody);
            //CAS-INFO-LOG
            LoggTracer.infoLogger(response, logConstant.saveassesstments, req);
          }

          QuestionHelper.AFTER_UPDATINGDATA_DA_Assessment(
            ErrorView,
            DynamicFrameworkInstance,
            proc_id,
            event_id,
            SESSION_ID,
            group_id,
            agreement_id,
            id,
            res,
            req
          );
        } else {
          let validationError = false;
          let answerValueBody = {};
          for (let i = 0; i < question_ids.length; i++) {
            const questionNonOCDS = nonOCDS.find((item) => item.questionId?.trim() == question_ids[i]?.trim());
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
            } else if (questionNonOCDS.questionType === 'Table') {
              if (KeyValuePairValidation(object_values, req)) {
                validationError = true;
              }

              let { score_criteria_level, score_criteria_points, score_criteria_desc } = req.body;
              const TAStorage = [];
              score_criteria_level = score_criteria_level?.filter((akeyTerm: any) => akeyTerm !== '');
              score_criteria_points = score_criteria_points?.filter((aKeyValue: any) => aKeyValue !== '');
              score_criteria_desc = score_criteria_desc?.filter((aKeyValue: any) => aKeyValue !== '');
              //Balwinder

              const rows = [];
              const tableData = [];
              for (let index = 0; index < score_criteria_level.length; index++) {
                rows.push({ id: index + 1, name: score_criteria_level[index] });
              }

              for (let index = 0; index < score_criteria_points.length; index++) {
                const cols = [];
                cols.push(score_criteria_points[index]);
                cols.push(score_criteria_desc[index]);
                tableData.push({
                  row: index + 1,
                  cols: cols,
                });
              }
              answerValueBody = {
                nonOCDS: {
                  answered: true,
                  options: [
                    {
                      value: 3,
                      tableDefinition: {
                        titles: {
                          columns: [
                            {
                              id: 0,
                              name: 'Marking Scheme',
                            },
                            {
                              id: 1,
                              name: 'Points',
                            },
                            {
                              id: 2,
                              name: 'Description',
                            },
                          ],
                          rows: [...rows],
                        },
                        data: [...tableData],
                      },
                    },
                  ],
                },
              };
            } else if (questionNonOCDS.questionType === 'KeyValuePair') {
              if (KeyValuePairValidation(object_values, req)) {
                validationError = true;
              }

              let { term, value } = req.body;
              const TAStorage = [];
              term = term?.filter((akeyTerm: any) => akeyTerm !== '');
              value = value?.filter((aKeyValue: any) => aKeyValue !== '');
              //Balwinder
              if (section != undefined && section != null && section === '5' && value == undefined) {
                answerValueBody = {
                  nonOCDS: {
                    answered: true,
                    options: [{ value: term[i], selected: true }],
                  },
                };
              } else {
                if (term != undefined && term != null && value != undefined && value != null) {
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
                }
              }
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
                  (x) =>
                    x.value === 'No specific location, for example they can work remotely' ||
                    x.value === 'Not Applicable'
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
              //await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/33`, 'Not started');
            } else if (questionNonOCDS.questionType === 'Date') {
              const slideObj = object_values.slice(1, 4);
              answerValueBody = {
                nonOCDS: {
                  answered: true,
                  options: [...slideObj],
                },
              };
            } else if (questionNonOCDS.questionType === 'Duration') {
              const currentDate = moment(new Date(), 'DD/MM/YYYY').format('DD-MM-YYYY');
              const inputDate =
                req.body['rfp_duration-years_' + question_ids[i]] +
                '-' +
                req.body['rfp_duration_months_' + question_ids[i]] +
                '-' +
                req.body['rfp_duration_days_' + question_ids[i]];
              const agreementExpiryDateFormated = moment(agreementExpiryDate, 'DD/MM/YYYY').format('DD-MM-YYYY');
              const isInputDateLess = moment(inputDate).isBefore(currentDate);
              const isExpiryDateLess = moment(inputDate).isAfter(agreementExpiryDate);
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
                    options: [
                      { value: req.body['rfp_duration-years_' + question_ids[i]], select: true },
                      { value: req.body['rfp_duration_months_' + question_ids[i]], select: true },
                      { value: req.body['rfp_duration_days_' + question_ids[i]], select: true },
                    ],
                  },
                };
              }
            } else if (questionNonOCDS.questionType === 'Text' && questionNonOCDS.multiAnswer === true) {
              if (KeyValuePairValidation(object_values, req)) {
                validationError = true;
                break;
              }
              const splterm = req.body;
              let splTermvalue = req.body;
              const TAStorage = [];
              const questionDataList = splterm[question_ids[i]];
              splTermvalue = questionDataList?.filter((aKeyValue: any) => aKeyValue !== '');

              for (let item = 0; item < splTermvalue?.length; item++) {
                const spltermObject = { value: splTermvalue[item], selected: true };
                TAStorage.push(spltermObject);
              }
              answerValueBody = {
                nonOCDS: {
                  answered: true,
                  options: [...TAStorage],
                },
              };
            } else if (questionNonOCDS.questionType === 'Percentage') {
              const dataList = req.body[question_ids[i]];
              const { percentage } = req.body;
              if (dataList != undefined) {
                const optins = dataList
                  ?.filter((val) => val !== '')
                  .map((val) => {
                    return { value: val, selected: true };
                  });
                answerValueBody = {
                  nonOCDS: {
                    answered: true,
                    multiAnswer: true,
                    options: optins,
                  },
                };
              } else if (percentage != undefined && percentage != null) {
                answerValueBody = {
                  nonOCDS: {
                    answered: true,
                    multiAnswer: questionNonOCDS.multiAnswer,
                    options: [{ value: percentage[i], selected: true }],
                  },
                };
              }
            } else if (
              questionNonOCDS.questionType != 'Integer' &&
              questionNonOCDS.questionType != 'Percentage' &&
              question_ids.length == 4 &&
              questionNonOCDS.multiAnswer === true
            ) {
              answerValueBody = {
                nonOCDS: {
                  answered: true,
                  multiAnswer: questionNonOCDS.multiAnswer,
                  options: req.body[question_ids[i]]
                    .filter((val) => val !== '')
                    .map((val) => {
                      return { value: val, selected: true };
                    }),
                },
              };
            } else if (questionNonOCDS.questionType === 'SingleSelect') {
              if (KeyValuePairValidation(object_values, req)) {
                validationError = true;
                break;
              }
              answerValueBody = {
                nonOCDS: {
                  answered: true,
                  multiAnswer: questionNonOCDS.multiAnswer,
                  options: [{ value: req.body['ccs_vetting_type']?.trim(), selected: true }],
                },
              };
            } else if (questionNonOCDS.questionType === 'Monetary') {
              if (KeyValuePairValidation(object_values, req)) {
                validationError = true;
                break;
              }
              const TAStorage = [];
              const monetaryData = object_values[1];
              for (let item = 0; item < monetaryData?.value?.length; item++) {
                const spltermObject = { value: monetaryData.value[i], selected: true };
                TAStorage.push(spltermObject);
              }
              answerValueBody = {
                nonOCDS: {
                  answered: true,
                  multiAnswer: questionNonOCDS.multiAnswer,
                  options: [...TAStorage],
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
              object_values.map((obj) => {
                if (Array.isArray(obj.value)) objValueArrayCheck = true;
              });
              if (objValueArrayCheck) {
                answerValueBody = {
                  nonOCDS: {
                    answered: true,
                    multiAnswer: questionNonOCDS.multiAnswer,
                    options: [{ value: object_values[1].value[i], selected: true }],
                  },
                };
              } else {
                answerValueBody = {
                  nonOCDS: {
                    answered: true,
                    multiAnswer: questionNonOCDS.multiAnswer,
                    options: [...object_values],
                  },
                };
              }
            }
            if (!validationError) {
              try {
                const answerBaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups/${group_id}/questions/${question_ids[i]}`;
                if (
                  answerValueBody != undefined &&
                  answerValueBody != null &&
                  answerValueBody?.nonOCDS != undefined &&
                  answerValueBody?.nonOCDS?.options.length > 0 &&
                  answerValueBody?.nonOCDS?.options[0].value != undefined
                ) {
                  const response = await DynamicFrameworkInstance.Instance(SESSION_ID).put(
                    answerBaseURL,
                    answerValueBody
                  );
                  //CAS-INFO-LOG
                  LoggTracer.infoLogger(response, logConstant.saveassesstments, req);
                }
              } catch (error) {
                LoggTracer.errorLogger(
                  res,
                  error,
                  `${req.headers.host}${req.originalUrl}`,
                  null,
                  TokenDecoder.decoder(SESSION_ID),
                  'DA Question Assessments - Tenders Service Api cannot be connected',
                  true
                );
              }
            }
          }
          if (validationError) {
            req.session['isValidationError'] = true;
            res.redirect(url.replace(regex, 'questions'));
          } else if (stop_page_navigate == null || stop_page_navigate == undefined) {
            QuestionHelper.AFTER_UPDATINGDATA_DA_Assessment(
              ErrorView,
              DynamicFrameworkInstance,
              proc_id,
              event_id,
              SESSION_ID,
              group_id,
              agreement_id,
              id,
              res,
              req
            );
          } else {
            res.send();
            return;
          }
        }
      } else {
        res.redirect('/error');
      }
    } else {
      res.redirect('/error');
    }
  } catch (err) {
    LoggTracer.errorLogger(
      res,
      err,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'DA Question Assessments - Tenders Service Api cannot be connected',
      true
    );
  }
};

const KeyValuePairValidation = (object_values: any, req: express.Request) => {
  if (object_values.length == 2) {
    const key = object_values[0];
    const keyValue = object_values[1];
    let keyErrorIndex = '',
      keyValueErrorIndex = '';
    if (Array.isArray(key.value) && Array.isArray(keyValue.value)) {
      const eitherElementEmptys = [];
      for (let i = 0; i < key.value.length; i++) {
        if ((key.value[i] === '' && keyValue.value[i] !== '') || (key.value[i] !== '' && keyValue.value[i] === '')) {
          eitherElementEmptys.push({ index: i, isEmpty: true });
        } else {
          if (key.value[i].length > 100) {
            keyErrorIndex = keyErrorIndex + i + ',';
          }
          if (keyValue.value[i].length > 1000) {
            keyValueErrorIndex = keyValueErrorIndex + i + ',';
          }
        }
      }
      if (eitherElementEmptys.length > 0 || keyErrorIndex !== '' || keyValueErrorIndex !== '') {
        req.session.isFieldError = true;
        req.session.emptyFieldError = eitherElementEmptys.length > 0;
        req.session.fieldLengthError = [keyErrorIndex, keyValueErrorIndex];
        const { term, value } = req.body;
        const TAStorage = [];
        for (let item = 0; item < 10; item++) {
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
  const errorText = [];
  data.forEach((requirement) => {
    if (requirement.nonOCDS.questionType == 'KeyValuePair')
      errorText.push({ text: 'You must add information in both fields.' });
    else if (requirement.nonOCDS.questionType == 'Value' && requirement.nonOCDS.multiAnswer === true)
      errorText.push({ text: 'You must add at least one objective' });
    else if (requirement.nonOCDS.questionType == 'Text' && requirement.nonOCDS.multiAnswer === false)
      errorText.push({ text: 'You must enter information here' });
    else if (requirement.nonOCDS.questionType == 'SingleSelect' && requirement.nonOCDS.multiAnswer === false)
      errorText.push({ text: 'You must select one of the radio items' });
    else if (
      requirement.nonOCDS.questionType == 'Text' &&
      requirement.nonOCDS.multiAnswer === true &&
      requirement.OCDS.id == 'Question 1'
    ) {
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
    ) {
      if (requirement.nonOCDS.options.find((x) => x.value === 'Not Applicable'))
        errorText.push({
          text: 'You must select either one phase resource is required for, or select "Not Applicable"',
        });
      else
        errorText.push({
          text: 'Select regions where your staff will be working, or select "No specific location...."',
        });
    } else if (
      requirement.nonOCDS.questionType == 'MultiSelect' &&
      req.session['isLocationError'] == true &&
      req.session['isLocationMandatoryError'] == true
    ) {
      errorText.push({
        text: 'You must select at least one region where your staff will be working, or select "No specific location...."',
      });
    } else if (requirement.nonOCDS.questionType == 'Duration' && req.session['IsInputDateLessError'] == true)
      errorText.push({ text: 'Indicative duration cannot be negative' });
    else if (requirement.nonOCDS.questionType == 'Duration' && req.session['IsExpiryDateLessError'] == true)
      errorText.push({ text: 'Indicative duration cannot exceed 4 years from the indicative start date' });
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

const mapTitle = (groupId) => {
  let title = '';
  switch (groupId) {
    case 'Group 4':
      title = 'technical';
      break;
    case 'Group 5':
      title = 'cultural';
      break;
    case 'Group 6':
      title = 'social value';
      break;
    default:
      return '';
  }
  return title;
};

const mapTableDefinationData = (tableData) => {
  const object = null;
  const columnsHeaderList = getColumnsHeaderList(tableData.tableDefinition?.titles?.columns);
  //var rowDataList
  const tableDefination =
    tableData.tableDefinition != undefined && tableData.tableDefinition.data != undefined
      ? getRowDataList(tableData.tableDefinition?.titles?.rows, tableData.tableDefinition?.data)
      : null;

  return {
    head: columnsHeaderList?.length > 0 && tableDefination?.length > 0 ? columnsHeaderList : [],
    rows: tableDefination?.length > 0 ? tableDefination : [],
  };
};

const getColumnsHeaderList = (columns) => {
  const list = columns?.map((element) => {
    return { text: element.name };
  });
  return list;
};
const getRowDataList = (rows, data1) => {
  const dataRowsList = [];
  rows?.forEach((element) => {
    element.text = element.name;
    const data = getDataList(element.id, data1);
    const innerArrObj = [
      { text: element.name, classes: 'govuk-!-width-one-quarter' },
      { classes: 'govuk-!-width-one-quarter', text: data[0].cols[0] },
      { classes: 'govuk-!-width-one-half', text: data[0].cols[1] },
    ];
    dataRowsList.push(innerArrObj);
  });
  return dataRowsList;
};
const getDataList = (id, data) => {
  const obj = data?.filter((element) => {
    if (element.row == id) {
      return element;
    }
  });
  return obj;
};
