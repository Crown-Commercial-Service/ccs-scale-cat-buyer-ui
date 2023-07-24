import { eventsAPI } from './tendersService/events/api';
import { projectsAPI } from './tendersService/projects/api';

const tendersService = {
  api: {
    events: eventsAPI,
    projects: projectsAPI
  }
};

export { tendersService };
