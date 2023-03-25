//@ts-nocheck
import * as express from 'express';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { bankholidayContentAPI } from '../../../common/util/fetch/bankholidayservice/bankholidayApiInstance';
import moment from 'moment-business-days';
import * as cmsData from '../../../resources/content/requirements/rfp-response-date.json';
import * as Mcf3cmsData from '../../../resources/content/MCF3/requirements/rfp-response-date.json';
import * as DOScmsData from '../../../resources/content/MCF3/requirements/DOSrfp-response-date.json';
import * as DOS2cmsData from '../../../resources/content/MCF3/requirements/DOSstage2-response-date.json';
import * as GCloudData from '../../../resources/content/requirements/Gcloudrfp-response-date.json';
import { logConstant } from '../../../common/logtracer/logConstant';

import config from 'config';
import { TenderApi } from '../../../common/util/fetch/tenderService/tenderApiInstance';

const momentCssHolidays = async () => {
  let basebankURL = `/bank-holidays.json`;
  const bankholidaydata = await bankholidayContentAPI.Instance(null).get(basebankURL);
  let bankholidaydataengland =   JSON.stringify(bankholidaydata.data).replace(/england-and-wales/g, 'englandwales'); //convert to JSON string
  bankholidaydataengland = JSON.parse(bankholidaydataengland); //convert back to array
  let bankHolidayEnglandWales = bankholidaydataengland.englandwales.events;
  let holiDaysArr = []
  for (let h = 0; h < bankHolidayEnglandWales.length; h++) {
    var AsDate = new Date(bankHolidayEnglandWales[h].date);
    holiDaysArr.push(moment(AsDate).format('DD-MM-YYYY'));
  }
  
  moment.updateLocale('en', {
    holidays: holiDaysArr,
    holidayFormat: 'DD-MM-YYYY'
  });
}

const DSP_Days = {
  defaultEndingHour: Number(config.get('predefinedDays.defaultEndingHour')),
  defaultEndingMinutes: Number(config.get('predefinedDays.defaultEndingMinutes')),
  clarification_days: Number(config.get('predefinedDays.clarification_days')),
  clarification_period_end: Number(config.get('predefinedDays.clarification_period_end')),
  supplier_period: Number(config.get('predefinedDays.supplier_period')),
  supplier_deadline: Number(config.get('predefinedDays.supplier_deadline')),
  supplier_period_extra: Number(config.get('predefinedDays.supplier_period_extra')),
  supplier_deadline_extra: Number(config.get('predefinedDays.supplier_deadline_extra')),
};
const MCF3_Days = { 
  defaultEndingHour: Number(config.get('predefinedDays.mcf3_fc_defaultEndingHour')),
  defaultEndingMinutes: Number(config.get('predefinedDays.mcf3_fc_defaultEndingMinutes')),
  clarification_days: Number(config.get('predefinedDays.mcf3_fc_clarification_days')),
  clarification_period_end: Number(config.get('predefinedDays.mcf3_fc_clarification_period_end')),
  supplier_period: Number(config.get('predefinedDays.mcf3_fc_supplier_period')),
  supplier_deadline: Number(config.get('predefinedDays.mcf3_fc_supplier_deadline')), 
  supplier_period_extra: Number(config.get('predefinedDays.mcf3_fc_supplier_period_extra')),
  supplier_persentation: Number(config.get('predefinedDays.mcf3_fc_supplier_persentation')),
  supplier_award_date: Number(config.get('predefinedDays.mcf3_fc_supplier_award_date')),
  supplier_deadline_extra: Number(config.get('predefinedDays.mcf3_fc_supplier_deadline_extra')),
};

const DOS_Days = {
  defaultEndingHour: Number(config.get('predefinedDays.dos_defaultEndingHour')),
  defaultEndingMinutes: Number(config.get('predefinedDays.dos_defaultEndingMinutes')),
  clarification_days: Number(config.get('predefinedDays.dos_clarification_days')),
  clarification_period_end: Number(config.get('predefinedDays.dos_clarification_period_end')),
  supplier_period: Number(config.get('predefinedDays.dos_supplier_period')),
  closing_date: Number(config.get('predefinedDays.dos_closing_date')),
  supplier_deadline: Number(config.get('predefinedDays.dos_supplier_deadline')),
  supplier_period_extra: Number(config.get('predefinedDays.dos_supplier_period_extra')),
  supplier_deadline_extra: Number(config.get('predefinedDays.dos_supplier_deadline_extra')),
  stand_stils_date: Number(config.get('predefinedDays.dos_stand_stils_date')),
  
};
export const RESPONSEDATEHELPER = async (req: express.Request, res: express.Response, errorTriggered, errorItem) => {
  
  await momentCssHolidays();
  
  let predefinedDays;
  if(req.session.agreement_id == 'RM6187') {  //MCF3
    predefinedDays = MCF3_Days;
  } 
  else if(req.session.agreement_id == 'RM1043.8') {  //DOS
    predefinedDays = DOS_Days;
  }else if(req.session.agreement_id == 'RM1557.13') {  //Gcloud
    predefinedDays = MCF3_Days;
  }
  else {  //DSP
    predefinedDays = DSP_Days;
  }
  const projectId = req.session.projectId;
  const proc_id = req.session.projectId;
  const event_id = req.session.eventId;
  const { SESSION_ID } = req.cookies;
  const stage2_value = req.session.stage2_value;
  const agreementId_session = req.session.agreement_id;
  let baseURL = `/tenders/projects/${proc_id}/events/${event_id}`;
  baseURL = baseURL + '/criteria';
  const keyDateselector = 'Key Dates';
  let selectedeventtype=req.session.selectedeventtype;
  try {
    const fetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(baseURL);
    const fetch_dynamic_api_data = fetch_dynamic_api?.data;
    const extracted_criterion_based = fetch_dynamic_api_data?.map(criterian => criterian?.id);
    let criterianStorage = [];
    for (const aURI of extracted_criterion_based) {
      const criterian_bas_url = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${aURI}/groups`;
      const fetch_criterian_group_data = await DynamicFrameworkInstance.Instance(SESSION_ID).get(criterian_bas_url);
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
    const prompt = criterianStorage[0].nonOCDS.prompt;
    const apiData_baseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${Criterian_ID}/groups/${keyDateselector}/questions`;

    const fetchQuestions = await DynamicFrameworkInstance.Instance(SESSION_ID).get(apiData_baseURL);
    let fetchQuestionsData = fetchQuestions.data;
    
    let publishDate = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 1").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;	
    publishDate = publishDate!=undefined?publishDate:new Date();

    let rfp_clarification;
    let  rfp_clarification_date;
    let rfp_clarification_period_end;
    let rfp_clarification_period;
    let deadline_period;
    let rfp_clarification_endDate;
    let supplier_period_for_clarification_period;
    let supplier_dealine_for_clarification_period;
    
    if(req.session.UIDate==null){
     ////////////////////////////////    1
      let rfp_clarification_date = moment(new Date(), 'DD/MM/YYYY').format('DD MMMM YYYY');
      let publishDateNew = moment(new Date(publishDate), 'DD/MM/YYYY').format('DD MMMM YYYY');

    ////////////////////////////////////   2
      const clarification_period_end_date = new Date();
      const clarification_period_end_date_parsed = `${clarification_period_end_date.getDate()}-${
        clarification_period_end_date.getMonth() + 1
      }-${clarification_period_end_date.getFullYear()}`;
      let rfp_clarification_period_end = moment(clarification_period_end_date_parsed, 'DD-MM-YYYY').businessAdd(
        predefinedDays.clarification_days,
      )._d;
      rfp_clarification_period_end.setHours(predefinedDays.defaultEndingHour);
      rfp_clarification_period_end.setMinutes(predefinedDays.defaultEndingMinutes);

      ////////////////////////////////////   3
      const DeadlinePeriodDate = rfp_clarification_period_end;
      const DeadlinePeriodDate_Parsed = `${DeadlinePeriodDate.getDate()}-${
        DeadlinePeriodDate.getMonth() + 1
      }-${DeadlinePeriodDate.getFullYear()}`;
      let deadline_period_for_clarification_period = moment(DeadlinePeriodDate_Parsed, 'DD-MM-YYYY').businessAdd(
        predefinedDays.clarification_period_end,
      )._d;
      deadline_period_for_clarification_period.setHours(predefinedDays.defaultEndingHour);
      deadline_period_for_clarification_period.setMinutes(predefinedDays.defaultEndingMinutes);

       ////////////////////////////////////   4
      const SupplierPeriodDate = deadline_period_for_clarification_period;
      const SupplierPeriodDate_Parsed = `${SupplierPeriodDate.getDate()}-${
        SupplierPeriodDate.getMonth() + 1
      }-${SupplierPeriodDate.getFullYear()}`;
      let supplier_period_for_clarification_period = moment(SupplierPeriodDate_Parsed, 'DD-MM-YYYY').businessAdd(
        predefinedDays.supplier_period,
      )._d;
      supplier_period_for_clarification_period.setHours(predefinedDays.defaultEndingHour);
      supplier_period_for_clarification_period.setMinutes(predefinedDays.defaultEndingMinutes);

      ////////////////////////////////////   5
      const SupplierPeriodDeadLine = supplier_period_for_clarification_period;
      const SupplierPeriodDeadLine_Parsed = `${SupplierPeriodDeadLine.getDate()}-${
        SupplierPeriodDeadLine.getMonth() + 1
      }-${SupplierPeriodDeadLine.getFullYear()}`;
      let supplier_dealine_for_clarification_period = moment(SupplierPeriodDeadLine_Parsed, 'DD-MM-YYYY').businessAdd(
        predefinedDays.supplier_deadline,
      )._d;
      supplier_dealine_for_clarification_period.setHours(predefinedDays.defaultEndingHour);
      supplier_dealine_for_clarification_period.setMinutes(predefinedDays.defaultEndingMinutes);
      ////////////////////////////////////   6
      const SupplierSubmissionDeadLine = supplier_dealine_for_clarification_period;
      const SupplierSubmissionDeadLineDate = `${SupplierSubmissionDeadLine.getDate()}-${
        SupplierSubmissionDeadLine.getMonth() + 1
      }-${SupplierSubmissionDeadLine.getFullYear()}`;
      let deadline_for_submission_of_stage_one = moment(SupplierSubmissionDeadLineDate, 'DD-MM-YYYY').businessAdd(
        predefinedDays.supplier_period_extra,
      )._d;
      deadline_for_submission_of_stage_one.setHours(predefinedDays.defaultEndingHour);
      deadline_for_submission_of_stage_one.setMinutes(predefinedDays.defaultEndingMinutes);
      //////////////////////////////////////7
      const EvaluationProcessStart = deadline_for_submission_of_stage_one;
      const EvaluationProcessStartDate = `${EvaluationProcessStart.getDate()}-${
        EvaluationProcessStart.getMonth() + 1
      }-${EvaluationProcessStart.getFullYear()}`;
      
      let evaluation_process_start_date ='';
      if(req.session.agreement_id == 'RM1043.8') {  //DOS
       evaluation_process_start_date = moment(EvaluationProcessStartDate, 'DD-MM-YYYY').businessAdd(
        predefinedDays.closing_date,
       )._d;
      } else if(req.session.agreement_id == 'RM6187' || req.session.agreement_id == 'RM1557.13') {
         evaluation_process_start_date = moment(EvaluationProcessStartDate, 'DD-MM-YYYY').businessAdd(
          predefinedDays.supplier_persentation,
        )._d;
      }else{
         evaluation_process_start_date = moment(EvaluationProcessStartDate, 'DD-MM-YYYY').businessAdd(
          predefinedDays.supplier_period_extra,
        )._d;
      }
      
      evaluation_process_start_date.setHours(predefinedDays.defaultEndingHour);
      evaluation_process_start_date.setMinutes(predefinedDays.defaultEndingMinutes);
      //////////////////////////////////////8
      const BidderPresentations = evaluation_process_start_date;
      const BidderPresentationsDate = `${BidderPresentations.getDate()}-${
        BidderPresentations.getMonth() + 1
      }-${BidderPresentations.getFullYear()}`;
      
      let bidder_presentations_date ='';
      if(req.session.agreement_id == 'RM1043.8') {  //DOS
         bidder_presentations_date = moment(BidderPresentationsDate, 'DD-MM-YYYY').businessAdd(
          predefinedDays.supplier_deadline,
        )._d;
      } else if(req.session.agreement_id == 'RM6187' || req.session.agreement_id == 'RM1557.13') {
          bidder_presentations_date = moment(BidderPresentationsDate, 'DD-MM-YYYY').businessAdd(
          predefinedDays.supplier_persentation,
        )._d;
      } else {
         bidder_presentations_date = moment(BidderPresentationsDate, 'DD-MM-YYYY').businessAdd(
          predefinedDays.supplier_period_extra,
        )._d;
     }
      
      bidder_presentations_date.setHours(predefinedDays.defaultEndingHour);
      bidder_presentations_date.setMinutes(predefinedDays.defaultEndingMinutes);
      //////////////////////////////////////9
      const StandstillPeriodStarts = bidder_presentations_date;
      const StandstillPeriodStartsDate = `${StandstillPeriodStarts.getDate()}-${
        StandstillPeriodStarts.getMonth() + 1
      }-${StandstillPeriodStarts.getFullYear()}`;
      
      let standstill_period_starts_date ='';
      if(req.session.agreement_id == 'RM1043.8') {  //DOS
         standstill_period_starts_date = moment(StandstillPeriodStartsDate, 'DD-MM-YYYY').businessAdd(
          predefinedDays.clarification_period_end,
        )._d;
      } else if(req.session.agreement_id == 'RM6187' || req.session.agreement_id == 'RM1557.13') {
         standstill_period_starts_date = moment(StandstillPeriodStartsDate, 'DD-MM-YYYY').businessAdd(
          predefinedDays.supplier_award_date,
        )._d;
      }else{
         standstill_period_starts_date = moment(StandstillPeriodStartsDate, 'DD-MM-YYYY').businessAdd(
          predefinedDays.supplier_deadline_extra,
        )._d;
      }
      
      standstill_period_starts_date.setHours(predefinedDays.defaultEndingHour);
      standstill_period_starts_date.setMinutes(predefinedDays.defaultEndingMinutes);
      //////////////////////////////////////10
      const ProposedAward = standstill_period_starts_date;
      const ProposedAwardDate = `${ProposedAward.getDate()}-${
        ProposedAward.getMonth() + 1
      }-${ProposedAward.getFullYear()}`;
      
      let proposed_award_date ='';
      if(req.session.agreement_id == 'RM1043.8') {  //DOS
         proposed_award_date = moment(ProposedAwardDate, 'DD-MM-YYYY').businessAdd(
          predefinedDays.stand_stils_date,
        )._d;
      } else if(req.session.agreement_id == 'RM6187' || req.session.agreement_id == 'RM1557.13') {
         proposed_award_date = moment(ProposedAwardDate, 'DD-MM-YYYY').businessAdd(
          predefinedDays.supplier_award_date,
        )._d;
      }else{
         proposed_award_date = moment(ProposedAwardDate, 'DD-MM-YYYY').businessAdd(
          predefinedDays.supplier_deadline_extra,
        )._d;
      }
        
      proposed_award_date.setHours(predefinedDays.defaultEndingHour);
      proposed_award_date.setMinutes(predefinedDays.defaultEndingMinutes);
      //////////////////////////////////////11
      const ExpectedSignature = proposed_award_date;
      const ExpectedSignatureDate = `${ExpectedSignature.getDate()}-${
        ExpectedSignature.getMonth() + 1
      }-${ExpectedSignature.getFullYear()}`;
      
      let expected_signature_date ='';
      if(req.session.agreement_id == 'RM1043.8') {  //DOS
         expected_signature_date = moment(ExpectedSignatureDate, 'DD-MM-YYYY').businessAdd(
          predefinedDays.closing_date,
        )._d;
      } else if(req.session.agreement_id == 'RM6187' || req.session.agreement_id == 'RM1557.13') {
         expected_signature_date = moment(ExpectedSignatureDate, 'DD-MM-YYYY').businessAdd(
          predefinedDays.supplier_persentation,
        )._d;
      }else{
         expected_signature_date = moment(ExpectedSignatureDate, 'DD-MM-YYYY').businessAdd(
          predefinedDays.supplier_period_extra,
        )._d;
      }
        
      expected_signature_date.setHours(predefinedDays.defaultEndingHour);
      expected_signature_date.setMinutes(predefinedDays.defaultEndingMinutes);


      //////////////////////////////////////12
      let contract_signed_date ='';
      let supplier_start_date='';
      if(req.session.agreement_id == 'RM1043.8') {  //DOS
      const ContractSigned = expected_signature_date;
      const ContractSignedDate = `${ContractSigned.getDate()}-${
        ContractSigned.getMonth() + 1
      }-${ContractSigned.getFullYear()}`;
          contract_signed_date = moment(ContractSignedDate, 'DD-MM-YYYY').businessAdd(
          predefinedDays.closing_date, )._d;
          contract_signed_date.setHours(predefinedDays.defaultEndingHour);
          contract_signed_date.setMinutes(predefinedDays.defaultEndingMinutes);

       //////////////////////////////////////13
      const SupplierStart = contract_signed_date;
        const SupplierStartDate = `${SupplierStart.getDate()}-${
          SupplierStart.getMonth() + 1
        }-${SupplierStart.getFullYear()}`;
            supplier_start_date = moment(SupplierStartDate, 'DD-MM-YYYY').businessAdd(
            predefinedDays.supplier_deadline, )._d;
            supplier_start_date.setHours(predefinedDays.defaultEndingHour);
            supplier_start_date.setMinutes(predefinedDays.defaultEndingMinutes);
      }

     
      fetchQuestionsData = fetchQuestionsData.sort((current_element, next_element) => {
        const currentElementID = Number(current_element.OCDS.id.split('Question ').join(''));
        const nextElementID = Number(next_element.OCDS.id.split('Question ').join(''));
        return currentElementID - nextElementID;
        });

        for(var i=0;i<fetchQuestionsData.length;i++){
          if(fetchQuestionsData[i].nonOCDS.options.length>0){
         
          let value=fetchQuestionsData[i].nonOCDS.options[0].value;
            
          if(i==0){
            if(stage2_value === "Stage 2"){
              fetchQuestionsData[i].nonOCDS.options[0].value=moment(value,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY, HH:mm');
            }else{
              fetchQuestionsData[i].nonOCDS.options[0].value=moment(value,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY');
            }
            
          }
          else
          {
          fetchQuestionsData[i].nonOCDS.options[0].value=moment(value,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY, HH:mm');
          }

          if(agreementId_session == 'RM1043.8' && stage2_value !== undefined && stage2_value === "Stage 2"){
            if(i==0){
              if(value!==undefined){
                rfp_clarification_date=moment(value).format('DD MMMM YYYY');
              }
            }
            if(i==1){
             
              if(value!==undefined){
                rfp_clarification_period_end=changeDateTimeFormat(value);
              }
              
            }
            if(i==2){
              if(value!==undefined){
                deadline_period_for_clarification_period=changeDateTimeFormat(value);
              }
            }
            if(i==3){
              if(value!==undefined){
                supplier_period_for_clarification_period=changeDateTimeFormat(value);
              }
            }
            if(i==4){
              if(value!==undefined){
                supplier_dealine_for_clarification_period=changeDateTimeFormat(value);
              }
            }
            if(i==5){
              if(value!==undefined){
                deadline_for_submission_of_stage_one=changeDateTimeFormat(value);
              }
            }
            if(i==6){
              if(value!==undefined){
                evaluation_process_start_date=changeDateTimeFormat(value);
              }
            }
            if(i==7){
              if(value!==undefined){
                bidder_presentations_date=changeDateTimeFormat(value);
              }
            }
            
          }
          
         // fetchQuestionsData[i].nonOCDS.options[0].value = moment(value,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY, HH:mm');
        }
        }

        if(!req.session.isTimelineRevert) {
        let rfp_clarification_period_endGet = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 2").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;	
        rfp_clarification_period_end = rfp_clarification_period_endGet!=undefined?new Date(rfp_clarification_period_endGet):rfp_clarification_period_end;
       
        let deadline_period_for_clarification_periodGet = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 3").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;	
        deadline_period_for_clarification_period = deadline_period_for_clarification_periodGet!=undefined?new Date(deadline_period_for_clarification_periodGet):deadline_period_for_clarification_period;
       
        
        let supplier_period_for_clarification_periodGet = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 4").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;	
        supplier_period_for_clarification_period = supplier_period_for_clarification_periodGet!=undefined?new Date(supplier_period_for_clarification_periodGet):supplier_period_for_clarification_period;
       
        
        let supplier_dealine_for_clarification_periodGet = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 5").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;	
        supplier_dealine_for_clarification_period = supplier_dealine_for_clarification_periodGet!=undefined?new Date(supplier_dealine_for_clarification_periodGet):supplier_dealine_for_clarification_period;
       
        let deadline_for_submission_of_stage_oneGet = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 6").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;	
        deadline_for_submission_of_stage_one = deadline_for_submission_of_stage_oneGet!=undefined?new Date(deadline_for_submission_of_stage_oneGet):deadline_for_submission_of_stage_one;
       
       
        let evaluation_process_start_dateGet = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 7").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;	
        evaluation_process_start_date = evaluation_process_start_dateGet!=undefined?new Date(evaluation_process_start_dateGet):evaluation_process_start_date;
       
        let bidder_presentations_dateGet = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 8").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;	
       
        bidder_presentations_date = bidder_presentations_dateGet!=undefined?new Date(bidder_presentations_dateGet):bidder_presentations_date;
       
        let standstill_period_starts_dateGet = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 9").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;	
        standstill_period_starts_date = standstill_period_starts_dateGet!=undefined?new Date(standstill_period_starts_dateGet):standstill_period_starts_date;
       
        let proposed_award_dateGet = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 10").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;	
        proposed_award_date = proposed_award_dateGet!=undefined?new Date(proposed_award_dateGet):proposed_award_date;
    
        let expected_signature_dateGet = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 11").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;	
      // console.log("asss",new Date(expected_signature_dateGet));

        expected_signature_date = expected_signature_dateGet!=undefined?new Date(expected_signature_dateGet):expected_signature_date;
      //  expected_signature_date=new Date(expected_signature_dateNew);

        let contract_signed_dateGet = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 12").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;	
      
        contract_signed_date = contract_signed_dateGet!=undefined?new Date(contract_signed_dateGet):contract_signed_date;
        
        let supplier_start_dateGet = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 13").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;	
        supplier_start_date = supplier_start_dateGet!=undefined?new Date(supplier_start_dateGet):supplier_start_date;
        
      //   let rfp_clarification_period_endGet = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 2").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;	
      //   rfp_clarification_period_end = rfp_clarification_period_endGet!=undefined?new Date(rfp_clarification_period_endGet):rfp_clarification_period_end;

      //   let deadline_period_for_clarification_periodGet = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 3").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;	
      //   deadline_period_for_clarification_period = deadline_period_for_clarification_periodGet!=undefined?new Date(deadline_period_for_clarification_periodGet):deadline_period_for_clarification_period;


      //   let supplier_period_for_clarification_periodGet = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 4").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;	
      //   supplier_period_for_clarification_period = supplier_period_for_clarification_periodGet!=undefined?new Date(supplier_period_for_clarification_periodGet):supplier_period_for_clarification_period;


      //   let supplier_dealine_for_clarification_periodGet = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 5").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;	
      //   supplier_dealine_for_clarification_period = supplier_dealine_for_clarification_periodGet!=undefined?new Date(supplier_dealine_for_clarification_periodGet):supplier_dealine_for_clarification_period;

      //   let deadline_for_submission_of_stage_oneGet = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 6").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;	
      //   deadline_for_submission_of_stage_one = deadline_for_submission_of_stage_oneGet!=undefined?new Date(deadline_for_submission_of_stage_oneGet):deadline_for_submission_of_stage_one;


      //   let evaluation_process_start_dateGet = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 7").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;	
      //   evaluation_process_start_date = evaluation_process_start_dateGet!=undefined?new Date(evaluation_process_start_dateGet):evaluation_process_start_date;

      //   let bidder_presentations_dateGet = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 8").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;	

      //   bidder_presentations_date = bidder_presentations_dateGet!=undefined?new Date(bidder_presentations_dateGet):bidder_presentations_date;

      //   let standstill_period_starts_dateGet = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 9").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;	
      //   standstill_period_starts_date = standstill_period_starts_dateGet!=undefined?new Date(standstill_period_starts_dateGet):standstill_period_starts_date;

      //   let proposed_award_dateGet = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 10").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;	
      //   proposed_award_date = proposed_award_dateGet!=undefined?new Date(proposed_award_dateGet):proposed_award_date;

      //   let expected_signature_dateGet = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 11").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;	
      // // console.log("asss",new Date(expected_signature_dateGet));

      //   expected_signature_date = expected_signature_dateGet!=undefined?new Date(expected_signature_dateGet):expected_signature_date;
      // //  expected_signature_date=new Date(expected_signature_dateNew);

      //   let contract_signed_dateGet = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 12").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;	

      //   contract_signed_date = contract_signed_dateGet!=undefined?new Date(contract_signed_dateGet):contract_signed_date;

      //   let supplier_start_dateGet = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 13").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;	
      //   supplier_start_date = supplier_start_dateGet!=undefined?new Date(supplier_start_dateGet):supplier_start_date;

      }

      const agreementName = req.session.agreementName;
      const lotid = req.session?.lotId;
      
      const agreementLotName = req.session.agreementLotName;
      const project_name = req.session.project_name;
    
      res.locals.agreement_header = { agreementName, project_name, projectId, agreementId_session, agreementLotName, lotid };
    let forceChangeDataJson;
    if(agreementId_session == 'RM6187') { //MCF3
      forceChangeDataJson = Mcf3cmsData;
    }
    else if(agreementId_session == 'RM1557.13') { //Gcloud
      forceChangeDataJson = GCloudData;
    }
    else if(agreementId_session == 'RM1043.8') {  //DOS
      forceChangeDataJson = DOScmsData;
      if(stage2_value !== undefined && stage2_value === "Stage 2"){
        forceChangeDataJson = DOS2cmsData;
      }
    }else { 
      forceChangeDataJson = cmsData;
    }    
      let appendData = {
        data: forceChangeDataJson,
        lotId:lotid,
        stage2_value,
        prompt: prompt,
        framework: fetchQuestionsData,
        rfp_clarification_date,
        rfp_clarification_period_end: moment(
          rfp_clarification_period_end,
          'DD/MM/YYYY, HH:mm',
        ).format('DD MMMM YYYY, HH:mm') ,
        deadline_period_for_clarification_period: moment(
          deadline_period_for_clarification_period,
          'DD/MM/YYYY, HH:mm',
        ).format('DD MMMM YYYY, HH:mm'),
        supplier_period_for_clarification_period: moment(
          supplier_period_for_clarification_period,
          'DD/MM/YYYY, HH:mm',
        ).format('DD MMMM YYYY, HH:mm'),
        supplier_dealine_for_clarification_period: moment(
          supplier_dealine_for_clarification_period,
          'DD/MM/YYYY, HH:mm',
        ).format('DD MMMM YYYY, HH:mm'),
        deadline_for_submission_of_stage_one: moment(deadline_for_submission_of_stage_one, 'DD/MM/YYYY, HH:mm').format(
          'DD MMMM YYYY, HH:mm',
        ),
        evaluation_process_start_date: moment(evaluation_process_start_date, 'DD/MM/YYYY, HH:mm').format(
          'DD MMMM YYYY, HH:mm',
        ),
        bidder_presentations_date: moment(bidder_presentations_date, 'DD/MM/YYYY, HH:mm').format(
          'DD MMMM YYYY, HH:mm',
        ),
        standstill_period_starts_date: moment(standstill_period_starts_date, 'DD/MM/YYYY, HH:mm').format(
          'DD MMMM YYYY, HH:mm',
        ),
        proposed_award_date: (agreementId_session == 'RM1043.8') ? moment(proposed_award_date, 'DD/MM/YYYY, hh:mm a').format('DD MMMM YYYY, HH:mm') : moment(proposed_award_date, 'DD/MM/YYYY, HH:mm').format('DD MMMM YYYY, HH:mm'),
        expected_signature_date: (agreementId_session == 'RM1043.8') ? moment(expected_signature_date, 'DD/MM/YYYY, hh:mm a').format('DD MMMM YYYY, HH:mm') : moment(expected_signature_date, 'DD/MM/YYYY, HH:mm').format('DD MMMM YYYY, HH:mm'),
        contract_signed_date: contract_signed_date != undefined && contract_signed_date != null ? moment(contract_signed_date, 'DD/MM/YYYY, hh:mm a').format('DD MMMM YYYY, HH:mm') : null,
        supplier_start_date: supplier_start_date != undefined && supplier_start_date != null ? moment(supplier_start_date, 'DD/MM/YYYY, hh:mm a').format('DD MMMM YYYY, HH:mm') : null,
        releatedContent: req.session.releatedContent,
        selectedeventtype,
        agreementId_session
      };
      
      if (errorTriggered) {
        appendData = { ...appendData, error: true, errorMessage: errorItem,selectedeventtype };
      } else {
        req.session.timeline = {};
        if(agreementId_session == 'RM1043.8' && stage2_value !== undefined && stage2_value === "Stage 2"){
          req.session.timeline.publish = rfp_clarification_date;
        }else{
          req.session.timeline.publish = publishDateNew;
         // req.session.timeline.publish = new Date();
        }

        

        // let newClarificationPeriodEnd = moment(rfp_clarification_period_end, 'DD/MM/YYYY, HH:mm').format('DD MMMM YYYY, HH:mm');
        // let newPublishResponsesClarificationQuestions = moment(deadline_period_for_clarification_period, 'DD/MM/YYYY, HH:mm').format('DD MMMM YYYY, HH:mm');
        // let newSupplierSubmitResponse = moment(supplier_period_for_clarification_period, 'DD/MM/YYYY, HH:mm').format('DD MMMM YYYY, HH:mm');
        // let newConfirmNextStepsSuppliers = moment(supplier_dealine_for_clarification_period, 'DD/MM/YYYY, HH:mm').format('DD MMMM YYYY, HH:mm');
        // //
        
        // let newDeadlineForSubmissionOfStageOne = (agreementId_session == 'RM1043.8') ? moment(deadline_for_submission_of_stage_one, 'DD/MM/YYYY, hh:mm a').format('DD MMMM YYYY, HH:mm') : moment(deadline_for_submission_of_stage_one, 'DD/MM/YYYY, HH:mm').format('DD MMMM YYYY, HH:mm');
        // let newEvaluationProcessStartDate = (agreementId_session == 'RM1043.8') ? moment(evaluation_process_start_date, 'DD/MM/YYYY, hh:mm a').format('DD MMMM YYYY, HH:mm') : moment(evaluation_process_start_date, 'DD/MM/YYYY, HH:mm').format('DD MMMM YYYY, HH:mm');
        // let newBidderPresentationsDate = (agreementId_session == 'RM1043.8') ? moment(bidder_presentations_date, 'DD/MM/YYYY, hh:mm a').format('DD MMMM YYYY, HH:mm') : moment(bidder_presentations_date, 'DD/MM/YYYY, HH:mm').format('DD MMMM YYYY, HH:mm');
        // let newStandstillPeriodStartsDate = (agreementId_session == 'RM1043.8') ? moment(standstill_period_starts_date, 'DD/MM/YYYY, hh:mm a').format('DD MMMM YYYY, HH:mm') : moment(standstill_period_starts_date, 'DD/MM/YYYY, HH:mm').format('DD MMMM YYYY, HH:mm');
        // let newProposedAwardDate = (agreementId_session == 'RM1043.8') ? moment(proposed_award_date, 'DD/MM/YYYY, hh:mm a').format('DD MMMM YYYY, HH:mm') : moment(proposed_award_date, 'DD/MM/YYYY, HH:mm').format('DD MMMM YYYY, HH:mm');
        // let newExpectedSignatureDate = (agreementId_session == 'RM1043.8') ? moment(expected_signature_date, 'DD/MM/YYYY, hh:mm a').format('DD MMMM YYYY, HH:mm') : moment(expected_signature_date, 'DD/MM/YYYY, HH:mm').format('DD MMMM YYYY, HH:mm');
        // //DOS
        // let newContractsigneddate = contract_signed_date != undefined && contract_signed_date != null ? moment(contract_signed_date, 'DD/MM/YYYY, hh:mm a').format('DD MMMM YYYY, HH:mm') : null;
        // let newSupplierstartdate = supplier_start_date != undefined && supplier_start_date != null ? moment(supplier_start_date, 'DD/MM/YYYY, hh:mm a').format('DD MMMM YYYY, HH:mm') : null;
        
        //LOOP STARTTTTTTTTT
       

     
        req.session.timeline.clarificationPeriodEnd = moment(rfp_clarification_period_end, 'DD/MM/YYYY, HH:mm').format('DD MMMM YYYY, HH:mm');
        req.session.timeline.publishResponsesClarificationQuestions = moment(deadline_period_for_clarification_period, 'DD/MM/YYYY, HH:mm').format('DD MMMM YYYY, HH:mm');
        req.session.timeline.supplierSubmitResponse = moment(supplier_period_for_clarification_period, 'DD/MM/YYYY, HH:mm').format('DD MMMM YYYY, HH:mm');
        req.session.timeline.confirmNextStepsSuppliers = moment(supplier_dealine_for_clarification_period, 'DD/MM/YYYY, HH:mm').format('DD MMMM YYYY, HH:mm');
        //
        
        req.session.timeline.deadlineForSubmissionOfStageOne = (agreementId_session == 'RM1043.8') ? moment(deadline_for_submission_of_stage_one, 'DD/MM/YYYY, hh:mm a').format('DD MMMM YYYY, HH:mm') : moment(deadline_for_submission_of_stage_one, 'DD/MM/YYYY, HH:mm').format('DD MMMM YYYY, HH:mm');
        req.session.timeline.evaluationProcessStartDate = (agreementId_session == 'RM1043.8') ? moment(evaluation_process_start_date, 'DD/MM/YYYY, hh:mm a').format('DD MMMM YYYY, HH:mm') : moment(evaluation_process_start_date, 'DD/MM/YYYY, HH:mm').format('DD MMMM YYYY, HH:mm');
        req.session.timeline.bidderPresentationsDate = (agreementId_session == 'RM1043.8') ? moment(bidder_presentations_date, 'DD/MM/YYYY, hh:mm a').format('DD MMMM YYYY, HH:mm') : moment(bidder_presentations_date, 'DD/MM/YYYY, HH:mm').format('DD MMMM YYYY, HH:mm');
        req.session.timeline.standstillPeriodStartsDate = (agreementId_session == 'RM1043.8') ? moment(standstill_period_starts_date, 'DD/MM/YYYY, hh:mm a').format('DD MMMM YYYY, HH:mm') : moment(standstill_period_starts_date, 'DD/MM/YYYY, HH:mm').format('DD MMMM YYYY, HH:mm');
        req.session.timeline.proposedAwardDate = (agreementId_session == 'RM1043.8') ? moment(proposed_award_date, 'DD/MM/YYYY, hh:mm a').format('DD MMMM YYYY, HH:mm') : moment(proposed_award_date, 'DD/MM/YYYY, HH:mm').format('DD MMMM YYYY, HH:mm');
        
        req.session.timeline.expectedSignatureDate = (agreementId_session == 'RM1043.8') ? moment(expected_signature_date, 'DD/MM/YYYY, hh:mm a').format('DD MMMM YYYY, HH:mm') : moment(expected_signature_date, 'DD/MM/YYYY, HH:mm').format('DD MMMM YYYY, HH:mm');
        //DOS
        req.session.timeline.contractsigneddate = contract_signed_date != undefined && contract_signed_date != null ? moment(contract_signed_date, 'DD/MM/YYYY, hh:mm a').format('DD MMMM YYYY, HH:mm') : null;
        req.session.timeline.supplierstartdate = supplier_start_date != undefined && supplier_start_date != null ? moment(supplier_start_date, 'DD/MM/YYYY, hh:mm a').format('DD MMMM YYYY, HH:mm') : null;

     }

    
     //CAS-INFO-LOG
     LoggTracer.infoLogger(null, logConstant.setYourTimeLinePage, req);
     //CAS-32
    if(req.session.isTimelineRevert) {
      let arrOfCurrentTimeline = [];
      arrOfCurrentTimeline.push(
        `Question 1*${appendData.rfp_clarification_date}`,
        `Question 2*${appendData.rfp_clarification_period_end}`,
        `Question 3*${appendData.deadline_period_for_clarification_period}`,
        `Question 4*${appendData.supplier_period_for_clarification_period}`,
        `Question 5*${appendData.supplier_dealine_for_clarification_period}`,
        `Question 6*${appendData.deadline_for_submission_of_stage_one}`,
        `Question 7*${appendData.evaluation_process_start_date}`,
        `Question 8*${appendData.bidder_presentations_date}`,
        `Question 9*${appendData.standstill_period_starts_date}`,
        `Question 10*${appendData.proposed_award_date}`,
        `Question 11*${appendData.expected_signature_date}`,
        `Question 12*${appendData.contract_signed_date}`,
        `Question 13*${appendData.supplier_start_date}`
      );
      
      await timelineForcePostForPublish(req, res, arrOfCurrentTimeline);
      res.redirect('/rfp/response-date');
      } else {
        res.render('rfp-responsedate.njk', appendData);
      }
    }
    else if(req.session.questionID=='Question 2'){ 
      rfp_clarification_date =req.session.rfppublishdate;
       //  rfp_clarification_date =moment(req.session.rfppublishdate,'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY');
        // let rfp_clarification_period_end =req.session.UIDate;

        // let deadline_period_for_clarification_period = moment(req.session.deadlinepublishresponse, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
        // let supplier_period_for_clarification_period = moment(req.session.supplierresponse, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
        // let  supplier_dealine_for_clarification_period = moment(req.session.nextsupplier, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
        // let deadline_for_submission_of_stage_one = moment(req.session.deadlinestageone, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
        // let evaluation_process_start_date = moment(req.session.processstart, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
        // let bidder_presentations_date = moment(req.session.bidder, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
        // let standstill_period_starts_date = moment(req.session.standstill, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
        // let proposed_award_date = moment(req.session.awarddate, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
        // let expected_signature_date = moment(req.session.signaturedate, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
       // let rfp_clarification_date =req.session.rfppublishdate;
        let rfp_clarification_period_end =req.session.UIDate;
          
          let deadline_period_for_clarification_period = req.session.deadlinepublishresponse;
         let supplier_period_for_clarification_period = req.session.supplierresponse;
          let  supplier_dealine_for_clarification_period = req.session.nextsupplier
          let deadline_for_submission_of_stage_one = req.session.deadlinestageone
          let evaluation_process_start_date = req.session.processstart
           let bidder_presentations_date = req.session.bidder;
           let standstill_period_starts_date = req.session.standstill;
            let proposed_award_date = req.session.awarddate;
           let expected_signature_date = req.session.signaturedate;
           let contract_signed_date;
           let supplier_start_date;
           if (req.session.agreement_id=='RM1043.8') { //DOS
            contract_signed_date= req.session.signeddate;
            supplier_start_date= req.session.startdate;
           }
           

      fetchQuestionsData = fetchQuestionsData.sort((current_element, next_element) => {
        const currentElementID = Number(current_element.OCDS.id.split('Question ').join(''));
        const nextElementID = Number(next_element.OCDS.id.split('Question ').join(''));
        return currentElementID - nextElementID;
      });

      for(var i=0;i<fetchQuestionsData.length;i++){
        if(fetchQuestionsData[i].nonOCDS.options.length>0){
       
        let value=fetchQuestionsData[i].nonOCDS.options[0].value;
          
        if(i==0){
          fetchQuestionsData[i].nonOCDS.options[0].value=moment(value,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY');
        }
        else
        {
        fetchQuestionsData[i].nonOCDS.options[0].value=moment(value,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY, HH:mm');
        }
        
       // fetchQuestionsData[i].nonOCDS.options[0].value = moment(value,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY, HH:mm');
      }
      }

      const agreementName = req.session.agreementName;
      const lotid = req.session?.lotId;
      const agreementId_session = req.session.agreement_id;
      const agreementLotName = req.session.agreementLotName;
      const project_name = req.session.project_name;

      res.locals.agreement_header = { agreementName, project_name, projectId, agreementId_session, agreementLotName, lotid };

      let forceChangeDataJson;
    if(agreementId_session == 'RM6187') { //MCF3
      forceChangeDataJson = Mcf3cmsData;
    } else if(agreementId_session == 'RM1557.13') { //Gcloud
      forceChangeDataJson = GCloudData;
    }else if(agreementId_session == 'RM1043.8') {  //DOS
      forceChangeDataJson = DOScmsData;
      if(stage2_value !== undefined && stage2_value === "Stage 2"){
        forceChangeDataJson = DOS2cmsData;
      }
    }else { 
      forceChangeDataJson = cmsData;
    }

      let appendData = {
        data: forceChangeDataJson,
        lotid:lotid,
        prompt: prompt,
        framework: fetchQuestionsData,
        rfp_clarification_date,
        rfp_clarification_period_end,
        deadline_period_for_clarification_period,
        supplier_period_for_clarification_period,
        supplier_dealine_for_clarification_period,
        deadline_for_submission_of_stage_one,
        evaluation_process_start_date,
        bidder_presentations_date,
        standstill_period_starts_date,
        proposed_award_date,
        expected_signature_date,
        contract_signed_date,
        supplier_start_date,
        releatedContent: req.session.releatedContent,
        selectedeventtype,
        agreementId_session
      };
      if (errorTriggered) {
        appendData = { ...appendData, error: true, errorMessage: errorItem,selectedeventtype };
      } else {
        req.session.timeline.clarificationPeriodEnd = rfp_clarification_period_end;
      }
      //CAS-INFO-LOG
     LoggTracer.infoLogger(null, logConstant.setYourTimeLinePage, req);

      res.render('rfp-responsedate.njk', appendData);
    }
    else if(req.session.questionID=='Question 3'){
    
    let deadline_period_for_clarification_period = req.session.UIDate;
    rfp_clarification_date =req.session.rfppublishdate;  
    // rfp_clarification_date =moment(req.session.rfppublishdate,'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY');
      // rfp_clarification_period_end =moment(req.session.clarificationend,'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
        
      //   //let deadline_period_for_clarification_period = moment(req.session.deadlinepublishresponse, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let deadline_period_for_clarification_period = req.session.UIDate;
      //    let supplier_period_for_clarification_period = moment(req.session.supplierresponse, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let  supplier_dealine_for_clarification_period = moment(req.session.nextsupplier, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let deadline_for_submission_of_stage_one = moment(req.session.deadlinestageone, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let evaluation_process_start_date = moment(req.session.processstart, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let bidder_presentations_date = moment(req.session.bidder, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let standstill_period_starts_date = moment(req.session.standstill, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let proposed_award_date = moment(req.session.awarddate, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let expected_signature_date = moment(req.session.signaturedate, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
     
      //let rfp_clarification_date =req.session.rfppublishdate;
      let rfp_clarification_period_end =req.session.clarificationend;
        
       // let deadline_period_for_clarification_period = req.session.deadlinepublishresponse;
       let supplier_period_for_clarification_period = req.session.supplierresponse;
        let  supplier_dealine_for_clarification_period = req.session.nextsupplier
        let deadline_for_submission_of_stage_one = req.session.deadlinestageone
        let evaluation_process_start_date = req.session.processstart
         let bidder_presentations_date = req.session.bidder;
         let standstill_period_starts_date = req.session.standstill;
          let proposed_award_date = req.session.awarddate;
         let expected_signature_date = req.session.signaturedate;
         let contract_signed_date;
           let supplier_start_date;
           if (req.session.agreement_id=='RM1043.8') { //DOS
            contract_signed_date= req.session.signeddate;
            supplier_start_date= req.session.startdate;
           }
        
fetchQuestionsData = fetchQuestionsData.sort((current_element, next_element) => {
  const currentElementID = Number(current_element.OCDS.id.split('Question ').join(''));
  const nextElementID = Number(next_element.OCDS.id.split('Question ').join(''));
  return currentElementID - nextElementID;
});

for(var i=0;i<fetchQuestionsData.length;i++){
  if(fetchQuestionsData[i].nonOCDS.options.length>0){
  
  let value=fetchQuestionsData[i].nonOCDS.options[0].value;
    
  if(i==0){
    fetchQuestionsData[i].nonOCDS.options[0].value=moment(value,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY');
  }
  else
  {
  fetchQuestionsData[i].nonOCDS.options[0].value=moment(value,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY, HH:mm');
  }
  
 // fetchQuestionsData[i].nonOCDS.options[0].value = moment(value,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY, HH:mm');
}
}

const agreementName = req.session.agreementName;
const lotid = req.session?.lotId;
const agreementId_session = req.session.agreement_id;
const agreementLotName = req.session.agreementLotName;
const project_name = req.session.project_name;
res.locals.agreement_header = { agreementName, project_name, projectId, agreementId_session, agreementLotName, lotid };

let forceChangeDataJson;
    if(agreementId_session == 'RM6187') { //MCF3
      forceChangeDataJson = Mcf3cmsData;
    }else if(agreementId_session == 'RM1557.13') { //Gcloud
      forceChangeDataJson = GCloudData;
    } else if(agreementId_session == 'RM1043.8') {  //DOS
      forceChangeDataJson = DOScmsData;
      if(stage2_value !== undefined && stage2_value === "Stage 2"){
        forceChangeDataJson = DOS2cmsData;
      }
    }else { 
      forceChangeDataJson = cmsData;
    }
let appendData = {
  data: forceChangeDataJson,
  lotid:lotid,
  prompt: prompt,
  framework: fetchQuestionsData,
  rfp_clarification_date,
        rfp_clarification_period_end,
        deadline_period_for_clarification_period,
        supplier_period_for_clarification_period,
        supplier_dealine_for_clarification_period,
        deadline_for_submission_of_stage_one,
        evaluation_process_start_date,
        bidder_presentations_date,
        standstill_period_starts_date,
        proposed_award_date,
        expected_signature_date,
        contract_signed_date,
        supplier_start_date,
        releatedContent: req.session.releatedContent,
        selectedeventtype,
        agreementId_session
};
if (errorTriggered) {
  appendData = { ...appendData, error: true, errorMessage: errorItem,selectedeventtype };
} else {
  req.session.timeline.publishResponsesClarificationQuestions = deadline_period_for_clarification_period;
}

//CAS-INFO-LOG
LoggTracer.infoLogger(null, logConstant.setYourTimeLinePage, req);

res.render('rfp-responsedate.njk', appendData);
    }
    else if(req.session.questionID=='Question 4'){

    let supplier_period_for_clarification_period=req.session.UIDate;
    rfp_clarification_date =req.session.rfppublishdate;
   //  rfp_clarification_date =moment(req.session.rfppublishdate,'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY');
    // rfp_clarification_period_end =moment(req.session.clarificationend,'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      
    //   let deadline_period_for_clarification_period = moment(req.session.deadlinepublishresponse, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
    //   // let supplier_period_for_clarification_period = moment(req.session.supplierresponse, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
    //   let  supplier_dealine_for_clarification_period = moment(req.session.nextsupplier, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
    //   let deadline_for_submission_of_stage_one = moment(req.session.deadlinestageone, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
    //   let evaluation_process_start_date = moment(req.session.processstart, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
    //   let bidder_presentations_date = moment(req.session.bidder, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
    //   let standstill_period_starts_date = moment(req.session.standstill, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
    //   let proposed_award_date = moment(req.session.awarddate, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
    //   let expected_signature_date = moment(req.session.signaturedate, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
   
   // let rfp_clarification_date =req.session.rfppublishdate;
    let rfp_clarification_period_end =req.session.clarificationend;
      
      let deadline_period_for_clarification_period = req.session.deadlinepublishresponse;
     //let supplier_period_for_clarification_period = req.session.supplierresponse;
      let  supplier_dealine_for_clarification_period = req.session.nextsupplier
      let deadline_for_submission_of_stage_one = req.session.deadlinestageone
      let evaluation_process_start_date = req.session.processstart
       let bidder_presentations_date = req.session.bidder;
       let standstill_period_starts_date = req.session.standstill;
        let proposed_award_date = req.session.awarddate;
       let expected_signature_date = req.session.signaturedate;
       let contract_signed_date;
           let supplier_start_date;
           if (req.session.agreement_id=='RM1043.8') { //DOS
            contract_signed_date= req.session.signeddate;
            supplier_start_date= req.session.startdate;
           }

    
fetchQuestionsData = fetchQuestionsData.sort((current_element, next_element) => {
  const currentElementID = Number(current_element.OCDS.id.split('Question ').join(''));
  const nextElementID = Number(next_element.OCDS.id.split('Question ').join(''));
  return currentElementID - nextElementID;
});


for(var i=0;i<fetchQuestionsData.length;i++){
  if(fetchQuestionsData[i].nonOCDS.options.length>0){
  
  let value=fetchQuestionsData[i].nonOCDS.options[0].value;
    
  if(i==0){
    fetchQuestionsData[i].nonOCDS.options[0].value=moment(value,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY');
  }
  else
  {
  fetchQuestionsData[i].nonOCDS.options[0].value=moment(value,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY, HH:mm');
  }
  
 // fetchQuestionsData[i].nonOCDS.options[0].value = moment(value,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY, HH:mm');
}
}

const agreementName = req.session.agreementName;
const lotid = req.session?.lotId;
const agreementId_session = req.session.agreement_id;
const agreementLotName = req.session.agreementLotName;
const project_name = req.session.project_name;
res.locals.agreement_header = { agreementName, project_name, projectId, agreementId_session, agreementLotName, lotid };
let forceChangeDataJson;
    if(agreementId_session == 'RM6187') { //MCF3
      forceChangeDataJson = Mcf3cmsData;
    }else if(agreementId_session == 'RM1557.13') { //Gcloud
      forceChangeDataJson = GCloudData;
    } else if(agreementId_session == 'RM1043.8') {  //DOS
      forceChangeDataJson = DOScmsData;
    }else { 
      if(stage2_value !== undefined && stage2_value === "Stage 2"){
        forceChangeDataJson = DOS2cmsData;
      }
      forceChangeDataJson = cmsData;
    }
let appendData = {
  data: forceChangeDataJson,
  lotid:lotid,
  prompt: prompt,
  framework: fetchQuestionsData,
  rfp_clarification_date,
        rfp_clarification_period_end,
        deadline_period_for_clarification_period,
        supplier_period_for_clarification_period,
        supplier_dealine_for_clarification_period,
        deadline_for_submission_of_stage_one,
        evaluation_process_start_date,
        bidder_presentations_date,
        standstill_period_starts_date,
        proposed_award_date,
        expected_signature_date,
        contract_signed_date,
        supplier_start_date,
        releatedContent: req.session.releatedContent,
        selectedeventtype,
        agreementId_session
};
if (errorTriggered) {
  appendData = { ...appendData, error: true, errorMessage: errorItem,selectedeventtype };
} else {
 
  req.session.timeline.supplierSubmitResponse = supplier_period_for_clarification_period;
 
}

//CAS-INFO-LOG
LoggTracer.infoLogger(null, logConstant.setYourTimeLinePage, req);

res.render('rfp-responsedate.njk', appendData);
          }
    else if(req.session.questionID=='Question 5'){
      let supplier_dealine_for_clarification_period=req.session.UIDate;
      // rfp_clarification_date =moment(req.session.rfppublishdate,'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY');
      rfp_clarification_date =req.session.rfppublishdate;
      // rfp_clarification_period_end =moment(req.session.clarificationend,'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
        
      //   let deadline_period_for_clarification_period = moment(req.session.deadlinepublishresponse, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //  let supplier_period_for_clarification_period = moment(req.session.supplierresponse, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   //let  supplier_dealine_for_clarification_period = moment(req.session.nextsupplier, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let deadline_for_submission_of_stage_one = moment(req.session.deadlinestageone, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let evaluation_process_start_date = moment(req.session.processstart, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let bidder_presentations_date = moment(req.session.bidder, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let standstill_period_starts_date = moment(req.session.standstill, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let proposed_award_date = moment(req.session.awarddate, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let expected_signature_date = moment(req.session.signaturedate, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
     
      //let rfp_clarification_date =req.session.rfppublishdate;
      let rfp_clarification_period_end =req.session.clarificationend;
        
        let deadline_period_for_clarification_period = req.session.deadlinepublishresponse;
       let supplier_period_for_clarification_period = req.session.supplierresponse;
        //let  supplier_dealine_for_clarification_period = req.session.nextsupplier
        let deadline_for_submission_of_stage_one = req.session.deadlinestageone
        let evaluation_process_start_date = req.session.processstart
         let bidder_presentations_date = req.session.bidder;
         let standstill_period_starts_date = req.session.standstill;
          let proposed_award_date = req.session.awarddate;
         let expected_signature_date = req.session.signaturedate;
         let contract_signed_date;
           let supplier_start_date;
           if (req.session.agreement_id=='RM1043.8') { //DOS
            contract_signed_date= req.session.signeddate;
            supplier_start_date= req.session.startdate;
           }
  
fetchQuestionsData = fetchQuestionsData.sort((current_element, next_element) => {
  const currentElementID = Number(current_element.OCDS.id.split('Question ').join(''));
  const nextElementID = Number(next_element.OCDS.id.split('Question ').join(''));
  return currentElementID - nextElementID;
});

for(var i=0;i<fetchQuestionsData.length;i++){
  if(fetchQuestionsData[i].nonOCDS.options.length>0){
  
  let value=fetchQuestionsData[i].nonOCDS.options[0].value;
    
  if(i==0){
    fetchQuestionsData[i].nonOCDS.options[0].value=moment(value,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY');
  }
  else
  {
  fetchQuestionsData[i].nonOCDS.options[0].value=moment(value,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY, HH:mm');
  }
  
 // fetchQuestionsData[i].nonOCDS.options[0].value = moment(value,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY, HH:mm');
}
}

const agreementName = req.session.agreementName;
const lotid = req.session?.lotId;
const agreementId_session = req.session.agreement_id;
const agreementLotName = req.session.agreementLotName;
const project_name = req.session.project_name;
res.locals.agreement_header = { agreementName, project_name, projectId, agreementId_session, agreementLotName, lotid };
let forceChangeDataJson;
    if(agreementId_session == 'RM6187') { //MCF3
      forceChangeDataJson = Mcf3cmsData;
    }else if(agreementId_session == 'RM1557.13') { //Gcloud
      forceChangeDataJson = GCloudData;
    } else if(agreementId_session == 'RM1043.8') {  //DOS
      forceChangeDataJson = DOScmsData;
      if(stage2_value !== undefined && stage2_value === "Stage 2"){
        forceChangeDataJson = DOS2cmsData;
      }
    }else { 
      forceChangeDataJson = cmsData;
    }
let appendData = {
  data: forceChangeDataJson,
  lotid:lotid,
  prompt: prompt,
  framework: fetchQuestionsData,
  rfp_clarification_date,
        rfp_clarification_period_end,
        deadline_period_for_clarification_period,
        supplier_period_for_clarification_period,
        supplier_dealine_for_clarification_period,
        deadline_for_submission_of_stage_one,
        evaluation_process_start_date,
        bidder_presentations_date,
        standstill_period_starts_date,
        proposed_award_date,
        expected_signature_date,
        contract_signed_date,
        supplier_start_date,
        releatedContent: req.session.releatedContent,selectedeventtype,
        agreementId_session
};
if (errorTriggered) {
  appendData = { ...appendData, error: true, errorMessage: errorItem,selectedeventtype };
} else {
 
  req.session.timeline.confirmNextStepsSuppliers = supplier_dealine_for_clarification_period;
 
}

//CAS-INFO-LOG
LoggTracer.infoLogger(null, logConstant.setYourTimeLinePage, req);
res.render('rfp-responsedate.njk', appendData);
      
    }
    else if(req.session.questionID=='Question 6'){
      let deadline_for_submission_of_stage_one=req.session.UIDate;
      rfp_clarification_date =req.session.rfppublishdate; 
      //rfp_clarification_date =moment(req.session.rfppublishdate,'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY');
      // rfp_clarification_period_end =moment(req.session.clarificationend,'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
        
      //   let deadline_period_for_clarification_period = moment(req.session.deadlinepublishresponse, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //  let supplier_period_for_clarification_period = moment(req.session.supplierresponse, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let  supplier_dealine_for_clarification_period = moment(req.session.nextsupplier, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   //let deadline_for_submission_of_stage_one = moment(req.session.deadlinestageone, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let evaluation_process_start_date = moment(req.session.processstart, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let bidder_presentations_date = moment(req.session.bidder, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let standstill_period_starts_date = moment(req.session.standstill, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let proposed_award_date = moment(req.session.awarddate, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let expected_signature_date = moment(req.session.signaturedate, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
     
      //let rfp_clarification_date =req.session.rfppublishdate;
      let rfp_clarification_period_end =req.session.clarificationend;
        
        let deadline_period_for_clarification_period = req.session.deadlinepublishresponse;
       let supplier_period_for_clarification_period = req.session.supplierresponse;
        let  supplier_dealine_for_clarification_period = req.session.nextsupplier
        //let deadline_for_submission_of_stage_one = req.session.deadlinestageone
        let evaluation_process_start_date = req.session.processstart
         let bidder_presentations_date = req.session.bidder;
         let standstill_period_starts_date = req.session.standstill;
          let proposed_award_date = req.session.awarddate;
         let expected_signature_date = req.session.signaturedate;
         let contract_signed_date;
           let supplier_start_date;
           if (req.session.agreement_id=='RM1043.8') { //DOS
            contract_signed_date= req.session.signeddate;
            supplier_start_date= req.session.startdate;
           }

     fetchQuestionsData = fetchQuestionsData.sort((current_element, next_element) => {
       const currentElementID = Number(current_element.OCDS.id.split('Question ').join(''));
       const nextElementID = Number(next_element.OCDS.id.split('Question ').join(''));
       return currentElementID - nextElementID;
     });

     for(var i=0;i<fetchQuestionsData.length;i++){
      if(fetchQuestionsData[i].nonOCDS.options.length>0){
     
      let value=fetchQuestionsData[i].nonOCDS.options[0].value;
        
      if(i==0){
        fetchQuestionsData[i].nonOCDS.options[0].value=moment(value,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY');
      }
      else
      {
      fetchQuestionsData[i].nonOCDS.options[0].value=moment(value,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY, HH:mm');
      }
      
     // fetchQuestionsData[i].nonOCDS.options[0].value = moment(value,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY, HH:mm');
    }
    }

     const agreementName = req.session.agreementName;
     const lotid = req.session?.lotId;
     const agreementId_session = req.session.agreement_id;
     const agreementLotName = req.session.agreementLotName;
     const project_name = req.session.project_name;
     res.locals.agreement_header = { agreementName, project_name, projectId, agreementId_session, agreementLotName, lotid };
     let forceChangeDataJson;
    if(agreementId_session == 'RM6187') { //MCF3
      forceChangeDataJson = Mcf3cmsData;
    }else if(agreementId_session == 'RM1557.13') { //Gcloud
      forceChangeDataJson = GCloudData;
    } else if(agreementId_session == 'RM1043.8') {  //DOS
      forceChangeDataJson = DOScmsData;
      if(stage2_value !== undefined && stage2_value === "Stage 2"){
        forceChangeDataJson = DOS2cmsData;
      }
    }else { 
      forceChangeDataJson = cmsData;
    }
let appendData = {
  data: forceChangeDataJson,
  lotid:lotid,
      prompt: prompt,
      framework: fetchQuestionsData,
      rfp_clarification_date,
            rfp_clarification_period_end,
            deadline_period_for_clarification_period,
            supplier_period_for_clarification_period,
            supplier_dealine_for_clarification_period,
            deadline_for_submission_of_stage_one,
            evaluation_process_start_date,
            bidder_presentations_date,
            standstill_period_starts_date,
            proposed_award_date,
            expected_signature_date,
            contract_signed_date,
            supplier_start_date,
            releatedContent: req.session.releatedContent
            ,selectedeventtype,
            agreementId_session
    };
     if (errorTriggered) {
       appendData = { ...appendData, error: true, errorMessage: errorItem,selectedeventtype };
     } else {
      
       req.session.timeline.deadlineForSubmissionOfStageOne = deadline_for_submission_of_stage_one;
       
     }
     
     //CAS-INFO-LOG
     LoggTracer.infoLogger(null, logConstant.setYourTimeLinePage, req);

     res.render('rfp-responsedate.njk', appendData);

    }
    else if(req.session.questionID=='Question 7'){
      let evaluation_process_start_date=req.session.UIDate;
      rfp_clarification_date =req.session.rfppublishdate; 
      //rfp_clarification_date =moment(req.session.rfppublishdate,'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY');
      // rfp_clarification_period_end =moment(req.session.clarificationend,'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
        
      //   let deadline_period_for_clarification_period = moment(req.session.deadlinepublishresponse, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //  let supplier_period_for_clarification_period = moment(req.session.supplierresponse, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let  supplier_dealine_for_clarification_period = moment(req.session.nextsupplier, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let deadline_for_submission_of_stage_one = moment(req.session.deadlinestageone, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   // let evaluation_process_start_date = moment(req.session.processstart, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let bidder_presentations_date = moment(req.session.bidder, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let standstill_period_starts_date = moment(req.session.standstill, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let proposed_award_date = moment(req.session.awarddate, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let expected_signature_date = moment(req.session.signaturedate, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
     
     // let rfp_clarification_date =req.session.rfppublishdate;
      let rfp_clarification_period_end =req.session.clarificationend;
        
        let deadline_period_for_clarification_period = req.session.deadlinepublishresponse;
       let supplier_period_for_clarification_period = req.session.supplierresponse;
        let  supplier_dealine_for_clarification_period = req.session.nextsupplier
        let deadline_for_submission_of_stage_one = req.session.deadlinestageone
        //let evaluation_process_start_date = req.session.processstart
         let bidder_presentations_date = req.session.bidder;
         let standstill_period_starts_date = req.session.standstill;
          let proposed_award_date = req.session.awarddate;
         let expected_signature_date = req.session.signaturedate;
         let contract_signed_date;
           let supplier_start_date;
           if (req.session.agreement_id=='RM1043.8') { //DOS
            contract_signed_date= req.session.signeddate;
            supplier_start_date= req.session.startdate;
           }
     
     fetchQuestionsData = fetchQuestionsData.sort((current_element, next_element) => {
       const currentElementID = Number(current_element.OCDS.id.split('Question ').join(''));
       const nextElementID = Number(next_element.OCDS.id.split('Question ').join(''));
       return currentElementID - nextElementID;
     });

     for(var i=0;i<fetchQuestionsData.length;i++){
      if(fetchQuestionsData[i].nonOCDS.options.length>0){
      
      let value=fetchQuestionsData[i].nonOCDS.options[0].value;
        
      if(i==0){
        fetchQuestionsData[i].nonOCDS.options[0].value=moment(value,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY');
      }
      else
      {
      fetchQuestionsData[i].nonOCDS.options[0].value=moment(value,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY, HH:mm');
      }
      
     // fetchQuestionsData[i].nonOCDS.options[0].value = moment(value,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY, HH:mm');
    }
    }

     const agreementName = req.session.agreementName;
     const lotid = req.session?.lotId;
     const agreementId_session = req.session.agreement_id;
     const agreementLotName = req.session.agreementLotName;
     const project_name = req.session.project_name;
     res.locals.agreement_header = { agreementName, project_name, projectId, agreementId_session, agreementLotName, lotid };
     let forceChangeDataJson;
    if(agreementId_session == 'RM6187') { //MCF3
      forceChangeDataJson = Mcf3cmsData;
    }else if(agreementId_session == 'RM1557.13') { //Gcloud
      forceChangeDataJson = GCloudData;
    } else if(agreementId_session == 'RM1043.8') {  //DOS
      forceChangeDataJson = DOScmsData;
      if(stage2_value !== undefined && stage2_value === "Stage 2"){
        forceChangeDataJson = DOS2cmsData;
      }
    }else { 
      forceChangeDataJson = cmsData;
    }
let appendData = {
  data: forceChangeDataJson,
  lotid:lotid,
      prompt: prompt,
      framework: fetchQuestionsData,
      rfp_clarification_date,
            rfp_clarification_period_end,
            deadline_period_for_clarification_period,
            supplier_period_for_clarification_period,
            supplier_dealine_for_clarification_period,
            deadline_for_submission_of_stage_one,
            evaluation_process_start_date,
            bidder_presentations_date,
            standstill_period_starts_date,
            proposed_award_date,
            expected_signature_date,
            contract_signed_date,
            supplier_start_date,
            releatedContent: req.session.releatedContent,
            selectedeventtype,
            agreementId_session
    };
     if (errorTriggered) {
       appendData = { ...appendData, error: true, errorMessage: errorItem,selectedeventtype };
     } else {
       
       req.session.timeline.evaluationProcessStartDate = evaluation_process_start_date;
       
     }
     //CAS-INFO-LOG
     LoggTracer.infoLogger(null, logConstant.setYourTimeLinePage, req);
     res.render('rfp-responsedate.njk', appendData);
    }
    else if(req.session.questionID=='Question 8'){
     
      let bidder_presentations_date=req.session.UIDate;
      rfp_clarification_date =req.session.rfppublishdate;
      // rfp_clarification_date =moment(req.session.rfppublishdate,'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY');
      // rfp_clarification_period_end =moment(req.session.clarificationend,'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
        
      //   let deadline_period_for_clarification_period = moment(req.session.deadlinepublishresponse, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //  let supplier_period_for_clarification_period = moment(req.session.supplierresponse, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let  supplier_dealine_for_clarification_period = moment(req.session.nextsupplier, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let deadline_for_submission_of_stage_one = moment(req.session.deadlinestageone, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let evaluation_process_start_date = moment(req.session.processstart, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   // let bidder_presentations_date = moment(req.session.bidder, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let standstill_period_starts_date = moment(req.session.standstill, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let proposed_award_date = moment(req.session.awarddate, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let expected_signature_date = moment(req.session.signaturedate, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
     
      //let rfp_clarification_date =req.session.rfppublishdate;
      let rfp_clarification_period_end =req.session.clarificationend;
        
        let deadline_period_for_clarification_period = req.session.deadlinepublishresponse;
       let supplier_period_for_clarification_period = req.session.supplierresponse;
        let  supplier_dealine_for_clarification_period = req.session.nextsupplier
        let deadline_for_submission_of_stage_one = req.session.deadlinestageone
        let evaluation_process_start_date = req.session.processstart
         //let bidder_presentations_date = req.session.bidder;
         let standstill_period_starts_date = req.session.standstill;
          let proposed_award_date = req.session.awarddate;
         let expected_signature_date = req.session.signaturedate;
         let contract_signed_date;
           let supplier_start_date;
           if (req.session.agreement_id=='RM1043.8') { //DOS
            contract_signed_date= req.session.signeddate;
            supplier_start_date= req.session.startdate;
           }
     
     fetchQuestionsData = fetchQuestionsData.sort((current_element, next_element) => {
       const currentElementID = Number(current_element.OCDS.id.split('Question ').join(''));
       const nextElementID = Number(next_element.OCDS.id.split('Question ').join(''));
       return currentElementID - nextElementID;
     });

     for(var i=0;i<fetchQuestionsData.length;i++){
      if(fetchQuestionsData[i].nonOCDS.options.length>0){
     
      let value=fetchQuestionsData[i].nonOCDS.options[0].value;
        
      if(i==0){
        fetchQuestionsData[i].nonOCDS.options[0].value=moment(value,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY');
      }
      else
      {
      fetchQuestionsData[i].nonOCDS.options[0].value=moment(value,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY, HH:mm');
      }
      
     // fetchQuestionsData[i].nonOCDS.options[0].value = moment(value,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY, HH:mm');
    }
    }

     const agreementName = req.session.agreementName;
     const lotid = req.session?.lotId;
     const agreementId_session = req.session.agreement_id;
     const agreementLotName = req.session.agreementLotName;
     const project_name = req.session.project_name;
     res.locals.agreement_header = { agreementName, project_name, projectId, agreementId_session, agreementLotName, lotid };
     let forceChangeDataJson;
    if(agreementId_session == 'RM6187') { //MCF3
      forceChangeDataJson = Mcf3cmsData;
    }else if(agreementId_session == 'RM1557.13') { //Gcloud
      forceChangeDataJson = GCloudData;
    } else if(agreementId_session == 'RM1043.8') {  //DOS
      forceChangeDataJson = DOScmsData;
      if(stage2_value !== undefined && stage2_value === "Stage 2"){
        forceChangeDataJson = DOS2cmsData;
      }
    }else { 
      forceChangeDataJson = cmsData;
    }
let appendData = {
  data: forceChangeDataJson,
  lotid:lotid,
      prompt: prompt,
      framework: fetchQuestionsData,
      rfp_clarification_date,
            rfp_clarification_period_end,
            deadline_period_for_clarification_period,
            supplier_period_for_clarification_period,
            supplier_dealine_for_clarification_period,
            deadline_for_submission_of_stage_one,
            evaluation_process_start_date,
            bidder_presentations_date,
            standstill_period_starts_date,
            proposed_award_date,
            expected_signature_date,
            contract_signed_date,
            supplier_start_date,
            releatedContent: req.session.releatedContent,
            selectedeventtype,
            agreementId_session
    };
     if (errorTriggered) {
       appendData = { ...appendData, error: true, errorMessage: errorItem,selectedeventtype };
     } else {
       
       req.session.timeline.bidderPresentationsDate = bidder_presentations_date;
      
     }
     //CAS-INFO-LOG
     LoggTracer.infoLogger(null, logConstant.setYourTimeLinePage, req);
     res.render('rfp-responsedate.njk', appendData);
    }
    else if(req.session.questionID=='Question 9'){
     
      let standstill_period_starts_date=req.session.UIDate;
      rfp_clarification_date =req.session.rfppublishdate; 
      //rfp_clarification_date =moment(req.session.rfppublishdate,'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY');
      // rfp_clarification_period_end =moment(req.session.clarificationend,'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
        
      //   let deadline_period_for_clarification_period = moment(req.session.deadlinepublishresponse, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //  let supplier_period_for_clarification_period = moment(req.session.supplierresponse, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let  supplier_dealine_for_clarification_period = moment(req.session.nextsupplier, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let deadline_for_submission_of_stage_one = moment(req.session.deadlinestageone, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let evaluation_process_start_date = moment(req.session.processstart, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //    let bidder_presentations_date = moment(req.session.bidder, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   // let standstill_period_starts_date = moment(req.session.standstill, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let proposed_award_date = moment(req.session.awarddate, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let expected_signature_date = moment(req.session.signaturedate, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
     
      //let rfp_clarification_date =req.session.rfppublishdate;
      let rfp_clarification_period_end =req.session.clarificationend;
        
        let deadline_period_for_clarification_period = req.session.deadlinepublishresponse;
       let supplier_period_for_clarification_period = req.session.supplierresponse;
        let  supplier_dealine_for_clarification_period = req.session.nextsupplier
        let deadline_for_submission_of_stage_one = req.session.deadlinestageone
        let evaluation_process_start_date = req.session.processstart
         let bidder_presentations_date = req.session.bidder;
         //let standstill_period_starts_date = req.session.standstill;
          let proposed_award_date = req.session.awarddate;
         let expected_signature_date = req.session.signaturedate;
         let contract_signed_date;
           let supplier_start_date;
           if (req.session.agreement_id=='RM1043.8') { //DOS
            contract_signed_date= req.session.signeddate;
            supplier_start_date= req.session.startdate;
           }
     
     fetchQuestionsData = fetchQuestionsData.sort((current_element, next_element) => {
       const currentElementID = Number(current_element.OCDS.id.split('Question ').join(''));
       const nextElementID = Number(next_element.OCDS.id.split('Question ').join(''));
       return currentElementID - nextElementID;
     });

     for(var i=0;i<fetchQuestionsData.length;i++){
      if(fetchQuestionsData[i].nonOCDS.options.length>0){
    
      let value=fetchQuestionsData[i].nonOCDS.options[0].value;
        
      if(i==0){
        fetchQuestionsData[i].nonOCDS.options[0].value=moment(value,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY');
      }
      else
      {
      fetchQuestionsData[i].nonOCDS.options[0].value=moment(value,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY, HH:mm');
      }
      
     // fetchQuestionsData[i].nonOCDS.options[0].value = moment(value,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY, HH:mm');
    }
    }


     const agreementName = req.session.agreementName;
     const lotid = req.session?.lotId;
     const agreementId_session = req.session.agreement_id;
     const agreementLotName = req.session.agreementLotName;
     const project_name = req.session.project_name;
     res.locals.agreement_header = { agreementName, project_name, projectId, agreementId_session, agreementLotName, lotid };
     let forceChangeDataJson;
    if(agreementId_session == 'RM6187') { //MCF3
      forceChangeDataJson = Mcf3cmsData;
    }else if(agreementId_session == 'RM1557.13') { //Gcloud
      forceChangeDataJson = GCloudData;
    } else if(agreementId_session == 'RM1043.8') {  //DOS
      forceChangeDataJson = DOScmsData;
      if(stage2_value !== undefined && stage2_value === "Stage 2"){
        forceChangeDataJson = DOS2cmsData;
      }
    }else { 
      forceChangeDataJson = cmsData;
    }
let appendData = {
  data: forceChangeDataJson,
  lotid:lotid,
      prompt: prompt,
      framework: fetchQuestionsData,
      rfp_clarification_date,
            rfp_clarification_period_end,
            deadline_period_for_clarification_period,
            supplier_period_for_clarification_period,
            supplier_dealine_for_clarification_period,
            deadline_for_submission_of_stage_one,
            evaluation_process_start_date,
            bidder_presentations_date,
            standstill_period_starts_date,
            proposed_award_date,
            expected_signature_date,
            contract_signed_date,
            supplier_start_date,
            releatedContent: req.session.releatedContent,
            selectedeventtype,
            agreementId_session
    };
     if (errorTriggered) {
       appendData = { ...appendData, error: true, errorMessage: errorItem ,selectedeventtype};
     } else {
      
       req.session.timeline.standstillPeriodStartsDate = standstill_period_starts_date;
       
     }
     //CAS-INFO-LOG
     LoggTracer.infoLogger(null, logConstant.setYourTimeLinePage, req);
     res.render('rfp-responsedate.njk', appendData);
    }
    else if(req.session.questionID=='Question 10'){
      
      let proposed_award_date=req.session.UIDate;
      rfp_clarification_date =req.session.rfppublishdate;
     // rfp_clarification_date =moment(req.session.rfppublishdate,'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY');
      //rfp_clarification_period_end =moment(req.session.clarificationend,'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
        
      //   let deadline_period_for_clarification_period = moment(req.session.deadlinepublishresponse, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //  let supplier_period_for_clarification_period = moment(req.session.supplierresponse, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let  supplier_dealine_for_clarification_period = moment(req.session.nextsupplier, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let deadline_for_submission_of_stage_one = moment(req.session.deadlinestageone, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let evaluation_process_start_date = moment(req.session.processstart, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //    let bidder_presentations_date = moment(req.session.bidder, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //    let standstill_period_starts_date = moment(req.session.standstill, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   // let proposed_award_date = moment(req.session.awarddate, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let expected_signature_date = moment(req.session.signaturedate, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
     
      //let rfp_clarification_date =req.session.rfppublishdate;
      let rfp_clarification_period_end =req.session.clarificationend;
        
        let deadline_period_for_clarification_period = req.session.deadlinepublishresponse;
       let supplier_period_for_clarification_period = req.session.supplierresponse;
        let  supplier_dealine_for_clarification_period = req.session.nextsupplier
        let deadline_for_submission_of_stage_one = req.session.deadlinestageone
        let evaluation_process_start_date = req.session.processstart
         let bidder_presentations_date = req.session.bidder;
         let standstill_period_starts_date = req.session.standstill;
          //let proposed_award_date = req.session.awarddate;
         let expected_signature_date = req.session.signaturedate;
         let contract_signed_date;
           let supplier_start_date;
           if (req.session.agreement_id=='RM1043.8') { //DOS
            contract_signed_date= req.session.signeddate;
            supplier_start_date= req.session.startdate;
           }
     
      
     fetchQuestionsData = fetchQuestionsData.sort((current_element, next_element) => {
      const currentElementID = Number(current_element.OCDS.id.split('Question ').join(''));
      const nextElementID = Number(next_element.OCDS.id.split('Question ').join(''));
      return currentElementID - nextElementID;
    });

    for(var i=0;i<fetchQuestionsData.length;i++){
      if(fetchQuestionsData[i].nonOCDS.options.length>0){
      
      let value=fetchQuestionsData[i].nonOCDS.options[0].value;
        
      if(i==0){
        fetchQuestionsData[i].nonOCDS.options[0].value=moment(value,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY');
      }
      else
      {
      fetchQuestionsData[i].nonOCDS.options[0].value=moment(value,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY, HH:mm');
      }
      
     // fetchQuestionsData[i].nonOCDS.options[0].value = moment(value,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY, HH:mm');
    }
    }


    const agreementName = req.session.agreementName;
    const lotid = req.session?.lotId;
    const agreementId_session = req.session.agreement_id;
    const agreementLotName = req.session.agreementLotName;
    const project_name = req.session.project_name;
    res.locals.agreement_header = { agreementName, project_name, projectId, agreementId_session, agreementLotName, lotid };
    let forceChangeDataJson;
    if(agreementId_session == 'RM6187') { //MCF3
      forceChangeDataJson = Mcf3cmsData;
    }else if(agreementId_session == 'RM1557.13') { //Gcloud
      forceChangeDataJson = GCloudData;
    } else if(agreementId_session == 'RM1043.8') {  //DOS
      forceChangeDataJson = DOScmsData;
      if(stage2_value !== undefined && stage2_value === "Stage 2"){
        forceChangeDataJson = DOS2cmsData;
      }
    }else { 
      forceChangeDataJson = cmsData;
    }
let appendData = {
  data: forceChangeDataJson,
  lotid:lotid,
      prompt: prompt,
      framework: fetchQuestionsData,
      rfp_clarification_date,
            rfp_clarification_period_end,
            deadline_period_for_clarification_period,
            supplier_period_for_clarification_period,
            supplier_dealine_for_clarification_period,
            deadline_for_submission_of_stage_one,
            evaluation_process_start_date,
            bidder_presentations_date,
            standstill_period_starts_date,
            proposed_award_date,
            expected_signature_date,
            contract_signed_date,
            supplier_start_date,
            releatedContent: req.session.releatedContent,selectedeventtype,
            agreementId_session
    };
    if (errorTriggered) {
      appendData = { ...appendData, error: true, errorMessage: errorItem,selectedeventtype };
    } else {
     
      req.session.timeline.proposedAwardDate = proposed_award_date;
     
    }
    //CAS-INFO-LOG
    LoggTracer.infoLogger(null, logConstant.setYourTimeLinePage, req);
    res.render('rfp-responsedate.njk', appendData);
    }
    else if(req.session.questionID=='Question 11'){
    
     let expected_signature_date=req.session.UIDate;
     rfp_clarification_date =req.session.rfppublishdate;
      // rfp_clarification_date =moment(req.session.rfppublishdate,'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY');
      // rfp_clarification_period_end =moment(req.session.clarificationend,'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
        
      //   let deadline_period_for_clarification_period = moment(req.session.deadlinepublishresponse, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //  let supplier_period_for_clarification_period = moment(req.session.supplierresponse, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let  supplier_dealine_for_clarification_period = moment(req.session.nextsupplier, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let deadline_for_submission_of_stage_one = moment(req.session.deadlinestageone, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   let evaluation_process_start_date = moment(req.session.processstart, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //    let bidder_presentations_date = moment(req.session.bidder, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //    let standstill_period_starts_date = moment(req.session.standstill, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //     let proposed_award_date = moment(req.session.awarddate, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
      //   // let expected_signature_date = moment(req.session.signaturedate, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
     
      
      //let rfp_clarification_date =req.session.rfppublishdate;
      let rfp_clarification_period_end =req.session.clarificationend;
        
        let deadline_period_for_clarification_period = req.session.deadlinepublishresponse;
       let supplier_period_for_clarification_period = req.session.supplierresponse;
        let  supplier_dealine_for_clarification_period = req.session.nextsupplier
        let deadline_for_submission_of_stage_one = req.session.deadlinestageone
        let evaluation_process_start_date = req.session.processstart
         let bidder_presentations_date = req.session.bidder;
         let standstill_period_starts_date = req.session.standstill;
          let proposed_award_date = req.session.awarddate;
      
          let contract_signed_date;
           let supplier_start_date;
           if (req.session.agreement_id=='RM1043.8') { //DOS
            contract_signed_date= req.session.signeddate;
            supplier_start_date= req.session.startdate;
           }
        // let expected_signature_date = moment(req.session.signaturedate, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, HH:mm');
        // let expected_signature_date = moment(req.session.signaturedate, 'YYYY-MM-DD, HH:mm',).format('DD MMMM YYYY, HH:mm');
     
     fetchQuestionsData = fetchQuestionsData.sort((current_element, next_element) => {
      const currentElementID = Number(current_element.OCDS.id.split('Question ').join(''));
      const nextElementID = Number(next_element.OCDS.id.split('Question ').join(''));
      return currentElementID - nextElementID;
    });
    

    
    for(var i=0;i<fetchQuestionsData.length;i++){
      if(fetchQuestionsData[i].nonOCDS.options.length>0){
      
      let value=fetchQuestionsData[i].nonOCDS.options[0].value;
        
      if(i==0){
        fetchQuestionsData[i].nonOCDS.options[0].value=moment(value,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY');
      }
      else
      {
      fetchQuestionsData[i].nonOCDS.options[0].value=moment(value,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY, HH:mm');
      }
      
     // fetchQuestionsData[i].nonOCDS.options[0].value = moment(value,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY, HH:mm');
    }
    }

    
 

    const agreementName = req.session.agreementName;
    const lotid = req.session?.lotId;
    const agreementId_session = req.session.agreement_id;
    const agreementLotName = req.session.agreementLotName;
    const project_name = req.session.project_name;
    res.locals.agreement_header = { agreementName, project_name, projectId, agreementId_session, agreementLotName, lotid };
    
    let forceChangeDataJson;
    if(agreementId_session == 'RM6187') { //MCF3
      forceChangeDataJson = Mcf3cmsData;
    }else if(agreementId_session == 'RM1557.13') { //Gcloud
      forceChangeDataJson = GCloudData;
    } else if(agreementId_session == 'RM1043.8') {  //DOS
      forceChangeDataJson = DOScmsData;
      if(stage2_value !== undefined && stage2_value === "Stage 2"){
        forceChangeDataJson = DOS2cmsData;
      }
    }else { 
      forceChangeDataJson = cmsData;
    }
let appendData = {
     data: forceChangeDataJson,
     lotid:lotid,
      prompt: prompt,
      framework: fetchQuestionsData,
      rfp_clarification_date,
            rfp_clarification_period_end,
            deadline_period_for_clarification_period,
            supplier_period_for_clarification_period,
            supplier_dealine_for_clarification_period,
            deadline_for_submission_of_stage_one,
            evaluation_process_start_date,
            bidder_presentations_date,
            standstill_period_starts_date,
            proposed_award_date,
            expected_signature_date,
            contract_signed_date,
            supplier_start_date,
            releatedContent: req.session.releatedContent,
            selectedeventtype,
            agreementId_session
    };
    if (errorTriggered) {
      appendData = { ...appendData, error: true, errorMessage: errorItem,selectedeventtype };
    } else {
      req.session.timeline.expectedSignatureDate = expected_signature_date;
    }

     //CAS-INFO-LOG
     LoggTracer.infoLogger(null, logConstant.setYourTimeLinePage, req);
    res.render('rfp-responsedate.njk', appendData);
    

    }



    else if(req.session.questionID=='Question 12'){
    
      
      let contract_signed_date=req.session.UIDate;
      rfp_clarification_date =req.session.rfppublishdate;
       // rfp_clarification_date =moment(req.session.rfppublishdate,'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY');
       // rfp_clarification_period_end =moment(req.session.clarificationend,'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
         
       //   let deadline_period_for_clarification_period = moment(req.session.deadlinepublishresponse, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
       //  let supplier_period_for_clarification_period = moment(req.session.supplierresponse, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
       //   let  supplier_dealine_for_clarification_period = moment(req.session.nextsupplier, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
       //   let deadline_for_submission_of_stage_one = moment(req.session.deadlinestageone, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
       //   let evaluation_process_start_date = moment(req.session.processstart, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
       //    let bidder_presentations_date = moment(req.session.bidder, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
       //    let standstill_period_starts_date = moment(req.session.standstill, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
       //     let proposed_award_date = moment(req.session.awarddate, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
       //   // let expected_signature_date = moment(req.session.signaturedate, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, HH:mm');
      
       
       //let rfp_clarification_date =req.session.rfppublishdate;
       let rfp_clarification_period_end =req.session.clarificationend;
         
         let deadline_period_for_clarification_period = req.session.deadlinepublishresponse;
        let supplier_period_for_clarification_period = req.session.supplierresponse;
         let  supplier_dealine_for_clarification_period = req.session.nextsupplier
         let deadline_for_submission_of_stage_one = req.session.deadlinestageone
         let evaluation_process_start_date = req.session.processstart
          let bidder_presentations_date = req.session.bidder;
          let standstill_period_starts_date = req.session.standstill;
           let proposed_award_date = req.session.awarddate;
           let expected_signature_date=req.session.signaturedate;
           let supplier_start_date= req.session.startdate;
           
         // let expected_signature_date = moment(req.session.signaturedate, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, HH:mm');
      
      fetchQuestionsData = fetchQuestionsData.sort((current_element, next_element) => {
       const currentElementID = Number(current_element.OCDS.id.split('Question ').join(''));
       const nextElementID = Number(next_element.OCDS.id.split('Question ').join(''));
       return currentElementID - nextElementID;
     });
     
 
     
     for(var i=0;i<fetchQuestionsData.length;i++){
       if(fetchQuestionsData[i].nonOCDS.options.length>0){
       
       let value=fetchQuestionsData[i].nonOCDS.options[0].value;
         
       if(i==0){
         fetchQuestionsData[i].nonOCDS.options[0].value=moment(value,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY');
       }
       else
       {
       fetchQuestionsData[i].nonOCDS.options[0].value=moment(value,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY, HH:mm');
       }
       
      // fetchQuestionsData[i].nonOCDS.options[0].value = moment(value,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY, HH:mm');
     }
     }
 
     
  
 
     const agreementName = req.session.agreementName;
     const lotid = req.session?.lotId;
     const agreementId_session = req.session.agreement_id;
     const agreementLotName = req.session.agreementLotName;
     const project_name = req.session.project_name;
     res.locals.agreement_header = { agreementName, project_name, projectId, agreementId_session, agreementLotName, lotid };
     
     let forceChangeDataJson;
     if(agreementId_session == 'RM6187') { //MCF3
       forceChangeDataJson = Mcf3cmsData;
     }else if(agreementId_session == 'RM1557.13') { //Gcloud
      forceChangeDataJson = GCloudData;
    } else if(agreementId_session == 'RM1043.8') {  //DOS
       forceChangeDataJson = DOScmsData;
       if(stage2_value !== undefined && stage2_value === "Stage 2"){
        forceChangeDataJson = DOS2cmsData;
      }
     }else { 
       forceChangeDataJson = cmsData;
     }
 let appendData = {
      data: forceChangeDataJson,
      lotid:lotid,
       prompt: prompt,
       framework: fetchQuestionsData,
       rfp_clarification_date,
             rfp_clarification_period_end,
             deadline_period_for_clarification_period,
             supplier_period_for_clarification_period,
             supplier_dealine_for_clarification_period,
             deadline_for_submission_of_stage_one,
             evaluation_process_start_date,
             bidder_presentations_date,
             standstill_period_starts_date,
             proposed_award_date,
             expected_signature_date,
             contract_signed_date,
             supplier_start_date,
             releatedContent: req.session.releatedContent,
             selectedeventtype
     };
     if (errorTriggered) {
       appendData = { ...appendData, error: true, errorMessage: errorItem,selectedeventtype };
     } else {
       req.session.timeline.contractsigneddate = contract_signed_date;
     }
     
      //CAS-INFO-LOG
     LoggTracer.infoLogger(null, logConstant.setYourTimeLinePage, req);
     res.render('rfp-responsedate.njk', appendData);
     
 
     }

     else if(req.session.questionID=='Question 13'){
    
      let supplier_start_date=req.session.UIDate;
      rfp_clarification_date =req.session.rfppublishdate;
      //  rfp_clarification_date =moment(req.session.rfppublishdate,'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY');
       // rfp_clarification_period_end =moment(req.session.clarificationend,'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
         
       //   let deadline_period_for_clarification_period = moment(req.session.deadlinepublishresponse, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
       //  let supplier_period_for_clarification_period = moment(req.session.supplierresponse, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
       //   let  supplier_dealine_for_clarification_period = moment(req.session.nextsupplier, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
       //   let deadline_for_submission_of_stage_one = moment(req.session.deadlinestageone, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
       //   let evaluation_process_start_date = moment(req.session.processstart, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
       //    let bidder_presentations_date = moment(req.session.bidder, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
       //    let standstill_period_starts_date = moment(req.session.standstill, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
       //     let proposed_award_date = moment(req.session.awarddate, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
       //   // let expected_signature_date = moment(req.session.signaturedate, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, HH:mm');
      
       
       //let rfp_clarification_date =req.session.rfppublishdate;
       let rfp_clarification_period_end =req.session.clarificationend;
         
         let deadline_period_for_clarification_period = req.session.deadlinepublishresponse;
        let supplier_period_for_clarification_period = req.session.supplierresponse;
         let  supplier_dealine_for_clarification_period = req.session.nextsupplier
         let deadline_for_submission_of_stage_one = req.session.deadlinestageone
         let evaluation_process_start_date = req.session.processstart
          let bidder_presentations_date = req.session.bidder;
          let standstill_period_starts_date = req.session.standstill;
           let proposed_award_date = req.session.awarddate;
           let expected_signature_date=req.session.signaturedate;
           let contract_signed_date= req.session.signeddate;
           
         // let expected_signature_date = moment(req.session.signaturedate, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, HH:mm');
      
      fetchQuestionsData = fetchQuestionsData.sort((current_element, next_element) => {
       const currentElementID = Number(current_element.OCDS.id.split('Question ').join(''));
       const nextElementID = Number(next_element.OCDS.id.split('Question ').join(''));
       return currentElementID - nextElementID;
     });
     
 
     
     for(var i=0;i<fetchQuestionsData.length;i++){
       if(fetchQuestionsData[i].nonOCDS.options.length>0){
       
       let value=fetchQuestionsData[i].nonOCDS.options[0].value;
         
       if(i==0){
         fetchQuestionsData[i].nonOCDS.options[0].value=moment(value,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY');
       }
       else
       {
       fetchQuestionsData[i].nonOCDS.options[0].value=moment(value,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY, HH:mm');
       }
       
      // fetchQuestionsData[i].nonOCDS.options[0].value = moment(value,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY, HH:mm');
     }
     }
 
     
  
 
     const agreementName = req.session.agreementName;
     const lotid = req.session?.lotId;
     const agreementId_session = req.session.agreement_id;
     const agreementLotName = req.session.agreementLotName;
     const project_name = req.session.project_name;
     res.locals.agreement_header = { agreementName, project_name, projectId, agreementId_session, agreementLotName, lotid };
     
     let forceChangeDataJson;
     if(agreementId_session == 'RM6187') { //MCF3
       forceChangeDataJson = Mcf3cmsData;
     }else if(agreementId_session == 'RM1557.13') { //Gcloud
      forceChangeDataJson = GCloudData;
    } else if(agreementId_session == 'RM1043.8') {  //DOS
       forceChangeDataJson = DOScmsData;
       if(stage2_value !== undefined && stage2_value === "Stage 2"){
        forceChangeDataJson = DOS2cmsData;
      }
     }else { 
       forceChangeDataJson = cmsData;
     }
 let appendData = {
      data: forceChangeDataJson,
      lotid:lotid,
       prompt: prompt,
       framework: fetchQuestionsData,
       rfp_clarification_date,
             rfp_clarification_period_end,
             deadline_period_for_clarification_period,
             supplier_period_for_clarification_period,
             supplier_dealine_for_clarification_period,
             deadline_for_submission_of_stage_one,
             evaluation_process_start_date,
             bidder_presentations_date,
             standstill_period_starts_date,
             proposed_award_date,
             expected_signature_date,
             contract_signed_date,
             supplier_start_date,
             releatedContent: req.session.releatedContent,
             selectedeventtype
     };
     if (errorTriggered) {
       appendData = { ...appendData, error: true, errorMessage: errorItem,selectedeventtype };
     } else {
      req.session.timeline.supplierstartdate = supplier_start_date;
      // req.session.timeline.expectedSignatureDate = expected_signature_date;
     }
     
     //CAS-INFO-LOG
     LoggTracer.infoLogger(null, logConstant.setYourTimeLinePage, req);
      
     res.render('rfp-responsedate.njk', appendData);
     
 
     }


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


function changeDateTimeFormat(value){
   return `${moment(value).format('DD/MM/YYYY')}, ${new Date(value).toLocaleTimeString('en-GB',
         { timeStyle: 'short', timeZone: 'Europe/London' })}`;
}

//CAS-32
const timelineForcePostForPublish = async (req, res, arr: any) => {

  const filterWithQuestions = arr.map(aQuestions => {
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
      .filter(anAswer => anAswer.nonOCDS.options.length != 0) //CAS-32 - minor changes were made in this place
      .map(aQuestion => aQuestion.OCDS.id);
      let lastCount = 0;
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
      lastCount++;
      if(lastCount == allunfilledAnswer.length) {
        req.session.isTimelineRevert = false;
      }
    }
    req.session.isTimelineRevert = false;
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Issue at timeline dates update force - Regards publish date & timeline date mismatch issue',
      true,
    );
  }
}