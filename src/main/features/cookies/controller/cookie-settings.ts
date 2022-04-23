import * as express from 'express'
import * as cookiesSettingsData from '../../../resources/content/cookies/cookie-settings.json'
const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('Cookies settings page');

export const COOKIES_SETTING_PAGE = (req: express.Request, res: express.Response) => {
    logger.info("Rendering Cookies settings page");
    let appendData = { data: cookiesSettingsData }
    res.render('cookie-settings', appendData);
}
