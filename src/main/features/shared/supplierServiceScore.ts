import { TenderApi } from '../../common/util/fetch/procurementService/TenderApiInstance';
import express from 'express';

export const GetLotSuppliersScore = async (req: express.Request, score: any) => {
  const { SESSION_ID } = req.cookies;
  const assessmentId = req.session?.currentEvent?.assessmentId;
  try {
    console.log('here-> 080824.X');
    console.log(144, assessmentId);
    console.log('end-> 080824.X');
    const { data: suppliers } = await TenderApi.Instance(SESSION_ID).get(`/assessments/${assessmentId}?scores=true`);
    return suppliers; //suppliers?.scores;
  } catch (err) {
    // Do nothing if there is an error
  }
};
