import { EndPoints } from 'main/services/types/gCloud/supplier/api';
import { baseURL } from './helpers';

const statusURL = () => new URL(EndPoints.STATUS, baseURL());

const supplierURL = {
  statusURL
};

export { supplierURL };
