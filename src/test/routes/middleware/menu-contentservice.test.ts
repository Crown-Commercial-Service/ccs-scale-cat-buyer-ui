import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../main/app';

describe('Primary Navigation', () => {
    describe('on GET', () => {
      it('should return Primary Navigation-Header', async () => {
        await request(app)
          .get('https://webdev-cms.crowncommercial.gov.uk/wp-json/wp-api-menus/v2/menus/21')
          .expect((res) => expect(res.status).to.equal(200));
      });
    });
  });

  describe('Secondary Navigation', () => {
    describe('on GET', () => {
      it('should return Secondary Navigation- Header', async () => {
        await request(app)
          .get('https://webdev-cms.crowncommercial.gov.uk/wp-json/wp-api-menus/v2/menus/22')
          .expect((res) => expect(res.status).to.equal(200));
      });
    });
  });

  describe('SiteMap', () => {
    describe('on GET', () => {
      it('should return SiteMap Footer', async () => {
        await request(app)
          .get('https://webdev-cms.crowncommercial.gov.uk/wp-json/wp-api-menus/v2/menus/23')
          .expect((res) => expect(res.status).to.equal(200));
      });
    });
  });

  describe('QuickLinks', () => {
    describe('on GET', () => {
      it('should return QuickLinks footer', async () => {
        await request(app)
          .get('https://webdev-cms.crowncommercial.gov.uk/wp-json/wp-api-menus/v2/menus/24')
          .expect((res) => expect(res.status).to.equal(200));
      });
    });
  });

  describe('About and Contact', () => {
    describe('on GET', () => {
      it('should return About and Contact Footer', async () => {
        await request(app)
          .get('https://webdev-cms.crowncommercial.gov.uk/wp-json/wp-api-menus/v2/menus/25')
          .expect((res) => expect(res.status).to.equal(200));
      });
    });
  });
  