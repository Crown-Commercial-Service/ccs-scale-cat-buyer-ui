import { genericFecthGet } from 'main/services/helpers/api';
import { EndPoints, Organisation, OrganisationUsers, UserProfile } from '../../types/publicProcurementGateway/organisation/api';
import { FetchResult } from 'main/services/types/helpers/api';

const baseURL = () => process.env.CONCLAVE_WRAPPER_API_BASE_URL;

const headers = () => ({
  'Content-Type': 'application/json',
  'x-api-key': process.env.CONCLAVE_WRAPPER_API_KEY
});

// GET /organisation-profiles/:organisation-id
const getOrganisation = async (organisationId: string): Promise<FetchResult<Organisation>> => {
  return genericFecthGet<Organisation>(
    {
      baseURL: baseURL(),
      path: EndPoints.ORGANISATION,
      params: { organisationId },
    },
    headers()
  );
};

// GET /organisation-profiles/:organisation-id/users
const getOrganisationUsers = async (organisationId: string, currentPage?: number): Promise<FetchResult<OrganisationUsers>> => {
  const queryParams = currentPage !== undefined ? { currentPage: String(currentPage) } : undefined;

  return genericFecthGet<OrganisationUsers>(
    {
      baseURL: baseURL(),
      path: EndPoints.ORGANISATION_USERS,
      params: { organisationId },
      queryParams: queryParams
    },
    headers()
  );
};

// GET /user-profiles
const getUserProfiles = async (userId: string): Promise<FetchResult<UserProfile>> => {
  return genericFecthGet<UserProfile>(
    {
      baseURL: baseURL(),
      path: EndPoints.USER_PROFILES,
      queryParams: {
        'user-Id': userId,
      }
    },
    headers()
  );
};

const organisationAPI = {
  getOrganisation,
  getOrganisationUsers,
  getUserProfiles
};

export { organisationAPI };
