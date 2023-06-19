import config from 'config';
import { genericFecthGet } from '../helpers/api';
import { FetchResult } from '../types/helpers/api';
import { BankHolidays, EndPoints } from '../types/bankHolidays/api';

const baseURL: string = config.get('bankholidayservice.BASEURL');

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
