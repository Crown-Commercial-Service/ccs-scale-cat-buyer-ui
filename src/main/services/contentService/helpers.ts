import config from 'config';

const baseURL: string = config.get('contentService.BASEURL');

export { baseURL };
