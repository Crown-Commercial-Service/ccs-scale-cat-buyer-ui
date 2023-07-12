import { EndPoints } from '../types/agreementsService/api';
import { baseURL } from './helpers';

const statusURL = () => new URL(EndPoints.STATUS, baseURL());

const agreementsServiceURL = {
  statusURL
};

export { agreementsServiceURL };
