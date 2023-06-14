import config from 'config';
import { expect } from 'chai';
import { FetchResultOK, FetchResultStatus } from 'main/services/types/helpers/api';
import { Interceptable, MockAgent, setGlobalDispatcher } from 'undici';
import { bankHolidaysAPI } from 'main/services/bankHolidays/api';
import { BankHolidays } from 'main/services/types/bankHolidays/api';

describe('Bank Holidays API helpers', () => {
  const baseURL = config.get('bankholidayservice.BASEURL') as string;
  const headers = {
    'Content-Type': 'application/json',
  };
  let mockPool: Interceptable;

  beforeEach(() => {
    const mockAgent = new MockAgent();
    mockPool = mockAgent.get(baseURL);
    setGlobalDispatcher(mockAgent);
  });

  describe('getBankHolidays', () => {
    it('calls the get bank holidays endpoint with the correct url and headers', async () => {
      mockPool.intercept({
        method: 'GET',
        path: '/bank-holidays.json',
        headers: headers
      }).reply(200, {
        'england-and-wales': [
          {
            title: 'Christmas Day',
            date: '2018-12-25',
            notes: '',
            bunting: true
          }
        ],
        'scotland': [
          {
            title: 'Christmas Day',
            date: '2018-12-25',
            notes: '',
            bunting: true
          }
        ],
        'northern-ireland': [
          {
            title: 'Christmas Day',
            date: '2018-12-25',
            notes: '',
            bunting: true
          }
        ]
      });

      const getBankHolidaysResult = await bankHolidaysAPI.getBankHolidays() as FetchResultOK<BankHolidays>;

      expect(getBankHolidaysResult.status).to.eq(FetchResultStatus.OK);
      expect(getBankHolidaysResult.data).to.eql({
        'england-and-wales': [
          {
            title: 'Christmas Day',
            date: '2018-12-25',
            notes: '',
            bunting: true
          }
        ],
        'scotland': [
          {
            title: 'Christmas Day',
            date: '2018-12-25',
            notes: '',
            bunting: true
          }
        ],
        'northern-ireland': [
          {
            title: 'Christmas Day',
            date: '2018-12-25',
            notes: '',
            bunting: true
          }
        ]
      });
    });
  });
});
