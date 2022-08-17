import * as express from 'express'
import * as agreementScreenContent from '../../../resources/content/choose-agreement/agreement.json'
import { AgreementAPI } from '../../../common/util/fetch/agreementservice/agreementsApiInstance'
import { sortObject } from '../../../common/util/operators/sortObject'
import { LotDetail } from '../../../common/middlewares/models/lot-detail'
import { AgreementDetail } from '../../../common/middlewares/models/agreement-detail'
const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('choose-agreement')
import { LoggTracer } from '../../../common/logtracer/tracer'
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';

/**
 * 
 * @Rediect 
 * @endpoint '/oauth/login
 * @param req 
 * @param res 
 */
export const CHOOSE_AGREEMENT = async (req: express.Request, res: express.Response) => {
  const agreement_id = req.session.agreement_id
  
  // If we need to get MCF agreement include the id in below line : getAgreements(['RM6263', 'RM6187'], req, res)
  const agreements = await getAgreements(['RM6263'], req, res)
  const appendData = { data: agreementScreenContent, agreement_id, agreements }
  res.render('agreement', appendData)
}

async function getAgreements(agreements: string[], req: express.Request, res: express.Response): Promise<object> {
  const { SESSION_ID, state } = req.cookies
  const draftAgreementDetails: AgreementDetail[] = []
  try {
    for (let i = 0; i < agreements.length; i++) {
      const agreement = agreements[i]
      // POST MVP this base URL needs to be changed to GET /agreements to retrieve active agreements applicable for the CAS
      const BaseURL = `agreements/${agreement}`
      const LotBaseURL = `agreements/${agreement}/lots`
      const retrieveAgreementPromise = await AgreementAPI.Instance.get(BaseURL);
      logger.info("Feached agreement details from Agreement service API")
      draftAgreementDetails[i] = retrieveAgreementPromise?.data

      const retrieveLotPromise = await AgreementAPI.Instance.get(LotBaseURL);
      logger.info("Feached Lot details from Agreement service API")

      const draft: LotDetail[] = retrieveLotPromise?.data
      // getting supplier count for the lot
      for (const lot of draft) {
        const BaseUrlAgreementSuppliers = `/agreements/${agreement}/lots/${lot.number}/suppliers`
        const { data: retrieveAgreementSuppliers } = await AgreementAPI.Instance.get(BaseUrlAgreementSuppliers)
        lot.suppliers = retrieveAgreementSuppliers.length + " suppliers"
      }

      draftAgreementDetails[i].lotDetails = sortObject.sort_by(draft, "number", true) 
    }

  } catch (error) {
    if (error.response?.status == 404) {
      logger.info(error.response.data.errors[0].detail)
    } else {
      LoggTracer.errorLogger(res, error, `${req.headers.host}${req.originalUrl}`, state,
        TokenDecoder.decoder(SESSION_ID), "Agreement Service Api cannot be connected", true)
    }
  }
  return draftAgreementDetails
}