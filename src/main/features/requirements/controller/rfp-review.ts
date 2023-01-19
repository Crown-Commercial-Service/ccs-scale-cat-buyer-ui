//@ts-nocheck
import * as express from 'express';
import * as cmsData from '../../../resources/content/requirements/rfp-review.json';
import * as Mcf3cmsData from '../../../resources/content/MCF3/requirements/rfp-review.json';
import * as gcloudcmsData from '../../../resources/content/requirements/gcloud-rfp-review.json';
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
import { sortObject } from '../../../common/util/operators/sortObject'

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
  const { SESSION_ID } = req.cookies;
  const EventId = req.session['eventId'];
  const ProjectId = req.session['projectId'];
  let stage2_value = req.session.stage2_value;
  const agreementId_session = req.session.agreement_id;
  const stage2BaseUrl = `/tenders/projects/${ProjectId}/events`;
    const stage2_dynamic_api = await TenderApi.Instance(SESSION_ID).get(stage2BaseUrl);
    const stage2_dynamic_api_data = stage2_dynamic_api.data;
    const stage2_data = stage2_dynamic_api_data?.filter((anItem: any) => anItem.id == EventId && (anItem.templateGroupId == '13' || anItem.templateGroupId == '14'));
      stage2_value = 'Stage 1';
    if(stage2_data.length > 0){
      stage2_value = 'Stage 2';
    }

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
    if (agreementId_session=='RM1043.8') {//DOS
      if(stage2_value !== undefined && stage2_value === "Stage 2"){//Stage 2
        RFP_REVIEW_RENDER_STAGE(req, res, false, false);
      }else{
        RFP_REVIEW_RENDER_TEST(req, res, false, false);
      }
    }else if (agreementId_session=='RM1557.13') {//GCLOUD
      RFP_REVIEW_RENDER_GCLOUD(req, res, false, false);
    }else{
      RFP_REVIEW_RENDER_TEST_MCF(req, res, false, false);
    }
  }
};

const RFP_REVIEW_RENDER_STAGE = async (req: express.Request, res: express.Response, viewError: boolean, apiError: boolean) => {

  const { SESSION_ID } = req.cookies;
  const proc_id = req.session['projectId'];
  const event_id = req.session['eventId'];
  

  const BaseURL = `/tenders/projects/${proc_id}/events/${event_id}`;
  const { checkboxerror } = req.session;
  const agreementId_session = req.session.agreement_id;
  const stage2_value = req.session.stage2_value;
  let selectedeventtype;
  if(req.session.selectedRoute=='rfp'){
    selectedeventtype='FC';
  }else{
    selectedeventtype=req.session.selectedeventtype;
  }
  
  try {
    if (agreementId_session=='RM1043.8') {//DOS
      if(stage2_value !== undefined && stage2_value === "Stage 2"){//Stage 2
        let flag = await ShouldEventStatusBeUpdated(event_id, 34, req);
        if (flag) {
          await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/34`, 'In progress');
        }
      }else{
        let flag = await ShouldEventStatusBeUpdated(event_id, 35, req);
        if (flag) {
          await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/35`, 'In progress');
        }
      }
    }else{
      let flag = await ShouldEventStatusBeUpdated(event_id, 41, req);
      if (flag) {
        await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/41`, 'In progress');
      }
    }
    
    const FetchReviewData = await DynamicFrameworkInstance.Instance(SESSION_ID).get(BaseURL);
    const ReviewData = FetchReviewData.data;
    
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
    const FileNameStorage = FETCH_FILEDATA?.map(file => file.fileName);

    let fileNameStoragePrice = [];
    let fileNameStorageMandatory = [];
    let fileNameStorageMandatorySecond = [];
    FETCH_FILEDATA?.map(file => {
      if(stage2_value == "Stage 2"){
        if (file.description === "mandatoryfirst") {
          fileNameStoragePrice.push(file.fileName); 
        }
        if (file.description === "optional") {
          fileNameStorageMandatorySecond.push(file.fileName);
        }
  
        if (file.description === "mandatorysecond") {
          fileNameStorageMandatory.push(file.fileName);
        }
      }
      else {
      if (file.description === "mandatoryfirst") {
        fileNameStoragePrice.push(file.fileName); 
      }
      if (file.description === "mandatorysecond") {
        fileNameStorageMandatorySecond.push(file.fileName);
      }

      if (file.description === "optional") {
        fileNameStorageMandatory.push(file.fileName);
      }
    }
    });
    
    
    const agreement_id = req.session['agreement_id'];
    

    let supplierList = [];
    supplierList = await GetLotSuppliers(req);
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
    const rfp_clarification_date = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 1").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;
    const rfp_clarification_period_end = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 2").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;


    const deadline_period_for_clarification_period = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 3").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;

    const supplier_period_for_clarification_period = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 4").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;
    
    //var supplier_period_for_clarification_period =moment(new Date(supplier_period_for_clarification_period_date).toLocaleString('en-GB', { timeZone: 'Europe/London' }),'DD/MM/YYYY hh:mm:ss',).format('YYYY-MM-DDTHH:mm:ss')+'Z';
    
    const supplier_dealine_for_clarification_period = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 5").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;

    const supplier_dealine_evaluation_to_start = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 6").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;
    const supplier_dealine_expect_the_bidders = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 7").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;
    const supplier_dealine_for_pre_award = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 8").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;
    const supplier_dealine_for_expect_to_award = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 9").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;
    const supplier_dealine_sign_contract = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 10").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;
    const supplier_dealine_for_work_to_commence = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 11").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;
    let supplier_sign_contract = '';
    let supplier_start = '';
    if(agreement_id == 'RM1043.8'){
      supplier_start = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 12").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;
       supplier_sign_contract = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 13").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;
    }
    
    
    let resourceQuntityCount;
    let resourceQuantity = [];
    let highestSecurityCount = 0, highestSecuritySelected = "";
    let serviceCapabilitesCount = 0;
    let whereWorkDone = [];
    let StorageForSortedItems = [];
    let StorageForServiceCapability = [];
    if(agreementId_session != 'RM1043.8'){
    const assessmentId = req.session?.currentEvent?.assessmentId;
    const ASSESSTMENT_BASEURL = `/assessments/${assessmentId}`;
    const ALL_ASSESSTMENTS = await TenderApi.Instance(SESSION_ID).get(ASSESSTMENT_BASEURL);
    const ALL_ASSESSTMENTS_DATA = ALL_ASSESSTMENTS.data;
    let { dimensionRequirements } = ALL_ASSESSTMENTS_DATA;

    if (dimensionRequirements?.length > 0) {
      resourceQuantity = dimensionRequirements?.filter(dimension => dimension.name === 'Resource Quantities')?.[0]?.requirements;
      highestSecurityCount = dimensionRequirements?.filter(dimension => dimension.name === 'Security Clearance')?.[0]?.requirements?.[0]?.weighting;
      highestSecuritySelected = dimensionRequirements?.filter(dimension => dimension.name === 'Security Clearance')?.[0]?.requirements?.[0]?.values?.[0]?.value;
      if( highestSecuritySelected==='0: None')highestSecuritySelected='0: No security clearance needed'
      serviceCapabilitesCount = dimensionRequirements?.filter(dimension => dimension.name === 'Service Offering')?.[0]?.requirements?.length;
      whereWorkDone = dimensionRequirements?.filter(dimension => dimension.name === 'Location')?.[0]?.requirements?.map(n => n.name);
    }
    resourceQuntityCount = resourceQuantity?.length;
    StorageForSortedItems = await CalVetting(req);
    StorageForServiceCapability = await CalServiceCapability(req);
    }
    let CriterionId = '';
    if(agreement_id !== 'RM1043.8'){
      CriterionId = 'Criterion 2';
    }else{
      CriterionId = 'Criterion 3';
    } 
    
    //section 5 
    //question 2
    let sectionbaseURL: any = ``;
    let sectionbaseURLfetch_dynamic_api = [];
    let sectionbaseURLfetch_dynamic_api_data = [];
    
    let overallratioQuestion1 = '';
    let overallratioQuestion2 = '';


    
    let culturalgroupquestion1 ='';
    let pricegroupquestion1 ='';
    let technicalgroupquestion1 = '';
    let socialvaluegroupquestion1 = '';
    
    let IR35selected = [];
    let techGroup = [];
    
    let culGroup = [];

    
    let socialGroup = [];
  
   let pricingModel = []; 
   let culModel = [];
   let tierData = [];
   
  let socialModel = [];
  
  let priModel = [];
  
  let assessModel = [];
let questionModel = [];
let scoringData = [];

    let termAndAcr = []
   
    let backgroundArr = [];
    let businessProbAns = [];
    let businessProbAnsdata = [];
    
    //question 5
    let keyUser = []
    //current phase of project
    let workcompletedsofar='';
    let currentphaseofproject='';
    
    let phaseResource = [];
    let researchDate = [];
    let oftenresearchDate = [];
    let weekendresearchDate = [];
    let weekendresearchDateValue = [];
    let researchLoc = [];
    let restrictLoc = [];
    let descPart = [];
    let digiaccess = []
    let securityRequirements;
    let researchPlan = [];
    let spltermAndAcr = [];
    let budget = [];
    let budgetMaximum;
    let budgetMinimum;
    let furtherInfo;
    let startdate = [];
    let indicativedurationYear = ''
    let indicativedurationMonth = ''
    let indicativedurationDay = ''
    let extentionindicativedurationYear = ''
    let extentionindicativedurationMonth = ''
    let extentionindicativedurationDay = ''
    let buyingorg1 = ''
    let buyingorg2 = ''
    let summarize = ''
    let managementinfo = ''
    let incumbentoption = ''
    let suppliername = ''
    let newreplace = ''
    let contracted = '';
   
    let serviceLevel = [];
    
    
    let incentive1 = '';
    let incentive2 = '';


    //budget constraints
      //Commented - 03-08-2022
      let bc1, bc2;
    let reqGroup = [];
    //section 3


    req.session['endDate'] = supplier_period_for_clarification_period;

    let selectedServices = [];

    let forceChangeDataJson;
    if(agreementId_session == 'RM6187') { //MCF3
      forceChangeDataJson = Mcf3cmsData;
    } else if(agreementId_session == 'RM1557.13') { //G-cloud
      forceChangeDataJson = gcloudcmsData;
    } else { 
      forceChangeDataJson = cmsData;
    }
   
    let appendData = {
      lotId:req.session.lotId,
      selectedServices:selectedServices,
      //eoi_data: EOI_DATA_WITHOUT_KEYDATES,
      //eoi_keydates: EOI_DATA_TIMELINE_DATES[0],
      data: forceChangeDataJson,
      project_name: project_name,
      procurementLead,
      procurementColleagues: procurementColleagues != undefined && procurementColleagues != null ? procurementColleagues : null,
      //document: FileNameStorage[FileNameStorage.length - 1],
      //documents: (FileNameStorage.length > 1) ? FileNameStorage.slice(0, FileNameStorage.length - 1) : [],
      document: fileNameStoragePrice,
      documentsoptional: fileNameStorageMandatorySecond,
      documents: fileNameStorageMandatory,

      ir35: IR35selected,
      agreement_id,
      proc_id,
      event_id,
      supplierList: supplierList != undefined && supplierList != null ? supplierList : null,
      //rfp_clarification_date,
      rfp_clarification_date: rfp_clarification_date != undefined && rfp_clarification_date != null ? rfp_clarification_date : null,
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
      supplier_sign_contract: supplier_sign_contract != undefined && supplier_sign_contract != null ? supplier_sign_contract : null,
      supplier_start: supplier_start != undefined && supplier_start != null ? supplier_start : null,
      resourceQuntityCount: resourceQuntityCount != undefined && resourceQuntityCount != null ? resourceQuntityCount : null,
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
      pricegroupquestion1: pricegroupquestion1 != undefined && pricegroupquestion1 != null ? pricegroupquestion1 : null,
      socialvaluegroupquestion1: socialvaluegroupquestion1 != undefined && socialvaluegroupquestion1 != null ? socialvaluegroupquestion1 : null,
      pricingModel: pricingModel != undefined && pricingModel != null ? pricingModel : null,
      culModel: culModel != undefined && culModel != null ? culModel : null,
      socialModel: socialModel != undefined && socialModel != null ? socialModel : null,
      priModel: priModel != undefined && priModel != null ? priModel : null,
      assessModel: assessModel != undefined && assessModel != null ? assessModel : null,
      questionModel: questionModel != undefined && questionModel != null ? questionModel : null,
      techGroup: techGroup != undefined && techGroup != null ? techGroup : null,
      culGroup: culGroup != undefined && culGroup != null ? culGroup : null,
      socialGroup: socialGroup != undefined && socialGroup != null ? socialGroup : null,
      tierData: tierData != undefined && tierData != null ? tierData : null,
      termAndAcr: termAndAcr != undefined && termAndAcr != null ? termAndAcr : null,
      backgroundArr: backgroundArr != undefined && backgroundArr != null ? backgroundArr : null,
      businessProbAns: businessProbAns != undefined && businessProbAns != null ? businessProbAns : null,
      keyUser: keyUser != undefined && keyUser != null ? keyUser : null,
      scoringData: scoringData != undefined && scoringData != null ? scoringData : null,
      researchDate: researchDate != undefined && researchDate != null ? researchDate : null,
      oftenresearchDate: oftenresearchDate != undefined && oftenresearchDate != null ? oftenresearchDate : null,
      weekendresearchDate: weekendresearchDate != undefined && weekendresearchDate != null ? weekendresearchDate : null,
      researchLoc: researchLoc != undefined && researchLoc != null ? researchLoc : null,
      restrictLoc: restrictLoc != undefined && restrictLoc != null ? restrictLoc : null,
      descPart: descPart != undefined && descPart != null ? descPart : null,
      digiaccess: digiaccess != undefined && digiaccess != null ? digiaccess : null,
      securityRequirements: securityRequirements != undefined && securityRequirements != null ? securityRequirements : null,
      researchPlan: researchPlan != undefined && researchPlan != null ? researchPlan : null,
      spltermAndAcr: spltermAndAcr != undefined && spltermAndAcr != null ? spltermAndAcr : null,
      budget: budget != undefined && budget != null ? budget : null,
      budgetMaximum: budgetMaximum != undefined && budgetMaximum != null ? budgetMaximum : null,
      budgetMinimum: budgetMinimum != undefined && budgetMinimum != null ? budgetMinimum : null,
      furtherInfo: furtherInfo != undefined && furtherInfo != null ? furtherInfo : null,
      contracted: contracted != undefined && contracted != null ? contracted : null,
      workcompletedsofar: workcompletedsofar != undefined && workcompletedsofar != null ? workcompletedsofar : null,
      currentphaseofproject: currentphaseofproject != undefined && currentphaseofproject != null ? currentphaseofproject : null,
      phaseResource: phaseResource != undefined && phaseResource != null ? phaseResource : null,
      indicativedurationYear: indicativedurationYear != undefined && indicativedurationYear != null ? indicativedurationYear : null,
      indicativedurationMonth: indicativedurationMonth != undefined && indicativedurationMonth != null ? indicativedurationMonth : null,
      indicativedurationDay: indicativedurationDay != undefined && indicativedurationDay != null ? indicativedurationDay : null,
      
      extentionindicativedurationYear: extentionindicativedurationYear != undefined && extentionindicativedurationYear != null ? extentionindicativedurationYear : null,
      extentionindicativedurationMonth: extentionindicativedurationMonth != undefined && extentionindicativedurationMonth != null ? extentionindicativedurationMonth : null,
      extentionindicativedurationDay: extentionindicativedurationDay != undefined && extentionindicativedurationDay != null ? extentionindicativedurationDay : null,
      
      startdate: startdate != undefined && startdate != null ? moment(startdate,'YYYY-MM-DD ',).format('DD MMMM YYYY') : null,
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
      eventStatus: ReviewData.OCDS.status == 'active' ? "published" : ReviewData.OCDS.status == 'complete' ? "published" : null, // this needs to be revisited to check the mapping of the planned 
      closeStatus:ReviewData?.nonOCDS?.dashboardStatus,
      selectedeventtype,
      agreementId_session,
      stage2_value
    };
    
    
    req.session['checkboxerror'] = 0;
    //Fix for SCAT-3440 
    const agreementName = req.session.agreementName;
    const lotid = req.session?.lotId;
    // const agreementId_session = req.session.agreement_id;
    const agreementLotName = req.session.agreementLotName;
    const projectId = req.session.projectId;
    res.locals.agreement_header = { agreementName, project_name, projectId, agreementId_session, agreementLotName, lotid };

    if (checkboxerror) {
      appendData = Object.assign({}, { ...appendData, checkboxerror: 1 });
    }
    res.render('rfp-review-stage', appendData);
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
const RFP_REVIEW_RENDER_TEST = async (req: express.Request, res: express.Response, viewError: boolean, apiError: boolean) => {
  const { SESSION_ID } = req.cookies;
  const proc_id = req.session['projectId'];
  const event_id = req.session['eventId'];
  

  const BaseURL = `/tenders/projects/${proc_id}/events/${event_id}`;

  const { checkboxerror } = req.session;
  const agreementId_session = req.session.agreement_id;
  const stage2_value = req.session.stage2_value;
  let selectedeventtype;
  if(req.session.selectedRoute=='rfp'){
    selectedeventtype='FC';
  }else{
    selectedeventtype=req.session.selectedeventtype;
  }
  
  try {
    if (agreementId_session=='RM1043.8') {//DOS
      if(stage2_value !== undefined && stage2_value === "Stage 2"){//Stage 2
        let flag = await ShouldEventStatusBeUpdated(event_id, 34, req);
        if (flag) {
          await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/34`, 'In progress');
        }
      }else{
        let flag = await ShouldEventStatusBeUpdated(event_id, 35, req);
        if (flag) {
          await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/35`, 'In progress');
        }
      }
    }else{
      let flag = await ShouldEventStatusBeUpdated(event_id, 41, req);
      if (flag) {
        await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/41`, 'In progress');
      }
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
    const FileNameStorage = FETCH_FILEDATA?.map(file => file.fileName);

    let fileNameStoragePrice = [];
    let fileNameStorageMandatory = [];
    FETCH_FILEDATA?.map(file => {
      if (file.description === "mandatoryfirst") {
        fileNameStoragePrice.push(file.fileName);
      }
      if (file.description === "mandatorysecond") {
        fileNameStorageMandatory.push(file.fileName);
      }

      if (file.description === "optional") {
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
    // supplier filtered list
    // let supplierList = [];
    // supplierList = await GetLotSuppliers(req);
    let supplierList = [];
    const supplierBaseURL: any = `/tenders/projects/${proc_id}/events/${event_id}/suppliers`;

    const SUPPLIERS = await DynamicFrameworkInstance.Instance(SESSION_ID).get(supplierBaseURL);
    let SUPPLIER_DATA = SUPPLIERS?.data;//saved suppliers
    if(SUPPLIER_DATA!=undefined){
      let allSuppliers=await GetLotSuppliers(req);
      for(let i=0;i<SUPPLIER_DATA.suppliers.length;i++)
          {
              let supplierInfo=allSuppliers.filter(s=>s.organization.id==SUPPLIER_DATA.suppliers[i].id)?.[0];
              if(supplierInfo!=undefined)
              {
                supplierList.push(supplierInfo);
              }
          }
    }
    else{
    supplierList = await GetLotSuppliers(req);
    }
    
    supplierList=supplierList.sort((a, b) => a.organization.name.replace("-"," ").toLowerCase() < b.organization.name.replace("-"," ").toLowerCase() ? -1 : a.organization.name.replace("-"," ").toLowerCase() > b.organization.name.replace("-"," ").toLowerCase() ? 1 : 0);
    const supplierLength=supplierList.length;
// supplier filtered list end



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
    const rfp_clarification_date = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 1").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;
    const rfp_clarification_period_end = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 2").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;


    const deadline_period_for_clarification_period = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 3").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;

    const supplier_period_for_clarification_period = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 4").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;
    
    //var supplier_period_for_clarification_period =moment(new Date(supplier_period_for_clarification_period_date).toLocaleString('en-GB', { timeZone: 'Europe/London' }),'DD/MM/YYYY hh:mm:ss',).format('YYYY-MM-DDTHH:mm:ss')+'Z';
    
    const supplier_dealine_for_clarification_period = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 5").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;

    const supplier_dealine_evaluation_to_start = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 6").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;
    const supplier_dealine_expect_the_bidders = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 7").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;
    const supplier_dealine_for_pre_award = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 8").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;
    const supplier_dealine_for_expect_to_award = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 9").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;
    const supplier_dealine_sign_contract = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 10").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;
    const supplier_dealine_for_work_to_commence = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 11").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;
    let supplier_sign_contract = '';
    let supplier_start = '';
    if(agreement_id == 'RM1043.8'){
      supplier_start = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 12").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;
       supplier_sign_contract = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 13").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;
    }
    
    
    let resourceQuntityCount;
    let resourceQuantity = [];
    let highestSecurityCount = 0, highestSecuritySelected = "";
    let serviceCapabilitesCount = 0;
    let whereWorkDone = [];
    let StorageForSortedItems = [];
    let StorageForServiceCapability = [];
    if(agreementId_session != 'RM1043.8'){
    const assessmentId = req.session?.currentEvent?.assessmentId;
    const ASSESSTMENT_BASEURL = `/assessments/${assessmentId}`;
    const ALL_ASSESSTMENTS = await TenderApi.Instance(SESSION_ID).get(ASSESSTMENT_BASEURL);
    const ALL_ASSESSTMENTS_DATA = ALL_ASSESSTMENTS.data;
    let { dimensionRequirements } = ALL_ASSESSTMENTS_DATA;

    if (dimensionRequirements?.length > 0) {
      resourceQuantity = dimensionRequirements?.filter(dimension => dimension.name === 'Resource Quantities')?.[0]?.requirements;
      highestSecurityCount = dimensionRequirements?.filter(dimension => dimension.name === 'Security Clearance')?.[0]?.requirements?.[0]?.weighting;
      highestSecuritySelected = dimensionRequirements?.filter(dimension => dimension.name === 'Security Clearance')?.[0]?.requirements?.[0]?.values?.[0]?.value;
      if( highestSecuritySelected==='0: None')highestSecuritySelected='0: No security clearance needed'
      serviceCapabilitesCount = dimensionRequirements?.filter(dimension => dimension.name === 'Service Offering')?.[0]?.requirements?.length;
      whereWorkDone = dimensionRequirements?.filter(dimension => dimension.name === 'Location')?.[0]?.requirements?.map(n => n.name);
    }
    resourceQuntityCount = resourceQuantity?.length;
    StorageForSortedItems = await CalVetting(req);
    StorageForServiceCapability = await CalServiceCapability(req);
    }
    let CriterionId = '';
    if(agreement_id !== 'RM1043.8'){
      CriterionId = 'Criterion 2';
    }else{
      CriterionId = 'Criterion 3';
    } 
    
    //section 5 
    //question 2
    let sectionbaseURL: any = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 2/groups/Group 2/questions`;
    let sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    let sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
    
    let overallratioQuestion1 = '';
   if(agreement_id !== 'RM1043.8'){
      overallratioQuestion1 = sectionbaseURLfetch_dynamic_api_data?.[1].nonOCDS?.options?.[0]?.value;
   }else{
      overallratioQuestion1 = sectionbaseURLfetch_dynamic_api_data?.[0].nonOCDS?.options?.[0]?.value;
   }
     let overallratioQuestion2 = sectionbaseURLfetch_dynamic_api_data?.[0].nonOCDS?.options?.[0]?.value;

   // let overallratioQuestion1 = sectionbaseURLfetch_dynamic_api_data?.[1].nonOCDS?.options?.[0]?.value;
   // let overallratioQuestion2 = sectionbaseURLfetch_dynamic_api_data?.[0].nonOCDS?.options?.[0]?.value;

    //question 3
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 2/groups/Group 3/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    
    let culturalgroupquestion1 ='';
    let pricegroupquestion1 ='';
    let technicalgroupquestion1 = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS?.order == 1).map(o => o.nonOCDS)[0].options[0]?.value;
    if(agreementId_session == 'RM6263') { // DSP
     culturalgroupquestion1 = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS?.order == 2).map(o => o.nonOCDS)[0].options[0]?.value;
    }  
    let socialvaluegroupquestion1 = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS?.order == 3).map(o => o.nonOCDS)[0].options[0]?.value;
    if(agreementId_session == 'RM1043.8') { //DOS
      culturalgroupquestion1 = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS?.order == 2).map(o => o.nonOCDS)[0].options[0]?.value;
      pricegroupquestion1 = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS?.order == 4).map(o => o.nonOCDS)[0].options[0]?.value;
    }

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
    if(agreementId_session == 'RM6263') { // DSP
    sectionbaseURLfetch_dynamic_api_data?.filter(o => o.OCDS?.id == 'Question 2')?.[0]?.nonOCDS?.options?.forEach(element => {
      techGroup[j].add = element.value; j = j + 1;
    });
  }else if(agreementId_session == 'RM1043.8'){ //DOS
    sectionbaseURLfetch_dynamic_api_data?.filter(o => o.OCDS?.id == 'Question 2')?.[0]?.nonOCDS?.options?.forEach(element => {
      techGroup[j].add = element.value; j = j + 1;
    });
  }
    j = 0;
    sectionbaseURLfetch_dynamic_api_data?.filter(o => o.OCDS?.id == 'Question 4')?.[0]?.nonOCDS?.options?.forEach(element => {
      techGroup?.[j].weight = element?.value; j = j + 1;
    });
    if(agreementId_session == 'RM6263') { // DSP
    j = 0;
    sectionbaseURLfetch_dynamic_api_data?.filter(o => o.OCDS?.id == 'Question 3')?.[0]?.nonOCDS?.options?.forEach(element => {
      techGroup?.[j].good = element?.value; j = j + 1;
    });
  }else if(agreementId_session == 'RM1043.8'){ //DOS
    j = 0;
    sectionbaseURLfetch_dynamic_api_data?.filter(o => o.OCDS?.id == 'Question 3')?.[0]?.nonOCDS?.options?.forEach(element => {
      techGroup?.[j].good = element?.value; j = j + 1;
    });
  }
    let culGroup = [];

    if(agreementId_session == 'RM6263') { // DSP
    //question 5
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 2/groups/Group 5/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
    
    

    // let culturalquestion1=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==1).map(o=>o.nonOCDS)[0].options[0]?.value;
    // let culturalquestion2=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==2).map(o=>o.nonOCDS)[0].options[0]?.value;
    // let culturalquestion3=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==3).map(o=>o.nonOCDS)[0].options[0]?.value;
    // let culturalquestion4=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==4)?.map(o=>o.nonOCDS)[0]?.options[0]?.value;

    
    sectionbaseURLfetch_dynamic_api_data?.filter(o => o.OCDS.id == 'Question 2')?.[0]?.nonOCDS?.options?.forEach(element => {
      culGroup.push({ tech: '', add: element.value, good: '', weight: '' });
    });
    j = 0;
    sectionbaseURLfetch_dynamic_api_data?.filter(o => o.OCDS.id == 'Question 1')?.[0]?.nonOCDS?.options?.forEach(element => {
      culGroup?.[j].tech = element?.value; j = j + 1;
    });
    j = 0;
    sectionbaseURLfetch_dynamic_api_data?.filter(o => o.OCDS.id == 'Question 3')?.[0]?.nonOCDS?.options?.forEach(element => {
      culGroup?.[j].good = element?.value; j = j + 1;
    });
    j = 0;
    sectionbaseURLfetch_dynamic_api_data?.filter(o => o.OCDS.id == 'Question 4')?.[0]?.nonOCDS?.options?.forEach(element => {
      culGroup?.[j].weight = element?.value; j = j + 1;
    });
  }else if(agreementId_session == 'RM1043.8') { // DSP
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 2/groups/Group 5/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
    
    sectionbaseURLfetch_dynamic_api_data?.filter(o => o.OCDS.id == 'Question 2')?.[0]?.nonOCDS?.options?.forEach(element => {
      culGroup.push({ tech: '', add: element.value, good: '', weight: '' });
    });
    j = 0;
    sectionbaseURLfetch_dynamic_api_data?.filter(o => o.OCDS.id == 'Question 1')?.[0]?.nonOCDS?.options?.forEach(element => {
      culGroup?.[j].tech = element?.value; j = j + 1;
    });
    
  }
    //question 6
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 2/groups/Group 6/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
    
    // let socialquestion1=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==1).map(o=>o.nonOCDS)[0].options[0]?.value;
    // let socialquestion2=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==2).map(o=>o.nonOCDS)[0].options[0]?.value;
    // let socialquestion3=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==3).map(o=>o.nonOCDS)[0].options[0]?.value;
    // let socialquestion4=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==4).map(o=>o.nonOCDS)[0].options[0]?.value;

    let socialGroup = [];
    j = 0;
    sectionbaseURLfetch_dynamic_api_data?.filter(o => o?.OCDS?.id == 'Question 1')?.[0]?.nonOCDS?.options?.forEach(element => {
      socialGroup.push({ tech: '', add: '', good: '', weight: element.value });
      
    });
    if(agreementId_session != 'RM1043.8') {
    sectionbaseURLfetch_dynamic_api_data?.filter(o => o.OCDS?.id == 'Question 4')?.[0]?.nonOCDS?.options?.forEach(element => {
      socialGroup[j]?.tech = element.value; j = j + 1;
    });
  }
    if(agreementId_session == 'RM6263') { // DSP
    j = 0;
    sectionbaseURLfetch_dynamic_api_data?.filter(o => o.OCDS?.id == 'Question 2')?.[0]?.nonOCDS?.options?.forEach(element => {
      socialGroup[j].add = element.value; j = j + 1;
    });
    }
     if(agreementId_session == 'RM1043.8') {
      j = 0;
    sectionbaseURLfetch_dynamic_api_data?.filter(o => o.OCDS.id == 'Question 2')?.[0]?.nonOCDS?.options?.forEach(element => {
      socialGroup[j]?.add = element.value; j = j + 1;
    });
    }
    
    

    if(agreementId_session == 'RM6263') { // DSP
    j = 0;
    sectionbaseURLfetch_dynamic_api_data?.filter(o => o?.OCDS?.id == 'Question 3')?.[0]?.nonOCDS?.options?.forEach(element => {
      socialGroup?.[j].good = element?.value; j = j + 1;
    });
   }  
   let pricingModel = []; 
   if(agreementId_session == 'RM1043.8') {
    // Group 7 SECTION 5 removed this page from 1FC joureny
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 2/groups/Group 7/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
    
    j = 0;
    sectionbaseURLfetch_dynamic_api_data?.filter(o => o?.OCDS?.id == 'Question 1')?.[0]?.nonOCDS?.options?.forEach(element => {
      pricingModel.push({ tech: '', add: '', good: '', weight: element.value });
      
    });
    j = 0;
    sectionbaseURLfetch_dynamic_api_data?.filter(o => o.OCDS?.id == 'Question 2')?.[0]?.nonOCDS?.options?.forEach(element => {
      pricingModel[j].add = element.value; j = j + 1;
    });
    
   }else{
    // let pricingModel = null; //sectionbaseURLfetch_dynamic_api_data?.[0].nonOCDS?.options?.filter(o => o.selected == true)[0]?.value;
   }
   let culModel = [];
   let tierData = [];
   if(agreementId_session != 'RM1043.8') {
    //question 8
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 2/groups/Group 8/questions`;
   
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    // let tier1=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==1).map(o=>o.nonOCDS)[0].options[0]?.value;
    // let tier2=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==2).map(o=>o.nonOCDS)[0].options[0]?.value;
    // let tier3=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==3).map(o=>o.nonOCDS)[0].options[0]?.value;
    let tierInfo = await CalScoringCriteria(req);
    let newfilteredData = tierInfo?.filter(o => o?.OCDS?.id == 'Question 1')?.[0]?.nonOCDS?.options?.[0]?.tableDefinition;
    for (let i = 0; i < newfilteredData?.titles?.rows?.length; i++) {
      newfilteredData.titles.rows[i].text = newfilteredData.data[i].cols[1];
      newfilteredData.titles.rows[i].id = newfilteredData.data[i].cols[0];
    }
     tierData = newfilteredData?.titles?.rows;
    //  let tierData = tierInfo?.filter(o => o?.OCDS?.id == 'Question 1')?.[0]?.nonOCDS?.options?.[0].tableDefinition?.titles?.rows;
    // let tierData=[];
    // tierRows.forEach(element => {
    //   tierData.push({id:element.id,name:element.name,text:element.text});
    // });
    //section 5
    //section 3
  }else{
      //question 8
       
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 2/groups/Group 8/questions`;
   
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
    
    j = 0;
    sectionbaseURLfetch_dynamic_api_data?.filter(o => o?.OCDS?.id == 'Question 1')?.[0]?.nonOCDS?.options?.forEach(element => {
      culModel.push({ tech: '', add: '', good: '', weight: element.value });
      
    });
    j = 0;
    sectionbaseURLfetch_dynamic_api_data?.filter(o => o.OCDS?.id == 'Question 4')?.[0]?.nonOCDS?.options?.forEach(element => {
      culModel[j].add = element.value; j = j + 1;
    });
    
  }
  let socialModel = [];
  if(agreementId_session == 'RM1043.8' && req.session.lotId == 1){
    //question 9
     
  sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 2/groups/Group 9/questions`;
 
  sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
  sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
  
  j = 0;
  sectionbaseURLfetch_dynamic_api_data?.filter(o => o?.OCDS?.id == 'Question 1')?.[0]?.nonOCDS?.options?.forEach(element => {
    socialModel.push({ tech: '', add: '', good: '', weight: element.value });
    
  });
  j = 0;
  sectionbaseURLfetch_dynamic_api_data?.filter(o => o.OCDS?.id == 'Question 4')?.[0]?.nonOCDS?.options?.forEach(element => {
    socialModel[j].add = element.value; j = j + 1;
  });
}else if(agreementId_session == 'RM1043.8' && req.session.lotId == 3){
  //question 9
     
  sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 2/groups/Group 8/questions`;
 
  sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
  sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
  
  
  j = 0;
  sectionbaseURLfetch_dynamic_api_data?.filter(o => o?.OCDS?.id == 'Question 1')?.[0]?.nonOCDS?.options?.forEach(element => {
    socialModel.push({ tech: '', add: '', good: '', weight: element.value });
    
  });
  j = 0;
  sectionbaseURLfetch_dynamic_api_data?.filter(o => o.OCDS?.id == 'Question 2')?.[0]?.nonOCDS?.options?.forEach(element => {
    socialModel[j].add = element.value; j = j + 1;
  });

}
  let priModel = [];
  if(agreementId_session == 'RM1043.8' && req.session.lotId == 1){
    //question 9
     
  sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 2/groups/Group 10/questions`;
 
  sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
  sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
   priModel = sectionbaseURLfetch_dynamic_api_data?.[0].nonOCDS?.options?.filter(o => o.selected == true)?.[0]?.value;

}
  let assessModel = [];
  if(agreementId_session == 'RM1043.8' && req.session.lotId == 1){
    //question 9
     
  sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 2/groups/Group 11/questions`;
 
  sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
  sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
  assessModel = sectionbaseURLfetch_dynamic_api_data?.[0].nonOCDS?.options?.filter(o => o.selected == true);

}else if(agreementId_session == 'RM1043.8' && req.session.lotId == 3){
  //question 9
   
sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 2/groups/Group 9/questions`;

sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
assessModel = sectionbaseURLfetch_dynamic_api_data?.[0].nonOCDS?.options?.filter(o => o.selected == true);

}
let questionModel = [];
let scoringData = [];
  if(agreementId_session == 'RM1043.8' && req.session.lotId == 1){
    //question 9
     
  sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 2/groups/Group 12/questions`;
 
  sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
  sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
  
  questionModel = sectionbaseURLfetch_dynamic_api_data?.[0].nonOCDS?.options?.filter(o => o.selected == true)?.[0]?.value;
  sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 2/groups/Group 13/questions`;
sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api_data.sort((n1, n2) => n1.nonOCDS.order - n2.nonOCDS.order);
sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api_data.map(item => {
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

let TemporaryObjStorage = [];
for (const ITEM of sectionbaseURLfetch_dynamic_api_data) {
    TemporaryObjStorage.push(ITEM);
}
TemporaryObjStorage.forEach(x => {
  //x.nonOCDS.childern=[];
  if (x.nonOCDS.questionType === 'Table') {
    x.nonOCDS.options.forEach(element => {
      element.optiontableDefination = mapTableDefinationData(element);
      element.optiontableDefinationJsonString = JSON.stringify(mapTableDefinationData(element));
    });
  }
});
TemporaryObjStorage = TemporaryObjStorage.slice(0, 2);
j = 0;
TemporaryObjStorage?.filter(o => o?.OCDS?.id == 'Question 1')?.[0]?.nonOCDS?.options?.[0].optiontableDefination?.rows?.forEach(element => {
  scoringData.push({ name: element[0].text, points: element[1].text, def: element[2].text });
  });
}else if(agreementId_session == 'RM1043.8' && req.session.lotId == 3){
  //question 9
   
sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 2/groups/Group 10/questions`;

sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

questionModel = sectionbaseURLfetch_dynamic_api_data?.[0].nonOCDS?.options?.filter(o => o.selected == true)?.[0]?.value;

sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 2/groups/Group 11/questions`;
sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api_data.sort((n1, n2) => n1.nonOCDS.order - n2.nonOCDS.order);
sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api_data.map(item => {
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

let TemporaryObjStorage = [];
for (const ITEM of sectionbaseURLfetch_dynamic_api_data) {
    TemporaryObjStorage.push(ITEM);
}
TemporaryObjStorage.forEach(x => {
  //x.nonOCDS.childern=[];
  if (x.nonOCDS.questionType === 'Table') {
    x.nonOCDS.options.forEach(element => {
      element.optiontableDefination = mapTableDefinationData(element);
      element.optiontableDefinationJsonString = JSON.stringify(mapTableDefinationData(element));
    });
  }
});
TemporaryObjStorage = TemporaryObjStorage.slice(0, 2);
j = 0;
TemporaryObjStorage?.filter(o => o?.OCDS?.id == 'Question 1')?.[0]?.nonOCDS?.options?.[0].optiontableDefination?.rows?.forEach(element => {
  scoringData.push({ name: element[0].text, points: element[1].text, def: element[2].text });
  });

}


    
    //question 2
    if(agreementId_session == 'RM1043.8' && (req.session.lotId == 3 || req.session.lotId == 1)){
      sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 2/questions`;
    }else{
      sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 3/questions`;
    }
    
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
    
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api_data.sort((a, b) => (a.OCDS.id < b.OCDS.id ? -1 : 1));

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
    let backgroundArr = [];
    if(agreement_id !== 'RM1043.8'){
    //question 3
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 4/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
    
    data = sectionbaseURLfetch_dynamic_api_data?.map(a => a.nonOCDS)?.map(b => b.options);
    if (data != undefined) {
      //data[0].forEach(element => {
      backgroundArr.push({ v1: data?.[1]?.[0]?.value, v2: data?.[0]?.[0]?.value });
      //});
    }
    }
    if(agreementId_session == 'RM1043.8' && (req.session.lotId == 3 || req.session.lotId == 1)){
      //question 3
      sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 3/questions`;
      sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
      sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
      backgroundArr = sectionbaseURLfetch_dynamic_api_data?.[0].nonOCDS?.options?.filter(o => o.selected == true)?.[0]?.value;
      
    }

    // let background1=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==1).map(o=>o.nonOCDS)[0].options[0]?.value;
    // let background2=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==2).map(o=>o.nonOCDS)[0].options[0]?.value;

    let businessProbAns = [];
    let businessProbAnsdata = [];
    if(agreementId_session != 'RM1043.8'){
      sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 5/questions`;
    }else if(agreementId_session == 'RM1043.8' && req.session.lotId == 3){
      sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 4/questions`;
    }else if(agreementId_session == 'RM1043.8' && req.session.lotId == 1){
      sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 5/questions`;
    }
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    if(agreementId_session == 'RM1043.8' && req.session.lotId == 3){
      businessProbAns = sectionbaseURLfetch_dynamic_api_data?.[0].nonOCDS?.options?.filter(o => o.selected == true)?.map(a => a.value);
      
    }else{
      businessProbAns = sectionbaseURLfetch_dynamic_api_data?.filter(o => o?.nonOCDS?.order == 1).map(o => o.nonOCDS)?.[0].options?.[0]?.value;
    }
   
    if(agreementId_session == 'RM1043.8' && req.session.lotId == 1){
      businessProbAns = sectionbaseURLfetch_dynamic_api_data?.[0].nonOCDS?.options?.filter(o => o.selected == true);
    }
    
    //question 5
    let keyUser = []
    if(agreementId_session == 'RM6263') { // DSP
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 6/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    //let keyuser1=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==1).map(o=>o.nonOCDS)[0].options[0]?.value;
    
    data = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 1)?.[0]?.nonOCDS?.options;
    if (data != undefined) {
      data?.forEach(element => {
        var info = { text: element.text, value: element.value };
        keyUser.push(info);
      });
    }
  }else if(agreementId_session == 'RM1043.8' && req.session.lotId == 3){
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 5/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

     keyUser = sectionbaseURLfetch_dynamic_api_data?.filter(o => o?.nonOCDS?.order == 1).map(o => o.nonOCDS)?.[0].options?.[0]?.value;
     
  }
  if(agreementId_session == 'RM1043.8' && req.session.lotId == 1){
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 6/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

     keyUser = sectionbaseURLfetch_dynamic_api_data?.filter(o => o?.nonOCDS?.order == 1).map(o => o.nonOCDS)?.[0].options?.[0]?.value;
  }
    //work completed so far
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 7/questions`;
    if(agreementId_session == 'RM1043.8' && req.session.lotId == 3){
      sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 6/questions`;
    }
    if(agreementId_session == 'RM1043.8' && req.session.lotId == 1){
      sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 7/questions`;
    }
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    let workcompletedsofar = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS?.order == 1).map(o => o.nonOCDS)?.[0].options?.[0]?.value;

    
    //current phase of project
    let currentphaseofproject='';
    if(agreementId_session != 'RM6187') {
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 8/questions`;
    if(agreementId_session == 'RM1043.8' && req.session.lotId == 3){
      sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 7/questions`;
    }
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

     currentphaseofproject = sectionbaseURLfetch_dynamic_api_data?.[0].nonOCDS?.options?.filter(o => o.selected == true)?.[0]?.value;
    }
    
    let phaseResource = [];
    if(agreementId_session == 'RM6263') { // DSP
    //phase resource is required for
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 9/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    //let phaseresisreq=sectionbaseURLfetch_dynamic_api_data[0].nonOCDS.options.filter(o=>o.selected==true)[0]?.value;

    
    phaseResource = sectionbaseURLfetch_dynamic_api_data?.[0].nonOCDS?.options?.filter(o => o.selected == true)?.map(a => a.value)
    }
    if(agreementId_session == 'RM1043.8' && req.session.lotId == 3){
      sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 8/questions`;
      sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    //let phaseresisreq=sectionbaseURLfetch_dynamic_api_data[0].nonOCDS.options.filter(o=>o.selected==true)[0]?.value;

    
    phaseResource = sectionbaseURLfetch_dynamic_api_data?.[0].nonOCDS?.options?.filter(o => o.selected == true)?.map(a => a.value)
    }else if(agreementId_session == 'RM1043.8' && req.session.lotId == 1){
      sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 9/questions`;
      sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
      
    sectionbaseURLfetch_dynamic_api_data?.filter(o => o.OCDS?.id == 'Question 1')?.[0].nonOCDS?.options?.forEach(element => {
      phaseResource.push({ tech: element?.value, add: '', good: '', weight: '' });
    });
    let j = 0;
    sectionbaseURLfetch_dynamic_api_data?.filter(o => o.OCDS?.id == 'Question 2')?.[0]?.nonOCDS?.options?.forEach(element => {
      phaseResource[j].add = element.value; j = j + 1;
    });
    
  }
    let researchDate = [];
    if(agreementId_session == 'RM1043.8' && req.session.lotId == 3){
      sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 9/questions`;
      sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    //let phaseresisreq=sectionbaseURLfetch_dynamic_api_data[0].nonOCDS.options.filter(o=>o.selected==true)[0]?.value;

    
    researchDate = sectionbaseURLfetch_dynamic_api_data?.[0].nonOCDS?.options?.filter(o => o.selected == true)?.map(a => a.value)
    }else if(agreementId_session == 'RM1043.8' && req.session.lotId == 1){
      sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 10/questions`;
      sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    //let phaseresisreq=sectionbaseURLfetch_dynamic_api_data[0].nonOCDS.options.filter(o=>o.selected==true)[0]?.value;

    
    researchDate = sectionbaseURLfetch_dynamic_api_data?.[0].nonOCDS?.options?.filter(o => o.selected == true)?.map(a => a.value)
    
    }
    let oftenresearchDate = [];
    if(agreementId_session == 'RM1043.8' && req.session.lotId == 3){
      sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 10/questions`;
      sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
    
    oftenresearchDate = sectionbaseURLfetch_dynamic_api_data?.[0].nonOCDS?.options?.filter(o => o.selected == true)?.map(a => a.value)
    }else if(agreementId_session == 'RM1043.8' && req.session.lotId == 1){
      sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 11/questions`;
      sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
    
    oftenresearchDate = sectionbaseURLfetch_dynamic_api_data?.[0].nonOCDS?.options?.filter(o => o.selected == true)?.map(a => a.value)
    }
    let weekendresearchDate = [];
    let weekendresearchDateValue = [];
    if(agreementId_session == 'RM1043.8' && req.session.lotId == 3){
      sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 11/questions`;
      sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
    j = 0;
    weekendresearchDate = sectionbaseURLfetch_dynamic_api_data?.[0].nonOCDS?.options?.filter(o => o.selected == true)?.map(a => a.value)
    }
    else if(agreementId_session == 'RM1043.8' && req.session.lotId == 1){
      sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 12/questions`;
      sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
    
    weekendresearchDate = sectionbaseURLfetch_dynamic_api_data?.[0].nonOCDS?.options?.filter(o => o.selected == true)?.map(a => a.value)
    }
    let researchLoc = [];
    if(agreementId_session == 'RM1043.8' && req.session.lotId == 3){
      sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 12/questions`;
      sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
    
    researchLoc = sectionbaseURLfetch_dynamic_api_data?.[0].nonOCDS?.options?.filter(o => o.selected == true)?.map(a => a.value)
    }else if(agreementId_session == 'RM1043.8' && req.session.lotId == 1){
      sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 13/questions`;
      sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
    
    researchLoc = sectionbaseURLfetch_dynamic_api_data?.[0].nonOCDS?.options?.filter(o => o.selected == true)?.map(a => a.value)
    }
    let restrictLoc = [];
    if(agreementId_session == 'RM1043.8' && req.session.lotId == 3){
      sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 13/questions`;
      sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
    
    restrictLoc = sectionbaseURLfetch_dynamic_api_data?.[0].nonOCDS?.options?.filter(o => o.selected == true)?.map(a => a.value)
    }else if(agreementId_session == 'RM1043.8' && req.session.lotId == 1){
      sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 14/questions`;
      sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
    
    restrictLoc = sectionbaseURLfetch_dynamic_api_data?.[0].nonOCDS?.options?.filter(o => o.selected == true)?.map(a => a.value)
    }
    let descPart = [];
    if(agreementId_session == 'RM1043.8' && req.session.lotId == 3){
      sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 14/questions`;
      sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    descPart = sectionbaseURLfetch_dynamic_api_data?.[0].nonOCDS?.options?.filter(o => o.selected == true)?.map(a => a.value)
    }else if(agreementId_session == 'RM1043.8' && req.session.lotId == 1){
      sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 15/questions`;
      sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    descPart = sectionbaseURLfetch_dynamic_api_data?.[0].nonOCDS?.options?.filter(o => o.selected == true)?.map(a => a.value)
    }
    let digiaccess = [];
    let securityRequirements;
    let researchPlan = [];
    let spltermAndAcr = [];
    let budget = [];
    let budgetMaximum;
    let budgetMinimum;
    let furtherInfo;
    let startdate = [];
    if(agreementId_session == 'RM1043.8' && req.session.lotId == 3){
      sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 15/questions`;
      sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
      sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
      
      sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api_data.sort((a, b) => (a.OCDS.id < b.OCDS.id ? -1 : 1));
      let data = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 1)?.[0]?.nonOCDS?.options;
      if (data != undefined) {
        data?.forEach(element => {
          var info = { value: element.value };
          digiaccess.push(info);
        });
      }
      
      sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 16/questions`;
      sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    researchPlan = sectionbaseURLfetch_dynamic_api_data?.[0].nonOCDS?.options?.filter(o => o.selected == true)?.map(a => a.value)
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 17/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
    
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api_data.sort((a, b) => (a.OCDS.id < b.OCDS.id ? -1 : 1));
    
    let termdata = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 2)?.[0]?.nonOCDS?.options;
    if (termdata != undefined) {
      termdata?.forEach(element => {
        var info = { text: element.text, value: element.value };
        spltermAndAcr.push(info);
      });
    }
    
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 18/questions`;
      sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
      sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
      sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api_data.sort((a, b) => (a.OCDS.id < b.OCDS.id ? -1 : 1));
      budget = sectionbaseURLfetch_dynamic_api_data?.[0].nonOCDS?.options?.filter(o => o.selected == true)?.map(a => a.value)
      budgetMaximum = sectionbaseURLfetch_dynamic_api_data?.[1].nonOCDS?.options?.filter(o => o.selected == true)?.map(a => a.value)
      budgetMinimum = sectionbaseURLfetch_dynamic_api_data?.[2].nonOCDS?.options?.filter(o => o.selected == true)?.map(a => a.value)      
      furtherInfo = sectionbaseURLfetch_dynamic_api_data?.[3]?.nonOCDS?.options?.filter(o => o?.selected == true)?.map(a => a?.value) 

    }
    let indicativedurationYear = ''
    let indicativedurationMonth = ''
    let indicativedurationDay = ''
    let extentionindicativedurationYear = ''
    let extentionindicativedurationMonth = ''
    let extentionindicativedurationDay = ''
    let buyingorg1 = ''
    let buyingorg2 = ''
    let summarize = ''
    let managementinfo = ''
    let incumbentoption = ''
    let suppliername = ''
    let newreplace = ''
    let contracted = '';
    if(agreementId_session == 'RM1043.8' && req.session.lotId == 1){
      sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 16/questions`;
      sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
      sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
      
      sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api_data.sort((a, b) => (a.OCDS.id < b.OCDS.id ? -1 : 1));
      let data = sectionbaseURLfetch_dynamic_api_data?.[0].nonOCDS?.options?.filter(o => o.selected == true)?.map(a => a.value);
      digiaccess= data; 
      securityRequirements = sectionbaseURLfetch_dynamic_api_data?.[1]?.nonOCDS?.options?.filter(o => o?.selected == true)?.map(a => a?.value)
      sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 17/questions`;
      sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
      sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
      
      sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api_data.sort((a, b) => (a.OCDS.id < b.OCDS.id ? -1 : 1));
      let dateOptions = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 1).map(o => o.nonOCDS)?.[0]?.options;
      //startdate = dateOptions != null && dateOptions?.length > 0 ? dateOptions?.[0].value?.padStart(2, 0): null;;
      if(dateOptions != null && dateOptions?.length > 0 && dateOptions?.length == 3){
        startdate = dateOptions != null && dateOptions?.length > 0 ? `${dateOptions?.[2].value}-${dateOptions?.[1].value}-${dateOptions?.[0].value}`?.padStart(2, 0): null;;
      }else{
        startdate = dateOptions != null && dateOptions?.length > 0 ? dateOptions?.[0].value ?.padStart(2, 0): null;;
      }
      
      sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 18/questions`;
      sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
      sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
      
      sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api_data.sort((a, b) => (a.OCDS.id < b.OCDS.id ? -1 : 1));
      
      let optionalDate = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 1)?.map(o => o.nonOCDS)?.[0]?.options?.[0]?.value;

      let extentionOptionalDate = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 2)?.map(o => o.nonOCDS)?.[0]?.options?.[0]?.value;

      
        //let startdate=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==1).map(o=>o.nonOCDS)[0].options[0]?.value;

        if (optionalDate != undefined) {
          indicativedurationYear = optionalDate?.substring(1)?.split("Y")?.[0] + " years"
          indicativedurationMonth = optionalDate?.substring(1)?.split("Y")?.[1]?.split("M")?.[0] + " months"
          indicativedurationDay = optionalDate?.substring(1)?.split("Y")?.[1]?.split("M")?.[1].replace("D", "") + " days"
        }

        
        if (extentionOptionalDate != undefined) {
          extentionindicativedurationYear = extentionOptionalDate?.substring(1)?.split("Y")?.[0] + " years"
          extentionindicativedurationMonth = extentionOptionalDate?.substring(1)?.split("Y")?.[1]?.split("M")?.[0] + " months"
          extentionindicativedurationDay = extentionOptionalDate?.substring(1)?.split("Y")?.[1]?.split("M")?.[1].replace("D", "") + " days"
        }   
        
        


        sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 19/questions`;
      sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
      sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
      
      sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api_data.sort((a, b) => (a.OCDS.id < b.OCDS.id ? -1 : 1));
      let termdata = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 2)?.[0]?.nonOCDS?.options;
      if (termdata != undefined) {
        termdata?.forEach(element => {
          var info = { text: element.text, value: element.value };
          spltermAndAcr.push(info);
        });
      }
      sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 20/questions`;
      sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
      sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
      sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api_data.sort((a, b) => (a.OCDS.id < b.OCDS.id ? -1 : 1));

      budget = sectionbaseURLfetch_dynamic_api_data?.[0].nonOCDS?.options?.filter(o => o.selected == true)?.map(a => a.value)
      budgetMaximum = sectionbaseURLfetch_dynamic_api_data?.[1].nonOCDS?.options?.filter(o => o.selected == true)?.map(a => a.value)
      budgetMinimum = sectionbaseURLfetch_dynamic_api_data?.[2].nonOCDS?.options?.filter(o => o.selected == true)?.map(a => a.value) 
      furtherInfo = sectionbaseURLfetch_dynamic_api_data?.[3]?.nonOCDS?.options?.filter(o => o.selected == true)?.map(a => a.value) 

      sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 21/questions`;
        sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
        sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
        contracted = sectionbaseURLfetch_dynamic_api_data?.[0].nonOCDS?.options?.filter(o => o.selected == true)?.map(a => a.value) 

    }
    
    
    
    if(agreementId_session != 'RM1043.8'){
        //indicative start date
        sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 10/questions`;
        sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
        sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
      
        let dateOptions = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 1).map(o => o.nonOCDS)?.[0]?.options;
         startdate = dateOptions != null && dateOptions?.length > 0 ? dateOptions?.[0].value?.padStart(2, 0): null;;
        

        let optionalDate = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 2)?.map(o => o.nonOCDS)?.[0]?.options?.[0]?.value;

        let extentionOptionalDate = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 3)?.map(o => o.nonOCDS)?.[0]?.options?.[0]?.value;

        //let startdate=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==1).map(o=>o.nonOCDS)[0].options[0]?.value;

        
        if (optionalDate != undefined) {
          indicativedurationYear = optionalDate?.substring(1)?.split("Y")?.[0] + " years"
          indicativedurationMonth = optionalDate?.substring(1)?.split("Y")?.[1]?.split("M")?.[0] + " months"
          indicativedurationDay = optionalDate?.substring(1)?.split("Y")?.[1]?.split("M")?.[1].replace("D", "") + " days"
        }

        
        if (extentionOptionalDate != undefined) {
          extentionindicativedurationYear = extentionOptionalDate?.substring(1)?.split("Y")?.[0] + " years"
          extentionindicativedurationMonth = extentionOptionalDate?.substring(1)?.split("Y")?.[1]?.split("M")?.[0] + " months"
          extentionindicativedurationDay = extentionOptionalDate?.substring(1)?.split("Y")?.[1]?.split("M")?.[1].replace("D", "") + " days"
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
        let buyingorg2 = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 2)?.map(o => o.nonOCDS)?.[0]?.options?.[0]?.value;

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
        let suppliername = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.questionType == 'Text')?.map(o => o.nonOCDS)?.[0]?.options?.[0]?.value;

        //management info
        sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 17/questions`;
        sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
        sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

        let managementinfo = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 1)?.map(o => o.nonOCDS)?.[0].options?.[0]?.value;
    }
    
    

    //service level
    // Commented - 03-08-2022
  
      sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 19/questions`;
      if(agreementId_session != 'RM1043.8'){
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
      }else{
        sectionbaseURLfetch_dynamic_api_data = [];
      }
    
    
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
      //Commented - 03-08-2022
    // sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 20/questions`;
    // sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = [];//sectionbaseURLfetch_dynamic_api?.data;
    
    let incentive1 = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 1)?.map(o => o.nonOCDS)?.[0]?.options?.[0]?.value;
    let incentive2 = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 1)?.map(o => o.nonOCDS)?.[0]?.options?.[1]?.value;


    //budget constraints
      //Commented - 03-08-2022
      let bc1, bc2;
      if(agreementId_session != 'RM1043.8' && req.session.lotId == 3){  //XBN00121
      sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 21/questions`;
    
    
     sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    bc1 = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 1)?.map(o => o.nonOCDS)?.[0]?.options?.[0]?.value;
    bc2 = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 2)?.map(o => o.nonOCDS)?.[0]?.options?.[0]?.value;
      } else {
        bc1 = undefined;
        bc2 = undefined;
      }
    let reqGroup = [];
    if(agreementId_session != 'RM1043.8'){  //XBN00121
      //add your req
      sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 24/questions`;
      sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
      sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

      // let reqgroup=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==1).map(o=>o.nonOCDS)[0].options[0]?.value;
      // let reqtitle=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==2).map(o=>o.nonOCDS)[0]?.options[0]?.value;
      // let reqdesc=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==3).map(o=>o.nonOCDS)[0]?.options[0]?.value;
      
      sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api_data.sort((a, b) => (a.OCDS.id < b.OCDS.id ? -1 : 1));

     let reqGroup = [];
     sectionbaseURLfetch_dynamic_api_data?.[0]?.nonOCDS?.options?.forEach(element => {
       reqGroup.push({ desc: '', group: '', title: element.value });
     });
     let i = 0;
     sectionbaseURLfetch_dynamic_api_data?.[1]?.nonOCDS?.options?.forEach(element => {
       reqGroup?.[i].group = element.value; i = i + 1;
     });
     i = 0;
     sectionbaseURLfetch_dynamic_api_data?.[2]?.nonOCDS?.options?.forEach(element => {
       reqGroup?.[i].desc = element.value; i = i + 1;
     });
    }
    //section 3


    req.session['endDate'] = supplier_period_for_clarification_period;

    let selectedServices = [];
    const {data: getEventsData} = await TenderApi.Instance(SESSION_ID).get(`tenders/projects/${req.session.projectId}/events`);
    const overWritePaJoury = getEventsData.find(item => item.eventType == 'PA' && (item.dashboardStatus == 'CLOSED' || item.dashboardStatus == 'COMPLETE'));
    if(agreementId_session != 'RM1043.8'){
      if(overWritePaJoury)  {
        let PAAssessmentID = overWritePaJoury.assessmentId;
        const { data: supplierScoreList } = await TenderApi.Instance(SESSION_ID).get(`/assessments/${PAAssessmentID}?scores=true`);
        let dataSet = supplierScoreList.dimensionRequirements;
        if(dataSet.length > 0) {
          let dataRequirements = dataSet[0].requirements;
          dataRequirements.filter((el: any) => {
            selectedServices.push(el);
          });
        }
      }else{
        const CurrentassessmentId = req.session?.currentEvent?.assessmentId;
        const { data: supplierScoreList } = await TenderApi.Instance(SESSION_ID).get(`/assessments/${CurrentassessmentId}?scores=true`);
        let dataSet = supplierScoreList.dimensionRequirements;
        if(dataSet.length > 0) {
          let dataRequirements = dataSet[0].requirements;
          dataRequirements.filter((el: any) => {
            selectedServices.push(el);
          });
        }
      }
    }

    let forceChangeDataJson;
    if(agreementId_session == 'RM6187') { //MCF3
      forceChangeDataJson = Mcf3cmsData;
    } else if(agreementId_session == 'RM1557.13') { //G-cloud
      forceChangeDataJson = gcloudcmsData;
    } else { 
      forceChangeDataJson = cmsData;
    }
   
   let appendData;
   if(agreementId_session == 'RM1043.8') { //DOS

    let pounds = Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
  });
    appendData = {
      lotId:req.session.lotId,
      selectedServices:selectedServices,
      //eoi_data: EOI_DATA_WITHOUT_KEYDATES,
      //eoi_keydates: EOI_DATA_TIMELINE_DATES[0],
      data: forceChangeDataJson,
      project_name: project_name,
      procurementLead,
      procurementColleagues: procurementColleagues != undefined && procurementColleagues != null ? procurementColleagues : null,
      //document: FileNameStorage[FileNameStorage.length - 1],
      //documents: (FileNameStorage.length > 1) ? FileNameStorage.slice(0, FileNameStorage.length - 1) : [],
      document: fileNameStoragePrice,
      documents: fileNameStorageMandatory,

      ir35: IR35selected,
      agreement_id,
      proc_id,
      event_id,
      supplierList: supplierList != undefined && supplierList != null ? supplierList : null,
      //rfp_clarification_date: rfp_clarification_date != undefined && rfp_clarification_date != null ? rfp_clarification_date : null,
      rfp_clarification_date: rfp_clarification_date != undefined && rfp_clarification_date != null ? moment(rfp_clarification_date,'YYYY-MM-DD HH:mm',).format('DD/MM/YYYY') : null,
     // rfp_clarification_period_end: rfp_clarification_period_end != undefined && rfp_clarification_period_end != null ? rfp_clarification_period_end : null,
      rfp_clarification_period_end: rfp_clarification_period_end != undefined && rfp_clarification_period_end != null ? moment(rfp_clarification_period_end,'YYYY-MM-DD HH:mm',).format('DD/MM/YYYY, HH:mm') : null,
      deadline_period_for_clarification_period: deadline_period_for_clarification_period != undefined && deadline_period_for_clarification_period != null ?moment(deadline_period_for_clarification_period,'YYYY-MM-DD HH:mm',).format('DD/MM/YYYY, HH:mm'): null,
      supplier_period_for_clarification_period: supplier_period_for_clarification_period != undefined && supplier_period_for_clarification_period != null ?moment(supplier_period_for_clarification_period,'YYYY-MM-DD HH:mm',).format('DD/MM/YYYY, HH:mm'): null,
      supplier_dealine_for_clarification_period: supplier_dealine_for_clarification_period != undefined && supplier_dealine_for_clarification_period != null ?moment(supplier_dealine_for_clarification_period,'YYYY-MM-DD HH:mm',).format('DD/MM/YYYY, HH:mm'): null,
      supplier_dealine_evaluation_to_start: supplier_dealine_evaluation_to_start != undefined && supplier_dealine_evaluation_to_start != null ?moment(supplier_dealine_evaluation_to_start,'YYYY-MM-DD HH:mm',).format('DD/MM/YYYY, HH:mm'): null,
      supplier_dealine_expect_the_bidders: supplier_dealine_expect_the_bidders != undefined && supplier_dealine_expect_the_bidders != null ?moment(supplier_dealine_expect_the_bidders,'YYYY-MM-DD HH:mm',).format('DD/MM/YYYY, HH:mm'): null,
      supplier_dealine_for_pre_award: supplier_dealine_for_pre_award != undefined && supplier_dealine_for_pre_award != null ?moment(supplier_dealine_for_pre_award,'YYYY-MM-DD HH:mm',).format('DD/MM/YYYY, HH:mm'): null,
      supplier_dealine_for_expect_to_award: supplier_dealine_for_expect_to_award != undefined && supplier_dealine_for_expect_to_award != null ?moment(supplier_dealine_for_expect_to_award,'YYYY-MM-DD HH:mm',).format('DD/MM/YYYY, HH:mm'): null,
      supplier_dealine_sign_contract: supplier_dealine_sign_contract != undefined && supplier_dealine_sign_contract != null ?moment(supplier_dealine_sign_contract,'YYYY-MM-DD HH:mm',).format('DD/MM/YYYY, HH:mm'): null,
      supplier_dealine_for_work_to_commence: supplier_dealine_for_work_to_commence != undefined && supplier_dealine_for_work_to_commence != null ?moment(supplier_dealine_for_work_to_commence,'YYYY-MM-DD HH:mm',).format('DD/MM/YYYY, HH:mm'): null,
      supplier_sign_contract: supplier_sign_contract != undefined && supplier_sign_contract != null ? moment(supplier_sign_contract,'YYYY-MM-DD HH:mm',).format('DD/MM/YYYY, HH:mm') : null,
      supplier_start: supplier_start != undefined && supplier_start != null ? moment(supplier_start,'YYYY-MM-DD HH:mm',).format('DD/MM/YYYY, HH:mm') : null,
      resourceQuntityCount: resourceQuntityCount != undefined && resourceQuntityCount != null ? resourceQuntityCount : null,
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
      pricegroupquestion1: pricegroupquestion1 != undefined && pricegroupquestion1 != null ? pricegroupquestion1 : null,
      socialvaluegroupquestion1: socialvaluegroupquestion1 != undefined && socialvaluegroupquestion1 != null ? socialvaluegroupquestion1 : null,
      pricingModel: pricingModel != undefined && pricingModel != null ? pricingModel : null,
      culModel: culModel != undefined && culModel != null ? culModel : null,
      socialModel: socialModel != undefined && socialModel != null ? socialModel : null,
      priModel: priModel != undefined && priModel != null ? priModel : null,
      assessModel: assessModel != undefined && assessModel != null ? assessModel : null,
      questionModel: questionModel != undefined && questionModel != null ? questionModel : null,
      techGroup: techGroup != undefined && techGroup != null ? techGroup : null,
      culGroup: culGroup != undefined && culGroup != null ? culGroup : null,
      socialGroup: socialGroup != undefined && socialGroup != null ? socialGroup : null,
      tierData: tierData != undefined && tierData != null ? tierData : null,
      termAndAcr: termAndAcr != undefined && termAndAcr != null ? termAndAcr : null,
      backgroundArr: backgroundArr != undefined && backgroundArr != null ? backgroundArr : null,
      businessProbAns: businessProbAns != undefined && businessProbAns != null ? businessProbAns : null,
      keyUser: keyUser != undefined && keyUser != null ? keyUser : null,
      scoringData: scoringData != undefined && scoringData != null ? scoringData : null,
      researchDate: researchDate != undefined && researchDate != null ? researchDate : null,
      oftenresearchDate: oftenresearchDate != undefined && oftenresearchDate != null ? oftenresearchDate : null,
      weekendresearchDate: weekendresearchDate != undefined && weekendresearchDate != null ? weekendresearchDate : null,
      researchLoc: researchLoc != undefined && researchLoc != null ? researchLoc : null,
      restrictLoc: restrictLoc != undefined && restrictLoc != null ? restrictLoc : null,
      descPart: descPart != undefined && descPart != null ? descPart : null,
      digiaccess: digiaccess != undefined && digiaccess != null ? digiaccess : null,
      securityRequirements: securityRequirements != undefined && securityRequirements != null ? securityRequirements : null,
      researchPlan: researchPlan != undefined && researchPlan != null ? researchPlan : null,
      spltermAndAcr: spltermAndAcr != undefined && spltermAndAcr != null ? spltermAndAcr : null,
      budget: budget != undefined && budget != null ? budget : null,
      budgetMaximum: budgetMaximum != undefined && budgetMaximum != null ?pounds.format(budgetMaximum): null,
      budgetMinimum: budgetMinimum != undefined && budgetMinimum != null ?pounds.format(budgetMinimum): null,
      furtherInfo: furtherInfo != undefined && furtherInfo != null ? furtherInfo : null,
      contracted: contracted != undefined && contracted != null ? contracted : null,
      workcompletedsofar: workcompletedsofar != undefined && workcompletedsofar != null ? workcompletedsofar : null,
      currentphaseofproject: currentphaseofproject != undefined && currentphaseofproject != null ? currentphaseofproject : null,
      phaseResource: phaseResource != undefined && phaseResource != null ? phaseResource : null,
      indicativedurationYear: indicativedurationYear != undefined && indicativedurationYear != null ? indicativedurationYear : null,
      indicativedurationMonth: indicativedurationMonth != undefined && indicativedurationMonth != null ? indicativedurationMonth : null,
      indicativedurationDay: indicativedurationDay != undefined && indicativedurationDay != null ? indicativedurationDay : null,
      
      extentionindicativedurationYear: extentionindicativedurationYear != undefined && extentionindicativedurationYear != null ? extentionindicativedurationYear : null,
      extentionindicativedurationMonth: extentionindicativedurationMonth != undefined && extentionindicativedurationMonth != null ? extentionindicativedurationMonth : null,
      extentionindicativedurationDay: extentionindicativedurationDay != undefined && extentionindicativedurationDay != null ? extentionindicativedurationDay : null,
      
      startdate: startdate != undefined && startdate != null ? moment(startdate,'YYYY-MM-DD ',).format('DD MMMM YYYY') : null,
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
      eventStatus: ReviewData.OCDS.status == 'active' ? "published" : ReviewData.OCDS.status == 'complete' ? "published" : null, // this needs to be revisited to check the mapping of the planned 
      closeStatus:ReviewData?.nonOCDS?.dashboardStatus,
      selectedeventtype,
      agreementId_session
    };
   }
   else{
    appendData = {
      lotId:req.session.lotId,
      selectedServices:selectedServices,
      //eoi_data: EOI_DATA_WITHOUT_KEYDATES,
      //eoi_keydates: EOI_DATA_TIMELINE_DATES[0],
      data: forceChangeDataJson,
      project_name: project_name,
      procurementLead,
      procurementColleagues: procurementColleagues != undefined && procurementColleagues != null ? procurementColleagues : null,
      //document: FileNameStorage[FileNameStorage.length - 1],
      //documents: (FileNameStorage.length > 1) ? FileNameStorage.slice(0, FileNameStorage.length - 1) : [],
      document: fileNameStoragePrice,
      documents: fileNameStorageMandatory,

      ir35: IR35selected,
      agreement_id,
      proc_id,
      event_id,
      supplierList: supplierList != undefined && supplierList != null ? supplierList : null,
      rfp_clarification_date: rfp_clarification_date != undefined && rfp_clarification_date != null ? rfp_clarification_date : null,
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
      supplier_sign_contract: supplier_sign_contract != undefined && supplier_sign_contract != null ? supplier_sign_contract : null,
      supplier_start: supplier_start != undefined && supplier_start != null ? supplier_start : null,
      resourceQuntityCount: resourceQuntityCount != undefined && resourceQuntityCount != null ? resourceQuntityCount : null,
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
      pricegroupquestion1: pricegroupquestion1 != undefined && pricegroupquestion1 != null ? pricegroupquestion1 : null,
      socialvaluegroupquestion1: socialvaluegroupquestion1 != undefined && socialvaluegroupquestion1 != null ? socialvaluegroupquestion1 : null,
      pricingModel: pricingModel != undefined && pricingModel != null ? pricingModel : null,
      culModel: culModel != undefined && culModel != null ? culModel : null,
      socialModel: socialModel != undefined && socialModel != null ? socialModel : null,
      priModel: priModel != undefined && priModel != null ? priModel : null,
      assessModel: assessModel != undefined && assessModel != null ? assessModel : null,
      questionModel: questionModel != undefined && questionModel != null ? questionModel : null,
      techGroup: techGroup != undefined && techGroup != null ? techGroup : null,
      culGroup: culGroup != undefined && culGroup != null ? culGroup : null,
      socialGroup: socialGroup != undefined && socialGroup != null ? socialGroup : null,
      tierData: tierData != undefined && tierData != null ? tierData : null,
      termAndAcr: termAndAcr != undefined && termAndAcr != null ? termAndAcr : null,
      backgroundArr: backgroundArr != undefined && backgroundArr != null ? backgroundArr : null,
      businessProbAns: businessProbAns != undefined && businessProbAns != null ? businessProbAns : null,
      keyUser: keyUser != undefined && keyUser != null ? keyUser : null,
      scoringData: scoringData != undefined && scoringData != null ? scoringData : null,
      researchDate: researchDate != undefined && researchDate != null ? researchDate : null,
      oftenresearchDate: oftenresearchDate != undefined && oftenresearchDate != null ? oftenresearchDate : null,
      weekendresearchDate: weekendresearchDate != undefined && weekendresearchDate != null ? weekendresearchDate : null,
      researchLoc: researchLoc != undefined && researchLoc != null ? researchLoc : null,
      restrictLoc: restrictLoc != undefined && restrictLoc != null ? restrictLoc : null,
      descPart: descPart != undefined && descPart != null ? descPart : null,
      digiaccess: digiaccess != undefined && digiaccess != null ? digiaccess : null,
      securityRequirements: securityRequirements != undefined && securityRequirements != null ? securityRequirements : null,
      researchPlan: researchPlan != undefined && researchPlan != null ? researchPlan : null,
      spltermAndAcr: spltermAndAcr != undefined && spltermAndAcr != null ? spltermAndAcr : null,
      budget: budget != undefined && budget != null ? budget : null,
      budgetMaximum: budgetMaximum != undefined && budgetMaximum != null ? budgetMaximum : null,
      budgetMinimum: budgetMinimum != undefined && budgetMinimum != null ? budgetMinimum : null,
      furtherInfo: furtherInfo != undefined && furtherInfo != null ? furtherInfo : null,
      contracted: contracted != undefined && contracted != null ? contracted : null,
      workcompletedsofar: workcompletedsofar != undefined && workcompletedsofar != null ? workcompletedsofar : null,
      currentphaseofproject: currentphaseofproject != undefined && currentphaseofproject != null ? currentphaseofproject : null,
      phaseResource: phaseResource != undefined && phaseResource != null ? phaseResource : null,
      indicativedurationYear: indicativedurationYear != undefined && indicativedurationYear != null ? indicativedurationYear : null,
      indicativedurationMonth: indicativedurationMonth != undefined && indicativedurationMonth != null ? indicativedurationMonth : null,
      indicativedurationDay: indicativedurationDay != undefined && indicativedurationDay != null ? indicativedurationDay : null,
      
      extentionindicativedurationYear: extentionindicativedurationYear != undefined && extentionindicativedurationYear != null ? extentionindicativedurationYear : null,
      extentionindicativedurationMonth: extentionindicativedurationMonth != undefined && extentionindicativedurationMonth != null ? extentionindicativedurationMonth : null,
      extentionindicativedurationDay: extentionindicativedurationDay != undefined && extentionindicativedurationDay != null ? extentionindicativedurationDay : null,
      
      startdate: startdate != undefined && startdate != null ? moment(startdate,'YYYY-MM-DD ',).format('DD MMMM YYYY') : null,
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
      eventStatus: ReviewData.OCDS.status == 'active' ? "published" : ReviewData.OCDS.status == 'complete' ? "published" : null, // this needs to be revisited to check the mapping of the planned 
      closeStatus:ReviewData?.nonOCDS?.dashboardStatus,
      selectedeventtype,
      agreementId_session
    };
  }
    
    
    req.session['checkboxerror'] = 0;
    //Fix for SCAT-3440 
    const agreementName = req.session.agreementName;
    const lotid = req.session?.lotId;
    // const agreementId_session = req.session.agreement_id;
    const agreementLotName = req.session.agreementLotName;
    const projectId = req.session.projectId;
    res.locals.agreement_header = { agreementName, project_name, projectId, agreementId_session, agreementLotName, lotid };

    if (checkboxerror) {
      appendData = Object.assign({}, { ...appendData, checkboxerror: 1 });
    }
    if(agreementId_session == 'RM1043.8') { //DOS
      res.render('rfp-dos-review', appendData);
    } else { 

      res.render('rfp-review', appendData);
    }
    
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

  req.session.fca_selected_services = [];
  req.session['checkboxerror'] = 0;
  const { rfp_publish_confirmation, finished_pre_engage } = req.body;
  const { eventId, projectId } = req.session;
  
  
  const agreement_id = req.session.agreement_id;
  const lot_id =   req.session.lotId;

  const BASEURL = `/tenders/projects/${projectId}/events/${eventId}/publish`;
  const { SESSION_ID } = req.cookies;
  let CurrentTimeStamp = req.session.endDate;
  // if(CurrentTimeStamp){

     CurrentTimeStamp = new Date(CurrentTimeStamp).toISOString();
  // }else{
  //   CurrentTimeStamp = new Date().toISOString();
  // }
  // CurrentTimeStamp = new Date(CurrentTimeStamp.split('*')[1]).toISOString();
  const _bodyData = {
    endDate: CurrentTimeStamp,
  };

    const BaseURL2 = `/tenders/projects/${projectId}/events/${eventId}`;
    
    const FetchReviewData2 = await DynamicFrameworkInstance.Instance(SESSION_ID).get(BaseURL2);
  
    const ReviewData2 = FetchReviewData2.data;
    const eventStatus2 = ReviewData2.OCDS.status == 'active' ? "published" : null 
    
    var review_publish = 0;
    if(eventStatus2=='published'){
      review_publish = 1;
      }else{
        if (finished_pre_engage && rfp_publish_confirmation === '1') {
          review_publish = 1;
        }
      }
      const stage2BaseUrl = `/tenders/projects/${projectId}/events`;
      const stage2_dynamic_api = await TenderApi.Instance(SESSION_ID).get(stage2BaseUrl);
      const stage2_dynamic_api_data = stage2_dynamic_api.data;
      const stage2_data = stage2_dynamic_api_data?.filter((anItem: any) => anItem.id == eventId && (anItem.templateGroupId == '13' || anItem.templateGroupId == '14'));
        let stage2_value = 'Stage 1';
      if(stage2_data.length > 0){
        stage2_value = 'Stage 2';
      }
  
  if (review_publish == 1) {
    try {
      
      if (agreement_id=='RM6187') {
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/38`, 'Completed');
      }else if (agreement_id=='RM1557.13') {
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/37`, 'Completed');
      }
      else if (agreement_id=='RM1043.8') {
        if(stage2_value == 'Stage 2'){
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/41`, 'Completed');
        }
       
      }
      else{
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/41`, 'Completed');
      }
     if(agreement_id == 'RM1043.8' && (lot_id == 1 || lot_id == 3)){
       TenderApi.Instance(SESSION_ID).put(BASEURL, _bodyData);
       setTimeout(function(){
        res.redirect('/rfp/rfp-eventpublished');
        }, 5000);
     }
      else{
        await TenderApi.Instance(SESSION_ID).put(BASEURL, _bodyData);
        res.redirect('/rfp/rfp-eventpublished');

      }

     
     
      // const response = await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/2`, 'Completed');
      // if (response.status == Number(HttpStatusCode.OK)) {
      //   await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/24`, 'Completed');
      // }

     
    } catch (error) {
      LoggTracer.errorLogger(res, error, `${req.headers.host}${req.originalUrl}`, null,
        TokenDecoder.decoder(SESSION_ID), "Dyanamic framework throws error - Tender Api is causing problem", false)
      RFP_REVIEW_RENDER_TEST(req, res, true, true);
    }
  } else {

    const agreementId_session = req.session.agreement_id;
    const { eventId, projectId } = req.session;
    const { SESSION_ID } = req.cookies;
      
    req.session['checkboxerror'] = 1;
    if (agreementId_session=='RM1043.8') {//DOS
      if(stage2_value !== undefined && stage2_value === "Stage 2"){//Stage 2
        RFP_REVIEW_RENDER_STAGE(req, res, false, false);
      }else{
        RFP_REVIEW_RENDER_TEST(req, res, false, false);
      }
    } else if (agreementId_session=='RM1557.13') {//GCLOUD
      RFP_REVIEW_RENDER_GCLOUD(req, res, false, false);
    }
    else{
      RFP_REVIEW_RENDER_TEST_MCF(req, res, false, false);
    }
    // RFP_REVIEW_RENDER_TEST(req, res, true, false);
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

    res.locals.agreement_header = { agreementName, project_name, projectId, agreementId_session, agreementLotName, lotid };

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

const mapTableDefinationData = (tableData) => {
  let object = null;
  var columnsHeaderList = getColumnsHeaderList(tableData.tableDefinition?.titles?.columns);
  //var rowDataList
  var tableDefination = tableData.tableDefinition != undefined && tableData.tableDefinition.data != undefined ? getRowDataList(tableData.tableDefinition?.titles?.rows, tableData.tableDefinition?.data) : null

  return { head: columnsHeaderList?.length > 0 && tableDefination?.length > 0 ? columnsHeaderList : [], rows: tableDefination?.length > 0 ? tableDefination : [] };
}

const getColumnsHeaderList = (columns) => {
  const list = columns?.map(element => {
    return { text: element.name };
  });
  return list
}
const getRowDataList = (rows, data1) => {
  let dataRowsList = [];
  rows?.forEach(element => {
    element.text = element.name;
    var data = getDataList(element.id, data1);
    let innerArrObj = [{ text: element.name, "classes": "govuk-!-width-one-quarter" }, { "classes": "govuk-!-width-one-quarter", text: data[0].cols[0] }, { "classes": "govuk-!-width-one-half", text: data[0].cols[1] }]
    dataRowsList.push(innerArrObj);
  });
  return dataRowsList;
}
const getDataList = (id, data) => {
  const obj = data?.filter(element => {
    if (element.row == id) {
      return element;
    }
  });
  return obj;
}



//MCF 3 modification

const RFP_REVIEW_RENDER_TEST_MCF = async (req: express.Request, res: express.Response, viewError: boolean, apiError: boolean) => {
 
  const { SESSION_ID } = req.cookies;
  const proc_id = req.session['projectId'];
  const event_id = req.session['eventId'];
  

  const BaseURL = `/tenders/projects/${proc_id}/events/${event_id}`;
  const { checkboxerror } = req.session;
  const agreementId_session = req.session.agreement_id;
  let selectedeventtype;
  if(req.session.selectedRoute=='rfp'){
    selectedeventtype='FC';
  }else{
    selectedeventtype=req.session.selectedeventtype;
  }

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
    const FileNameStorage = FETCH_FILEDATA?.map(file => file.fileName);
    let fileNameStoragePrice = [];
    let fileNameStorageMandatory = [];
    FETCH_FILEDATA?.map(file => {
      if (file.description === "mandatoryfirst") {
        fileNameStoragePrice.push(file.fileName);
      }
      if (file.description === "mandatorysecond") {
        fileNameStorageMandatory.push(file.fileName);
      }

      if (file.description === "optional") {
        fileNameStorageMandatory.push(file.fileName);
      }
      
    });


    const IR35Dataset = {
      id: 'Criterion 3',
      group_id: 'Group 2',
      question: 'Question 1',
    };

const IR35selected='';
    // const IR35BaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${IR35Dataset.id}/groups/${IR35Dataset.group_id}/questions`;
    // const IR35 = await TenderApi.Instance(SESSION_ID).get(IR35BaseURL);
    // const IR35Data = IR35?.data;
    // const IR35selected = IR35Data?.[0].nonOCDS?.options?.filter(data => data.selected == true)?.map(data => data.value)?.[0]
    const agreement_id = req.session['agreement_id'];
    
// supplier filtered list
    // let supplierList = [];
    // supplierList = await GetLotSuppliers(req);
    let supplierList = [];
    const supplierBaseURL: any = `/tenders/projects/${proc_id}/events/${event_id}/suppliers`;
    const SUPPLIERS = await DynamicFrameworkInstance.Instance(SESSION_ID).get(supplierBaseURL);
    let SUPPLIER_DATA = SUPPLIERS?.data;//saved suppliers
    if(SUPPLIER_DATA!=undefined){
      let allSuppliers=await GetLotSuppliers(req);
      for(let i=0;i<SUPPLIER_DATA.suppliers.length;i++)
          {
              let supplierInfo=allSuppliers.filter(s=>s.organization.id==SUPPLIER_DATA.suppliers[i].id)?.[0];
              if(supplierInfo!=undefined)
              {
                supplierList.push(supplierInfo);
              }
          }
    }
    else{
    supplierList = await GetLotSuppliers(req);
    }
    
    supplierList=supplierList.sort((a, b) => a.organization.name.replace("-"," ").toLowerCase() < b.organization.name.replace("-"," ").toLowerCase() ? -1 : a.organization.name.replace("-"," ").toLowerCase() > b.organization.name.replace("-"," ").toLowerCase() ? 1 : 0);
    const supplierLength=supplierList.length;
// supplier filtered list end


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
    const rfp_clarification_date = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 1").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;
    const rfp_clarification_period_end = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 2").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;

    const deadline_period_for_clarification_period = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 3").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;

    const supplier_period_for_clarification_period = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 4").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;
    
    //var supplier_period_for_clarification_period =moment(new Date(supplier_period_for_clarification_period_date).toLocaleString('en-GB', { timeZone: 'Europe/London' }),'DD/MM/YYYY hh:mm:ss',).format('YYYY-MM-DDTHH:mm:ss')+'Z';
    
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
      if( highestSecuritySelected==='0: None')highestSecuritySelected='0: No security clearance needed'
      serviceCapabilitesCount = dimensionRequirements?.filter(dimension => dimension.name === 'Service Offering')?.[0]?.requirements?.length;
      whereWorkDone = dimensionRequirements?.filter(dimension => dimension.name === 'Location')?.[0]?.requirements?.map(n => n.name);
    }
    let resourceQuntityCount = resourceQuantity?.length;
    StorageForSortedItems = await CalVetting(req);
    let StorageForServiceCapability = []
    StorageForServiceCapability = await CalServiceCapability(req);
    //section 5 
    //question 2
    let sectionbaseURL: any = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 2/groups/Group 2/questions`;
    let sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    let sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

   // sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api_data.sort((a, b) => (a.OCDS.id < b.OCDS.id ? -1 : 1));
    let overallratioQuestion1 = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS?.order == 1).map(o => o.nonOCDS)[0].options[0]?.value;
    let overallratioQuestion2 = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS?.order == 2).map(o => o.nonOCDS)[0].options[0]?.value;

   // let overallratioQuestion1 = sectionbaseURLfetch_dynamic_api_data?.[1].nonOCDS?.options?.[0]?.value;
   // let overallratioQuestion2 = sectionbaseURLfetch_dynamic_api_data?.[0].nonOCDS?.options?.[0]?.value;

    //question 3
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 2/groups/Group 3/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    let culturalgroupquestion1 ='';
    let technicalgroupquestion1 = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS?.order == 1).map(o => o.nonOCDS)[0].options[0]?.value;
    if(agreementId_session == 'RM6263') { // DSP
     culturalgroupquestion1 = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS?.order == 2).map(o => o.nonOCDS)[0].options[0]?.value;
    }  
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
    if(agreementId_session == 'RM6263') { // DSP
    sectionbaseURLfetch_dynamic_api_data?.filter(o => o.OCDS?.id == 'Question 2')?.[0].nonOCDS?.options?.forEach(element => {
      techGroup[j].add = element.value; j = j + 1;
    });
  }
    j = 0;
    sectionbaseURLfetch_dynamic_api_data?.filter(o => o.OCDS?.id == 'Question 4')?.[0].nonOCDS?.options?.forEach(element => {
      techGroup?.[j].weight = element?.value; j = j + 1;
    });
    if(agreementId_session == 'RM6263') { // DSP
    j = 0;
    sectionbaseURLfetch_dynamic_api_data?.filter(o => o.OCDS?.id == 'Question 3')?.[0].nonOCDS?.options?.forEach(element => {
      techGroup?.[j].good = element?.value; j = j + 1;
    });
  }
    let culGroup = [];

    if(agreementId_session == 'RM6263') { // DSP
    //question 5
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 2/groups/Group 5/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    // let culturalquestion1=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==1).map(o=>o.nonOCDS)[0].options[0]?.value;
    // let culturalquestion2=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==2).map(o=>o.nonOCDS)[0].options[0]?.value;
    // let culturalquestion3=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==3).map(o=>o.nonOCDS)[0].options[0]?.value;
    // let culturalquestion4=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==4)?.map(o=>o.nonOCDS)[0]?.options[0]?.value;

    
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
  }
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
    if(agreementId_session == 'RM6263') { // DSP
    j = 0;
    sectionbaseURLfetch_dynamic_api_data?.filter(o => o.OCDS?.id == 'Question 2')?.[0].nonOCDS?.options?.forEach(element => {
      socialGroup[j].add = element.value; j = j + 1;
    });
    }
    j = 0;
    sectionbaseURLfetch_dynamic_api_data?.filter(o => o?.OCDS?.id == 'Question 1')?.[0].nonOCDS?.options?.forEach(element => {
      socialGroup[j].tech = element.value; j = j + 1;
    });
    if(agreementId_session == 'RM6263') { // DSP
    j = 0;
    sectionbaseURLfetch_dynamic_api_data?.filter(o => o?.OCDS?.id == 'Question 3')?.[0].nonOCDS?.options?.forEach(element => {
      socialGroup?.[j].good = element?.value; j = j + 1;
    });
   }
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
    let tierData = newfilteredData.titles.rows;
    //  let tierData = tierInfo?.filter(o => o?.OCDS?.id == 'Question 1')?.[0]?.nonOCDS?.options?.[0].tableDefinition?.titles?.rows;
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
        var info = { text: element.value, value: element.text };
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
    const SortedData = sectionbaseURLfetch_dynamic_api_data.sort((a, b) => parseFloat(b.nonOCDS.order) - parseFloat(a.nonOCDS.order));

    data = SortedData?.map(a => a.nonOCDS)?.map(b => b.options);
    
    if (data != undefined) {
      //data[0].forEach(element => {
      backgroundArr.push({ v1: data?.[1]?.[0]?.value, v2: data?.[0]?.[0]?.value });
      //});
    }

    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 5/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
    let businessProbAns = sectionbaseURLfetch_dynamic_api_data?.filter(o => o?.nonOCDS?.order == 1).map(o => o.nonOCDS)?.[0].options?.[0]?.value;

    //question 5
    let keyUser = []
    if(agreementId_session == 'RM6263') { // DSP
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 6/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    //let keyuser1=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==1).map(o=>o.nonOCDS)[0].options[0]?.value;
    
    data = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 1)?.[0]?.nonOCDS?.options;
    if (data != undefined) {
      data?.forEach(element => {
        var info = { text: element.text, value: element.value };
        keyUser.push(info);
      });
    }
  }
    //work completed so far
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 7/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    let workcompletedsofar = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS?.order == 1).map(o => o.nonOCDS)?.[0].options?.[0]?.value;


    //current phase of project
    let currentphaseofproject='';
    if(agreementId_session != 'RM6187') {
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 8/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    let currentphaseofproject = sectionbaseURLfetch_dynamic_api_data?.[0].nonOCDS?.options?.filter(o => o.selected == true)?.[0]?.value;
    }
    let phaseResource = [];
    if(agreementId_session == 'RM6263') { // DSP
    //phase resource is required for
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 9/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    //let phaseresisreq=sectionbaseURLfetch_dynamic_api_data[0].nonOCDS.options.filter(o=>o.selected==true)[0]?.value;

    
    phaseResource = sectionbaseURLfetch_dynamic_api_data?.[0].nonOCDS?.options?.filter(o => o.selected == true)?.map(a => a.value)
    }

    //indicative start date
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 10/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
    let dateOptions = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 1).map(o => o.nonOCDS)?.[0]?.options;
    // let startdate = dateOptions != null && dateOptions?.length > 0 ? dateOptions?.[0].value?.padStart(2, 0): null;
    let startdate = '';
    if(dateOptions != null && dateOptions?.length > 0 && dateOptions?.length == 3){
      startdate = dateOptions != null && dateOptions?.length > 0 ? `${dateOptions?.[2].value}-${dateOptions?.[1].value}-${dateOptions?.[0].value}`?.padStart(2, 0): null;
    }else{
      startdate = dateOptions != null && dateOptions?.length > 0 ? dateOptions?.[0].value ?.padStart(2, 0): null;
    }

    let optionalDate = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 2)?.map(o => o.nonOCDS)?.[0]?.options?.[0]?.value;

    let extentionOptionalDate = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 3)?.map(o => o.nonOCDS)?.[0]?.options?.[0]?.value;

    //let startdate=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==1).map(o=>o.nonOCDS)[0].options[0]?.value;

    let indicativedurationYear = ''
    let indicativedurationMonth = ''
    let indicativedurationDay = ''
    if (optionalDate != undefined) {
      indicativedurationYear = optionalDate?.substring(1)?.split("Y")?.[0] + " years"
      indicativedurationMonth = optionalDate?.substring(1)?.split("Y")?.[1]?.split("M")?.[0] + " months"
      indicativedurationDay = optionalDate?.substring(1)?.split("Y")?.[1]?.split("M")?.[1].replace("D", "") + " days"
    }

    let extentionindicativedurationYear = ''
    let extentionindicativedurationMonth = ''
    let extentionindicativedurationDay = ''
    if (extentionOptionalDate != undefined) {
      extentionindicativedurationYear = extentionOptionalDate?.substring(1)?.split("Y")?.[0] + " years"
      extentionindicativedurationMonth = extentionOptionalDate?.substring(1)?.split("Y")?.[1]?.split("M")?.[0] + " months"
      extentionindicativedurationDay = extentionOptionalDate?.substring(1)?.split("Y")?.[1]?.split("M")?.[1].replace("D", "") + " days"
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
    let buyingorg2 = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 2)?.map(o => o.nonOCDS)?.[0]?.options?.[0]?.value;

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
    let suppliername = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.questionType == 'Text')?.map(o => o.nonOCDS)?.[0]?.options?.[0]?.value;

    //management info
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 17/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    let managementinfo = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 1)?.map(o => o.nonOCDS)?.[0].options?.[0]?.value;

    //service level
    // Commented - 03-08-2022
  
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
      //Commented - 03-08-2022
    // sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 20/questions`;
    // sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = [];//sectionbaseURLfetch_dynamic_api?.data;
    
    let incentive1 = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 1)?.map(o => o.nonOCDS)?.[0]?.options?.[0]?.value;
    let incentive2 = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 1)?.map(o => o.nonOCDS)?.[0]?.options?.[1]?.value;


    //budget constraints
      //Commented - 03-08-2022

    
      sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 21/questions`;
    
    
     sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    let bc1 = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 1)?.map(o => o.nonOCDS)?.[0]?.options?.[0]?.value;
    let bc2 = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 2)?.map(o => o.nonOCDS)?.[0]?.options?.[0]?.value;
    
    //add your req
    
      sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 24/questions`;
    

    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    // let reqgroup=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==1).map(o=>o.nonOCDS)[0].options[0]?.value;
    // let reqtitle=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==2).map(o=>o.nonOCDS)[0]?.options[0]?.value;
    // let reqdesc=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==3).map(o=>o.nonOCDS)[0]?.options[0]?.value;
    
   
      sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api_data.sort((a, b) => (a.OCDS.id < b.OCDS.id ? -1 : 1));

     let reqGroup = [];
     sectionbaseURLfetch_dynamic_api_data?.[0]?.nonOCDS?.options?.forEach(element => {
       reqGroup.push({ desc: '', group: '', title: element.value });
     });
     let i = 0;
     sectionbaseURLfetch_dynamic_api_data?.[1]?.nonOCDS?.options?.forEach(element => {
       reqGroup?.[i].group = element.value; i = i + 1;
     });
     i = 0;
     sectionbaseURLfetch_dynamic_api_data?.[2]?.nonOCDS?.options?.forEach(element => {
       reqGroup?.[i].desc = element.value; i = i + 1;
     });
    
    // let reqGroup = [];
    // sectionbaseURLfetch_dynamic_api_data?.[0]?.nonOCDS?.options?.forEach(element => {
    //   reqGroup.push({ desc: '', group: '', title: element.value });
    // });
    // let i = 0;
    // sectionbaseURLfetch_dynamic_api_data?.[1]?.nonOCDS?.options?.forEach(element => {
    //   reqGroup?.[i].desc = element.value; i = i + 1;
    // });
    // i = 0;
    // sectionbaseURLfetch_dynamic_api_data?.[2]?.nonOCDS?.options?.forEach(element => {
    //   reqGroup?.[i].group = element.value; i = i + 1;
    // });

    //section 3


    req.session['endDate'] = supplier_period_for_clarification_period;

    let selectedServices = [];
    const {data: getEventsData} = await TenderApi.Instance(SESSION_ID).get(`tenders/projects/${req.session.projectId}/events`);
    const overWritePaJoury = getEventsData.find(item => item.eventType == 'PA' && (item.dashboardStatus == 'CLOSED' || item.dashboardStatus == 'COMPLETE'));
    if(overWritePaJoury)  {
      let PAAssessmentID = overWritePaJoury.assessmentId;
      const { data: supplierScoreList } = await TenderApi.Instance(SESSION_ID).get(`/assessments/${PAAssessmentID}?scores=true`);
      let dataSet = supplierScoreList.dimensionRequirements;
      if(dataSet.length > 0) {
        let dataRequirements = dataSet[0].requirements;
        dataRequirements.filter((el: any) => {
          selectedServices.push(el);
        });
      }
    }else{
      const CurrentassessmentId = req.session?.currentEvent?.assessmentId;
      const { data: supplierScoreList } = await TenderApi.Instance(SESSION_ID).get(`/assessments/${CurrentassessmentId}?scores=true`);
      let dataSet = supplierScoreList.dimensionRequirements;
      if(dataSet.length > 0) {
        let dataRequirements = dataSet[0].requirements;
        dataRequirements.filter((el: any) => {
          selectedServices.push(el);
        });
      }
    }

    let forceChangeDataJson;
    if(agreementId_session == 'RM6187') { //MCF3
      forceChangeDataJson = Mcf3cmsData;
    } else if(agreementId_session == 'RM1557.13') { //G-cloud
      forceChangeDataJson = gcloudcmsData;
    } else { 
      forceChangeDataJson = cmsData;
    }
   
    let appendData = {
      selectedServices:selectedServices,
      //eoi_data: EOI_DATA_WITHOUT_KEYDATES,
      //eoi_keydates: EOI_DATA_TIMELINE_DATES[0],
      data: forceChangeDataJson,
      project_name: project_name,
      procurementLead,
      procurementColleagues: procurementColleagues != undefined && procurementColleagues != null ? procurementColleagues : null,
      //document: FileNameStorage[FileNameStorage.length - 1],
      //documents: (FileNameStorage.length > 1) ? FileNameStorage.slice(0, FileNameStorage.length - 1) : [],
      document: fileNameStoragePrice,
      documents: fileNameStorageMandatory,

      ir35: IR35selected,
      agreement_id,
      proc_id,
      event_id,
      supplierList: supplierList != undefined && supplierList != null ? supplierList : null,
      //rfp_clarification_date,
      rfp_clarification_date: rfp_clarification_date != undefined && rfp_clarification_date != null ? rfp_clarification_date : null,
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
      resourceQuntityCount: resourceQuntityCount != undefined && resourceQuntityCount != null ? resourceQuntityCount : null,
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
      
      extentionindicativedurationYear: extentionindicativedurationYear != undefined && extentionindicativedurationYear != null ? extentionindicativedurationYear : null,
      extentionindicativedurationMonth: extentionindicativedurationMonth != undefined && extentionindicativedurationMonth != null ? extentionindicativedurationMonth : null,
      extentionindicativedurationDay: extentionindicativedurationDay != undefined && extentionindicativedurationDay != null ? extentionindicativedurationDay : null,
      
      startdate: startdate != undefined && startdate != null ? moment(startdate,'YYYY-MM-DD ',).format('DD MMMM YYYY') : null,
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
      closeStatus:ReviewData?.nonOCDS?.dashboardStatus,
      selectedeventtype,
      agreementId_session
    };
    req.session['checkboxerror'] = 0;
    //Fix for SCAT-3440 
    const agreementName = req.session.agreementName;
    const lotid = req.session?.lotId;
    // const agreementId_session = req.session.agreement_id;
    const agreementLotName = req.session.agreementLotName;
    const projectId = req.session.projectId;

    res.locals.agreement_header = { agreementName, project_name, projectId, agreementId_session, agreementLotName, lotid };

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


//GCLOUD

const RFP_REVIEW_RENDER_GCLOUD = async (req: express.Request, res: express.Response, viewError: boolean, apiError: boolean) => {
 
  const { SESSION_ID } = req.cookies;
  const proc_id = req.session['projectId'];
  const event_id = req.session['eventId'];
  const projectId = req.session['projectId'];

  const BaseURL = `/tenders/projects/${proc_id}/events/${event_id}`;
  const { checkboxerror } = req.session;
  const agreementId_session = req.session.agreement_id;
  let selectedeventtype;
  if(req.session.selectedRoute=='rfp'){
    selectedeventtype='FC';
  }else{
    selectedeventtype=req.session.selectedeventtype;
  }

  try {
    let flag = await ShouldEventStatusBeUpdated(event_id, 41, req);
    if (flag) {
      await TenderApi.Instance(SESSION_ID).put(`journeys/${event_id}/steps/41`, 'In progress');
    }
    const FetchReviewData = await DynamicFrameworkInstance.Instance(SESSION_ID).get(BaseURL);
    const ReviewData = FetchReviewData.data;
   
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
    const FileNameStorage = FETCH_FILEDATA?.map(file => file.fileName);
    let fileNameStoragePrice = [];
    let fileNameStorageMandatory = [];
    let fileNameStorageOptional = [];
    FETCH_FILEDATA?.map(file => {
      if (file.description === "mandatoryfirst") {
        fileNameStoragePrice.push(file.fileName);
      }
      if (file.description === "mandatorysecond") {
        fileNameStorageMandatory.push(file.fileName);
      }

      if (file.description === "optional") {
        fileNameStorageOptional.push(file.fileName);
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

// supplier filtered list
    // let supplierList = [];
    // supplierList = await GetLotSuppliers(req);
    let supplierList = [];
    const supplierBaseURL: any = `/tenders/projects/${proc_id}/events/${event_id}/suppliers`;
    const SUPPLIERS = await DynamicFrameworkInstance.Instance(SESSION_ID).get(supplierBaseURL);
    let SUPPLIER_DATA = SUPPLIERS?.data;//saved suppliers
    if(SUPPLIER_DATA!=undefined){
      let allSuppliers=await GetLotSuppliers(req);
      for(let i=0;i<SUPPLIER_DATA.suppliers.length;i++)
          {
              let supplierInfo=allSuppliers.filter(s=>s.organization.id==SUPPLIER_DATA.suppliers[i].id)?.[0];
              if(supplierInfo!=undefined)
              {
                supplierList.push(supplierInfo);
              }
          }
    }
    else{
    supplierList = await GetLotSuppliers(req);
    }
    
    supplierList=supplierList.sort((a, b) => a.organization.name.replace("-"," ").toLowerCase() < b.organization.name.replace("-"," ").toLowerCase() ? -1 : a.organization.name.replace("-"," ").toLowerCase() > b.organization.name.replace("-"," ").toLowerCase() ? 1 : 0);
    const supplierLength=supplierList.length;
// supplier filtered list end


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
    const rfp_clarification_date = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 1").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;
    const rfp_clarification_period_end = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 2").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;

    const deadline_period_for_clarification_period = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 3").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;

    const supplier_period_for_clarification_period = fetchQuestionsData?.filter(item => item?.OCDS?.id == "Question 4").map(item => item?.nonOCDS?.options)?.[0]?.find(i => i?.value)?.value;
    
    //var supplier_period_for_clarification_period =moment(new Date(supplier_period_for_clarification_period_date).toLocaleString('en-GB', { timeZone: 'Europe/London' }),'DD/MM/YYYY hh:mm:ss',).format('YYYY-MM-DDTHH:mm:ss')+'Z';
    
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
      if( highestSecuritySelected==='0: None')highestSecuritySelected='0: No security clearance needed'
      serviceCapabilitesCount = dimensionRequirements?.filter(dimension => dimension.name === 'Service Offering')?.[0]?.requirements?.length;
      whereWorkDone = dimensionRequirements?.filter(dimension => dimension.name === 'Location')?.[0]?.requirements?.map(n => n.name);
    }
    let resourceQuntityCount = resourceQuantity?.length;
    StorageForSortedItems = await CalVetting(req);
    let StorageForServiceCapability = []
    StorageForServiceCapability = await CalServiceCapability(req);
    //section 5 
    //question 2
    let sectionbaseURL: any = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 2/groups/Group 2/questions`;
    let sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    let sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

   // sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api_data.sort((a, b) => (a.OCDS.id < b.OCDS.id ? -1 : 1));
    let overallratioQuestion1 = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS?.order == 1).map(o => o.nonOCDS)[0].options[0]?.value;
    let overallratioQuestion2 = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS?.order == 2).map(o => o.nonOCDS)[0].options[0]?.value;

   // let overallratioQuestion1 = sectionbaseURLfetch_dynamic_api_data?.[1].nonOCDS?.options?.[0]?.value;
   // let overallratioQuestion2 = sectionbaseURLfetch_dynamic_api_data?.[0].nonOCDS?.options?.[0]?.value;

    //question 3
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 2/groups/Group 3/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    let culturalgroupquestion1 ='';
    let technicalgroupquestion1 = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS?.order == 1).map(o => o.nonOCDS)[0].options[0]?.value;
    if(agreementId_session == 'RM6263') { // DSP
     culturalgroupquestion1 = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS?.order == 2).map(o => o.nonOCDS)[0].options[0]?.value;
    }  
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
    
    sectionbaseURLfetch_dynamic_api_data?.filter(o => o.OCDS?.id == 'Question 4')?.[0].nonOCDS?.options?.forEach(element => {
      techGroup?.[j].weight = element?.value; j = j + 1;
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
    sectionbaseURLfetch_dynamic_api_data?.filter(o => o?.OCDS?.id == 'Question 1')?.[0].nonOCDS?.options?.forEach(element => {
      socialGroup[j].tech = element.value; j = j + 1;
    });
 
    

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
    let tierData = newfilteredData.titles.rows;
    //  let tierData = tierInfo?.filter(o => o?.OCDS?.id == 'Question 1')?.[0]?.nonOCDS?.options?.[0].tableDefinition?.titles?.rows;
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
        var info = { text: element.value, value: element.text };
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
    const SortedData = sectionbaseURLfetch_dynamic_api_data.sort((a, b) => parseFloat(b.nonOCDS.order) - parseFloat(a.nonOCDS.order));

    data = SortedData?.map(a => a.nonOCDS)?.map(b => b.options);
    
    if (data != undefined) {
      //data[0].forEach(element => {
      backgroundArr.push({ v1: data?.[1]?.[0]?.value, v2: data?.[0]?.[0]?.value });
      //});
    }

    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 5/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
    let businessProbAns = sectionbaseURLfetch_dynamic_api_data?.filter(o => o?.nonOCDS?.order == 1).map(o => o.nonOCDS)?.[0].options?.[0]?.value;

    //question 5
    let keyUser = []
    if(agreementId_session == 'RM6263') { // DSP
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 6/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    //let keyuser1=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==1).map(o=>o.nonOCDS)[0].options[0]?.value;
    
    data = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 1)?.[0]?.nonOCDS?.options;
    if (data != undefined) {
      data?.forEach(element => {
        var info = { text: element.text, value: element.value };
        keyUser.push(info);
      });
    }
  }
    //work completed so far
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 7/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    let workcompletedsofar = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS?.order == 1).map(o => o.nonOCDS)?.[0].options?.[0]?.value;


    //current phase of project
    let currentphaseofproject='';

    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 8/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

     currentphaseofproject = sectionbaseURLfetch_dynamic_api_data?.[0].nonOCDS?.options?.filter(o => o.selected == true)?.[0]?.value;

    
        
    //phase resource is required for
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 9/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    let dateOptions = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 1).map(o => o.nonOCDS)?.[0]?.options;
    // let startdate = dateOptions != null && dateOptions?.length > 0 ? dateOptions?.[0].value?.padStart(2, 0): null;
    let startdate = '';
    if(dateOptions != null && dateOptions?.length > 0 && dateOptions?.length == 3){
      startdate = dateOptions != null && dateOptions?.length > 0 ? `${dateOptions?.[2].value}-${dateOptions?.[1].value}-${dateOptions?.[0].value}`?.padStart(2, 0): null;
    }else{
      startdate = dateOptions != null && dateOptions?.length > 0 ? dateOptions?.[0].value ?.padStart(2, 0): null;
    }
   

    //indicative start date
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 10/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
        
    let optionalDate = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 1)?.map(o => o.nonOCDS)?.[0]?.options?.[0]?.value;

    let extentionOptionalDate = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 2)?.map(o => o.nonOCDS)?.[0]?.options?.[0]?.value;
    
    //let startdate=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==1).map(o=>o.nonOCDS)[0].options[0]?.value;

    let indicativedurationYear = ''
    let indicativedurationMonth = ''
    let indicativedurationDay = ''
    if (optionalDate != undefined) {
      indicativedurationYear = optionalDate?.substring(1)?.split("Y")?.[0] + " years"
      indicativedurationMonth = optionalDate?.substring(1)?.split("Y")?.[1]?.split("M")?.[0] + " months"
      indicativedurationDay = optionalDate?.substring(1)?.split("Y")?.[1]?.split("M")?.[1].replace("D", "") + " days"
    }

    let extentionindicativedurationYear = ''
    let extentionindicativedurationMonth = ''
    let extentionindicativedurationDay = ''
    if (extentionOptionalDate != undefined) {
      extentionindicativedurationYear = extentionOptionalDate?.substring(1)?.split("Y")?.[0] + " years"
      extentionindicativedurationMonth = extentionOptionalDate?.substring(1)?.split("Y")?.[1]?.split("M")?.[0] + " months"
      extentionindicativedurationDay = extentionOptionalDate?.substring(1)?.split("Y")?.[1]?.split("M")?.[1].replace("D", "") + " days"
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
    let buyingorg2 = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 2)?.map(o => o.nonOCDS)?.[0]?.options?.[0]?.value;

 //summarize
  sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 12/questions`;
  sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
  sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;
  
  let premarket = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 1)?.map(o => o.nonOCDS)?.[0]?.options?.[0]?.value;


  //current phase of project
  let expanded='';

  sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 13/questions`;
  sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
  sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

  expanded = sectionbaseURLfetch_dynamic_api_data?.[0].nonOCDS?.options?.filter(o => o.selected == true)?.[0]?.value;

    //summarize
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 14/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    let incumbentoption = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.questionType == 'SingleSelect')?.[0]?.nonOCDS?.options?.filter(o => o.selected == true)?.[0]?.value;
    let suppliername = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.questionType == 'Text')?.map(o => o.nonOCDS)?.[0]?.options?.[0]?.value;

    //new replacement
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 15/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    let newreplace = sectionbaseURLfetch_dynamic_api_data[0].nonOCDS?.options?.filter(o => o.selected == true)?.[0]?.value;

    //incumbemt supplier
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 16/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    let serviceLevel = [];
    let data1 = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.OCDS.id == 'Question 1')?.[0]?.nonOCDS?.options;
    let data2 = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.OCDS.id == 'Question 2')?.[0]?.nonOCDS?.options;
    let dataPercent = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.OCDS.id == 'Question 3')?.[0]?.nonOCDS?.options;
    if (data1 != undefined && data2 != undefined && dataPercent != undefined) {
      for (let i = 0; i < data1?.length; i++) {
        serviceLevel.push({ text: data1?.[i]?.value, value: data2?.[i]?.value, percent: dataPercent?.[i]?.value });
      }
    }

    //management info
    sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 17/questions`;
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    let bc1 = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 2)?.map(o => o.nonOCDS)?.[0]?.options?.[0]?.value;
    let bc2 = sectionbaseURLfetch_dynamic_api_data?.filter(o => o.nonOCDS.order == 3)?.map(o => o.nonOCDS)?.[0]?.options?.[0]?.value;

    //service level
    // Commented - 03-08-2022
  
      sectionbaseURL = `/tenders/projects/${proc_id}/events/${event_id}/criteria/Criterion 3/groups/Group 18/questions`;
   
    sectionbaseURLfetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(sectionbaseURL);
    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api?.data;

    sectionbaseURLfetch_dynamic_api_data = sectionbaseURLfetch_dynamic_api_data.sort((a, b) => (a.OCDS.id < b.OCDS.id ? -1 : 1));

     let reqGroup = [];
     sectionbaseURLfetch_dynamic_api_data?.[0]?.nonOCDS?.options?.forEach(element => {
       reqGroup.push({ desc: '',  title: element.value });
     });
     let i = 0;
     
     sectionbaseURLfetch_dynamic_api_data?.[1]?.nonOCDS?.options?.forEach(element => {
       reqGroup?.[i].desc = element.value; i = i + 1;
     });

    // let servicelevel1=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==1).map(o=>o.nonOCDS)[0].options[0]?.value;
    // let servicelevel2=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==2 && o.nonOCDS.questionType!="Percentage").map(o=>o.nonOCDS)[0].options[0]?.value;
    // let servicelevel3=sectionbaseURLfetch_dynamic_api_data.filter(o=>o.nonOCDS.order==2 && o.nonOCDS.questionType=="Percentage").map(o=>o.nonOCDS)[0].options[0]?.value;

    //section 3


    req.session['endDate'] = supplier_period_for_clarification_period;

    let selectedServices = [];
    const baseServiceURL: any = `/tenders/projects/${req.session.projectId}/events/${req.session.eventId}/criteria/Criterion 4/groups/Group 1/questions`;
    const fetch_dynamic_service_api = await TenderApi.Instance(SESSION_ID).get(baseServiceURL);
    let fetch_dynamic_service_api_data = fetch_dynamic_service_api?.data;
    selectedServices = fetch_dynamic_service_api_data?.[0].nonOCDS?.options?.filter(data => data.selected == true)?.map(data => data.value); 
    
    

    let forceChangeDataJson;
    if(agreementId_session == 'RM6187') { //MCF3
      forceChangeDataJson = Mcf3cmsData;
    } else if(agreementId_session == 'RM1557.13') { //G-cloud
      forceChangeDataJson = gcloudcmsData;
    } else { 
      forceChangeDataJson = cmsData;
    }
   
    let appendData = {
      selectedServices:selectedServices,
      //eoi_data: EOI_DATA_WITHOUT_KEYDATES,
      //eoi_keydates: EOI_DATA_TIMELINE_DATES[0],
      data: forceChangeDataJson,
      project_name: project_name,
      procurementLead,
      procurementColleagues: procurementColleagues != undefined && procurementColleagues != null ? procurementColleagues : null,
      //document: FileNameStorage[FileNameStorage.length - 1],
      //documents: (FileNameStorage.length > 1) ? FileNameStorage.slice(0, FileNameStorage.length - 1) : [],
      document: fileNameStoragePrice,
      documents: fileNameStorageMandatory,
      documentsOptional:fileNameStorageOptional,

      ir35: IR35selected,
      agreement_id,
      proc_id,
      event_id,
      supplierList: supplierList != undefined && supplierList != null ? supplierList : null,
      //rfp_clarification_date,
      rfp_clarification_date: rfp_clarification_date != undefined && rfp_clarification_date != null ? rfp_clarification_date : null,
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
      resourceQuntityCount: resourceQuntityCount != undefined && resourceQuntityCount != null ? resourceQuntityCount : null,
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
      socialGroup: socialGroup != undefined && socialGroup != null ? socialGroup : null,
      tierData: tierData != undefined && tierData != null ? tierData : null,
      termAndAcr: termAndAcr != undefined && termAndAcr != null ? termAndAcr : null,
      backgroundArr: backgroundArr != undefined && backgroundArr != null ? backgroundArr : null,
      businessProbAns: businessProbAns != undefined && businessProbAns != null ? businessProbAns : null,
      keyUser: keyUser != undefined && keyUser != null ? keyUser : null,
      workcompletedsofar: workcompletedsofar != undefined && workcompletedsofar != null ? workcompletedsofar : null,
      currentphaseofproject: currentphaseofproject != undefined && currentphaseofproject != null ? currentphaseofproject : null,
      indicativedurationYear: indicativedurationYear != undefined && indicativedurationYear != null ? indicativedurationYear : null,
      indicativedurationMonth: indicativedurationMonth != undefined && indicativedurationMonth != null ? indicativedurationMonth : null,
      indicativedurationDay: indicativedurationDay != undefined && indicativedurationDay != null ? indicativedurationDay : null,
      
      extentionindicativedurationYear: extentionindicativedurationYear != undefined && extentionindicativedurationYear != null ? extentionindicativedurationYear : null,
      extentionindicativedurationMonth: extentionindicativedurationMonth != undefined && extentionindicativedurationMonth != null ? extentionindicativedurationMonth : null,
      extentionindicativedurationDay: extentionindicativedurationDay != undefined && extentionindicativedurationDay != null ? extentionindicativedurationDay : null,
      
      startdate: startdate != undefined && startdate != null ? moment(startdate,'YYYY-MM-DD ',).format('DD MMMM YYYY') : null,
      buyingorg1: buyingorg1 != undefined && buyingorg1 != null ? buyingorg1 : null,
      buyingorg2: buyingorg2 != undefined && buyingorg2 != null ? buyingorg2 : null,
      premarket: premarket != undefined && premarket != null ? premarket : null,
      expanded: expanded != undefined && expanded != null ? expanded : null,
      newreplace: newreplace != undefined && newreplace != null ? newreplace : null,
      incumbentoption: incumbentoption != undefined && incumbentoption != null ? incumbentoption : null,
      suppliername: suppliername != undefined && suppliername != null ? suppliername : null,
      bc1: bc1 != undefined && bc1 != null ? bc1 : null,
      bc2: bc2 != undefined && bc2 != null ? bc2 : null,
      reqGroup: reqGroup != undefined && reqGroup != null ? reqGroup : null,
      serviceLevel: serviceLevel != undefined && serviceLevel != null ? serviceLevel : null,
       //ccs_eoi_type: EOI_DATA_WITHOUT_KEYDATES.length > 0 ? 'all_online' : '',
       eventStatus: ReviewData.OCDS.status == 'active' ? "published" : ReviewData.OCDS.status == 'complete' ? "published" : null, // this needs to be revisited to check the mapping of the planned 
      selectedeventtype,
      agreementId_session
    };
    req.session['checkboxerror'] = 0;
    //Fix for SCAT-3440 
    const agreementName = req.session.agreementName;
    const lotid = req.session?.lotId;
    // const agreementId_session = req.session.agreement_id;
    const agreementLotName = req.session.agreementLotName;
    res.locals.agreement_header = { agreementName, project_name, projectId, agreementId_session, agreementLotName, lotid };

    if (checkboxerror) {
      appendData = Object.assign({}, { ...appendData, checkboxerror: 1 });
    }
    res.render('rfp-gcloudreview', appendData);
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