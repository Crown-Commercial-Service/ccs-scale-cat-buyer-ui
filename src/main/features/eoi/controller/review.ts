//@ts-nocheck
import * as express from 'express';
import * as cmsData from '../../../resources/content/eoi/review.json';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import { HttpStatusCode } from 'main/errors/httpStatusCodes';
import { OrganizationInstance } from '../util/fetch/organizationuserInstance';
import moment from 'moment-business-days';
import momentz from 'moment-timezone';
import { GetLotSuppliers } from '../../shared/supplierService';
import { logConstant } from '../../../common/logtracer/logConstant';

//@GET /eoi/review
export const GET_EOI_REVIEW = async (req: express.Request, res: express.Response) => {
  EOI_REVIEW_RENDER(req, res, false, false);
};

//@POST  /eoi/review
export const POST_EOI_REVIEW = async (req: express.Request, res: express.Response) => {
  const { eoi_publish_confirmation, finished_pre_engage } = req.body;
  const ProjectID = req.session['projectId'];
  const EventID = req.session['eventId'];
  const BASEURL = `/tenders/projects/${ProjectID}/events/${EventID}/publish`;
  const { SESSION_ID } = req.cookies;

  let CurrentTimeStamp = req.session.endDate;
  let dateSplited = CurrentTimeStamp.split('*')[1];
  if(momentz(new Date(dateSplited)).tz("Europe/London").isDST()) {
    let dateFormated = momentz(new Date(dateSplited)).format('YYYY-MM-DDTHH:mm:ss+01:00');
    CurrentTimeStamp = momentz(new Date(dateFormated)).toISOString();
  } else {
    let dateFormated = momentz(new Date(dateSplited)).format('YYYY-MM-DDTHH:mm:ss+00:00');
    CurrentTimeStamp = momentz(new Date(dateFormated)).toISOString();
  }

  // CurrentTimeStamp = new Date(CurrentTimeStamp.split('*')[1]).toISOString();
  
  const _bodyData = {
    endDate: CurrentTimeStamp,
  };
  
  let publishactiveprojects  = [];
  publishactiveprojects.push(ProjectID);
  req.session['publishclickevents'] = publishactiveprojects;
  
  //Fix for SCAT-3440
  const agreementName = req.session.agreementName;
  const lotid = req.session?.lotId;
  const project_name = req.session.project_name;
  const agreementId_session = req.session.agreement_id;
  const agreementLotName = req.session.agreementLotName;
  const projectId = req.session.projectId;

  res.locals.agreement_header = { agreementName, project_name, projectId, agreementId_session, agreementLotName, lotid };

  const BaseURL2 = `/tenders/projects/${ProjectID}/events/${EventID}`;
    const FetchReviewData2 = await DynamicFrameworkInstance.Instance(SESSION_ID).get(BaseURL2);
    const ReviewData2 = FetchReviewData2.data;
    const eventStatus2 = ReviewData2.OCDS.status == 'active' ? "published" : null 
    var review_publish = 0;
    if(eventStatus2=='published'){
      review_publish = 1;
      }else{
        if (finished_pre_engage && eoi_publish_confirmation === '1') {
          review_publish = 1;
        }
      }

  if (review_publish == '1') {
    try {

      const response = await TenderApi.Instance(SESSION_ID).put(`journeys/${EventID}/steps/2`, 'Completed');
      if (response.status == Number(HttpStatusCode.OK)) {
        await TenderApi.Instance(SESSION_ID).put(`journeys/${EventID}/steps/24`, 'Completed');
      }

      if(agreementId_session == 'RM1557.13'){
        const agreementPublishedRaw = TenderApi.Instance(SESSION_ID).put(BASEURL, _bodyData);
         setTimeout(function(){
          res.redirect('/eoi/event-sent');
          }, 5000);
      }
      else{

      await TenderApi.Instance(SESSION_ID).put(BASEURL, _bodyData);
      
      //CAS-INFO-LOG 
      LoggTracer.infoLogger(null, logConstant.eoiPublishLog, req);
      

      // const response = await TenderApi.Instance(SESSION_ID).put(`journeys/${EventID}/steps/2`, 'Completed');
      // if (response.status == Number(HttpStatusCode.OK)) {
      //   await TenderApi.Instance(SESSION_ID).put(`journeys/${EventID}/steps/24`, 'Completed');
      // }
      // if( agreementId_session == 'RM6187'){
      //   res.redirect('/eoi/confirmation-review');
      // }else{
        res.redirect('/eoi/event-sent');
      // }
    }
      
    } catch (error) {
      
      LoggTracer.errorLogger(res, error, `${req.headers.host}${req.originalUrl}`, null,
        TokenDecoder.decoder(SESSION_ID), "EOI Review - Dyanamic framework throws error - Tender Api is causing problem", false)
      EOI_REVIEW_RENDER(req, res, true, true);
    }
  } else {
    EOI_REVIEW_RENDER(req, res, true, false);
  }
};

const EOI_REVIEW_RENDER = async (req: express.Request, res: express.Response, viewError: boolean, apiError: boolean) => {
  const { SESSION_ID } = req.cookies;
  const ProjectID = req.session['projectId'];
  const EventID = req.session['eventId'];
  const BaseURL = `/tenders/projects/${ProjectID}/events/${EventID}`;
  const { download } = req.query;
  
  const publishClickeventValue = req.session['publishclickevents'];
    let publishClickEventStatus = false;
    if(publishClickeventValue.length > 0){
     if(publishClickeventValue.includes(ProjectID)){
      publishClickEventStatus = true;
     }
    }

  if(download!=undefined)
  {
    const FileDownloadURL = `/tenders/projects/${ProjectID}/events/${EventID}/documents/export`;
    
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
  else{
  try {
    
    const FetchReviewData = await DynamicFrameworkInstance.Instance(SESSION_ID).get(BaseURL);
    const ReviewData = FetchReviewData.data;
    
    const organizationID = req.session.user.payload.ciiOrgId;
    const organisationBaseURL = `/organisation-profiles/${organizationID}`;
    const getOrganizationDetails = await OrganizationInstance.OrganizationUserInstance().get(organisationBaseURL);
    const name = getOrganizationDetails.data.identifier.legalName;
    const organizationName = name;
    //CAS-INFO-LOG 
    LoggTracer.infoLogger(ReviewData, logConstant.eventDetails, req);

    //Buyer Questions
    const BuyerQuestions = ReviewData.nonOCDS.buyerQuestions.sort((a: any, b: any) => (a.id < b.id ? -1 : 1));
    const BuyerAnsweredAnswers = BuyerQuestions.map(buyer => {
      const data = buyer.requirementGroups
        .sort((a: any, b: any) => (a.nonOCDS.order < b.nonOCDS.order ? -1 : 1))
        .map(group => {
          const OCDS = group.OCDS;
          const nonOCDS = group.nonOCDS;
          nonOCDS.criterian = buyer.id;
          return { nonOCDS: nonOCDS, OCDS: OCDS };
        });
      return { requirement: data };
    }).flat();

    //JSONData;
    let Eoi_answered_questions = BuyerAnsweredAnswers.map(eoi => eoi.requirement).flat();

    const ExtractedEOI_Answers = Eoi_answered_questions.map(question => {
      return {
        title: question.OCDS.description,
        id: question.OCDS.id,
        criterian: question.nonOCDS.criterian,
        mandatory:question.nonOCDS.mandatory,
        answers: question.OCDS.requirements.map(o => {
          return { question: o.OCDS?.title, questionType: o.nonOCDS.questionType, values: o.nonOCDS.options };
        }),
      };
    });
    const FilteredSetWithTrue = ExtractedEOI_Answers.map(questions => {
      return {
        title: questions.title,
        id: questions.id,
        criterian: questions.criterian,
        mandatory:questions.mandatory,
        answer: questions.answers.map(answer => {
          const obj = {
            question: answer.question,
            values: answer.values.filter(val => val.selected),
          };
          if (answer.questionType == 'Date' ) {
            const startDate = obj.values.map(v => v.value);
            
            obj.values = [
              {
                value: 'Date you want the project to start: ' + moment(startDate,'YYYY-MM-DD ',).format('DD MMMM YYYY'),
                selected: true,
              },
            ];
          } else if (answer.questionType == 'Duration') {
            const duration = obj.values.map(v => v.value);
            let durationTemp=[];
            if(duration[0]!=undefined){
           
              durationTemp = duration[0].replace('P','').replace('Y','-').replace('M','-').replace('D','').split('-')
            }

            obj.values = [
              {
                value:
                  'How long you think the project will run for (Optional): ' +
                  (durationTemp.length == 3
                    ? durationTemp[0] + ' years ' + durationTemp[1] + ' months ' + durationTemp[2] + ' days'
                    : ''),
                selected: true,
              },
            ];
          } else if (answer.questionType == 'Monetary' && obj.values.length > 0) {
            obj.values = obj.values.map(v => {
              return { value: answer.question + ': ' + v.value, selected: v.selected };
            });
          }
          return obj;
        }),
      };
    });

    const EOI_DATA_WITHOUT_KEYDATES = FilteredSetWithTrue.filter(obj => obj.id !== 'Key Dates');
    const EOI_DATA_TIMELINE_DATES = FilteredSetWithTrue.filter(obj => obj.id === 'Key Dates');
    const project_name = req.session.project_name;

    const projectId = req.session.projectId;
    /**
     * @ProcurementLead
     */
    const procurementLeadURL = `/tenders/projects/${projectId}/users`;
    const procurementUserData = await TenderApi.Instance(SESSION_ID).get(procurementLeadURL);
    const ProcurementUsers = procurementUserData.data;
    const procurementLead = ProcurementUsers.filter(user => user.nonOCDS.projectOwner)[0].OCDS.contact;

    /**
     * @ProcurementCollegues
     */

    const isNotProcurementLeadData = ProcurementUsers.filter(user => !user.nonOCDS.projectOwner);
    const procurementColleagues = isNotProcurementLeadData.map(colleague => colleague.OCDS.contact);

    /**
     * @UploadedDocuments
     */

    const EventId = req.session['eventId'];

    const FILE_PUBLISHER_BASEURL = `/tenders/projects/${projectId}/events/${EventId}/documents`;
    const FetchDocuments = await DynamicFrameworkInstance.Instance(SESSION_ID).get(FILE_PUBLISHER_BASEURL);
    const FETCH_FILEDATA = FetchDocuments.data;

    const FileNameStorage = FETCH_FILEDATA.map(file => file.fileName);

    const agreement_id = req.session['agreement_id'];
    const proc_id = req.session['projectId'];
    const event_id = req.session['eventId'];
    const eoi_data= EOI_DATA_WITHOUT_KEYDATES;
   

      let expected_eoi_keydates=EOI_DATA_TIMELINE_DATES;
    
      expected_eoi_keydates[0].answer.sort((a, b) => (a.values[0].text.split(' ')[1] < b.values[0].text.split(' ')[1] ? -1 : 1)).shift()
  
      for(let i=0;i<expected_eoi_keydates[0].answer.length;i++){
        let data=expected_eoi_keydates[0].answer[i].values[0].value;
        let day=data.substr(0,10);
        let time=data.substr(11,5);
        if(i==0){
          expected_eoi_keydates[0].answer[i].values[0].value=moment(day+" "+time,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY');
        }
        else
        {
          expected_eoi_keydates[0].answer[i].values[0].value=moment(day+" "+time,'YYYY-MM-DD HH:mm',).format('DD MMMM YYYY, HH:mm');
        }
      };

  //  for (const tmp of eoi_data) {
  //   for (const tmp2 of tmp.answer) {
  //   }
  //  }
    //Fix for SCAT-3440 
    const agreementName = req.session.agreementName;
    const lotid = req.session?.lotId;
    const agreementId_session = req.session.agreement_id;
    const agreementLotName = req.session.agreementLotName;

    res.locals.agreement_header = { agreementName, project_name, projectId, agreementId_session, agreementLotName, lotid };

    // to get suppliers count
  let supplierList = [];
      supplierList = await GetLotSuppliers(req);
      const {data: getSuppliersPushed} = await TenderApi.Instance(SESSION_ID).get(`/tenders/projects/${projectId}/events/${EventId}/suppliers`);
    let getSuppliersPushedArr = getSuppliersPushed.suppliers;
    if(getSuppliersPushedArr.length > 0) {
      let eptyArr = [];
      var result = getSuppliersPushedArr.forEach((el: any) => {
        eptyArr.push(el.id);
      });
      supplierList = supplierList.filter((el: any) => {
        if(eptyArr.includes(el.organization.id)) {
          return true;
        }
        return false;
      });
    }

  

  supplierList=supplierList.sort((a, b) => a.organization.name.replace("-"," ").toLowerCase() < b.organization.name.replace("-"," ").toLowerCase() ? -1 : a.organization.name.replace("-"," ").toLowerCase() > b.organization.name.replace("-"," ").toLowerCase() ? 1 : 0);
  const supplierLength=supplierList.length;
// to get suppliers count end
   


    const customStatus = ReviewData.OCDS.status;

    let appendData = {
      eoi_data,
      eoi_keydates:expected_eoi_keydates[0],
      data: cmsData,
      project_name: project_name,
      procurementLead,
      procurementColleagues,
      documents: FileNameStorage,
      agreement_id,
      proc_id,
      event_id,
      ccs_eoi_type: EOI_DATA_WITHOUT_KEYDATES.length > 0 ? 'all_online' : '',
      eventStatus: ReviewData.OCDS.status == 'active' ? "published" : null, // this needs to be revisited to check the mapping of the planned 
      customStatus,
      closeStatus:ReviewData?.nonOCDS?.dashboardStatus,
      supplierLength:supplierLength,
      agreementId_session,
      publishClickEventStatus:publishClickEventStatus,
      organizationName
    };
    
    
    if (viewError) {
      appendData = Object.assign({}, { ...appendData, viewError: true, apiError: apiError });
    }
    
    //CAS-INFO-LOG 
    LoggTracer.infoLogger(null, logConstant.eoireviewAndPublishPageLog, req);
    
    res.render('reviewEoi', appendData);
    
    
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
};
