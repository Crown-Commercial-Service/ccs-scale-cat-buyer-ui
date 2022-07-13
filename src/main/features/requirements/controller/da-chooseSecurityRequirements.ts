//@ts-nocheck
import * as express from 'express';
import * as data from '../../../resources/content/requirements/daChooseSecurityRequirementsType.json';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { ShouldEventStatusBeUpdated } from '../../shared/ShouldEventStatusBeUpdated';

export const DA_GET_CHOOSE_SECURITY_REQUIREMENTS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { releatedContent, isError,eventId, errorText, currentEvent,dimensions,projectId,choosenViewPath } = req.session;

  const { assessmentId } = currentEvent;

  const ASSESSTMENT_BASEURL = `/assessments/${assessmentId}`;
  try{
  const { data: assessments } = await TenderApi.Instance(SESSION_ID).get(ASSESSTMENT_BASEURL);
  const { dimensionRequirements } = assessments;
  const { 'external-tool-id': extToolId } = assessments;
  let totalQuantityda=0;
  let selectedOption;
  let securityQuantity=0;
  if (dimensionRequirements.length > 0) {
      if(dimensionRequirements.filter(dimension => dimension["dimension-id"] === 6).length>0)
    {
      if(dimensionRequirements.filter(dimension => dimension["dimension-id"] === 6)[0].requirements.length>0)
      {
        totalQuantityda=dimensionRequirements.filter(x=>x["dimension-id"]===6)[0].requirements.map(a => a.weighting).reduce(function(a, b)
        {
           return a + b;
        });
        req.session.totalQuantityda=totalQuantityda;
      }      
    }
    if(dimensionRequirements.filter(dimension =>dimension["dimension-id"] ===2).length>0)
    {
      if(dimensionRequirements.filter(dimension =>dimension["dimension-id"] ===2)[0].requirements.length>0)
      {
    selectedOption = dimensionRequirements.filter(dimension => dimension["dimension-id"] ===2)[0]
    .requirements[0].values?.find(y=>y["criterion-id"]==0)?.value;
    if(selectedOption!=undefined)
    {
      data.form.radioOptions.items.find(item => item.value === selectedOption).checked = true;
    } 
    securityQuantity=dimensionRequirements.filter(dimension => dimension["dimension-id"] ===2)[0]
    .requirements[0].values?.find(y=>y["criterion-id"]==6)?.value
    data.form.selectedValue=totalQuantityda-securityQuantity;
   }
  }
  }
  
  

  const DIMENSION_BASEURL = `assessments/tools/${extToolId}/dimensions`;
  const { data: dimensions } = await TenderApi.Instance(SESSION_ID).get(DIMENSION_BASEURL);

  const options = dimensions
    .find(dimension => dimension["dimension-id"] ===2)
    .evaluationCriteria.find(criteria => criteria['criterion-id'] === '0').options;

  req.session.isError = false;
  req.session.errorText = '';
  const appendData = { ...data, choosenViewPath, releatedContent, isError, errorText,totalQuantityda };
  let flag = await ShouldEventStatusBeUpdated(eventId, 67, req);
  if (flag) {
await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/67`, 'In progress');
  }
   res.render('da-chooseSecurityRequirements', appendData);
 } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'update the status failed - DA TaskList Page',
      true,
    );
  }
  
};

function checkErrors(selectedNumber, resources,totalQuantityda) {
  let errorText = [];
  

  if (!selectedNumber) {
    errorText.push({ text: 'You must select the highest level of security clearance that staff supplied to the project will need to have.' });
  } else if (selectedNumber && ['1', '2', '3', '4'].includes(selectedNumber) && !resources) {
    errorText.push({ text: 'You must enter the number of staff who will need a lower security and vetting requirement' });
  } else if (selectedNumber && ['1', '2', '3', '4'].includes(selectedNumber) && (resources < 0 || resources > (totalQuantityda-1))) {
    errorText.push({ text: 'A Quantity must be between 1 to Quantity('+totalQuantityda+') - 1' });
  }
  const isError = errorText.length > 0;
  return { isError, errorText };
}

export const DA_POST_CHOOSE_SECURITY_REQUIREMENTS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId,eventId, releatedContent, currentEvent } = req.session;
  const { assessmentId } = currentEvent;
  const { ccs_da_choose_security: selectedValue, ccs_da_resources } = req.body;
  const selectedresourceNumber = selectedValue ? selectedValue.replace(/[^0-9.]/g, '') : null;

  const resources= selectedresourceNumber>0?ccs_da_resources[selectedresourceNumber-1]:0;
  const totalQuantityda=req.session.totalQuantityda;
  //const { isError, errorText } = checkErrors(selectedresourceNumber,resources,totalQuantityda);
  // if (isError) {
  //   req.session.errorText = errorText;
  //   req.session.isError = isError;
  //   res.redirect('/da/choose-security-requirements');
  // } else {
    try {
      let dimension2weighitng;
      let SecQuantityrequirements;
      let requirementsData=[];
      let reqrmnt;
    const ASSESSTMENT_BASEURL = `/assessments/${assessmentId}`;
    const { data: assessments } = await TenderApi.Instance(SESSION_ID).get(ASSESSTMENT_BASEURL);
    const { dimensionRequirements } = assessments;
    if(dimensionRequirements.length>0)
    {
       dimension2weighitng=dimensionRequirements.filter(dimension => dimension["dimension-id"] === 2)[0]?.weighting;
       SecQuantityrequirements=dimensionRequirements.filter(dimension => dimension["dimension-id"] === 2)[0]?.requirements;
    }
    else
    {
      dimension2weighitng=10;
    }
    const da_Quantity=totalQuantityda-resources;
    for (var reqrment of SecQuantityrequirements) {
      reqrmnt = [{
        'requirement-id': reqrment["requirement-id"],
        weighting: reqrment.weighting,
        values: [
          {
            'criterion-id': '0',
            value: selectedValue,
          },
          {
            'criterion-id': '6',
            value: da_Quantity,
          },
        ],
      }];
      requirementsData.push(...reqrmnt)
    }
    let subcontractorscheck;
    if(dimensionRequirements?.filter(dimension => dimension["dimension-id"] === 2).length>0)
    {
      subcontractorscheck=(dimensionRequirements?.filter(dimension => dimension["dimension-id"] === 2)[0].includedCriteria.
      find(x=>x["criterion-id"]==1))
    }
    let includedSubContractor=[];
    if(subcontractorscheck!=undefined)
    {
      includedSubContractor=[{ 'criterion-id': '1' }]
    }  

      const body = {
        name: 'Security Clearance',
        'dimension-id': 2,
        weighting:dimension2weighitng,
        includedCriteria: includedSubContractor,
        requirements: requirementsData,
      };
      const response= await TenderApi.Instance(SESSION_ID).put(`/assessments/${assessmentId}/dimensions/2`, body);
      if(response.status == 200)
     {
      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/67`, 'Completed');
      let flag = await ShouldEventStatusBeUpdated(eventId, 68, req);
        if (flag) {
      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/68`, 'Not started');
        }
     if(req.session["DA_nextsteps_edit"])
      {
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/71`, 'Not started');
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/72`, 'Cannot start yet');
      }
      res.redirect('/da/service-capabilities');
     }else{
      res.redirect('/404/');
    }
      
      
    } catch (error) {
      LoggTracer.errorLogger(
        res,
        error,
        `${req.headers.host}${req.originalUrl}`,
        null,
        TokenDecoder.decoder(SESSION_ID),
        'Post failed - DA choose security requirements',
        true,
      );
    }
  //}
};
