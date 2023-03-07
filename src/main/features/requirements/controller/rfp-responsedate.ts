//@ts-nocheck
import * as express from 'express';
import { TenderApi } from '../../../common/util/fetch/tenderService/tenderApiInstance';
import { bankholidayContentAPI } from '../../../common/util/fetch/bankholidayservice/bankholidayApiInstance';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';
import { RESPONSEDATEHELPER } from '../helpers/responsedate';
import { HttpStatusCode } from 'main/errors/httpStatusCodes';
import moment from 'moment-business-days';
import {ShouldEventStatusBeUpdated} from '../../shared/ShouldEventStatusBeUpdated';
import { Console } from 'console';
import { logConstant } from '../../../common/logtracer/logConstant';

export const RFP_GET_RESPONSE_DATE = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const proj_Id = req.session.projectId;
  const {eventId,stage2_value} = req.session;
  const agreement_id = req.session.agreement_id;
  if(agreement_id == 'RM1043.8'){
    if(stage2_value !== undefined && stage2_value === "Stage 2"){//Stage 2
      let flag = await ShouldEventStatusBeUpdated(eventId, 33, req);
      if (flag) {
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/33`, 'In progress');
      }
    }else{
      let flag=await ShouldEventStatusBeUpdated(eventId,34,req);
      if(flag)
      {
    await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/34`, 'In progress');
      }
    }
    
  }else{
    let flag=await ShouldEventStatusBeUpdated(eventId,40,req);
    if(flag)
    {
  await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/40`, 'In progress');
    }
  
  }
  RESPONSEDATEHELPER(req, res);
};
export const RFP_POST_RESPONSE_DATE = async (req: express.Request, res: express.Response) => {
  const RequestBodyValues = Object.values(req.body);
  const { supplier_period_for_clarification_period } = req.body;
  req.session['endDate'] = supplier_period_for_clarification_period;
  const filterWithQuestions = RequestBodyValues.map(aQuestions => {
    const anEntry = aQuestions.split('*');
    return { Question: anEntry[0], value: anEntry[1] };
  });
  const proc_id = req.session.projectId;
  const event_id = req.session.eventId;
  const stage2_value = req.session.stage2_value;
  const { SESSION_ID } = req.cookies;
  const { projectId,eventId } = req.session;
  const agreement_id = req.session.agreement_id;
  let baseURL = `/tenders/projects/${proc_id}/events/${event_id}`;
  baseURL = baseURL + '/criteria';
  const keyDateselector = 'Key Dates';
  try {
    const fetch_dynamic_api = await TenderApi.Instance(SESSION_ID).get(baseURL);
    const fetch_dynamic_api_data = fetch_dynamic_api?.data;
    const extracted_criterion_based = fetch_dynamic_api_data?.map(criterian => criterian?.id);
    let criterianStorage = [];
    for (const aURI of extracted_criterion_based) {
      const criterian_bas_url = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${aURI}/groups`;
      const fetch_criterian_group_data = await TenderApi.Instance(SESSION_ID).get(criterian_bas_url);
      const criterian_array = fetch_criterian_group_data?.data;
      const rebased_object_with_requirements = criterian_array?.map(anItem => {
        const object = anItem;
        object['criterianId'] = aURI;
        return object;
      });
      criterianStorage.push(rebased_object_with_requirements);
    }
    criterianStorage = criterianStorage.flat();
    criterianStorage = criterianStorage.filter(AField => AField.OCDS.id === keyDateselector);
    const Criterian_ID = criterianStorage[0].criterianId;
    const apiData_baseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${Criterian_ID}/groups/${keyDateselector}/questions`;
    const fetchQuestions = await TenderApi.Instance(SESSION_ID).get(apiData_baseURL);
    const fetchQuestionsData = fetchQuestions.data;
    const allunfilledAnswer = fetchQuestionsData
      .filter(anAswer => anAswer.nonOCDS.options.length == 0)
      .map(aQuestion => aQuestion.OCDS.id);
    for (const answers of allunfilledAnswer) {
      const proc_id = req.session.projectId;
      const event_id = req.session.eventId;
      const id = Criterian_ID;
      const group_id = 'Key Dates';
      const question_id = answers;
      const findFilterQuestion = filterWithQuestions.filter(question => question.Question === question_id);
      const findFilterValues = findFilterQuestion[0].value;
      const filtervalues=moment(
        findFilterValues,
        'DD MMMM YYYY, HH:mm:ss ',
      ).format('YYYY-MM-DDTHH:mm:ss')+'Z';
      const answerformater = {
        value: filtervalues,
        selected: true,
        text: answers,
      };
      const answerBody = {
        nonOCDS: {
          answered: true,
          options: [answerformater],
        },
      };
      const answerBaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups/${group_id}/questions/${question_id}`;
      const timeLineRaw = await TenderApi.Instance(SESSION_ID).put(answerBaseURL, answerBody);
      //CAS-INFO-LOG
      LoggTracer.infoLogger(timeLineRaw, logConstant.setYourTimeLineUpdated, req);
    }

    if (agreement_id=='RM6187') {
      const response = await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/36`, 'Completed');
      if (response.status == HttpStatusCode.OK) {
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/37`, 'Not started');
      }
    }
    else if (agreement_id=='RM1557.13') {
      const response = await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/35`, 'Completed');
      if (response.status == HttpStatusCode.OK) {
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/36`, 'Not started');
      }
    }  
    else if (agreement_id=='RM1043.8') {
      if(stage2_value !== undefined && stage2_value === "Stage 2"){//Stage 2
        let responseData = await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/33`, 'Completed');
        let flag = await ShouldEventStatusBeUpdated(event_id, 34, req);
        if (flag) {
          await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/34`, 'Not started');
        }
      }else{
        let responseData = await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/34`, 'Completed');
        if (responseData.status == HttpStatusCode.OK) {
          await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/35`, 'Not started');
        }
      }
      
    }
    else{
      const response = await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/23`, 'Completed');
      if (response.status == HttpStatusCode.OK) {
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/24`, 'Not started');
      }
      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/40`, 'Completed');
      let flag=await ShouldEventStatusBeUpdated(eventId,41,req);
      if(flag)
      {
      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/41`, 'Not started');
      }
   }
    res.redirect('/rfp/review');
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Tenders Service Api cannot be connected',
      true,
    );
  }
};
function isValidQuestion(
  questionId: number,
  day: number,
  month: number,
  year: number,
  hour: number,
  minute: number,
  timeinHoursBased: number,
  timeline: any,
  agreement_id: any,
  stage2_value: any,
  bankholidaydata:any

) {
  //const date1 = new Date(year, month, day, timeinHoursBased, minute);
  //let todaydate=new Date();
  let isValid = true,
  isweekendErrorFlag = false,
    error,
    errorSelector;
  if (day > 31 || day < 1) {
    isValid = false;
    error = 'Enter a valid date';
  }
  if (minute > 59 || minute < 0) {
    isValid = false;
    error = 'Enter valid minutes';
  }
  if (hour > 23 || hour <= 0) {
    isValid = false;
    error = 'Enter a valid hour';
  }
  if (month > 12 || month < 0) {
    isValid = false;
    error = 'Enter a valid month';
  }
  const currentYear = new Date().getFullYear();
  if (year > 2121) {
    isValid = false;
    error = 'Enter a valid year';
  }
  const questionNewDate = new Date(year, month, day, timeinHoursBased, minute);
//   const questionNewDate=moment(
//     questionNewDate12,
//     'DD MMMM YYYY, HH:mm:ss ',
//   ).format('YYYY-MM-DDTHH:mm:ss')+'Z';


// const timeliii=moment(questionNewDate12,'DD MMMM YYYY, HH:mm:ss ',
// ).format('YYYY-MM-DDTHH:mm:ss')+'Z';
let bankHolidayEnglandWales;
//if (agreement_id=='RM1043.8') {
 if(bankholidaydata){
let bankholidaydataengland =   JSON.stringify(bankholidaydata.data).replace(/england-and-wales/g, 'englandwales'); //convert to JSON string
     bankholidaydataengland = JSON.parse(bankholidaydataengland); //convert back to array
     bankHolidayEnglandWales = bankholidaydataengland.englandwales.events;
  }
//}
const questionInputDate = new Date(year, month, day);
 
  let bankHolidayResult = checkBankHoliday(questionInputDate,bankHolidayEnglandWales);
  if(bankHolidayResult){
    isValid = false;
    error = 'You cannot set a date in bank holiday';
  }
  const dayOfWeek = new Date(questionNewDate).getDay();
  
  if (dayOfWeek === 6 || dayOfWeek === 0) {
    isValid = false;
    error = 'You cannot set a date in weekend';
    isweekendErrorFlag = true;
  }
  
 
  if(bankHolidayResult){
    isValid = false;
    error = 'You cannot set a date in bank holiday';
  }

  if(isweekendErrorFlag){
    isValid = false;
    error = 'You cannot set a date in weekend';
  }
  

  switch (questionId) {
    case 'Question 1':
      errorSelector = 'clarification_date';
      break;
    case 'Question 2':
      if (questionNewDate < new Date(timeline.publish)) {
        isValid = false;
        
            error = 'You cannot set a date and time that is earlier than the previous milestone in the timeline';
      }
      if (questionNewDate > new Date(timeline.publishResponsesClarificationQuestions)) {
        isValid = false;
          error = 'You cannot set a date and time that is greater than the next milestone in the timeline';
      }
      errorSelector = 'clarification_period_end';
      break;
    case 'Question 3':
      if (questionNewDate < new Date(timeline.clarificationPeriodEnd)) {
        isValid = false;
           error = 'You cannot set a date and time that is earlier than the previous milestone in the timeline';
      }
      if (questionNewDate > new Date(timeline.supplierSubmitResponse)) {
        isValid = false;
          error = 'You cannot set a date and time that is greater than the next milestone in the timeline';
      }
      errorSelector = 'deadline_period_for_clarification_period';
      break;
    case 'Question 4': 
      if (questionNewDate < new Date(timeline.publishResponsesClarificationQuestions)) {
        isValid = false;
        
          error = 'You cannot set a date and time that is earlier than the previous milestone in the timeline';
      }
      
      
    //  if (questionNewDate > new Date(timeline.confirmNextStepsSuppliers)) {
      if (questionNewDate > new Date(timeline.deadlineForSubmissionOfStageOne)) {
          isValid = false;
          error = 'You cannot set a date and time that is greater than the next milestone in the timeline';
      }
      errorSelector = 'supplier_period_for_clarification_period';
      break;
    case 'Question 5':
      if (questionNewDate < new Date(timeline.supplierSubmitResponse)) {
        isValid = false;
           error = 'You cannot set a date and time that is earlier than the previous milestone in the timeline';
      }
      if (questionNewDate > new Date(timeline.deadlineForSubmissionOfStageOne)) {
        isValid = false;
        error = 'You cannot set a date and time that is greater than the next milestone in the timeline';
      }
      errorSelector = 'supplier_dealine_for_clarification_period';
      break;
    case 'Question 6':
      if (questionNewDate < new Date(timeline.supplierSubmitResponse)) {
        isValid = false;
          error = 'You cannot set a date and time that is earlier than the previous milestone in the timeline';
      }
      if (questionNewDate > new Date(timeline.evaluationProcessStartDate)) {
        isValid = false;
         error = 'You cannot set a date and time that is greater than the next milestone in the timeline';
      }
      errorSelector = 'deadline_for_submission_of_stage_one';
      break;
    case 'Question 7':
      if (questionNewDate < new Date(timeline.deadlineForSubmissionOfStageOne)) {
        isValid = false;
        error = 'You cannot set a date and time that is earlier than the previous milestone in the timeline';
      }
      if (questionNewDate > new Date(timeline.bidderPresentationsDate)) {
        isValid = false;
        error = 'You cannot set a date and time that is greater than the next milestone in the timeline';
      }
      errorSelector = 'evaluation_process_start_date';
      break;
    case 'Question 8':
      
      if (questionNewDate < new Date(timeline.evaluationProcessStartDate)) {
        isValid = false;
        error = 'You cannot set a date and time that is earlier than the previous milestone in the timeline';
      }
      
      if(agreement_id == 'RM1043.8' && stage2_value !== undefined && stage2_value === "Stage 2"){
        
      }else{
        if (questionNewDate > new Date(timeline.standstillPeriodStartsDate)) {
          isValid = false;
            error = 'You cannot set a date and time that is greater than the next milestone in the timeline';
        }
      }
      
      errorSelector = 'bidder_presentations_date';
      break;
    case 'Question 9':
      if (questionNewDate < new Date(timeline.bidderPresentationsDate)) {
        isValid = false;
         error = 'You cannot set a date and time that is earlier than the previous milestone in the timeline';
      }
      if (questionNewDate > new Date(timeline.proposedAwardDate)) {
        isValid = false;
         error = 'You cannot set a date and time that is greater than the next milestone in the timeline';
      }
      errorSelector = 'standstill_period_starts_date';
      break;
    case 'Question 10': 
      if (questionNewDate < new Date(timeline.standstillPeriodStartsDate)) {
        isValid = false;
         error = 'You cannot set a date and time that is earlier than the previous milestone in the timeline';
      }
      if (questionNewDate > new Date(timeline.expectedSignatureDate)) {
        isValid = false;
         error = 'You cannot set a date and time that is greater than the next milestone in the timeline';
      }
      errorSelector = 'proposed_award_date';
      break;
    case 'Question 11':
      if (questionNewDate < new Date(timeline.proposedAwardDate)) {
        isValid = false;
          error = 'You cannot set a date and time that is earlier than the previous milestone in the timeline';
      }
        if (agreement_id=='RM1043.8') { //DOS
          if (questionNewDate > new Date(timeline.contractsigneddate)) {
            isValid = false;
              error = 'You cannot set a date and time that is greater than the next milestone in the timeline';
          }
        }
      errorSelector = 'expected_signature_date';
      break;
          
      case 'Question 12':
      if (questionNewDate < new Date(timeline.expectedSignatureDate)) {
        isValid = false;
         error = 'You cannot set a date and time that is earlier than the previous milestone in the timeline';
      }
      if (questionNewDate > new Date(timeline.supplierstartdate)) {
        isValid = false;
          error = 'You cannot set a date and time that is greater than the next milestone in the timeline';
      }
      errorSelector = 'contract_signed_date';
      break;

      case 'Question 13':
      if (questionNewDate < new Date(timeline.contractsigneddate)) {
       
        isValid = false;
         error = 'You cannot set a date and time that is earlier than the previous milestone in the timeline';
      }
      
      errorSelector = 'supplier_start_date';
      break;
    

    default:
      isValid = true;
  }
  return { isValid, error, errorSelector };
}
function checkBankHoliday(questionInputDate,bankHolidayEnglandWales) {
  let isBankHoliday = false; 
 if(bankHolidayEnglandWales.length>0){
  let currentyearHolidays =  bankHolidayEnglandWales.filter(holiday=>new Date(holiday.date).getFullYear() == questionInputDate.getFullYear())
  currentyearHolidays.forEach(data=>{

      if(questionInputDate.setHours(0, 0, 0, 0) === new Date(data.date).setHours(0, 0, 0, 0)){
          isBankHoliday = true;
      }
  })


 }
return isBankHoliday;
}

// @POST "/rfp/add/response-date"
export const RFP_POST_ADD_RESPONSE_DATE = async (req: express.Request, res: express.Response) => {
  let {
    clarification_date_day,
    clarification_date_month,
    clarification_date_year,
    clarification_date_hour,
    clarification_date_minute,
    clarification_date_hourFormat,
    selected_question_id,
    selected_question_index,
  } = req.body;
  const { timeline,agreement_id } = req.session;
  
  const stage2_value = req.session.stage2_value;
  let basebankURL = `/bank-holidays.json`;
  const bankholidaydata = await bankholidayContentAPI.Instance(null).get(basebankURL);
  clarification_date_day = Number(clarification_date_day);
  clarification_date_month = Number(clarification_date_month);
  clarification_date_year = Number(clarification_date_year);
  clarification_date_hour = Number(clarification_date_hour);
  // const selected_question_indexte = selected_question_index;
  
  if(clarification_date_day ==0 || isNaN(clarification_date_day) ||clarification_date_month ==0 || isNaN(clarification_date_month) || clarification_date_year ==0 || isNaN(clarification_date_year) || clarification_date_hour ==0 || isNaN(clarification_date_hour) || clarification_date_minute == '')
  {
    let errorText='';
    if(((clarification_date_day ==0 || isNaN(clarification_date_day)) || (clarification_date_month ==0 || isNaN(clarification_date_month)) || (clarification_date_year ==0 || isNaN(clarification_date_year))) && (clarification_date_hour ==0 || isNaN(clarification_date_hour) || clarification_date_minute == ''))
    {
      if(agreement_id == 'RM1043.8'){
        errorText='Enter a complete date';
      }else{
        errorText='Date and Time invalid or empty. Please enter the valid date and time';
      }
    }
    else if(clarification_date_day ==0 || isNaN(clarification_date_day) ||clarification_date_month ==0 || isNaN(clarification_date_month) || clarification_date_year ==0 || isNaN(clarification_date_year))
    {
      if(agreement_id == 'RM1043.8'){
        errorText='Enter a complete date';
      }else{
        errorText='Date invalid or empty. Please enter the valid date';
      }
    }
    else if(clarification_date_hour ==0 || isNaN(clarification_date_hour) || clarification_date_minute == '')
    {
      if(agreement_id == 'RM1043.8'){
        errorText='Enter a complete time';
      }else{
        errorText='Time invalid or empty. Please enter the valid time';
      }
    }

    const errorItem = {     
      text: errorText, 
      href:  'rfp_clarification_date'+selected_question_index,
    };
    await RESPONSEDATEHELPER(req, res, true, errorItem);
  }
  
  else
  {

   
  clarification_date_minute = Number(clarification_date_minute);
  clarification_date_month = clarification_date_month - 1;
  let timeinHoursBased = 0;
  if (clarification_date_hourFormat == 'AM') {
    timeinHoursBased = Number(clarification_date_hour);
  } else {
    timeinHoursBased = Number(clarification_date_hour);
  }
  let date = new Date(
    clarification_date_year,
    clarification_date_month,
    clarification_date_day,
    timeinHoursBased,
    clarification_date_minute,
  );
  
  

  const nowDate = new Date();
  const { isValid, error, errorSelector } = isValidQuestion(
    selected_question_id,
    clarification_date_day,
    clarification_date_month,
    clarification_date_year,
    clarification_date_hour,
    clarification_date_minute,
    timeinHoursBased,
    timeline,
    agreement_id,
    stage2_value,
    bankholidaydata
    
  );
	
  let dateNewNow = new Date(req.session.timeline.publish);	

  if (date.getTime() >= dateNewNow.getTime() && isValid) {
    //date = moment(date).format('DD MMMM YYYY, hh:mm a');
    date = moment(date).format('DD MMMM YYYY, HH:mm');
    
    req.session.questionID=selected_question_id;

    if(selected_question_id=='Question 2')
    {req.session.rfppublishdate=timeline.publish;
      req.session.deadlinepublishresponse=timeline.publishResponsesClarificationQuestions;
      req.session.supplierresponse=timeline.supplierSubmitResponse;
      req.session.nextsupplier=timeline.confirmNextStepsSuppliers;
      req.session.deadlinestageone=timeline.deadlineForSubmissionOfStageOne;
      req.session.processstart=timeline.evaluationProcessStartDate;
      req.session.bidder=timeline.bidderPresentationsDate;
      req.session.standstill=timeline.standstillPeriodStartsDate;
      req.session.awarddate=timeline.proposedAwardDate;
      req.session.signaturedate=timeline.expectedSignatureDate;

      if (agreement_id=='RM1043.8') {//DOS
      req.session.signeddate=timeline.contractsigneddate;
      req.session.startdate=timeline.supplierstartdate;
      }
    req.session.UIDate=date;
  }
    else if (selected_question_id=='Question 3')
{  req.session.rfppublishdate=timeline.publish;
  req.session.clarificationend=timeline.clarificationPeriodEnd;
  req.session.supplierresponse=timeline.supplierSubmitResponse;
      req.session.nextsupplier=timeline.confirmNextStepsSuppliers;
      req.session.deadlinestageone=timeline.deadlineForSubmissionOfStageOne;
      req.session.processstart=timeline.evaluationProcessStartDate;
      req.session.bidder=timeline.bidderPresentationsDate;
      req.session.standstill=timeline.standstillPeriodStartsDate;
      req.session.awarddate=timeline.proposedAwardDate;
      req.session.signaturedate=timeline.expectedSignatureDate;
      if (agreement_id=='RM1043.8') {//DOS
        req.session.signeddate=timeline.contractsigneddate;
        req.session.startdate=timeline.supplierstartdate;
      }
    req.session.UIDate=date;
  }
    else if(selected_question_id=='Question 4')
{  req.session.rfppublishdate=timeline.publish;
  req.session.clarificationend=timeline.clarificationPeriodEnd;
  req.session.deadlinepublishresponse=timeline.publishResponsesClarificationQuestions;
  req.session.nextsupplier=timeline.confirmNextStepsSuppliers;
      req.session.deadlinestageone=timeline.deadlineForSubmissionOfStageOne;
      req.session.processstart=timeline.evaluationProcessStartDate;
      req.session.bidder=timeline.bidderPresentationsDate;
      req.session.standstill=timeline.standstillPeriodStartsDate;
      req.session.awarddate=timeline.proposedAwardDate;
    req.session.signaturedate=timeline.expectedSignatureDate;
    if (agreement_id=='RM1043.8') {//DOS
      req.session.signeddate=timeline.contractsigneddate;
      req.session.startdate=timeline.supplierstartdate;
    }
    req.session.UIDate=date;
  }
  else if(selected_question_id=='Question 5')
{ req.session.rfppublishdate=timeline.publish;
  req.session.clarificationend=timeline.clarificationPeriodEnd;
  req.session.deadlinepublishresponse=timeline.publishResponsesClarificationQuestions;
  req.session.supplierresponse=timeline.supplierSubmitResponse;
  req.session.deadlinestageone=timeline.deadlineForSubmissionOfStageOne;
      req.session.processstart=timeline.evaluationProcessStartDate;
      req.session.bidder=timeline.bidderPresentationsDate;
      req.session.standstill=timeline.standstillPeriodStartsDate;
      req.session.awarddate=timeline.proposedAwardDate;
    req.session.signaturedate=timeline.expectedSignatureDate;
    if (agreement_id=='RM1043.8') {//DOS
      req.session.signeddate=timeline.contractsigneddate;
      req.session.startdate=timeline.supplierstartdate;
    }
    req.session.UIDate=date;
  }
  else if(selected_question_id=='Question 6')
  {req.session.rfppublishdate=timeline.publish;
    req.session.clarificationend=timeline.clarificationPeriodEnd;
    req.session.deadlinepublishresponse=timeline.publishResponsesClarificationQuestions;
    req.session.supplierresponse=timeline.supplierSubmitResponse;
    req.session.processstart=timeline.evaluationProcessStartDate;
      req.session.bidder=timeline.bidderPresentationsDate;
      req.session.standstill=timeline.standstillPeriodStartsDate;
      req.session.awarddate=timeline.proposedAwardDate;
    req.session.signaturedate=timeline.expectedSignatureDate;
    if (agreement_id=='RM1043.8') {//DOS
      req.session.signeddate=timeline.contractsigneddate;
      req.session.startdate=timeline.supplierstartdate;
    }
  req.session.UIDate=date;
}
  else if (selected_question_id=='Question 7')
{ 
req.session.rfppublishdate=timeline.publish;
req.session.clarificationend=timeline.clarificationPeriodEnd;
req.session.deadlinepublishresponse=timeline.publishResponsesClarificationQuestions;
req.session.supplierresponse=timeline.supplierSubmitResponse;
req.session.nextsupplier=timeline.confirmNextStepsSuppliers;
req.session.deadlinestageone=timeline.deadlineForSubmissionOfStageOne;
req.session.processstart=timeline.evaluationProcessStartDate;
req.session.bidder=timeline.bidderPresentationsDate;
req.session.standstill=timeline.standstillPeriodStartsDate;
req.session.awarddate=timeline.proposedAwardDate;
req.session.signaturedate=timeline.expectedSignatureDate;
if (agreement_id=='RM1043.8') {//DOS
  req.session.signeddate=timeline.contractsigneddate;
  req.session.startdate=timeline.supplierstartdate;
}
  req.session.UIDate=date;
}
  else if(selected_question_id=='Question 8')
{  req.session.rfppublishdate=timeline.publish;
req.session.clarificationend=timeline.clarificationPeriodEnd;
req.session.deadlinepublishresponse=timeline.publishResponsesClarificationQuestions;
req.session.supplierresponse=timeline.supplierSubmitResponse;
req.session.nextsupplier=timeline.confirmNextStepsSuppliers;
req.session.deadlinestageone=timeline.deadlineForSubmissionOfStageOne;
req.session.processstart=timeline.evaluationProcessStartDate;
req.session.bidder=timeline.bidderPresentationsDate;
req.session.standstill=timeline.standstillPeriodStartsDate;
req.session.awarddate=timeline.proposedAwardDate;
req.session.signaturedate=timeline.expectedSignatureDate;
if (agreement_id=='RM1043.8') {//DOS
  req.session.signeddate=timeline.contractsigneddate;
  req.session.startdate=timeline.supplierstartdate;
}
  req.session.UIDate=date; 
}
else if(selected_question_id=='Question 9')
{ req.session.rfppublishdate=timeline.publish;
  req.session.clarificationend=timeline.clarificationPeriodEnd;
  req.session.deadlinepublishresponse=timeline.publishResponsesClarificationQuestions;
  req.session.supplierresponse=timeline.supplierSubmitResponse;
  req.session.nextsupplier=timeline.confirmNextStepsSuppliers;
  req.session.deadlinestageone=timeline.deadlineForSubmissionOfStageOne;
  req.session.processstart=timeline.evaluationProcessStartDate;
  req.session.bidder=timeline.bidderPresentationsDate;
req.session.awarddate=timeline.proposedAwardDate;
req.session.signaturedate=timeline.expectedSignatureDate;
if (agreement_id=='RM1043.8') {//DOS
  req.session.signeddate=timeline.contractsigneddate;
  req.session.startdate=timeline.supplierstartdate;
}
  req.session.UIDate=date;
}
else if(selected_question_id=='Question 10')
{  req.session.rfppublishdate=timeline.publish;
  req.session.clarificationend=timeline.clarificationPeriodEnd;
  req.session.deadlinepublishresponse=timeline.publishResponsesClarificationQuestions;
  req.session.supplierresponse=timeline.supplierSubmitResponse;
  req.session.nextsupplier=timeline.confirmNextStepsSuppliers;
  req.session.deadlinestageone=timeline.deadlineForSubmissionOfStageOne;
  req.session.processstart=timeline.evaluationProcessStartDate;
  req.session.bidder=timeline.bidderPresentationsDate;
req.session.standstill=timeline.standstillPeriodStartsDate;
req.session.signaturedate=timeline.expectedSignatureDate;
if (agreement_id=='RM1043.8') {//DOS
  req.session.signeddate=timeline.contractsigneddate;
  req.session.startdate=timeline.supplierstartdate;
}
  req.session.UIDate=date;
}
else if(selected_question_id=='Question 11')
{ req.session.rfppublishdate=timeline.publish;
 
req.session.clarificationend=timeline.clarificationPeriodEnd;
req.session.deadlinepublishresponse=timeline.publishResponsesClarificationQuestions;
req.session.supplierresponse=timeline.supplierSubmitResponse;
req.session.nextsupplier=timeline.confirmNextStepsSuppliers;
req.session.deadlinestageone=timeline.deadlineForSubmissionOfStageOne;
req.session.processstart=timeline.evaluationProcessStartDate;
req.session.bidder=timeline.bidderPresentationsDate;
req.session.standstill=timeline.standstillPeriodStartsDate;
req.session.awarddate=timeline.proposedAwardDate;
if (agreement_id=='RM1043.8') {//DOS
  req.session.signeddate=timeline.contractsigneddate;
  req.session.startdate=timeline.supplierstartdate;
}
  req.session.UIDate=date;
}

else if(selected_question_id=='Question 12')
{ 
  
req.session.rfppublishdate=timeline.publish;
req.session.clarificationend=timeline.clarificationPeriodEnd;
req.session.deadlinepublishresponse=timeline.publishResponsesClarificationQuestions;
req.session.supplierresponse=timeline.supplierSubmitResponse;
req.session.nextsupplier=timeline.confirmNextStepsSuppliers;
req.session.deadlinestageone=timeline.deadlineForSubmissionOfStageOne;
req.session.processstart=timeline.evaluationProcessStartDate;
req.session.bidder=timeline.bidderPresentationsDate;
req.session.standstill=timeline.standstillPeriodStartsDate;
req.session.awarddate=timeline.proposedAwardDate;
req.session.signaturedate=timeline.expectedSignatureDate;
req.session.startdate=timeline.supplierstartdate;
req.session.signeddate=timeline.contractsigneddate;


req.session.UIDate=date;
}

else if(selected_question_id=='Question 13')
{ 
req.session.rfppublishdate=timeline.publish;
req.session.clarificationend=timeline.clarificationPeriodEnd;
req.session.deadlinepublishresponse=timeline.publishResponsesClarificationQuestions;
req.session.supplierresponse=timeline.supplierSubmitResponse;
req.session.nextsupplier=timeline.confirmNextStepsSuppliers;
req.session.deadlinestageone=timeline.deadlineForSubmissionOfStageOne;
req.session.processstart=timeline.evaluationProcessStartDate;
req.session.bidder=timeline.bidderPresentationsDate;
req.session.standstill=timeline.standstillPeriodStartsDate;
req.session.awarddate=timeline.proposedAwardDate;
req.session.signaturedate=timeline.expectedSignatureDate;
req.session.signeddate=timeline.contractsigneddate;
req.session.UIDate=date;
}



const filtervalues=moment(
  date,
  'DD MMMM YYYY, HH:mm:ss ',
).format('YYYY-MM-DDTHH:mm:ss')+'Z';

    const answerformater = {
      value: filtervalues,
      selected: true,
      text: selected_question_id,
    };
    const answerBody = {
      nonOCDS: {
        answered: true,
        options: [answerformater],
      },
    };
    const { SESSION_ID } = req.cookies;
    try {
      const proc_id = req.session.projectId;
      const event_id = req.session.eventId;
      const group_id = 'Key Dates';
      const question_id = selected_question_id;
      let baseURL = `/tenders/projects/${proc_id}/events/${event_id}`;
      baseURL = baseURL + '/criteria';
      const fetch_dynamic_api = await TenderApi.Instance(SESSION_ID).get(baseURL);
      const fetch_dynamic_api_data = fetch_dynamic_api?.data;
      const extracted_criterion_based = fetch_dynamic_api_data?.map(criterian => criterian?.id).sort();
      let criterianStorage = [];
      for (const aURI of extracted_criterion_based) {
        const criterian_bas_url = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${aURI}/groups`;
        const fetch_criterian_group_data = await TenderApi.Instance(SESSION_ID).get(criterian_bas_url);
        const criterian_array = fetch_criterian_group_data?.data;
        const rebased_object_with_requirements = criterian_array?.map(anItem => {
          const object = anItem;
          object['criterianId'] = aURI;
          return object;
        });
        criterianStorage.push(rebased_object_with_requirements);
      }
      criterianStorage = criterianStorage.flat();
      const Criterian_ID = criterianStorage[0].criterianId;
      const id = Criterian_ID;
      const answerBaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${id}/groups/${group_id}/questions/${question_id}`;
      

      await TenderApi.Instance(SESSION_ID).put(answerBaseURL, answerBody);
      res.redirect('/rfp/response-date');
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
    
    const selectedErrorCause = selected_question_id; //Question 2
    let selector = '';
    let selectorID = '';
    if (!isValid) {
      selector = error;
      selectorID = errorSelector;
    } else {
      switch (selectedErrorCause) {
        case 'Question 1':
          selector =
            ' Publish your RFP - You cannot set a date and time that is earlier than the previous milestone in the timeline';
          selectorID = 'clarification_date';
          break;
        case 'Question 2':
          selector =
            'Clarification period ends - You cannot set a date and time that is earlier than the previous milestone in the timeline';
          selectorID = 'clarification_period_end';
          break;
        case 'Question 3':
          selector =
            'Deadline for publishing responses to RFP clarification questions- You cannot set a date and time that is earlier than the previous milestone in the timeline';
          selectorID = 'deadline_period_for_clarification_period';
          break;
        case 'Question 4':
          selector =
            'Deadline for suppliers to submit their RFP response - You cannot set a date and time that is earlier than the previous milestone in the timeline';
          selectorID = 'supplier_period_for_clarification_period';
          break;
        case 'Question 5':
          selector =
            'Confirm your next steps to suppliers - You cannot set a date and time that is earlier than the previous milestone in the timeline';
          selectorID = 'supplier_dealine_for_clarification_period';
          break;
        case 'Question 6':
          selector =
            'Confirm your next steps to suppliers - You cannot set a date and time that is earlier than the previous milestone in the timeline';
          selectorID = 'deadline_for_submission_of_stage_one';
          break;
        case 'Question 7':
          selector =
            'Confirm your next steps to suppliers - You cannot set a date and time that is earlier than the previous milestone in the timeline';
          selectorID = 'evaluation_process_start_date';
          break;
        case 'Question 8':
          selector =
            'Confirm your next steps to suppliers - You cannot set a date and time that is earlier than the previous milestone in the timeline';
          selectorID = 'bidder_presentations_date';
          break;
        case 'Question 9':
          selector =
            'Confirm your next steps to suppliers - You cannot set a date and time that is earlier than the previous milestone in the timeline';
          selectorID = 'standstill_period_starts_date';
          break;
        case 'Question 10':
          selector =
            'Confirm your next steps to suppliers - You cannot set a date and time that is earlier than the previous milestone in the timeline';
          selectorID = 'proposed_award_date';
          break;
        case 'Question 11':
          selector =
            'Confirm your next steps to suppliers - You cannot set a date and time that is earlier than the previous milestone in the timeline';
          selectorID = 'expected_signature_date';
          break;
          case 'Question 12':
          selector =
            'Confirm your next steps to suppliers - You cannot set a date and time that is earlier than the previous milestone in the timeline';
          selectorID = 'contract_signed_date';
          break;
          case 'Question 13':
          selector =
            'Confirm your next steps to suppliers - You cannot set a date and time that is earlier than the previous milestone in the timeline';
          selectorID = 'supplier_start_date';
          break;
        default:
          selector = ' You cannot set a date and time that is earlier than the previous milestone in the timeline';
      }
    }
    const errorItem = {
      text: selector,
      href: 'rfp_clarification_date'+selected_question_index,
    
    };
    await RESPONSEDATEHELPER(req, res, true, errorItem);
  }
}};
