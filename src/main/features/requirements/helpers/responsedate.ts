//@ts-nocheck
import * as express from 'express';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import moment from 'moment-business-days';
import * as cmsData from '../../../resources/content/requirements/rfp-response-date.json';
import config from 'config';
const predefinedDays = {
  defaultEndingHour: Number(config.get('predefinedDays.defaultEndingHour')),
  defaultEndingMinutes: Number(config.get('predefinedDays.defaultEndingMinutes')),
  clarification_days: Number(config.get('predefinedDays.clarification_days')),
  clarification_period_end: Number(config.get('predefinedDays.clarification_period_end')),
  supplier_period: Number(config.get('predefinedDays.supplier_period')),
  supplier_deadline: Number(config.get('predefinedDays.supplier_deadline')),
  supplier_period_extra: Number(config.get('predefinedDays.supplier_period_extra')),
  supplier_deadline_extra: Number(config.get('predefinedDays.supplier_deadline_extra')),
};
export const RESPONSEDATEHELPER = async (req: express.Request, res: express.Response, errorTriggered, errorItem) => {
  const proc_id = req.session.projectId;
  const event_id = req.session.eventId;
  const { SESSION_ID } = req.cookies;
  let baseURL = `/tenders/projects/${proc_id}/events/${event_id}`;
  baseURL = baseURL + '/criteria';
  const keyDateselector = 'Key Dates';
  let selectedeventtype = req.session.selectedeventtype;
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
    let rfp_clarification;
    let rfp_clarification_date;
    let rfp_clarification_period_end;
    let rfp_clarification_period;
    let deadline_period;
    let rfp_clarification_endDate;
    let supplier_period_for_clarification_period;
    let supplier_dealine_for_clarification_period;

    if (req.      session.UIDate == null) {
      const rfp_clarification_date = moment(new Date(), 'DD/MM/YYYY').format('DD MMMM YYYY');
      const clarification_period_end_date = new Date();
      const clarification_period_end_date_parsed = `${clarification_period_end_date.getDate()}-${clarification_period_end_date.getMonth() + 1
        }-${clarification_period_end_date.getFullYear()}`;
      ////////////////////////////////    1
      const rfp_clarification_period_end = moment(clarification_period_end_date_parsed, 'DD-MM-YYYY').businessAdd(
        predefinedDays.clarification_days,
      )._d;
      rfp_clarification_period_end.setHours(predefinedDays.defaultEndingHour);
      rfp_clarification_period_end.setMinutes(predefinedDays.defaultEndingMinutes);
      const DeadlinePeriodDate = rfp_clarification_period_end;
      const DeadlinePeriodDate_Parsed = `${DeadlinePeriodDate.getDate()}-${DeadlinePeriodDate.getMonth() + 1
        }-${DeadlinePeriodDate.getFullYear()}`;
      ////////////////////////////////////   2
      const deadline_period_for_clarification_period = moment(DeadlinePeriodDate_Parsed, 'DD-MM-YYYY').businessAdd(
        predefinedDays.clarification_period_end,
      )._d;
      deadline_period_for_clarification_period.setHours(predefinedDays.defaultEndingHour);
      deadline_period_for_clarification_period.setMinutes(predefinedDays.defaultEndingMinutes);
      const SupplierPeriodDate = deadline_period_for_clarification_period;
      const SupplierPeriodDate_Parsed = `${SupplierPeriodDate.getDate()}-${SupplierPeriodDate.getMonth() + 1
        }-${SupplierPeriodDate.getFullYear()}`;
      ////////////////////////////////////   3
      const supplier_period_for_clarification_period = moment(SupplierPeriodDate_Parsed, 'DD-MM-YYYY').businessAdd(
        predefinedDays.supplier_period,
      )._d;
      supplier_period_for_clarification_period.setHours(predefinedDays.defaultEndingHour);
      supplier_period_for_clarification_period.setMinutes(predefinedDays.defaultEndingMinutes);
      const SupplierPeriodDeadLine = supplier_period_for_clarification_period;
      const SupplierPeriodDeadLine_Parsed = `${SupplierPeriodDeadLine.getDate()}-${SupplierPeriodDeadLine.getMonth() + 1
        }-${SupplierPeriodDeadLine.getFullYear()}`;
      ////////////////////////////////////   4
      const supplier_dealine_for_clarification_period = moment(SupplierPeriodDeadLine_Parsed, 'DD-MM-YYYY').businessAdd(
        predefinedDays.supplier_deadline,
      )._d;
      supplier_dealine_for_clarification_period.setHours(predefinedDays.defaultEndingHour);
      supplier_dealine_for_clarification_period.setMinutes(predefinedDays.defaultEndingMinutes);
      //6
      const SupplierSubmissionDeadLine = supplier_dealine_for_clarification_period;
      const SupplierSubmissionDeadLineDate = `${SupplierSubmissionDeadLine.getDate()}-${SupplierSubmissionDeadLine.getMonth() + 1
        }-${SupplierSubmissionDeadLine.getFullYear()}`;
      const deadline_for_submission_of_stage_one = moment(SupplierSubmissionDeadLineDate, 'DD-MM-YYYY').businessAdd(
        predefinedDays.supplier_period_extra,
      )._d;
      deadline_for_submission_of_stage_one.setHours(predefinedDays.defaultEndingHour);
      deadline_for_submission_of_stage_one.setMinutes(predefinedDays.defaultEndingMinutes);
      //7
      const EvaluationProcessStart = deadline_for_submission_of_stage_one;
      const EvaluationProcessStartDate = `${EvaluationProcessStart.getDate()}-${EvaluationProcessStart.getMonth() + 1
        }-${EvaluationProcessStart.getFullYear()}`;
      const evaluation_process_start_date = moment(EvaluationProcessStartDate, 'DD-MM-YYYY').businessAdd(
        predefinedDays.supplier_period_extra,
      )._d;
      evaluation_process_start_date.setHours(predefinedDays.defaultEndingHour);
      evaluation_process_start_date.setMinutes(predefinedDays.defaultEndingMinutes);
      //8
      const BidderPresentations = evaluation_process_start_date;
      const BidderPresentationsDate = `${BidderPresentations.getDate()}-${BidderPresentations.getMonth() + 1
        }-${BidderPresentations.getFullYear()}`;
      const bidder_presentations_date = moment(BidderPresentationsDate, 'DD-MM-YYYY').businessAdd(
        predefinedDays.supplier_period_extra,
      )._d;
      bidder_presentations_date.setHours(predefinedDays.defaultEndingHour);
      bidder_presentations_date.setMinutes(predefinedDays.defaultEndingMinutes);
      //9
      const StandstillPeriodStarts = bidder_presentations_date;
      const StandstillPeriodStartsDate = `${StandstillPeriodStarts.getDate()}-${StandstillPeriodStarts.getMonth() + 1
        }-${StandstillPeriodStarts.getFullYear()}`;
      const standstill_period_starts_date = moment(StandstillPeriodStartsDate, 'DD-MM-YYYY').businessAdd(
        predefinedDays.supplier_deadline_extra,
      )._d;
      standstill_period_starts_date.setHours(predefinedDays.defaultEndingHour);
      standstill_period_starts_date.setMinutes(predefinedDays.defaultEndingMinutes);
      //10
      const ProposedAward = standstill_period_starts_date;
      const ProposedAwardDate = `${ProposedAward.getDate()}-${ProposedAward.getMonth() + 1
        }-${ProposedAward.getFullYear()}`;
      const proposed_award_date = moment(ProposedAwardDate, 'DD-MM-YYYY').businessAdd(
        predefinedDays.supplier_deadline_extra,
      )._d;
      proposed_award_date.setHours(predefinedDays.defaultEndingHour);
      proposed_award_date.setMinutes(predefinedDays.defaultEndingMinutes);
      //11
      const ExpectedSignature = proposed_award_date;
      const ExpectedSignatureDate = `${ExpectedSignature.getDate()}-${ExpectedSignature.getMonth() + 1
        }-${ExpectedSignature.getFullYear()}`;
      const expected_signature_date = moment(ExpectedSignatureDate, 'DD-MM-YYYY').businessAdd(
        predefinedDays.supplier_period_extra,
      )._d;
      expected_signature_date.setHours(predefinedDays.defaultEndingHour);
      expected_signature_date.setMinutes(predefinedDays.defaultEndingMinutes);
      fetchQuestionsData = fetchQuestionsData.sort((current_element, next_element) => {
        const currentElementID = Number(current_element.OCDS.id.split('Question ').join(''));
        const nextElementID = Number(next_element.OCDS.id.split('Question ').join(''));
        return currentElementID - nextElementID;
      });

      for (let index = 0; index < fetchQuestionsData.length; index++) {
        const stringDate = fetchQuestionsData[index]?.nonOCDS.options[0]?.value;
        if(stringDate !=undefined && stringDate!=null)
        {
          let convertedDate = moment(stringDate, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
          if(convertedDate !="Invalid date")
          fetchQuestionsData[index].nonOCDS.options[0].value =convertedDate;
        }
      }
      const agreementName = req.session.agreementName;
      const lotid = req.session?.lotId;
      const agreementId_session = req.session.agreement_id;
      const agreementLotName = req.session.agreementLotName;
      const project_name = req.session.project_name;
      res.locals.agreement_header = { agreementName, project_name, agreementId_session, agreementLotName, lotid };
      let appendData = {
        data: cmsData,
        prompt: prompt,
        framework: fetchQuestionsData,
        rfp_clarification_date,
        rfp_clarification_period_end: moment(rfp_clarification_period_end, 'DD/MM/YYYY, hh:mm a').format(
          'DD MMMM YYYY, hh:mm a',
        ),
        deadline_period_for_clarification_period: moment(
          deadline_period_for_clarification_period,
          'DD/MM/YYYY, hh:mm a',
        ).format('DD MMMM YYYY, hh:mm a'),
        supplier_period_for_clarification_period: moment(
          supplier_period_for_clarification_period,
          'DD/MM/YYYY, hh:mm a',
        ).format('DD MMMM YYYY, hh:mm a'),
        supplier_dealine_for_clarification_period: moment(
          supplier_dealine_for_clarification_period,
          'DD/MM/YYYY, hh:mm a',
        ).format('DD MMMM YYYY, hh:mm a'),
        deadline_for_submission_of_stage_one: moment(deadline_for_submission_of_stage_one, 'DD/MM/YYYY, hh:mm a').format(
          'DD MMMM YYYY, hh:mm a',
        ),
        evaluation_process_start_date: moment(evaluation_process_start_date, 'DD/MM/YYYY, hh:mm a').format(
          'DD MMMM YYYY, hh:mm a',
        ),
        bidder_presentations_date: moment(bidder_presentations_date, 'DD/MM/YYYY, hh:mm a').format(
          'DD MMMM YYYY, hh:mm a',
        ),
        standstill_period_starts_date: moment(standstill_period_starts_date, 'DD/MM/YYYY, hh:mm a').format(
          'DD MMMM YYYY, hh:mm a',
        ),
        proposed_award_date: moment(proposed_award_date, 'DD/MM/YYYY, hh:mm a').format('DD MMMM YYYY, hh:mm a'),
        expected_signature_date: moment(expected_signature_date, 'DD/MM/YYYY, hh:mm a').format('DD MMMM YYYY, hh:mm a'),
        releatedContent: req.session.releatedContent,
        selectedeventtype
      };
      if (errorTriggered) {
        appendData = { ...appendData, error: true, errorMessage: errorItem, selectedeventtype };
      } else {
        req.session.timeline = {};
        req.session.timeline.publish = new Date();
        req.session.timeline.clarificationPeriodEnd = rfp_clarification_period_end;
        req.session.timeline.publishResponsesClarificationQuestions = deadline_period_for_clarification_period;
        req.session.timeline.supplierSubmitResponse = supplier_period_for_clarification_period;
        req.session.timeline.confirmNextStepsSuppliers = supplier_dealine_for_clarification_period;
        //
        req.session.timeline.deadlineForSubmissionOfStageOne = deadline_for_submission_of_stage_one;
        req.session.timeline.evaluationProcessStartDate = evaluation_process_start_date;
        req.session.timeline.bidderPresentationsDate = bidder_presentations_date;
        req.session.timeline.standstillPeriodStartsDate = standstill_period_starts_date;
        req.session.timeline.proposedAwardDate = proposed_award_date;
        req.session.timeline.expectedSignatureDate = expected_signature_date;
      }
      res.render('rfp-responsedate.njk', appendData);
    }
    else if (req.session.questionID == 'Question 2') {

      rfp_clarification_date = moment(req.session.rfppublishdate, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      rfp_clarification_period_end = req.session.UIDate;

      let deadline_period_for_clarification_period = moment(req.session.deadlinepublishresponse, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let supplier_period_for_clarification_period = moment(req.session.supplierresponse, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let supplier_dealine_for_clarification_period = moment(req.session.nextsupplier, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let deadline_for_submission_of_stage_one = moment(req.session.deadlinestageone, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let evaluation_process_start_date = moment(req.session.processstart, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let bidder_presentations_date = moment(req.session.bidder, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let standstill_period_starts_date = moment(req.session.standstill, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let proposed_award_date = moment(req.session.awarddate, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let expected_signature_date = moment(req.session.signaturedate, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');

      fetchQuestionsData = fetchQuestionsData.sort((current_element, next_element) => {
        const currentElementID = Number(current_element.OCDS.id.split('Question ').join(''));
        const nextElementID = Number(next_element.OCDS.id.split('Question ').join(''));
        return currentElementID - nextElementID;
      });
      const agreementName = req.session.agreementName;
      const lotid = req.session?.lotId;
      const agreementId_session = req.session.agreement_id;
      const agreementLotName = req.session.agreementLotName;
      const project_name = req.session.project_name;
      res.locals.agreement_header = { agreementName, project_name, agreementId_session, agreementLotName, lotid };
      let appendData = {
        data: cmsData,
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
        releatedContent: req.session.releatedContent,
        selectedeventtype
      };
      if (errorTriggered) {
        appendData = { ...appendData, error: true, errorMessage: errorItem, selectedeventtype };
      } else {
        req.session.timeline.clarificationPeriodEnd = rfp_clarification_period_end;
      }
      res.render('rfp-responsedate.njk', appendData);
    }
    else if (req.session.questionID == 'Question 3') {

      rfp_clarification_date = moment(req.session.rfppublishdate, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      rfp_clarification_period_end = moment(req.session.clarificationend, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');

      //let deadline_period_for_clarification_period = moment(req.session.deadlinepublishresponse, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let deadline_period_for_clarification_period = req.session.UIDate;
      let supplier_period_for_clarification_period = moment(req.session.supplierresponse, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let supplier_dealine_for_clarification_period = moment(req.session.nextsupplier, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let deadline_for_submission_of_stage_one = moment(req.session.deadlinestageone, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let evaluation_process_start_date = moment(req.session.processstart, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let bidder_presentations_date = moment(req.session.bidder, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let standstill_period_starts_date = moment(req.session.standstill, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let proposed_award_date = moment(req.session.awarddate, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let expected_signature_date = moment(req.session.signaturedate, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');

      fetchQuestionsData = fetchQuestionsData.sort((current_element, next_element) => {
        const currentElementID = Number(current_element.OCDS.id.split('Question ').join(''));
        const nextElementID = Number(next_element.OCDS.id.split('Question ').join(''));
        return currentElementID - nextElementID;
      });
      const agreementName = req.session.agreementName;
      const lotid = req.session?.lotId;
      const agreementId_session = req.session.agreement_id;
      const agreementLotName = req.session.agreementLotName;
      const project_name = req.session.project_name;
      res.locals.agreement_header = { agreementName, project_name, agreementId_session, agreementLotName, lotid };
      let appendData = {
        data: cmsData,
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
        releatedContent: req.session.releatedContent,
        selectedeventtype
      };
      if (errorTriggered) {
        appendData = { ...appendData, error: true, errorMessage: errorItem, selectedeventtype };
      } else {
        req.session.timeline.publishResponsesClarificationQuestions = deadline_period_for_clarification_period;
      }
      res.render('rfp-responsedate.njk', appendData);
    }
    else if (req.session.questionID == 'Question 4') {

      supplier_period_for_clarification_period = req.session.UIDate;
      rfp_clarification_date = moment(req.session.rfppublishdate, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      rfp_clarification_period_end = moment(req.session.clarificationend, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');

      let deadline_period_for_clarification_period = moment(req.session.deadlinepublishresponse, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      // let supplier_period_for_clarification_period = moment(req.session.supplierresponse, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let supplier_dealine_for_clarification_period = moment(req.session.nextsupplier, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let deadline_for_submission_of_stage_one = moment(req.session.deadlinestageone, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let evaluation_process_start_date = moment(req.session.processstart, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let bidder_presentations_date = moment(req.session.bidder, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let standstill_period_starts_date = moment(req.session.standstill, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let proposed_award_date = moment(req.session.awarddate, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let expected_signature_date = moment(req.session.signaturedate, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');



      fetchQuestionsData = fetchQuestionsData.sort((current_element, next_element) => {
        const currentElementID = Number(current_element.OCDS.id.split('Question ').join(''));
        const nextElementID = Number(next_element.OCDS.id.split('Question ').join(''));
        return currentElementID - nextElementID;
      });
      const agreementName = req.session.agreementName;
      const lotid = req.session?.lotId;
      const agreementId_session = req.session.agreement_id;
      const agreementLotName = req.session.agreementLotName;
      const project_name = req.session.project_name;
      res.locals.agreement_header = { agreementName, project_name, agreementId_session, agreementLotName, lotid };
      let appendData = {
        data: cmsData,
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
        releatedContent: req.session.releatedContent,
        selectedeventtype
      };
      if (errorTriggered) {
        appendData = { ...appendData, error: true, errorMessage: errorItem, selectedeventtype };
      } else {

        req.session.timeline.supplierSubmitResponse = supplier_period_for_clarification_period;

      }
      res.render('rfp-responsedate.njk', appendData);
    }
    else if (req.session.questionID == 'Question 5') {
      supplier_dealine_for_clarification_period = req.session.UIDate;
      rfp_clarification_date = moment(req.session.rfppublishdate, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      rfp_clarification_period_end = moment(req.session.clarificationend, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');

      let deadline_period_for_clarification_period = moment(req.session.deadlinepublishresponse, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let supplier_period_for_clarification_period = moment(req.session.supplierresponse, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      //let  supplier_dealine_for_clarification_period = moment(req.session.nextsupplier, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let deadline_for_submission_of_stage_one = moment(req.session.deadlinestageone, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let evaluation_process_start_date = moment(req.session.processstart, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let bidder_presentations_date = moment(req.session.bidder, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let standstill_period_starts_date = moment(req.session.standstill, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let proposed_award_date = moment(req.session.awarddate, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let expected_signature_date = moment(req.session.signaturedate, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');


      fetchQuestionsData = fetchQuestionsData.sort((current_element, next_element) => {
        const currentElementID = Number(current_element.OCDS.id.split('Question ').join(''));
        const nextElementID = Number(next_element.OCDS.id.split('Question ').join(''));
        return currentElementID - nextElementID;
      });
      const agreementName = req.session.agreementName;
      const lotid = req.session?.lotId;
      const agreementId_session = req.session.agreement_id;
      const agreementLotName = req.session.agreementLotName;
      const project_name = req.session.project_name;
      res.locals.agreement_header = { agreementName, project_name, agreementId_session, agreementLotName, lotid };
      let appendData = {
        data: cmsData,
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
        releatedContent: req.session.releatedContent, selectedeventtype
      };
      if (errorTriggered) {
        appendData = { ...appendData, error: true, errorMessage: errorItem, selectedeventtype };
      } else {

        req.session.timeline.confirmNextStepsSuppliers = supplier_dealine_for_clarification_period;

      }
      res.render('rfp-responsedate.njk', appendData);

    }
    else if (req.session.questionID == 'Question 6') {
      let deadline_for_submission_of_stage_one = req.session.UIDate;
      rfp_clarification_date = moment(req.session.rfppublishdate, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      rfp_clarification_period_end = moment(req.session.clarificationend, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');

      let deadline_period_for_clarification_period = moment(req.session.deadlinepublishresponse, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let supplier_period_for_clarification_period = moment(req.session.supplierresponse, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let supplier_dealine_for_clarification_period = moment(req.session.nextsupplier, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      //let deadline_for_submission_of_stage_one = moment(req.session.deadlinestageone, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let evaluation_process_start_date = moment(req.session.processstart, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let bidder_presentations_date = moment(req.session.bidder, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let standstill_period_starts_date = moment(req.session.standstill, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let proposed_award_date = moment(req.session.awarddate, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let expected_signature_date = moment(req.session.signaturedate, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');

      fetchQuestionsData = fetchQuestionsData.sort((current_element, next_element) => {
        const currentElementID = Number(current_element.OCDS.id.split('Question ').join(''));
        const nextElementID = Number(next_element.OCDS.id.split('Question ').join(''));
        return currentElementID - nextElementID;
      });
      const agreementName = req.session.agreementName;
      const lotid = req.session?.lotId;
      const agreementId_session = req.session.agreement_id;
      const agreementLotName = req.session.agreementLotName;
      const project_name = req.session.project_name;
      res.locals.agreement_header = { agreementName, project_name, agreementId_session, agreementLotName, lotid };
      let appendData = {
        data: cmsData,
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
        releatedContent: req.session.releatedContent
        , selectedeventtype
      };
      if (errorTriggered) {
        appendData = { ...appendData, error: true, errorMessage: errorItem, selectedeventtype };
      } else {

        req.session.timeline.deadlineForSubmissionOfStageOne = deadline_for_submission_of_stage_one;

      }
      res.render('rfp-responsedate.njk', appendData);

    }
    else if (req.session.questionID == 'Question 7') {
      let evaluation_process_start_date = req.session.UIDate;
      rfp_clarification_date = moment(req.session.rfppublishdate, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      rfp_clarification_period_end = moment(req.session.clarificationend, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');

      let deadline_period_for_clarification_period = moment(req.session.deadlinepublishresponse, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let supplier_period_for_clarification_period = moment(req.session.supplierresponse, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let supplier_dealine_for_clarification_period = moment(req.session.nextsupplier, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let deadline_for_submission_of_stage_one = moment(req.session.deadlinestageone, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      // let evaluation_process_start_date = moment(req.session.processstart, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let bidder_presentations_date = moment(req.session.bidder, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let standstill_period_starts_date = moment(req.session.standstill, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let proposed_award_date = moment(req.session.awarddate, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let expected_signature_date = moment(req.session.signaturedate, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');

      fetchQuestionsData = fetchQuestionsData.sort((current_element, next_element) => {
        const currentElementID = Number(current_element.OCDS.id.split('Question ').join(''));
        const nextElementID = Number(next_element.OCDS.id.split('Question ').join(''));
        return currentElementID - nextElementID;
      });
      const agreementName = req.session.agreementName;
      const lotid = req.session?.lotId;
      const agreementId_session = req.session.agreement_id;
      const agreementLotName = req.session.agreementLotName;
      const project_name = req.session.project_name;
      res.locals.agreement_header = { agreementName, project_name, agreementId_session, agreementLotName, lotid };
      let appendData = {
        data: cmsData,
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
        releatedContent: req.session.releatedContent,
        selectedeventtype
      };
      if (errorTriggered) {
        appendData = { ...appendData, error: true, errorMessage: errorItem, selectedeventtype };
      } else {

        req.session.timeline.evaluationProcessStartDate = evaluation_process_start_date;

      }
      res.render('rfp-responsedate.njk', appendData);
    }
    else if (req.session.questionID == 'Question 8') {

      let bidder_presentations_date = req.session.UIDate;
      rfp_clarification_date = moment(req.session.rfppublishdate, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      rfp_clarification_period_end = moment(req.session.clarificationend, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');

      let deadline_period_for_clarification_period = moment(req.session.deadlinepublishresponse, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let supplier_period_for_clarification_period = moment(req.session.supplierresponse, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let supplier_dealine_for_clarification_period = moment(req.session.nextsupplier, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let deadline_for_submission_of_stage_one = moment(req.session.deadlinestageone, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let evaluation_process_start_date = moment(req.session.processstart, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      // let bidder_presentations_date = moment(req.session.bidder, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let standstill_period_starts_date = moment(req.session.standstill, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let proposed_award_date = moment(req.session.awarddate, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let expected_signature_date = moment(req.session.signaturedate, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');

      fetchQuestionsData = fetchQuestionsData.sort((current_element, next_element) => {
        const currentElementID = Number(current_element.OCDS.id.split('Question ').join(''));
        const nextElementID = Number(next_element.OCDS.id.split('Question ').join(''));
        return currentElementID - nextElementID;
      });
      const agreementName = req.session.agreementName;
      const lotid = req.session?.lotId;
      const agreementId_session = req.session.agreement_id;
      const agreementLotName = req.session.agreementLotName;
      const project_name = req.session.project_name;
      res.locals.agreement_header = { agreementName, project_name, agreementId_session, agreementLotName, lotid };
      let appendData = {
        data: cmsData,
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
        releatedContent: req.session.releatedContent,
        selectedeventtype
      };
      if (errorTriggered) {
        appendData = { ...appendData, error: true, errorMessage: errorItem, selectedeventtype };
      } else {

        req.session.timeline.bidderPresentationsDate = bidder_presentations_date;

      }
      res.render('rfp-responsedate.njk', appendData);
    }
    else if (req.session.questionID == 'Question 9') {

      let standstill_period_starts_date = req.session.UIDate;
      rfp_clarification_date = moment(req.session.rfppublishdate, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      rfp_clarification_period_end = moment(req.session.clarificationend, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');

      let deadline_period_for_clarification_period = moment(req.session.deadlinepublishresponse, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let supplier_period_for_clarification_period = moment(req.session.supplierresponse, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let supplier_dealine_for_clarification_period = moment(req.session.nextsupplier, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let deadline_for_submission_of_stage_one = moment(req.session.deadlinestageone, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let evaluation_process_start_date = moment(req.session.processstart, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let bidder_presentations_date = moment(req.session.bidder, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      // let standstill_period_starts_date = moment(req.session.standstill, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let proposed_award_date = moment(req.session.awarddate, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let expected_signature_date = moment(req.session.signaturedate, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');

      fetchQuestionsData = fetchQuestionsData.sort((current_element, next_element) => {
        const currentElementID = Number(current_element.OCDS.id.split('Question ').join(''));
        const nextElementID = Number(next_element.OCDS.id.split('Question ').join(''));
        return currentElementID - nextElementID;
      });
      const agreementName = req.session.agreementName;
      const lotid = req.session?.lotId;
      const agreementId_session = req.session.agreement_id;
      const agreementLotName = req.session.agreementLotName;
      const project_name = req.session.project_name;
      res.locals.agreement_header = { agreementName, project_name, agreementId_session, agreementLotName, lotid };
      let appendData = {
        data: cmsData,
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
        releatedContent: req.session.releatedContent,
        selectedeventtype
      };
      if (errorTriggered) {
        appendData = { ...appendData, error: true, errorMessage: errorItem, selectedeventtype };
      } else {

        req.session.timeline.standstillPeriodStartsDate = standstill_period_starts_date;

      }
      res.render('rfp-responsedate.njk', appendData);
    }
    else if (req.session.questionID == 'Question 10') {

      let proposed_award_date = req.session.UIDate;
      rfp_clarification_date = moment(req.session.rfppublishdate, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      rfp_clarification_period_end = moment(req.session.clarificationend, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');

      let deadline_period_for_clarification_period = moment(req.session.deadlinepublishresponse, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let supplier_period_for_clarification_period = moment(req.session.supplierresponse, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let supplier_dealine_for_clarification_period = moment(req.session.nextsupplier, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let deadline_for_submission_of_stage_one = moment(req.session.deadlinestageone, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let evaluation_process_start_date = moment(req.session.processstart, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let bidder_presentations_date = moment(req.session.bidder, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let standstill_period_starts_date = moment(req.session.standstill, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      // let proposed_award_date = moment(req.session.awarddate, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let expected_signature_date = moment(req.session.signaturedate, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');


      fetchQuestionsData = fetchQuestionsData.sort((current_element, next_element) => {
        const currentElementID = Number(current_element.OCDS.id.split('Question ').join(''));
        const nextElementID = Number(next_element.OCDS.id.split('Question ').join(''));
        return currentElementID - nextElementID;
      });
      const agreementName = req.session.agreementName;
      const lotid = req.session?.lotId;
      const agreementId_session = req.session.agreement_id;
      const agreementLotName = req.session.agreementLotName;
      const project_name = req.session.project_name;
      res.locals.agreement_header = { agreementName, project_name, agreementId_session, agreementLotName, lotid };
      let appendData = {
        data: cmsData,
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
        releatedContent: req.session.releatedContent, selectedeventtype
      };
      if (errorTriggered) {
        appendData = { ...appendData, error: true, errorMessage: errorItem, selectedeventtype };
      } else {

        req.session.timeline.proposedAwardDate = proposed_award_date;

      }
      res.render('rfp-responsedate.njk', appendData);
    }
    else if (req.session.questionID == 'Question 11') {

      let expected_signature_date = req.session.UIDate;

      rfp_clarification_date = moment(req.session.rfppublishdate, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      rfp_clarification_period_end = moment(req.session.clarificationend, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');

      let deadline_period_for_clarification_period = moment(req.session.deadlinepublishresponse, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let supplier_period_for_clarification_period = moment(req.session.supplierresponse, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let supplier_dealine_for_clarification_period = moment(req.session.nextsupplier, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let deadline_for_submission_of_stage_one = moment(req.session.deadlinestageone, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let evaluation_process_start_date = moment(req.session.processstart, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let bidder_presentations_date = moment(req.session.bidder, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let standstill_period_starts_date = moment(req.session.standstill, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      let proposed_award_date = moment(req.session.awarddate, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      // let expected_signature_date = moment(req.session.signaturedate, 'YYYY-MM-DD, hh:mm a',).format('DD MMMM YYYY, hh:mm a');
      fetchQuestionsData = fetchQuestionsData.sort((current_element, next_element) => {
        const currentElementID = Number(current_element.OCDS.id.split('Question ').join(''));
        const nextElementID = Number(next_element.OCDS.id.split('Question ').join(''));
        return currentElementID - nextElementID;
      });
      const agreementName = req.session.agreementName;
      const lotid = req.session?.lotId;
      const agreementId_session = req.session.agreement_id;
      const agreementLotName = req.session.agreementLotName;
      const project_name = req.session.project_name;
      res.locals.agreement_header = { agreementName, project_name, agreementId_session, agreementLotName, lotid };
      let appendData = {
        data: cmsData,
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
        releatedContent: req.session.releatedContent,
        selectedeventtype
      };
      if (errorTriggered) {
        appendData = { ...appendData, error: true, errorMessage: errorItem, selectedeventtype };
      } else {
        req.session.timeline.expectedSignatureDate = expected_signature_date;
      }
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