import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { AgreementAPI } from './../../../common/util/fetch/agreementservice/agreementsApiInstance';
import * as express from 'express'
import * as data from '../../../resources/content/procurement/ccs-procurement.json';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('procurement');

/**
 * 
 * @Rediect 
 * @param req 
 * @param res 
 * 
 * 
 */
export const PROCUREMENT = async (req: express.Request, res: express.Response) => {
  const { lotId, agreementLotName } = req.query;

  var { SESSION_ID } = req.cookies;
  const agreementId_session = req.session.agreement_id;
  const lotsURL = `/tenders/projects/agreements`;
  const eventTypesURL = `agreements/${agreementId_session}/lots/${lotId}/event-types`;
  let appendData: any = { ...data, SESSION_ID };
  try {
    const { data: typesRaw } = await AgreementAPI.Instance.get(eventTypesURL);
    const types = typesRaw.map((typeRaw: any) => typeRaw.type);
    appendData = { types, ...appendData };

    const elementCached = req.session.procurements.find((proc: any) => proc.defaultName.components.lotId === lotId);
    let procurement;
    if (!elementCached) {
      const _body = {
        "agreementId": agreementId_session,
        "lotId": lotId
      }
      const { data: procurementRaw } = await TenderApi.Instance(SESSION_ID).post(lotsURL, _body);
      procurement = procurementRaw;
      req.session.procurements.push(procurement);
    }
    else {
      procurement = elementCached;
    }
    logger.info('procurement.created', procurement)
    req.session.lotId = procurement['defaultName']['components']['lotId'];
    req.session.project_name = procurement['defaultName']['name'];
      req.session.projectId = procurement['procurementID'];
    req.session.eventId = procurement['eventId'];
    req.session.types = types;
    req.session.agreementLotName = agreementLotName;
    const eventType = req.session.lotId;
    req.session.eventType = types[eventType];
    const agreementName = req.session.agreementName; //udefined

    const lotid = req.session?.lotId;

    const project_name = req.session.project_name;

    res.locals.agreement_header = { agreementName, project_name, agreementId_session, agreementLotName, lotid }
    appendData = { ...appendData, agreementName };
    res.render('procurement', appendData);
  } catch (error) {
    LoggTracer.errorLogger(res, error, `${req.headers.host}${req.originalUrl}`, null,
      TokenDecoder.decoder(SESSION_ID), "Tender agreement failed to be added", true)
  }
}