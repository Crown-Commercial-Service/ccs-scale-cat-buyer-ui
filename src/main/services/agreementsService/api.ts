import { LotDetail } from '@common/middlewares/models/lot-detail';
import { genericFecthGet } from '../helpers/api';
import { EndPoints, AgreementLotEventType } from '../types/agreementsService/api';
import { FetchResult } from '../types/helpers/api';
import { LotSupplier } from '@common/middlewares/models/lot-supplier';
import { AgreementDetail } from '@common/middlewares/models/agreement-detail';

const baseURL: string = process.env.AGREEMENTS_SERVICE_API_URL;

const headers = {
  'Content-Type': 'application/json'
};

const endPoints: EndPoints = {
  agreement: '/agreements/:agreement-id',
  agreementLots: '/agreements/:agreement-id/lots',
  agreementLot: '/agreements/:agreement-id/lots/:lot-id',
  agreementLotSuppliers: '/agreements/:agreement-id/lots/:lot-id/suppliers',
  agreementLotEventTypes: '/agreements/:agreement-id/lots/:lot-id/event-types'
};

// This data is static so we can Cache for an hour 
const agreementServiceCacheLength = 3600;

// GET /agreements/:agreement-id
const getAgreement = async (agreementId: string): Promise<FetchResult<AgreementDetail>> => {
  return genericFecthGet<AgreementDetail>(
    {
      baseURL: baseURL,
      path: endPoints.agreement,
      params: [
        [':agreement-id', agreementId]
      ]
    },
    headers,
    {
      key: `get_agreements_${agreementId}`,
      seconds: agreementServiceCacheLength
    }
  );
};

// GET /agreements/:agreement-id/lots
const getAgreementLots = async (agreementId: string): Promise<FetchResult<LotDetail[]>> => {
  return genericFecthGet<LotDetail[]>(
    {
      baseURL: baseURL,
      path: endPoints.agreementLots,
      params: [
        [':agreement-id', agreementId]
      ]
    },
    headers,
    {
      key: `get_agreements_${agreementId}_lots`,
      seconds: agreementServiceCacheLength
    }
  );
};

// GET /agreements/:agreement-id/lots/:lot-id
const getAgreementLot = async (agreementId: string, lotId: string): Promise<FetchResult<LotDetail>> => {
  return genericFecthGet<LotDetail>(
    {
      baseURL: baseURL,
      path: endPoints.agreementLot,
      params: [
        [':agreement-id', agreementId],
        [':lot-id', lotId]
      ]
    },
    headers,
    {
      key: `get_agreements_${agreementId}_lots_${lotId}`,
      seconds: agreementServiceCacheLength
    }
  );
};

// GET /agreements:agreement-id/lots/:lot-id/suppliers
const getAgreementLotSuppliers = async (agreementId: string, lotId: string): Promise<FetchResult<LotSupplier[]>> => {
  return genericFecthGet<LotSupplier[]>(
    {
      baseURL: baseURL,
      path: endPoints.agreementLotSuppliers,
      params: [
        [':agreement-id', agreementId],
        [':lot-id', lotId]
      ]
    },
    headers,
    {
      key: `get_agreements_${agreementId}_lots_${lotId}_suppliers`,
      seconds: 900
    }
  );
};

// GET /agreements:agreement-id/lots/:lot-id/event-types
const getAgreementLotEventTypes = async (agreementId: string, lotId: string): Promise<FetchResult<AgreementLotEventType[]>> => {
  return genericFecthGet<AgreementLotEventType[]>(
    {
      baseURL: baseURL,
      path: endPoints.agreementLotEventTypes,
      params: [
        [':agreement-id', agreementId],
        [':lot-id', lotId]
      ]
    },
    headers,
    {
      key: `get_agreements_${agreementId}_lots_${lotId}_event_types`,
      seconds: agreementServiceCacheLength
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
