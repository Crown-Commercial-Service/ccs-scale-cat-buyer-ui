import { Request, Response, NextFunction } from 'express';
import agreementScreenContent from '../../../resources/content/choose-agreement/agreement.json';
import { AgreementDetail } from '../../../common/middlewares/models/agreement-detail';
import { Logger } from '@hmcts/nodejs-logging';
import { logConstant } from '../../../common/logtracer/logConstant';
import { getAgreementLotDetail } from '@common/middlewares/agreementservice/chooseAgreement';
import { getAgreementDetail, setAgreementHeader } from '@common/middlewares/agreementservice/agreementDetailsFetch';

const logger = Logger.getLogger('choose-agreement');

/**
 *
 * @Rediect
 * @endpoint '/oauth/login
 * @param req
 * @param res
 */
export const CHOOSE_AGREEMENT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.session.fca_selected_services = [];
    const agreement_id = req.session.agreement_id;
    const agreementIds = ['RM6187', 'RM1043.8', 'RM1557.13'];

    const agreements = await Promise.all(agreementIds.map(async (agreementId) => getAgreementWithLotDetail(agreementId)));

    const appendData = { data: agreementScreenContent, agreement_id, agreements };

    if (agreement_id) {
      const agreement = agreements.find((agreement) => agreement.number === agreement_id);

      if (agreement) {
        res.locals.selectedAgreement = agreement;
        setAgreementHeader(req, res, agreement);
        res.locals.sortedItems = agreement.lotDetails;
      }
    }

    //CAS-INFO-LOG
    logger.info(logConstant.chooseCommercialLandLog);

    res.render('agreement', appendData);
  } catch(error) {
    next(error);
  }
};

const getAgreementWithLotDetail = async (agreementId: string): Promise<AgreementDetail> => {
  const [agreementDetail, lotDetails] = await Promise.all([getAgreementDetail(agreementId), getAgreementLotDetail(agreementId)]);

  agreementDetail.lotDetails = lotDetails;

  return agreementDetail;
};
