//@ts-nocheck
import * as express from 'express';
//import * as cmsData from '../../../resources/content/requirements/nameYourProject.json';
import * as cmsDataOLD from '../../../resources/content/MCF3/requirements/confirmation_review.json';
import * as DaData from '../../../resources/content/da/daSelectService.json';

import procurementDetail from '../model/procurementDetail';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { HttpStatusCode } from '../../../errors/httpStatusCodes';
import { GetLotSuppliers } from '../../shared/supplierService';
import { GetLotSuppliersScore } from '../../shared/supplierServiceScore';
import * as supplierIDSData from '../../../resources/content/fca/shortListed.json';

/**
 *
 * @param req
 * @param res
 * @GETController
 */
export const DA_GET_SELECTED_SERVICE = async (req: express.Request, res: express.Response) => {
  const { isEmptySelectedServicesError } = req.session;
  const { SESSION_ID } = req.cookies;
   
  req.session['isEmptySelectedServicesError'] = false;
  const procurements = req.session.procurements;
  const lotId = req.session.lotId;
  const procurement: procurementDetail = procurements.find((proc: any) => proc.defaultName.components.lotId === lotId);
  const project_name = req.session.project_name;
  const agreementLotName = req.session.agreementLotName;
  const releatedContent = req.session.releatedContent;

  let checkCheckbox = [];
  let other_text = '';
  let isDisable = false;
  try {
    const {data: getEventsData} = await TenderApi.Instance(SESSION_ID).get(`tenders/projects/${req.session.projectId}/events`);
    const overWritePaJoury = getEventsData.find(item => item.eventType == 'PA' && (item.dashboardStatus == 'CLOSED' || item.dashboardStatus == 'COMPLETE'));
    if(overWritePaJoury)  {
      let PAAssessmentID = overWritePaJoury.assessmentId;
      const { data: supplierScoreList } = await TenderApi.Instance(SESSION_ID).get(`/assessments/${PAAssessmentID}?scores=true`);
      let dataSet = supplierScoreList.dimensionRequirements;
      if(dataSet.length > 0) {
        let dataRequirements = dataSet[0].requirements;
        dataRequirements.filter((el: any) => {
          checkCheckbox.push(el['requirement-id']);
        });
      }
      isDisable = checkCheckbox.length > 0 ? true : false;
    }
  } catch(e) {
    LoggTracer.errorLogger(
      res,
      e,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'DA Selected Service - Tenders Service Api cannot be connected',
      true,
    );
  }
  

  // const { selectedRoute } = req.session;
  // let selectedServiceCheck = req.session.fca_selected_services;
  // let checkCheckbox;
  // let other_text;
  // if(selectedServiceCheck != undefined) {
  //   checkCheckbox = selectedServiceCheck.selected_services;
  //   other_text = selectedServiceCheck.other_text;
  // } else {
  //   checkCheckbox = [];
  //   other_text = '';
  // }

  const GET_ASSESSMENT_DETAIL = async (sessionId: any, assessmentId: string) => {
    const assessmentBaseUrl = `/assessments/${assessmentId}`;
    const assessmentApi = await TenderApi.Instance(sessionId).get(assessmentBaseUrl);
    return assessmentApi.data;
  };

  const assessmentId = req.session.currentEvent.assessmentId;
  const assessmentDetail = await GET_ASSESSMENT_DETAIL(SESSION_ID, assessmentId);
  const assessmentURL=`assessments/${assessmentId}`;
  const assessmentData = await TenderApi.Instance(SESSION_ID).get(assessmentURL);
  const externalID=assessmentData.data['external-tool-id'];

  //Checkbox Direct FC
  let selectedServiceCheck;
  if(assessmentData.data.dimensionRequirements.length > 0) {
    selectedServiceCheck = assessmentData.data.dimensionRequirements[0].requirements;
    if(selectedServiceCheck != undefined) {
      selectedServiceCheck.filter((el: any) => {
        checkCheckbox.push(el['requirement-id']);
      });
    }
  }
        
  const ScaleURL = `/assessments/tools/${externalID}/dimensions`;
  const ScaleData = await TenderApi.Instance(SESSION_ID).get(ScaleURL);
  let CAPACITY_DATASET = ScaleData.data;
  CAPACITY_DATASET = CAPACITY_DATASET.filter(levels => levels['name'] === 'Service Offering');

  let CAPACITY_CONCAT_OPTIONS = CAPACITY_DATASET.map(item => {
    const { weightingRange, options } = item;
    return options.map(subItem => {
      return {
        ...subItem,
        weightingRange,
      };
    });
  }).flat();
  
  let loop = CAPACITY_CONCAT_OPTIONS;
  loop.sort(function (a, b) {
    if(a.name < b.name) { return -1; }
      if(a.name > b.name) { return 1; }
      return 0;
  });
  let eptObj = [];
  for(let j = 0; j < loop.length; j++) { eptObj.push({'requirement-id': loop[j]['requirement-id'], name: loop[j].name}); }

  const viewData: any = {
    data: DaData,
    procId: procurement.procurementID,
    projectLongName: project_name,
    lotId,
    agreementLotName,
    error: isEmptySelectedServicesError,
    releatedContent: releatedContent,
    services:eptObj,
    // services:ScaleData.data,
    checkCheckbox,
    other_text,
    isDisable
  };
  res.render('daw-selectedService', viewData);
};

/**
 *
 * @param req
 * @param res
 * @POSTController
 */

 export const DA_POST_SELECTED_SERVICE = async (req: express.Request, res: express.Response) => {
    const  rfp_selected_services = req.body;
    

   const { eventId } = req.session;
   const { SESSION_ID } = req.cookies;
     // const { SESSION_ID } = req.cookies;
     // const { eventId } = req.session;
     //req.session.fca_selected_services = rfp_selected_services;
    
     // const assessmentId = 1;
     // let Weightings=[];
     // const toolId = req.session['CapAss'].toolId;
     //  const dimensions = await GET_DIMENSIONS_BY_ID(SESSION_ID, toolId);
          /*for(let i=1;i<=5;i++)
          {
              let dim=dimensions.filter(x=>x["dimension-id"] === i)
              Weightings.push(...dim)
          }
     for (var dimension of Weightings) {
        const body = {
          name: dimension.name,
          weighting: req.body[dimension['dimension-id']],
          includedCriteria: dimension.evaluationCriteria
        };
        
        await TenderApi.Instance(SESSION_ID).put(
          `/assessments/${assessmentId}/dimensions/${dimension['dimension-id']}`,
          body,
        );
    
        
      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/1`, 'Completed');
      let flag = await ShouldEventStatusBeUpdated(eventId, 47, req);
      if (flag) {
      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/47`, 'Not started');
      }
    }*/
    
    if(rfp_selected_services.selected_services == undefined) {
      if(req.body.isDisable) {
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/30`, 'Completed');
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/31`, 'Not started');
        res.redirect('/da/task-list');
      } else {
        req.session['isEmptySelectedServicesError'] = true;
        res.redirect('/da/selected_service');
      }
    } else {
      if(req.body.isDisable == '') {
        const assessmentId = req.session.currentEvent.assessmentId;
        const ASSESSTMENT_BASEURL = `/assessments/${assessmentId}`;
        const ALL_ASSESSTMENTS = await TenderApi.Instance(SESSION_ID).get(ASSESSTMENT_BASEURL);
        const ALL_ASSESSTMENTS_DATA = ALL_ASSESSTMENTS.data;

        var Service_capbility_weightage = 100;
        const Weightings = ALL_ASSESSTMENTS_DATA.dimensionRequirements;
        if (typeof Weightings !== 'undefined' && Weightings.length > 0) {
          Service_capbility_weightage = Weightings?.filter(item => item.name == 'Service Offering')[0].weighting;
        }

        const externalID = ALL_ASSESSTMENTS_DATA['external-tool-id']
        const dimension = await GET_DIMENSIONS_BY_ID(SESSION_ID, externalID);
        const scalabilityData = dimension.filter(data => data.name === 'Service Offering')[0];

        const bodyData = rfp_selected_services.selected_services;
        const weightingForeach = Math.round(Service_capbility_weightage) / bodyData.length;
        let countObj = Object.keys(bodyData).length;
        var  requirementsArray = [];
        for(let i=0;i<=countObj;i++){
          if (bodyData[i] != 'other') {
          var currentRequirement = bodyData[i];
          if(currentRequirement != undefined){
            requirementsArray.push({
              name: scalabilityData.options.find(data => data['requirement-id'] === Number(currentRequirement)).name,
              'requirement-id': Number(currentRequirement),
              weighting: weightingForeach,
              values: [{ 'criterion-id': '0', value: '0: No' }]
            });
          }
        }
        }

          try {
            const body = {
              'dimension-id': scalabilityData['dimension-id'],
              name:scalabilityData['name'] ,
              weighting: Service_capbility_weightage, //weight,
              includedCriteria: [],// scalabilityData.evaluationCriteria,
              overwriteRequirements: true,
              requirements: requirementsArray,
            };
                
            try {
              await TenderApi.Instance(SESSION_ID).put(
                `/assessments/${assessmentId}/dimensions/${scalabilityData['dimension-id']}`,
                body,
              );

              //Suppliers Save Post
              let supplierList: any[] = [];
              let supplierScoreList = await GetLotSuppliersScore(req, true);
              let lengthGet = supplierScoreList.dimensionRequirements[0].requirements.length;
              let weightGet = supplierScoreList.dimensionRequirements[0].requirements[0].weighting;
              const maxResult = weightGet * lengthGet;  
              let scoreArray = supplierScoreList.scores;
              const resultScoreSupplier = scoreArray.filter((el: any) => el.total == maxResult);
              let resultScoreSupplierIds = resultScoreSupplier.map((value: any) => value.supplier.id);
              const MatchedSupplierIDS : any = [];
              for(let i=0;i<resultScoreSupplierIds.length;i++){
                if(supplierIDSData['supplierIDS'].includes(resultScoreSupplierIds[i])) MatchedSupplierIDS.push(resultScoreSupplierIds[i]);
              }
              const UnqfinalArrayOutput = MatchedSupplierIDS.filter((value:any, index:any, self:any) => {
                return self.indexOf(value) === index;
              });
              supplierList = await GetLotSuppliers(req);
              let supplierDataToSave=[];
              if(UnqfinalArrayOutput.length > 0){
                for(var i=0; i < UnqfinalArrayOutput.length; i++) {
                    let supplierInfo = supplierList.filter((s:any) => s.organization.id == UnqfinalArrayOutput[i])?.[0];
                    if(supplierInfo != undefined) {
                      supplierDataToSave.push({'name':supplierInfo.organization.name,'id':UnqfinalArrayOutput[i]});
                    }
                }
              }
              if(supplierDataToSave.length > 0){
                const supplierBody = {
                  "suppliers": supplierDataToSave,
                  "justification": '',
                  "overwriteSuppliers":true
                };
                const Supplier_BASEURL = `/tenders/projects/${req.session.projectId}/events/${req.session.eventId}/suppliers`;
                await TenderApi.Instance(SESSION_ID).post(Supplier_BASEURL, supplierBody);
              }
            } catch(err) {
              LoggTracer.errorLogger(
                res,
                err,
                `${req.headers.host}${req.originalUrl}`,
                null,
                TokenDecoder.decoder(SESSION_ID),
                'DA Selected Service - Tenders Service Api cannot be connected',
                true,
              );
            }

        } catch (error) {
          LoggTracer.errorLogger( res, error, `${req.headers.host}${req.originalUrl}`, null, TokenDecoder.decoder(SESSION_ID), 'DA Select Service - Post failed - CA team scale page', true, );
        }
      }

      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/30`, 'Completed');
      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/31`, 'Not started');
      res.redirect('/da/task-list');
    }
     
   }

   const GET_DIMENSIONS_BY_ID = async (sessionId: any, toolId: any) => {
    const baseUrl = `assessments/tools/${toolId}/dimensions`;
    const dimensionsApi = await TenderApi.Instance(sessionId).get(baseUrl);
    return dimensionsApi.data;
  };