import { genericFecthGet } from '../helpers/api';
import { FetchResult } from '../helpers/api.types';
import { BankHolidays, EndPoints } from './api.types';
import { baseURL } from './helpers';

// GET /bank-holidays.json
const getBankHolidays = async (): Promise<FetchResult<BankHolidays>> => {
  return genericFecthGet<BankHolidays>(
    {
      baseURL: baseURL,
      path: EndPoints.BANK_HOLIDAYS
    },
    {
      'Content-Type': 'application/json',
    }
  );
};

const bankHolidaysAPI = {
  getBankHolidays
};

export { bankHolidaysAPI };
