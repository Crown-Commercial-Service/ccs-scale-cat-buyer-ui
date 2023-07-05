import { LotDetail } from '@common/middlewares/models/lot-detail';
import { genericFecthGet } from '../helpers/api';
import { EndPoints, AgreementLotEventType } from '../types/agreementsService/api';
import { FetchResult } from '../types/helpers/api';
import { LotSupplier } from '@common/middlewares/models/lot-supplier';
import { AgreementDetail } from '@common/middlewares/models/agreement-detail';

const baseURL = () => process.env.AGREEMENTS_SERVICE_API_URL;

const headers = {
  'Content-Type': 'application/json'
};

// This data is static so we can Cache for an hour 
const agreementServiceCacheLength = 3600;

// GET /agreements/:agreement-id
const getAgreement = async (agreementId: string): Promise<FetchResult<AgreementDetail>> => {
  return genericFecthGet<AgreementDetail>(
    {
      baseURL: baseURL(),
      path: EndPoints.AGREEMENT,
      params: { agreementId }
    },
    headers,
    {
      key: `get_agreements_${agreementId}`,
      seconds: agreementServiceCacheLength
    },
    {
      name: 'agreement service',
      message: `Feached agreement from the Agreement service API for agreement: ${agreementId}`
    }
  );
};

// GET /agreements/:agreement-id/lots
const getAgreementLots = async (agreementId: string): Promise<FetchResult<LotDetail[]>> => {
  return genericFecthGet<LotDetail[]>(
    {
      baseURL: baseURL(),
      path: EndPoints.AGREEMENT_LOTS,
      params: { agreementId }
    },
    headers,
    {
      key: `get_agreements_${agreementId}_lots`,
      seconds: agreementServiceCacheLength
    },
    {
      name: 'agreement service',
      message: `Feached agreement lots from the Agreement service API for agreement: ${agreementId}`
    }
  );
};

// GET /agreements/:agreement-id/lots/:lot-id
const getAgreementLot = async (agreementId: string, lotId: string): Promise<FetchResult<LotDetail>> => {
  return genericFecthGet<LotDetail>(
    {
      baseURL: baseURL(),
      path: EndPoints.AGREEMENT_LOT,
      params: { agreementId, lotId }
    },
    headers,
    {
      key: `get_agreements_${agreementId}_lots_${lotId}`,
      seconds: agreementServiceCacheLength
    },
    {
      name: 'agreement service',
      message: `Feached agreement lot from the Agreement service API for agreement: ${agreementId}, lot: ${lotId}`
    }
  );
};

// GET /agreements:agreement-id/lots/:lot-id/suppliers
const getAgreementLotSuppliers = async (agreementId: string, lotId: string): Promise<FetchResult<LotSupplier[]>> => {
  return genericFecthGet<LotSupplier[]>(
    {
      baseURL: baseURL(),
      path: EndPoints.AGREEMENT_LOT_SUPPLIERS,
      params: { agreementId, lotId }
    },
    headers,
    {
      key: `get_agreements_${agreementId}_lots_${lotId}_suppliers`,
      seconds: 900
    },
    {
      name: 'agreement service',
      message: `Feached agreement lot suppliers from the Agreement service API for agreement: ${agreementId}, lot: ${lotId}`
    }
  );
};

// GET /agreements:agreement-id/lots/:lot-id/event-types
const getAgreementLotEventTypes = async (agreementId: string, lotId: string): Promise<FetchResult<AgreementLotEventType[]>> => {
  return genericFecthGet<AgreementLotEventType[]>(
    {
      baseURL: baseURL(),
      path: EndPoints.AGREEMENT_LOT_EVENT_TYPES,
      params: { agreementId, lotId }
    },
    headers,
    {
      key: `get_agreements_${agreementId}_lots_${lotId}_event_types`,
      seconds: agreementServiceCacheLength
    },
    {
      name: 'agreement service',
      message: `Feached agreement lot event types from the Agreement service API for agreement: ${agreementId}, lot: ${lotId}`
    }
  );
};

const agreementsServiceAPI = {
  getAgreement,
  getAgreementLots,
  getAgreementLot,
  getAgreementLotSuppliers,
  getAgreementLotEventTypes
};

export { agreementsServiceAPI };
