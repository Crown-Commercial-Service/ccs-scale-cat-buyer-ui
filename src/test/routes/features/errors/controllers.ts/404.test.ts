import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../../../main/app';

describe('Unauthorized Error page', () => {
    describe('on GET', () => {
        it('should render `Unauthorized Error page 401', async () => {
            await request(app)
                .get('/401')
                .expect(res => expect(res.status).to.equal(200));
        })
    })
})