import { Application } from 'express';

import healthRoutes from '../../routes/health';
import homeRoutes from '../../routes/home';

const setupHomeRoutes = (app: Application) => {
  healthRoutes(app);
  homeRoutes(app);
};

export { setupHomeRoutes };
