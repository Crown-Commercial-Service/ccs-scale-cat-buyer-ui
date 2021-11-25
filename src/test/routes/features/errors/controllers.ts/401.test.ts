import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../../../main/app';

describe('Page no found error page', () => {
    describe('on GET', () => {
        it('should render `Page no found 404', async () => {
            await request(app)
                .get('/404')
                .expect(res => expect(res.status).to.equal(200));
        })
    })
})