import { genericFecthGet } from 'main/services/helpers/api';
import { FetchResult } from 'main/services/types/helpers/api';
import { baseURL, headers } from '../helpers';
import { EndPoints } from 'main/services/types/tendersService/events/api';
import { Event } from '@common/middlewares/models/tendersService/event';

// GET /tenders/projects/:project-id/events
const getEvents = async (accessToken: string, projectId: string): Promise<FetchResult<Event[]>> => {
  return genericFecthGet<Event[]>(
    {
      baseURL: baseURL,
      path: EndPoints.EVENTS,
      params: [
        [':project-id', projectId]
      ]
    },
    headers(accessToken)
  );
};

const eventsAPI = {
  getEvents
};

export { eventsAPI };
