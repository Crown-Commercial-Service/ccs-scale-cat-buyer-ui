//@ts-nocheck
import * as express from 'express';
import { operations } from '../../../utils/operations/operations';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { OrganizationInstance } from '../util/fetch/organizationuserInstance';
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
import { AgreementAPI } from '../../../common/util/fetch/agreementservice/agreementsApiInstance';

/**
 * @Controller
 * @GET
 * @summary switches query related to specific parameter
 * @validation false
 */
export const RFP_GET_QUESTIONS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  let { agreement_id, proc_id, event_id, id, group_id, section } = req.query;

  try {
    //BALWINDER ADDED THIS CODE FOR SKIP DATA FOR GROUP 18
    if (group_id === 'Group 18') {
      group_id = 'Group 19';
      id = 'Criterion 3';
    }

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
    //const bcTitleText = OCDS?.description;
    //const titleText = nonOCDS.mandatory === false ? OCDS?.description + ' (Optional)' : OCDS?.description;
    const newOCDSdescription = changeTitle(OCDS?.description)
    //Balwinder
    const bcTitleText = newOCDSdescription == '' ? OCDS?.description : newOCDSdescription;
    const titleText = nonOCDS.mandatory===true ? bcTitleText:bcTitleText + ' (Optional)';
    const promptData = nonOCDS?.prompt;
    const splitOn = ' <br> ';
    const promptSplit = group_id =='Group 6' && id=='Criterion 3'?promptData:promptData?.split(splitOn);
    const nonOCDSList = [];
    fetch_dynamic_api_data = fetch_dynamic_api_data.sort((n1, n2) => n1.nonOCDS.order - n2.nonOCDS.order);
    const form_name = fetch_dynamic_api_data?.map((aSelector: any) => {
      aSelector.nonOCDS.type = titleText;
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
        return 'rfp_multianswer_question_form';
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
      }
      else if (aSelector.nonOCDS.questionType === 'Table' || 'Integer') {
        return 'ccs_rfp_scoring_criteria';
      }
      else {
        return '';
      }
    });
    const ChoosenAgreement = req.session.agreement_id;
    const FetchAgreementServiceData = await AgreementAPI.Instance.get(`/agreements/${ChoosenAgreement}`);
    const AgreementEndDate = FetchAgreementServiceData.data.endDate;

    req.session?.nonOCDSList = nonOCDSList;
    const releatedContent = req.session.releatedContent;
    fetch_dynamic_api_data = fetch_dynamic_api_data.sort((a, b) => (a.OCDS.id < b.OCDS.id ? -1 : 1));
    const errorText = findErrorText(fetch_dynamic_api_data, req);

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
    const POSITIONEDELEMENTS = [...new Set(TemporaryObjStorage.map(JSON.stringify))]
      .map(JSON.parse)
      .filter(item => !item.nonOCDS.dependant);

    const formNameValue = form_name.find(fn => fn !== '');
    // res.json(POSITIONEDELEMENTS)
    const { isFieldError } = req.session;
    let data = {
      data: group_id === 'Group 8' && id === 'Criterion 2' ? TemporaryObjStorage : POSITIONEDELEMENTS,
      agreement: AgreementEndDate,
      agreementEndDate: AgreementEndDate,
      agreement_id: agreement_id,
      proc_id: proc_id,
      event_id: event_id,
      group_id: group_id,
      criterian_id: id,
      form_name: bcTitleText != "The people who will use your product or service" ? formNameValue : "service_user_type_form",
      rfpTitle: titleText,
      shortTitle: mapTitle(group_id),
      bcTitleText,
      prompt: promptSplit,
      organizationName: organizationName,
      emptyFieldError: req.session['isValidationError'],
      errorText: errorText,
      releatedContent: releatedContent,
      section: section
    };
    if (isFieldError) {
      delete data.data[0].nonOCDS.options;
      data.data[0].nonOCDS.options = req.session['errorFields'];
    }
    if (group_id === 'Group 19' && id === 'Criterion 3') {
      data.form_name = 'service_levels_kpi_form';
    }

    if (group_id === 'Group 10' && id === 'Criterion 3') {
      let count = 0;
      data.data.forEach(x => {
        if (count != 0) {
          var optionsData = x.nonOCDS.options != null && x.nonOCDS.options.length > 0 ? x.nonOCDS.options[0].value : null;
          if (optionsData != null) {
            x.nonOCDS.options = [];
            x.nonOCDS.options.push({ value: optionsData.substring(1).split("Y")[0] });
            x.nonOCDS.options.push({ value: optionsData.substring(1).split("Y")[1].split("M")[0] });
            x.nonOCDS.options.push({ value: optionsData.substring(1).split("Y")[1].split("M")[1].replace("D", "") });;
          }
          if (x.nonOCDS.childern != undefined && x.nonOCDS.childern.length > 0) {
            var optionsData1 = x.nonOCDS.childern[0].nonOCDS?.options != null && x.nonOCDS.childern[0].nonOCDS?.options.length > 0 ? x.nonOCDS.childern[0].nonOCDS?.options[0].value : null;
            if (optionsData1 != null) {
              x.nonOCDS.childern[0].nonOCDS.options = [];
              x.nonOCDS.childern[0].nonOCDS.options.push({ value: optionsData1.substring(1).split("Y")[0] });
              x.nonOCDS.childern[0].nonOCDS.options.push({ value: optionsData1.substring(1).split("Y")[1].split("M")[0] });
              x.nonOCDS.childern[0].nonOCDS.options.push({ value: optionsData1.substring(1).split("Y")[1].split("M")[1].replace("D", "") });;
            }
          }
        }
        count++;
      });
    }
    req.session['isFieldError'] = false;
    req.session['isValidationError'] = false;
    req.session['fieldLengthError'] = [];
    req.session['emptyFieldError'] = false;
    res.render('rfp-question', data);
  } catch (error) {
    delete error?.config?.['headers'];
    const Logmessage = {
      Person_id: TokenDecoder.decoder(SESSION_ID),
      error_location: `${req.headers.host}${req.originalUrl}`,
      sessionId: 'null',
      error_reason: 'FC Dynamic framework throws error - Tenders Api is causing problem',
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
 * @param rfp_questions
 * @summary
 * @validation true
 */
// path = '/rfp/questionnaire'
export const RFP_POST_QUESTION = async (req: express.Request, res: express.Response) => {
  try {
    const { proc_id, event_id, id, group_id, stop_page_navigate, section } = req.query;
    const agreement_id = req.session.agreement_id;
    const { SESSION_ID } = req.cookies;
    const { projectId } = req.session;

    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/20`, 'In progress');

    const regex = /questionnaire/gi;
    const url = req.originalUrl.toString();
    const nonOCDS = req.session?.nonOCDSList?.filter(anItem => anItem.groupId == group_id);
    const started_progress_check: boolean = operations.isUndefined(req.body, 'rfp_build_started');
    let { rfp_build_started, question_id } = req.body;
    if (question_id === undefined) {
      question_id = Object.keys(req.body).filter(x => x.includes('Question'));
    }
    let question_ids = [];
    //Added for SCAT-3315- Agreement expiry date
    const BaseUrlAgreement = `/agreements/${agreement_id}`;
    const { data: retrieveAgreement } = await AgreementAPI.Instance.get(BaseUrlAgreement);
    const agreementExpiryDate = retrieveAgreement.endDate;
    if (!Array.isArray(question_id) && question_id !== undefined) question_ids = [question_id];
    else question_ids = question_id;
    let question_idsFilrtedList = [];

    question_ids.forEach(x => {
      if (question_idsFilrtedList.length > 0) {
        let existing = question_idsFilrtedList.filter(xx => xx.trim() == x.trim())
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
          'question_id',
        );
        const _RequestBody: any = remove_objectWithKeyIdentifier;
        const filtered_object_with_empty_keys = ObjectModifiers._removeEmptyStringfromObjectValues(_RequestBody);
        const { _csrf } = req.body;
        let object_values = Object.values(filtered_object_with_empty_keys).filter(an_answer => {
          if (_csrf != an_answer) {
            return { value: an_answer, selected: true };
          }
        });

        if (req.body.rfp_read_me) {
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
          let validationError = false;
          let answerValueBody = {};
          for (let i = 0; i < question_ids.length; i++) {
            const questionNonOCDS = nonOCDS.find(item => item.questionId?.trim() == question_ids[i]?.trim());
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
              }

              let { term, value, } = req.body;
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
                const check = Array.isArray(anObject);
                if (check) {
                  let arrayOFArrayedObjects = anObject.map((anItem: any) => {
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
                selectedOptionToggle.length > 0 && selectedOptionToggle[i].find(
                  x =>
                    x.value === 'No specific location, for example they can work remotely' ||
                    x.value === 'Not Applicable',
                )
              ) {
                validationError = true;
                req.session['isLocationError'] = true;
                break;
              } else if (selectedOptionToggle.length > 0) {
                answerValueBody = {
                  nonOCDS: {
                    answered: true,
                    options: [...selectedOptionToggle[i]],
                  },
                };
              }
              //await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/33`, 'Not started');
            } else if (questionNonOCDS.questionType === 'Date') {

              const slideObj = object_values.slice(0, 4);
              let newArraryForDate = [];
              if (slideObj != null && slideObj.length > 0) {
                slideObj.forEach(x => {
                  if (x.value === undefined) {
                    newArraryForDate.push({ value: x, select: true });
                  } else if (x.value !== undefined) {
                    newArraryForDate.push({ value: x, select: true })
                  }
                })
              }
              answerValueBody = {
                nonOCDS: {
                  answered: true,
                  options: newArraryForDate,
                },
              };
            } else if (questionNonOCDS.questionType === 'Duration') {
              let currentDate = moment(new Date(), 'DD/MM/YYYY').format('DD-MM-YYYY');
              let inputDate = req.body["rfp_duration-years_" + question_ids[i]] + '-' + req.body["rfp_duration_months_" + question_ids[i]] + '-' + req.body["rfp_duration_days_" + question_ids[i]];
              let agreementExpiryDateFormated = moment(agreementExpiryDate, 'DD/MM/YYYY').format('DD-MM-YYYY');
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
                let dureationValue = null;
                let year = 0;
                let month = 0;
                let day = 0;
                if (Number(req.body["rfp_duration-years_" + question_ids[i].replace(" ", "")]) >= 0) {
                  year = Number(req.body["rfp_duration-years_" + question_ids[i].replace(" ", "")]);
                }
                if (Number(req.body["rfp_duration_months_" + question_ids[i].replace(" ", "")]) >= 0) {
                  month = Number(req.body["rfp_duration_months_" + question_ids[i].replace(" ", "")]);
                }
                if (Number(req.body["rfp_duration_days_" + question_ids[i].replace(" ", "")]) >= 0) {
                  day = Number(req.body["rfp_duration_days_" + question_ids[i].replace(" ", "")]);
                }
                dureationValue = "P" + year + "Y" + month + "M" + day + "D";
                dureationValue = dureationValue === 'P0Y0M0D' ? null : dureationValue;
                answerValueBody = {
                  nonOCDS: {
                    answered: true,
                    options: [
                      { value: dureationValue, select: true },
                    ],
                  },
                };
              }
            }
            else if (questionNonOCDS.questionType === 'Text' && questionNonOCDS.multiAnswer === true) {
              if (KeyValuePairValidation(object_values, req)) {
                validationError = true;
                break;
              }
              let splterm = req.body;
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
            }
            else if (questionNonOCDS.questionType === 'Percentage') {
              const dataList = req.body[question_ids[i]];
              const { percentage } = req.body;
              if (dataList != undefined) {
                var optins = dataList?.filter(val => val !== '')
                  .map(val => {
                    return { value: val, selected: true };
                  });
                answerValueBody = {
                  nonOCDS: {
                    answered: true,
                    multiAnswer: true,
                    options: optins
                  }
                };
              } else if (percentage != undefined && percentage != null) {
                answerValueBody = {
                  nonOCDS: {
                    answered: true,
                    multiAnswer: questionNonOCDS.multiAnswer,
                    options: [{ value: percentage[i], selected: true }]
                  }
                };
              }

            }
            else if (questionNonOCDS.questionType != 'Percentage' && question_ids.length == 4 && questionNonOCDS.multiAnswer === true) {
              answerValueBody = {
                nonOCDS: {
                  answered: true,
                  multiAnswer: questionNonOCDS.multiAnswer,
                  options: req.body[question_ids[i]]
                    .filter(val => val !== '')
                    .map(val => {
                      return { value: val, selected: true };
                    }),
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
                  options: [{ value: req.body["ccs_vetting_type"]?.trim(), selected: true }],
                },
              };
            }
            else if (questionNonOCDS.questionType === 'Monetary') {
              if (KeyValuePairValidation(object_values, req)) {
                validationError = true;
                break;
              }
              const TAStorage = [];
              const monetaryData = object_values[0];
              // for (let item = 0; item < monetaryData?.length; item++) {
              //   const spltermObject = { value: monetaryData[i], selected: true };
              //   TAStorage.push(spltermObject);
              // }
              answerValueBody = {
                nonOCDS: {
                  answered: true,
                  multiAnswer: questionNonOCDS.multiAnswer,
                  options: [{ value: monetaryData[i], selected: true }],
                },
              };
            } else {
              if (
                (questionNonOCDS.mandatory == true && object_values.length == 0)
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
                    multiAnswer: questionNonOCDS.multiAnswer,
                    options: [{ value: object_values[1].value[i], selected: true }],
                  },
                };
              } else {
                let optionsData = [];
                for (let index = 0; index < object_values.length; index++) {
                  optionsData.push({ value: object_values[index], selected: true });
                }
                answerValueBody = {
                  nonOCDS: {
                    answered: true,
                    multiAnswer: questionNonOCDS.multiAnswer,
                    options: [...optionsData],
                  },
                };
              }
            }
            if (!validationError) {
              try {
                const answerBaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups/${group_id}/questions/${question_ids[i]}`;
                const { _csrf } = req.body;
                if (answerValueBody != undefined && answerValueBody != null && answerValueBody?.nonOCDS != undefined) {
                  var options = answerValueBody?.nonOCDS?.options.filter(x => {
                    if (x?.value != _csrf && x?.value != undefined) {
                      return x;
                    }
                  });
                  answerValueBody.nonOCDS.options = options;
                  answerValueBody.OCDS = {
                    id: question_ids[i]
                  }
                  await DynamicFrameworkInstance.Instance(SESSION_ID).put(answerBaseURL, answerValueBody);
                }

              } catch (error) {
                LoggTracer.errorTracer(error, res);
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
    LoggTracer.errorTracer(err, res);
  }
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
  let errorText = [];
  data.forEach(requirement => {
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
      if (requirement.nonOCDS.options.find(x => x.value === 'Not Applicable'))
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

const mapTitle = groupId => {
  let title = '';
  switch (groupId) {
    case 'Group 4':
      title = 'techinical';
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


function changeTitle(title) {
  let text = '';
  switch (title) {
    case 'Learn about adding context and requirements':
      text = 'Learn more about adding context and requirements';
      break;
    case 'Terms and acronyms':
      text = 'Terms and acronyms';
      break;
    case 'Background and context to your requirement':
      text = 'Background to your procurement';
      break;
    case 'Problem to solve/impact of not completing deliverables and outcome':
      text = 'The business problem you need to solve';
      break;
    case 'Key Users':
      text = 'The people who will use your product or service';
      break;
    case 'Work Completed to date':
      text = 'Work done so far';
      break;
    case 'Current phase of the project':
      text = 'Which phase the project is currently in';
      break;
    case 'Phase resource is required for':
      text = 'Which phase(s) of the project you need resource for';
      break;
    case 'Duration of work/resource required for':
      text = 'The expected duration of the project';
      break;
    case 'The buying organisation':
      text = 'Who the buying organisation is';
      break;
    case 'Market engagement to date':
      text = 'Describe any market engagement you\'ve done';
      break;
    case 'New, replacement or expanded services or products':
      text = 'Choose if this a new, replacement or expanded service or product';
      break;
    case 'Is there an incumbent supplier?':
      text = 'Tell us if there is an existing supplier';
      break;
    case 'Management information and reporting':
      text = 'Management information and reporting requirements';
      break;
    case 'Define your service levels and KPIs':
      text = 'Define your service levels and KPIs';
      break;
    case 'Incentives and exit strategy':
      text = 'Detail any performance incentives and exit strategies';
      break;
    case 'How the supplier is going to deliver within the budget constraints':
      text = 'Contract values and how suppliers will meet the project needs within this budget';
      break;
    case 'Set your project budget':
      text = 'Set your project budget'
      break;
    case 'Enter your project requirements':
      text = 'Enter your project requirements';
      break;
  }
  return text;
}