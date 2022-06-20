//@ts-nocheck
// import { OrganizationInstance } from '../util/fetch/organizationuserInstance';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import * as A1_Template from '../../../resources/content/requirements/caTaskList-A1.json';
import * as A1_Template_FCA from '../../../resources/content/requirements/caTaskList-A1-FCA.json';
import * as A2_Template from '../../../resources/content/requirements/caTaskList-A2.json';
import * as A3_Template from '../../../resources/content/requirements/caTaskList-A3.json';
import * as A4_Template from '../../../resources/content/requirements/caTaskList-A4.json';
import * as express from 'express';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { statusStepsDataFilter } from '../../../utils/statusStepsDataFilter';

export const CA_REQUIREMENT_TASK_LIST = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { path } = req.query;

  const {
    lotId,
    agreementLotName,
    agreementName,
    eventId,
    projectId,
    agreement_id,
    releatedContent,
    project_name,
    currentEvent,
    haveFCA,
  } = req.session;
  const { assessmentId, eventType } = currentEvent;
  const lotid = req.session?.lotId;
  const agreementId_session = agreement_id;
  const { isJaggaerError } = req.session;
  req.session['isJaggaerError'] = false;
  res.locals.agreement_header = {
    agreementName,
    project_name,
    agreementId_session,
    agreementLotName,
    lotid,
    error: isJaggaerError,
  };
  const itemList = [
    'Data',
    'Technical',
    'IT Ops',
    'Product Delivery',
    'QAT',
    'User Centred Design',
    'No DDaT Cluster Mapping',
  ];
  let ViewLoadedTemplateData;

  try {
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/42`, 'Optional');
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/43`, 'Optional');
    const { data: journeySteps } = await TenderApi.Instance(SESSION_ID).get(`journeys/${projectId}/steps`);
    //await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/54`, 'In progress');
    const isSummaryDone = journeySteps.find(stp => stp.step === 54 && stp.state === 'Completed');
    switch (path) {
      case 'A1':
        req.session['choosenViewPath'] = 'A1';
        ViewLoadedTemplateData = haveFCA && isSummaryDone !=undefined && isSummaryDone ? A1_Template_FCA : A1_Template;
        break;
      case 'A2':
        ViewLoadedTemplateData = A2_Template;
        break;

      case 'A3':
        ViewLoadedTemplateData = A3_Template;
        break;

      case 'A4':
        ViewLoadedTemplateData = A4_Template;
        break;

      default:
        res.redirect('error/404');
    }
    console.log(journeySteps)
    statusStepsDataFilter(ViewLoadedTemplateData, journeySteps, 'FCA', agreement_id, projectId, eventId);
    const windowAppendData = { data: ViewLoadedTemplateData, lotId, agreementLotName, releatedContent };

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
        subtext: "0 resources added,0% / 0%",
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

    //  res.json(CAPACITY_DATASET)
    res.render('ca-taskList', windowAppendData);
  } catch (error) {
    req.session['isJaggaerError'] = true;
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - Put failed - AC task list page',
      true,
    );
  }
};
