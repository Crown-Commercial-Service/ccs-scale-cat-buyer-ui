import { EndPoints } from 'main/services/types/gCloud/search/api';
import { baseURL } from './helpers';

const statusURL = () => new URL(EndPoints.STATUS, baseURL());

const searchURL = {
  statusURL
};

export { searchURL };
