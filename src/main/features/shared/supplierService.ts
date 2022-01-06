import { AgreementAPI } from '../../common/util/fetch/agreementservice/agreementsApiInstance';
import { TenderApi } from '../../common/util/fetch/tenderService/tenderApiInstance';
import express from 'express';

export const GetLotSuppliers = async (req: express.Request) => {
  const { agreement_id, lotId } = req.session;
  const lotSuppliersEndpoint = `agreements/${agreement_id}/lots/${lotId}/suppliers`;
  try {
    const { data: suppliers } = await AgreementAPI.Instance.get(lotSuppliersEndpoint);
    return suppliers;
  } catch (err) {}
};

export const GetEventSuppliers = async (req: express.Request) => {
  const { projectId, eventId } = req.session;
  const { SESSION_ID } = req.cookies;
  const eventSuppliersEndpoint = `/tenders/projects/${projectId}/events/${eventId}/suppliers`;
  try {
    console.log(eventSuppliersEndpoint);
    const { data: suppliers } = await TenderApi.Instance(SESSION_ID).get(eventSuppliersEndpoint);
    console.log(suppliers);
    return suppliers;
  } catch (err) {}
};

export const UpdateLotSuppliers = async (req: express.Request, suppliers: any) => {
  const { procId, eventId } = req.session;
  const { SESSION_ID } = req.cookies;

  const eventSuppliersEndpoint = `/tenders/projects/${procId}/events/${eventId}/suppliers`;
  try {
    await TenderApi.Instance(SESSION_ID).put(eventSuppliersEndpoint, suppliers);
    return true;
  } catch (err) {}
};

export const RemoveSupplierFromLot = async (req: express.Request, suppliers: any) => {
  const { procId, eventId } = req.session;
  const { SESSION_ID } = req.cookies;

  const eventSuppliersEndpoint = `/tenders/projects/${procId}/events/${eventId}/suppliers`;
  try {
    await TenderApi.Instance(SESSION_ID).delete(eventSuppliersEndpoint, suppliers);
    return true;
  } catch (err) {}
};
