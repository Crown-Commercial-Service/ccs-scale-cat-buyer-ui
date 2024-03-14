import { EndPoints } from 'main/services/gCloud/search/api.types';
import { baseURL } from './helpers';

const statusURL = () => new URL(EndPoints.STATUS, baseURL());

const searchURL = {
  statusURL
};

export { searchURL };
