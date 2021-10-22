

export class LogMessageFormatter {

    email: string;
    timestamp : string
    where : any ;
    what : any ;
    result : any;

    constructor(Person_email: any, error_location: any, error_reason: any, exception: any  ){
        this.email = Person_email;
        this.timestamp = (new Date()).toUTCString();
        this.where = error_location,
        this.what = error_reason,
        this.result = exception
    }

  //  who (username) , when (timestamp) , where (context, servletorpage,database) , what (command / API calls ….) , result (exception)

}