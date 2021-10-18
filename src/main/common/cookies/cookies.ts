import config from 'config'


export  class cookies {
    static sessionID: string = config.get('cookies.sessionid');
    static state : string = config.get('cookies.state');
}