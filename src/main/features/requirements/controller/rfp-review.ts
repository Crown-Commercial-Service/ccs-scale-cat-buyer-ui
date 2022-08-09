//@ts-nocheck
import * as express from 'express';
import * as cmsData from '../../../resources/content/requirements/rfp-review.json';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import { HttpStatusCode } from 'main/errors/httpStatusCodes';
import { GetLotSuppliers } from '../../shared/supplierService';
import config from 'config';
import moment from 'moment-business-days';
import { CalVetting } from '../../shared/CalVetting';
import { CalServiceCapability } from '../../shared/CalServiceCapability';
import { OrganizationInstance } from '../util/fetch/organizationuserInstance';
import { CalScoringCriteria } from '../../shared/CalScoringCriteria';
import { ShouldEventStatusBeUpdated } from '../../shared/ShouldEventStatusBeUpdated';

const predefinedDays = {
  defaultEndingHour: Number(config.get('predefinedDays.defaultEndingHour')),
  defaultEndingMinutes: Number(config.get('predefinedDays.defaultEndingMinutes')),
  clarification_days: Number(config.get('predefinedDays.clarification_days')),
  clarification_period_end: Number(config.get('predefinedDays.clarification_period_end')),
  supplier_period: Number(config.get('predefinedDays.supplier_period')),
  supplier_deadline: Number(config.get('predefinedDays.supplier_deadline')),
};

//@GET /rfp/review
export const GET_RFP_REVIEW = async (req: express.Request, res: express.Response) => {
  //RFP_REVIEW_RENDER(req, res, false, false); remove comment
  const { download } = req.query;

  if (download != undefined) {
    const ProjectId = req.session['projectId'];
    const EventId = req.session['eventId'];
    const { SESSION_ID } = req.cookies;
    const FileDownloadURL = `/tenders/projects/${ProjectId}/events/${EventId}/documents/export`;
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
  else {
    RFP_REVIEW_RENDER_TEST(req, res, false, false);
  }
};

const RFP_REVIEW_RENDER_TEST = async (req: express.Request, res: express.Response, viewError: boolean, apiError: boolean) => {


  const { SESSION_ID } = req.cookies;
  const proc_id = req.session['projectId'];
  const event_id = req.session['eventId'];
  const BaseURL = `/tenders/projects/${proc_id}/events/${event_id}`;
  const { checkboxerror } = req.session;
  let selectedeventtype = req.session.selectedeventtype
  try {
    let flag = await ShouldEventStatusBeUpdated(event_id, 41, req);
    if (flag) {
      await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/41`, 'In progress');
    }
    const FetchReviewData = await DynamicFrameworkInstance.Instance(SESSION_ID).get(BaseURL);
    const ReviewData = FetchReviewData.data;
    //   //Buyer Questions
    //   const BuyerQuestions = ReviewData.nonOCDS.buyerQuestions.sort((a: any, b: any) => (a.id < b.id ? -1 : 1));
    //   const BuyerAnsweredAnswers = BuyerQuestions.map(buyer => {
    //     const data = buyer.requirementGroups
    //       .sort((a: any, b: any) => (a.nonOCDS.order < b.nonOCDS.order ? -1 : 1))
    //       .map(group => {
    //         const OCDS = group.OCDS;
    //         const nonOCDS = group.nonOCDS;
    //         nonOCDS.criterian = buyer.id;
    //         return { nonOCDS: nonOCDS, OCDS: OCDS };
    //       });
    //     return { requirement: data };
    //   }).flat();

    //   //JSONData;
    //   let Eoi_answered_questions = BuyerAnsweredAnswers.map(eoi => eoi.requirement).flat();

    //   const ExtractedEOI_Answers = Eoi_answered_questions.map(question => {
    //     return {
    //       title: question.OCDS.description,
    //       id: question.OCDS.id,
    //       criterian: question.nonOCDS.criterian,
    //       answers: question.OCDS.requirements.map(o => {
    //         return { question: o.OCDS?.title, questionType: o.nonOCDS.questionType, values: o.nonOCDS.options };
    //       }),
    //     };
    //   });

    //   const FilteredSetWithTrue = ExtractedEOI_Answers.map(questions => {
    //     return {
    //       title: questions.title,
    //       id: questions.id,
    //       criterian: questions.criterian,
    //       answer: questions.answers.map(answer => {
    //         const obj = {
    //           question: answer.question,
    //           values: answer.values.filter(val => val.selected),
    //         };
    //         if (answer.questionType == 'Date' && answer.values.length == 3) {
    //           obj.values = [
    //             {
    //               value: 'Date you want the project to start: ' + obj.values.map(v => v.value).join('-'),
    //               selected: true,
    //             },
    //           ];
    //         } else if (answer.questionType == 'Duration') {
    //           const duration = obj.values.map(v => v.value);
    //           obj.values = [
    //             {
    //               value:
    //                 'How long you think the project will run for (Optional): ' +
    //                 (duration.length == 3
    //                   ? duration[0] + ' years ' + duration[1] + ' months ' + duration[2] + ' days'
    //                   : ''),
    //               selected: true,
    //             },
    //           ];
    //         } else if (answer.questionType == 'Monetary' && obj.values.length > 0) {
    //           obj.values = obj.values.map(v => {
    //             return { value: answer.question + ': ' + v.value, selected: v.selected };
    //           });
    //         }
    //         return obj;
    //       }),
    //     };
    //   });

    //   const EOI_DATA_WITHOUT_KEYDATES = FilteredSetWithTrue.filter(obj => obj.id !== 'Key Dates');
    //   const EOI_DATA_TIMELINE_DATES = FilteredSetWithTrue.filter(obj => obj.id === 'Key Dates');
    const project_name = (req.session.project_name) ? req.session.project_name : req.session.Projectname;

    /**
     * @ProcurementLead
     */
    const procurementLeadURL = `/tenders/projects/${proc_id}/users`;
    const procurementUserData = await TenderApi.Instance(SESSION_ID).get(procurementLeadURL);
    const ProcurementUsers = procurementUserData?.data;
    const procurementLead = ProcurementUsers?.filter(user => user?.nonOCDS?.projectOwner)?.[0].OCDS?.contact;

    /**
     * @ProcurementCollegues
     */

    const isNotProcurementLeadData = ProcurementUsers?.filter(user => !user.nonOCDS?.projectOwner);
    const procurementColleagues = isNotProcurementLeadData?.map(colleague => colleague?.OCDS?.contact);


    /**
     * @UploadedDocuments
     */

    const EventId = req.session['eventId'];

    const FILE_PUBLISHER_BASEURL = `/tenders/projects/${proc_id}/events/${event_id}/documents`;
    const FetchDocuments = await DynamicFrameworkInstance.Instance(SESSION_ID).get(FILE_PUBLISHER_BASEURL);

    const FETCH_FILEDATA = FetchDocuments?.data;
    let fileNameStorageOptional = [];
    let fileNameStorageMandatory = [];
    FETCH_FILEDATA?.map(file => {
      if (file.description === "optional") {
        fileNameStorageOptional.push(file.fileName);
      }
      if (file.description === "mandatory") {
        fileNameStorageMandatory.push(file.fileName);
      }
    });

    const IR35Dataset = {
      id: 'Criterion 3',
      group_id: 'Group 2',
      question: 'Question 1',
    };

    const IR35BaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${IR35Dataset.id}/groups/${IR35Dataset.group_id}/questions`;

    const IR35 = await TenderApi.Instance(SESSION_ID).get(IR35BaseURL);
    const IR35Data = IR35?.data;
    const IR35selected = IR35Data?.[0].nonOCDS?.options?.filter(data => data.selected == true)?.map(data => data.value)?.[0]
    const agreement_id = req.session['agreement_id'];


    let supplierList = [];
    const supplierBaseURL: any = `/tenders/projects/${req.session.projectId}/events/${req.session.eventId}/suppliers`;
    const SUPPLIERS = await DynamicFrameworkInstance.Instance(SESSION_ID).get(supplierBaseURL);
    let SUPPLIER_DATA = SUPPLIERS?.data;//saved suppliers
    if(SUPPLIER_DATA!=undefined && SUPPLIER_DATA.suppliers.length>0){
      let allSuppliers=await GetLotSuppliers(req);
      for(var index=0;index<SUPPLIER_DATA.suppliers.length;index++)
          {
              let supplierInfo=allSuppliers.filter(s=>s.organization.id==SUPPLIER_DATA.suppliers[index].id)?.[0];
              if(supplierInfo!=undefined)
              {
                supplierList.push(supplierInfo);
              }
          }
    }
    else{
    supplierList = await GetLotSuppliers(req);
    }
    

    let rspbaseURL = `/tenders/projects/${proc_id}/events/${event_id}`;
    rspbaseURL = rspbaseURL + '/criteria';
    const fetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(rspbaseURL);
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

    const keyDateselector = 'Key Dates';
    criterianStorage = criterianStorage?.flat();
    criterianStorage = criterianStorage?.filter(AField => AField?.OCDS?.id === keyDateselector);

    const Criterian_ID = criterianStorage?.[0]?.criterianId;
    const prompt = criterianStorage?.[0]?.nonOCDS?.prompt;
    const apiData_baseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${Criterian_ID}/groups/${keyDateselector}/questions`;
    const fetchQuestions = await DynamicFrameworkInstance.Instance(SESSION_ID).get(apiData_baseURL);
    let fetchQuestionsData = fetchQuestions?.data;
    //const rfp_clarification_date = moment(new Date(), 'DD/MM/YYYY').format('DD MMMM YYYY');

    const rfp_clarification_period_end = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 2").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;


    const deadline_period_for_clarification_period = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 3").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;

    const supplier_period_for_clarification_period = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 4").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;


    const supplier_dealine_for_clarification_period = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 5").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;

    const supplier_dealine_evaluation_to_start = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 6").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;
    const supplier_dealine_expect_the_bidders = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 7").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;
    const supplier_dealine_for_pre_award = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 8").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;
    const supplier_dealine_for_expect_to_award = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 9").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;
    const supplier_dealine_sign_contract = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 10").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;
    const supplier_dealine_for_work_to_commence = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 11").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;

    const assessmentId = req.session?.currentEvent?.assessmentId;
    const ASSESSTMENT_BASEURL = `/assessments/${assessmentId}`;
    const ALL_ASSESSTMENTS = await TenderApi.Instance(SESSION_ID).get(ASSESSTMENT_BASEURL);
    const ALL_ASSESSTMENTS_DATA = ALL_ASSESSTMENTS.data;
    let { dimensionRequirements } = ALL_ASSESSTMENTS_DATA;
    let resourceQuantity = [];
    let highestSecurityCount = 0, highestSecuritySelected = "";
    let serviceCapabilitesCount = 0;
    let whereWorkDone = [];
    let StorageForSortedItems = [];

    if (dimensionRequirements?.length > 0) {
      resourceQuantity = dimensionRequirements?.filter(dimension => dimension.name === 'Resource Quantities')?.[0]?.requirements;
      highestSecurityCount = dimensionRequirements?.filter(dimension => dimension.name === 'Security Clearance')?.[0]?.requirements?.[0]?.weighting;
      highestSecuritySelected = dimensionRequirements?.filter(dimension => dimension.name === 'Security Clearance')?.[0]?.requirements?.[0]?.values?.[0]?.value;
      if (highestSecuritySelected === '0: None') highestSecuritySelected = '0: No security clearance needed'
      serviceCapabilitesCount = dimensionRequirements?.filter(dimension => dimension.name === 'Service Capability')?.[0]?.requirements?.length;
      whereWorkDone = dimensionRequirements?.filter(dimension => dimension.name === 'Location')?.[0]?.requirements?.map(n => n.name);
    }
    let resourceQuntityCount = 0;
    resourceQuantity?.map(x => { resourceQuntityCount = resourceQuntityCount + x.weighting });

    StorageForSortedItems = await CalVetting(req);
    let StorageForServiceCapability = []
    StorageForServiceCapability = await CalServiceCapability(req);
    //section 5 
    //question 2
    let sectionbaseURL: any = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 2/groups/Group 2/questions`;
    let sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    let sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    let overallratioQuestion1 = sectionbaseURLfetch_dynamic_api_data?.[1].nonOCDS?.options?.[0]?.value;
    let overallratioQuestion2 = sectionbaseURLfetch_dynamic_api_data?.[0].nonOCDS?.options?.[0]?.value;

    //question 3
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 2/groups/Group 3/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    let technicalgroupquestion1 = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS?.order == 1).map(o => o.nonOCDS)[0].options[0]?.value;
    let culturalgroupquestion1 = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS?.order == 2).map(o => o.nonOCDS)[0].options[0]?.value;
    let socialvaluegroupquestion1 = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS?.order == 3).map(o => o.nonOCDS)[0].options[0]?.value;

    //question 4
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 2/groups/Group 4/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    // let technicalquestion1=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==1).map(o=>o.nonOCDS)[0].options[0]?.value;
    // let technicalquestion2=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==2).map(o=>o.nonOCDS)[0].options[0]?.value;
    // let technicalquestion3=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==3).map(o=>o.nonOCDS)[0].options[0]?.value;
    // let technicalquestion4=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==4).map(o=>o.nonOCDS)[0].options[0]?.value;

    let techGroup = [];
    sectionbaseURLfetch_dynamic_api_data?.filter(o => o.OCDS?.id == 'Question 1')?.[0].nonOCDS?.options?.forEach(element => {
      techGroup.push({ tech: element?.value, add: '', good: '', weight: '' });
    });
    let j = 0;
    sectionbaseURLfetch_dynamic_api_data?.filter(o => o.OCDS?.id == 'Question 2')?.[0].nonOCDS?.options?.forEach(element => {
      techGroup[j].add = element.value; j = j + 1;
    });
    j = 0;
    sectionbaseURLfetch_dynamic_api_data?.filter(o => o.OCDS?.id == 'Question 4')?.[0].nonOCDS?.options?.forEach(element => {
      techGroup?.[j].weight = element?.value; j = j + 1;
    });
    j = 0;
    sectionbaseURLfetch_dynamic_api_data?.filter(o => o.OCDS?.id == 'Question 3')?.[0].nonOCDS?.options?.forEach(element => {
      techGroup?.[j].good = element?.value; j = j + 1;
    });
    //question 5
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 2/groups/Group 5/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    // let culturalquestion1=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==1).map(o=>o.nonOCDS)[0].options[0]?.value;
    // let culturalquestion2=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==2).map(o=>o.nonOCDS)[0].options[0]?.value;
    // let culturalquestion3=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==3).map(o=>o.nonOCDS)[0].options[0]?.value;
    // let culturalquestion4=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==4)?.map(o=>o.nonOCDS)[0]?.options[0]?.value;

    let culGroup = [];
    sectionbaseURLfetch_dynamic_api_data?.filter(o => o.OCDS.id == 'Question 2')?.[0].nonOCDS?.options?.forEach(element => {
      culGroup.push({ tech: '', add: element.value, good: '', weight: '' });
    });
    j = 0;
    sectionbaseURLfetch_dynamic_api_data?.filter(o => o.OCDS.id == 'Question 1')?.[0].nonOCDS?.options?.forEach(element => {
      culGroup?.[j].tech = element?.value; j = j + 1;
    });
    j = 0;
    sectionbaseURLfetch_dynamic_api_data?.filter(o => o.OCDS.id == 'Question 3')?.[0].nonOCDS?.options?.forEach(element => {
      culGroup?.[j].good = element?.value; j = j + 1;
    });
    j = 0;
    sectionbaseURLfetch_dynamic_api_data?.filter(o => o.OCDS.id == 'Question 4')?.[0].nonOCDS?.options?.forEach(element => {
      culGroup?.[j].weight = element?.value; j = j + 1;
    });
    //question 6
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 2/groups/Group 6/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    // let socialquestion1=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==1).map(o=>o.nonOCDS)[0].options[0]?.value;
    // let socialquestion2=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==2).map(o=>o.nonOCDS)[0].options[0]?.value;
    // let socialquestion3=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==3).map(o=>o.nonOCDS)[0].options[0]?.value;
    // let socialquestion4=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==4).map(o=>o.nonOCDS)[0].options[0]?.value;

    let socialGroup = [];
    sectionbaseURLfetch_dynamic_api_data?.filter(o => o.OCDS?.id == 'Question 4')?.[0].nonOCDS?.options?.forEach(element => {
      socialGroup.push({ tech: '', add: '', good: '', weight: element.value });
    });
    j = 0;
    sectionbaseURLfetch_dynamic_api_data?.filter(o => o.OCDS?.id == 'Question 2')?.[0].nonOCDS?.options?.forEach(element => {
      socialGroup[j].add = element.value; j = j + 1;
    });
    j = 0;
    sectionbaseURLfetch_dynamic_api_data?.filter(o => o?.OCDS?.id == 'Question 1')?.[0].nonOCDS?.options?.forEach(element => {
      socialGroup[j].tech = element.value; j = j + 1;
    });
    j = 0;
    sectionbaseURLfetch_dynamic_api_data?.filter(o => o?.OCDS?.id == 'Question 3')?.[0].nonOCDS?.options?.forEach(element => {
      socialGroup?.[j].good = element?.value; j = j + 1;
    });
    //Group 7 SECTION 5 removed this page from 1FC joureny
    // sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 2/groups/Group 7/questions`;
    // sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    // sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    let pricingModel = null; //sectionbaseURLfetch_dynamic_api_data?.[0].nonOCDS?.options?.filter(o => o.selected == true)[0]?.value;

    //question 8
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 2/groups/Group 8/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    // let tier1=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==1).map(o=>o.nonOCDS)[0].options[0]?.value;
    // let tier2=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==2).map(o=>o.nonOCDS)[0].options[0]?.value;
    // let tier3=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==3).map(o=>o.nonOCDS)[0].options[0]?.value;
    let tierInfo = await CalScoringCriteria(req);
    let newfilteredData = tierInfo?.filter(o => o?.OCDS?.id == 'Question 1')?.[0]?.nonOCDS?.options?.[0].tableDefinition;
    for (let i = 0; i < newfilteredData.titles.rows.length; i++) {
      newfilteredData.titles.rows[i].text = newfilteredData.data[i].cols[1];
      newfilteredData.titles.rows[i].id = newfilteredData.data[i].cols[0];
    }
    let tierData = newfilteredData.titles.rows; //tierInfo?.filter(o => o?.OCDS?.id == 'Question 1')?.[0]?.nonOCDS?.options?.[0].tableDefinition?.titles?.rows;
    // let tierData=[];
    // tierRows.forEach(element => {
    //   tierData.push({id:element.id,name:element.name,text:element.text});
    // });
    //section 5
    //section 3
    //question 2
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 3/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    // let term1=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==1).map(o=>o.nonOCDS)[0].options[0]?.value;
    // let term2=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==2).map(o=>o.nonOCDS)[0].options[0]?.value;

    let termAndAcr = []
    let data = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 1)?.[0]?.nonOCDS?.options;
    if (data != undefined) {
      data?.forEach(element => {
        var info = { text: element.text, value: element.value };
        termAndAcr.push(info);
      });
    }

    //question 3
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 4/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    // let background1=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==1).map(o=>o.nonOCDS)[0].options[0]?.value;
    // let background2=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==2).map(o=>o.nonOCDS)[0].options[0]?.value;

    let backgroundArr = [];
    data = sectionbaseURLfetch_dynamic_api_data?.map(a => a.nonOCDS)?.map(b => b.options);
    if (data != undefined) {
      //data[0].forEach(element => {
      backgroundArr.push({ v1: data?.[0]?.[0]?.value, v2: data?.[0]?.[1]?.value });
      //});
    }

    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 5/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
    let businessProbAns = sectionbaseURLfetch_dynamic_api_data?.filter(o => o?.nonOCDS?.order == 1).map(o => o.nonOCDS)?.[0].options?.[0]?.value;

    //question 5
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 6/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    //let keyuser1=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==1).map(o=>o.nonOCDS)[0].options[0]?.value;
    let keyUser = []
    data = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 1)?.[0]?.nonOCDS?.options;
    if (data != undefined) {
      data?.forEach(element => {
        var info = { text: element.text, value: element.value };
        keyUser.push(info);
      });
    }

    //work completed so far
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 7/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    let workcompletedsofar = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS?.order == 1).map(o => o.nonOCDS)?.[0].options?.[0]?.value;

    //current phase of project
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 8/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    let currentphaseofproject = sectionbaseURLfetch_dynamic_api_data?.[0].nonOCDS?.options?.filter(o => o.selected == true)?.[0]?.value;

    //phase resource is required for
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 9/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    //let phaseresisreq=sectionbaseURLfetch_dynamic_api_data[0].nonOCDS.options.filter(o=>o.selected==true)[0]?.value;

    let phaseResource = [];
    phaseResource = sectionbaseURLfetch_dynamic_api_data?.[0].nonOCDS?.options?.filter(o => o.selected == true)?.map(a => a.value)
    //indicative start date
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 10/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    let dateOptions = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 1).map(o => o.nonOCDS)?.[0]?.options;
    let startdate = dateOptions != null && dateOptions?.length > 0 ? dateOptions?.[0].value?.padStart(2, 0) + "  " + dateOptions?.[1]?.value?.padStart(2, 0) + "  " + dateOptions?.[2].value : null;

    let optionalDate = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 2)?.map(o => o.nonOCDS)?.[0]?.options?.[0]?.value;

    //let startdate=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==1).map(o=>o.nonOCDS)[0].options[0]?.value;

    let indicativedurationYear = ''
    let indicativedurationMonth = ''
    let indicativedurationDay = ''
    if (optionalDate != undefined) {
      indicativedurationYear = optionalDate?.substring(1)?.split("Y")?.[0] + " years"
      indicativedurationMonth = optionalDate?.substring(1)?.split("Y")?.[1]?.split("M")?.[0] + " months"
      indicativedurationDay = optionalDate?.substring(1)?.split("Y")?.[1]?.split("M")?.[1].replace("D", "") + " days"
    }
    //buying organisation
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 11/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    const organizationID = req.session.user.payload.ciiOrgId;
    const organisationBaseURL = `/organisation-profiles/${organizationID}`;
    const getOrganizationDetails = await OrganizationInstance.OrganizationUserInstance().get(organisationBaseURL);
    const name = getOrganizationDetails.data?.identifier?.legalName;
    let buyingorg1 = name;

    //let buyingorg1=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==1).map(o=>o.nonOCDS)[0].options[0]?.value;
    let buyingorg2 = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 2)?.map(o => o.nonOCDS)?.[0].options?.[0]?.value;

    //summarize
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 14/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    let summarize = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 1)?.map(o => o.nonOCDS)?.[0]?.options?.[0]?.value;

    //new replacement
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 15/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    let newreplace = sectionbaseURLfetch_dynamic_api_data[0].nonOCDS?.options?.filter(o => o.selected == true)?.[0]?.value;

    //incumbemt supplier
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 16/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    let incumbentoption = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.questionType == 'SingleSelect')?.[0]?.nonOCDS?.options?.filter(o => o.selected == true)?.[0]?.value;
    let suppliername = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.questionType == 'Text')?.map(o => o.nonOCDS)?.[0].options?.[0]?.value;

    //management info
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 17/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    let managementinfo = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 1)?.map(o => o.nonOCDS)?.[0].options?.[0]?.value;

    //service level
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 19/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    // let servicelevel1=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==1).map(o=>o.nonOCDS)[0].options[0]?.value;
    // let servicelevel2=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==2 && o.nonOCDS.questionType!="Percentage").map(o=>o.nonOCDS)[0].options[0]?.value;
    // let servicelevel3=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==2 && o.nonOCDS.questionType=="Percentage").map(o=>o.nonOCDS)[0].options[0]?.value;

    let serviceLevel = [];
    let data1 = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.OCDS.id == 'Question 1')?.[0]?.nonOCDS?.options;
    let data2 = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.OCDS.id == 'Question 2')?.[0]?.nonOCDS?.options;
    let dataPercent = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.OCDS.id == 'Question 3')?.[0]?.nonOCDS?.options;
    if (data1 != undefined && data2 != undefined && dataPercent != undefined) {
      for (let i = 0; i < data1?.length; i++) {
        serviceLevel.push({ text: data1?.[i]?.value, value: data2?.[i]?.value, percent: dataPercent?.[i]?.value });
      }
    }

    //incentives
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 20/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    let incentive1 = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 1)?.map(o => o.nonOCDS)?.[0].options?.[0]?.value;
    let incentive2 = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 1)?.map(o => o.nonOCDS)?.[0].options?.[1]?.value;


    //budget constraints
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 21/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    let bc1 = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 1)?.map(o => o.nonOCDS)?.[0].options?.[0]?.value;
    let bc2 = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 2)?.map(o => o.nonOCDS)?.[0].options?.[0]?.value;

    //add your req
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 24/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    // let reqgroup=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==1).map(o=>o.nonOCDS)[0].options[0]?.value;
    // let reqtitle=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==2).map(o=>o.nonOCDS)[0]?.options[0]?.value;
    // let reqdesc=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==3).map(o=>o.nonOCDS)[0]?.options[0]?.value;

    let reqGroup = [];
    sectionbaseURLfetch_dynamic_api_data?.[0]?.nonOCDS?.options?.forEach(element => {
      reqGroup.push({ desc: '', group: element.value, title: '' });
    });
    let i = 0;
    sectionbaseURLfetch_dynamic_api_data?.[1]?.nonOCDS?.options?.forEach(element => {
      reqGroup?.[i].title = element.value; i = i + 1;
    });
    i = 0;
    sectionbaseURLfetch_dynamic_api_data?.[2]?.nonOCDS?.options?.forEach(element => {
      reqGroup?.[i].desc = element.value; i = i + 1;
    });
    //section 3


    req.session['endDate'] = supplier_period_for_clarification_period;

    let appendData = {
      //eoi_data: EOI_DATA_WITHOUT_KEYDATES,
      //eoi_keydates: EOI_DATA_TIMELINE_DATES[0],
      data: cmsData,
      project_name: project_name,
      procurementLead,
      procurementColleagues: procurementColleagues != undefined && procurementColleagues != null ? procurementColleagues : null,
      document: fileNameStorageOptional,
      documents: fileNameStorageMandatory,
      ir35: IR35selected,
      agreement_id,
      proc_id,
      event_id,
      supplierList: supplierList != undefined && supplierList != null ? supplierList : null,
      //rfp_clarification_date,
      rfp_clarification_period_end: rfp_clarification_period_end != undefined && rfp_clarification_period_end != null ? rfp_clarification_period_end : null,
      deadline_period_for_clarification_period: deadline_period_for_clarification_period != undefined && deadline_period_for_clarification_period != null ? deadline_period_for_clarification_period : null,
      supplier_period_for_clarification_period: supplier_period_for_clarification_period != undefined && supplier_period_for_clarification_period != null ? supplier_period_for_clarification_period : null,
      supplier_dealine_for_clarification_period: supplier_dealine_for_clarification_period != undefined && supplier_dealine_for_clarification_period != null ? supplier_dealine_for_clarification_period : null,
      supplier_dealine_evaluation_to_start: supplier_dealine_evaluation_to_start != undefined && supplier_dealine_evaluation_to_start != null ? supplier_dealine_evaluation_to_start : null,
      supplier_dealine_expect_the_bidders: supplier_dealine_expect_the_bidders != undefined && supplier_dealine_expect_the_bidders != null ? supplier_dealine_expect_the_bidders : null,
      supplier_dealine_for_pre_award: supplier_dealine_for_pre_award != undefined && supplier_dealine_for_pre_award != null ? supplier_dealine_for_pre_award : null,
      supplier_dealine_for_expect_to_award: supplier_dealine_for_expect_to_award != undefined && supplier_dealine_for_expect_to_award != null ? supplier_dealine_for_expect_to_award : null,
      supplier_dealine_sign_contract: supplier_dealine_sign_contract != undefined && supplier_dealine_sign_contract != null ? supplier_dealine_sign_contract : null,
      supplier_dealine_for_work_to_commence: supplier_dealine_for_work_to_commence != undefined && supplier_dealine_for_work_to_commence != null ? supplier_dealine_for_work_to_commence : null,
      resourceQuntityCount: resourceQuntityCount,
      resourceQuantity: resourceQuantity != undefined && resourceQuantity != null ? resourceQuantity : null,
      StorageForSortedItems: StorageForSortedItems != undefined && StorageForSortedItems != null ? StorageForSortedItems : null,
      StorageForServiceCapability: StorageForServiceCapability != undefined && StorageForServiceCapability != null ? StorageForServiceCapability : null,
      checkboxerror: checkboxerror != undefined && checkboxerror != null ? checkboxerror : null,
      highestSecurityCount: highestSecurityCount != undefined && highestSecurityCount != null ? highestSecurityCount : null,
      highestSecuritySelected: highestSecuritySelected != undefined && highestSecuritySelected != null ? highestSecuritySelected : null,
      serviceCapabilitesCount: serviceCapabilitesCount != undefined && serviceCapabilitesCount != null ? serviceCapabilitesCount : null,
      whereWorkDone: whereWorkDone != undefined && whereWorkDone != null ? whereWorkDone : null,
      overallratioQuestion1: overallratioQuestion1 != undefined && overallratioQuestion1 != null ? overallratioQuestion1 : null,
      overallratioQuestion2: overallratioQuestion2 != undefined && overallratioQuestion2 != null ? overallratioQuestion2 : null,
      technicalgroupquestion1: technicalgroupquestion1 != undefined && technicalgroupquestion1 != null ? technicalgroupquestion1 : null,
      culturalgroupquestion1: culturalgroupquestion1 != undefined && culturalgroupquestion1 != null ? culturalgroupquestion1 : null,
      socialvaluegroupquestion1: socialvaluegroupquestion1 != undefined && socialvaluegroupquestion1 != null ? socialvaluegroupquestion1 : null,
      pricingModel: pricingModel != undefined && pricingModel != null ? pricingModel : null,
      techGroup: techGroup != undefined && techGroup != null ? techGroup : null,
      culGroup: culGroup != undefined && culGroup != null ? culGroup : null,
      socialGroup: socialGroup != undefined && socialGroup != null ? socialGroup : null,
      tierData: tierData != undefined && tierData != null ? tierData : null,
      termAndAcr: termAndAcr != undefined && termAndAcr != null ? termAndAcr : null,
      backgroundArr: backgroundArr != undefined && backgroundArr != null ? backgroundArr : null,
      businessProbAns: businessProbAns != undefined && businessProbAns != null ? businessProbAns : null,
      keyUser: keyUser != undefined && keyUser != null ? keyUser : null,
      workcompletedsofar: workcompletedsofar != undefined && workcompletedsofar != null ? workcompletedsofar : null,
      currentphaseofproject: currentphaseofproject != undefined && currentphaseofproject != null ? currentphaseofproject : null,
      phaseResource: phaseResource != undefined && phaseResource != null ? phaseResource : null,
      indicativedurationYear: indicativedurationYear != undefined && indicativedurationYear != null ? indicativedurationYear : null,
      indicativedurationMonth: indicativedurationMonth != undefined && indicativedurationMonth != null ? indicativedurationMonth : null,
      indicativedurationDay: indicativedurationDay != undefined && indicativedurationDay != null ? indicativedurationDay : null,
      startdate: startdate != undefined && startdate != null ? startdate : null,
      buyingorg1: buyingorg1 != undefined && buyingorg1 != null ? buyingorg1 : null,
      buyingorg2: buyingorg2 != undefined && buyingorg2 != null ? buyingorg2 : null,
      summarize: summarize != undefined && summarize != null ? summarize : null,
      newreplace: newreplace != undefined && newreplace != null ? newreplace : null,
      incumbentoption: incumbentoption != undefined && incumbentoption != null ? incumbentoption : null,
      suppliername: suppliername != undefined && suppliername != null ? suppliername : null,
      managementinfo: managementinfo != undefined && managementinfo != null ? managementinfo : null,
      serviceLevel: serviceLevel != undefined && serviceLevel != null ? serviceLevel : null,
      incentive1: incentive1 != undefined && incentive1 != null ? incentive1 : null,
      incentive2: incentive2 != undefined && incentive2 != null ? incentive2 : null,
      bc1: bc1 != undefined && bc1 != null ? bc1 : null,
      bc2: bc2 != undefined && bc2 != null ? bc2 : null,
      reqGroup: reqGroup != undefined && reqGroup != null ? reqGroup : null,
      //ccs_eoi_type: EOI_DATA_WITHOUT_KEYDATES.length > 0 ? 'all_online' : '',
      eventStatus: ReviewData.OCDS.status == 'active' ? "published" : null, // this needs to be revisited to check the mapping of the planned 
      selectedeventtype
    };
    req.session['checkboxerror'] = 0;
    //Fix for SCAT-3440 
    const agreementName = req.session.agreementName;
    const lotid = req.session?.lotId;
    const agreementId_session = req.session.agreement_id;
    const agreementLotName = req.session.agreementLotName;
    res.locals.agreement_header = { agreementName, project_name, agreementId_session, agreementLotName, lotid };

    if (checkboxerror) {
      appendData = Object.assign({}, { ...appendData, checkboxerror: 1 });
    }

    res.render('rfp-review', appendData);
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
};

//@POST  /rfp/review
export const POST_RFP_REVIEW = async (req: express.Request, res: express.Response) => {
  req.session['checkboxerror'] = 0;
  const { rfp_publish_confirmation, finished_pre_engage } = req.body;
  const { eventId, projectId } = req.session;

  const BASEURL = `/tenders/projects/${projectId}/events/${eventId}/publish`;
  const { SESSION_ID } = req.cookies;
  let CurrentTimeStamp = req.session.endDate;
  CurrentTimeStamp = new Date(CurrentTimeStamp).toISOString();

  const _bodyData = {
    endDate: CurrentTimeStamp,
  };

  if (finished_pre_engage && rfp_publish_confirmation === '1') {
    try {
      await TenderApi.Instance(SESSION_ID).put(BASEURL, _bodyData);
      // const response = await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/2`, 'Completed');
      // if (response.status == Number(HttpStatusCode.OK)) {
      //   await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/24`, 'Completed');
      // }

      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/41`, 'Completed');
      res.redirect('/rfp/rfp-eventpublished');
    } catch (error) {

      LoggTracer.errorLogger(res, error, `${req.headers.host}${req.originalUrl}`, null,
        TokenDecoder.decoder(SESSION_ID), "Dyanamic framework throws error - Tender Api is causing problem", false)
      RFP_REVIEW_RENDER_TEST(req, res, true, true);
    }
  } else {
    req.session['checkboxerror'] = 1;
    RFP_REVIEW_RENDER_TEST(req, res, true, false);
  }
};

const RFP_REVIEW_RENDER = async (req: express.Request, res: express.Response, viewError: boolean, apiError: boolean) => {
  const { SESSION_ID } = req.cookies;
  const ProjectID = req.session['projectId'];
  const EventID = req.session['eventId'];
  const BaseURL = `/tenders/projects/${ProjectID}/events/${EventID}`;
  try {
    const FetchReviewData = await DynamicFrameworkInstance.Instance(SESSION_ID).get(BaseURL);
    const ReviewData = FetchReviewData.data;
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
        answer: questions.answers.map(answer => {
          const obj = {
            question: answer.question,
            values: answer.values.filter(val => val.selected),
          };
          if (answer.questionType == 'Date' && answer.values.length == 3) {
            obj.values = [
              {
                value: 'Date you want the project to start: ' + obj.values.map(v => v.value).join('-'),
                selected: true,
              },
            ];
          } else if (answer.questionType == 'Duration') {
            const duration = obj.values.map(v => v.value);
            obj.values = [
              {
                value:
                  'How long you think the project will run for (Optional): ' +
                  (duration.length == 3
                    ? duration[0] + ' years ' + duration[1] + ' months ' + duration[2] + ' days'
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

    let appendData = {
      eoi_data: EOI_DATA_WITHOUT_KEYDATES,
      eoi_keydates: EOI_DATA_TIMELINE_DATES[0],
      data: cmsData,
      project_name: project_name,
      procurementLead,
      procurementColleagues,
      documents: FileNameStorage,
      agreement_id,
      proc_id,
      event_id,
      ccs_eoi_type: EOI_DATA_WITHOUT_KEYDATES.length > 0 ? 'all_online' : '',
      eventStatus: ReviewData.OCDS.status == 'active' ? "published" : null // this needs to be revisited to check the mapping of the planned 
    };
    //Fix for SCAT-3440 
    const agreementName = req.session.agreementName;
    const lotid = req.session?.lotId;
    const agreementId_session = req.session.agreement_id;
    const agreementLotName = req.session.agreementLotName;
    res.locals.agreement_header = { agreementName, project_name, agreementId_session, agreementLotName, lotid };

    if (viewError) {
      appendData = Object.assign({}, { ...appendData, viewError: true, apiError: apiError });
    }

    res.render('rfp-review', appendData);
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
};