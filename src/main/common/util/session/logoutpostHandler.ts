import express from 'express'
import { cookies } from '../../cookies/cookies'
import { TokenDecoder } from '../../tokendecoder/tokendecoder'
import { LogMessageFormatter } from '../../logtracer/logmessageformatter'
import { LoggTracer } from '../../logtracer/tracer'


export const LogoutPostHandler = (req: express.Request, res: express.Response, SESSION_ID: string, state: string)=> {

    req.session.destroy(function (error) {
        delete error?.config?.['headers'];
        let Logmessage = {
            "Person_email": TokenDecoder.decoder(SESSION_ID),
            "error_location": `${req.headers.host}${req.originalUrl}`,
            "sessionId": state,
            "error_reason": "Something went wrong while destroying the session",
            "exception": error
        }
        let Log = new LogMessageFormatter(
            Logmessage.Person_email,
            Logmessage.error_location,
            Logmessage.sessionId,
            Logmessage.error_reason,
            Logmessage.exception
        )
        LoggTracer.errorTracer(Log, res);
    })
    res.clearCookie(cookies.sessionID);
    res.clearCookie(cookies.state);
    res.redirect('/oauth/logout')

}