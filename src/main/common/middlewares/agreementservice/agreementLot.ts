import config from 'config';
import { CookieOptions, NextFunction, Request, Response } from 'express';
import { cookies } from '../../cookies/cookies';
import { agreementsService } from 'main/services/agreementsService';

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
      const [agreementDetailResult, lotDetailResult, lotSuppliersResult] = await Promise.all([
        agreementsService.api.getAgreement(agreementId),
        agreementsService.api.getAgreementLot(agreementId, lotId),
        agreementsService.api.getAgreementLotSuppliers(agreementId, lotId)
      ]);

      const [agreementDetail, lotDetail, lotSuppliers] = [
        agreementDetailResult.unwrap(),
        lotDetailResult.unwrap(),
        lotSuppliersResult.unwrap()
      ];

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
