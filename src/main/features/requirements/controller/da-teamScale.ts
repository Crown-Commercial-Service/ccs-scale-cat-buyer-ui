//@ts-nocheck
import * as express from 'express';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import * as daTeamScale from '../../../resources/content/requirements/daTeamScale.json';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';

/**
 *
 * @param req
 * @param res
 * @GETController
 */
export const DA_GET_TEAM_SCALE = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { choosenViewPath } = req.session;
  const { lotId, agreementLotName, agreementName, eventId, projectId, agreement_id, releatedContent, project_name,daTeamScaleerror,dimensions } =
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
    error: daTeamScaleerror,
  };
  req.session.daTeamScaleerror=false;
  try {
    // get the stored value from session. If not found, call api
    const assessmentDetail = await GET_ASSESSMENT_DETAIL(SESSION_ID, assessmentId);
    const assessmentURL=`assessments/${assessmentId}`;
    const assessmentData = await TenderApi.Instance(SESSION_ID).get(assessmentURL);
    const externalID=assessmentData.data['external-tool-id']
    
    let Data;
    const ScaleURL=`/assessments/tools/${externalID}/dimensions`;
    const ScaleData=await TenderApi.Instance(SESSION_ID).get(ScaleURL);
    if(assessmentData !=null && assessmentData.data != null && assessmentData.data.dimensionRequirements !=null )
    {
      Data=assessmentData.data.dimensionRequirements.filter(x=>x["dimension-id"]===4);
    }
    let Scale_Dataset;
    if(ScaleData !=null && ScaleData.data !=null && ScaleData.data !=undefined)
     Scale_Dataset=ScaleData.data;
     let option;
    let TEAMSCALE_DATASET;
    let RadioData=[];

    TEAMSCALE_DATASET = Scale_Dataset.filter(levels => levels['name'] === 'Scalability');
    if(TEAMSCALE_DATASET != null && TEAMSCALE_DATASET.length >0)
      option=TEAMSCALE_DATASET[0].options;

      for(let i=0;i<option.length;i++){
        let dataReceived={
        "name":option[i].name,
        "value":option[i]['requirement-id'],
        "selected":false
      }
      RadioData.push(dataReceived)
      }
      if (Data !=null && Data.length > 0 && Data[0].requirements !=null && Data[0].requirements.length > 0) {
        // if(assessmentDetail.dimensionRequirements.filter(dimension => dimension["dimension-id"] === 4).length>0){  
           const optionId = Data[0].requirements[0]['requirement-id'];
         const objIndex = RadioData.findIndex(obj => obj.value === optionId);
  
         RadioData[objIndex].selected = true;
      }
      RadioData.sort((a,b)=>(a.value < b.value) ? -1 : 1 );
    const windowAppendData = { data: daTeamScale,RadioData, lotId, agreementLotName, choosenViewPath, releatedContent,error:daTeamScaleerror};
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/69`, 'In progress');
    res.render('da-team-scale', windowAppendData);
  } catch (error) {
    req.session['isJaggaerError'] = true;
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Get failed - DA team scale page',
      true,
    );
  }
};

const GET_ASSESSMENT_DETAIL = async (sessionId: any, assessmentId: string) => {
  const assessmentBaseUrl = `/assessments/${assessmentId}`;
  const assessmentApi = await TenderApi.Instance(sessionId).get(assessmentBaseUrl);
  return assessmentApi.data;
};

export const DA_POST_TEAM_SCALE = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId } = req.session;
  const assessmentId = req.session.currentEvent.assessmentId;
  const dimension = req.session.dimensions;
  const scalabilityData = dimension.filter(data => data.name === 'Scalability')[0];
  const assessmentDetail = await GET_ASSESSMENT_DETAIL(SESSION_ID, assessmentId);
  const Dimensionrequirements=assessmentDetail.dimensionRequirements;
  const dimensionName=scalabilityData['name'];
  const weight=Dimensionrequirements.filter(x=>x["dimension-id"]===4)[0].weighting;
  if(req.body.team_option!=undefined && req.body.team_option !=null){
  try {
    let subcontractorscheck;
    if(Dimensionrequirements?.filter(dimension => dimension["dimension-id"] === 4).length>0)
    {
      subcontractorscheck=(Dimensionrequirements?.filter(dimension => dimension["dimension-id"] === 4)[0].includedCriteria.
      find(x=>x["criterion-id"]==1))
    }
    let includedSubContractor=[];
    if(subcontractorscheck!=undefined)
    {
      includedSubContractor=[{ 'criterion-id': '1' }]
    }  

    const body = {
      'dimension-id': scalabilityData['dimension-id'],
      name: dimensionName,
      weighting: weight,
      includedCriteria: includedSubContractor,
      requirements: [
        {
          name: scalabilityData.options.find(data => data['requirement-id'] === Number(req.body.team_option)).name,
          'requirement-id': Number(req.body.team_option),
          weighting: 100,
          values: [{ 'criterion-id': '0', value: '1: Yes' }],
        },
      ],
    };


    await TenderApi.Instance(SESSION_ID).put(
      `/assessments/${assessmentId}/dimensions/${scalabilityData['dimension-id']}`,
      body,
    );
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/69`, 'Completed');
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/70`, 'Not started');

    // Check 'review ranked suppliers' step number
    // await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/`, 'To do');

    
    req.session.daTeamScaleerror=false;
    res.redirect('/da/where-work-done');
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Post failed - DA team scale page',
      true,
    );
  }
}
else{
  req.session.daTeamScaleerror=true;
  res.redirect('/da/team-scale');
  } 
};
