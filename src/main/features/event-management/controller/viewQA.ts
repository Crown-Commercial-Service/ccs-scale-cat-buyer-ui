import * as express from 'express';
import { TenderApi } from '../../../common/util/fetch/tenderService/tenderApiInstance';
import { LoggTracer } from '@common/logtracer/tracer';
import { TokenDecoder } from '@common/tokendecoder/tokendecoder';
import * as inboxData from '../../../resources/content/event-management/qa.json';
import * as dos6InboxData from '../../../resources/content/event-management/qa dos6.json';
import { logConstant } from '../../../common/logtracer/logConstant';

/**
 *
 * @Rediect
 * @endpoint /message/sent
 * @param req
 * @param res
 */
export const EVENT_MANAGEMENT_QA_SUPPLIERS = async (req: express.Request, res: express.Response) => {
  let appendData: any;
  let eventIds: any;
  let projectIds: any;
  let isSupplierQA = false;
  let projectId;

  try {
    if (req.query.id != undefined) {
      eventIds = req.query.id;
      projectIds = req.query.prId;
      isSupplierQA = true;
      projectId = req.query.prId;
    } else {
      eventIds = req.session.eventId;
      projectIds = req.session.projectId;
      projectId = req.session.projectId;
      isSupplierQA = false;
      res.locals.agreement_header = req.session.agreement_header;
    }

    const baseURL = `/tenders/supplier/projects/${projectIds}/events/${eventIds}/q-and-a`;
    const fetchData = await TenderApi.InstanceSupplierQA().get(baseURL);
    const data = inboxData;

    const response = fetchData.data;

    const projectName = response.projectName;
    const agreementName = response.agreementName;
    const agreementId_session = response.agreementId;
    const agreementLotName = response.lotName;
    const lotid = response.lotId;

    res.locals.agreement_header = {
      projectName: projectName,
      projectId,
      agreementName,
      agreementIdSession: agreementId_session,
      agreementLotName,
      lotid,
    };

    appendData = {
      data,
      QAs: fetchData.data.QandA.length > 0 ? fetchData.data.QandA : [],
      eventId: eventIds,
      eventType: req.session.eventManagement_eventType,
      eventName: projectName,
      isSupplierQA,
    };

    res.render('viewQA', appendData);
  } catch (error) {
    if (error.response.status === 401) {
      res.redirect('/401');
    } else if (error.response.status === 404) {
      res.redirect('/401');
    } else {
      console.log('error ***************');
      console.log(error);
      res.redirect('/401');
    }
  }
};

export const EVENT_MANAGEMENT_QA_POPUP = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  if (SESSION_ID != undefined) {
    res.redirect('/401');
  }
  const eventId = req.query.id;
  const projectId = req.query.prId;
  const isSupplierQA = true;
  const appendData = { projectId: projectId, eventId: eventId, isSupplierQA };
  res.render('viewQAPopup', appendData);
};
export const EVENT_MANAGEMENT_QA = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const agreementId = req.session.agreement_id;
  let appendData: any;
  let eventIds: any;
  let projectIds: any;

  try {
    // https://dev-ccs-scale-cat-service.london.cloudapps.digital/tenders/projects

    //    console.log("FETCHHEADER",fetchHeaderData[0]);

    //res.locals.agreement_header = headerbaseURL;
    //  res.locals.agreement_header = req.session.agreement_header
    // console.log("res.locals.agreement_header",res.locals.agreement_header)
    // res.locals.agreement_header = fetchHeaderData[0];

    // https://dev-ccs-scale-cat-service.london.cloudapps.digital/tenders/projects/15422/events
    //const baseURL = `/tenders/projects/${req.session.projectId}/events/${req.session.eventId}/q-and-a`;

    let isSupplierQA = false;
    let projectId;

    if (req.query.id != undefined) {
      eventIds = req.query.id;
      projectIds = req.query.prId;
      isSupplierQA = true;
      projectId = req.query.prId;
    } else {
      eventIds = req.session.eventId;
      projectIds = req.session.projectId;
      projectId = req.session.projectId;
      isSupplierQA = false;
      res.locals.agreement_header = req.session.agreement_header;
    }

    const baseURL = `/tenders/projects/${projectIds}/events/${eventIds}/q-and-a`;
    const fetchData = await TenderApi.Instance(SESSION_ID).get(baseURL);

    //CAS-INFO-LOG
    LoggTracer.infoLogger(fetchData, logConstant.getQuestionAndAnsDetails, req);

    let data;
    if (agreementId == 'RM1043.8') {
      //DOS6
      data = dos6InboxData;
    } else {
      data = inboxData;
    }

    const response = fetchData.data;

    const projectName = response.projectName;
    const agreementName = response.agreementName;
    const agreementId_session = response.agreementId;
    const agreementLotName = response.lotName;
    const lotid = response.lotId;

    res.locals.agreement_header = {
      projectName: projectName,
      projectId,
      agreementName,
      agreementIdSession: agreementId_session,
      agreementLotName,
      lotid,
    };

    appendData = {
      data,
      QAs: fetchData.data.QandA.length > 0 ? fetchData.data.QandA : [],
      eventId: eventIds,
      eventType: req.session.eventManagement_eventType,
      eventName: projectName,
      isSupplierQA,
      agreementId,
    };

    //CAS-INFO-LOG
    LoggTracer.infoLogger(null, logConstant.QAViewLogger, req);
    res.render('viewQA', appendData);
  } catch (err) {
    LoggTracer.errorLogger(
      res,
      err,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Q&A page Tenders Service Api cannot be connected',
      true
    );
  }
};

export const EVENT_MANAGEMENT_SUPPLIER_QA = async (req: express.Request, res: express.Response) => {
  const { supplier_qa_url } = req.session;
  const { SESSION_ID } = req.cookies;
  const agreementId = req.session.agreement_id;
  const eventId = supplier_qa_url != undefined ? atob(supplier_qa_url.split('Id=')[1]).split('_')[1] : undefined;
  const projectId = supplier_qa_url != undefined ? atob(supplier_qa_url.split('Id=')[1]).split('_')[0] : undefined;
  let appendData: any;
  try {
    if (eventId != undefined && projectId != undefined) {
      const baseURL = `/tenders/projects/${projectId}/events/${eventId}/q-and-a`;
      const fetchData = await TenderApi.Instance(SESSION_ID).get(baseURL);

      //CAS-INFO-LOG
      LoggTracer.infoLogger(fetchData, logConstant.getQuestionAndAnsDetails, req);
      let data;
      if (agreementId == 'RM1043.8') {
        //DOS6
        data = dos6InboxData;
      } else {
        data = inboxData;
      }

      if (fetchData != undefined && fetchData != null && fetchData.data.QandA?.length > 0) {
        res.locals.agreement_header = {
          projectId: projectId,
          eventId: eventId,
          projectName: fetchData.data.projectName,
          agreementName: fetchData.data.agreementName,
          agreementIdSession: fetchData.data.agreementId,
          agreementLotName: fetchData.data.lotName,
          lotid: fetchData.data.lotId,
        };
        req.session.agreement_header = res.locals.agreement_header;
        appendData = {
          data,
          QAs: fetchData.data.QandA,
          eventId: eventId,
          eventName: req.session.eventManagement_eventType,
          eventType: req.session.eventManagement_eventType,
          isSupplierQA: true,
          agreementId,
        };
      }
    }

    //CAS-INFO-LOG
    LoggTracer.infoLogger(null, logConstant.QAViewLogger, req);
    res.render('viewQA', appendData);
  } catch (err) {
    LoggTracer.errorLogger(
      res,
      err,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Q&A supplier page Tenders Service Api cannot be connected',
      true
    );
  }
};
