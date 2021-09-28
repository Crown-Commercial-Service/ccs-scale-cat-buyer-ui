import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';

// TODO: replace this sample test with proper route tests for your application
describe('RFI TASK LIST', () => {
  describe('on GET', () => {
    test('should return sample rfi Task List ', async () => {
      await request(app)
        .get('/rfi/rfi-tasklist')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
