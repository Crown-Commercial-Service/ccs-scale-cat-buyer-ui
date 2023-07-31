enum EndPoints {
  TOKEN = '/security/token',
  VALIDATE_TOKEN = '/security/tokens/validation'
};

enum GrantType {
  AUTHORIZATION_CODE = 'authorization_code',
  REFRESH_TOKEN = 'refresh_token'
}

type AuthCredentials = {
  code: string
  grant_type: GrantType.AUTHORIZATION_CODE,
  redirect_uri: string
} | {
  grant_type: GrantType.REFRESH_TOKEN
  refresh_token: string
}

type RefreshData = {
  access_token: string
  session_state: string
  refresh_token: string
}

export { AuthCredentials, RefreshData, EndPoints, GrantType };
