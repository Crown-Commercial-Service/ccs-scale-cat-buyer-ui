import { EndPoints } from './api.types';
import { baseURL } from './helpers';

const statusURL = () => new URL(EndPoints.STATUS, baseURL);

const contentServiceURL = {
  statusURL
};

export { contentServiceURL };
