import * as express from 'express'
import { ParsedQs } from 'qs'
import { LoggTracer } from '@common/logtracer/tracer'
import { TokenDecoder } from '@common/tokendecoder/tokendecoder'
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance'
import { Procurement } from '../../procurement/model/project';
import { ReleatedContent } from '../../agreement/model/related-content'
import * as eventManagementData from '../../../resources/content/event-management/event-management.json'
import { Message } from '../model/messages'
import * as localData from '../../../resources/content/event-management/local-SOI.json' // replace this JSON with API endpoint
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { SupplierAddress, SupplierDetails } from '../model/supplierDetailsModel';
import { HttpStatusCode } from 'main/errors/httpStatusCodes';
import { AgreementAPI } from './../../../common/util/fetch/agreementservice/agreementsApiInstance';
import moment from 'moment-business-days';

/**
 * 
 * @Rediect 
 * @endpoint /event/management
 * @param req 
 * @param res 
 */

export const EVENT_MANAGEMENT = async (req: express.Request, res: express.Response) => {
  const { id, closeProj } = req.query
  const events = req.session.openProjectActiveEvents
  const { SESSION_ID } = req.cookies

  //LOCAL VERIABLE
  let supplierDetails = {} as SupplierDetails;
  let apidata: any = null;
  // const { eventId, projectId } = req.session
  //let newDate: any
  //let tempDate: any
  // const projectId = req.session['projectId']
  //const eventId = req.session['eventId']
  try {
    // Code Block start - Replace this block with API endpoint
    if (closeProj != undefined) {
      let baseCloseUrl = `/tenders/projects/${req.session.projectId}/events`;
      let closebody = {
        "name": "Further Competition Event",
        "eventType": "FCA"
      }
      const { data: closedata } = await TenderApi.Instance(SESSION_ID).post(baseCloseUrl, closebody);
      if (closedata != null && closedata != undefined) {
        req.session['eventId'] = closedata.id;
        req.session.procurements[0]['eventId'] = closedata.id;
        req.session.procurements[0]['eventType'] = closedata.eventType;
        req.session.procurements[0]['started'] = false;
      }

      //await TenderApi.Instance(SESSION_ID).put(`journeys/${eventIId}/steps/54`, 'Completed');
      res.redirect('/projects/create-or-choose');
    }
    else {
      let agreementName: string, agreementLotName: string, projectId: string, lotid: string, title: string, agreementId_session: string, projectName: string, status: string, eventId: string, eventType: string, end_date: string;
      //throwErr();
      events?.forEach((element: { activeEvent: { id: string | ParsedQs | string[] | ParsedQs[]; status: string; eventType: string; title: string; tenderPeriod: { startDate: string; endDate: string; } }; agreementName: string; lotName: string; agreementId: string; projectName: string; projectId: string; lotId: string; end_date: string; }) => {
        if (element.activeEvent.id == id) {
          agreementName = element.agreementName
          agreementLotName = element.lotName
          agreementId_session = element.agreementId
          status = element?.activeEvent?.status?.toLowerCase()
          projectName = element.projectName
          eventId = element.activeEvent.id.toString()
          eventType = element.activeEvent.eventType
          projectId = element.projectId
          lotid = element.lotId
          title = element.activeEvent.title
          end_date = element?.activeEvent?.tenderPeriod?.endDate
        }
      });

      
      let supplierDataList = [];
      try {
        //#region supplier information
        const baseurl_Supplier = `/agreements/${agreementId_session}/lots/${lotid}/suppliers`
        supplierDataList = await (await AgreementAPI.Instance.get(baseurl_Supplier)).data;
        //#endregion
      } catch (error) {
        LoggTracer.errorLogger(
          res,
          error,
          `${req.headers.host}${req.originalUrl}`,
          null,
          TokenDecoder.decoder(SESSION_ID),
          'Event management page suppliers API',
          true,
        );
      }

      try {
        const baseurl = `/tenders/projects/${projectId}/events`
        apidata = await TenderApi.Instance(SESSION_ID).get(baseurl)
        //status=apidata.data[0].dashboardStatus;
        status = apidata.data.filter((d: any) => d.id == eventId)[0].dashboardStatus;
        // Code Block ends 
      } catch (error) {
        LoggTracer.errorLogger(
          res,
          error,
          `${req.headers.host}${req.originalUrl}`,
          null,
          TokenDecoder.decoder(SESSION_ID),
          'Event management page events API-1',
          true,
        );
      }
      // Update procurement data into (redis) session
      const proc: Procurement = {
        procurementID: projectId,
        eventId: eventId,
        defaultName: {
          name: projectName,
          components: {
            agreementId: agreementId_session,
            lotId: lotid,
            org: "COGNIZANT BUSINESS SERVICES UK LIMITED",
          }
        },
        started: true
      }
      req.session.procurements.push(proc)
      // Added required session values for accessign the pre-market pages
      req.session.eventManagement_eventType = eventType
      req.session.agreement_id = agreementId_session
      req.session.agreementLotName = agreementLotName
      req.session.agreementName = agreementName
      req.session.lotId = lotid
      req.session['projectId'] = projectId
      req.session['eventId'] = eventId
      req.session['evetTitle'] = title
      req.session['Projectname'] = projectName
      req.session['project_name'] = projectName
      req.session.selectedeventtype = ''

      // Releated content session values
      const releatedContent: ReleatedContent = new ReleatedContent();
      releatedContent.name = agreementName
      releatedContent.lotName = lotid + " : " + agreementLotName
      releatedContent.lotUrl = "/agreement/lot?agreement_id=RM6263&lotNum=" + req.session.lotId.replace(/ /g, "%20");
      releatedContent.title = 'Related content'
      req.session.releatedContent = releatedContent

    
      //Related to AssessmentID
      let data: any = null;
      try {
        const baseURL = `tenders/projects/${projectId}/events/${eventId}`;
        data = await TenderApi.Instance(SESSION_ID).get(baseURL)
      } catch (error) {
        LoggTracer.errorLogger(
          res,
          error,
          `${req.headers.host}${req.originalUrl}`,
          null,
          TokenDecoder.decoder(SESSION_ID),
          'Event management page events API-2',
          true,
        );
      }
      const assessmentId = data.data.nonOCDS.assessmentId
      req.session.currentEvent = { assessmentId }

      // Event header
      res.locals.agreement_header = { project_name: projectName, agreementName, agreementId_session, agreementLotName, lotid }
      req.session.agreement_header = res.locals.agreement_header

      // Get unread Message count
      let message: any = null;
      try {
        const baseMessageURL = `/tenders/projects/${projectId}/events/${eventId}/messages?message-direction=RECEIVED`
        message = await TenderApi.Instance(SESSION_ID).get(baseMessageURL)
      } catch (error) {
        LoggTracer.errorLogger(
          res,
          error,
          `${req.headers.host}${req.originalUrl}`,
          null,
          TokenDecoder.decoder(SESSION_ID),
          'Event management page messages?message-direction=RECEIVED API',
          true,
        );
      }
     
      let unreadMessage = 0
      const msg: Message[] = message.data.messages
      if (message.data.counts != undefined) {
        msg.forEach(element => {
          if (!element.nonOCDS.read) {
            unreadMessage = unreadMessage + 1
          }
        });
      }
      //Supplier of interest
      let supplierdata: any = null;
      try {
        const supplierInterestURL = `tenders/projects/${projectId}/events/${eventId}/responses`
        supplierdata = await TenderApi.Instance(SESSION_ID).get(supplierInterestURL);

      } catch (error) {
        LoggTracer.errorLogger(
          res,
          error,
          `${req.headers.host}${req.originalUrl}`,
          null,
          TokenDecoder.decoder(SESSION_ID),
          'Event management page events-responses API',
          true,
        );
      }

      //Supplier score
      let supplierScore: any = null;
      try {
        const supplierScoreURL = `tenders/projects/${projectId}/events/${eventId}/scores`
        supplierScore = await TenderApi.Instance(SESSION_ID).get(supplierScoreURL)
      } catch (error) {
        LoggTracer.errorLogger(
          res,
          error,
          `${req.headers.host}${req.originalUrl}`,
          null,
          TokenDecoder.decoder(SESSION_ID),
          'Event management page events-scores API',
          true,
        );
      }
      let supplierDetailsDataList: SupplierDetails[] = [];
      let showallDownload = false;
      for (let i = 0; i < supplierdata?.data?.responders?.length; i++) {
        let id = supplierdata.data.responders[i]?.supplier?.id;
        let score = supplierScore?.data?.filter((x: any) => x.organisationId == id)[0]?.score
        if (supplierdata.data?.responders[i]?.responseState == 'Submitted') {
          showallDownload = true;
        }
        let supplierDetailsObj = {} as SupplierDetails;

        supplierDetailsObj.supplierName = supplierdata.data?.responders[i]?.supplier?.name;
        supplierDetailsObj.responseState = supplierdata.data?.responders[i]?.responseState;
        supplierDetailsObj.responseDate = supplierdata.data?.responders[i]?.responseDate;
        supplierDetailsObj.score = (score != undefined) ? score : 0;


        var supplierFiltedData = supplierDataList?.filter((a: any) => a.organization.id == id)[0];

        if (supplierFiltedData != null && supplierFiltedData != undefined) {
          supplierDetailsObj.supplierAddress = {} as SupplierAddress
          supplierDetailsObj.supplierAddress = supplierFiltedData.organization?.address
          supplierDetailsObj.supplierContactName = supplierFiltedData.organization?.contactPoint?.name;
          supplierDetailsObj.supplierContactEmail = supplierFiltedData.organization?.contactPoint.email;
          supplierDetailsObj.supplierWebsite = supplierFiltedData.organization?.contactPoint.url;
          supplierDetailsObj.supplierId = id;
          supplierDetailsObj.supplierState = "Unsuccessfull";

          supplierDetailsDataList.push(supplierDetailsObj);
        }

        if (supplierdata.data?.responders[i]?.responseState?.trim().toLowerCase() == 'submitted') {
          showallDownload = true;
        }
        //UNCOMMET THIS CODE WHEN AWARDED SUPPLIER INFORMATION COMING FROM JAGGER
        // if (id ==="") {
        //   supplierDetails=supplierDetailsObj;
        // }
      }
      const supplierSummary = supplierdata?.data;
      supplierDetailsDataList.sort((a, b) => (Number(a.score) > Number(b.score) ? -1 : 1));
     
      let rankCount = 0;
      for (let i = 0; i < supplierDetailsDataList.length; i++) {
        rankCount = rankCount + 1
        supplierDetailsDataList[i].rank = "" + rankCount;
      }
      //Awarded,pre_awarded and complete supplier info
      if (status.toLowerCase() == "pre-award" || status.toLowerCase() == "awarded" || status.toLowerCase() == "complete") {
        let supplierState = "PRE_AWARD"
        if (status.toLowerCase() == "awarded") {
          supplierState = "AWARD"
        }
        const supplierAwardDetailURL = `tenders/projects/${projectId}/events/${eventId}/awards?award-state=${supplierState}`
        const supplierAwardDetail = await (await TenderApi.Instance(SESSION_ID).get(supplierAwardDetailURL)).data;

        if (supplierDetailsDataList.length > 0) {
          supplierAwardDetail?.suppliers?.map((item: any) => {
            let supplierDataIndex = supplierDetailsDataList.findIndex(x => x.supplierId == item.id);
            if (supplierDataIndex != undefined && supplierDataIndex != null && supplierDataIndex >= 0) {
              supplierDetailsDataList[supplierDataIndex].supplierState = "Awarded";
              supplierDetails = supplierDetailsDataList.filter(x => x.supplierId == item.id)[0];
            }

          });
          supplierDetails.supplierAwardedDate = moment(supplierAwardDetail?.date, 'YYYY-MM-DD, hh:mm a',).format('DD/MM/YYYY HH:mm');
        }

        if (status.toLowerCase() == "pre-award") {

          supplierDetails.standStillFlag = true;
          let currentDate = new Date(supplierAwardDetail?.date);
          //Standstill dates are current date +10 days.
          currentDate.setDate(currentDate.getDate() + 10)
          // currentDate = checkWeekendDate(currentDate);
          //let bankHoliDayData: any = null;
          try {
            //const bankHolidayUrl = 'https://www.gov.uk/bank-holidays.json';
            //bankHoliDayData = await (await TenderApi.Instance(SESSION_ID).get(bankHolidayUrl)).data;
          } catch (error) {
            LoggTracer.errorLogger(
              res,
              error,
              `${req.headers.host}${req.originalUrl}`,
              null,
              TokenDecoder.decoder(SESSION_ID),
              'Event management page bank-holidays API',
              true,
            );
          }
          //const listOfHolidayDate = bankHoliDayData['england-and-wales']?.events.concat(bankHoliDayData['scotland']?.events, bankHoliDayData['northern-ireland']?.events);
          //currentDate = //checkBankHolidayDate(currentDate, listOfHolidayDate);
          supplierDetails.supplierStandStillDate = moment(currentDate).format('DD/MM/YYYY HH:mm');
          let todayDate = new Date();
          if (todayDate > new Date(supplierDetails.supplierStandStillDate)) {
            supplierDetails.standStillFlag = false;
          }
        }
      }
      
      //to get signed awarded contrct end date
      if (status.toLowerCase() == "complete") {
        let scontractAwardDetail: any = null;
        try {
          const contractURL = `tenders/projects/${projectId}/events/${eventId}/contracts`
          scontractAwardDetail = await (await TenderApi.Instance(SESSION_ID).get(contractURL)).data;
        } catch (error) {
          LoggTracer.errorLogger(
            res,
            error,
            `${req.headers.host}${req.originalUrl}`,
            null,
            TokenDecoder.decoder(SESSION_ID),
            'Event management page events API',
            true,
          );
        }
        supplierDetails.supplierSignedContractDate = moment(scontractAwardDetail?.dateSigned).format('DD MMMM YYYY');
      }
     
      if (supplierDetails != null && supplierDetails.supplierId != undefined && supplierDetails.supplierId != null) {
        let supplierResponse: any = null;
        try {
          const baseSuuplierURL = `/tenders/projects/${req.session.projectId}/events/${req.session.eventId}/suppliers/${supplierDetails.supplierId}`;
          supplierResponse = await TenderApi.Instance(SESSION_ID).get(baseSuuplierURL);
        } catch (error) {
          LoggTracer.errorLogger(
            res,
            error,
            `${req.headers.host}${req.originalUrl}`,
            null,
            TokenDecoder.decoder(SESSION_ID),
            'Event management page events-suppliers API',
            true,
          );
        }
        const supplierData = supplierResponse?.data;
        supplierDetails.supplierAddress = supplierData?.address;
        supplierDetails.supplierContactName = supplierData?.contactPoint.name;
        supplierDetails.supplierContactEmail = supplierData?.contactPoint?.email;
        //supplierDetails.supplierWebsite = supplierData?.website;
      }
     
      //if (status == "Published" || status == "Response period closed" || status == "Response period open" || status=="To be evaluated" ) {
      //Get Q&A Count
      let fetchData: any = null;
      try {
        const baseQandAURL = `/tenders/projects/${req.session.projectId}/events/${req.session.eventId}/q-and-a`;
        fetchData = await TenderApi.Instance(SESSION_ID).get(baseQandAURL);
      } catch (error) {
        LoggTracer.errorLogger(
          res,
          error,
          `${req.headers.host}${req.originalUrl}`,
          null,
          TokenDecoder.decoder(SESSION_ID),
          'Event management page events-q-and-a API',
          true,
        );
      }

      let showCloseProject = true;
      if (status.toLowerCase() == "awarded") {
        showCloseProject = false;
      }
      const procurementId = req.session['projectId'];
      let collaboratorData: any = null;
      try {
        const collaboratorsBaseUrl = `/tenders/projects/${procurementId}/users`;
        collaboratorData = await DynamicFrameworkInstance.Instance(SESSION_ID).get(collaboratorsBaseUrl);
        collaboratorData = collaboratorData.data;
      } catch (error) {
        LoggTracer.errorLogger(
          res,
          error,
          `${req.headers.host}${req.originalUrl}`,
          null,
          TokenDecoder.decoder(SESSION_ID),
          'Event management page /tenders/projects//users API',
          true,
        );
      }
    
      let filtervalues = "";
      try {
        //response date 

        // const apiData_baseURL = `/tenders/projects/${procurementId}/events/${eventId}/criteria/Criterion 1/groups/Key Dates/questions`;
        // const fetchQuestions = await DynamicFrameworkInstance.Instance(SESSION_ID).get(apiData_baseURL);
        // let fetchQuestionsData = fetchQuestions.data;

        // for (var l = 0; l < fetchQuestionsData.length; l++) {
        //   if (fetchQuestionsData[l].OCDS.id == 'Question 4') {
        //     var supplier_deadline = fetchQuestionsData[l].nonOCDS.options[0]?.value;
        //     if (supplier_deadline != undefined && supplier_deadline != null) {
        //       let day = supplier_deadline.substr(0, 10);
        //       let time = supplier_deadline.substr(11, 5);
        //       filtervalues = moment(day + "" + time, 'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY, hh:mm a')
        //     }
        //   }
        // }
        if (end_date != undefined && end_date != null) {
          let day = end_date.substr(0, 10);
          let time = end_date.substr(11, 5);
          filtervalues = moment(day + "" + time, 'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY, hh:mm a')
        }

      } catch (error) { }

      let appendData = { documentTemplatesUnSuccess: "", supplierDetails, data: eventManagementData, filtervalues, Colleagues: collaboratorData, status, projectName, eventId, eventType, apidata, end_date, supplierDetailsDataList, supplierSummary, showallDownload, QAs: fetchData.data, suppliers: localData, unreadMessage: unreadMessage, showCloseProject }
     
      let redirectUrl: string
      if (status.toLowerCase() == "in-progress") {
        switch (eventType) {
          case "RFI":
            redirectUrl = '/rfi/rfi-tasklist'
            break
          case "EOI":
            redirectUrl = '/eoi/eoi-tasklist'
            break
          case "DA":
            redirectUrl = '/rfp/task-list'
            req.session.selectedeventtype = "DA"
            break
          case "FC":
            redirectUrl = '/rfp/task-list'
            break
          default:
            redirectUrl = '/event/management'
            break
        }
       
        res.redirect(redirectUrl)
      }
      else if (status.toLowerCase() == 'assessment') {
        switch (eventType) {
          case "DAA":
            redirectUrl = '/da/task-list?path=B1'
            break
          case "FCA":
            redirectUrl = '/ca/task-list?path=A1'
            break
          default:
            redirectUrl = '/event/management'
            break
        }
       
        res.redirect(redirectUrl)
      } else if (status.toLowerCase() == 'unknown') {
        switch (eventType) {
          case "TBD":
            const { eventId, projectId, procurements } = req.session;
            const currentProcNum = procurements.findIndex(
              (proc: any) => proc.eventId === eventId && proc.procurementID === projectId,
            );
            req.session.procurements[currentProcNum].started = false;
            redirectUrl = '/projects/create-or-choose'
            break
          default:
            redirectUrl = '/event/management'
            break
        }
        
        res.redirect(redirectUrl)
      }
      else {
        let redirectUrl_: string
        switch (eventType) {
          case "RFI":
            if (status != undefined && status.toLowerCase() == "pre-award" || status.toLowerCase() == "awarded" || status.toLowerCase() == "complete") {
              res.render('awardEventManagement', appendData)
            }
            else {
              res.render('eventManagement', appendData)
            }
            break
          case "FC":
            if (status != undefined && status.toLowerCase() == "pre-award" || status.toLowerCase() == "awarded" || status.toLowerCase() == "complete") {
              //Awards/templates
              let awardsTemplatesData: any = null;
              try {
                const awardsTemplatesURL = `tenders/projects/${projectId}/events/${eventId}/awards/templates`
                awardsTemplatesData = await (await TenderApi.Instance(SESSION_ID).get(awardsTemplatesURL))?.data;

              } catch (error) {
                LoggTracer.errorLogger(
                  res,
                  error,
                  `${req.headers.host}${req.originalUrl}`,
                  null,
                  TokenDecoder.decoder(SESSION_ID),
                  'Event management page events//awards/templates API',
                  true,
                );
              }
              let documentTemplatesUnSuccess = "";
              for (let i = 0; i < awardsTemplatesData.length; i++) {
                if (awardsTemplatesData[i].description.includes("UnSuccessful")) {
                  documentTemplatesUnSuccess = awardsTemplatesData[i].id;
                }
              }
              appendData.documentTemplatesUnSuccess = documentTemplatesUnSuccess
              res.render('awardEventManagement', appendData);
            }
            else {
              res.render('eventManagement', appendData)
            }
            break
          case "DA":
            req.session.selectedeventtype = "DA"
            if (status != undefined && status.toLowerCase() == "pre-award" || status.toLowerCase() == "awarded" || status.toLowerCase() == "complete") {
              res.render('awardEventManagement', appendData)
            }
            else {
              res.render('eventManagement', appendData)
            }
            break
          default:
            redirectUrl_ = '/event/management'
            res.redirect(redirectUrl_)
            break
        }
      }
    }

    // function checkWeekendDate(date: Date) {
    //   const dayOfWeek = new Date(date).getDay();
    //   newDate = new Date(date);
    //   if (dayOfWeek === 6 || dayOfWeek === 0) {
    //     newDate.setDate(newDate.getDate() + 1);
    //     newDate.setHours(23);
    //     newDate.setMinutes(59);
    //     checkWeekendDate(newDate);
    //   }
    //   return newDate;
    // }

    // function checkBankHolidayDate(date: Date, listOfHolidayDate: any) {
    //   tempDate = new Date(date);
    //   const newDate = moment(date).format('YYYY-MM-DD');
    //   const filterDate = listOfHolidayDate.filter((x: any) => x.date == newDate)[0]?.date;
    //   if (filterDate != undefined && filterDate != null) {
    //     tempDate.setDate(tempDate.getDate() + 1);
    //     tempDate.setHours(23);
    //     tempDate.setMinutes(59);
    //     checkBankHolidayDate(tempDate,listOfHolidayDate);
    //   }
    //   return tempDate;
    // }
  } catch (error) {
    LoggTracer.errorLogger(res, error, `${req.headers.host}${req.originalUrl}`, null,
      TokenDecoder.decoder(SESSION_ID), "Event management page " + " " + error?.response?.data?.errors[0].status + ' ' + error?.response?.data?.errors[0].detail + ' ' + error?.response?.data?.errors[0].title, false)

    // LoggTracer.errorLogger(
    //   res,
    //   err,
    //   `${req.headers.host}${req.originalUrl}`,
    //   null,
    //   TokenDecoder.decoder(SESSION_ID),
    //   'Event management page',
    //   true,
    // );
  }
}

export const EVENT_MANAGEMENT_DOWNLOAD = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  let { projectId, eventId, agreement_header, releatedContent } = req.session;
  //let { projectId, eventId, agreement_header } = req.session;
  const { supplierid, reviewsupplierid, Type } = req.query;
  const events = req.session.openProjectActiveEvents

  let title: string, lotid: string, agreementId_session: string, agreementName: string, agreementLotName: string, projectName: string, status: string, eventType: string
  let supplierDetails = {} as SupplierDetails;
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
      events.forEach((element: { activeEvent: { id: string | ParsedQs | string[] | ParsedQs[]; status: string; eventType: string; title: string; }; agreementName: string; lotName: string; agreementId: string; projectName: string; projectId: string; lotId: string; }) => {
        if (element.activeEvent.id == eventId) {
          agreementName = element.agreementName
          agreementLotName = element.lotName
          agreementId_session = element.agreementId
          status = element?.activeEvent?.status?.toLowerCase()
          projectName = element.projectName
          eventId = element.activeEvent.id.toString()
          eventType = element.activeEvent.eventType
          projectId = element.projectId
          lotid = element.lotId
          title = element.activeEvent.title

        }
      });
      const supplierScoreURL = `tenders/projects/${projectId}/events/${eventId}/scores`
      const supplierScore = await TenderApi.Instance(SESSION_ID).get(supplierScoreURL)
      //Supplier of interest
      const supplierInterestURL = `tenders/projects/${projectId}/events/${eventId}/responses`
      const supplierdata = await TenderApi.Instance(SESSION_ID).get(supplierInterestURL);

      //let showallDownload = false;
      for (let i = 0; i < supplierdata?.data?.responders?.length; i++) {
        let id = supplierdata.data.responders[i].supplier.id;
        if (id == reviewsupplierid) {
          let score = supplierScore?.data?.filter((x: any) => x.organisationId == id)[0]
          supplierDetails.supplierName = supplierdata.data.responders[i].supplier.name;
          supplierDetails.responseState = supplierdata.data.responders[i].responseState;
          supplierDetails.responseDate = supplierdata.data.responders[i].responseDate;
          supplierDetails.score = (score != undefined) ? score.score : 0;
          supplierDetails.supplierId = id;
          supplierDetails.eventId = eventId.toString();
          supplierDetails.supplierFeedBack = (score != undefined) ? score.comment : "";

        }
      }
      //Page navigation 
      let redirectUrl = '/event/management?id=' + eventId
      //const pageType = req.session['pageType'];
      if (Type != undefined && Type != null) {
        switch (Type) {
          case "confirmSupplier":
            redirectUrl = '/confirm-supplier?supplierid=' + reviewsupplierid;
            break
          case "supplierDocument":
            redirectUrl = '/award-supplier-document?supplierId=' + reviewsupplierid;
            break
          case "awardSupplier":
            redirectUrl = '/award-supplier?supplierId=' + reviewsupplierid;
            break
          default:
            // redirectUrl = '/event/management?id='+eventId
            break
        }
      }
      //SELECTED EVENT DETAILS FILTER FORM LIST
      const baseurl = `/tenders/projects/${projectId}/events`
      const apidata = await TenderApi.Instance(SESSION_ID).get(baseurl)
      //status=apidata.data[0].dashboardStatus;
      const selectedEventData = apidata.data.filter((d: any) => d.id == eventId);
      status = selectedEventData[0].dashboardStatus;
      const appendData = { agreement_header, agreementId_session, lotid, title, agreementName, agreementLotName, status, supplierDetails, data: eventManagementData, projectName, eventId, eventType, redirectUrl, releatedContent };

      res.render('evaluateSuppliers-readOnly', appendData);
    }
    else {
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
      res.send(fileData)
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

}
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
      'Tenders Service Api cannot be connected',
      true,
    );
  }
}

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
      'Tenders Service Api cannot be connected',
      true,
    );
  }
}

//supplieranswerall?supplierid=1
export const SUPPLIER_ANSWER_DOWNLOAD_ALL = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId } = req.session;
  const { eventId } = req.session;
  const { supplierid, download_all } = req.query;

  try {
    if (supplierid != undefined) {
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
    else if (download_all != undefined) {
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
      'Tenders Service Api cannot be connected',
      true,
    );
  }
}

//unsuccessful?download=1
export const UNSUCCESSFUL_SUPPLIER_DOWNLOAD = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId } = req.session;
  const { eventId } = req.session;
  const { download } = req.query;

  try {
    if (download != undefined) {
      const awardsTemplatesURL = `tenders/projects/${projectId}/events/${eventId}/awards/templates`
      await TenderApi.Instance(SESSION_ID).get(awardsTemplatesURL);

      const fileDownloadURL = `/tenders/projects/${projectId}/events/${eventId}/awards/templates/export`;
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

}


//supplieranswer?download=1
export const SUPPLIER_EVALUATION = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId } = req.session;
  const { eventId } = req.session;
  const { download } = req.query;

  try {
    if (download != undefined) {
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
      'Tenders Service Api cannot be connected',
      true,
    );
  }
}

//confirm-supplier-award
export const CONFIRM_SUPPLIER_AWARD = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId, eventId } = req.session;
  const { pre_award_supplier_confirmation, supplier_id, status_flag } = req.body;

  try {
    if (pre_award_supplier_confirmation != undefined && pre_award_supplier_confirmation === '1') {
      if (status_flag != undefined && status_flag === "AWARDED") {
        const signedURL = `tenders/projects/${projectId}/events/${eventId}/contracts`
        const putBody = {
          "awardID": "1",
          "status": "active"
        }
        const response = await TenderApi.Instance(SESSION_ID).post(signedURL, putBody);
        if (response.status == Number(HttpStatusCode.OK)) {
          res.redirect('/event/management?id=' + eventId);
        }
      }
      else {
        const awardURL = `tenders/projects/${projectId}/events/${eventId}/awards/1?award-state=AWARD`

        const putBody = {
          "suppliers": [
            {
              "id": supplier_id
            }
          ]
        };
        const response = await TenderApi.Instance(SESSION_ID).put(awardURL, putBody);
        if (response.status == Number(HttpStatusCode.OK)) {
          res.redirect('/event/management?id=' + eventId);
        }
      }
    }
    else {
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
      'Tenders Service Api cannot be connected',
      true,
    );
  }
}

export const EVENT_STATE_CHANGE = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  let { projectId, eventId } = req.session;
  const { StateChange } = req.query;

  try {
    if (StateChange != undefined) {

      const StateChangeDownloadURL = `/tenders/projects/${projectId}/events/${eventId}/responses/export`;
      await DynamicFrameworkInstance.file_dowload_Instance(SESSION_ID).get(StateChangeDownloadURL, {
        responseType: 'arraybuffer',
      });

      res.redirect('/evaluate-suppliers')
      //res.redirect('/event/management?id='+eventId)
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
}

export const RETURN_EVENTMANAGEMENT = async (req: express.Request, res: express.Response) => {
  let { eventId } = req.session;
  let redirectUrl = '/event/management?id=' + eventId
  res.redirect(redirectUrl)
}
