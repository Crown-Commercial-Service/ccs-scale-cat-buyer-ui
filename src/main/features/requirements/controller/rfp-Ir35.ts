//@ts-nocheck
import * as express from 'express';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';

export const RFP_GET_I35: express.Handler = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId, eventId, releatedContent } = req.session;

  try {
    const IR35Dataset = {
      id: 'Criterion 3',
      group_id: 'Group 2',
      question: 'Question 1',
    };

    const BaseURL = `/tenders/projects/${projectId}/events/${eventId}/criteria/${IR35Dataset.id}/groups/${IR35Dataset.group_id}/questions`;

    const Response = await TenderApi.Instance(SESSION_ID).get(BaseURL);
    const ResponseData = Response.data;

    const windowAppendData = {
      apiData: ResponseData,
      releatedContent,
    };
    res.render('rfp-ir35.njk', windowAppendData);
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'IR35 FC - Tenders Service Api cannot be connected',
      true,
    );
  }
};

export const RFP_POST_I35: express.Handler = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId, eventId } = req.session;
  const { rfp_acknowledgement } = req.body;

  try {
    const IR35Dataset = {
      id: 'Criterion 3',
      group_id: 'Group 2',
      question_id: 'Question 1',
    };

    const BaseURL = `/tenders/projects/${projectId}/events/${eventId}/criteria/${IR35Dataset.id}/groups/${IR35Dataset.group_id}/questions/${IR35Dataset.question_id}`;

    const REQUESTBODY = {
      nonOCDS: {
        answered: true,
        options: [
          {
            value: rfp_acknowledgement,
            selected: true,
          },
        ],
      },
    };

    await TenderApi.Instance(SESSION_ID).put(BaseURL, REQUESTBODY);
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/31`, 'Completed');
    res.redirect('/rfp/task-list');
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Tenders Service Api cannot be connected',
      true,
    );
  }
};
