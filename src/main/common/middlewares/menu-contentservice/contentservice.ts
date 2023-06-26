import * as express from 'express';
import FileIOSystem from 'fs';
import config from 'config';
import { operations } from '../../../utils/operations/operations';
import { LoggTracer } from '../../logtracer/tracer';
import { contentService } from 'main/services/contentService';

export class ContentFetchMiddleware {
  static MenuContentFilePath = config.get('contentService.menuDirectory')?.toString();
  static FetchContents: express.Handler = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const allMenuIdentifiersId = ['21', '22', '23', '24', '25'];
      const menuItemsStorage = await Promise.all(allMenuIdentifiersId.map(async (menuId) => {
        const menu = (await contentService.api.getMenu(menuId)).unwrap();  
        const { ID, name } = menu;

        return {
          ID: ID,
          name: name,
          data: menu,
        };
      }));

      FileIOSystem.readFile(ContentFetchMiddleware.MenuContentFilePath, 'utf8', (error: any, savedContentData) => {
        if (error) {
          LoggTracer.errorLogger(
            res,
            error,
            `${req.headers.host}${req.originalUrl}`,
            null,
            null,
            'Menu content service api throw exception',
            true
          );
        }
        const compareData: boolean = operations.equals(savedContentData, JSON.stringify(menuItemsStorage));
        if (compareData) {
          let menu_contents = JSON.parse(savedContentData);
          const primaryContents = menu_contents?.filter((aContent: any) => aContent?.ID == 21)?.[0];
          const secondaryContents = menu_contents?.filter((aContent: any) => aContent?.ID == 22)?.[0];
          const sitemap = menu_contents?.filter((aContent: any) => aContent?.ID == 23)?.[0];
          const quickLink = menu_contents?.filter((aContent: any) => aContent?.ID == 24)?.[0];
          const aboutandcontact = menu_contents?.filter((aContent: any) => aContent?.ID == 25)?.[0];
          menu_contents = { primaryContents, secondaryContents, sitemap, quickLink, aboutandcontact };
          res.locals.menudata = menu_contents;
          next();
        } else {
          FileIOSystem.writeFile(
            ContentFetchMiddleware.MenuContentFilePath,
            JSON.stringify(menuItemsStorage),
            (error: any) => {
              if (error) {
                LoggTracer.errorLogger(
                  res,
                  error,
                  `${req.headers.host}${req.originalUrl}`,
                  null,
                  null,
                  'File System cannot write local menu content json file',
                  true
                );
              }
              let menu_contents = JSON.parse(savedContentData);
              const primaryContents = menu_contents?.filter((aContent: any) => aContent?.ID == 21)?.[0];
              const secondaryContents = menu_contents?.filter((aContent: any) => aContent?.ID == 22)?.[0];
              const sitemap = menu_contents?.filter((aContent: any) => aContent?.ID == 23)?.[0];
              const quickLink = menu_contents?.filter((aContent: any) => aContent?.ID == 24)?.[0];
              const aboutandcontact = menu_contents?.filter((aContent: any) => aContent?.ID == 25)?.[0];
              menu_contents = { primaryContents, secondaryContents, sitemap, quickLink, aboutandcontact };
              res.locals.menudata = menu_contents;
              next();
            }
          );
        }
      });
    } catch (error) {
      FileIOSystem.readFile(ContentFetchMiddleware.MenuContentFilePath, 'utf8', (error: any, savedContentData) => {
        if (error) {
          LoggTracer.errorLogger(
            res,
            error,
            `${req.headers.host}${req.originalUrl}`,
            null,
            null,
            'File System cannot write local menu content json file',
            true
          );
        } else {
          let menu_contents = JSON.parse(savedContentData);
          const primaryContents = menu_contents?.filter((aContent: any) => aContent?.ID == 21)?.[0];
          const secondaryContents = menu_contents?.filter((aContent: any) => aContent?.ID == 22)?.[0];
          const sitemap = menu_contents?.filter((aContent: any) => aContent?.ID == 23)?.[0];
          const quickLink = menu_contents?.filter((aContent: any) => aContent?.ID == 24)?.[0];
          const aboutandcontact = menu_contents?.filter((aContent: any) => aContent?.ID == 25)?.[0];
          menu_contents = { primaryContents, secondaryContents, sitemap, quickLink, aboutandcontact };
          res.locals.menudata = menu_contents;
          next();
        }
      });
      LoggTracer.errorLogger(
        res,
        error,
        `${req.headers.host}${req.originalUrl}`,
        null,
        null,
        'Menu content service api throw exception',
        false
      );
    }
  };
}
