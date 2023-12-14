import { Application } from 'express';

import healthRoutes from '../../routes/health';
import homeRoutes from '../../routes/home';
import isAliveRoute from '../../routes/isAlive';

const setupHomeRoutes = (app: Application) => {
  healthRoutes(app);
  homeRoutes(app);
  isAliveRoute(app);
};

export { setupHomeRoutes };
