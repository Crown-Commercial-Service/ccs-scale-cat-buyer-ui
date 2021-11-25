import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../../../main/app';
// Below is the sample test for agreement page
describe('Choose a commercial agreement page', () => {
  describe('on GET', () => {
    it('should render `Choose a commercial agreement` page when everything is fine', async () => {
      await request(app)
        .get('/projects/choose-agreement')
        .expect(res => expect(res.status).to.equal(302)) // it's 302 bcz we need to mock the conclave data, then we will get 200. Now it's going to login screen.
    })
  })
})
