import { Handler, Request, Response, NextFunction } from 'express';
import { Logger } from '@hmcts/nodejs-logging';
import { AgreementDetail } from '../models/agreement-detail';
import { agreementsService } from 'main/services/agreementsService';
import { SessionData } from 'express-session';
const logger = Logger.getLogger('agreement-details-fetch');

const getAgreementDetail = async (agreementId: string): Promise<AgreementDetail> => {
  const startTime = performance.now();
  const agreementDetail = (await agreementsService.api.getAgreement(agreementId)).unwrap();

  logger.info(`Feached agreement details from Agreement service API for ${agreementId} in ${performance.now() - startTime}ms`);

  return agreementDetail;
};

const setAgreementHeader = (req: Request, res: Response, agreementDetail: AgreementDetail): void => {
  if (req?.session?.agreementName !== undefined) {
    req.session.agreementName = agreementDetail.name;
  };

  const reqSessionData = req?.session ?? {} as SessionData;

  res.locals.agreement_header = {
    projectName: reqSessionData.project_name,
    projectId: reqSessionData.projectId,
    agreementName: reqSessionData.agreementName,
    agreementIdSession: agreementDetail.number,
    agreementLotName: reqSessionData.agreementLotName,
    lotid: reqSessionData.lotId,
  };
};

/**
 *
 * @Middleware
 * @param req
 * @param res
 * @param next
 */
class AgreementDetailsFetchMiddleware {
  static FetchAgreements: Handler = async (req: Request, res: Response, next: NextFunction) => {
    const agreementIdSession = req?.session?.agreement_id;
    if (agreementIdSession) {
      try {
        const agreementDetail = await getAgreementDetail(agreementIdSession);

        setAgreementHeader(req, res, agreementDetail);
        res.locals.selectedAgreement = agreementDetail;

        next();
      } catch (error) {
        next(error);
      }
    } else {
      next();
    }
  };
}

export { AgreementDetailsFetchMiddleware, getAgreementDetail, setAgreementHeader };
