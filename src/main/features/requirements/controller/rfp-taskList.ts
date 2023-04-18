//@ts-nocheck
import * as express from 'express';
import * as chooseRouteData from '../../../resources/content/requirements/rfpTaskList.json';
import * as chooseRouteDataMCF from '../../../resources/content/MCF3/requirements/rfpTaskList.json';
import * as chooseRouteDataGCLOUD from '../../../resources/content/requirements/rfpGCLOUDTaskList.json';
import * as chooseRouteDataDOSMCF from '../../../resources/content/MCF3/requirements/DOSrfpTaskList.json';
import * as stage2DataDOS from '../../../resources/content/MCF3/requirements/DOSsatge2TaskList.json';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { statusStepsDataFilter } from '../../../utils/statusStepsDataFilter';
import { ShouldEventStatusBeUpdated } from '../../shared/ShouldEventStatusBeUpdated';
import { HttpStatusCode } from 'main/errors/httpStatusCodes';
import { logConstant } from '../../../common/logtracer/logConstant';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
/**
 *
 * @Rediect
 * @endpoint '/oauth/login
 * @param req
 * @param res
 */
export const RFP_REQUIREMENT_TASK_LIST = async (req: express.Request, res: express.Response) => {
  
  const { SESSION_ID } = req.cookies; //jwt
  const { eventId, currentEvent } = req.session;
  const releatedContent = req.session.releatedContent;
  const agreementName = req.session.agreementName;
  const lotid = req.session?.lotId;
  const project_name = req.session.project_name;
  const projectId = req.session.projectId;
  const agreementId_session = req.session.agreement_id;
  const agreementLotName = req.session.agreementLotName;
  const { isJaggaerError } = req.session;
  const { assessmentId } = currentEvent;
  const proc_id = req.session.projectId;
  const stage2BaseUrl = `/tenders/projects/${proc_id}/events`
  const stage2_dynamic_api = await TenderApi.Instance(SESSION_ID).get(stage2BaseUrl);

  //CAS-INFO-LOG
  LoggTracer.infoLogger(stage2_dynamic_api, logConstant.fetchEventDetails, req);

  const stage2_dynamic_api_data = stage2_dynamic_api.data;
  const stage2_data = stage2_dynamic_api_data?.filter((anItem: any) => anItem.id == eventId && (anItem.templateGroupId == '13' || anItem.templateGroupId == '14'));
  let stage2_value = 'Stage 1';
  if(stage2_data.length > 0){
    stage2_value = 'Stage 2';
  }
  req.session.stage2_value = stage2_value;
  
  req.session['isJaggaerError'] = false;
  req.session["selectedRoute"]=req.url?.split('/')[1];
  const itemList = [
    'Data',
    'Technical',
    'IT Ops',
    'Product Delivery',
    'QAT',
    'User Centred Design',
    'No DDaT Cluster Mapping',
  ];
  
  let cmsData;
  if(agreementId_session == 'RM6187') {
    //MCF3
    cmsData = chooseRouteDataMCF;
  } else if(agreementId_session == 'RM6263') {
    //DSP
    cmsData = chooseRouteData;
  }else if(agreementId_session == 'RM1043.8'){
    //DOS
    cmsData = chooseRouteDataDOSMCF;
    if(stage2_value !== undefined && stage2_value === "Stage 2"){
   
    cmsData = stage2DataDOS
    }
  }else if(agreementId_session == 'RM1557.13' && lotid=='4') {
    //MCF3
    cmsData = chooseRouteDataGCLOUD;
  }

  res.locals.agreement_header = { agreementName, project_name, projectId, agreementId_session, agreementLotName, lotid };
  //req.session.dummyEventType='FC';
  let selectedeventtype;
  if(agreementId_session == 'RM1043.8' || (agreementId_session == 'RM1557.13' && lotid=='4')){
    selectedeventtype = 'FC'; 
    
  }else{
    selectedeventtype= req.session.selectedeventtype;
  }
  const appendData = { data: cmsData, releatedContent, error: isJaggaerError,selectedeventtype,agreementId_session,lotid,projectId,eventId,stage2_value };

  try {

    if(agreementId_session == 'RM6187' || agreementId_session == 'RM1043.8' || (agreementId_session == 'RM1557.13' && lotid == '4')) {
      // name your project for dos
      let flag = await ShouldEventStatusBeUpdated(eventId, 27, req);
      if(flag) { await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/27`, 'Not started'); }
      let { data: journeySteps } = await TenderApi.Instance(SESSION_ID).get(`journeys/${eventId}/steps`);

      let nameJourneysts = journeySteps.filter((el: any) => {
        if(el.step == 27 && el.state == 'Completed') return true;
        return false;
      });
     
      if(agreementId_session == "RM1043.8" && stage2_value !== undefined && stage2_value === "Stage 2"){

      //  await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/86`, 'Optional');
       
        let timelineStatus = journeySteps.filter((el: any) => {
          if(el.step == 33 && el.state == 'Completed') return true;
          return false;
        });

        if(req.session?.endDate==undefined || req.session?.endDate==null){
          
            if(timelineStatus[0]?.state == 'Completed'){
              
                    await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/33`, 'Not started'); 
            await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/34`, 'Cannot start yet'); 
      
            }
      
          }
      }

      if(agreementId_session == 'RM1043.8' && stage2_value !== undefined && stage2_value === "Stage 1"){
      
        let timelineStatus = journeySteps.filter((el: any) => {
          if(el.step == 34 && el.state == 'Completed') return true;
          return false;
        });

        if(req.session?.endDate==undefined || req.session?.endDate==null){
          
            if(timelineStatus[0]?.state == 'Completed'){
              
                    await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/34`, 'Not started'); 
            await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/35`, 'Cannot start yet'); 
      
            }
      
          }

      }


      if(agreementId_session == 'RM6187') {
      let timelineStatus = journeySteps.filter((el: any) => {
        if(el.step == 36 && el.state == 'Completed') return true;
        return false;
      });

      if(req.session?.endDate==undefined || req.session?.endDate==null){
       if(timelineStatus[0]?.state == 'Completed'){
          
                await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/36`, 'Not started'); 
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/37`, 'Cannot start yet'); 
  
        }
  
      } }
       if(nameJourneysts.length > 0){
        
        let addcontsts = journeySteps.filter((el: any) => { 
          if(el.step == 30) return true;
          return false;
        });
        
        if(agreementId_session == 'RM1043.8' && stage2_value !== undefined && stage2_value === "Stage 2"){
          if(addcontsts[0].state == 'Not started'){
          //  await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/30`, 'Not started'); 
           
          }
      
        }
        else{
          if(addcontsts[0].state == 'Cannot start yet'){
            await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/30`, 'Not started'); 
           
          }
        }

        

      }else{
        
        let flagaddCont = await ShouldEventStatusBeUpdated(eventId, 30, req);
        if(flagaddCont) await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/30`, 'Cannot start yet'); 
      }
    }

    if(agreementId_session != 'RM1043.8' && agreementId_session != 'RM1557.13') {
      if(agreementId_session != 'RM6187') {
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/32`, 'Not started');
      }
    }
    //if(agreementId_session != 'RM1043.8') await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/32`, 'Not started');
    // await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/26`, 'Cannot start yet');
    // await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/27`, 'Optional');
    // await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/28`, 'Optional');
    // await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/29`, 'Optional');
    // await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/33`, 'Cannot start yet');
    // await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/34`, 'Cannot start yet');
    // await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/35`, 'Cannot start yet');
    // await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/36`, 'Cannot start yet');
    //await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/37`, 'Cannot start yet');
    // await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/38`, 'Cannot start yet');
    
    // await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/36`, 'Cannot start yet');
    // await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/37`, 'Not started');
    const { data: journeySteps } = await TenderApi.Instance(SESSION_ID).get(`journeys/${eventId}/steps`);
    journeySteps.forEach(function (element, i) {
        if(element.step == 29 && element.state == 'Not started') { element.state = 'Optional'; }
    });

       //cas-1116
      
    const FILE_PUBLISHER_BASEURL = `/tenders/projects/${projectId}/events/${eventId}/documents`;
    const FetchDocuments = await DynamicFrameworkInstance.Instance(SESSION_ID).get(FILE_PUBLISHER_BASEURL);
    const FETCH_FILEDATA = FetchDocuments?.data;
    
    let firstupload = false;
    let secondupload = false;
    let thirdupload = false;

    FETCH_FILEDATA?.map(file => {
    
      if (file.description === "mandatoryfirst") {
        firstupload =true
      
      }
      if (file.description === "mandatorysecond") {
        secondupload =true
      }

      if (file.description === "mandatorythird") {
        thirdupload =true
      }

      if (file.description === "optional") {
       // additionalfile.push(file.fileName);
      }
    });
   
    if(agreementId_session == 'RM1043.8' && stage2_value !== undefined && stage2_value == "Stage 2"){     
    if(firstupload == true && secondupload == true && thirdupload == true){

      journeySteps.forEach(function (element, i) {
        if(element.step == 86 ) { element.state = 'Completed'; }
    });
   //   await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/86`, 'Completed');
      let timelineStatus = journeySteps.filter((el: any) => {
                if(el.step == 86 && el.state == 'Completed') return true;
                return false;
              });
      
        
      // let flagaddCont = await ShouldEventStatusBeUpdated(eventId, 30, req);
      
      if(timelineStatus[0]?.state == 'Completed'){
        journeySteps.forEach(function (element, i) {
          if(element.step == 30 ) { element.state = 'Not started'; }
      });
     // await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/30`, 'Not started');
      }
      
    }
   
    if(firstupload != true || secondupload != true || thirdupload != true){
       let timelineStatus = journeySteps.filter((el: any) => {
                if(el.step == 30 && el.state == 'Completed') return true;
                return false;
              });
        
        if(timelineStatus[0]?.state != 'Completed'){
          journeySteps.forEach(function (element, i) {
            if(element.step == 30 ) { element.state = 'Cannot start yet'; }
        });
    //  await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/30`, 'Cannot start yet');
        }
        let overviewStatus = journeySteps.filter((el: any) => {
        if(el.step == 86 && el.state == 'Not started') return true;
        return false;
      });
          
          if(overviewStatus[0]?.state != 'Not started'){
        journeySteps.forEach(function (element, i) {
          if(element.step == 86 ) { element.state = 'In progress'; }
      });
    }
      //await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/86`, 'In progress');
    }
  }


    if(selectedeventtype=='DA'){
      statusStepsDataFilter(cmsData, journeySteps, 'DA', agreementId_session, projectId, eventId);
    }
    else{ 
     
    //  if(agreementId_session == 'RM1043.8' && stage2_value !== undefined && stage2_value !== "Stage 2"){     
        
        statusStepsDataFilter(cmsData, journeySteps, 'rfp', agreementId_session, projectId, eventId,stage2_value);
     // }
    }
   
     // await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/36`, 'In progress');
    if(agreementId_session != 'RM1043.8'){ // For DOS
    const ASSESSTMENT_BASEURL = `/assessments/${assessmentId}`;
    const ALL_ASSESSTMENTS = await TenderApi.Instance(SESSION_ID).get(ASSESSTMENT_BASEURL);
    
    //CAS-INFO-LOG
    LoggTracer.infoLogger(ALL_ASSESSTMENTS, logConstant.fetchAssesmentDetails, req);

    const ALL_ASSESSTMENTS_DATA = ALL_ASSESSTMENTS.data;
    const EXTERNAL_ID = ALL_ASSESSTMENTS_DATA['external-tool-id'];
    const CAPACITY_BASEURL = `assessments/tools/${EXTERNAL_ID}/dimensions`;
    const CAPACITY_DATA = await TenderApi.Instance(SESSION_ID).get(CAPACITY_BASEURL);

    //CAS-INFO-LOG
    LoggTracer.infoLogger(CAPACITY_DATA, logConstant.fetchAssesmentDimentionDetails, req);

    const CAPACITY_DATASET = CAPACITY_DATA.data;

    const AddedWeigtagedtoCapacity = CAPACITY_DATASET.map(acapacity => {
      const { name, weightingRange, options } = acapacity;
      const AddedPropsToOptions = options.map(anOpt => {
        return {
          ...anOpt,
          Weightagename: name,
          Weightage: weightingRange,
        };
      });
      return AddedPropsToOptions;
    }).flat();

    const UNIQUEFIELDNAME = AddedWeigtagedtoCapacity.map(capacity => {
      return {
        designation: capacity.name,
        ...capacity?.groups?.[0],
        Weightagename: capacity.Weightagename,
        Weightage: capacity.Weightage,
      };
    });

    const UNIQUEELEMENTS_FIELDNAME = [...new Set(UNIQUEFIELDNAME.map(designation => designation.name))].map(cursor => {
      const ELEMENT_IN_UNIQUEFIELDNAME = UNIQUEFIELDNAME.filter(item => item.name === cursor);
      return {
        'job-category': cursor,
        data: ELEMENT_IN_UNIQUEFIELDNAME,
      };
    });
    const filteredMenuItem = UNIQUEELEMENTS_FIELDNAME.filter(item => itemList.includes(item['job-category']));

    const ITEMLIST = filteredMenuItem.map((designation, index) => {
      const weightage = designation.data?.[0]?.Weightage;
      return {
        url: `#section${index + 1}`,
        text: designation['job-category'],
        subtext: `${weightage.min}% / ${weightage.max}%`,
      };
    });

    const UNIQUEJOBDESIGNATIONS = UNIQUEELEMENTS_FIELDNAME.map(designation => {
      const jobCategory = designation['job-category'];
      const { data } = designation;
      const uniqueElements = [...new Set(data.map(designation => designation.designation))];
      return uniqueElements;
    }).flat();

    const UNIQUE_JOB_IDENTIFIER = UNIQUEELEMENTS_FIELDNAME.map(element => {
      const { data } = element;
      const JobCategory = element['job-category'];
      let JOBSTORAGE = [];
      for (const JOB of UNIQUEJOBDESIGNATIONS) {
        const ElementFinder = data.filter(data => data.designation === JOB)[0];
        JOBSTORAGE.push(ElementFinder);
      }
      JOBSTORAGE = JOBSTORAGE.filter(items => items != null);
      return {
        'job-category': JobCategory,
        data: JOBSTORAGE,
      };
    });

    req.session.designations = [...UNIQUE_JOB_IDENTIFIER];
    req.session.tableItems = [...ITEMLIST];
    req.session.dimensions = [...CAPACITY_DATASET];
  }

//CAS-INFO-LOG
LoggTracer.infoLogger(null, logConstant.writePublishPage, req);

// res.write('Welcome');
// res.end();
    if(stage2_value !== undefined && stage2_value === "Stage 2"){
      res.render('dos6-stage2taskList', appendData);
    }else{
      res.render('rfp-taskList', appendData);
    }
    
  } catch (error) {
     LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Service - status failed - RFP TaskList Page',
      true,
    );
  }
};
