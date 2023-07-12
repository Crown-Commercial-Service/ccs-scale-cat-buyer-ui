import * as express from 'express';
import { TenderApi } from '../../../common/util/fetch/tenderService/tenderApiInstance';

import * as inboxData from '../../../resources/content/event-management/qa.json';

export const GET_OPPORTUNITIES_QA = async (req: express.Request, res: express.Response) => {
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

    //const baseURL = `/tenders/supplier/projects/${projectIds}/events/${eventIds}/q-and-a`;
    //const fetchData = await TenderApi.InstanceSupplierQA().get(baseURL);
    const data = inboxData;

    const eventTypeURL = `/tenders/projects/${projectIds}?group=qa`;

    const getOppertunitiesData = await TenderApi.InstanceSupplierQA().get(eventTypeURL);
    const getOppertunities = getOppertunitiesData?.data;

    appendData = {
      tender: getOppertunities.records[0].compiledRelease.tender,
      lot: getOppertunities.records[0].compiledRelease.tender.lots[0].id,
      data,
      projectId: projectId,
      //QAs: fetchData.data.QandA.length > 0 ? fetchData.data.QandA : [],
      QAs:
        getOppertunities.records[0].compiledRelease.tender?.enquiries?.length > 0
          ? getOppertunities.records[0].compiledRelease.tender?.enquiries
          : [],

      eventId: eventIds,
      // eventType: req.session.eventManagement_eventType,
      //  eventName: projectName,
      isSupplierQA,
    };

    res.render('viewQAList', appendData);
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
