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

type EndPoints = {
  organisation: string
  organisationUsers: string
  userProfiles: string
};

export { Organisation, OrganisationUsers, UserProfile, EndPoints };
