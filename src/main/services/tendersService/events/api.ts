import { genericFecthGet } from 'main/services/helpers/api';
import { FetchResult } from 'main/services/types/helpers/api';
import { baseURL, headers } from '../helpers';
import { EndPoints } from 'main/services/types/tendersService/events/api';
import { Event } from '@common/middlewares/models/tendersService/event';

// GET /tenders/projects/:project-id/events
const getEvents = async (accessToken: string, projectId: string): Promise<FetchResult<Event[]>> => {
  return genericFecthGet<Event[]>(
    {
      baseURL: baseURL(),
      path: EndPoints.EVENTS,
      params: { projectId }
    },
    headers(accessToken),
    undefined,
    {
      name: 'tenders API',
      message: `Feached project events from the Tenders API for project: ${projectId}`
    }
  );
};

const eventsAPI = {
  getEvents
};

export { eventsAPI };
