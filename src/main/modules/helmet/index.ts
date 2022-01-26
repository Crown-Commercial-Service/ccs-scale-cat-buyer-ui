import * as express from 'express';
import helmet = require('helmet');

export interface HelmetConfig {
  referrerPolicy: string;
}

const googleAnalyticsDomain = '*.google-analytics.com';
const googleAnalyticsGtm = '*.googletagmanager.com';
const self = "'self'";

/**
 * Module that enables helmet in the application
 */
export class Helmet {
  constructor(public config: HelmetConfig) {}

  public enableFor(app: express.Express): void {
    // include default helmet functions
    app.use(helmet());

    this.setContentSecurityPolicy(app);
    this.setReferrerPolicy(app, this.config.referrerPolicy);
  }

  private setContentSecurityPolicy(app: express.Express): void {
    app.use(
      helmet.contentSecurityPolicy({
        directives: {
          connectSrc: [self, googleAnalyticsDomain, 'https://stats.g.doubleclick.net'],
          defaultSrc: ["'none'"],
          fontSrc: [self, 'data:'],
          imgSrc: [self, googleAnalyticsDomain, googleAnalyticsGtm],
          objectSrc: [self],
          scriptSrc: [self,'https://snap.licdn.com', googleAnalyticsDomain, "'sha256-+6WnXIl4mbFTCARd8N3COQmT3bJJmo32N8q8ZSQAIcU='", "'sha256-yJD+OaJ97T/y5QHr3Se9W0AW2baOVjc1FR3Na10Ih+Y='","'sha256-Zk3m64g3XkpEOa4ilYFv4J6vnDXIEsOJMYonokV/R6E='", "'sha256-zEF/ALwwDYV2nZ+rdYGh2XpjU1lbO3oZ2osZayOlmpw='", googleAnalyticsGtm, "'sha256-xB3p3jeZFuTiApvSQLM9BrzAfwNP7gzCnJPZ4VRVpCw='"],
          styleSrc: [self],
        },
      }),
    );
  }

  private setReferrerPolicy(app: express.Express, policy: string): void {
    if (!policy) {
      throw new Error('Referrer policy configuration is required');
    }

    app.use(helmet.referrerPolicy({ policy }));
  }
}
