import { expect } from 'chai';
import config from 'config';
import { FetchResultOK, FetchResultStatus } from 'main/services/helpers/api.types';
import { bankHolidaysAPI } from 'main/services/bankHolidays/api';
import { BankHolidays } from 'main/services/bankHolidays/api.types';
import { setupServer } from 'msw/node';
import { http } from 'msw';
import { matchHeaders, mswEmptyResponseWithStatus, mswJSONResponse } from 'spec/support/mswHelpers';

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
    http.get(`${baseURL}/bank-holidays.json`, ({ request }) => {
      if (matchHeaders(request, headers)) {
        return mswJSONResponse(bankHolidaysData);
      }

      return mswEmptyResponseWithStatus(400);
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
