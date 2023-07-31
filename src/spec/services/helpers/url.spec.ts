import { expect } from 'chai';
import { formatURL, formatRelativeURL } from 'main/services/helpers/url';

describe('URL helpers', () => {
  describe('formatURL', () => {
    const baseURL = 'http://example.com';

    it('returns the base url with the path when no other params are passed', () => {
      const path = '/test';

      expect(formatURL({ baseURL, path })).to.eq('http://example.com/test');
    });

    it('replaces the ids when id params are passed', () => {
      const path = '/test/:testId/user/:userId';

      expect(formatURL({ baseURL, path, params: { testId: 'test-1234', userId: 'user-1234' } })).to.eq('http://example.com/test/test-1234/user/user-1234');
    });

    it('only replaces the params if they are present', () => {
      const path = '/test/:testId/user/:userId';

      expect(formatURL({ baseURL, path, params: { userId: 'user-1234' } })).to.eq('http://example.com/test/:testId/user/user-1234');
    });

    describe('when considering query params', () => {
      it('adds the query parameters when the params are a string', () => {
        const path = '/test';
        const queryParams = 'test=test&myParam';

        expect(formatURL({ baseURL, path, queryParams })).to.eq('http://example.com/test?test=test&myParam=');
      });

      it('adds the query parameters when the params are a record', () => {
        const path = '/test';
        const queryParams = {
          test: 'test',
          myParam: 'myParam'
        };
  
        expect(formatURL({ baseURL, path, queryParams })).to.eq('http://example.com/test?test=test&myParam=myParam');
      });

      it('adds the query parameters when the params are an array of array', () => {
        const path = '/test';
        const queryParams = [
          ['test', 'test'],
          ['myParam', 'myParam'],
          ['myParam', 'myOtherParam']
        ];

        expect(formatURL({ baseURL, path, queryParams })).to.eq('http://example.com/test?test=test&myParam=myParam&myParam=myOtherParam');
      });
    });

    it('works when all params are passed', () => {
      const path = '/test/:testId/user/:userId';
      const queryParams = {
        test: 'test',
        myParam: 'myParam'
      };

      expect(formatURL({ baseURL, path, params: { testId: 'test-1234', userId: 'user-1234' }, queryParams })).to.eq('http://example.com/test/test-1234/user/user-1234?test=test&myParam=myParam');
    });
  });

  describe('formatRelativeURL', () => {
    it('returns the base url with the path when no other params are passed', () => {
      const path = '/test';

      expect(formatRelativeURL({ path })).to.eq('/test');
    });

    it('replaces the ids when id params are passed', () => {
      const path = '/test/:testId/user/:userId';

      expect(formatRelativeURL({ path, params: { testId: 'test-1234', userId: 'user-1234' } })).to.eq('/test/test-1234/user/user-1234');
    });

    it('only replaces the params if they are present', () => {
      const path = '/test/:testId/user/:userId';

      expect(formatRelativeURL({ path, params: { userId: 'user-1234' } })).to.eq('/test/:testId/user/user-1234');
    });

    it('adds the query parameters', () => {
      const path = '/test';
      const queryParams = {
        test: 'test',
        myParam: 'myParam'
      };

      expect(formatRelativeURL({ path, queryParams })).to.eq('/test?test=test&myParam=myParam');
    });

    describe('when considering query params', () => {
      it('adds the query parameters when the params are a string', () => {
        const path = '/test';
        const queryParams = 'test=test&myParam';

        expect(formatRelativeURL({ path, queryParams })).to.eq('/test?test=test&myParam=');
      });

      it('adds the query parameters when the params are a record', () => {
        const path = '/test';
        const queryParams = {
          test: 'test',
          myParam: 'myParam'
        };
  
        expect(formatRelativeURL({ path, queryParams })).to.eq('/test?test=test&myParam=myParam');
      });

      it('adds the query parameters when the params are an array of array', () => {
        const path = '/test';
        const queryParams = [
          ['test', 'test'],
          ['myParam', 'myParam'],
          ['myParam', 'myOtherParam']
        ];

        expect(formatRelativeURL({ path, queryParams })).to.eq('/test?test=test&myParam=myParam&myParam=myOtherParam');
      });
    });

    it('works when all params are passed', () => {
      const path = '/test/:testId/user/:userId';
      const queryParams = {
        test: 'test',
        myParam: 'myParam'
      };

      expect(formatRelativeURL({ path, params: { testId: 'test-1234', userId: 'user-1234' }, queryParams })).to.eq('/test/test-1234/user/user-1234?test=test&myParam=myParam');
    });
  });
});
