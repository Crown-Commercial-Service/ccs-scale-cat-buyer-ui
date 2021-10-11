import * as express from 'express'

// OAUTH Loging
export const OAUTH_LOGIN = (req : express.Request, res : express.Response)=> {
   res.render('login'); 
}