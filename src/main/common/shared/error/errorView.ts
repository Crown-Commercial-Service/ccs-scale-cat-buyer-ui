import config from 'config'

export class ErrorView {
    public static notfound : string = config.get('pages.error.404');
    public static internalServer : string = config.get('pages.error.500')
}