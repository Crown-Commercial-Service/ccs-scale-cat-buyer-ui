import { EndPoints } from '../types/bankHolidays/api';
import { baseURL } from './helpers';

const statusURL = () => new URL(EndPoints.STATUS, baseURL);

const bankHolidaysURL = {
  statusURL
};

export { bankHolidaysURL };
