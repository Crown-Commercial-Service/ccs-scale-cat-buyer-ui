import { Application } from 'express';
import helmet from 'helmet';

interface HelmetConfig {
  referrerPolicy: string;
}

const googleAnalyticsDomain = '*.google-analytics.com';
const googleAnalyticsGtm = '*.googletagmanager.com';
const self = '\'self\'';

const setContentSecurityPolicy = (app: Application): void => {
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        connectSrc: [self, googleAnalyticsDomain, 'https://stats.g.doubleclick.net'],
        defaultSrc: ['\'none\''],
        fontSrc: [self, 'data:'],
        imgSrc: [self, googleAnalyticsDomain, googleAnalyticsGtm],
        objectSrc: [self],
        scriptSrc: [self,'https://snap.licdn.com', googleAnalyticsDomain, '\'sha256-+6WnXIl4mbFTCARd8N3COQmT3bJJmo32N8q8ZSQAIcU=\'', '\'sha256-yJD+OaJ97T/y5QHr3Se9W0AW2baOVjc1FR3Na10Ih+Y=\'','\'sha256-Zk3m64g3XkpEOa4ilYFv4J6vnDXIEsOJMYonokV/R6E=\'', '\'sha256-zEF/ALwwDYV2nZ+rdYGh2XpjU1lbO3oZ2osZayOlmpw=\'', googleAnalyticsGtm, '\'sha256-xB3p3jeZFuTiApvSQLM9BrzAfwNP7gzCnJPZ4VRVpCw=\''],
        styleSrc: [self],
      },
    }),
  );
};

const setReferrerPolicy = (app: Application, policy: string): void => {
  if (!policy) {
    throw new Error('Referrer policy configuration is required');
  }

  app.use(helmet.referrerPolicy({ policy }));
};

const initHelmet = (app: Application, config: HelmetConfig): void => {
  app.use(helmet());

  setContentSecurityPolicy(app);
  setReferrerPolicy(app, config.referrerPolicy);
};

export { initHelmet };
