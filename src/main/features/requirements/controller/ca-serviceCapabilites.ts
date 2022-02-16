//@ts-nocheck
import * as express from 'express';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import * as caService from '../../../resources/content/requirements/caService.json';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';

/**
 *
 * @param req
 * @param res
 * @GETController
 */
export const CA_GET_SERVICE_CAPABILITIES = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const {
    lotId,
    agreementLotName,
    agreementName,
    projectId,
    agreement_id,
    releatedContent,
    project_name,
    isError,
    errorText,
    currentEvent
  } = req.session;
  const agreementId_session = agreement_id;
  const { isJaggaerError } = req.session;
  req.session['isJaggaerError'] = false;
  res.locals.agreement_header = {
    agreementName,
    project_name,
    agreementId_session,
    agreementLotName,
    lotId,
    error: isJaggaerError,
  };

  const { assessmentId } = currentEvent;
  try {


    const ASSESSTMENT_BASEURL = `/assessments/${assessmentId}`;
    const ALL_ASSESSTMENTS = await TenderApi.Instance(SESSION_ID).get(ASSESSTMENT_BASEURL);
    const ALL_ASSESSTMENTS_DATA = ALL_ASSESSTMENTS.data;
    const EXTERNAL_ID = ALL_ASSESSTMENTS_DATA['external-tool-id'];

    const CAPACITY_BASEURL = `assessments/tools/${EXTERNAL_ID}/dimensions`;
    const CAPACITY_DATA = await TenderApi.Instance(SESSION_ID).get(CAPACITY_BASEURL);
    const CAPACITY_DATASET = CAPACITY_DATA.data;


    const CAPACITY_CONCAT_OPTIONS = CAPACITY_DATASET.map(item => {
      const {weightingRange, options} = item;
      return options.map(subItem => {
        return {
          ...subItem, weightingRange
        }
      })
    }).flat();

    const UNIQUE_GROUPPED_ITEMS = CAPACITY_CONCAT_OPTIONS.map(item => {
      const optionID = item['option-id'];
      const {name, groups, weightingRange} = item;
      const groupname = name;
      return groups.map(group => {
        return {
          ...group,
          groupname,
          weightingRange,
          optionID
        }
      })
    }).flat()
   
    const UNIQUE_DESIGNATION_CATEGORY = [...new Set(UNIQUE_GROUPPED_ITEMS.map(item => item.name))]; 

    const CATEGORIZED_ACCORDING_DESIGNATION = [];


    for(const category of UNIQUE_DESIGNATION_CATEGORY){

      const FINDRELEVANTCATEGORY = UNIQUE_GROUPPED_ITEMS.filter(item => {
        return item.name == category
      });
      const Weightage = FINDRELEVANTCATEGORY?.[0]?.weightingRange;
      const MAPPEDACCORDINGTOCATEGORY = {
        category,
        data: FINDRELEVANTCATEGORY,
        Weightage: Weightage
      }
      CATEGORIZED_ACCORDING_DESIGNATION.push(MAPPEDACCORDINGTOCATEGORY)
    }

    const TableHeadings = CATEGORIZED_ACCORDING_DESIGNATION.map((item, index) => {
      return {
          "url": `#section${index}`,
          "text": item.category,
          "subtext": `${item.Weightage.min}% / ${item.Weightage.max}%`
      }
    })
  

  
    const REMOVED_DUPLICATED_JOB = CATEGORIZED_ACCORDING_DESIGNATION.map(item => {
      const {Weightage, data, category} = item;
      const UNIQUESET = [...new Set(data.map(item => item.groupname))]; 
      const JOBSTORAGE = [];
      for(const uniqueItem of UNIQUESET){
        const filteredContents = data.filter(designation => designation.groupname === uniqueItem)[0];
        JOBSTORAGE.push(filteredContents);
      }
      return {Weightage, data: JOBSTORAGE.flat(), category};
    })



    const windowAppendData = { ...caService, lotId, agreementLotName, releatedContent, isError, errorText, TABLE_HEADING:TableHeadings, TABLE_BODY: REMOVED_DUPLICATED_JOB };
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/51`, 'In progress');

   res.render('ca-serviceCapabilities', windowAppendData);
  } catch (error) {
    req.session['isJaggaerError'] = true;
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - Get failed - CA learn page',
      true,
    );
  }
};

export const CA_POST_SERVICE_CAPABILITIES = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId } = req.session;
  try {
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/51`, 'Completed');
    res.redirect('/ca/service-capabilities');
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - Post failed - CA learn page',
      true,
    );
  }
};
