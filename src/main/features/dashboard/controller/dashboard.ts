import * as dashboarData from '../../../resources/content/dashboard/ccs-dashboard.json';
import moment from 'moment';
import momentz from 'moment-timezone';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { logConstant } from '../../../common/logtracer/logConstant';
import { EventTypes } from '@common/middlewares/eventManagement/activeEvents';
import { Project } from '@common/middlewares/models/tendersService/project';
import { Request, Response } from 'express';

const renderDashboard = (req: Request, res: Response) => {
  let issetDashBanner = process.env.DASHBOARD_BANNER;

  if (issetDashBanner === undefined || issetDashBanner == 'NULL') {
    issetDashBanner = '';
  }

  //CAS-INFO-LOG
  LoggTracer.infoLogger(null, logConstant.dashLandLog, req);

  req.session.unpublishedeventmanagement = 'false';
  const { closeStatus } = req.query;
  const searchText = req.session.searchText;

  const withOutPaEventsData = req.session.historicalEvents?.filter((project) => {
    return project.activeEvent.eventType !== EventTypes.PA;
  });

  let openProjects: Project[] = [];
  let historicalProjects: Project[] = [];

  if (req.session.openProjectActiveEvents !== undefined) {
    openProjects = req.session.openProjectActiveEvents;
  }
  if (req.session.historicalEvents !== undefined) {
    historicalProjects = req.session.historicalEvents;
  }

  /** Daylight savings */
  openProjects.forEach((project) => {
    if (Object.keys(project.activeEvent.tenderPeriod).length > 0 && momentz(new Date(project.activeEvent.tenderPeriod.endDate)).tz('Europe/London').isDST()) {
      const endDate = project.activeEvent.tenderPeriod.endDate;
      const day = endDate.substring(0, 10);
      const time = endDate.substring(11, 16);
      project.activeEvent.tenderPeriod.endDate = moment(day + '' + time, 'YYYY-MM-DD HH:mm')
        .add(1, 'hours')
        .format('YYYY-MM-DDTHH:mm:ss+00:00');
    }
  });
  /** Daylight savings */

  const appendData = {
    data: dashboarData,
    searchText,
    events: openProjects,
    historicalEvents: historicalProjects,
    withOutPaEventsData: withOutPaEventsData,
    issetDashBanner,
    closeprojectStatus: closeStatus,
  };
  /** CAS-87 */
  req.session.closeProject = false;
  res.render('dashboard', appendData);
};

export { renderDashboard };
