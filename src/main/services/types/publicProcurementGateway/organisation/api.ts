enum EndPoints {
  ORGANISATION = '/organisation-profiles/:organisationId',
  ORGANISATION_USERS = '/organisation-profiles/:organisationId/users',
  USER_PROFILES = '/user-profiles'
};

type Organisation = {
  identifier: {
    legalName: string
  }
}

type OrganisationUsers = {
  pageCount: number
  userList: UserProfile[]
}

type UserProfile = {
  userName: string
  firstName: string
  lastName: string
  telephone: string
}

export { Organisation, OrganisationUsers, UserProfile, EndPoints };
