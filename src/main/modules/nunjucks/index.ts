import * as path from 'path';
import * as express from 'express';
import * as nunjucks from 'nunjucks';
import {dateFilter, dateInputFilter, dateWithDayAtFrontFilter, monthIncrementFilter, addDaysFilter} from './filters/dateFilter'
import {stringFilter } from './filters/stringFilter'
import {jsonFilter, jsontoStringFilter} from './filters/jsonFilter'
import { InitOptions } from 'i18next'

export class Nunjucks {


  constructor(public developmentMode: boolean, public i18next : any) {
    this.developmentMode = developmentMode;
    this.i18next = i18next;
  }

  
  enableFor(app: express.Application): void {
    
    app.set('view engine', 'njk');

    const NunjucksPathFolders = {
      mainViewDirectory : path.join(__dirname, '..', '..', 'views'),
      RFIViewDirectory : path.join(__dirname, '..', '..','features', 'rfi', 'views'),
      DASHBOARDViewDirectory : path.join(__dirname, '..', '..','features', 'dashboard', 'views'),
      AGREEMENTViewDirectory : path.join(__dirname, '..', '..','features', 'agreement', 'views')
    }

    

    var NunjucksEnvironment =  nunjucks.configure(
      [
        NunjucksPathFolders.mainViewDirectory,
        NunjucksPathFolders.RFIViewDirectory,
        NunjucksPathFolders.DASHBOARDViewDirectory,
        NunjucksPathFolders.AGREEMENTViewDirectory
      ],
      {
        autoescape: true,
        watch: this.developmentMode,
        express: app,
      },
    );


    //List of the Nunjucks Environment filters 
    NunjucksEnvironment.addGlobal('t', (key: string, options?: InitOptions): string => this.i18next.t(key, options))
    NunjucksEnvironment.addFilter('date', dateFilter)
    NunjucksEnvironment.addFilter('inputDate', dateInputFilter);
    NunjucksEnvironment.addFilter('dateWithDayAtFront', dateWithDayAtFrontFilter)   
    NunjucksEnvironment.addFilter('monthIncrement', monthIncrementFilter)
    NunjucksEnvironment.addFilter('addDays', addDaysFilter)
    NunjucksEnvironment.addFilter('json', jsonFilter)
    NunjucksEnvironment.addFilter('stringJson', jsontoStringFilter)
    NunjucksEnvironment.addFilter('string', stringFilter)
    app.use((req, res, next) => {
      res.locals.pagePath = req.path;
      next();
    });
  }
  


}

