import express from 'express'
import { cookies } from '../../cookies/cookies'
import { TokenDecoder } from '../../tokendecoder/tokendecoder'
import { LoggTracer } from '../../logtracer/tracer'


export const LogoutPostHandler = (req: express.Request, res: express.Response, SESSION_ID: string, state: string) => {

    req.session.destroy(function (error) {
        LoggTracer.errorLogger(res, error, `${req.headers.host}${req.originalUrl}`, state,
            TokenDecoder.decoder(SESSION_ID), "Something went wrong while destroying the session", true)
    })
    res.clearCookie(cookies.sessionID);
    res.clearCookie(cookies.state);
    res.redirect('/oauth/logout')
}
