import { genericFecthGet } from 'main/services/helpers/api';
import { FetchResult } from 'main/services/types/helpers/api';
import { baseURL, headers } from '../helpers';
import { EndPoints } from 'main/services/types/tendersService/projects/api';
import { Project } from '@common/middlewares/models/tendersService/project';

// GET /tenders/projects
const getProjects = async (accessToken: string, queryParams?: { [key: string]: string }): Promise<FetchResult<Project[]>> => {
  return genericFecthGet<Project[]>(
    {
      baseURL: baseURL,
      path: EndPoints.PROJECTS,
      queryParams: queryParams
    },
    headers(accessToken)
  );
};

const projectsAPI = {
  getProjects
};

export { projectsAPI };
