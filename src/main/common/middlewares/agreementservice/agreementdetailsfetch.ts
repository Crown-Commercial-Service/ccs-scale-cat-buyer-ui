import { Handler, Request, Response, NextFunction } from 'express';
import { AgreementAPI } from '../../util/fetch/agreementservice/agreementsApiInstance';
import { LoggTracer } from '../../logtracer/tracer';
import { TokenDecoder } from '../../tokendecoder/tokendecoder';
import { Logger } from '@hmcts/nodejs-logging';
const logger = Logger.getLogger('agreementdetailsfetch');
/**
 *
 * @Middleware
 * @param req
 * @param res
 * @param next
 */
export class AgreementDetailsFetchMiddleware {
  static FetchAgreements: Handler = (req: Request, res: Response, next: NextFunction) => {
    const { SESSION_ID, state } = req.cookies;
    const agreementIdSession = req?.session?.agreement_id;
    if (agreementIdSession) {
      const agreementLotName = req?.session?.agreementLotName;
      const lotid = req.session?.lotId;
      const BaseURL = `agreements/${agreementIdSession}`;
      const retrieveAgreementPromise = AgreementAPI.Instance(null).get(BaseURL);
      retrieveAgreementPromise
        .then((data) => {
          const containedData = data?.data;
          logger.info('Feached agreement details from Agreement service API');
          const projectName = req?.session?.project_name;
          const projectId = req?.session?.projectId;

          if (req?.session?.agreementName !== undefined) req.session.agreementName = containedData['name'];

          res.locals.selectedAgreement = containedData;
          const agreementName = req.session?.agreementName;
          res.locals.agreement_header = {
            projectName,
            projectId,
            agreementName,
            agreementIdSession,
            agreementLotName,
            lotid,
          };
          next();
        })
        .catch((error) => {
          LoggTracer.errorLogger(
            res,
            error,
            `${req.headers.host}${req.originalUrl}`,
            state,
            TokenDecoder.decoder(SESSION_ID),
            'Agreement Service Api cannot be connected',
            true
          );
        });
    } else {
      next();
    }
  };
}
