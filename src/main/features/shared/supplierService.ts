import { AgreementAPI } from '../../common/util/fetch/agreementservice/agreementsApiInstance';
import express from 'express';

export const GetLotSuppliers = async (req: express.Request) => {
  const {agreement_id , lotId } = req.session;
  const lotSuppliersEndpoint = `agreements/${agreement_id}/lots/${lotId}/suppliers`;
  console.log(lotSuppliersEndpoint);
  try {
    const { data: suppliers } = await AgreementAPI.Instance(null).get(lotSuppliersEndpoint);
    return suppliers;
  } catch (err) {}
};
