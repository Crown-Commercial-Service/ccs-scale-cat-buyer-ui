//@ts-nocheck
import * as express from 'express';
import * as dataWWD from '../../../resources/content/requirements/caWhereWorkDone.json';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';

export const CA_GET_WHERE_WORK_DONE = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId, releatedContent, isError, errorText, dimensions,currentEvent } = req.session;
  req.session.isError = false;
  req.session.errorText = '';
  var choosenViewPath = req.session.choosenViewPath;
  var locationArray=dimensions.filter(data => data.name === 'Location')[0]['options'];
  const assessmentId = req.session.currentEvent.assessmentId;
  try {
    const ASSESSTMENT_BASEURL = `/assessments/${assessmentId}`;
    const { data: assessments } = await TenderApi.Instance(SESSION_ID).get(ASSESSTMENT_BASEURL);
    const { dimensionRequirements } = assessments;
    if(dimensionRequirements.length>0)
    {   
        if(dimensionRequirements?.filter(dimension => dimension["dimension-id"] === 5)[0].requirements.length>0){       
          dimensionRequirements?.filter(dimension => dimension["dimension-id"] === 5)[0].requirements.forEach(y => {
            let indexVal = locationArray.findIndex(x => x["requirement-id"] == y["requirement-id"]);
            locationArray[indexVal].value = dimensionRequirements?.filter(dimension => dimension["dimension-id"] === 5)[0].requirements.
            find(s => s["requirement-id"] == locationArray[indexVal]["requirement-id"]).weighting;      
          });
        }
    }
    else
    {
      locationArray = dimensions.filter(data => data.name === 'Location')[0]['options'];
    }
    const appendData = {
      ...dataWWD,
      releatedContent,
      isError,
      errorText,
      locationArray,
      choosenViewPath,   
    };
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
  const { requirement_id: requirementIdList } = req['body'];
  const total = weights.reduce((accum, elem) => (accum += parseInt(elem)), 0);
  const { isError, errorText } = checkErrors(total);
  const assessmentId = req.session.currentEvent.assessmentId;
  const choosenViewPath = req.session.choosenViewPath;
  var capAssessement = req.session['CapAss'];

  if (isError) {
    req.session.errorText = errorText;
    req.session.isError = isError;
    res.redirect('/ca/where-work-done');
  } else {
    try {
      let dimension5weighitng;
    const ASSESSTMENT_BASEURL = `/assessments/${assessmentId}`;
    const { data: assessments } = await TenderApi.Instance(SESSION_ID).get(ASSESSTMENT_BASEURL);
    const { dimensionRequirements } = assessments;
    if(dimensionRequirements.length>0)
    {   
        dimension5weighitng=dimensionRequirements?.filter(dimension => dimension["dimension-id"] === 5)[0].weighting;
    }
    else
    {
      dimension5weighitng=10;
    } 
      const locationData = dimensions.filter(data => data.name === 'Location')[0];
      var weightsFiltered = weights.filter(weight => weight.value != '');
      var indexList = [];
      var initialDataRequirements = [];
      let requirementsloc = {};
      for (let i = 0; i < weights.length; i++) {
        if (weights[i] != '') {
          indexList.push({ i });
        }
      }
      for (let i = 0; i < indexList.length; i++) {
        requirementsloc = {
          'requirement-id': requirementIdList[indexList[i].i],
          weighting: weights[indexList[i].i],
          values: [{ 'criterion-id': '0', value: '1: Yes' }],
        };
        initialDataRequirements.push(requirementsloc);
      }
      let subcontractorscheck;
      if(dimensionRequirements?.filter(dimension => dimension["dimension-id"] === 5).length>0)
      {
        subcontractorscheck=dimensionRequirements?.filter(dimension => dimension["dimension-id"] === 5)[0].includedCriteria.
        find(x=>x["criterion-id"]==1)
      }
      let includedSubContractor=[];
      if(subcontractorscheck!=undefined)
      {
        includedSubContractor=[{ 'criterion-id': '1' }]
      } 
      const body = {
        'dimension-id': locationData['dimension-id'],
        name: "Location",
        weighting: dimension5weighitng,     
        includedCriteria: includedSubContractor,
        requirements: initialDataRequirements,
      };

      await TenderApi.Instance(SESSION_ID).put(
        `/assessments/${assessmentId}/dimensions/${locationData['dimension-id']}`,
        body,
      );

      await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/54`, 'Completed');
      await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/55`, 'Not started');
      res.redirect('/ca/suppliers-to-forward');
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
