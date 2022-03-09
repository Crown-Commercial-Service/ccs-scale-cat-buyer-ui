//@ts-nocheck
import * as express from 'express';
import * as dataWWD from '../../../resources/content/requirements/daWhereWorkDone.json';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';

export const RFP_GET_WHERE_WORK_DONE = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId, releatedContent, isError, errorText, dimensions } = req.session;
  req.session.isError = false;
  req.session.errorText = '';
  var choosenViewPath = req.session.choosenViewPath;
  var locationArray;
  try {
    locationArray = dimensions.filter(data => data.name === 'Location')[0]['options'];
    var weightingRange = dimensions.filter(data => data.name === 'Location')[0]['weightingRange'];
    const appendData = {
      ...dataWWD,
      releatedContent,
      isError,
      errorText,
      locationArray,
      choosenViewPath,
      weightingRange,
    };
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/54`, 'In progress');
    res.render('rfp-whereWorkDone', appendData);
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'update the status failed - RFP TaskList Page',
      true,
    );
  }
};

function checkErrors(total) {
  let isError = false;
  let errorText = [];

  if (total > 100) {
    isError = true;
    errorText.push({ text: 'Location value should be less or equal to 100%' });
  } else if (total < 100) {
    isError = true;
    errorText.push({ text: 'The sum of the weighting values across all locations should be equal to 100%' });
  }

  return { isError, errorText };
}

export const RFP_POST_WHERE_WORK_DONE = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId, releatedContent, dimensions } = req.session;
  const { rfp_locationweight: weights } = req['body'];
  const { rfp_locationName: names } = req['body'];
  const { requirement_id: requirementIdList } = req['body'];
  const total = weights.reduce((accum, elem) => (accum += parseInt(elem)), 0);
  const { isError, errorText } = checkErrors(total);
  const assessmentId = req.session.currentEvent.assessmentId;
  const choosenViewPath = req.session.choosenViewPath;
  var capAssessement = req.session['CapAss'];
  if (isError) {
    req.session.errorText = errorText;
    req.session.isError = isError;
    res.redirect('/rfp/get-work-done');
  } else {
    try {
      const weightingDimensions = dimensions;
      const locationData = dimensions.filter(data => data.name === 'Location')[0];
      var weightsFiltered = weights.filter(weight => weight.value != '');
      var indexList = [];
      var initialDataRequirements = [];
      let req = {};
      for (let i = 0; i < weights.length; i++) {
        if (weights[i] != '') {
          indexList.push({ i });
        }
      }
      for (let i = 0; i < indexList.length; i++) {
        req = {
          //name: names[i] ,
          'requirement-id': requirementIdList[indexList[i].i],
          weighting: weights[indexList[i].i],
          values: [{ 'criterion-id': '0', value: '1: Yes' }],
        };
        initialDataRequirements.push(req);
      }

      const body = {
        'dimension-id': locationData['dimension-id'],
        //name: locationData['options']['name'][i],
        weighting: 20,
        includedCriteria: [{ 'criterion-id': '0' }],
        requirements: initialDataRequirements,
      };

      if (capAssessement?.isSubContractorAccepted) {
        body.includedCriteria.push({ 'criterion-id': '1' });
        body.requirements[0].values.push({ 'criterion-id': '1', value: '1: Yes' });
      }

      await TenderApi.Instance(SESSION_ID).put(
        `/assessments/${assessmentId}/dimensions/${locationData['dimension-id']}`,
        body,
      );

      await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/54`, 'Completed');
      res.redirect('/rfp/task-list?path=' + choosenViewPath);
    } catch (error) {
      LoggTracer.errorLogger(
        res,
        error,
        `${req.headers.host}${req.originalUrl}`,
        null,
        TokenDecoder.decoder(SESSION_ID),
        'Tender agreement failed to be added',
        true,
      );
    }
  }
};
