//@ts-nocheck
import * as express from 'express';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import * as daWeightingData from '../../../resources/content/requirements/daEnterYourWeightings.json';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';

/**
 *
 * @param req
 * @param res
 * @GETController
 */
export const DA_GET_WEIGHTINGS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const {
    lotId,
    agreementLotName,
    agreementName,
    eventId,
    projectId,
    agreement_id,
    releatedContent,
    project_name,
    choosenViewPath,
    isError,
    errorText,
    errorTextSumary,
  } = req.session;
  const lotid = req.session?.lotId;
  const agreementId_session = agreement_id;
  const assessmentId = req.session.currentEvent.assessmentId;
  const { isJaggaerError } = req.session;
  //req.session['isJaggaerError'] = false;
  res.locals.agreement_header = {
    agreementName,
    project_name,
    agreementId_session,
    agreementLotName,
    lotid,
    error: isJaggaerError,
  };
  try {
    const assessmentDetail = await GET_ASSESSMENT_DETAIL(SESSION_ID, assessmentId);
    const dimensions = await GET_DIMENSIONS_BY_ID(SESSION_ID, assessmentDetail['external-tool-id']);
    let weightingsArray = [];
    if (dimensions.length > 0) {
      weightingsArray = dimensions.map(anItem => {
        return {
          id: anItem['dimension-id'],
          title: anItem['name'],
          description: '[Description for this dimension]',
          weightingRange: anItem['weightingRange'],
          value: assessmentDetail.dimensionRequirements?.find(item => item['dimension-id'] == anItem['dimension-id'])
            ?.weighting,
        };
      });
    }
    req.session['CapAss'] = req.session['CapAss'] == undefined ? {} : req.session['CapAss'];
    req.session['CapAss'].toolId = assessmentDetail['external-tool-id'];
    req.session['weightingRange'] = weightingsArray[0].weightingRange;
    const windowAppendData = {
      data: daWeightingData,
      dimensions: weightingsArray,
      lotId,
      agreementLotName,
      releatedContent,
      choosenViewPath,
      error: isJaggaerError,
      isError,
      errorText,
      errorTextSumary: errorTextSumary,
    };
    res.render('da-enterYourWeightings', windowAppendData);
  } catch (error) {
    req.session['isJaggaerError'] = true;
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - Get failed - CA weighting page',
      true,
    );
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

export const DA_POST_WEIGHTINGS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId } = req.session;
  const assessmentId = req.session.currentEvent.assessmentId;
  req.session.errorText = [];
  try {
    const toolId = req.session['CapAss'].toolId;
    const dimensions = await GET_DIMENSIONS_BY_ID(SESSION_ID, toolId);

    const range = req.session['weightingRange'];
    const { 1: field1, 2: field2, 3: field3, 4: field4, 5: field5, 6: field6 } = req.body;
    const arr = [{ field1, field2, field3, field4, field5, field6 }];

    const { isError, errorText } = checkErrors(arr, range);
    const { errorTextSumary } = checkErrorsSmary(arr, range);

    if (isError) {
      req.session.errorTextSumary = errorTextSumary.reduce((acc, curr) => {
        if (!acc?.find(ob => ob.text === curr.text)) return acc?.concat(curr);
        return acc;
      }, []);
      if (errorText.length !== 6) {
        errorText.push({ id: 'field', text: '' });
      }

      req.session.errorText = errorText;
      req.session.isError = isError;
      req.session['isJaggaerError'] = true;
      res.redirect('/da/enter-your-weightings');
    } else {
      for (var dimension of dimensions) {
        const body = {
          name: dimension.name,
          weighting: req.body[dimension['dimension-id']],
          requirements: [],
          includedCriteria: dimension.evaluationCriteria
            .map(criteria => {
              if (!req.session['CapAss']?.isSubContractorAccepted && criteria['name'] == 'Sub Contractor') {
                return null;
              } else
                return {
                  'criterion-id': criteria['criterion-id'],
                };
            })
            .filter(criteria => criteria !== null),
        };

        await TenderApi.Instance(SESSION_ID).put(
          `/assessments/${assessmentId}/dimensions/${dimension['dimension-id']}`,
          body,
        );
        await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/49`, 'Completed');
        //await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/55`, 'To-do');
        res.redirect('/da/accept-subcontractors');
      }
    }
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'DA weightings page',
      true,
    );
  }
};

function checkErrors(arr, range) {
  let isError = false;
  const errorText = [];
  const keys = Object.keys(...arr).map(key => key);
  for (const obj of arr) {
    for (const k of keys) {
      if ((range.max < Number(obj[k]) || range.min > Number(obj[k])) && Number(obj[k]) !== 0) {
        isError = true;
        errorText.push({ id: k, text: 'Dimension value entered is outside the permitted range' });
      }
      if (Number(obj[k]) === 0) {
        isError = true;
        errorText.push({ id: k, text: 'All entry boxes must contain a value' });
      }
    }
  }

  return { isError, errorText };
}

function checkErrorsSmary(arr, range) {
  const errorTextSumary = [];
  const fieldsValues = Object.values(...arr).map(value => Number(value));
  const keys = Object.keys(...arr).map(key => key);
  const total = fieldsValues.reduce((acc, curr) => acc + curr, 0);
  for (const obj of arr) {
    for (const k of keys) {
      if ((range.max < Number(obj[k]) || range.min > Number(obj[k])) && Number(obj[k]) !== 0) {
        errorTextSumary.push({ id: k, text: 'Dimension value entered is outside the permitted range' });
      }
      if (Number(obj[k]) === 0) {
        errorTextSumary.push({ id: k, text: 'All entry boxes must contain a value' });
      }
      if (total !== 100) {
        errorTextSumary.push({ id: k, text: 'Dimension value entered does not total to 100%' });
      }
    }
  }

  return { errorTextSumary };
}
