type EndPoints = {
  token: string
  validateToken: string
};

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

export { AuthCredentials, RefreshData, EndPoints };
