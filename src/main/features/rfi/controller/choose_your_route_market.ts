//@ts-nocheck
import * as express from 'express';
import * as choose_your_route_marketcontent from '../../../resources/content/RFI/choose_your_route_market.json';


/**
 *
 * @Rediect
 * @param req
 * @param res
 *
 *
 */
 export const CHOOSE_YOUR_ROUTE_MARKET = async (req: express.Request, res: express.Response) => {
 
  const agreementName = req.session.agreementName;
  const lotid = req.session?.lotId;
  const project_name = req.session.project_name;
  const agreementId_session = req.session.agreement_id;
  const agreementLotName = req.session.agreementLotName;
  res.locals.agreement_header = { agreementName, project_name, agreementId_session, agreementLotName, lotid };
  const { SESSION_ID } = req.cookies; //jwt
  const { eventId } = req.session;
  
  res.render('choose_your_route_market', {data:choose_your_route_marketcontent});
}
