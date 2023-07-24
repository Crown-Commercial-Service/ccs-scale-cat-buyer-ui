import { Application } from 'express';

import errorRoutes from '../../errors/path';

const setupErrorRoutes = (app: Application) => {
  errorRoutes(app);
};

export { setupErrorRoutes };
