enum EndPoints {
  ORGANISATION = '/organisation-profile/:organisationId',
  ORGANISATION_USERS = '/organisation-profile/:organisationId/users',
  USER_PROFILES = '/user-profile'
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
