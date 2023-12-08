import { formatURL } from 'main/services/helpers/url';
import { EndPoints } from '../../types/agreementsService/v2/api';
import { baseURL, formatLotIdForAgreementService } from './helpers';

const agreementLotSuppliersExportURL = (agreementId: string, lotId: string) => {
  return formatURL({
    baseURL: baseURL(),
    path: EndPoints.AGREEMENT_LOT_SUPPLIERS_EXPORT,
    params: {
      agreementId,
      lotId: formatLotIdForAgreementService(lotId)
    }
  })
}

const agreementsServiceURL = {
  agreementLotSuppliersExportURL
};

export { agreementsServiceURL }
