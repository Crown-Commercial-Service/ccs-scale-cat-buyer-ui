import { EndPoints } from './api.types';
import { baseURL } from './helpers';

const statusURL = () => new URL(EndPoints.STATUS, baseURL);

const bankHolidaysURL = {
  statusURL
};

export { bankHolidaysURL };
