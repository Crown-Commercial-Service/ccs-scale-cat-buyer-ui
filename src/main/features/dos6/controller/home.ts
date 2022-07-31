import * as express from 'express'
// import * as localContent from '../../../resources/content/event-management/event-management.json'
import { LoggTracer } from '../../../common/logtracer/tracer'
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder'


export const DOS6_GET_HOME = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;

  try {
    res.render("homedos6",{})
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'DOS6',
      true,
    );
  }
  //
}


