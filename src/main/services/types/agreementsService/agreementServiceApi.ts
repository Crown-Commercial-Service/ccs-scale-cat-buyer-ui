import { AgreementDetail } from '@common/middlewares/models/agreement-detail';
import { FetchResult } from '../helpers/api';
import { LotDetail } from '@common/middlewares/models/lot-detail';
import { LotSupplier } from '@common/middlewares/models/lot-supplier';
import { AgreementLotEventType } from './v1/api';
import { AgreementServiceHealthResponse } from './v2/api';

type GetAgreement = (agreementId: string) => Promise<FetchResult<AgreementDetail>>

type GetAgreementLots = (agreementId: string) => Promise<FetchResult<LotDetail[]>>

type GetAgreementLot = (agreementId: string, lotId: string) => Promise<FetchResult<LotDetail>>

type GetAgreementLotSuppliers = (agreementId: string, lotId: string) => Promise<FetchResult<LotSupplier[]>>

type GetAgreementLotEventTypes = (agreementId: string, lotId: string) => Promise<FetchResult<AgreementLotEventType[]>>

type GetAgreementsServiceHealth = () => Promise<FetchResult<AgreementServiceHealthResponse>>

interface AgreementsServiceAPI {
  getAgreement: GetAgreement,
  getAgreementLots: GetAgreementLots,
  getAgreementLot: GetAgreementLot,
  getAgreementLotSuppliers: GetAgreementLotSuppliers,
  getAgreementLotEventTypes: GetAgreementLotEventTypes,
}

type AgreementsServiceV1API = AgreementsServiceAPI

type AgreementsServiceV2API = AgreementsServiceAPI & {
  getAgreementsServiceHealth: GetAgreementsServiceHealth
}

export { AgreementsServiceAPI, AgreementsServiceV1API, AgreementsServiceV2API };
