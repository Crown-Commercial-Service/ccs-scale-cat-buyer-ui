import * as express from 'express';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { logConstant } from '../../../common/logtracer/logConstant';

/**
 *
 * @Rediect
 * @endpoint '/oauth/login
 * @param req
 * @param res
 */

export const Receiver = (req: express.Request, res: express.Response) => {
  //const { url } = req;
  const { supplier_qa_url } = req.session;
  //url.split("?")[1].split('projectId')[1].split('&')[0]
  if (supplier_qa_url != undefined) {
    res.redirect(supplier_qa_url);
  } else {
    //CAS-INFO-LOG
    LoggTracer.infoLogger(null, logConstant.loginSuccess, req);
    res.redirect('/dashboard');
  }
};
