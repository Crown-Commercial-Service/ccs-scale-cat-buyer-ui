enum EndPoints {
  ORGANISATION = '/organisation-profile/:organisationId',
  ORGANISATION_USERS = '/organisation-profile/:organisationId/users',
  USER_PROFILES = '/user-profile'
};

interface Organisation {
  identifier: {
    legalName: string
  }
}

interface OrganisationUsers {
  pageCount: number
  userList: UserProfile[]
}

interface UserProfile {
  userName: string
  firstName: string
  lastName: string
  telephone: string
}

export { Organisation, OrganisationUsers, UserProfile, EndPoints };
