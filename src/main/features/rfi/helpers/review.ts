//@ts-nocheck
import * as express from 'express';
import * as cmsData from '../../../resources/content/RFI/review.json';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import { HttpStatusCode } from '../../../errors/httpStatusCodes';
import { title } from 'process';
import { GetLotSuppliers } from '../../shared/supplierService';
// import moment from 'moment';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';

export const RFI_REVIEW_HELPER = async (req: express.Request, res: express.Response, viewError: boolean, apiError: boolean) => {
  const { SESSION_ID } = req.cookies;
  const ProjectID = req.session['projectId'];
  const EventID = req.session['eventId'];
  const BaseURL = `/tenders/projects/${ProjectID}/events/${EventID}`;
  const { download } = req.query;
  if(download!=undefined)
    {
      const _body = {
        startDate: new Date(),
        endDate:new Date()
      };
      const FileDownloadURL = `/tenders/projects/${ProjectID}/events/${EventID}/publish`;
      const { data } = await TenderApi.Instance(SESSION_ID).put(FileDownloadURL, _body);
      // const FetchDocuments = await DynamicFrameworkInstance.file_dowload_Instance(SESSION_ID).get(FileDownloadURL, {
      //   responseType: 'arraybuffer',
      // });
      // const file = FetchDocuments;
      // const fileName = file.headers['content-disposition'].split('filename=')[1].split('"').join('');
      // const fileData = file.data;
      // const type = file.headers['content-type'];
      // const ContentLength = file.headers['content-length'];
      // res.status(200);
      // res.set({
      //   'Cache-Control': 'no-cache',
      //   'Content-Type': type,
      //   'Content-Length': ContentLength,
      //   'Content-Disposition': 'attachment; filename=' + fileName,
      // });
      // res.send(fileData);
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
    console.log("GROUP1_Toggle:" +GROUP1_Toggle)
    console.log("ToggledTrue: " +ToggledTrue)
    console.log("selectedToggled: "+selectedToggled)
    ToggledTrue.nonOCDS.options = selectedToggled;
    GROUP1_Toggle.OCDS.requirements.map(group => {
      if (group.OCDS.id === 'Question 1') return ToggledTrue;
      else {
        console.log("Group:" +group)
        return group;
      }
    });
    Rfi_answered_questions = Rfi_answered_questions.map(question => {
      if (question.OCDS.id === 'Group 1') return GROUP1_Toggle;
      
      else {
        console.log("Questions:" +question)
        return question;
      }
    });

    const ExtractedRFI_Answers = Rfi_answered_questions.sort((a: any, b: any) =>
      a.nonOCDS.order < b.nonOCDS.order ? -1 : 1,
    ).map(question => {
      return {
        title: question.OCDS.description,
        id: question.OCDS.id,
        answers: question.OCDS.requirements.map(o => {
          return { question: o.OCDS?.title, values: o.nonOCDS.options };
        }),
      };
    });

    const FilteredSetWithTrue = ExtractedRFI_Answers.map(questions => {
      return {
        title: questions.title,
        id: questions.id,
        answer: questions.answers.map(answer => {
          return {
            question: answer.question,
            values: answer.values.filter(val => val.selected),
          };
        }),
      };
      console.log(title)
      console.log(id)
      console.log(answer)
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
          const answer_group4=tempGroup4.answer[1]
          tempGroup4.answer=[];       
          tempGroup4.answer.push(answer_group4)
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
    let expected_rfi_keydates=RFI_DATA_TIMELINE_DATES[0];
    let temp=expected_rfi_keydates.answer[0].question;
    expected_rfi_keydates.answer[0].question=expected_rfi_keydates.answer[1].question;
    expected_rfi_keydates.answer[1].question=temp;

    let supplierList = [];
    supplierList = await GetLotSuppliers(req);

    let appendData = {
      rfi_data: RFI_ANSWER_STORAGE,
      rfi_keydates: expected_rfi_keydates,
      //rfi_keydates: RFI_DATA_TIMELINE_DATES[0],
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
    console.log(appendData)
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
