import * as express from 'express'
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
  console.log('************ Receiver page');
  //const { url } = req;
  const { supplier_qa_url } = req.session
  //url.split("?")[1].split('projectId')[1].split('&')[0]
  if (supplier_qa_url != undefined) {
    console.log('************ Receiver condition 1');
    console.log(supplier_qa_url);
    res.redirect(supplier_qa_url);
  } else {
    console.log('************ Receiver condition 2');
    //CAS-INFO-LOG
    LoggTracer.infoLogger(null, logConstant.loginSuccess, req);
    res.redirect('/dashboard');
  }
}