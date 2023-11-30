import { EndPoints } from 'main/services/types/gCloud/service/api';
import { baseURL } from './helpers';

const statusURL = () => new URL(EndPoints.STATUS, baseURL());

const serviceURL = {
  statusURL
};

export { serviceURL };
