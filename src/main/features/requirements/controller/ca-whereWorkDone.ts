//@ts-nocheck
import * as express from 'express';
import * as dataWWD from '../../../resources/content/requirements/daWhereWorkDone.json';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';

export const CA_GET_WHERE_WORK_DONE = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId, releatedContent, isError, errorText, dimensions } = req.session;
  req.session.isError = false;
  req.session.errorText = '';
  var locationArray;
    try {
    let assessmentAPIData = dimensions;
    for(let apiData of assessmentAPIData)
    { 
      if(apiData["dimension-id"] == 5)
      {
          locationArray = apiData["options"];

      }
    }
    const appendData = { ...dataWWD, releatedContent, isError, errorText, locationArray };
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/54`, 'In progress');
    res.render('ca-whereWorkDone', appendData);
  } catch (error) {

    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'GET failed - CA where work done Page',
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

export const CA_POST_WHERE_WORK_DONE = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId, releatedContent, dimensions } = req.session;
  const { ca_locationweight: weights } = req['body'];
  const total = weights.reduce((accum, elem) => (accum += parseInt(elem)), 0);
  const { isError, errorText } = checkErrors(total);
  const assessmentId = req.session.currentEvent.assessmentId;

  if (isError) {
    req.session.errorText = errorText;
    req.session.isError = isError;
    res.redirect('/ca/get-work-done');
  } else {
    try {
      const weightingDimensions = dimensions;
     
      for(let apiData of assessmentAPIData)
    { 
      if(apiData["dimension-id"] == 5)
      {
          locationArray = apiData["options"];

      }
    }
      await TenderApi.Instance(SESSION_ID).put(`/assessments/${assessmentId}/dimensions/${dimension.id}`, body);
      
      await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/54`, 'Completed');
      res.redirect('/ca/task-list');
    } catch (error) {

      LoggTracer.errorLogger(
        res,
        error,
        `${req.headers.host}${req.originalUrl}`,
        null,
        TokenDecoder.decoder(SESSION_ID),
        'POST failed - CA where work done Page',
        true,
      );
    }
  }
};
