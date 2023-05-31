import * as express from 'express';
import * as path from 'path';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { gCloudApi } from '../util/fetch/apiInstance';
import { ServiceModel, SupplierModel } from '../model/searchModel';
import { logConstant } from '../../../common/logtracer/logConstant';

export const GET_SERVICES = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { id } = req.query;
  const GCLOUD_TOKEN = process.env.GCLOUD_TOKEN;

  try {
    const baseURL = `services/${id}`;
    const { data: serviceData } = await gCloudApi.serviceInstance(GCLOUD_TOKEN).get(baseURL);
    const supplierbaseURL = `suppliers/${serviceData.services.supplierId}`;
    const { data: supplierData } = await gCloudApi.serviceInstance(GCLOUD_TOKEN).get(supplierbaseURL);
    const supplierSlaveryDocumentURL = `suppliers/${serviceData.services.supplierId}/frameworks/g-cloud-13`;
    const { data: supplierSlaveryDocumentData } = await gCloudApi
      .serviceInstance(GCLOUD_TOKEN)
      .get(supplierSlaveryDocumentURL);
    const supplierDetails = {} as SupplierModel;
    if (supplierData != null) {
      supplierDetails.contactName = supplierData.suppliers.contactInformation[0].contactName;
      supplierDetails.email = supplierData.suppliers.contactInformation[0].email;
      supplierDetails.phoneNumber = supplierData.suppliers.contactInformation[0].phoneNumber;

      supplierDetails.modernSlaveryStatement =
        supplierSlaveryDocumentData.frameworkInterest.declaration.modernSlaveryStatement;
      supplierDetails.modernSlaveryStatementEXTENTION =
        supplierSlaveryDocumentData.frameworkInterest.declaration.modernSlaveryStatement !== null &&
        supplierSlaveryDocumentData.frameworkInterest.declaration.modernSlaveryStatement !== undefined
          ? path
            .extname(supplierSlaveryDocumentData.frameworkInterest.declaration.modernSlaveryStatement)
            .replace('.', '')
          : '';

      supplierDetails.modernSlaveryStatementOption =
        supplierSlaveryDocumentData.frameworkInterest.declaration.modernSlaveryStatementOptional;
      supplierDetails.modernSlaveryStatementOptionEXTENTION =
        supplierSlaveryDocumentData.frameworkInterest.declaration.modernSlaveryStatementOptional !== null &&
        supplierSlaveryDocumentData.frameworkInterest.declaration.modernSlaveryStatementOptional !== undefined
          ? path
            .extname(supplierSlaveryDocumentData.frameworkInterest.declaration.modernSlaveryStatementOptional)
            .replace('.', '')
          : '';
    }
    const serviceDetails = {} as ServiceModel;
    if (serviceData != null) {
      serviceDetails.supplierName = serviceData.services.supplierName;
      serviceDetails.serviceName = serviceData.services.serviceName;
      serviceDetails.serviceDescription = serviceData.services.serviceDescription;
      serviceDetails.serviceFeatures = serviceData.services.serviceFeatures;
      serviceDetails.serviceBenefits = serviceData.services.serviceBenefits;
      serviceDetails.lot = serviceData.services.lot;
      serviceDetails.serviceConstraints = serviceData.services.serviceConstraints;
      serviceDetails.systemRequirements = serviceData.services.systemRequirements;
      serviceDetails.emailOrTicketingSupport = serviceData.services.emailOrTicketingSupport;
      serviceDetails.emailOrTicketingSupportResponseTimes = serviceData.services.emailOrTicketingSupportResponseTimes;
      serviceDetails.emailOrTicketingSupportPriority = serviceData.services.emailOrTicketingSupportPriority;
      serviceDetails.emailOrTicketingSupportAccessibility = serviceData.services.emailOrTicketingSupportAccessibility;
      serviceDetails.phoneSupport = serviceData.services.phoneSupport;
      serviceDetails.phoneSupportAvailability = serviceData.services.phoneSupportAvailability;
      serviceDetails.webChatSupport = serviceData.services.webChatSupport;
      serviceDetails.webChatSupportAvailability = serviceData.services.webChatSupportAvailability;
      serviceDetails.webChatSupportAccessibility = serviceData.services.webChatSupportAccessibility;
      serviceDetails.webChatSupportAccessibilityDescription =
        serviceData.services.webChatSupportAccessibilityDescription;
      serviceDetails.webChatSupportAccessibilityTesting = serviceData.services.webChatSupportAccessibilityTesting;
      serviceDetails.onsiteSupport = serviceData.services.onsiteSupport;
      serviceDetails.supportLevels = serviceData.services.supportLevels;
      serviceDetails.supportAvailableToThirdParty = serviceData.services.supportAvailableToThirdParty;
      serviceDetails.gettingStarted = serviceData.services.gettingStarted;
      serviceDetails.documentation = serviceData.services.documentation;
      serviceDetails.documentationFormats = serviceData.services.documentationFormats;
      serviceDetails.endOfContractDataExtraction = serviceData.services.endOfContractDataExtraction;
      serviceDetails.endOfContractProcess = serviceData.services.endOfContractProcess;
      serviceDetails.webInterface = serviceData.services.webInterface;
      serviceDetails.webInterfaceUsage = serviceData.services.webInterfaceUsage;
      serviceDetails.webInterfaceAccessibility = serviceData.services.webInterfaceAccessibility;
      serviceDetails.webInterfaceAccessibilityDescription = serviceData.services.webInterfaceAccessibilityDescription;
      serviceDetails.webInterfaceAccessibilityTesting = serviceData.services.webInterfaceAccessibilityTesting;
      serviceDetails.APIHosting = serviceData.services.APIHosting;
      serviceDetails.APIUsage = serviceData.services.APIUsage;
      serviceDetails.APIAutomationTools = serviceData.services.APIAutomationTools;
      serviceDetails.APIAutomationToolsOther = serviceData.services.APIAutomationToolsOther;
      serviceDetails.APIDocumentation = serviceData.services.APIDocumentation;
      serviceDetails.APIDocumentationFormats = serviceData.services.APIDocumentationFormats;
      serviceDetails.commandLineInterface = serviceData.services.commandLineInterface;
      serviceDetails.commandLineOS = serviceData.services.commandLineOS;
      serviceDetails.commandLineUsage = serviceData.services.commandLineUsage;
      serviceDetails.scaling = serviceData.services.scaling;
      serviceDetails.scalingType = serviceData.services.scalingType;
      serviceDetails.independenceOfResources = serviceData.services.independenceOfResources;
      serviceDetails.usageNotifications = serviceData.services.usageNotifications;
      serviceDetails.usageNotificationsHow = serviceData.services.usageNotificationsHow;
      serviceDetails.metrics = serviceData.services.metrics;
      serviceDetails.metricsWhat = serviceData.services.metricsWhat;
      serviceDetails.metricsWhatOther = serviceData.services.metricsWhatOther;
      serviceDetails.metricsHow = serviceData.services.metricsHow;
      serviceDetails.resellingType = serviceData.services.resellingType;
      serviceDetails.resellingOrganisations = serviceData.services.resellingOrganisations;
      serviceDetails.staffSecurityClearanceChecks = serviceData.services.staffSecurityClearanceChecks;
      serviceDetails.governmentSecurityClearances = serviceData.services.governmentSecurityClearances;
      serviceDetails.dataStorageAndProcessing = serviceData.services.dataStorageAndProcessing;
      serviceDetails.dataStorageAndProcessingLocations = serviceData.services.dataStorageAndProcessingLocations;
      serviceDetails.dataStorageAndProcessingUserControl = serviceData.services.dataStorageAndProcessingUserControl;
      serviceDetails.datacentreSecurityStandards = serviceData.services.datacentreSecurityStandards;
      serviceDetails.penetrationTesting = serviceData.services.penetrationTesting;
      serviceDetails.penetrationTestingApproach = serviceData.services.penetrationTestingApproach;
      serviceDetails.protectionOfDataAtRest = serviceData.services.protectionOfDataAtRest;
      serviceDetails.protectionOfDataAtRestOther = serviceData.services.protectionOfDataAtRestOther;
      serviceDetails.dataSanitisation = serviceData.services.dataSanitisation;
      serviceDetails.dataSanitisationType = serviceData.services.dataSanitisationType;
      serviceDetails.equipmentDisposalApproach = serviceData.services.equipmentDisposalApproach;
      serviceDetails.backup = serviceData.services.backup;
      serviceDetails.backupWhatData = serviceData.services.backupWhatData;
      serviceDetails.backupControls = serviceData.services.backupControls;
      serviceDetails.backupDatacentre = serviceData.services.backupDatacentre;
      serviceDetails.backupScheduling = serviceData.services.backupScheduling;
      serviceDetails.backupRecovery = serviceData.services.backupRecovery;
      serviceDetails.dataProtectionBetweenNetworks = serviceData.services.dataProtectionBetweenNetworks;
      serviceDetails.dataProtectionBetweenNetworksOther = serviceData.services.dataProtectionBetweenNetworksOther;
      serviceDetails.dataProtectionWithinNetwork = serviceData.services.dataProtectionWithinNetwork;
      serviceDetails.guaranteedAvailability = serviceData.services.guaranteedAvailability;
      serviceDetails.approachToResilience = serviceData.services.approachToResilience;
      serviceDetails.outageReporting = serviceData.services.outageReporting;
      serviceDetails.userAuthentication = serviceData.services.userAuthentication;
      serviceDetails.accessRestrictionManagementAndSupport = serviceData.services.accessRestrictionManagementAndSupport;
      serviceDetails.accessRestrictionTesting = serviceData.services.accessRestrictionTesting;
      serviceDetails.managementAccessAuthentication = serviceData.services.managementAccessAuthentication;
      serviceDetails.devicesUsersManageTheServiceThrough = serviceData.services.devicesUsersManageTheServiceThrough;
      serviceDetails.auditBuyersActions = serviceData.services.auditBuyersActions;
      serviceDetails.auditBuyersActionsStorage = serviceData.services.auditBuyersActionsStorage;
      serviceDetails.auditSuppliersActions = serviceData.services.auditSuppliersActions;
      serviceDetails.auditSuppliersActionsStorage = serviceData.services.auditSuppliersActionsStorage;
      serviceDetails.howLongSystemLogsStored = serviceData.services.howLongSystemLogsStored;
      serviceDetails.standardsISOIEC27001 = serviceData.services.standardsISOIEC27001;
      serviceDetails.standardsISOIEC27001Who = serviceData.services.standardsISOIEC27001Who;
      serviceDetails.standardsISOIEC27001When = serviceData.services.standardsISOIEC27001When;
      serviceDetails.standardsISOIEC27001Exclusions = serviceData.services.standardsISOIEC27001Exclusions;
      serviceDetails.standardsISO28000 = serviceData.services.standardsISO28000;
      serviceDetails.standardsISO28000Who = serviceData.services.standardsISO28000Who;
      serviceDetails.standardsISO28000When = serviceData.services.standardsISO28000When;
      serviceDetails.standardsISO28000Exclusions = serviceData.services.standardsISO28000Exclusions;
      serviceDetails.standardsCSASTAR = serviceData.services.standardsCSASTAR;
      serviceDetails.standardsCSASTARWhen = serviceData.services.standardsCSASTARWhen;
      serviceDetails.standardsCSASTARLevel = serviceData.services.standardsCSASTARLevel;
      serviceDetails.standardsCSASTARExclusions = serviceData.services.standardsCSASTARExclusions;
      serviceDetails.standardsPCI = serviceData.services.standardsPCI;
      serviceDetails.standardsPCIWho = serviceData.services.standardsPCIWho;
      serviceDetails.standardsPCIWhen = serviceData.services.standardsPCIWhen;
      serviceDetails.standardsPCIExclusions = serviceData.services.standardsPCIExclusions;
      serviceDetails.accreditationsOther = serviceData.services.accreditationsOther;
      serviceDetails.accreditationsOtherList = serviceData.services.accreditationsOtherList;
      serviceDetails.boardLevelServiceSecurity = serviceData.services.boardLevelServiceSecurity;
      serviceDetails.securityGovernanceAccreditation = serviceData.services.securityGovernanceAccreditation;
      serviceDetails.securityGovernanceStandards = serviceData.services.securityGovernanceStandards;
      serviceDetails.securityGovernanceStandardsOther = serviceData.services.securityGovernanceStandardsOther;
      serviceDetails.informationSecurityPoliciesAndProcesses =
        serviceData.services.informationSecurityPoliciesAndProcesses;
      serviceDetails.configurationAndChangeManagementType = serviceData.services.configurationAndChangeManagementType;
      serviceDetails.configurationAndChangeManagementProcesses =
        serviceData.services.configurationAndChangeManagementProcesses;
      serviceDetails.vulnerabilityManagementType = serviceData.services.vulnerabilityManagementType;
      serviceDetails.vulnerabilityManagementApproach = serviceData.services.vulnerabilityManagementApproach;
      serviceDetails.protectiveMonitoringType = serviceData.services.protectiveMonitoringType;
      serviceDetails.protectiveMonitoringApproach = serviceData.services.protectiveMonitoringApproach;
      serviceDetails.incidentManagementType = serviceData.services.incidentManagementType;
      serviceDetails.incidentManagementApproach = serviceData.services.incidentManagementApproach;
      serviceDetails.secureDevelopment = serviceData.services.secureDevelopment;
      serviceDetails.virtualisation = serviceData.services.virtualisation;
      serviceDetails.virtualisationImplementedBy = serviceData.services.virtualisationImplementedBy;
      serviceDetails.virtualisationTechnologiesUsed = serviceData.services.virtualisationTechnologiesUsed;
      serviceDetails.virtualisationTechnologiesUsedOther = serviceData.services.virtualisationTechnologiesUsedOther;
      serviceDetails.virtualisationSeparation = serviceData.services.virtualisationSeparation;
      serviceDetails.energyEfficientDatacentres = serviceData.services.energyEfficientDatacentres;
      serviceDetails.energyEfficientDatacentresDescription = serviceData.services.energyEfficientDatacentresDescription;
      serviceDetails.fightingClimateChange = serviceData.services.fightingClimateChange;
      serviceDetails.covid19Recovery = serviceData.services.covid19Recovery;
      serviceDetails.tacklingEconomicInequality = serviceData.services.tacklingEconomicInequality;
      serviceDetails.equalOpportunity = serviceData.services.equalOpportunity;
      serviceDetails.wellbeing = serviceData.services.wellbeing;
      serviceDetails.priceMin = serviceData.services.priceMin;
      serviceDetails.priceUnit =
        serviceData.services.priceUnit !== null && serviceData.services.priceUnit !== undefined
          ? await priceContent(serviceData.services.priceUnit)
          : '';
      serviceDetails.priceInterval =
        serviceData.services.priceInterval !== null && serviceData.services.priceInterval !== undefined
          ? await priceContent(serviceData.services.priceInterval)
          : '';
      serviceDetails.educationPricing = serviceData.services.educationPricing;
      serviceDetails.freeVersionTrialOption = serviceData.services.freeVersionTrialOption;
      serviceDetails.freeVersionDescription = serviceData.services.freeVersionDescription;
      serviceDetails.freeVersionLink =
        serviceData.services.freeVersionLink !== null && serviceData.services.freeVersionLink !== undefined
          ? await addhttp(serviceData.services.freeVersionLink)
          : null;

      serviceDetails.pricingDocumentURL = serviceData.services.pricingDocumentURL;
      serviceDetails.sfiaRateDocumentURL = serviceData.services.sfiaRateDocumentURL;
      serviceDetails.serviceDefinitionDocumentURL = serviceData.services.serviceDefinitionDocumentURL;
      serviceDetails.termsAndConditionsDocumentURL = serviceData.services.termsAndConditionsDocumentURL;

      serviceDetails.pricingDocumentEXTENTION =
        serviceData.services.pricingDocumentURL !== null && serviceData.services.pricingDocumentURL !== undefined
          ? path.extname(serviceData.services.pricingDocumentURL).replace('.', '')
          : '';

      serviceDetails.sfiaRateDocumentEXTENTION =
        serviceData.services.sfiaRateDocumentURL !== null && serviceData.services.sfiaRateDocumentURL !== undefined
          ? path.extname(serviceData.services.sfiaRateDocumentURL).replace('.', '')
          : '';

      serviceDetails.serviceDefinitionDocumentEXTENTION =
        serviceData.services.serviceDefinitionDocumentURL !== null &&
        serviceData.services.serviceDefinitionDocumentURL !== undefined
          ? path.extname(serviceData.services.serviceDefinitionDocumentURL).replace('.', '')
          : '';
      serviceDetails.termsAndConditionsDocumentEXTENTION =
        serviceData.services.termsAndConditionsDocumentURL !== null &&
        serviceData.services.termsAndConditionsDocumentURL !== undefined
          ? path.extname(serviceData.services.termsAndConditionsDocumentURL).replace('.', '')
          : '';

      serviceDetails.frameworkName = serviceData.services.frameworkName;
      serviceDetails.id = serviceData.services.id;

      // cloud software
      serviceDetails.serviceAddOnType = serviceData.services.serviceAddOnType;
      serviceDetails.serviceAddOnDetails = serviceData.services.serviceAddOnDetails;
      serviceDetails.cloudDeploymentModel = serviceData.services.cloudDeploymentModel;
      serviceDetails.browsersAccess = serviceData.services.browsersAccess;
      serviceDetails.browsersSupported = serviceData.services.browsersSupported;
      serviceDetails.installation = serviceData.services.installation;
      serviceDetails.installationCompatibleOperatingSystems =
        serviceData.services.installationCompatibleOperatingSystems;
      serviceDetails.mobile = serviceData.services.mobile;
      serviceDetails.mobileDifferences = serviceData.services.mobileDifferences;
      serviceDetails.serviceInterface = serviceData.services.serviceInterface;
      serviceDetails.serviceInterfaceDescription = serviceData.services.serviceInterfaceDescription;
      serviceDetails.serviceInterfaceAccessibility = serviceData.services.serviceInterfaceAccessibility;
      serviceDetails.serviceInterfaceAccessibilityDescription =
        serviceData.services.serviceInterfaceAccessibilityDescription;
      serviceDetails.serviceInterfaceTesting = serviceData.services.serviceInterfaceTesting;
      serviceDetails.APISoftware = serviceData.services.APISoftware;
      serviceDetails.APISandbox = serviceData.services.APISandbox;
      serviceDetails.customisationAvailable = serviceData.services.customisationAvailable;
      serviceDetails.customisationDescription = serviceData.services.customisationDescription;
      serviceDetails.metricsDescription = serviceData.services.metricsDescription;
      serviceDetails.dataExportHow = serviceData.services.dataExportHow;
      serviceDetails.dataExportFormats = serviceData.services.dataExportFormats;
      serviceDetails.dataExportFormatsOther = serviceData.services.dataExportFormatsOther;
      serviceDetails.dataImportFormats = serviceData.services.dataImportFormats;
      serviceDetails.dataImportFormatsOther = serviceData.services.dataImportFormatsOther;
      serviceDetails.dataProtectionWithinNetworkOther = serviceData.services.dataProtectionWithinNetworkOther;
      serviceDetails.userAuthenticationNeeded = serviceData.services.userAuthenticationNeeded;
      serviceDetails.publicSectorNetworks = serviceData.services.publicSectorNetworks;
      serviceDetails.publicSectorNetworksTypes = serviceData.services.publicSectorNetworksTypes;
      serviceDetails.publicSectorNetworksOther = serviceData.services.publicSectorNetworksOther;

      // cloud support
      serviceDetails.planningService = serviceData.services.planningService;
      serviceDetails.planningServiceDescription = serviceData.services.planningServiceDescription;
      serviceDetails.planningServiceCompatibility = serviceData.services.planningServiceCompatibility;
      serviceDetails.planningServiceCompatibilityList = serviceData.services.planningServiceCompatibilityList;
      serviceDetails.training = serviceData.services.training;
      serviceDetails.trainingDescription = serviceData.services.trainingDescription;
      serviceDetails.trainingServiceSpecific = serviceData.services.trainingServiceSpecific;
      serviceDetails.trainingServiceSpecificList = serviceData.services.trainingServiceSpecificList;
      serviceDetails.setupAndMigrationService = serviceData.services.setupAndMigrationService;
      serviceDetails.setupAndMigrationServiceDescription = serviceData.services.setupAndMigrationServiceDescription;
      serviceDetails.setupAndMigrationServiceSpecific = serviceData.services.setupAndMigrationServiceSpecific;
      serviceDetails.setupAndMigrationServiceSpecificList = serviceData.services.setupAndMigrationServiceSpecificList;
      serviceDetails.QAAndTesting = serviceData.services.QAAndTesting;
      serviceDetails.QAAndTestingDescription = serviceData.services.QAAndTestingDescription;
      serviceDetails.securityTesting = serviceData.services.securityTesting;
      serviceDetails.securityTestingWhat = serviceData.services.securityTestingWhat;
      serviceDetails.securityTestingAccredited = serviceData.services.securityTestingAccredited;
      serviceDetails.securityTestingAccreditations = serviceData.services.securityTestingAccreditations;
      serviceDetails.ongoingSupport = serviceData.services.ongoingSupport;
      serviceDetails.ongoingSupportServices = serviceData.services.ongoingSupportServices;
      serviceDetails.ongoingSupportDescription = serviceData.services.ongoingSupportDescription;
      serviceDetails.priceMax = serviceData.services.priceMax;
    }

    const releatedContent = req.session.releatedContent;
    const appendData = {
      releatedContent: releatedContent,
      lotId: req.session.lotId,
      agreementLotName: req.session.agreementLotName,
      serviceDetails,
      supplierDetails,
      returnto: `/g-cloud/search${req.session.searchResultsUrl == undefined ? '' : '?' + req.session.searchResultsUrl}`,
    };
    //CAS-INFO-LOG
    LoggTracer.infoLogger(null, logConstant.gcServices, req);
    res.render('services', appendData);
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'G-Cloud 13 throws error - Tenders Api is causing problem',
      true
    );
  }
};

async function priceContent(name: any) {
  const result = ['a', 'e', 'i', 'o', 'hour'].some((word) => name.startsWith(word));
  if (result) {
    return `an ${name}`;
  } else {
    return `a ${name}`;
  }
}

async function addhttp(url: any) {
  if (!/^(?:f|ht)tps?:\/\//.test(url)) {
    url = 'http://' + url;
  }
  return url;
}
