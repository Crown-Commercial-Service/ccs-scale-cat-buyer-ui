enum EndPoints {
  LOGIN = '/security/authorize',
  LOGIN_CALLBACK = '/receiver',
  LOGOUT = '/security/log-out',
  LOGOUT_CALLBACK = '/logout'
};

type LogInParams = {
  response_type: string
  scope: string
  client_id: string
  redirect_uri: string
  urlId?: string
}

export { EndPoints, LogInParams };
