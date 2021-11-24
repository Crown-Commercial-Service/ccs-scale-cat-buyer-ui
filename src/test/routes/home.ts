import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../main/app';

describe('Home page', () => {
  describe('on GET', () => {
    it('should render Home page when everything is fine', async () => {
      await request(app)
        .get('/')
        .expect(res => expect(res.status).to.equal(200))
    })
  })
})
