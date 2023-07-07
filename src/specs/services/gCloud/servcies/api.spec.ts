import { describe, it, expect, afterEach, beforeAll, afterAll } from 'vitest';
import { FetchResultOK, FetchResultStatus } from 'main/services/types/helpers/api';
import { serviceAPI } from 'main/services/gCloud/service/api';
import { GCloudService, GCloudSupplier, GCloudSupplierFramework } from 'main/services/types/gCloud/service/api';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { matchHeaders } from 'specs/support/mswMatchers';

describe('G-Cloud Service API helpers', () => {
  const baseURL = process.env.GCLOUD_SERVICES_API_URL;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.GCLOUD_TOKEN}`
  };
  const serviceId = 'serviceId-1234';
  const supplierId = 'supplierId-1234';


  const getServiceData: GCloudService = {
    serviceMadeUnavailableAuditEvent: null,
    services: {
      myService: true
    }
  };
  const getSupplierData: GCloudSupplier = {
    suppliers: {
      companiesHouseNumber: 'myCompaniesHouseNumber',
      companyDetailsConfirmed: true,
      contactInformation: [
        {
          address1: 'myAddress1',
          city: 'myCity',
          contactName: 'myContactName',
          email: 'myEmail',
          id: 123,
          links: {
            self: 'mySelf'
          },
          personalDataRemoved: false,
          phoneNumber: 'myPhoneNumber',
          postcode: 'myPostcode'
        }
      ],
      description: 'myDescription',
      dunsNumber: 'myDunsNumber',
      id: 234,
      links: {
        self: 'mySelf'
      },
      name: 'myName',
      organisationSize: 'myOrganisationSize',
      registeredName: 'myRegisteredName',
      registrationCountry: 'myRegistrationCountry',
      service_counts: {
        'serviceCount': 345
      },
      tradingStatus: 'myTradingStatus',
      vatNumber: 'vatNumber'
    }
  };
  const getSupplierFrameworkData: GCloudSupplierFramework = {
    frameworkInterest: {
      agreedVariations: {},
      agreementDetails: {
        frameworkAgreementVersion: 'myFrameworkAgreementVersion',
        signerName: 'mySignerName',
        signerRole: 'mySignerRole',
        uploaderUserEmail: 'myUploaderUserEmail',
        uploaderUserId: 123,
        uploaderUserName: 'myUploaderUserName'
      },
      agreementId: 1234,
      agreementPath: null,
      agreementReturned: true,
      agreementReturnedAt: 'myAgreementReturnedAt',
      agreementStatus: 'myAgreementStatus',
      allowDeclarationReuse: false,
      applicationCompanyDetailsConfirmed: true,
      countersigned: true,
      countersignedAt: 'myCountersignedAt',
      countersignedDetails: {
        approvedByUserEmail: 'myApprovedByUserEmail',
        approvedByUserId: 234,
        approvedByUserName: 'myApprovedByUserName',
        countersignerName: 'myCountersignerName',
        countersignerRole: 'myCountersignerRole'
      },
      countersignedPath: 'myCountersignedPath',
      declaration: {
        declaration: true
      },
      frameworkFamily: 'myFrameworkFamily',
      frameworkFramework: 'myFrameworkFramework',
      frameworkSlug: 'myFrameworkSlug',
      onFramework: true,
      prefillDeclarationFromFrameworkSlug: 'myPrefillDeclarationFromFrameworkSlug',
      supplierId: 345,
      supplierName: 'mySupplierName'
    }
  };

  const restHandlers = [
    rest.get(`${baseURL}/services/${serviceId}`, (req, res, ctx) => {
      if (matchHeaders(req, headers)) {
        return res(ctx.status(200), ctx.json(getServiceData));
      }

      return res(ctx.status(400));
    }),
    rest.get(`${baseURL}/suppliers/${supplierId}`, (req, res, ctx) => {
      if (matchHeaders(req, headers)) {
        return res(ctx.status(200), ctx.json(getSupplierData));
      }

      return res(ctx.status(400));
    }),
    rest.get(`${baseURL}/suppliers/${supplierId}/frameworks/g-cloud-13`, (req, res, ctx) => {
      if (matchHeaders(req, headers)) {
        return res(ctx.status(200), ctx.json(getSupplierFrameworkData));
      }

      return res(ctx.status(400));
    }),
  ];

  const server = setupServer(...restHandlers);

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

  afterAll(() => server.close());

  afterEach(() => server.resetHandlers());

  describe('getService', () => {
    it('calls the get g-cloud services endpoint with the correct url and headers', async () => {
      const findServiceResult = await serviceAPI.getService(serviceId) as FetchResultOK<GCloudService>;

      expect(findServiceResult.status).to.eq(FetchResultStatus.OK);
      expect(findServiceResult.data).to.eql(getServiceData);
    });
  });

  describe('getSupplier', () => {
    it('calls the get g-cloud suppliers endpoint with the correct url and headers', async () => {
      const findSupplierResult = await serviceAPI.getSupplier(supplierId) as FetchResultOK<GCloudSupplier>;

      expect(findSupplierResult.status).to.eq(FetchResultStatus.OK);
      expect(findSupplierResult.data).to.eql(getSupplierData);
    });
  });

  describe('getSupplierFramework', () => {
    it('calls the get g-cloud suppliers endpoint with the correct url and headers', async () => {
      const findSupplierFrameworkResult = await serviceAPI.getSupplierFramework(supplierId) as FetchResultOK<GCloudSupplierFramework>;

      expect(findSupplierFrameworkResult.status).to.eq(FetchResultStatus.OK);
      expect(findSupplierFrameworkResult.data).to.eql(getSupplierFrameworkData);
    });
  });
});
