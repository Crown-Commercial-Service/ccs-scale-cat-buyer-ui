import { Application } from 'express';

import healthRoutes from '../../routes/health';
import homeRoutes from '../../routes/home';
import infoRoutes from '../../routes/info';

const setupHomeRoutes = (app: Application) => {
  healthRoutes(app);
  homeRoutes(app);
  infoRoutes(app);
};

export { setupHomeRoutes };
