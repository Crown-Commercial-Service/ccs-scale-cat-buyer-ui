/**
 * @LogMessageFormater
 * used for creating Log Messages
 */

export class LogMessageFormatter {

    email: string;
    timestamp : string;
    sessionId : string;
    errorURI : string ;
    errorRoot : any ;
    exception : any;

    constructor(Person_email: any, error_location: string, session_id: string,  error_reason: any, exception: any){
        this.email = Person_email;
        this.timestamp = (new Date()).toUTCString();
        this.sessionId = session_id;
        this.errorURI = error_location;
        this.errorRoot = error_reason;
        this.exception = exception;        
    }
}