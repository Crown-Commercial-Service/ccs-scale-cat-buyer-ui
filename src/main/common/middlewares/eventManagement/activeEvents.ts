import { TokenDecoder } from '../../tokendecoder/tokendecoder';
import { LoggTracer } from '../../logtracer/tracer';
import { tendersService } from 'main/services/tendersService';
import { Project } from '../models/tendersService/project';
import { Request, Response, NextFunction } from 'express';
import { DashboardPaths } from 'main/features/dashboard/model/dashboardConstants';
import { objectSet } from '@utils/objectSet';
import { EventDashboardStatus, EventStatus, EventTypes } from '../models/tendersService/event';

enum EventGroup {
  OPEN,
  HISTORICAL,
  UNKNOWN
}

type EventResult = {
  project?: Project,
  group: EventGroup
}

const getProjectEvents = async (accessToken: string, project: Project): Promise<EventResult[]> => {
  const events = (await tendersService.api.events.getEvents(accessToken, String(project.projectId))).unwrap();

  return events.map((event): EventResult => {
    if (event === undefined) {
      return {
        group: EventGroup.UNKNOWN
      };
    }

    let group = EventGroup.UNKNOWN;

    if (event.status !== undefined && (event.eventType === EventTypes.RFI || event.eventType === EventTypes.EOI)) {
      switch (event.dashboardStatus) {
        case EventDashboardStatus.COMPLETE:
        case EventDashboardStatus.CLOSED:
          group = EventGroup.HISTORICAL;
          break;
        case EventDashboardStatus.UNKNOWN:
          if (event.status === EventStatus.WITHDRAWN) {
            group = EventGroup.HISTORICAL;
          }
          break;
        case EventDashboardStatus.IN_PROGRESS:
          event.status = EventStatus.IN_PROGRESS;
          group = EventGroup.OPEN;
          break;
        case EventDashboardStatus.PUBLISHED:
          event.status = EventStatus.PUBLISHED;
          group = EventGroup.OPEN;
          break;
        case EventDashboardStatus.TO_BE_EVALUATED:
          event.status = EventStatus.TO_BE_EVALUATED;
          group = EventGroup.OPEN;
          break;
        case EventDashboardStatus.EVALUATING:
          event.status = EventStatus.EVALUATING;
          group = EventGroup.OPEN;
          break;
        case EventDashboardStatus.EVALUATED:
          event.status = EventStatus.EVALUATED;
          group = EventGroup.OPEN;
          break;
        case EventDashboardStatus.PRE_AWARD:
          event.status = EventStatus.PRE_AWARD;
          group = EventGroup.OPEN;
          break;
        case EventDashboardStatus.AWARDED:
          event.status = EventStatus.AWARDED;
          group = EventGroup.OPEN;
          break;
        default:
          group = EventGroup.OPEN;
      }
    } else if (event.eventType === EventTypes.TBD) {
      switch (event.dashboardStatus) {
        case EventDashboardStatus.COMPLETE:
        case EventDashboardStatus.CLOSED:
          group = EventGroup.HISTORICAL;
          break;
        default:
          group = EventGroup.OPEN;
          event.status = EventStatus.IN_PROGRESS;
      }
    } else if (event.status !== undefined && (event.eventType === EventTypes.PA || event.eventType === EventTypes.FCA || event.eventType === EventTypes.DAA)) {
      switch (event.dashboardStatus) {
        case EventDashboardStatus.COMPLETE:
        case EventDashboardStatus.CLOSED:
          group = EventGroup.HISTORICAL;
          break;
        case EventDashboardStatus.ASSESSMENT:
          event.status = EventStatus.ASSESSMENT;
          group = EventGroup.OPEN;
          break;
        case EventDashboardStatus.EVALUATED:
          event.status = EventStatus.EVALUATED;
          group = EventGroup.OPEN;
          break;
        case EventDashboardStatus.PRE_AWARD:
          event.status = EventStatus.PRE_AWARD;
          group = EventGroup.OPEN;
          break;
        case EventDashboardStatus.AWARDED:
          event.status = EventStatus.AWARDED;
          group = EventGroup.OPEN;
          break;
        default:
          group = EventGroup.OPEN;
          event.status = EventStatus.IN_PROGRESS;
      }
    } else if (event.status !== undefined && (event.eventType === EventTypes.FC || event.eventType === EventTypes.DA)) {
      switch (event.dashboardStatus) {
        case EventDashboardStatus.COMPLETE:
        case EventDashboardStatus.CLOSED:
          group = EventGroup.HISTORICAL;
          break;
        case EventDashboardStatus.UNKNOWN:
          if (event.status === EventStatus.WITHDRAWN) {
            group = EventGroup.HISTORICAL;
          }
          break;
        case EventDashboardStatus.IN_PROGRESS:
          event.status = EventStatus.IN_PROGRESS;
          group = EventGroup.OPEN;
          break;
        case EventDashboardStatus.PUBLISHED:
          event.status = EventStatus.PUBLISHED;
          group = EventGroup.OPEN;
          break;
        case EventDashboardStatus.TO_BE_EVALUATED:
          event.status = EventStatus.TO_BE_EVALUATED;
          group = EventGroup.OPEN;
          break;
        case EventDashboardStatus.EVALUATING:
          event.status = EventStatus.EVALUATING;
          group = EventGroup.OPEN;
          break;
        case EventDashboardStatus.EVALUATED:
          event.status = EventStatus.EVALUATED;
          group = EventGroup.OPEN;
          break;
        case EventDashboardStatus.PRE_AWARD:
          event.status = EventStatus.PRE_AWARD;
          group = EventGroup.OPEN;
          break;
        case EventDashboardStatus.AWARDED:
        case EventDashboardStatus.LOWER_AWARDED:
          event.status = EventStatus.AWARDED;
          group = EventGroup.OPEN;
          break;
        default:
          group = EventGroup.OPEN;
      }
    }

    return {
      group: group,
      project: {
        ...project,
        activeEvent: event
      }
    };
  });
};

const separateOpenAndHistoricalProjects = async (projectEventsCollection: EventResult[]): Promise<[Project[], Project[]]> => {
  const openProjects: Project[] = [];
  const historicalProjects: Project[] = [];

  projectEventsCollection.sort((project_a, project_b) => +new Date(project_b.project.activeEvent.lastUpdated) - +new Date(project_a.project.activeEvent.lastUpdated));

  projectEventsCollection.flat().forEach((eventResult) => {
    if (eventResult.group === EventGroup.OPEN) {
      openProjects.push(eventResult.project);
    } else if (eventResult.group === EventGroup.HISTORICAL) {
      historicalProjects.push(eventResult.project);
    }
  });

  return [openProjects, historicalProjects];
};

const getEvents = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.session['access_token'];
  const { state, SESSION_ID } = req.cookies;

  req.session['agreement_id'] = '';
  req.session['agreementName'] = '';
  req.session['lotNum'] = '';
  req.session['releatedContent'] = '';
  req.session['journey_status'] = '';
  req.session['procurements'] = [];
  req.session['searched_user'] = [];
  req.session['agreementEndDate'] = '';
  req.session['agreementDescription'] = '';
  req.session['nonOCDSList'] = '';
  req.session['selectedRoute'] = '';
  req.session['caSelectedRoute'] = '';
  req.session['fcSelectedRoute'] = '';
  req.session['designations'] = [];
  req.session['designationsLevel2'] = [];
  req.session['tableItems'] = [];
  req.session['dimensions'] = [];
  req.session['weightingRange'] = {};
  req.session['errorTextSumary'] = [];
  req.session['CapAss'] = {};
  req.session['isTcUploaded'] = true;
  req.session['isAssessUploaded'] = true;
  req.session['isPricingUploaded'] = false;
  req.session['UIDate'] = null;
  req.session['isRFIComplete'] = false;
  req.session['searchText'] = '';
  req.session['ccs_rfi_type'] = '';
  req.session['isTimelineRevert'] = false;

  try {
    const projects = (await tendersService.api.projects.getProjects(accessToken)).unwrap();

    const projectEventsCollection = (await Promise.all(projects.map(async (project) => await getProjectEvents(accessToken, project)))).flat();

    const [openProjects, historicalProjects] = await separateOpenAndHistoricalProjects(projectEventsCollection);

    req.session.openProjectActiveEvents = openProjects;
    req.session.historicalEvents = historicalProjects;
    next();
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      state,
      TokenDecoder.decoder(SESSION_ID),
      'Tenders API for getting the list of Active Events',
      false
    );
    next();
  }
};

const searchEvents = async (req: Request, res: Response, next: NextFunction) => {
  const { SESSION_ID } = req.cookies;
  try {
    const { search } = req.body;
    const accessToken = req.session['access_token'];
    req.session.searchText = search;

    const searchNew = ('' + search).trim();

    if (searchNew !== '') {
      console.log(searchNew);
      const searchTypes = [
        'projectName',
        'eventId',
        'eventSupportId'
      ];

      const projectCollections = await Promise.all(searchTypes.map(async (searchType) => {
        const projects = (await tendersService.api.projects.getProjects(accessToken, {
          'search-type': searchType,
          'search-term': `*${searchNew}*`,
          'page': '0',
          'page-size': '20'
        })).unwrap();

        return projects;
      }));

      const projects = objectSet(projectCollections.flat(), 'projectId');

      const projectEventsCollection = (await Promise.all(projects.map(async (project) => await getProjectEvents(accessToken, project)))).flat();

      const [openProjects, historicalProjects] = await separateOpenAndHistoricalProjects(projectEventsCollection);

      req.session.openProjectActiveEvents = openProjects;
      req.session.historicalEvents = historicalProjects;
      next();
    } else {
      res.redirect(DashboardPaths.DASHBOARD);
    }
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Tenders API for getting the list of Active Events',
      false
    );
    next();
  }
};

/**
 *
 * @Middleware
 * @param req
 * @param res
 * @param next
 */
const activeEventsMiddleware = {
  getEvents,
  searchEvents
};

export { activeEventsMiddleware, EventTypes };
