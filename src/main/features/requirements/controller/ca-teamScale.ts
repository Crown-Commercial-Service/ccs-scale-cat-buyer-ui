//@ts-nocheck
import * as express from 'express';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import * as caTeamScale from '../../../resources/content/requirements/caTeamScale.json';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { idText } from 'typescript';

/**
 *
 * @param req
 * @param res
 * @GETController
 */
export const CA_GET_TEAM_SCALE = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { choosenViewPath } = req.session;
  const { lotId, agreementLotName, agreementName, eventId, projectId, agreement_id, releatedContent, project_name,caTeamScaleerror,dimensions } =
    req.session;
  const agreementId_session = agreement_id;
  const assessmentId = req.session.currentEvent.assessmentId;
  const { isJaggaerError } = req.session;
  req.session['isJaggaerError'] = false;
  res.locals.agreement_header = {
    agreementName,
    project_name,
    agreementId_session,
    agreementLotName,
    lotid: lotId,
    error: caTeamScaleerror,
  };
  req.session.caTeamScaleerror=false;
  try {
    // get the stored value from session. If not found, call api
    const assessmentDetail = await GET_ASSESSMENT_DETAIL(SESSION_ID, assessmentId);
    const assessmentURL=`assessments/${assessmentId}`;
    const assessmentData = await TenderApi.Instance(SESSION_ID).get(assessmentURL);
    const externalID=assessmentData.data['external-tool-id']
    const Data=assessmentData.data.dimensionRequirements.filter(x=>x["dimension-id"]===4);
    const ScaleURL=`/assessments/tools/${externalID}/dimensions`;
    const ScaleData=await TenderApi.Instance(SESSION_ID).get(ScaleURL);
    let Scale_Dataset=ScaleData.data;
    let option;
    let TEAMSCALE_DATASET;
    let RadioData=[];
    TEAMSCALE_DATASET = Scale_Dataset.filter(levels => levels['name'] === 'Scalability');
      option=TEAMSCALE_DATASET[0].options;
      for(let i=0;i<option.length;i++){
        let dataReceived={
        "name":option[i].name,
        "value":option[i]['requirement-id'],
        "selected":false
      }
      RadioData.push(dataReceived)
      }
    if (Data[0].requirements.length > 0) {
      // if(assessmentDetail.dimensionRequirements.filter(dimension => dimension["dimension-id"] === 4).length>0){  
         const optionId = Data[0].requirements[0]['requirement-id'];
       const objIndex = RadioData.findIndex(obj => obj.value === optionId);

       RadioData[objIndex].selected = true;
    }
    RadioData.sort((a,b)=>(a.value < b.value) ? -1 : 1 );
     
  
    const windowAppendData = { data:caTeamScale,RadioData, lotId, agreementLotName, choosenViewPath, releatedContent,error: caTeamScaleerror };
    res.render('ca-team-scale', windowAppendData);
  } catch (error) {
    req.session['isJaggaerError'] = true;
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Get failed - CA team scale page',
      true,
    );
  }
};

const GET_ASSESSMENT_DETAIL = async (sessionId: any, assessmentId: string) => {
  const assessmentBaseUrl = `/assessments/${assessmentId}`;
  const assessmentApi = await TenderApi.Instance(sessionId).get(assessmentBaseUrl);
  return assessmentApi.data;
};

export const CA_POST_TEAM_SCALE = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId } = req.session;
  const assessmentId = req.session.currentEvent.assessmentId;
  const dimension = req.session.dimensions;
  //const scalabledata = req.session.scaledata;
  //let data=parseInt(scalabledata);
  const scalabilityData = dimension.filter(data => data.name === 'Scalability')[0];
  const assessmentDetail = await GET_ASSESSMENT_DETAIL(SESSION_ID, assessmentId);
  const Dimensionrequirements=assessmentDetail.dimensionRequirements;
  const dimensionName=scalabilityData['name'];
  const weight=Dimensionrequirements.filter(x=>x["dimension-id"]===4)[0].weighting;
 if(req.body.team_option!=undefined){
  try {
    const body = {
      'dimension-id': scalabilityData['dimension-id'],
      name:dimensionName ,
      weighting: weight,
      includedCriteria: [{ 'criterion-id': '0' }],
      requirements: [
        {
          name: scalabilityData.options.find(data => data['requirement-id'] === Number(req.body.team_option)).name,
          'requirement-id': Number(req.body.team_option),
          weighting: 100,
          values: [{ 'criterion-id': '0', value: '1: Yes' }],
        },
      ],
    };
    

    if (req.session['CapAss']?.isSubContractorAccepted) {
      body.includedCriteria.push({ 'criterion-id': '1' });
      body.requirements[0].values.push({ 'criterion-id': '1', value: '1: Yes' });
    }

    await TenderApi.Instance(SESSION_ID).put(
      `/assessments/${assessmentId}/dimensions/${scalabilityData['dimension-id']}`,
      body,
    );

    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/51`, 'Completed');
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/52`, 'Not started');

    // Check 'review ranked suppliers' step number
    // await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/`, 'To do');
    req.session.caTeamScaleerror=false;
    res.redirect('/ca/where-work-done');
   
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Post failed - CA team scale page',
      true,
    );
  }
}
else{
  req.session.caTeamScaleerror=true;
  res.redirect('/ca/team-scale');
  } 
};
