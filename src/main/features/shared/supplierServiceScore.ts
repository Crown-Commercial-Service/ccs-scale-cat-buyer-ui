import { TenderApi } from '../../common/util/fetch/procurementService/TenderApiInstance';
import express from 'express';

export const GetLotSuppliersScore = async (req: express.Request, score: any) => {
    const { SESSION_ID } = req.cookies;
    const assessmentId = req.session?.currentEvent?.assessmentId;
    try {
        const { data: suppliers } = await TenderApi.Instance(SESSION_ID).get(`/assessments/${assessmentId}?scores=true`);
        return suppliers;   //suppliers?.scores;
    } catch (err) {
    }
};
