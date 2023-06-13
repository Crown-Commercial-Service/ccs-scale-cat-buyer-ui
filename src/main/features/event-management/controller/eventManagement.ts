//@ts-nocheck
import * as express from 'express';
import { ParsedQs } from 'qs';
import { LoggTracer } from '@common/logtracer/tracer';
import { TokenDecoder } from '@common/tokendecoder/tokendecoder';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import { Procurement } from '../../procurement/model/project';
import { ReleatedContent } from '../../agreement/model/related-content';
import * as eventManagementData from '../../../resources/content/event-management/event-management.json';
import { Message } from '../model/messages';
import * as localData from '../../../resources/content/event-management/local-SOI.json'; // replace this JSON with API endpoint
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { SupplierAddress, SupplierDetails } from '../model/supplierDetailsModel';
import { HttpStatusCode } from 'main/errors/httpStatusCodes';
import { GetLotSuppliers } from '../../shared/supplierService';
import moment from 'moment-business-days';
import { AgreementAPI } from '../../../common/util/fetch/agreementservice/agreementsApiInstance';
import { logConstant } from '../../../common/logtracer/logConstant';

const checkWeekendDate = (date: Date): Date => {
  const dayOfWeek = new Date(date).getDay();
  const newDate = new Date(date);
  if (dayOfWeek === 6 || dayOfWeek === 0) {
    newDate.setDate(newDate.getDate() + 1);
    newDate.setHours(23);
    newDate.setMinutes(59);
    checkWeekendDate(newDate);
  }
  return newDate;
};

const checkBankHolidayDate = (date: Date, listOfHolidayDate: any): Date => {
  const tempDate = new Date(date);
  const newDate = moment(date).format('YYYY-MM-DD');
  const filterDate = listOfHolidayDate.filter((x: any) => x.date == newDate)[0]?.date;
  if (filterDate != undefined && filterDate != null) {
    tempDate.setDate(tempDate.getDate() + 1);
    tempDate.setHours(23);
    tempDate.setMinutes(59);
    checkBankHolidayDate(tempDate, listOfHolidayDate);
  }
  return tempDate;
};

/**
 *
 * @Rediect
 * @endpoint /event/management
 * @param req
 * @param res
 */

export const EVENT_MANAGEMENT = async (req: express.Request, res: express.Response) => {
  const { id, closeProj } = req.query;
  const events = req.session.openProjectActiveEvents;
  const { SESSION_ID } = req.cookies;
  const { projectId } = req.session;

  //const projectId = req.session['projectId']
  //const eventId = req.session['eventId']
  let newDate: any;
  let tempDate: any;
  try {
    if (closeProj != undefined) {
      req.session['isRFIComplete'] = true;
      res.redirect('/projects/create-or-choose');
    } else {
      let agreementName: string,
        agreementLotName: string,
        projectId: string,
        lotid: string,
        title: string,
        agreementId_session: string,
        projectName: string,
        status: string,
        eventId: string,
        eventType: string,
        end_date: string;
      events.forEach(
        (element: {
          activeEvent: {
            id: string | ParsedQs | string[] | ParsedQs[];
            status: string;
            eventType: string;
            title: string;
            tenderPeriod: { startDate: string; endDate: string };
          };
          agreementName: string;
          lotName: string;
          agreementId: string;
          projectName: string;
          projectId: string;
          lotId: string;
          end_date: string;
        }) => {
          if (element.activeEvent.id == id) {
            agreementName = element.agreementName;
            agreementLotName = element.lotName;
            agreementId_session = element.agreementId;
            status = element?.activeEvent?.status?.toLowerCase();
            projectName = element.projectName;
            eventId = element.activeEvent.id.toString();
            eventType = element.activeEvent.eventType;
            projectId = element.projectId;
            lotid = element.lotId;
            title = element.activeEvent.title;
            end_date = element?.activeEvent?.tenderPeriod?.endDate;
          }
        }
      );
      let supplierDataList;
      if (agreementId_session == 'RM1557.13' && lotid == 'All') {
        supplierDataList = '';
      } else {
        const baseurl_Supplier = `/agreements/${agreementId_session}/lots/${lotid}/suppliers`;

        supplierDataList = await (await AgreementAPI.Instance(null).get(baseurl_Supplier)).data;

        //CAS-INFO-LOG
        //LoggTracer.infoLogger(supplierDataList, logConstant.supplierDetails, req);
      }

      //#endregion
      const baseurl = `/tenders/projects/${projectId}/events`;
      const apidata = await TenderApi.Instance(SESSION_ID).get(baseurl);

      //CAS-INFO-LOG
      //LoggTracer.infoLogger(apidata, logConstant.eventDetails, req);

      //status=apidata.data[0].dashboardStatus;
      status = apidata.data.filter((d: any) => d.id == eventId)[0].dashboardStatus;
      end_date = apidata.data.filter((d: any) => d.id == eventId)[0].tenderPeriod.endDate;

      let supplierDetails = {} as SupplierDetails;
      // Code Block ends

      // Update procurement data into (redis) session
      const proc: Procurement = {
        procurementID: projectId,
        eventId: eventId,
        defaultName: {
          name: projectName,
          components: {
            agreementId: agreementId_session,
            lotId: lotid,
            org: 'COGNIZANT BUSINESS SERVICES UK LIMITED',
          },
        },
        started: true,
      };
      req.session.procurements.push(proc);
      // Added required session values for accessign the pre-market pages
      req.session.eventManagement_eventType = eventType;
      req.session.agreement_id = agreementId_session;
      req.session.agreementLotName =
        agreementId_session == 'RM1557.13' && lotid == 'All'
          ? 'Find cloud hosting, software and support'
          : agreementLotName;
      req.session.agreementName = agreementName;
      req.session.lotId = agreementId_session == 'RM1557.13' && lotid == 'All' ? 'All' : lotid;
      req.session['projectId'] = projectId;
      req.session['eventId'] = eventId;
      req.session['evetTitle'] = title;
      req.session['Projectname'] = projectName;
      req.session['project_name'] = projectName;
      req.session.selectedeventtype = '';
      const evetTitle = title;

      // Releated content session values
      const releatedContent: ReleatedContent = new ReleatedContent();
      releatedContent.name = agreementName;
      releatedContent.lotName =
        agreementId_session == 'RM1557.13' && lotid == 'All'
          ? 'Find cloud hosting, software and support'
          : agreementLotName;
      releatedContent.lotUrl =
        agreementId_session == 'RM1557.13' && lotid == 'All'
          ? '/agreement/lot?agreement_id=' + agreementId_session + '&lotNum='
          : '/agreement/lot?agreement_id=' + agreementId_session + '&lotNum=' + req.session.lotId.replace(/ /g, '%20');

      releatedContent.title = 'Related content';
      req.session.releatedContent = releatedContent;

      //Related to AssessmentID
      const baseURL = `tenders/projects/${projectId}/events/${eventId}`;

      const data = await TenderApi.Instance(SESSION_ID).get(baseURL);

      //CAS-INFO-LOG
      //LoggTracer.infoLogger(data, logConstant.eventDetails, req);

      const assessmentId = data.data.nonOCDS.assessmentId;
      let assessmentSupplierTarget;
      if (agreementId_session === 'RM1043.8') {
        assessmentSupplierTarget = data.data.nonOCDS.assessmentSupplierTarget;
      }
      req.session.currentEvent = { assessmentId };

      // Event header
      res.locals.agreement_header = {
        projectName: projectName,
        projectId,
        agreementName,
        agreementIdSession: agreementId_session,
        agreementLotName,
        lotid,
      };
      req.session.agreement_header = res.locals.agreement_header;
      // Get unread Message count
      const baseMessageURL = `/tenders/projects/${projectId}/events/${eventId}/messages?message-direction=RECEIVED`;
      const message = await TenderApi.Instance(SESSION_ID).get(baseMessageURL);

      //CAS-INFO-LOG
      LoggTracer.infoLogger(message, logConstant.getReceivedMessage, req);

      let unreadMessage = 0;
      const msg: Message[] = message.data.messages;
      if (message.data.counts != undefined) {
        msg.forEach((element) => {
          if (!element.nonOCDS.read) {
            unreadMessage = unreadMessage + 1;
          }
        });
      }

      let supplierSummary: any;
      let supplierDetailsDataList: SupplierDetails[] = [];
      let showallDownload = false;
      if (
        status.toLowerCase() == 'to-be-evaluated' ||
        status.toLowerCase() == 'evaluating' ||
        status.toLowerCase() == 'evaluated' ||
        status.toLowerCase() == 'published' ||
        status.toLowerCase() == 'pre-award' ||
        status.toLowerCase() == 'awarded' ||
        status.toLowerCase() == 'complete'
      ) {
        //Supplier of interest
        const supplierInterestURL = `tenders/projects/${projectId}/events/${eventId}/responses`;

        const supplierdata = await TenderApi.Instance(SESSION_ID).get(supplierInterestURL);

        //CAS-INFO-LOG
        LoggTracer.infoLogger(supplierdata, logConstant.getSupplierResponse, req);

        //Supplier score
        const supplierScoreURL = `tenders/projects/${projectId}/events/${eventId}/scores`;

        const supplierScore = await TenderApi.Instance(SESSION_ID).get(supplierScoreURL);

        //CAS-INFO-LOG
        LoggTracer.infoLogger(supplierScore, logConstant.getSupplierScore, req);

        let supplierDataList = [];
        supplierDataList = await GetLotSuppliers(req);

        for (let i = 0; i < supplierdata?.data?.responders?.length; i++) {
          const id = supplierdata.data.responders[i]?.supplier?.id;
          const score = supplierScore?.data?.filter((x: any) => x.organisationId == id)?.[0]?.score;
          if (supplierdata?.data?.responders[i]?.responseState == 'Submitted') {
            showallDownload = true;
          }
          const supplierDetailsObj = {} as SupplierDetails;

          //supplierDetailsObj.supplierName = supplierdata.data?.responders[i]?.supplier?.name;
          supplierDetailsObj.responseState = supplierdata.data?.responders[i]?.responseState;
          if (agreementId_session === 'RM1043.8') {
            supplierDetailsObj.responseDate =
              supplierdata.data?.responders[i]?.responseDate != undefined &&
              supplierdata.data?.responders[i]?.responseDate != null
                ? moment(supplierdata.data?.responders[i]?.responseDate, 'YYYY-MM-DD').format('DD/MM/YYYY')
                : '';
          } else {
            supplierDetailsObj.responseDate =
              supplierdata.data?.responders[i]?.responseDate != undefined &&
              supplierdata.data?.responders[i]?.responseDate != null
                ? moment(supplierdata.data?.responders[i]?.responseDate, 'YYYY-MM-DD HH:mm').format('DD/MM/YYYY HH:mm')
                : '';
          }
          supplierDetailsObj.score = score != undefined ? score : 0;
          supplierDetailsObj.rankFlag = false;
          const supplierFiltedData = supplierDataList?.filter((a: any) => a.organization.id == id)?.[0]?.organization;
          if (supplierFiltedData != undefined && supplierFiltedData != null) {
            supplierDetailsObj.supplierAddress = {} as SupplierAddress;
            supplierDetailsObj.supplierAddress =
              supplierFiltedData.address != undefined && supplierFiltedData.address != null
                ? supplierFiltedData?.address
                : null;
            supplierDetailsObj.supplierContactName =
              supplierFiltedData.contactPoint != undefined &&
              supplierFiltedData.contactPoint != null &&
              supplierFiltedData.contactPoint?.name != undefined &&
              supplierFiltedData.contactPoint?.name != null
                ? supplierFiltedData.contactPoint?.name
                : null;
            supplierDetailsObj.supplierContactEmail =
              supplierFiltedData.contactPoint != undefined ? supplierFiltedData.contactPoint?.email : null;
            supplierDetailsObj.supplierWebsite =
              supplierFiltedData.identifier != undefined && supplierFiltedData.identifier != null
                ? supplierFiltedData.identifier?.uri
                : null;
            supplierDetailsObj.supplierName =
              supplierFiltedData.name != undefined && supplierFiltedData.name != null ? supplierFiltedData.name : null;
            supplierDetailsObj.supplierId = id;
            supplierDetailsObj.supplierIdMain = id;
            supplierDetailsObj.supplierState = 'Unsuccessful';
            supplierDetailsDataList.push(supplierDetailsObj);
          }
          if (supplierdata.data?.responders[i]?.responseState?.trim().toLowerCase() == 'submitted') {
            showallDownload = true;
          }
        }
        supplierSummary = supplierdata?.data;
        supplierDetailsDataList.sort((a, b) => (Number(a.score) > Number(b.score) ? -1 : 1));
        //RANK

        let rankCount = 0;

        supplierDetailsDataList = supplierDetailsDataList.filter((x) => x.responseState == 'Submitted');

        for (let i = 0; i < supplierDetailsDataList.length; i++) {
          const element = supplierDetailsDataList[i];
          if (!element.rankFlag) {
            rankCount = rankCount + 1;
            const sameScoreFound = supplierDetailsDataList.filter((x) => x.score == element.score);
            if (sameScoreFound != undefined && sameScoreFound != null && sameScoreFound.length > 1) {
              for (let index = 0; index < sameScoreFound.length; index++) {
                const indexNumber = supplierDetailsDataList.findIndex(
                  (x) => x.supplierId == sameScoreFound[index].supplierId
                );
                if (indexNumber != undefined && indexNumber != null && indexNumber >= 0) {
                  supplierDetailsDataList[indexNumber].rank = '' + rankCount + '=';
                  supplierDetailsDataList[indexNumber].rankFlag = true;
                }
              }
            } else {
              supplierDetailsDataList[i].rank = '' + rankCount;
              supplierDetailsDataList[i].rankFlag = true;
            }
          }
        }

        // for (let i = 0; i < supplierDetailsDataList.length; i++) {
        //   if (supplierDetailsDataList[i].responseState.toLowerCase() == "submitted") {
        //     rankCount = rankCount + 1
        //     supplierDetailsDataList[i].rank = "" + rankCount;
        //   }
        // }
        //Awarded,pre_awarded and complete supplier info
        if (
          status.toLowerCase() == 'pre-award' ||
          status.toLowerCase() == 'awarded' ||
          status.toLowerCase() == 'complete'
        ) {
          let supplierState = 'PRE_AWARD';
          if (status.toLowerCase() == 'awarded' || status.toLowerCase() == 'complete') {
            supplierState = 'AWARD';
          }
          const supplierAwardDetailURL = `tenders/projects/${projectId}/events/${eventId}/awards?award-state=${supplierState}`;

          const supplierAwardDetail = await (await TenderApi.Instance(SESSION_ID).get(supplierAwardDetailURL)).data;

          //CAS-INFO-LOG
          LoggTracer.infoLogger(supplierAwardDetail, logConstant.getSupplierAwardDetails, req);

          if (supplierDetailsDataList.length > 0) {
            supplierAwardDetail?.suppliers?.map((item: any) => {
              const supplierDataIndex = supplierDetailsDataList.findIndex((x) => x.supplierId == item.id);
              if (supplierDataIndex != undefined && supplierDataIndex != null && supplierDataIndex >= 0) {
                supplierDetailsDataList[supplierDataIndex].supplierState = 'Awarded';
                supplierDetails = supplierDetailsDataList.filter((x) => x.supplierId == item.id)[0];
              }
            });

            if (agreementId_session == 'RM1043.8') {
              supplierDetails.supplierAwardedDate = moment(supplierAwardDetail?.date, 'YYYY-MM-DD, hh:mm a').format(
                'DD/MM/YYYY hh:mm'
              );
            } else {
              supplierDetails.supplierAwardedDate = moment(supplierAwardDetail?.date, 'YYYY-MM-DD, hh:mm a').format(
                'DD/MM/YYYY'
              );
            }
          }

          if (status.toLowerCase() == 'pre-award') {
            supplierDetails.standStillFlag = true;
            let currentDate = new Date(supplierAwardDetail?.date);
            //Standstill dates are current date +10 days.
            currentDate.setDate(currentDate.getDate() + 10);
            currentDate = checkWeekendDate(currentDate);

            const bankHolidayUrl = 'https://www.gov.uk/bank-holidays.json';
            const bankHoliDayData = await (await TenderApi.Instance(SESSION_ID).get(bankHolidayUrl)).data;
            const listOfHolidayDate = bankHoliDayData['england-and-wales']?.events.concat(
              bankHoliDayData['scotland']?.events,
              bankHoliDayData['northern-ireland']?.events
            );

            currentDate = checkBankHolidayDate(currentDate, listOfHolidayDate);
            supplierDetails.supplierStandStillDate = moment(currentDate).format('DD/MM/YYYY');

            const todayDate = new Date();
            const standStillDate = new Date(currentDate);

            const d1 = todayDate.getFullYear() + '-' + todayDate.getMonth() + '-' + todayDate.getDate();
            const d2 = standStillDate.getFullYear() + '-' + standStillDate.getMonth() + '-' + standStillDate.getDate();
            if (new Date(d1) > new Date(d2)) {
              supplierDetails.standStillFlag = false;
            }
          }
        }
        //to get signed awarded contrct end date
        if (status.toLowerCase() == 'complete') {
          const contractURL = `tenders/projects/${projectId}/events/${eventId}/contracts`;
          const scontractAwardDetail = await (await TenderApi.Instance(SESSION_ID).get(contractURL)).data;

          //CAS-INFO-LOG
          // LoggTracer.infoLogger(scontractAwardDetail, logConstant.getContractDetails, req);

          if (agreementId_session == 'RM1043.8') {
            supplierDetails.supplierSignedContractDate = moment(
              scontractAwardDetail?.dateSigned,
              'YYYY-MM-DD, hh:mm a'
            ).format('DD/MM/YYYY hh:mm');
          } else {
            supplierDetails.supplierSignedContractDate = moment(scontractAwardDetail?.dateSigned).format('DD/MM/YYYY');
          }
        }
      }
      //Get Q&A Count
      let fetchData;
      let qasCount = 0;
      if (agreementId_session == 'RM1557.13' && lotid == 'All') {
        fetchData = '';
        qasCount = 0;
      } else {
        const baseQandAURL = `/tenders/projects/${req.session.projectId}/events/${req.session.eventId}/q-and-a`;

        fetchData = await TenderApi.Instance(SESSION_ID).get(baseQandAURL);

        //CAS-INFO-LOG
        LoggTracer.infoLogger(fetchData, logConstant.getQuestionAndAnsDetails, req);
        if (fetchData?.data != undefined) {
          qasCount = fetchData.data.QandA;
          qasCount = qasCount.length;
        }
      }

      let showCloseProject = true;
      if (status.toLowerCase() == 'awarded' || status.toLowerCase() == 'complete') {
        showCloseProject = false;
      }
      const procurementId = req.session['projectId'];
      const collaboratorsBaseUrl = `/tenders/projects/${procurementId}/users`;
      let collaboratorData = await DynamicFrameworkInstance.Instance(SESSION_ID).get(collaboratorsBaseUrl);
      collaboratorData = collaboratorData.data;

      //CAS-INFO-LOG
      //LoggTracer.infoLogger(collaboratorData, logConstant.userDetailFetch, req);
      let filtervalues;
      if (agreementId_session == 'RM1557.13' && lotid == 'All') {
        filtervalues = '';
      } else {
        try {
          if (end_date != undefined && end_date != null) {
            const day = end_date.substr(0, 10);
            const time = end_date.substr(11, 5);

            filtervalues = moment(day + '' + time, 'YYYY-MM-DD HH:mm').format('DD MMMM YYYY, HH:mm');
          }
        } catch (error) {
          console.log('catcherr1', error);
          LoggTracer.errorLogger(
            res,
            error,
            `${req.headers.host}${req.originalUrl}`,
            null,
            TokenDecoder.decoder(SESSION_ID),
            'Event Management - Date is Invalid',
            true
          );
        }
      }
      req.session.projectStatus = 2;
      let awardOption = 'false';
      const stage2BaseUrl = `/tenders/projects/${projectId}/events`;
      const stage2_dynamic_api = await TenderApi.Instance(SESSION_ID).get(stage2BaseUrl);
      const stage2_dynamic_api_data = stage2_dynamic_api.data;

      //CAS-INFO-LOG
      //LoggTracer.infoLogger(stage2_dynamic_api, logConstant.fetchEventDetails, req);

      const stage2_data = stage2_dynamic_api_data?.filter(
        (anItem: any) => anItem.id == eventId && (anItem.templateGroupId == '13' || anItem.templateGroupId == '14')
      );
      let stage2_value = 'Stage 1';
      if (stage2_data.length > 0) {
        stage2_value = 'Stage 2';
      }
      //if(stage2_value == 'Stage 2'){
      if (status.toLowerCase() == 'pre-award') {
        let rspbaseURL = `/tenders/projects/${projectId}/events/${req.session.eventId}`;
        rspbaseURL = rspbaseURL + '/criteria';
        const fetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(rspbaseURL);
        const fetch_dynamic_api_data = fetch_dynamic_api?.data;

        //CAS-INFO-LOG
        //LoggTracer.infoLogger(fetch_dynamic_api_data, logConstant.fetchEventDetails, req);

        const extracted_criterion_based = fetch_dynamic_api_data?.map((criterian) => criterian?.id);
        let criterianStorage = [];
        for (const aURI of extracted_criterion_based) {
          const criterian_bas_url = `/tenders/projects/${projectId}/events/${req.session.eventId}/criteria/${aURI}/groups`;
          const fetch_criterian_group_data = await DynamicFrameworkInstance.Instance(SESSION_ID).get(criterian_bas_url);
          const criterian_array = fetch_criterian_group_data?.data;
          const rebased_object_with_requirements = criterian_array?.map((anItem) => {
            const object = anItem;
            object['criterianId'] = aURI;
            return object;
          });
          criterianStorage.push(rebased_object_with_requirements);
        }
        const keyDateselector = 'Key Dates';
        criterianStorage = criterianStorage?.flat();
        criterianStorage = criterianStorage?.filter((AField) => AField?.OCDS?.id === keyDateselector);

        const Criterian_ID = criterianStorage?.[0]?.criterianId;
        const prompt = criterianStorage?.[0]?.nonOCDS?.prompt;
        const apiData_baseURL = `/tenders/projects/${projectId}/events/${req.session.eventId}/criteria/${Criterian_ID}/groups/${keyDateselector}/questions`;

        const fetchQuestions = await DynamicFrameworkInstance.Instance(SESSION_ID).get(apiData_baseURL);
        const fetchQuestionsData = fetchQuestions?.data;

        //CAS-INFO-LOG
        //LoggTracer.infoLogger(fetchQuestions, logConstant.questionDetail, req);

        let standstill = '';
        if (agreementId_session == 'RM6187' && (eventType == 'FC' || eventType == 'DA')) {
          standstill = fetchQuestionsData
            ?.filter((item) => item?.OCDS?.id == 'Question 8')
            .map((item) => item?.nonOCDS?.options)?.[0]
            ?.find((i) => i?.value)?.value;
        } else if (agreementId_session == 'RM1557.13' && eventType == 'FC' && lotid == '4') {
          standstill = fetchQuestionsData
            ?.filter((item) => item?.OCDS?.id == 'Question 8')
            .map((item) => item?.nonOCDS?.options)?.[0]
            ?.find((i) => i?.value)?.value;
        } else {
          standstill = fetchQuestionsData
            ?.filter((item) => item?.OCDS?.id == 'Question 5')
            .map((item) => item?.nonOCDS?.options)?.[0]
            ?.find((i) => i?.value)?.value;
        }

        const awardstart = fetchQuestionsData
          ?.filter((item) => item?.OCDS?.id == 'Question 6')
          .map((item) => item?.nonOCDS?.options)?.[0]
          ?.find((i) => i?.value)?.value;

        const format = 'DD/MM/YYYY/HH/mm';
        const startDate: any = moment(standstill).format(format);
        const endDate: any = moment(awardstart).format(format);
        // let currentDate: any = moment('2023-01-05 21:31').format(format);
        const currentDate: any = moment().format(format);

        const startDate1 = startDate.split('/');
        const endDate1 = endDate.split('/');
        const currentDate1 = currentDate.split('/');

        const fromDate = new Date(
          startDate1[2],
          parseInt(startDate1[1]) - 1,
          startDate1[0],
          startDate1[3],
          startDate1[4]
        );
        const checkDate = new Date(
          currentDate1[2],
          parseInt(currentDate1[1]) - 1,
          currentDate1[0],
          currentDate1[3],
          currentDate1[4]
        );

        const fromDateNew = new Date(startDate1[2], parseInt(startDate1[1]) - 1, startDate1[0]);
        const checkDateNew = new Date(currentDate1[2], parseInt(currentDate1[1]) - 1, currentDate1[0]);

        const toDate = new Date(endDate1[2], parseInt(endDate1[1]) - 1, endDate1[0], endDate1[3], endDate1[4]);

        if (checkDateNew >= fromDateNew) {
          awardOption = 'true';
        }
      }

      const appendData = {
        projectStatus: 2,
        documentTemplatesUnSuccess: '',
        evetTitle,
        awardOption,
        supplierDetails,
        data: eventManagementData,
        filtervalues,
        Colleagues: collaboratorData,
        status,
        projectName,
        projectId,
        eventId,
        eventType,
        apidata,
        end_date,
        supplierDetailsDataList,
        supplierSummary,
        showallDownload,
        QAs: agreementId_session == 'RM1557.13' && lotid == 'All' ? null : qasCount,
        suppliers: localData,
        unreadMessage: unreadMessage,
        showCloseProject,
        agreementId_session,
        assessmentSupplierTarget,
      };

      let redirectUrl: string;
      if (status.toLowerCase() == 'in-progress') {
        switch (eventType) {
        case 'RFI':
          redirectUrl = '/rfi/rfi-tasklist';
          break;
        case 'EOI':
          redirectUrl = '/eoi/eoi-tasklist';
          break;
        case 'DA':
          if (agreementId_session == 'RM6263') {
            //DSP
            redirectUrl = '/rfp/task-list';
          } else {
            //MCF3
            redirectUrl = '/da/task-list';
          }
          req.session.selectedeventtype = 'DA';
          break;
        case 'FC':
          redirectUrl = '/rfp/task-list';
          break;
        default:
          redirectUrl = '/event/management';
          break;
        }
        res.redirect(redirectUrl);
      } else if (status.toLowerCase() == 'assessment') {
        switch (eventType) {
        case 'DAA':
          redirectUrl = '/da/task-list?path=B1';
          break;
        case 'FCA':
          redirectUrl = '/ca/task-list?path=A1';
          break;
        case 'PA':
          redirectUrl = '/projects/routeToCreateSupplier';
          break;
        default:
          redirectUrl = '/event/management';
          break;
        }
        res.redirect(redirectUrl);
      } else if (status.toLowerCase() == 'unknown') {
        switch (eventType) {
        case 'TBD': {
          const { eventId, projectId, procurements } = req.session;
          const currentProcNum = procurements.findIndex(
            (proc: any) => proc.eventId === eventId && proc.procurementID === projectId
          );
          req.session.procurements[currentProcNum].started = false;
          redirectUrl = '/projects/create-or-choose';
          break;
        }
        default:
          redirectUrl = '/event/management';
          break;
        }
        res.redirect(redirectUrl);
      } else {
        if (
          (status != undefined && status.toLowerCase() == 'pre-award') ||
          status.toLowerCase() == 'awarded' ||
          status.toLowerCase() == 'complete'
        ) {
          //CAS-INFO-LOG
          LoggTracer.infoLogger(null, logConstant.awardPageLogger, req);
        } else {
          //CAS-INFO-LOG
          LoggTracer.infoLogger(null, logConstant.publishPageLogger, req);
        }

        let redirectUrl_: string;
        switch (eventType) {
        case 'RFI':
          if (
            (status != undefined && status.toLowerCase() == 'pre-award') ||
              status.toLowerCase() == 'awarded' ||
              status.toLowerCase() == 'complete'
          ) {
            res.render('awardEventManagement', appendData);
          } else {
            res.render('eventManagement', appendData);
          }
          break;
        case 'EOI':
          if (
            (status != undefined && status.toLowerCase() == 'pre-award') ||
              status.toLowerCase() == 'awarded' ||
              status.toLowerCase() == 'complete'
          ) {
            res.render('awardEventManagement', appendData);
          } else {
            res.render('eventManagement', appendData);
          }
          break;
        case 'FC':
          if (
            (status != undefined && status.toLowerCase() == 'pre-award') ||
              status.toLowerCase() == 'awarded' ||
              status.toLowerCase() == 'complete'
          ) {
            //Awards/templates
            // const awardsTemplatesURL = `tenders/projects/${projectId}/events/${eventId}/awards/templates`
            // const awardsTemplatesData = await (await TenderApi.Instance(SESSION_ID).get(awardsTemplatesURL))?.data;
            // let documentTemplatesUnSuccess = "";
            // for (let i = 0; i < awardsTemplatesData.length; i++) {
            //   if (awardsTemplatesData[i].description.includes("UnSuccessful")) {
            //     documentTemplatesUnSuccess = awardsTemplatesData[i].id;
            //   }
            // }
            // appendData.documentTemplatesUnSuccess = documentTemplatesUnSuccess
            res.render('awardEventManagement', appendData);
          } else {
            if (agreementId_session === 'RM1043.8') {
              appendData.stage2_value = stage2_value;
              res.render('eventManagementDOS', appendData);
            } else {
              res.render('eventManagement', appendData);
            }
          }
          break;
        case 'DA':
          req.session.selectedeventtype = 'DA';
          if (
            (status != undefined && status.toLowerCase() == 'pre-award') ||
              status.toLowerCase() == 'awarded' ||
              status.toLowerCase() == 'complete'
          ) {
            res.render('awardEventManagement', appendData);
          } else {
            res.render('eventManagement', appendData);
          }
          break;
        default:
          redirectUrl_ = '/event/management';
          res.redirect(redirectUrl_);
          break;
        }
      }
    }
  } catch (err) {
    console.log('catcherr2', err);
    LoggTracer.errorLogger(
      res,
      err,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Event management page',
      true
    );
  }
};

export const EVENT_MANAGEMENT_CLOSE = async (req: express.Request, res: express.Response) => {
  const { id, closeProj } = req.query;
  const events = req.session.historicalEvents;

  const { SESSION_ID } = req.cookies;
  const { projectId } = req.session;
  //const projectId = req.session['projectId']

  //const eventId = req.session['eventId']
  let newDate: any;
  let tempDate: any;
  try {
    if (closeProj != undefined) {
      req.session['isRFIComplete'] = true;
      res.redirect('/projects/create-or-choose');
    } else {
      let agreementName: string,
        agreementLotName: string,
        projectId: string,
        lotid: string,
        title: string,
        agreementId_session: string,
        projectName: string,
        status: string,
        eventId: string,
        eventType: string,
        end_date: string;

      events.forEach(
        (element: {
          activeEvent: {
            id: string | ParsedQs | string[] | ParsedQs[];
            status: string;
            eventType: string;
            title: string;
            tenderPeriod: { startDate: string; endDate: string };
          };
          agreementName: string;
          lotName: string;
          agreementId: string;
          projectName: string;
          projectId: string;
          lotId: string;
          end_date: string;
        }) => {
          if (element.activeEvent.id == id) {
            agreementName = element.agreementName;
            agreementLotName = element.lotName;
            agreementId_session = element.agreementId;
            status = element?.activeEvent?.status?.toLowerCase();
            projectName = element.projectName;
            eventId = element.activeEvent.id.toString();
            eventType = element.activeEvent.eventType;
            projectId = element.projectId;
            lotid = element.lotId;
            title = element.activeEvent.title;
            end_date = element?.activeEvent?.tenderPeriod?.endDate;
          }
        }
      );
      //#endregion

      const baseurl = `/tenders/projects/${projectId}/events`;

      const apidata = await TenderApi.Instance(SESSION_ID).get(baseurl);

      //status=apidata.data[0].dashboardStatus;
      status = apidata.data.filter((d: any) => d.id == eventId)[0].dashboardStatus;
      let supplierDetails = {} as SupplierDetails;
      // Code Block ends

      // Update procurement data into (redis) session
      const proc: Procurement = {
        procurementID: projectId,
        eventId: eventId,
        defaultName: {
          name: projectName,
          components: {
            agreementId: agreementId_session,
            lotId: lotid,
            org: 'COGNIZANT BUSINESS SERVICES UK LIMITED',
          },
        },
        started: true,
      };
      req.session.procurements.push(proc);
      // Added required session values for accessign the pre-market pages
      req.session.eventManagement_eventType = eventType;
      req.session.agreement_id = agreementId_session;
      req.session.agreementLotName = agreementLotName;
      req.session.agreementName = agreementName;
      req.session.lotId = lotid;
      req.session['projectId'] = projectId;
      req.session['eventId'] = eventId;
      req.session['evetTitle'] = title;
      req.session['Projectname'] = projectName;
      req.session['project_name'] = projectName;
      req.session.selectedeventtype = '';

      // Releated content session values
      const releatedContent: ReleatedContent = new ReleatedContent();
      releatedContent.name = agreementName;
      releatedContent.lotName = lotid + ' : ' + agreementLotName;
      releatedContent.lotUrl =
        '/agreement/lot?agreement_id=' + agreementId_session + '&lotNum=' + req.session.lotId.replace(/ /g, '%20');
      releatedContent.title = 'Related content';
      req.session.releatedContent = releatedContent;

      //Related to AssessmentID
      const baseURL = `tenders/projects/${projectId}/events/${eventId}`;

      const data = await TenderApi.Instance(SESSION_ID).get(baseURL);
      const assessmentId = data.data.nonOCDS.assessmentId;
      req.session.currentEvent = { assessmentId };

      // Event header
      res.locals.agreement_header = {
        projectName: projectName,
        projectId,
        agreementName,
        agreementIdSession: agreementId_session,
        agreementLotName,
        lotid,
      };
      req.session.agreement_header = res.locals.agreement_header;

      // Get unread Message count
      const baseMessageURL = `/tenders/projects/${projectId}/events/${eventId}/messages?message-direction=RECEIVED`;
      const message = await TenderApi.Instance(SESSION_ID).get(baseMessageURL);

      let unreadMessage = 0;
      const msg: Message[] = message.data.messages;
      if (message.data.counts != undefined) {
        msg.forEach((element) => {
          if (!element.nonOCDS.read) {
            unreadMessage = unreadMessage + 1;
          }
        });
      }

      let supplierSummary: any;
      const supplierDetailsDataList: SupplierDetails[] = [];
      let showallDownload = false;

      if (
        status.toLowerCase() == 'closed' ||
        status.toLowerCase() == 'to-be-evaluated' ||
        status.toLowerCase() == 'evaluating' ||
        status.toLowerCase() == 'evaluated' ||
        status.toLowerCase() == 'published' ||
        status.toLowerCase() == 'pre-award' ||
        status.toLowerCase() == 'awarded' ||
        status.toLowerCase() == 'complete'
      ) {
        //Supplier of interest
        const supplierInterestURL = `tenders/projects/${projectId}/events/${eventId}/responses`;

        const supplierdata = await TenderApi.Instance(SESSION_ID).get(supplierInterestURL);

        //CAS-INFO-LOG
        LoggTracer.infoLogger(supplierdata, logConstant.getSupplierResponse, req);

        //Supplier score
        const supplierScoreURL = `tenders/projects/${projectId}/events/${eventId}/scores`;
        const supplierScore = await TenderApi.Instance(SESSION_ID).get(supplierScoreURL);

        //CAS-INFO-LOG
        LoggTracer.infoLogger(supplierdata, logConstant.getSupplierScore, req);

        let supplierDataList = [];
        supplierDataList = await GetLotSuppliers(req);

        for (let i = 0; i < supplierdata?.data?.responders?.length; i++) {
          const id = supplierdata.data.responders[i]?.supplier?.id;
          const score = supplierScore?.data?.filter((x: any) => x.organisationId == id)?.[0]?.score;
          if (supplierdata?.data?.responders[i]?.responseState == 'Submitted') {
            showallDownload = true;
          }
          const supplierDetailsObj = {} as SupplierDetails;

          //supplierDetailsObj.supplierName = supplierdata.data?.responders[i]?.supplier?.name;
          supplierDetailsObj.responseState = supplierdata.data?.responders[i]?.responseState;
          //supplierDetailsObj.responseDate = supplierdata.data?.responders[i]?.responseDate;
          supplierDetailsObj.responseDate =
            supplierdata.data?.responders[i]?.responseDate != undefined &&
            supplierdata.data?.responders[i]?.responseDate != null
              ? moment(supplierdata.data?.responders[i]?.responseDate, 'YYYY-MM-DD HH:mm').format('DD/MM/YYYY HH:mm')
              : '';
          supplierDetailsObj.score = score != undefined ? score : 0;
          supplierDetailsObj.rankFlag = false;
          const supplierFiltedData = supplierDataList?.filter((a: any) => a.organization.id == id)?.[0]?.organization;
          if (supplierFiltedData != undefined && supplierFiltedData != null) {
            supplierDetailsObj.supplierAddress = {} as SupplierAddress;
            supplierDetailsObj.supplierAddress =
              supplierFiltedData.address != undefined && supplierFiltedData.address != null
                ? supplierFiltedData?.address
                : null;
            supplierDetailsObj.supplierContactName =
              supplierFiltedData.contactPoint != undefined &&
              supplierFiltedData.contactPoint != null &&
              supplierFiltedData.contactPoint?.name != undefined &&
              supplierFiltedData.contactPoint?.name != null
                ? supplierFiltedData.contactPoint?.name
                : null;
            supplierDetailsObj.supplierContactEmail =
              supplierFiltedData.contactPoint != undefined ? supplierFiltedData.contactPoint?.email : null;
            supplierDetailsObj.supplierWebsite =
              supplierFiltedData.identifier != undefined && supplierFiltedData.identifier != null
                ? supplierFiltedData.identifier?.uri
                : null;
            supplierDetailsObj.supplierName =
              supplierFiltedData.name != undefined && supplierFiltedData.name != null ? supplierFiltedData.name : null;

            supplierDetailsObj.supplierId = id;
            supplierDetailsObj.supplierIdMain = id;
            supplierDetailsObj.supplierState = 'Unsuccessful';
            supplierDetailsDataList.push(supplierDetailsObj);
          }
          if (supplierdata.data?.responders[i]?.responseState?.trim().toLowerCase() == 'submitted') {
            showallDownload = true;
          }
        }
        supplierSummary = supplierdata?.data;
        supplierDetailsDataList.sort((a, b) => (Number(a.score) > Number(b.score) ? -1 : 1));
        //RANK
        let rankCount = 0;
        for (let i = 0; i < supplierDetailsDataList.length; i++) {
          const element = supplierDetailsDataList[i];
          if (!element.rankFlag) {
            rankCount = rankCount + 1;
            const sameScoreFound = supplierDetailsDataList.filter((x) => x.score == element.score);
            if (sameScoreFound != undefined && sameScoreFound != null && sameScoreFound.length > 1) {
              for (let index = 0; index < sameScoreFound.length; index++) {
                const indexNumber = supplierDetailsDataList.findIndex(
                  (x) => x.supplierId == sameScoreFound[index].supplierId
                );
                if (indexNumber != undefined && indexNumber != null && indexNumber >= 0) {
                  supplierDetailsDataList[indexNumber].rank = '' + rankCount + '=';
                  supplierDetailsDataList[indexNumber].rankFlag = true;
                }
              }
            } else {
              supplierDetailsDataList[i].rank = '' + rankCount;
              supplierDetailsDataList[i].rankFlag = true;
            }
          }
        }

        // for (let i = 0; i < supplierDetailsDataList.length; i++) {
        //   if (supplierDetailsDataList[i].responseState.toLowerCase() == "submitted") {
        //     rankCount = rankCount + 1
        //     supplierDetailsDataList[i].rank = "" + rankCount;
        //   }
        // }
        //Awarded,pre_awarded and complete supplier info

        if (
          status.toLowerCase() == 'pre-award' ||
          status.toLowerCase() == 'awarded' ||
          status.toLowerCase() == 'complete'
        ) {
          let supplierState = 'PRE_AWARD';
          if (status.toLowerCase() == 'awarded' || status.toLowerCase() == 'complete') {
            supplierState = 'AWARD';
          }

          if (eventType != 'EOI' && eventType != 'RFI') {
            const supplierAwardDetailURL = `tenders/projects/${projectId}/events/${eventId}/awards?award-state=${supplierState}`;

            const supplierAwardDetail = await (await TenderApi.Instance(SESSION_ID).get(supplierAwardDetailURL)).data;

            //CAS-INFO-LOG
            LoggTracer.infoLogger(supplierAwardDetail, logConstant.getSupplierAwardDetails, req);

            if (supplierDetailsDataList.length > 0) {
              supplierAwardDetail?.suppliers?.map((item: any) => {
                const supplierDataIndex = supplierDetailsDataList.findIndex((x) => x.supplierId == item.id);
                if (supplierDataIndex != undefined && supplierDataIndex != null && supplierDataIndex >= 0) {
                  supplierDetailsDataList[supplierDataIndex].supplierState = 'Awarded';
                  supplierDetails = supplierDetailsDataList.filter((x) => x.supplierId == item.id)[0];
                }
              });

              if (agreementId_session == 'RM1043.8') {
                supplierDetails.supplierAwardedDate = moment(supplierAwardDetail?.date, 'YYYY-MM-DD, hh:mm a').format(
                  'DD/MM/YYYY hh:mm'
                );
              } else {
                supplierDetails.supplierAwardedDate = moment(supplierAwardDetail?.date, 'YYYY-MM-DD, hh:mm a').format(
                  'DD/MM/YYYY'
                );
              }
            }
          }

          if (status.toLowerCase() == 'pre-award') {
            supplierDetails.standStillFlag = true;
            let currentDate = new Date(supplierAwardDetail?.date);
            //Standstill dates are current date +10 days.
            currentDate.setDate(currentDate.getDate() + 10);
            currentDate = checkWeekendDate(currentDate);

            const bankHolidayUrl = 'https://www.gov.uk/bank-holidays.json';
            const bankHoliDayData = await (await TenderApi.Instance(SESSION_ID).get(bankHolidayUrl)).data;
            const listOfHolidayDate = bankHoliDayData['england-and-wales']?.events.concat(
              bankHoliDayData['scotland']?.events,
              bankHoliDayData['northern-ireland']?.events
            );

            currentDate = checkBankHolidayDate(currentDate, listOfHolidayDate);
            supplierDetails.supplierStandStillDate = moment(currentDate).format('DD/MM/YYYY');

            const todayDate = new Date();
            const standStillDate = new Date(currentDate);

            const d1 = todayDate.getFullYear() + '-' + todayDate.getMonth() + '-' + todayDate.getDate();
            const d2 = standStillDate.getFullYear() + '-' + standStillDate.getMonth() + '-' + standStillDate.getDate();
            if (new Date(d1) > new Date(d2)) {
              supplierDetails.standStillFlag = false;
            }
          }
        }
        //to get signed awarded contrct end date
        if (status.toLowerCase() == 'complete' && eventType != 'RFI' && eventType != 'EOI') {
          const contractURL = `tenders/projects/${projectId}/events/${eventId}/contracts`;

          const scontractAwardDetail = await (await TenderApi.Instance(SESSION_ID).get(contractURL)).data;
          if (agreementId_session == 'RM1043.8') {
            supplierDetails.supplierSignedContractDate = moment(
              scontractAwardDetail?.dateSigned,
              'YYYY-MM-DD, hh:mm a'
            ).format('DD/MM/YYYY hh:mm');
          } else {
            supplierDetails.supplierSignedContractDate = moment(scontractAwardDetail?.dateSigned).format('DD/MM/YYYY');
          }
        }
      }

      //Get Q&A Count
      const baseQandAURL = `/tenders/projects/${req.session.projectId}/events/${req.session.eventId}/q-and-a`;

      const fetchData = await TenderApi.Instance(SESSION_ID).get(baseQandAURL);
      let qasCount = 0;
      if (fetchData.data != undefined) {
        qasCount = fetchData.data.QandA;
        qasCount = qasCount.length;
      }
      let showCloseProject = true;
      if (status.toLowerCase() == 'awarded' || status.toLowerCase() == 'complete') {
        showCloseProject = false;
      }
      const procurementId = req.session['projectId'];
      const collaboratorsBaseUrl = `/tenders/projects/${procurementId}/users`;
      let collaboratorData = await DynamicFrameworkInstance.Instance(SESSION_ID).get(collaboratorsBaseUrl);
      collaboratorData = collaboratorData.data;

      let filtervalues = '';
      try {
        if (end_date != undefined && end_date != null) {
          const day = end_date.substr(0, 10);
          const time = end_date.substr(11, 5);

          filtervalues = moment(day + '' + time, 'YYYY-MM-DD HH:mm').format('DD MMMM YYYY, HH:mm');
        }
      } catch (error) {
        LoggTracer.errorLogger(
          res,
          error,
          `${req.headers.host}${req.originalUrl}`,
          null,
          TokenDecoder.decoder(SESSION_ID),
          'Event Management - Date is Invalid',
          true
        );
      }
      req.session.projectStatus = 1;

      const appendData = {
        agreementId_session: agreementId_session,
        projectStatus: 1,
        documentTemplatesUnSuccess: '',
        supplierDetails,
        data: eventManagementData,
        filtervalues,
        Colleagues: collaboratorData,
        status,
        projectName,
        eventId,
        eventType,
        apidata,
        end_date,
        supplierDetailsDataList,
        supplierSummary,
        showallDownload,
        QAs: qasCount,
        suppliers: localData,
        unreadMessage: unreadMessage,
        showCloseProject,
      };

      let redirectUrl: string;
      if (status.toLowerCase() == 'in-progress') {
        switch (eventType) {
        case 'RFI':
          redirectUrl = '/rfi/rfi-tasklist';
          break;
        case 'EOI':
          redirectUrl = '/eoi/eoi-tasklist';
          break;
        case 'DA':
          if (agreementId_session == 'RM6263') {
            //DSP
            redirectUrl = '/rfp/task-list';
          } else {
            //MCF3
            redirectUrl = '/da/task-list';
          }
          req.session.selectedeventtype = 'DA';
          break;
        case 'FC':
          redirectUrl = '/rfp/task-list';
          break;
        default:
          redirectUrl = '/event/management';
          break;
        }
        res.redirect(redirectUrl);
      } else if (status.toLowerCase() == 'assessment') {
        switch (eventType) {
        case 'DAA':
          redirectUrl = '/da/task-list?path=B1';
          break;
        case 'FCA':
          redirectUrl = '/ca/task-list?path=A1';
          break;
        case 'PA':
          redirectUrl = '/projects/routeToCreateSupplier';
          break;
        default:
          redirectUrl = '/event/management';
          break;
        }
        res.redirect(redirectUrl);
      } else if (status.toLowerCase() == 'unknown') {
        switch (eventType) {
        case 'TBD': {
          const { eventId, projectId, procurements } = req.session;
          const currentProcNum = procurements.findIndex(
            (proc: any) => proc.eventId === eventId && proc.procurementID === projectId
          );
          req.session.procurements[currentProcNum].started = false;
          redirectUrl = '/projects/create-or-choose';
          break;
        }
        default:
          redirectUrl = '/event/management';
          break;
        }
        res.redirect(redirectUrl);
      } else {
        if (
          (status != undefined && status.toLowerCase() == 'pre-award') ||
          status.toLowerCase() == 'awarded' ||
          status.toLowerCase() == 'complete'
        ) {
          //CAS-INFO-LOG
          LoggTracer.infoLogger(null, logConstant.awardPageLogger, req);
        } else {
          //CAS-INFO-LOG
          LoggTracer.infoLogger(null, logConstant.publishPageLogger, req);
        }

        let redirectUrl_: string;
        switch (eventType) {
        case 'RFI':
          if (
            (status != undefined && status.toLowerCase() == 'pre-award') ||
              status.toLowerCase() == 'awarded' ||
              status.toLowerCase() == 'complete'
          ) {
            res.render('awardEventManagement', appendData);
          } else {
            res.render('eventManagement', appendData);
          }
          break;
        case 'EOI':
          if (
            (status != undefined && status.toLowerCase() == 'pre-award') ||
              status.toLowerCase() == 'awarded' ||
              status.toLowerCase() == 'complete'
          ) {
            res.render('awardEventManagement', appendData);
          } else {
            res.render('eventManagement', appendData);
          }
          break;
        case 'FC':
          req.session.selectedeventtype = 'FC';
          if (
            (status != undefined && status.toLowerCase() == 'pre-award') ||
              status.toLowerCase() == 'awarded' ||
              status.toLowerCase() == 'complete'
          ) {
            //Awards/templates
            const awardsTemplatesURL = `tenders/projects/${projectId}/events/${eventId}/awards/templates`;
            const awardsTemplatesData = await (await TenderApi.Instance(SESSION_ID).get(awardsTemplatesURL))?.data;
            let documentTemplatesUnSuccess = '';
            for (let i = 0; i < awardsTemplatesData.length; i++) {
              if (awardsTemplatesData[i].description.includes('UnSuccessful')) {
                documentTemplatesUnSuccess = awardsTemplatesData[i].id;
              }
            }
            appendData.documentTemplatesUnSuccess = documentTemplatesUnSuccess;
            res.render('awardEventManagement', appendData);
          } else {
            const stage2BaseUrl = `/tenders/projects/${projectId}/events`;
            const stage2_dynamic_api = await TenderApi.Instance(SESSION_ID).get(stage2BaseUrl);
            const stage2_dynamic_api_data = stage2_dynamic_api.data;

            //CAS-INFO-LOG
            //LoggTracer.infoLogger(stage2_dynamic_api, logConstant.fetchEventDetails, req);

            const stage2_data = stage2_dynamic_api_data?.filter(
              (anItem: any) =>
                anItem.id == eventId && (anItem.templateGroupId == '13' || anItem.templateGroupId == '14')
            );

            let stage2_value = 'Stage 1';
            if (stage2_data.length > 0) {
              stage2_value = 'Stage 2';
            }

            if (agreementId_session === 'RM1043.8') {
              appendData.stage2_value = stage2_value;
              res.render('eventManagementDOS', appendData);
            } else {
              res.render('eventManagement', appendData);
            }
            // res.render('eventManagementDOS', appendData)
          }
          break;
        case 'DA':
          req.session.selectedeventtype = 'DA';
          if (
            (status != undefined && status.toLowerCase() == 'pre-award') ||
              status.toLowerCase() == 'awarded' ||
              status.toLowerCase() == 'complete'
          ) {
            res.render('awardEventManagement', appendData);
          } else {
            res.render('eventManagement', appendData);
          }
          break;
        default:
          redirectUrl_ = '/event/management';
          res.redirect(redirectUrl_);
          break;
        }
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
      true
    );
  }
};

export const EVENT_MANAGEMENT_DOWNLOAD = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { agreement_header, releatedContent } = req.session;
  let { projectId, eventId } = req.session;
  //let { projectId, eventId, agreement_header } = req.session;
  const { supplierid, reviewsupplierid, Type } = req.query;
  const events = req.session.openProjectActiveEvents;

  const baseurl = `/tenders/projects/${projectId}/events`;
  const apidata = await TenderApi.Instance(SESSION_ID).get(baseurl);
  //status = apidata.data.filter((d: any) => d.id == eventId)[0].dashboardStatus;

  let stage2_value = 'Stage 1';
  try {
    const stage2BaseUrl = `/tenders/projects/${projectId}/events`;
    const stage2_dynamic_api = await TenderApi.Instance(SESSION_ID).get(stage2BaseUrl);
    const stage2_dynamic_api_data = stage2_dynamic_api.data;
    const stage2_data = stage2_dynamic_api_data?.filter(
      (anItem: any) => anItem.id == eventId && (anItem.templateGroupId == '13' || anItem.templateGroupId == '14')
    );
    if (stage2_data.length > 0) stage2_value = 'Stage 2';
  } catch (e) {
    // Do nothing if there is an error
  }

  let title: string,
    lotid: string,
    agreementId_session: string,
    agreementName: string,
    agreementLotName: string,
    projectName: string,
    status: string,
    eventType: string;
  const supplierDetails = {} as SupplierDetails;
  try {
    if (supplierid != undefined) {
      const FileDownloadURL = `/tenders/projects/${projectId}/events/${eventId}/responses/${supplierid}/export`;
      const FetchDocuments = await DynamicFrameworkInstance.file_dowload_Instance(SESSION_ID).get(FileDownloadURL, {
        responseType: 'arraybuffer',
      });
      const file = FetchDocuments;
      const fileName = file.headers['content-disposition'].split('filename=')[1].split('"').join('');
      const fileData = file.data;
      const type = file.headers['content-type'];
      const ContentLength = file.headers['content-length'];
      res.status(200);
      res.set({
        'Cache-Control': 'no-cache',
        'Content-Type': type,
        'Content-Length': ContentLength,
        'Content-Disposition': 'attachment; filename=' + fileName,
      });
      res.send(fileData);
    }
    if (reviewsupplierid != undefined) {
      //Supplier score
      events.forEach(
        (element: {
          activeEvent: {
            id: string | ParsedQs | string[] | ParsedQs[];
            status: string;
            eventType: string;
            title: string;
          };
          agreementName: string;
          lotName: string;
          agreementId: string;
          projectName: string;
          projectId: string;
          lotId: string;
        }) => {
          if (element.activeEvent.id == eventId) {
            agreementName = element.agreementName;
            agreementLotName = element.lotName;
            agreementId_session = element.agreementId;
            status = element?.activeEvent?.status?.toLowerCase();
            projectName = element.projectName;
            eventId = element.activeEvent.id.toString();
            eventType = element.activeEvent.eventType;
            projectId = element.projectId;
            lotid = element.lotId;
            title = element.activeEvent.title;
          }
        }
      );
      const supplierScoreURL = `tenders/projects/${projectId}/events/${eventId}/scores`;
      const supplierScore = await TenderApi.Instance(SESSION_ID).get(supplierScoreURL);
      //Supplier of interest
      const supplierInterestURL = `tenders/projects/${projectId}/events/${eventId}/responses`;
      const supplierdata = await TenderApi.Instance(SESSION_ID).get(supplierInterestURL);

      //let showallDownload = false;
      for (let i = 0; i < supplierdata?.data?.responders?.length; i++) {
        const id = supplierdata.data.responders[i].supplier.id;
        if (id == reviewsupplierid) {
          const score = supplierScore?.data?.filter((x: any) => x.organisationId == id)[0];
          supplierDetails.supplierName = supplierdata.data.responders[i].supplier.name;
          supplierDetails.responseState = supplierdata.data.responders[i].responseState;
          supplierDetails.responseDate = supplierdata.data.responders[i].responseDate;
          supplierDetails.score = score != undefined ? score.score : 0;
          supplierDetails.supplierId = id;
          supplierDetails.eventId = eventId.toString();
          supplierDetails.supplierFeedBack = score != undefined ? score.comment : '';
        }
      }
      //SELECTED EVENT DETAILS FILTER FORM LIST
      const baseurl = `/tenders/projects/${projectId}/events`;
      const apidata = await TenderApi.Instance(SESSION_ID).get(baseurl);
      //status=apidata.data[0].dashboardStatus;
      const selectedEventData = apidata.data.filter((d: any) => d.id == eventId);
      status = selectedEventData[0].dashboardStatus;
      //Page navigation
      let redirectUrl = '/event/management?id=' + eventId;
      if (status == 'COMPLETE') {
        redirectUrl = '/event/management_close?id=' + eventId;
      }
      //const pageType = req.session['pageType'];
      if (Type != undefined && Type != null) {
        switch (Type) {
        case 'confirmSupplier':
          redirectUrl = '/confirm-supplier?supplierid=' + reviewsupplierid;
          break;
        case 'supplierDocument':
          redirectUrl = '/award-supplier-document?supplierId=' + reviewsupplierid;
          break;
        case 'awardSupplier':
          redirectUrl = '/award-supplier?supplierId=' + reviewsupplierid;
          break;
        default:
          // redirectUrl = '/event/management?id='+eventId
          break;
        }
      }

      const appendData = {
        agreement_header,
        agreementId_session,
        lotid,
        title,
        agreementName,
        agreementLotName,
        status,
        supplierDetails,
        data: eventManagementData,
        projectName,
        eventId,
        eventType,
        redirectUrl,
        releatedContent,
        stage2_value,
      };

      //CAS-INFO-LOG
      LoggTracer.infoLogger(null, logConstant.reviewYourSupplierEvaluationPageLogg, req);

      //Rendor method
      res.render('evaluateSuppliersReadonly', appendData);
    } else {
      const FileDownloadURL = `/tenders/projects/${projectId}/events/${eventId}/responses/export`;
      const FetchDocuments = await DynamicFrameworkInstance.file_dowload_Instance(SESSION_ID).get(FileDownloadURL, {
        responseType: 'arraybuffer',
      });
      const file = FetchDocuments;
      const fileName = file.headers['content-disposition'].split('filename=')[1].split('"').join('');
      const fileData = file.data;
      const type = file.headers['content-type'];
      const ContentLength = file.headers['content-length'];
      res.status(200);
      res.set({
        'Cache-Control': 'no-cache',
        'Content-Type': type,
        'Content-Length': ContentLength,
        'Content-Disposition': 'attachment; filename=' + fileName,
      });
      res.send(fileData);
    }
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Event management - Tenders Service Api cannot be connected',
      true
    );
  }
};
//publisheddoc?download=1
export const PUBLISHED_PROJECT_DOWNLOAD = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId } = req.session;
  const { eventId } = req.session;
  const { download } = req.query;

  try {
    if (download != undefined) {
      const FileDownloadURL = `/tenders/projects/${projectId}/events/${eventId}/documents/export`;
      const FetchDocuments = await DynamicFrameworkInstance.file_dowload_Instance(SESSION_ID).get(FileDownloadURL, {
        responseType: 'arraybuffer',
      });

      const file = FetchDocuments;
      const fileName = file.headers['content-disposition'].split('filename=')[1].split('"').join('');
      const fileData = file.data;
      const type = file.headers['content-type'];
      const ContentLength = file.headers['content-length'];
      res.status(200);
      res.set({
        'Cache-Control': 'no-cache',
        'Content-Type': type,
        'Content-Length': ContentLength,
        'Content-Disposition': 'attachment; filename=' + fileName,
      });
      res.send(fileData);
    }
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Event management - Tenders Service Api cannot be connected',
      true
    );
  }
};

//supplieranswer?supplierid=1
export const SUPPLIER_ANSWER_DOWNLOAD = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId } = req.session;
  const { eventId } = req.session;
  const { supplierid } = req.query;

  try {
    if (supplierid != undefined) {
      // /tenders/projects/{proc-id}/events/{event-id}/responses/{supplier-id]}/documents
      const FileDownloadURL = `/tenders/projects/${projectId}/events/${eventId}/responses/${supplierid}/export`;
      const FetchDocuments = await DynamicFrameworkInstance.file_dowload_Instance(SESSION_ID).get(FileDownloadURL, {
        responseType: 'arraybuffer',
      });
      const file = FetchDocuments;
      const fileName = file.headers['content-disposition'].split('filename=')[1].split('"').join('');
      const fileData = file.data;
      const type = file.headers['content-type'];
      const ContentLength = file.headers['content-length'];
      res.status(200);
      res.set({
        'Cache-Control': 'no-cache',
        'Content-Type': type,
        'Content-Length': ContentLength,
        'Content-Disposition': 'attachment; filename=' + fileName,
      });
      res.send(fileData);
    }
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Event management - Tenders Service Api cannot be connected',
      true
    );
  }
};

//supplieranswerall?supplierid=1
export const SUPPLIER_ANSWER_DOWNLOAD_ALL = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId } = req.session;
  const { eventId } = req.session;
  const { supplierid, download_all } = req.query;

  try {
    if (supplierid != undefined) {
      const FileDownloadURL = `/tenders/projects/${projectId}/events/${eventId}/responses/${supplierid}/export`;

      const FetchDocuments = await DynamicFrameworkInstance.file_dowload_Instance(SESSION_ID).get(FileDownloadURL, {
        responseType: 'arraybuffer',
      });

      const file = FetchDocuments;
      const fileName = file.headers['content-disposition'].split('filename=')[1].split('"').join('');
      const fileData = file.data;
      const type = file.headers['content-type'];
      const ContentLength = file.headers['content-length'];
      res.status(200);
      res.set({
        'Cache-Control': 'no-cache',
        'Content-Type': type,
        'Content-Length': ContentLength,
        'Content-Disposition': 'attachment; filename=' + fileName,
      });
      res.send(fileData);
    } else if (download_all != undefined) {
      //Download all for awarded supplier
      //`/tenders/projects/${projectId}/events/${eventId}/awards/templates/export`
      const FileDownloadURL = `/tenders/projects/${projectId}/events/${eventId}/responses/export`;

      const FetchDocuments = await DynamicFrameworkInstance.file_dowload_Instance(SESSION_ID).get(FileDownloadURL, {
        responseType: 'arraybuffer',
      });
      const file = FetchDocuments;
      const fileName = file.headers['content-disposition'].split('filename=')[1].split('"').join('');
      const fileData = file.data;
      const type = file.headers['content-type'];
      const ContentLength = file.headers['content-length'];
      res.status(200);
      res.set({
        'Cache-Control': 'no-cache',
        'Content-Type': type,
        'Content-Length': ContentLength,
        'Content-Disposition': 'attachment; filename=' + fileName,
      });
      res.send(fileData);
    }
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Event management - Tenders Service Api cannot be connected',
      true
    );
  }
};

//unsuccessful?download=1
export const UNSUCCESSFUL_SUPPLIER_DOWNLOAD = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId } = req.session;
  const { eventId } = req.session;
  const { download } = req.query;

  try {
    if (download != undefined) {
      const awardsTemplatesURL = `tenders/projects/${projectId}/events/${eventId}/awards/templates`;
      const awardsTemplatesData = await (await TenderApi.Instance(SESSION_ID).get(awardsTemplatesURL))?.data;
      let documentTemplatesUnSuccess = '';
      for (let i = 0; i < awardsTemplatesData.length; i++) {
        if (awardsTemplatesData[i].description.includes('UnSuccessful')) {
          documentTemplatesUnSuccess = awardsTemplatesData[i].id;
        }
      }
      let fileDownloadURL = '';
      if (download == 2 && documentTemplatesUnSuccess != '') {
        fileDownloadURL =
          `/tenders/projects/${projectId}/events/${eventId}/awards/templates/` + documentTemplatesUnSuccess;
      } else {
        fileDownloadURL = `/tenders/projects/${projectId}/events/${eventId}/awards/templates/export`;
      }
      const FetchDocuments = await DynamicFrameworkInstance.file_dowload_Instance(SESSION_ID).get(fileDownloadURL, {
        responseType: 'arraybuffer',
      });
      const file = FetchDocuments;
      const fileName = file.headers['content-disposition'].split('filename=')[1].split('"').join('');
      const fileData = file.data;
      const type = file.headers['content-type'];
      const ContentLength = file.headers['content-length'];
      res.status(200);
      res.set({
        'Cache-Control': 'no-cache',
        'Content-Type': type,
        'Content-Length': ContentLength,
        'Content-Disposition': 'attachment; filename=' + fileName,
      });
      res.send(fileData);
    }
  } catch (error) {
    console.log('catcherr1', error);
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Event management - Tenders Service Api cannot be connected',
      true
    );
  }
};

//supplieranswer?download=1
export const SUPPLIER_EVALUATION = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId } = req.session;
  const { eventId } = req.session;
  const { download, supplierid } = req.query;

  try {
    if (supplierid != undefined) {
      const FileDownloadURL = `/tenders/projects/${projectId}/events/${eventId}/responses/${supplierid}/export`;

      const FetchDocuments = await DynamicFrameworkInstance.file_dowload_Instance(SESSION_ID).get(FileDownloadURL, {
        responseType: 'arraybuffer',
      });

      const file = FetchDocuments;
      const fileName = file.headers['content-disposition'].split('filename=')[1].split('"').join('');
      const fileData = file.data;
      const type = file.headers['content-type'];
      const ContentLength = file.headers['content-length'];
      res.status(200);
      res.set({
        'Cache-Control': 'no-cache',
        'Content-Type': type,
        'Content-Length': ContentLength,
        'Content-Disposition': 'attachment; filename=' + fileName,
      });
      res.send(fileData);
    } else if (download != undefined) {
      const FileDownloadURL = `/tenders/projects/${projectId}/events/${eventId}/responses/export`;
      const FetchDocuments = await DynamicFrameworkInstance.file_dowload_Instance(SESSION_ID).get(FileDownloadURL, {
        responseType: 'arraybuffer',
      });
      const file = FetchDocuments;
      const fileName = file.headers['content-disposition'].split('filename=')[1].split('"').join('');
      const fileData = file.data;
      const type = file.headers['content-type'];
      const ContentLength = file.headers['content-length'];
      res.status(200);
      res.set({
        'Cache-Control': 'no-cache',
        'Content-Type': type,
        'Content-Length': ContentLength,
        'Content-Disposition': 'attachment; filename=' + fileName,
      });
      res.send(fileData);
    }
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Event management - Tenders Service Api cannot be connected',
      true
    );
  }
};

//confirm-supplier-award
export const CONFIRM_SUPPLIER_AWARD = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId, eventId } = req.session;
  const { pre_award_supplier_confirmation, supplier_id, status_flag } = req.body;

  try {
    if (pre_award_supplier_confirmation != undefined && pre_award_supplier_confirmation === '1') {
      if (status_flag != undefined && status_flag === 'AWARDED') {
        const signedURL = `tenders/projects/${projectId}/events/${eventId}/contracts`;
        const putBody = {
          awardID: '1',
          status: 'active',
        };

        const response = await TenderApi.Instance(SESSION_ID).post(signedURL, putBody);
        if (response.status == Number(HttpStatusCode.OK)) {
          res.redirect('/event/management?id=' + eventId);
        }
      } else {
        const awardURL = `tenders/projects/${projectId}/events/${eventId}/awards/1?award-state=AWARD`;

        const putBody = {
          suppliers: [
            {
              id: supplier_id,
            },
          ],
        };

        const response = await TenderApi.Instance(SESSION_ID).put(awardURL, putBody);
        if (response.status == Number(HttpStatusCode.OK)) {
          res.redirect('/event/management?id=' + eventId);
        }
      }
    } else {
      req.session['isError'] = true;
      res.redirect('/event/management?id=' + eventId);
    }
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Event management - Tenders Service Api cannot be connected',
      true
    );
  }
};

export const EVENT_STATE_CHANGE = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId, eventId } = req.session;
  const { StateChange } = req.query;

  try {
    if (StateChange != undefined) {
      // const StateChangeDownloadURL = `/tenders/projects/${projectId}/events/${eventId}/responses/export`;
      // await DynamicFrameworkInstance.file_dowload_Instance(SESSION_ID).get(StateChangeDownloadURL, {
      //   responseType: 'arraybuffer',
      // });

      res.redirect('/evaluate-suppliers');
      //res.redirect('/event/management?id='+eventId)
    }
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Event management - Tenders Service Api cannot be connected',
      true
    );
  }
};

export const RETURN_EVENTMANAGEMENT = async (req: express.Request, res: express.Response) => {
  const { eventId } = req.session;
  const redirectUrl = '/event/management?id=' + eventId;
  res.redirect(redirectUrl);
};

export const INVITE_SUPPLIERS = async (req: express.Request, res: express.Response) => {
  try {
    const { eventId } = req.session;
    if (req.body.invite_suppliers !== undefined) {
      req.session.invite_suppliers = req.body.invite_suppliers;
    }
    const redirectUrl = '/event/selected-suppliers';
    res.redirect(redirectUrl);
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Event management - Tenders Service Api cannot be connected',
      true
    );
  }
};

export const INVITE_SELECTED_SUPPLIERS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;

  try {
    const releatedContent = req.session.releatedContent;
    const project_name = req.session.Projectname;
    const projectId = req.session.projectId;
    const agreementName = req.session.agreementName;
    const agreementId_session = req.session.agreement_id;
    const agreementLotName = req.session.agreementLotName;
    const lotid = req.session.lotId;
    const invite_suppliers = req.session.invite_suppliers;
    const eventId = req.session.eventId;
    // Event header
    res.locals.agreement_header = {
      projectName: project_name,
      projectId,
      agreementName,
      agreementIdSession: agreementId_session,
      agreementLotName,
      lotid,
    };
    const supplierIDS = invite_suppliers.split(',');
    const uniqSuppliers = supplierIDS.filter((value: any, index: any, self: any) => {
      return self.indexOf(value) === index;
    });
    const supplierList = await GetLotSuppliers(req);
    const supplierData = [];
    if (uniqSuppliers.length > 0) {
      for (let i = 0; i < uniqSuppliers.length; i++) {
        const supplierInfo = supplierList.filter((s: any) => s.organization.id == uniqSuppliers[i].trim())?.[0];
        if (supplierInfo != undefined) {
          supplierData.push({ supplierName: supplierInfo.organization.name, id: uniqSuppliers[i] });
        }
      }
    }

    const appendData: any = {
      releatedContent: releatedContent,
      supplierData,
      eventId,
      agreementId_session,
      lotid,
    };

    //CAS-INFO-LOG
    LoggTracer.infoLogger(null, logConstant.inviteSelectedSuppliersPageLogg, req);

    res.render('selectedSuppliers', appendData);
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Event management - Tenders Service Api cannot be connected',
      true
    );
  }
};

export const SAVE_INVITE_SELECTED_SUPPLIERS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  try {
    const { eventId, projectId, invite_suppliers } = req.session;
    let justifications;
    if (req.body.justification !== undefined) {
      justifications = req.body.justification;
    }
    const justification = justifications.replace(/[\r\n]/gm, '');
    const supplierIDS = invite_suppliers.split(',');
    const uniqSuppliers = supplierIDS.filter((value: any, index: any, self: any) => {
      return self.indexOf(value) === index;
    });
    const supplierList = await GetLotSuppliers(req);
    const supplierData = [];
    if (uniqSuppliers.length > 0) {
      for (let i = 0; i < uniqSuppliers.length; i++) {
        const supplierInfo = supplierList.filter((s: any) => s.organization.id == uniqSuppliers[i].trim())?.[0];
        if (supplierInfo != undefined) {
          supplierData.push({ name: supplierInfo.organization.name, id: uniqSuppliers[i].trim() });
        }
      }
    }

    const supplierBody = {
      suppliers: supplierData,
      justification: justification,
      overwriteSuppliers: true,
    };

    const BASEURL = `/tenders/projects/${projectId}/events/${eventId}/suppliers`;
    const response = await TenderApi.Instance(SESSION_ID).post(BASEURL, supplierBody);

    //CAS-INFO-LOG
    LoggTracer.infoLogger(response, logConstant.inviteSelectedSuppliers, req);

    if (response.status == Number(HttpStatusCode.OK)) {
      req.session.selectedRoute = 'FC';
      const currentProcIndex = req.session.procurements.findIndex(
        (proc: any) => proc.eventId === eventId && proc.procurementID === projectId
      );
      req.session.procurements[currentProcIndex].started = false;
      req.session.dosStage = 'Stage 2';
      res.redirect('/rfp/task-list');
    } else {
      res.redirect('/event/management?id=' + eventId);
    }
  } catch (error) {
    console.log(error);

    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Event management - Tenders Service Api cannot be connected',
      true
    );
  }
};

export const START_EVALUATION = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId, eventId } = req.session;
  try {
    const BASEURL = `/tenders/projects/${projectId}/events/${eventId}/startEvaluation`;
    TenderApi.Instance(SESSION_ID).post(BASEURL);
    res.redirect('/start-evaluation-redirect');
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Event management - Start Evaluation Endpoit issue',
      true
    );
  }
};

const getEventStatusApis = async (sessionId: string, projectId: string): Promise<any> => {
  const baseurl = `/tenders/projects/${projectId}/events`;
  const rawData = await TenderApi.Instance(sessionId)
    .get(baseurl)
    .then((x) => new Promise((resolve) => setTimeout(() => resolve(x), 10000)));
  return rawData.data;
};

export const START_EVALUATION_REDIRECT = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId, eventId } = req.session;
  try {
    let doRaw = true;

    do {
      let eventStatusRaw: any = [];
      eventStatusRaw = await getEventStatusApis(SESSION_ID, projectId);
      const statusOut = eventStatusRaw.filter((el: any) => el.id == eventId)[0].dashboardStatus;

      if (statusOut.toLowerCase() === 'evaluating') {
        doRaw = false;
      }
    } while (doRaw);

    if (!doRaw) {
      res.redirect('/event/management?id=' + eventId);
    }
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Event management - Start Evaluation Redirect Endpoit issue',
      true
    );
  }
};
