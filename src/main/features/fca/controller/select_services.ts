//@ts-nocheck
import * as express from 'express';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { statusStepsDataFilter } from '../../../utils/statusStepsDataFilter';
import * as fcaCreateSupplierShortlistContent from '../../../resources/content/MCF3/fcaCreateSupplierShortlist.json';
import * as fcaServicesContent from '../../../resources/content/fca/service.json';

/**
 *
 * @Rediect
 * @param req
 * @param res
 *
 */
export const SELECT_SERVICES = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { isEmptySelectedServicesError } = req.session;
  req.session['isEmptySelectedServicesError'] = false;
  const { lotId, agreementLotName, eventId, projectId, agreement_id } = req.session;
  const selectedeventtype = req.session.selectedeventtype;

  const { selectedRoute } = req.session;
  const assessmentId = req.session.currentEvent.assessmentId;
  const ASSESSTMENT_BASEURL = `/assessments/${assessmentId}`;
  const ALL_ASSESSTMENTS = await TenderApi.Instance(SESSION_ID).get(ASSESSTMENT_BASEURL);
  const ALL_ASSESSTMENTS_DATA = ALL_ASSESSTMENTS.data;

  let selectedServiceCheck;
  let checkCheckbox = [];
  if (ALL_ASSESSTMENTS_DATA.dimensionRequirements.length > 0) {
    selectedServiceCheck = ALL_ASSESSTMENTS_DATA.dimensionRequirements[0].requirements;
    if (selectedServiceCheck != undefined) {
      checkCheckbox = selectedServiceCheck;
    }
  }

  try {
    const assessmentId = req.session.currentEvent.assessmentId;
    const assessmentURL = `assessments/${assessmentId}`;
    const assessmentData = await TenderApi.Instance(SESSION_ID).get(assessmentURL);
    const externalID = assessmentData.data['external-tool-id'];

    let Data;
    const ScaleURL = `/assessments/tools/${externalID}/dimensions`;
    const ScaleData = await TenderApi.Instance(SESSION_ID).get(ScaleURL);
    let CAPACITY_DATASET = ScaleData.data;
    CAPACITY_DATASET = CAPACITY_DATASET.filter((levels) => levels['name'] === 'Service Offering');

    const CAPACITY_CONCAT_OPTIONS = CAPACITY_DATASET.map((item) => {
      const { weightingRange, options } = item;
      return options.map((subItem) => {
        return {
          ...subItem,
          weightingRange,
        };
      });
    }).flat();

    const loop = CAPACITY_CONCAT_OPTIONS;
    loop.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    const eptObj = [];
    for (let j = 0; j < loop.length; j++) {
      eptObj.push({ 'requirement-id': loop[j]['requirement-id'], name: loop[j].name });
    }

    const agreementName = req.session.agreementName;
    const project_name = req.session.project_name;
    const agreementId_session = agreement_id;

    let cmsData;
    if (req.session.currentEvent.eventType == 'FC') {
      //RFP
      cmsData = fcaServicesContent;
    } else {
      //DSP
      cmsData = fcaCreateSupplierShortlistContent;
    }
    const lotid = lotId;
    res.locals.agreement_header = {
      agreementName,
      project_name,
      projectId,
      agreementId_session,
      agreementLotName,
      lotid,
    };
    const releatedContent = req.session.releatedContent;
    const windowAppendData = {
      eventType: req.session.currentEvent.eventType,
      data: cmsData,
      lotId,
      agreementLotName,
      error: isEmptySelectedServicesError,
      releatedContent,
      agreementId_session,
      services: eptObj,
      checkCheckbox,
    };
    res.render('select_services', windowAppendData);
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Select Service - FCA task list page',
      true
    );
  }
};

export const POST_SELECT_SERVICES = async (req: express.Request, res: express.Response) => {
  const { eventId, projectId } = req.session;
  const fca_selected_services = req.body;
  const { SESSION_ID } = req.cookies;
  //req.session.fca_selected_services = fca_selected_services;

  const assessmentId = req.session.currentEvent.assessmentId;
  const ASSESSTMENT_BASEURL = `/assessments/${assessmentId}`;
  const ALL_ASSESSTMENTS = await TenderApi.Instance(SESSION_ID).get(ASSESSTMENT_BASEURL);
  const ALL_ASSESSTMENTS_DATA = ALL_ASSESSTMENTS.data;
  let Service_capbility_weightage = 100;
  const Weightings = ALL_ASSESSTMENTS_DATA.dimensionRequirements;
  if (typeof Weightings !== 'undefined' && Weightings.length > 0) {
    Service_capbility_weightage = Weightings?.filter((item) => item.name == 'Service Offering')[0].weighting;
  }

  const assessmentURL = `assessments/${assessmentId}`;
  const assessmentData = await TenderApi.Instance(SESSION_ID).get(assessmentURL);
  const externalID = assessmentData.data['external-tool-id'];
  const dimension = await GET_DIMENSIONS_BY_ID(SESSION_ID, externalID);
  const scalabilityData = dimension.filter((data) => data.name === 'Service Offering')[0];
  const assessmentDetail = await GET_ASSESSMENT_DETAIL(SESSION_ID, assessmentId);
  const Dimensionrequirements = assessmentDetail.dimensionRequirements;
  //const weight = Dimensionrequirements.filter(x=>x["dimension-id"]===3)[0].weighting;
  //  const scalabilityData_weightings = scalabilityData.map(item => {
  //   const { weightingRange, options } = item;
  //   return options.map(subItem => {
  //     return {
  //       ...subItem,
  //       weightingRange,
  //     };
  //   });
  // }).flat();

  if (fca_selected_services?.selected_services != undefined && fca_selected_services.selected_services.length > 0) {
    const bodyData = fca_selected_services.selected_services;
    const weightingForeach = Math.round(Service_capbility_weightage) / bodyData.length;
    const objCount = Object.keys(bodyData).length;
    const requirementsArray = [];
    for (let i = 0; i <= objCount; i++) {
      var currentRequirement = bodyData[i];
      if (currentRequirement != undefined) {
        requirementsArray.push({
          name: scalabilityData.options.find((data) => data['requirement-id'] === Number(currentRequirement)).name,
          'requirement-id': Number(currentRequirement),
          weighting: weightingForeach,
          values: [{ 'criterion-id': '0', value: '0: No' }],
        });
      }
    }

    try {
      const body = {
        'dimension-id': scalabilityData['dimension-id'],
        name: scalabilityData['name'],
        weighting: Service_capbility_weightage, //weight,
        includedCriteria: [], // scalabilityData.evaluationCriteria,
        overwriteRequirements: true,
        requirements: requirementsArray,
      };

      try {
        await TenderApi.Instance(SESSION_ID).put(
          `/assessments/${assessmentId}/dimensions/${scalabilityData['dimension-id']}`,
          body
        );
      } catch (err) {
        LoggTracer.errorLogger(
          res,
          err,
          `${req.headers.host}${req.originalUrl}`,
          null,
          TokenDecoder.decoder(SESSION_ID),
          'FCA Select Service - Tenders Service Api cannot be connected',
          true
        );
      }

      //Journet Update
      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/78`, 'Completed');
      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/79`, 'Not started');
      res.redirect('/fca/shortlisted/suppliers');
    } catch (error) {
      LoggTracer.errorLogger(
        res,
        error,
        `${req.headers.host}${req.originalUrl}`,
        null,
        TokenDecoder.decoder(SESSION_ID),
        'FCA - Post failed - CA team scale page',
        true
      );
    }
  } else {
    req.session['isEmptySelectedServicesError'] = true;
    res.redirect('/fca/select-services');
  }
};

const GET_ASSESSMENT_DETAIL = async (sessionId: any, assessmentId: string) => {
  const assessmentBaseUrl = `/assessments/${assessmentId}`;
  const assessmentApi = await TenderApi.Instance(sessionId).get(assessmentBaseUrl);
  return assessmentApi.data;
};
const GET_DIMENSIONS_BY_ID = async (sessionId: any, toolId: any) => {
  const baseUrl = `assessments/tools/${toolId}/dimensions`;
  const dimensionsApi = await TenderApi.Instance(sessionId).get(baseUrl);
  return dimensionsApi.data;
};
