//@ts-nocheck
import * as express from 'express';
import * as data from '../../../resources/content/requirements/rfpWhereWorkDone.json';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import {ShouldEventStatusBeUpdated} from '../../shared/ShouldEventStatusBeUpdated';

export const RFP_GET_WHERE_WORK_DONE = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId, releatedContent, isError, errorText, dimensions,currentEvent ,eventId } = req.session;
  req.session.isError = false;
  req.session.errorText = '';
  const { assessmentId } = currentEvent;

  try {
    const locationArray = dimensions.filter(ele => ele.name === 'Location')[0]['options'];
    const ASSESSTMENT_BASEURL = `/assessments/${assessmentId}`;
    const { data: assessments } = await TenderApi.Instance(SESSION_ID).get(ASSESSTMENT_BASEURL);
    const { dimensionRequirements } = assessments;
    let selectedopt=[];
    if (dimensionRequirements.length > 0) {
      const dimensionReq=dimensionRequirements.filter(dimension => dimension.name === 'Location');
     if(dimensionReq.length>0)
      {
        for(let i=0;i<dimensionReq[0].requirements.length;i++)
       selectedopt.push(dimensionReq[0].requirements[i].name);
      }
    }
    if(selectedopt.length>0)
    {
      selectedopt.forEach((item)=>
      {
        let selectedLocIndex=locationArray.findIndex((loc: any) => loc.name === item);
        locationArray[selectedLocIndex].checked=true;
      });
    // locationArray.map(location => {
    //   selectedopt.map(item => {
    //     if(item === location.name) location.checked = true;
    //     else location.checked = false;
    //   });
    // });
  }
    const appendData = {
      ...data,
      releatedContent,
      isError,
      errorText,
      locationArray,
      
    };
    let flag=await ShouldEventStatusBeUpdated(eventId,36,req);
    if(flag)
    {
    await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/36`, 'In progress');
  }
    res.render('rfp-whereWorkDone', appendData);
  } catch (error) {
    console.log(error);
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

export const RFP_POST_WHERE_WORK_DONE = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId, dimensions,eventId } = req.session;
  const assessmentId = req.session.currentEvent.assessmentId;
  const capAssessement = req.session['CapAss'];
  let locationIds = req.body.rfp_location;
  if (!req.body.rfp_location) {
    req.session.errorText = [{ text: 'Select atleast one location.' }];
    req.session.isError = true;
    res.redirect('/rfp/where-work-done');
  } else {
    try {
      const locationData = dimensions.filter(data => data.name === 'Location')[0];
      const initialDataRequirements = [];
      if (!Array.isArray(locationIds)) locationIds = [locationIds];
      for (let i = 0; i < locationIds.length; i++) {
        const requirements = {
          'requirement-id': locationIds[i],
          weighting: 100 / Math.round(locationIds.length),
          values: [{ 'criterion-id': '0', value: '1: Yes' }],
        };
        initialDataRequirements.push(requirements);
      }
      const PUT_BODY = {
        'dimension-id': locationData['dimension-id'],
        weighting: 20,
        includedCriteria: [{ 'criterion-id': '0' }],
        overwriteRequirements: true,
        requirements: initialDataRequirements,
      };

      if (capAssessement?.isSubContractorAccepted) {
        PUT_BODY.includedCriteria.push({ 'criterion-id': '1' });
        PUT_BODY.requirements[0].values.push({ 'criterion-id': '1', value: '1: Yes' });
      }
      const DIMENSION_ID = locationData['dimension-id'];
      const BASEURL_FOR_PUT = `/assessments/${assessmentId}/dimensions/${DIMENSION_ID}`;
      await TenderApi.Instance(SESSION_ID).put(BASEURL_FOR_PUT, PUT_BODY,);
      
      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/36`, 'Completed');
      let flag=await ShouldEventStatusBeUpdated(eventId,37,req);
    if(flag)
    {
      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/37`, 'Not started');
    }
      //await TenderApi.Instance(SESSION_ID).put(`journeys/${eventIId}/38`, 'Cannot start yet');
      res.redirect('/rfp/task-list');
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
