import config from 'config';

const baseURL: string = config.get('bankholidayservice.BASEURL');

export { baseURL };
