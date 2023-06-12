import { NextFunction, Request, Response } from 'express';
import { LotDetail } from '../models/lot-detail';
import { Logger } from '@hmcts/nodejs-logging';
import { agreementsService } from 'main/services/agreementsService';

const logger = Logger.getLogger('choose-agreement');

const getAgreementLotDetail = async (agreementId: string): Promise<LotDetail[]> => {
  const startTime = performance.now();
  const agreementLots = (await agreementsService.api.getAgreementLots(agreementId)).unwrap();

  logger.info(`Feached Lot details from Agreement service API for ${agreementId} in ${performance.now() - startTime}ms`);

  const lotDetails = await Promise.all(agreementLots.map(async (lotDetail) => {
    const startTime = performance.now();
    const agreementLotSuppliers = (await (agreementsService.api.getAgreementLotSuppliers(agreementId, lotDetail.number))).unwrap();

    logger.info(`Feached Lot detail suppliers from Agreement service API for ${agreementId}, lot: ${lotDetail.number} in ${performance.now() - startTime}ms`);

    lotDetail.suppliers = `${agreementLotSuppliers.length} suppliers`;

    return lotDetail;
  }));

  return lotDetails.sort((a, b) => a.number > b.number ? 1 : -1);
};

/**
 *
 * @Middleware
 * @param req
 * @param res
 * @param next
 */
class ChooseAgreementMiddleware {
  static FetchAgreements = async (req: Request, res: Response, next: NextFunction) => {
    if (req.session.agreement_id) {
      try {
        res.locals.sortedItems = await getAgreementLotDetail(req.session.agreement_id);

        next();
      } catch (error) {
        next(error);
      }
    } else {
      next();
    }
  };
}

export { ChooseAgreementMiddleware, getAgreementLotDetail };
