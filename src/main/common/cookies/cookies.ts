import config from 'config'


export class cookies {
    static sessionID: string = config.get('cookies.sessionid');
    static state: string = config.get('cookies.state');
    static lotNum: string = config.get('cookies.lotNum');
    static agreement_id: string = config.get('cookies.agreement_id');
}