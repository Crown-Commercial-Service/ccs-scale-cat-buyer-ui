import { expect } from 'chai';
import config from 'config';
import { FetchResultOK, FetchResultStatus } from 'main/services/types/helpers/api';
import { bankHolidaysAPI } from 'main/services/bankHolidays/api';
import { BankHolidays } from 'main/services/types/bankHolidays/api';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { matchHeaders } from 'spec/support/mswMatchers';

describe('Bank Holidays API helpers', () => {
  const baseURL = config.get('bankholidayservice.BASEURL') as string;
  const headers = {
    'content-type': 'application/json',
  };
  const bankHolidaysData = {
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
  };

  const restHandlers = [
    rest.get(`${baseURL}/bank-holidays.json`, (req, res, ctx) => {
      if (matchHeaders(req, headers)) return res(ctx.status(200), ctx.json(bankHolidaysData));

      return res(ctx.status(400));
    }),
  ];

  const server = setupServer(...restHandlers);

  before(() => server.listen({ onUnhandledRequest: 'error' }));

  after(() => server.close());

  afterEach(() => server.resetHandlers());

  describe('getBankHolidays', () => {
    it('calls the get bank holidays endpoint with the correct url and headers', async () => {
      const getBankHolidaysResult = await bankHolidaysAPI.getBankHolidays() as FetchResultOK<BankHolidays>;

      expect(getBankHolidaysResult.status).to.eq(FetchResultStatus.OK);
      expect(getBankHolidaysResult.data).to.eql(bankHolidaysData);
    });
  });
});
