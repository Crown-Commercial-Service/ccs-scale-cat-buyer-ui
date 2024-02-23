import { genericFecthGet } from 'main/services/helpers/api';
import { FetchResult } from 'main/services/helpers/api.types';
import { baseURL, headers } from '../helpers';
import { EndPoints } from 'main/services/tendersService/projects/api.types';
import { Project } from '@common/middlewares/models/tendersService/project';
import { QueryParams } from 'main/services/helpers/url.types';

// GET /tenders/projects
const getProjects = async (accessToken: string, queryParams?: QueryParams): Promise<FetchResult<Project[]>> => {
  return genericFecthGet<Project[]>(
    {
      baseURL: baseURL(),
      path: EndPoints.PROJECTS,
      queryParams: queryParams
    },
    headers(accessToken),
    undefined,
    {
      name: 'tenders API',
      message: 'Feached projects from the Tenders API'
    }
  );
};

const projectsAPI = {
  getProjects
};

export { projectsAPI };
