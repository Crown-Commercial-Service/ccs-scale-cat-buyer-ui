//@ts-nocheck
// import { OrganizationInstance } from '../util/fetch/organizationuserInstance';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import * as A1_Template from '../../../resources/content/requirements/caTaskList-A1.json';
import * as A2_Template from '../../../resources/content/requirements/caTaskList-A2.json';
import * as A3_Template from '../../../resources/content/requirements/caTaskList-A3.json';
import * as A4_Template from '../../../resources/content/requirements/caTaskList-A4.json';
import * as express from 'express';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { statusStepsDataFilter } from '../../../utils/statusStepsDataFilter';
import { categoryFilter } from '../util/data/categoryFilter';
import { isUndefined } from 'util';

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

  let ViewLoadedTemplateData;

  switch (path) {
    case 'A1':
      ViewLoadedTemplateData = A1_Template;
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
  try {
    const { data: journeySteps } = await TenderApi.Instance(SESSION_ID).get(`journeys/${projectId}/steps`);
    statusStepsDataFilter(ViewLoadedTemplateData, journeySteps, eventType, agreement_id, projectId, eventId);

    const windowAppendData = { data: ViewLoadedTemplateData, lotId, agreementLotName, releatedContent };
    const ASSESSTMENT_BASEURL = `/assessments/${assessmentId}`;
    const ALL_ASSESSTMENTS = await TenderApi.Instance(SESSION_ID).get(ASSESSTMENT_BASEURL);
    const ALL_ASSESSTMENTS_DATA = ALL_ASSESSTMENTS.data;
    const EXTERNAL_ID = ALL_ASSESSTMENTS_DATA['external-tool-id'];

    const CAPACITY_BASEURL = `assessments/tools/${EXTERNAL_ID}/dimensions`;
    const CAPACITY_DATA = await TenderApi.Instance(SESSION_ID).get(CAPACITY_BASEURL);
    const CAPACITY_DATASET = CAPACITY_DATA.data;
    

    const UNIQUE_CAPACITY_DATASET = CAPACITY_DATASET.reduce((acc, current) => {
      if (current['dimension-id'] === 7) {
        return acc.concat([current]);
      }
      return acc;
    }, []);

    const UNIQUE_CAPACITY_DATASET_IN_OPTIONS = UNIQUE_CAPACITY_DATASET.reduce((acc, current) => {
      if (current['options']) {
        return acc.concat(current['options']);
      }
      return acc;
    }, []);

    const UNIQUE_CAPACITY_DATASET_IN_OPTIONS_NO_DUPLICATES = Array.from(
      new Set(UNIQUE_CAPACITY_DATASET_IN_OPTIONS.map(a => a['requirement-id'])),
    ).map(id => {
      return UNIQUE_CAPACITY_DATASET_IN_OPTIONS.find(a => a['requirement-id'] === id);
    });

    let subHeaderName = '';
    let groupNames = '';
    let headerName = '';
    let id = 0;
    // const CAPACITY_DATASET_BY_CATEGORIES_AND_GROUPS = UNIQUE_CAPACITY_DATASET_IN_OPTIONS_NO_DUPLICATES.reduce(
    //   (acc, current, index) => {
    //     headerName = current['groups'][0].name;
    //     console.log(acc);
    //     console.log(acc[index - 1]);
    //     console.log(acc[index - 1]?.header);
    //     if (acc[index - 1]?.header !== headerName) {
    //       subHeaderName = current['groups'][1].name;
    //       groupNames = current.name;
    //       id = current['requirement-id'];
    //       const idName = 'requirement-id';
    //       if (acc[index - 1]?.subHeader !== subHeaderName) {
    //         return acc.concat({ header: headerName, [`${subHeaderName}`]: { name: groupNames, [`${idName}`]: id } });
    //       }
    //       return acc;
    //     }
    //     return acc;
    //   },
    //   [],
    // );
    const CAPACITY_DATASET_BY_CATEGORIES_AND_GROUPS = UNIQUE_CAPACITY_DATASET_IN_OPTIONS_NO_DUPLICATES.reduce(
      (acc, current, index) => {
        headerName = current['groups'][0].name;

        if (acc[index - 1]?.header !== headerName) {
          subHeaderName = current['groups'][1].name;
          groupNames = current.name;
          id = current['requirement-id'];
          const idName = 'requirement-id';
          if (acc.length === 0) {
            return acc.concat({
              header: headerName,
              [`${subHeaderName}`]: [{ name: groupNames, [`${idName}`]: id }],
            });
          } else if (Object.values(Object.keys(Object.values(acc)[0]))[1] !== subHeaderName) {
            console.log('xxxxxxxxx 11 ', Object.values(Object.keys(Object.values(acc)[0]))[1]);
            console.log('acc ', acc);
            return acc.concat({
              header: headerName,
              [`${subHeaderName}`]: [{ name: groupNames, [`${idName}`]: id }],
            });
          }
          return acc;
        }
        return acc;
      },
      [],
    );
    obj = Object.assign(...obj, {
      header: headerName,
    });
    obj = Object.assign(...obj, {
      header: headerName,
      [`${subHeaderName}`]: [{ name: groupNames, [`${idName}`]: id }],
    });
    let groupOb = {};
    const CAPACITY_DATASET_BY_CATEGORIES_AND_GROUPS_FINAL = CAPACITY_DATASET_BY_CATEGORIES_AND_GROUPS.reduce(
      (acc, current) => {
        headerName = current.header;
        if (acc?.header !== headerName) {
          console.log(current);
          subHeaderName = Object.keys(current)[1];
          groupNames = Object.values(Object.values(current)[1])[0];
          id = Object.values(Object.values(current)[1])[1];
          const idName = Object.keys(Object.values(current)[1])[1];
          if (Object.keys(acc)[0] !== subHeaderName) {
            groupOb = Object.assign({}, { name: groupNames, [`${idName}`]: id });
            return acc.concat({ header: headerName, [`${subHeaderName}`]: groupOb });
          } else {
            console.log('subHeaderName ', subHeaderName);
            return acc;
          }
        } else {
          console.log('headerName ', headerName);
        }
        return acc;
      },
      [],
    );
    console.log('CAPACITY_DATASET_BY_CATEGORIES_AND_GROUPS_FINAL ', CAPACITY_DATASET_BY_CATEGORIES_AND_GROUPS_FINAL);
    console.log('CAPACITY_DATASET_BY_CATEGORIES_AND_GROUPS ', CAPACITY_DATASET_BY_CATEGORIES_AND_GROUPS);
    console.log('UNIQUE_CAPACITY_DATASET_IN_OPTIONS_NO_DUPLICATES ', UNIQUE_CAPACITY_DATASET_IN_OPTIONS_NO_DUPLICATES);
    // console.log('UNIQUE_CAPACITY_DATASET_IN_GROUPS ', UNIQUE_CAPACITY_DATASET_IN_GROUPS);
    console.log('UNIQUE_CAPACITY_DATASET_IN_OPTIONS ', UNIQUE_CAPACITY_DATASET_IN_OPTIONS);
    console.log('UNIQUE_CAPACITY_DATASET ', UNIQUE_CAPACITY_DATASET);
    //const category1 = categoryFilter(CAPACITY_DATASET, 'Resource Quantity', 1);
    const category2 = categoryFilter(UNIQUE_CAPACITY_DATASET, 'Resource Quantities', 2);

    //const tableItems = category1[0];
    //const LevelDesignationStorage = category1[1];
    // const LevelDesignationStorage = category2[1];

    //req.session.designations = [...LevelDesignationStorage];
    //req.session.designationsLevel2 = [...CAPACITY_DATASET];
    //req.session.tableItems = [...tableItems];
    //req.session.dimensions = [...CAPACITY_DATASET];

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
