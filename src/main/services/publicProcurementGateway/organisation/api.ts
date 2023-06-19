import { genericFecthGet } from 'main/services/helpers/api';
import { EndPoints, Organisation, OrganisationUsers, UserProfile } from '../../types/publicProcurementGateway/organisation/api';
import { FetchResult } from 'main/services/types/helpers/api';

const baseURL: string = process.env.CONCLAVE_WRAPPER_API_BASE_URL;

const headers = {
  'Content-Type': 'application/json',
  'x-api-key': process.env.CONCLAVE_WRAPPER_API_KEY
};

const endPoints: EndPoints = {
  organisation: '/organisation-profiles/:organisation-id',
  organisationUsers: '/organisation-profiles/:organisation-id/users',
  userProfiles: '/user-profiles'
};

// GET /organisation-profiles/:organisation-id
const getOrganisation = async (organisationId: string, queryParams?: { [key: string]: string }): Promise<FetchResult<Organisation>> => {
  return genericFecthGet<Organisation>(
    {
      baseURL: baseURL,
      path: endPoints.organisation,
      params: [
        [':organisation-id', organisationId]
      ],
      queryParams: queryParams
    },
    headers
  );
};

// GET /organisation-profiles/:organisation-id/users
const getOrganisationUsers = async (organisationId: string, queryParams?: { [key: string]: string }): Promise<FetchResult<OrganisationUsers>> => {
  return genericFecthGet<OrganisationUsers>(
    {
      baseURL: baseURL,
      path: endPoints.organisationUsers,
      params: [
        [':organisation-id', organisationId]
      ],
      queryParams: queryParams
    },
    headers
  );
};

// GET /user-profiles
const getUserProfiles = async (userId: string, queryParams?: { [key: string]: string }): Promise<FetchResult<UserProfile>> => {
  return genericFecthGet<UserProfile>(
    {
      baseURL: baseURL,
      path: endPoints.userProfiles,
      queryParams: {
        'user-Id': userId,
        ...queryParams
      }
    },
    headers
  );
};

const organisationAPI = {
  getOrganisation,
  getOrganisationUsers,
  getUserProfiles
};

export { organisationAPI };
