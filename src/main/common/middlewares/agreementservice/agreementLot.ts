import { CookieOptions, NextFunction, Request, Response } from 'express';
import { cookies } from '../../cookies/cookies';
import config from 'config';
import { Logger } from '@hmcts/nodejs-logging';
import { AgreementDetail } from '../models/agreement-detail';
import { LotDetail } from '../models/lot-detail';
import { LotSupplier } from '../models/lot-supplier';
import { FetchResult } from 'main/services/types/helpers/api';
import { agreementsService } from 'main/services/agreementsService';

const logger = Logger.getLogger('agreement-lot');

const getAgreementServiceResData = async <T>(result: Promise<FetchResult<T>>, logMessage: string): Promise<T> => {
  const startTime = performance.now();
  const resultData = (await result).unwrap();

  logger.info(`${logMessage} in ${performance.now() - startTime}ms`);

  return resultData;
};

/**
 *
 * @Middleware
 * @param req
 * @param res
 * @param next
 */
export class AgreementLotMiddleware {
  static FetchAgreements = async (req: Request, res: Response, next: NextFunction) => {
    const { lotNum: lotId, agreement_id: agreementId } = req.query as { lotNum: string, agreement_id: string};
    const { SESSION_ID: accessToken } = req.cookies;

    try {
      const [agreementDetail, lotDetail, lotSuppliers] = await Promise.all([
        getAgreementServiceResData<AgreementDetail>(agreementsService.api.getAgreement(agreementId), `Feached agreement details from Agreement service API for ${agreementId}`),
        getAgreementServiceResData<LotDetail>(agreementsService.api.getAgreementLot(agreementId, lotId), `Feached Lot detail from Agreement service API for ${agreementId}, lot: ${lotId}`),
        getAgreementServiceResData<LotSupplier[]>(agreementsService.api.getAgreementLotSuppliers(agreementId, lotId), `Feached Lot detail suppliers from Agreement service API for ${agreementId}, lot: ${lotId}`)
      ]);

      res.locals.agreement_lot = { ...lotDetail };
      req.session.agreementEndDate = agreementDetail.endDate;
      req.session.agreementName = agreementDetail.name;
      req.session.suppliersCount = lotSuppliers.length;
      req.session.agreementDescription = lotDetail.description;

      const redisAccessToken = req.session['access_token'];

      if (redisAccessToken === accessToken) {
        req.session.agreement_id = agreementId;
        req.session.lotNum = lotId;

        const cookieSettings: CookieOptions = {
          maxAge: Number(config.get('Session.time')) * 60 * 1000,
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
        };

        res.cookie(cookies.lotNum, lotId, cookieSettings);
        res.cookie(cookies.agreement_id, agreementId, cookieSettings);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}
