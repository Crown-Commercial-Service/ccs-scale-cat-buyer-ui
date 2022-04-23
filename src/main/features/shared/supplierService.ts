import { AgreementAPI } from '../../common/util/fetch/agreementservice/agreementsApiInstance';
import express from 'express';

export const GetLotSuppliers = async (req: express.Request) => {
  const { agreement_id, lotId } = req.session;
  const lotSuppliersEndpoint = `agreements/${agreement_id}/lots/${lotId}/suppliers`;
  try {
    const { data: suppliers } = await AgreementAPI.Instance.get(lotSuppliersEndpoint);
    return suppliers;
  } catch (err) {}
};
