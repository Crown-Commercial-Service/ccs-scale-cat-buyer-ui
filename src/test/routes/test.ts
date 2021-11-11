import { expect } from 'chai';
import request from 'supertest';


import { app } from '../../main/app';

// TODO: replace this sample test with proper route tests for your application
describe('Home page', () => {
  describe('on GET', () => {
    test('should return sample home page', async () => {
      await request(app)
        .get('/rfi/questions?agreement_id=RM1043.6&id=Criterion_1&path_view=Information_You_are_looking_for')
        .expect((res) => expect(res.status).to.equal(404));
    });
  });
});
