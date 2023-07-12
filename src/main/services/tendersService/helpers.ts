const baseURL = () => process.env.TENDERS_SERVICE_API_URL;

const headers = (accessToken: string) => {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`
  };
};

export { baseURL, headers };