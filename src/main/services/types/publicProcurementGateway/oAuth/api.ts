type AuthCredentials = {
  refresh_token?: string
  code?: string
  redirect_uri?: string
  response_type?: string
}

type RefreshData = {
  access_token: string
  session_state: string
  refresh_token: string
}

type EndPoints = {
  token: string
  validateToken: string
};

export { AuthCredentials, RefreshData, EndPoints };