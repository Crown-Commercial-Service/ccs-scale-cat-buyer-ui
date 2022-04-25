//@ts-nocheck
import * as express from 'express';
import * as chooseRouteData from '../../../resources/content/requirements/rfpTaskList.json';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { statusStepsDataFilter } from '../../../utils/statusStepsDataFilter';
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
  req.session['isJaggaerError'] = false;
  const itemList = [
    'Data',
    'Technical',
    'IT Ops',
    'Product Delivery',
    'QAT',
    'User Centred Design',
    'No DDaT Cluster Mapping',
  ];
  res.locals.agreement_header = { agreementName, project_name, agreementId_session, agreementLotName, lotid };
  const appendData = { data: chooseRouteData, releatedContent, error: isJaggaerError };
  try {
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/3`, 'In progress');
    const { data: journeySteps } = await TenderApi.Instance(SESSION_ID).get(`journeys/${projectId}/steps`);
    statusStepsDataFilter(chooseRouteData, journeySteps, 'rfp', agreementId_session, projectId, eventId);
    // await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/36`, 'In progress');

    const ASSESSTMENT_BASEURL = `/assessments/${assessmentId}`;
    const ALL_ASSESSTMENTS = await TenderApi.Instance(SESSION_ID).get(ASSESSTMENT_BASEURL);
    const ALL_ASSESSTMENTS_DATA = ALL_ASSESSTMENTS.data;
    const EXTERNAL_ID = ALL_ASSESSTMENTS_DATA['external-tool-id'];

    const CAPACITY_BASEURL = `assessments/tools/${EXTERNAL_ID}/dimensions`;
    const CAPACITY_DATA = await TenderApi.Instance(SESSION_ID).get(CAPACITY_BASEURL);
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

    res.render('rfp-taskList', appendData);
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
