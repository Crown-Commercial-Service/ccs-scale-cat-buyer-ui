import { expect } from 'chai';
import { formatURL } from 'main/services/helpers/url';

describe('URL helpers', () => {
  const baseURL = 'http://example.com';

  describe('formatURL', () => {
    it('returns the base url with the path when no other params are passed', () => {
      const path = '/test';

      expect(formatURL(baseURL, path)).to.eq('http://example.com/test');
    });

    it('replaces the ids when id params are passed', () => {
      const path = '/test/:test-id/user/:user-id';

      expect(formatURL(baseURL, path, [[':test-id', 'test-1234'], [':user-id', 'user-1234']])).to.eq('http://example.com/test/test-1234/user/user-1234');
    });

    it('only replaces the params if they are present', () => {
      const path = '/test/:test-id/user/:user-id';

      expect(formatURL(baseURL, path, [[':user-id', 'user-1234']])).to.eq('http://example.com/test/:test-id/user/user-1234');
    });

    it('adds the query parameters', () => {
      const path = '/test';
      const queryParams = {
        test: 'test',
        myParam: 'myParam'
      };

      expect(formatURL(baseURL, path, [], queryParams)).to.eq('http://example.com/test?test=test&myParam=myParam');
    });

    it('works when all params are passed', () => {
      const path = '/test/:test-id/user/:user-id';
      const queryParams = {
        test: 'test',
        myParam: 'myParam'
      };

      expect(formatURL(baseURL, path, [[':test-id', 'test-1234'], [':user-id', 'user-1234']], queryParams)).to.eq('http://example.com/test/test-1234/user/user-1234?test=test&myParam=myParam');
    });
  });
});
