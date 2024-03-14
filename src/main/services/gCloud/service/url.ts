import { EndPoints } from 'main/services/gCloud/service/api.types';
import { baseURL } from './helpers';

const statusURL = () => new URL(EndPoints.STATUS, baseURL());

const serviceURL = {
  statusURL
};

export { serviceURL };
