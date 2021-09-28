import { expect } from 'chai';
import request from 'supertest';
import {RFI_PATHS} from '../../main/features/RFI/path/rfiPath'
import {RFI_TASKLIST} from '../../main/features/RFI/controller/rfiTaskList'

import { app } from '../../main/app';

// TODO: replace this sample test with proper route tests for your application
describe('RFI TASK LIST', () => {
  describe('on GET', () => {
    test('should return sample rfi Task List ', async () => await request(app)
      .get(RFI_PATHS.RFI_TASKLIST, RFI_TASKLIST as any)
      .expect((res) => expect(res.status).to.equal(200)));
  });
});
