import { Project } from '@common/middlewares/models/tendersService/project';

declare module 'express-session' {
  export interface SessionData {
    user: Record<string, any>;
    historicalEvents: Project[];
    openProjectActiveEvents: Project[];
    searchUrlQuery: string[][]
    searchResultsUrl: string
    [key: string]: any;
  }
}

export { };
