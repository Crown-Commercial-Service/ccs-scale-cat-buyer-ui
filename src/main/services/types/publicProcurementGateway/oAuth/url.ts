type EndPoints = {
  login: string
  callback: string
  logout: string
  logoutCallback: string
};

type LogInParams = {
  response_type: string
  scope: string
  client_id: string
  redirect_uri: string
  urlId?: string
}

export { EndPoints, LogInParams };
