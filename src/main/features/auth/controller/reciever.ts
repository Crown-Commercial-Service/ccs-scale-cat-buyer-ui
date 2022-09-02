import * as express from 'express'


/**
 * 
 * @Rediect 
 * @endpoint '/oauth/login
 * @param req 
 * @param res 
 */
export const Receiver = (req: express.Request, res: express.Response) => {
  //const { url } = req;
  const { supplier_qa_url } = req.session["supplier_qa_url"]
  //url.split("?")[1].split('projectId')[1].split('&')[0]
  if (supplier_qa_url != undefined) {
    res.redirect(supplier_qa_url);
  } else
    res.redirect('/dashboard');
}