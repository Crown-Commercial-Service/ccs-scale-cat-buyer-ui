import { EndPoints } from 'main/services/gCloud/supplier/api.types';
import { baseURL } from './helpers';

const statusURL = () => new URL(EndPoints.STATUS, baseURL());

const supplierURL = {
  statusURL
};

export { supplierURL };
