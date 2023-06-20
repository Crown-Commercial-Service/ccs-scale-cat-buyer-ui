import { expect } from 'chai';
import { Interceptable, MockAgent, setGlobalDispatcher } from 'undici';
import { FetchResultOK, FetchResultStatus } from 'main/services/types/helpers/api';
import { serviceAPI } from 'main/services/gCloud/service/api';
import { GCloudService, GCloudSupplier, GCloudSupplierFramework } from 'main/services/types/gCloud/service/api';

describe('G-Cloud Service API helpers', () => {
  const baseURL = process.env.GCLOUD_SERVICES_API_URL;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.GCLOUD_TOKEN}`
  };
  let mockPool: Interceptable;

  beforeEach(() => {
    const mockAgent = new MockAgent();
    mockPool = mockAgent.get(baseURL);
    setGlobalDispatcher(mockAgent);
  });

  describe('getService', () => {
    const serviceId = 'serviceId-1234';
    const path = `/services/${serviceId}`;

    it('calls the get g-cloud services endpoint with the correct url and headers', async () => {
      mockPool.intercept({
        method: 'GET',
        path: path,
        headers: headers
      }).reply(200, {
        serviceMadeUnavailableAuditEvent: null,
        services: {
          myService: true
        }
      });

      const findServiceResult = await serviceAPI.getService(serviceId) as FetchResultOK<GCloudService>;

      expect(findServiceResult.status).to.eq(FetchResultStatus.OK);
      expect(findServiceResult.data).to.eql({
        serviceMadeUnavailableAuditEvent: null,
        services: {
          myService: true
        }
      });
    });
  });

  describe('getSupplier', () => {
    const supplierId = 'supplierId-1234';
    const path = `/suppliers/${supplierId}`;

    it('calls the get g-cloud suppliers endpoint with the correct url and headers', async () => {
      mockPool.intercept({
        method: 'GET',
        path: path,
        headers: headers
      }).reply(200, {
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
      });

      const findSupplierResult = await serviceAPI.getSupplier(supplierId) as FetchResultOK<GCloudSupplier>;

      expect(findSupplierResult.status).to.eq(FetchResultStatus.OK);
      expect(findSupplierResult.data).to.eql({
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
      });
    });
  });

  describe('getSupplierFramework', () => {
    const supplierId = 'supplierId-1234';
    const path = `/suppliers/${supplierId}/frameworks/g-cloud-13`;

    it('calls the get g-cloud suppliers endpoint with the correct url and headers', async () => {
      mockPool.intercept({
        method: 'GET',
        path: path,
        headers: headers
      }).reply(200, {
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
          agreementId: 'myAgreementId',
          agreementPath: null,
          agreementReturned: true,
          agreementReturnedAt: 'myAgreementReturnedAt',
          agreementStatus: 'myAgreementStatus',
          allowDeclarationReuse: 'myAllowDeclarationReuse',
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
      });

      const findSupplierFrameworkResult = await serviceAPI.getSupplierFramework(supplierId) as FetchResultOK<GCloudSupplierFramework>;

      expect(findSupplierFrameworkResult.status).to.eq(FetchResultStatus.OK);
      expect(findSupplierFrameworkResult.data).to.eql({
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
          agreementId: 'myAgreementId',
          agreementPath: null,
          agreementReturned: true,
          agreementReturnedAt: 'myAgreementReturnedAt',
          agreementStatus: 'myAgreementStatus',
          allowDeclarationReuse: 'myAllowDeclarationReuse',
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
      });
    });
  });
});
