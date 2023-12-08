import { formatURL } from 'main/services/helpers/url';
import { EndPoints } from '../../types/agreementsService/v1/api';
import { baseURL } from './helpers';

const statusURL = () => new URL(EndPoints.STATUS, baseURL());

const agreementLotSuppliersExportURL = (agreementId: string, lotId: string) => {
  return formatURL({
    baseURL: baseURL(),
    path: EndPoints.AGREEMENT_LOT_SUPPLIERS_EXPORT,
    params: {
      agreementId,
      lotId
    }
  })
}

const agreementsServiceURL = {
  statusURL,
  agreementLotSuppliersExportURL
};

export { agreementsServiceURL };
