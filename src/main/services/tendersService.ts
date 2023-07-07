import { eventsAPI } from './tendersService/events/api';
import { projectsAPI } from './tendersService/projects/api';
import { tendersServiceURL } from './tendersService/url';

const tendersService = {
  api: {
    events: eventsAPI,
    projects: projectsAPI
  },
  url: tendersServiceURL
};

export { tendersService };
