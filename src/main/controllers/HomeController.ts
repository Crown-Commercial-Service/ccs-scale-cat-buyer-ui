
import * as express from 'express'

// LandingHandler
export const LandingHandler = (Request : express.Request, Response: express.Response)=> {
   Response.render('home')
}
