import path from 'path';
import nunjucks from 'nunjucks';
import i18next, { TOptionsBase, InitOptions } from 'i18next';
import { Application, NextFunction, Request, Response } from 'express';
import {
  dateFilter,
  dateInputFilter,
  dateWithDayAtFrontFilter,
  monthIncrementFilter,
  addDaysFilter,
  dateFilterDDMMYYYY,
  dateFilterHHMMDDMMYYYY,
  dateFilterDD_MM_YYYY,
  dateFilterDDMMYYYYHHMM,
} from './filters/dateFilter';
import { stringFilter } from './filters/stringFilter';
import { jsonFilter, jsontoStringFilter } from './filters/jsonFilter';
import { MemoryFormatter } from './filters/memoryformatter';

const initNunjucks = (app: Application, isDev: boolean): void => {
  const nunjucksViews: string[] = [
    path.join(__dirname, '..', '..', 'views'),
    path.join(__dirname, '..', '..', 'features', 'rfi', 'views'),
    path.join(__dirname, '..', '..', 'features', 'dashboard', 'views'),
    path.join(__dirname, '..', '..', 'features', 'agreement', 'views'),
    path.join(__dirname, '..', '..', 'features', 'procurement', 'views'),
    path.join(__dirname, '..', '..', 'features', 'requirements', 'views'),
    path.join(__dirname, '..', '..', 'features', 'cookies', 'views'),
    path.join(__dirname, '..', '..', 'features', 'eoi', 'views'),
    path.join(__dirname, '..', '..', 'features', 'event-management', 'views'),
    path.join(__dirname, '..', '..', 'features', 'fca', 'views'),
    path.join(__dirname, '..', '..', 'features', 'da', 'views'),
    path.join(__dirname, '..', '..', 'features', 'g-cloud', 'views'),
    path.join(__dirname, '..', '..', 'features', 'digital-outcomes', 'views'),
  ];

  app.set('view engine', 'njk');

  const nunjucksEnv = nunjucks.configure(nunjucksViews, {
    autoescape: true,
    watch: isDev,
    express: app,
  });

  // Set nunjucks globals
  nunjucksEnv.addGlobal('t', (key: string, options?: TOptionsBase & InitOptions): string => i18next.t(key, options));

  // Set nunjucks filters
  nunjucksEnv.addFilter('date', dateFilter);
  nunjucksEnv.addFilter('inputDate', dateInputFilter);
  nunjucksEnv.addFilter('dateWithDayAtFront', dateWithDayAtFrontFilter);
  nunjucksEnv.addFilter('monthIncrement', monthIncrementFilter);
  nunjucksEnv.addFilter('addDays', addDaysFilter);
  nunjucksEnv.addFilter('json', jsonFilter);
  nunjucksEnv.addFilter('stringJson', jsontoStringFilter);
  nunjucksEnv.addFilter('string', stringFilter);
  nunjucksEnv.addFilter('KbtoMb', MemoryFormatter);
  nunjucksEnv.addFilter('dateddmmyyyy', dateFilterDDMMYYYY);
  nunjucksEnv.addFilter('timedateddmmyyyy', dateFilterHHMMDDMMYYYY);
  nunjucksEnv.addFilter('datedd_mm_yyyy', dateFilterDD_MM_YYYY);
  nunjucksEnv.addFilter('datedd_mm_yyyyhhmm', dateFilterDDMMYYYYHHMM);

  // Middleware to expose the request path to the response locals
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.locals.pagePath = req.path;

    next();
  });
};

export { initNunjucks };
