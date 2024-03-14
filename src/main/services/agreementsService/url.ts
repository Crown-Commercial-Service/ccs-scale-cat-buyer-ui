import { EndPoints } from './api.types';
import { baseURL } from './helpers';

const statusURL = () => new URL(EndPoints.STATUS, baseURL());

const agreementsServiceURL = {
  statusURL
};

export { agreementsServiceURL };
