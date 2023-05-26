//@ts-nocheck
import express from 'express';
import { TenderApi } from '../../common/util/fetch/procurementService/TenderApiInstance';
import * as journyData from '../procurement/model/tasklist.json';

//export async function ShouldEventStatusBeUpdated(projectId:any, stepId:any)
export const ShouldEventStatusBeUpdated = async (eventId: any, stepId: any, req: Express.Request) => {
  //let projectId=req.session.projectId;
  const { SESSION_ID } = req.cookies;
  //let stepId=parseInt(req.query.stepId);
  try {
    const { data: journeySteps } = await TenderApi.Instance(SESSION_ID).get(`journeys/${eventId}/steps`);
    const defaultStatus = journyData.states.find((item) => item.step === stepId)?.state;
    const actualStatus = journeySteps.find((d) => d.step == stepId)?.state;
    if (defaultStatus == actualStatus || actualStatus == 'Not started') {
      return true;
    }
    return false;
  } catch (error) {
    // Do nothing if there is an error
  }
};
