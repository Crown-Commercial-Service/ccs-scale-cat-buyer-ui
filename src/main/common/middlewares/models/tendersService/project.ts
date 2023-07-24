import { Event } from './event';

interface Project {
  projectId: number
  projectName: string
  agreementId: string
  agreementName: string
  lotId: string
  lotName: string
  activeEvent: Event
}

export { Project };
