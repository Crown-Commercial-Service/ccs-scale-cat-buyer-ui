import * as path from 'path';
import * as express from 'express';
import * as nunjucks from 'nunjucks';
import {
  dateFilter,
  dateInputFilter,
  dateWithDayAtFrontFilter,
  monthIncrementFilter,
  addDaysFilter,
  dateFilterDDMMYYYY,
  dateFilterDD_MM_YYYY,
  formatTimeHHMM
} from './filters/dateFilter';
import { stringFilter } from './filters/stringFilter';
import { jsonFilter, jsontoStringFilter } from './filters/jsonFilter';
import { InitOptions } from 'i18next';
import { MemoryFormatter } from './filters/memoryformatter';

export class Nunjucks {
  constructor(public developmentMode: boolean, public i18next: any) {
    this.developmentMode = developmentMode;
    this.i18next = i18next;
  }

  enableFor(app: express.Application): void {
    app.set('view engine', 'njk');

    const NunjucksPathFolders = {
      mainViewDirectory: path.join(__dirname, '..', '..', 'views'),
      RFIViewDirectory: path.join(__dirname, '..', '..', 'features', 'rfi', 'views'),
      DASHBOARDViewDirectory: path.join(__dirname, '..', '..', 'features', 'dashboard', 'views'),
      AGREEMENTViewDirectory: path.join(__dirname, '..', '..', 'features', 'agreement', 'views'),
      PROCUREMENTViewDirectory: path.join(__dirname, '..', '..', 'features', 'procurement', 'views'),
      REQUIREMENTViewDirectory: path.join(__dirname, '..', '..', 'features', 'requirements', 'views'),
      COOKIESViewDirectory: path.join(__dirname, '..', '..', 'features', 'cookies', 'views'),
      EOIViewDirectory: path.join(__dirname, '..', '..', 'features', 'eoi', 'views'),
      EVENTMANAGEMENTViewDirectory: path.join(__dirname, '..', '..', 'features', 'event-management', 'views'),
      GCloudViewDirectory: path.join(__dirname, '..', '..', 'features', 'g-cloud', 'views'),

    };

    const NunjucksEnvironment = nunjucks.configure(
      [
        NunjucksPathFolders.mainViewDirectory,
        NunjucksPathFolders.RFIViewDirectory,
        NunjucksPathFolders.DASHBOARDViewDirectory,
        NunjucksPathFolders.AGREEMENTViewDirectory,
        NunjucksPathFolders.PROCUREMENTViewDirectory,
        NunjucksPathFolders.REQUIREMENTViewDirectory,
        NunjucksPathFolders.COOKIESViewDirectory,
        NunjucksPathFolders.EOIViewDirectory,
        NunjucksPathFolders.EVENTMANAGEMENTViewDirectory,
        NunjucksPathFolders.GCloudViewDirectory,
      ],
      {
        autoescape: true,
        watch: this.developmentMode,
        express: app,
      },
    );

    //List of the Nunjucks Environment filters
    NunjucksEnvironment.addGlobal('t', (key: string, options?: InitOptions): string => this.i18next.t(key, options));
    NunjucksEnvironment.addFilter('date', dateFilter);
    NunjucksEnvironment.addFilter('inputDate', dateInputFilter);
    NunjucksEnvironment.addFilter('dateWithDayAtFront', dateWithDayAtFrontFilter);
    NunjucksEnvironment.addFilter('monthIncrement', monthIncrementFilter);
    NunjucksEnvironment.addFilter('addDays', addDaysFilter);
    NunjucksEnvironment.addFilter('json', jsonFilter);
    NunjucksEnvironment.addFilter('stringJson', jsontoStringFilter);
    NunjucksEnvironment.addFilter('string', stringFilter);
    NunjucksEnvironment.addFilter('KbtoMb', MemoryFormatter);
    NunjucksEnvironment.addFilter('dateddmmyyyy',dateFilterDDMMYYYY);
    NunjucksEnvironment.addFilter('datedd_mm_yyyy',dateFilterDD_MM_YYYY);
    NunjucksEnvironment.addFilter('formatTimeHHMM',formatTimeHHMM);
    app.use((req, res, next) => {
      res.locals.pagePath = req.path;
      next();
    });
  }
}
