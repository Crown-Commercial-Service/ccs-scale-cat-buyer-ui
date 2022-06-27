//@ts-nocheck
import * as express from 'express';
import * as cmsData from '../../../resources/content/RFI/review.json';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { LoggTracer } from '../../../common/logtracer/tracer';
import moment from 'moment-business-days';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import { HttpStatusCode } from '../../../errors/httpStatusCodes';
import { OrganizationInstance } from '../util/fetch/organizationuserInstance';
import { title } from 'process';
import { GetLotSuppliers } from '../../shared/supplierService';
import { reverse } from 'dns';




export const RFI_REVIEW_HELPER = async (req: express.Request, res: express.Response, viewError: boolean, apiError: boolean) => {
  const { SESSION_ID } = req.cookies;
  const ProjectID = req.session['projectId'];
  const EventID = req.session['eventId'];
  const BaseURL = `/tenders/projects/${ProjectID}/events/${EventID}`;
  const { download } = req.query;
  
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
    //Buyer Questions
    const BuyerQuestions = ReviewData.nonOCDS.buyerQuestions;
    const BuyerAnsweredAnswers = BuyerQuestions.map(buyer => {
      const data = buyer.requirementGroups.map(group => {
        const OCDS = group.OCDS;
        const nonOCDS = group.nonOCDS;
        nonOCDS.criterian = buyer.id;
        return { nonOCDS: nonOCDS, OCDS: OCDS };
      });
      return { requirement: data };
    }).flat();

    //JSONData;
    let Rfi_answered_questions = BuyerAnsweredAnswers.map(rfi => rfi.requirement).flat();

    const GROUP1_Toggle = Rfi_answered_questions.filter(question => question.OCDS.id === 'Group 1')[0];
    const ToggledTrue = GROUP1_Toggle.OCDS.requirements.filter(reqs => reqs.OCDS.id === 'Question 1')[0];
    const selectedToggled = ToggledTrue.nonOCDS.options.map(op => {
      return { value: op.value, selected: true };
    });
    ToggledTrue.nonOCDS.options = selectedToggled;
    GROUP1_Toggle.OCDS.requirements.map(group => {
      if (group.OCDS.id === 'Question 1') return ToggledTrue;
      else {
        return group;
      }
    });
    Rfi_answered_questions = Rfi_answered_questions.map(question => {
      if (question.OCDS.id === 'Group 1') return GROUP1_Toggle;
      
      else {
        return question;
      }
    });

    const ExtractedRFI_Answers = Rfi_answered_questions.sort((a: any, b: any) =>
      a.nonOCDS.order < b.nonOCDS.order ? -1 : 1,
    ).map(question => {
      return {
        title: question.OCDS.description,
        id: question.OCDS.id,
        mandatory: question.nonOCDS.mandatory, //to append "(optional)"
        answers: question.OCDS.requirements.map(o => {
          return { question: o.OCDS?.title, values: o.nonOCDS.options };
        }),
      };
    });

    const FilteredSetWithTrue = ExtractedRFI_Answers.map(questions => {
      return {
        title: questions.title,
        id: questions.id,
        mandatory : questions.mandatory,//to append "(optional)"
        answer: questions.answers.map(answer => {
          return {
            question: answer.question,
            values: answer.values.filter(val => val.selected),
          };
        }),
      };
    });

    const RFI_DATA_WITHOUT_KEYDATES = FilteredSetWithTrue.filter(obj => obj.id !== 'Key Dates');
    const RFI_DATA_TIMELINE_DATES = FilteredSetWithTrue.filter(obj => obj.id === 'Key Dates');
    const project_name = req.session.project_name;
console.log(FilteredSetWithTrue)
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

    const GROUPINCLUDING_CRITERIANID = Rfi_answered_questions.filter(data => data.OCDS.id !== 'Key Dates').map(data => {
      return {
        criterian: data.nonOCDS.criterian,
        id: data.OCDS.id,
        mandatory : data.nonOCDS.mandatory, //to append "(optional)"
      };
    });

    const RFI_ANSWER_STORAGE = [];

    for (const dataOFRFI of RFI_DATA_WITHOUT_KEYDATES) {
      for (const dataOFCRITERIAN of GROUPINCLUDING_CRITERIANID) {
        if (dataOFRFI.id === dataOFCRITERIAN.id) {
          if(dataOFRFI.id=='Group 2')
          {
          const tempGroup2=RFI_DATA_WITHOUT_KEYDATES[1]
          const answer_=tempGroup2.answer[1]
          tempGroup2.answer=[];       
          tempGroup2.answer.push(answer_)
            const formattedData = { ...tempGroup2, criterian: dataOFCRITERIAN.criterian };
            RFI_ANSWER_STORAGE.push(formattedData);
          }
          else if(dataOFRFI.id=='Group 4')
          {
          const tempGroup4=RFI_DATA_WITHOUT_KEYDATES[3]
         for(let i=0;i<tempGroup4.answer.length;i++)
         {
           if(tempGroup4.answer[i].question==='Name of the organisation doing the procurement')
           {
            const organizationID = req.session.user.payload.ciiOrgId;
            const organisationBaseURL = `/organisation-profiles/${organizationID}`;
            const getOrganizationDetails = await OrganizationInstance.OrganizationUserInstance().get(organisationBaseURL);
            const name = getOrganizationDetails.data.identifier.legalName;
            const organizationName = name;
            tempGroup4.answer[i].values=[
              {
                value: organizationName,
                selected: true,
              },
            ]
           }
         }        
            const formattedData = { ...tempGroup4, criterian: dataOFCRITERIAN.criterian };
            RFI_ANSWER_STORAGE.push(formattedData);
          }
          else{
            const formattedData = { ...dataOFRFI, criterian: dataOFCRITERIAN.criterian };
            RFI_ANSWER_STORAGE.push(formattedData);
          }
         
        }
      }
    }
  
//Fix for SCAT-4146 - arranging the questions order
   let expected_rfi_keydates=RFI_DATA_TIMELINE_DATES;
   
   expected_rfi_keydates[0].answer.sort((a, b) => (a.values[0].text.split(' ')[1] < b.values[0].text.split(' ')[1] ? -1 : 1))

   for(let i=0;i<expected_rfi_keydates[0].answer.length;i++){
     let data=expected_rfi_keydates[0].answer[i].values[0].value;
     if(i==0){
      expected_rfi_keydates[0].answer[i].values[0].value=moment(
        new Date(data),
        'DD/MM/YYYY, hh:mm a',
      ).format('DD MMMM YYYY')
     }
     else{
     expected_rfi_keydates[0].answer[i].values[0].value=moment(
      new Date(data),
      'DD/MM/YYYY, hh:mm a',
    ).format('DD MMMM YYYY, hh:mm a')
     }
   };
      //RFI_ANSWER_STORAGE[3].answer.reverse()

    let supplierList = [];
    supplierList = await GetLotSuppliers(req);

    let appendData = {
      rfi_data: RFI_ANSWER_STORAGE,
      rfi_keydates: expected_rfi_keydates[0],
     
      data: cmsData,
      project_name: project_name,
      procurementLead,
      procurementColleagues,
      documents: FileNameStorage,
      agreement_id,
      proc_id,
      event_id,
      ccs_rfi_type: RFI_ANSWER_STORAGE.length > 0 ? 'all_online' : '',
      eventStatus: ReviewData.OCDS.status == 'active' ? "published" : null, // this needs to be revisited to check the mapping of the planned 
      suppliers_list:supplierList
    };

    if (viewError) {
      appendData = Object.assign({}, { ...appendData, viewError: true, apiError: apiError });
    }
   
    res.render('review', appendData);
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
