import * as express from 'express'
import { contentAPI } from '../../util/fetch/contentservice/contentApiInstance'
import FileIOSystem from 'fs'
import config from 'config'
import { operations } from '../../../utils/operations/operations'
import { LoggTracer } from '../../logtracer/tracer'

/**
 * 
 * @Middleware
 * @param req 
 * @param res 
 * @param next 
 */

type menuFetchItems = {
    ID?: string,
    name?: string,
    data: any
}
export class ContentFetchMiddleware {

    static MenuContentFilePath = config.get('contentService.menuDirectory')?.toString();
    static FetchContents: express.Handler = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            let allMenuIdentifiersId = ['21', '22', '23', '24', '25']
            let menuItemsStorage: Array<any> = [];
            for (let menuId of allMenuIdentifiersId) {
                let BaseURL = `/wp-json/wp-api-menus/v2/menus/${menuId}`;
                let newInstance = contentAPI.Instance;
                newInstance.defaults.timeout = Number(config.get('settings.fetch-timelimit'));
                let fetchMenuItems = await newInstance.get(BaseURL);
                let { ID, name }: menuFetchItems = fetchMenuItems?.data;
                let reformedObject = {
                    "ID": ID,
                    "name": name,
                    "data": fetchMenuItems?.data
                }
                menuItemsStorage.push(reformedObject);
            }
            FileIOSystem.readFile(ContentFetchMiddleware.MenuContentFilePath, "utf8", (error: any, savedContentData) => {
                if (error) {
                    LoggTracer.errorLogger(res, error, `${req.headers.host}${req.originalUrl}`, null,
                        null, "Menu content service api throw exception", true)
                }
                let compareData: boolean = operations.equals(savedContentData, JSON.stringify(menuItemsStorage));
                if (compareData) {
                    let menu_contents = JSON.parse(savedContentData);
                    let primaryContents = menu_contents?.filter((aContent: any) => aContent?.ID == 21)?.[0];
                    let secondaryContents = menu_contents?.filter((aContent: any) => aContent?.ID == 22)?.[0];
                    let sitemap = menu_contents?.filter((aContent: any) => aContent?.ID == 23)?.[0];
                    let quickLink = menu_contents?.filter((aContent: any) => aContent?.ID == 24)?.[0];
                    let aboutandcontact = menu_contents?.filter((aContent: any) => aContent?.ID == 25)?.[0];
                    menu_contents = { primaryContents, secondaryContents, sitemap, quickLink, aboutandcontact };
                    res.locals.menudata = menu_contents;
                    next();
                } else {
                    FileIOSystem.writeFile(ContentFetchMiddleware.MenuContentFilePath, JSON.stringify(menuItemsStorage), (error: any) => {
                        if (error) {
                            LoggTracer.errorLogger(res, error, `${req.headers.host}${req.originalUrl}`, null,
                                null, "File System cannot write local menu content json file", true)
                        }
                        let menu_contents = JSON.parse(savedContentData);
                        let primaryContents = menu_contents?.filter((aContent: any) => aContent?.ID == 21)?.[0];
                        let secondaryContents = menu_contents?.filter((aContent: any) => aContent?.ID == 22)?.[0];
                        let sitemap = menu_contents?.filter((aContent: any) => aContent?.ID == 23)?.[0];
                        let quickLink = menu_contents?.filter((aContent: any) => aContent?.ID == 24)?.[0];
                        let aboutandcontact = menu_contents?.filter((aContent: any) => aContent?.ID == 25)?.[0];
                        menu_contents = { primaryContents, secondaryContents, sitemap, quickLink, aboutandcontact };
                        res.locals.menudata = menu_contents;
                        next();

                    })
                }
            });
        } catch (error) {
            FileIOSystem.readFile(ContentFetchMiddleware.MenuContentFilePath, "utf8", (error: any, savedContentData) => {
                if (error) {
                    LoggTracer.errorLogger(res, error, `${req.headers.host}${req.originalUrl}`, null,
                        null, "File System cannot write local menu content json file", true)
                }
                else {
                    let menu_contents = JSON.parse(savedContentData);
                    let primaryContents = menu_contents?.filter((aContent: any) => aContent?.ID == 21)?.[0];
                    let secondaryContents = menu_contents?.filter((aContent: any) => aContent?.ID == 22)?.[0];
                    let sitemap = menu_contents?.filter((aContent: any) => aContent?.ID == 23)?.[0];
                    let quickLink = menu_contents?.filter((aContent: any) => aContent?.ID == 24)?.[0];
                    let aboutandcontact = menu_contents?.filter((aContent: any) => aContent?.ID == 25)?.[0];
                    menu_contents = { primaryContents, secondaryContents, sitemap, quickLink, aboutandcontact };
                    res.locals.menudata = menu_contents;
                    next();
                }
            })
            LoggTracer.errorLogger(res, error, `${req.headers.host}${req.originalUrl}`, null,
                null, "Menu content service api throw exception", false)
        }
    }
}