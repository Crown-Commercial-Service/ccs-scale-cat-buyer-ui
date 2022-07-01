//@ts-nocheck
import * as express from 'express';
import * as data from '../../../resources/content/requirements/rfpChooseSecurityRequirementsType.json';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import {ShouldEventStatusBeUpdated} from '../../shared/ShouldEventStatusBeUpdated';

export const RFP_GET_CHOOSE_SECURITY_REQUIREMENTS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { releatedContent, isError, errorText, dimensions,currentEvent,eventId } = req.session;
  // const { projectId } = req.session;
  const { assessmentId } = currentEvent;
  //const assessmentId = 13;
  const extToolId=2;

 
  const ASSESSTMENT_BASEURL = `/assessments/${assessmentId}`;
  try {
    const { data: assessments } = await TenderApi.Instance(SESSION_ID).get(ASSESSTMENT_BASEURL);

    const { dimensionRequirements } = assessments;

    let selectedOption;
    let totalQuantityrfp=0;
    if (dimensionRequirements.length > 0) {
      if(dimensionRequirements.filter(dimension => dimension["dimension-id"] === 7).length>0)
      {
        totalQuantityrfp=dimensionRequirements.filter(x=>x["dimension-id"]=== 7)[0].requirements.map(a => a.weighting).reduce(function(a, b)
      {
         return a + b;
      });
      req.session.totalQuantityrfp=totalQuantityrfp;
      }
     if(dimensionRequirements.filter(dimension => dimension.name === 'Security Clearance').length>0)
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
   
  
    const DIMENSION_BASEURL = `assessments/tools/${extToolId}/dimensions`;
    const { data: dimensions } = await TenderApi.Instance(SESSION_ID).get(DIMENSION_BASEURL);

    const options = dimensions
      .find(dim => dim.name === 'Security Clearance')
      .evaluationCriteria.find(criteria => criteria['criterion-id'] === '0').options;
    req.session.isError = false;
    req.session.errorText = '';
    const appendData = { ...data, releatedContent, isError, errorText,totalQuantityrfp };

    //await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/54`, 'In progress');
    let flag=await ShouldEventStatusBeUpdated(req.session.eventId,34,req);
    if(flag)
    {
    await TenderApi.Instance(SESSION_ID).put(`journeys/${req.session.eventId}/steps/34`, 'In progress');
    }
    res.render('rfp-chooseSecurityRequirements', appendData);
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

function checkErrors(selectedNumber, resources,totalQuantityrfp) {
  let errorText = [];
 // const selectedNumber = selected ? selected.replace(/[^0-9.]/g, '') : null;
 
  if (!selectedNumber) {
    errorText.push({ text: 'You must select the highest level of security clearance that staff supplied to the projrct will need to have.' });
  } else if (selectedNumber && ['1','2', '3', '4'].includes(selectedNumber) && !resources) {
    errorText.push({ text: 'You must enter the number of staffs who will need a lower security and vetting requirement.' });
  } else if (selectedNumber && ['1','2', '3', '4'].includes(selectedNumber) && (resources < 0 || resources > (totalQuantityrfp-1))) {
    errorText.push({ text: 'A Quantity must be between 1 to Quantity('+totalQuantityrfp+') - 1' });
  }
  const isError = errorText.length > 0;
  return { isError, errorText };
}

export const RFP_POST_CHOOSE_SECURITY_REQUIREMENTS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { eventId, releatedContent, currentEvent } = req.session;
  const { assessmentId } = currentEvent;
  //const assessmentId = 13;
  const { ccs_rfp_choose_security: selectedValue, ccs_rfp_resources } = req.body;
  const selectedresourceNumber = selectedValue ? selectedValue.replace(/[^0-9.]/g, '') : null;

  const resources= selectedresourceNumber>0?ccs_rfp_resources[selectedresourceNumber-1]:0;
  const totalQuantityrfp=req.session.totalQuantityrfp;
  const { isError, errorText } = checkErrors(selectedresourceNumber,resources,totalQuantityrfp);
  if (isError) {
    req.session.errorText = errorText;
    req.session.isError = isError;
    res.redirect('/rfp/choose-security-requirements');
  } else {
    try {
      const requirementsData = [
        {
          name: 'Performance analysis and data',
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

      const body = {
        name: 'Security Clearance',
        'dimension-id': 2,
        weighting: 40,
        includedCriteria: [{ 'criterion-id': '0' }],
        requirements: requirementsData,
      };
      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/34`, 'Completed');
      let flag=await ShouldEventStatusBeUpdated(eventId,35,req);
    if(flag)
    {
      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/35`, 'Not started');
    }
      await TenderApi.Instance(SESSION_ID).put(`/assessments/${assessmentId}/dimensions/2`, body);
      res.redirect('/rfp/service-capabilities');
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
