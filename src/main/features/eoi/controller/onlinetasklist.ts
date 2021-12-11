//@ts-nocheck
import * as express from 'express';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import fileData from '../../../resources/content/eoi/eoionlineTaskList.json';
import { operations } from '../../../utils/operations/operations';
import { ErrorView } from '../../../common/shared/error/errorView';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';

// eoi TaskList
/**
 *
 * @param req
 * @param res
 * @GETController
 */
export const GET_ONLINE_TASKLIST = async (req: express.Request, res: express.Response) => {
  if (
    operations.isUndefined(req.query, 'agreement_id') ||
    operations.isUndefined(req.query, 'proc_id') ||
    operations.isUndefined(req.query, 'event_id')
  ) {
    res.redirect(ErrorView.notfound);
  } else {
    const { SESSION_ID } = req.cookies;
    try {
      const releatedContent = req.session?.releatedContent; 
      const display_fetch_data = {
        file_data: fileData,
        releatedContent: releatedContent
      };
      res.render('onlinetasklistEoi', display_fetch_data);
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
  }
};
