import { LotSupplier } from '@common/middlewares/models/lot-supplier';
import { Request } from 'express';
import { agreementsService } from 'main/services/agreementsService';
import { FetchResultStatus } from 'main/services/types/helpers/api';

export const GetLotSuppliers = async (req: Request): Promise<LotSupplier[]> => {
  const { agreement_id, lotId } = req.session;

  const getAgreementLotSuppliersResponse = await agreementsService.api.getAgreementLotSuppliers(agreement_id, lotId);

  if(getAgreementLotSuppliersResponse.status === FetchResultStatus.OK) {
    return getAgreementLotSuppliersResponse.data;
  }
};
