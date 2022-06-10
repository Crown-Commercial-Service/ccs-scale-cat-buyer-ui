//@ts-nocheck
import * as express from 'express';
import * as data from '../../../resources/content/requirements/caChooseSecurityRequirement.json';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';

export const CA_GET_CHOOSE_SECURITY_REQUIREMENTS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { releatedContent, isError, errorText, dimensions,currentEvent,projectId } = req.session;
  const { assessmentId } = currentEvent;
  const extToolId=1;

 
  const ASSESSTMENT_BASEURL = `/assessments/${assessmentId}`;
  try {
    const { data: assessments } = await TenderApi.Instance(SESSION_ID).get(ASSESSTMENT_BASEURL);

    const { dimensionRequirements } = assessments;
    let totalQuantityca;
    let selectedOption;
    if (dimensionRequirements.length > 0) {
        if(dimensionRequirements.filter(dimension => dimension["dimension-id"] === 1).length>0)
      {
        if(dimensionRequirements.filter(dimension => dimension["dimension-id"] === 1)[0].requirements.length>0)
        {
          totalQuantityca=dimensionRequirements.filter(x=>x["dimension-id"])[0].requirements.map(a => a.weighting).reduce(function(a, b)
          {
             return a + b;
          });
          req.session.totalQuantityca=totalQuantityca;
        }      
    }
     if(dimensionRequirements.filter(dimension => dimension.name === 'Security Clearance').length>0)
      {
        if(dimensionRequirements.filter(dimension => dimension.name === 'Security Clearance')[0].requirements.length>0)
        {
      selectedOption = dimensionRequirements.filter(dimension => dimension.name === 'Security Clearance')[0]
      .requirements[0].values[0].value;
      data.form.radioOptions.items.find(item => item.value === selectedOption).checked = true;
      if(dimensionRequirements.filter(dimension => dimension.name === 'Security Clearance')[0].requirements[0].weighting>0)
      {
        data.form.selectedValue=dimensionRequirements.filter(dimension => dimension.name === 'Security Clearance')[0].requirements[0].weighting;
      }
     }
    }
    }
   
  
    const DIMENSION_BASEURL = `assessments/tools/${extToolId}/dimensions`;
    const { data: dimensions } = await TenderApi.Instance(SESSION_ID).get(DIMENSION_BASEURL);

    const options = dimensions
      .find(dim => dim.name === 'Security Clearance')
      .evaluationCriteria.find(criteria => criteria['criterion-id'] === '0').options;
    req.session.isError = false;
    req.session.errorText = '';
    const appendData = { ...data, releatedContent, isError, errorText };

    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/48`, 'In progress');
    res.render('ca-chooseSecurityRequirements', appendData);
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'update the status failed - CA TaskList Page',
      true,
    );
  }
};

function checkErrors(selectedNumber, resources,totalQuantityca) {
  let errorText = [];
  if (!selectedNumber) {
    errorText.push({ text: 'You must select the highest level of security clearance that staff supplied to the project will need to have.' });
  } else if (selectedNumber && ['1','2', '3', '4'].includes(selectedNumber) && !resources) {
    errorText.push({ text: 'You must enter the number of staff who will need a lower security and vetting requirement' });
  } else if (selectedNumber && ['1','2', '3', '4'].includes(selectedNumber) && (resources < 0 || resources > (totalQuantityca-1))) {
    errorText.push({ text: 'A Quantity must be between 1 to Quantity('+totalQuantityca+') - 1' });
  }
  const isError = errorText.length > 0;
  return { isError, errorText };
}

export const CA_POST_CHOOSE_SECURITY_REQUIREMENTS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId, releatedContent, currentEvent } = req.session;
  const { assessmentId } = currentEvent;
  const { ccs_ca_choose_security: selectedValue, ccs_ca_resources } = req.body;
  const selectedresourceNumber = selectedValue ? selectedValue.replace(/[^0-9.]/g, '') : null;

  const resources= selectedresourceNumber>0?ccs_ca_resources[selectedresourceNumber-1]:0;
  const totalQuantityca=req.session.totalQuantityca;
  const { isError, errorText } = checkErrors(selectedresourceNumber,resources);
  if (isError) {
    req.session.errorText = errorText;
    req.session.isError = isError;
    res.redirect('/ca/choose-security-requirements');
  } else {
    try {
      let dimension2weighitng;
    const ASSESSTMENT_BASEURL = `/assessments/${assessmentId}`;
    const { data: assessments } = await TenderApi.Instance(SESSION_ID).get(ASSESSTMENT_BASEURL);
    const { dimensionRequirements } = assessments;
    if(dimensionRequirements.length>0)
    {
       dimension2weighitng=dimensionRequirements?.filter(dimension => dimension["dimension-id"] === 2)[0].weighting;
    }
    else
    {
      dimension2weighitng=10;
    } 
      const requirementsData = [
        {
          'requirement-id': 101,
          weighting: resources,
          values: [
            {
              'criterion-id': '0',
              value: selectedValue,
            },
          ],
        },
      ];
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
        weighting: dimension2weighitng,
        includedCriteria:includedSubContractor,
        requirements: requirementsData,
      };
      await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/48`, 'Completed');
      await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/49`, 'Not started');
      await TenderApi.Instance(SESSION_ID).put(`/assessments/${assessmentId}/dimensions/2`, body);
      res.redirect('/ca/service-capabilities');
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
