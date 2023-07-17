import { Application } from 'express';

import agreementRoutes from '../../features/agreement/path';
import authRoutes from '../../features/auth/path';
import cookieRoutes from '../../features/cookies/path';
import daRoutes from '../../features/da/path';
import dashboardRoutes from '../../features/dashboard/path';
import eoiRoutes from '../../features/eoi/path';
import eventManagementRoutes from '../../features/event-management/path';
import fcaRoutes from '../../features/fca/path';
import gCloudRoutes from '../../features/g-cloud/path';
import procurementRoutes from '../../features/procurement/path';
import requirementRoutes from '../../features/requirements/path';
import rfiRoutes from '../../features/rfi/path';
import oppertunitiesRoute from '../../features/digital-outcomes/path';

const setupFeatureRoutes = (app: Application) => {
  agreementRoutes(app);
  authRoutes(app);
  cookieRoutes(app);
  daRoutes(app);
  dashboardRoutes(app);
  eoiRoutes(app);
  eventManagementRoutes(app);
  fcaRoutes(app);
  gCloudRoutes(app);
  procurementRoutes(app);
  requirementRoutes(app);
  rfiRoutes(app);
  oppertunitiesRoute(app);
};

export { setupFeatureRoutes };
