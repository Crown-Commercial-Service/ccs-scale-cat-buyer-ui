/**
 * @LogMessageFormater
 * used for creating Log Messages
 */

export class LogMessageFormatter {
  uuid: string;
  timestamp: string;
  sessionId: string;
  errorURI: string;
  errorRoot: any;
  exception: any;
  statusCode: any;

  constructor(
    Person_id: any,
    error_location: string,
    session_id: string,
    error_reason: any,
    exception: any,
    statusCode: any,
  ) {
    this.uuid = Person_id;
    this.timestamp = new Date().toUTCString();
    this.sessionId = session_id;
    this.errorURI = error_location;
    this.errorRoot = error_reason;
    this.exception = exception;
    this.statusCode = statusCode;
  }
}
