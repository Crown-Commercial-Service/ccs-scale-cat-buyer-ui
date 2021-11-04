import * as express from 'express'
import {contentAPI} from '../../util/fetch/contentservice/contentapiInstance'
//import HeaderAndFooterFile from '../../../resources/menucontent/content.json'
import FileIOSystem from 'fs'
import config from 'config'
import {operations} from '../../../utils/operations/operations'
import { LogMessageFormatter } from '../../logtracer/logmessageformatter'
import { LoggTracer } from '../../logtracer/tracer'
import { LoggerInstance } from '../../util/fetch/logger/loggerInstance'

/**
 * 
 * @Middleware
 * @param req 
 * @param res 
 * @param next 
 */

type menuFetchItems = {
    ID? : string,
    name? : string,
    data : any
}
export class ContentFetchMiddleware {

    static MenuContentFilePath = config.get('contentService.menuDirectory')?.toString();
    static FetchContents : express.Handler = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            let allMenuIdentifiersId = ['21', '22', '23', '24', '25']
            let menuItemsStorage: Array<any> = [];
            for(let menuId of allMenuIdentifiersId){
                let BaseURL = `/wp-json/wp-api-menus/v2/menus/${menuId}`;
                let fetchMenuItems = await contentAPI.Instance.get(BaseURL);
                let {ID, name} : menuFetchItems  = fetchMenuItems?.data;
                let reformedObject = {
                    "ID": ID,
                    "name": name,
                    "data":  fetchMenuItems?.data
                }
                menuItemsStorage.push(reformedObject);
            }
            FileIOSystem.readFile(ContentFetchMiddleware.MenuContentFilePath, "utf8", (error: any, savedContentData) => {
            if (error) {

                delete error?.config?.['headers'];
                let Logmessage = {
                    "Person_email": "null",
                    "error_location": `${req.headers.host}${req.originalUrl}`,
                    "sessionId": "null",
                    "error_reason": "Menu content service api throw exception",
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
            }
            let compareData : boolean = operations.equals(JSON.parse(savedContentData)?.toString(), menuItemsStorage?.toString());
            if(compareData){
                         let menu_contents = JSON.parse(savedContentData);
                         let primaryContents = menu_contents?.filter((aContent: any )=> aContent?.ID == 21)?.[0];
                        let secondaryContents = menu_contents?.filter((aContent: any )=> aContent?.ID == 22)?.[0];
                        let sitemap = menu_contents?.filter((aContent: any )=> aContent?.ID == 23)?.[0];
                        let quickLink = menu_contents?.filter((aContent: any )=> aContent?.ID == 24)?.[0];
                        let aboutandcontact = menu_contents?.filter((aContent: any )=> aContent?.ID == 25)?.[0];
                        menu_contents = {primaryContents, secondaryContents,sitemap,quickLink, aboutandcontact};
                        res.locals.menudata = menu_contents ;
                         next();
            }else{
                FileIOSystem.writeFile(ContentFetchMiddleware.MenuContentFilePath, JSON.stringify(menuItemsStorage), (error: any) => {
                    if (error) {
                        delete error?.config?.['headers'];
                        let Logmessage = {
                            "Person_email": "null",
                            "error_location": `${req.headers.host}${req.originalUrl}`,
                            "sessionId": "null",
                            "error_reason": "File System cannot write local menu content json file",
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
                    } else {
                        let menu_contents = JSON.parse(savedContentData);
                        let primaryContents = menu_contents?.filter((aContent: any )=> aContent?.ID == 21)?.[0];
                       let secondaryContents = menu_contents?.filter((aContent: any )=> aContent?.ID == 22)?.[0];
                       let sitemap = menu_contents?.filter((aContent: any )=> aContent?.ID == 23)?.[0];
                       let quickLink = menu_contents?.filter((aContent: any )=> aContent?.ID == 24)?.[0];
                       let aboutandcontact = menu_contents?.filter((aContent: any )=> aContent?.ID == 25)?.[0];
                       menu_contents = {primaryContents, secondaryContents,sitemap,quickLink, aboutandcontact};
                       res.locals.menudata = menu_contents ;
                        next();
                    }
                })
                }                
              });
        } catch (error) {
            delete error?.config?.['headers'];
            let Logmessage = {
                "Person_email": "null",
                "error_location": `${req.headers.host}${req.originalUrl}`,
                "sessionId": "null",
                "error_reason": "Menu content service api throw exception",
                "exception": error
            }
            let Log = new LogMessageFormatter(
                Logmessage.Person_email,
                Logmessage.error_location,
                Logmessage.sessionId,
                Logmessage.error_reason,
                Logmessage.exception
            )
            let LogMessage ={"AppName": "CaT frontend","type":"error","errordetails": Log }
            await LoggerInstance.Instance.post('', LogMessage);
             FileIOSystem.readFile(ContentFetchMiddleware.MenuContentFilePath, "utf8", (error: any, savedContentData) => {
                if (error) {
                    delete error?.config?.['headers'];
                    let Logmessage = {
                        "Person_email": "null",
                        "error_location": `${req.headers.host}${req.originalUrl}`,
                        "sessionId": "null",
                        "error_reason": "File System cannot read local menu content json file",
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
                }
                else{
                        let menu_contents = JSON.parse(savedContentData);
                        let primaryContents = menu_contents?.filter((aContent: any )=> aContent?.ID == 21)?.[0];
                        let secondaryContents = menu_contents?.filter((aContent: any )=> aContent?.ID == 22)?.[0];
                        let sitemap = menu_contents?.filter((aContent: any )=> aContent?.ID == 23)?.[0];
                        let quickLink = menu_contents?.filter((aContent: any )=> aContent?.ID == 24)?.[0];
                        let aboutandcontact = menu_contents?.filter((aContent: any )=> aContent?.ID == 25)?.[0];
                        menu_contents = {primaryContents, secondaryContents,sitemap,quickLink, aboutandcontact};
                        res.locals.menudata = menu_contents ;
                        next();
                }
            })
        }




           
            
           
        
    }
}