export interface ServiceModel {
  supplierName: any;
  serviceName: any;
  serviceDescription: any;
  serviceFeatures: any;
  serviceBenefits: any;
  lot: any;

  serviceConstraints: any;
  systemRequirements: any;
  emailOrTicketingSupport: any;
  emailOrTicketingSupportResponseTimes: any;
  emailOrTicketingSupportPriority: any;
  emailOrTicketingSupportAccessibility: any;
  phoneSupport: any;
  phoneSupportAvailability: any;
  webChatSupport: any;
  webChatSupportAvailability: any;
  webChatSupportAccessibility: any;
  webChatSupportAccessibilityDescription: any;
  webChatSupportAccessibilityTesting: any;
  onsiteSupport: any;
  supportLevels: any;
  supportAvailableToThirdParty: any;
  gettingStarted: any;
  documentation: any;
  documentationFormats: any;
  endOfContractDataExtraction: any;
  endOfContractProcess: any;
  webInterface: any;
  webInterfaceUsage: any;
  webInterfaceAccessibility: any;
  webInterfaceAccessibilityDescription: any;
  webInterfaceAccessibilityTesting: any;
  APIHosting: any;
  APIUsage: any;
  APIAutomationTools: any;
  APIAutomationToolsOther: any;
  APIDocumentation: any;
  APIDocumentationFormats: any;
  commandLineInterface: any;
  commandLineOS: any;
  commandLineUsage: any;
  scaling: any;
  scalingType: any;
  independenceOfResources: any;
  usageNotifications: any;
  usageNotificationsHow: any;
  metrics: any;
  metricsWhat: any;
  metricsWhatOther: any;
  metricsHow: any;
  resellingType: any;
  resellingOrganisations: any;
  staffSecurityClearanceChecks: any;
  governmentSecurityClearances: any;
  dataStorageAndProcessing: any;
  dataStorageAndProcessingLocations: any;
  dataStorageAndProcessingUserControl: any;
  datacentreSecurityStandards: any;
  penetrationTesting: any;
  penetrationTestingApproach: any;
  protectionOfDataAtRest: any;
  protectionOfDataAtRestOther: any;
  dataSanitisation: any;
  dataSanitisationType: any;
  equipmentDisposalApproach: any;
  backup: any;
  backupWhatData: any;
  backupControls: any;
  backupDatacentre: any;
  backupScheduling: any;
  backupRecovery: any;
  dataProtectionBetweenNetworks: any;
  dataProtectionBetweenNetworksOther: any;
  dataProtectionWithinNetwork: any;
  guaranteedAvailability: any;
  approachToResilience: any;
  outageReporting: any;
  userAuthentication: any;
  accessRestrictionManagementAndSupport: any;
  accessRestrictionTesting: any;
  managementAccessAuthentication: any;
  devicesUsersManageTheServiceThrough: any;
  auditBuyersActions: any;
  auditBuyersActionsStorage: any;
  auditSuppliersActions: any;
  auditSuppliersActionsStorage: any;
  howLongSystemLogsStored: any;
  standardsISOIEC27001: any;
  standardsISOIEC27001Who: any;
  standardsISOIEC27001When: any;
  standardsISOIEC27001Exclusions: any;
  standardsISO28000: any;
  standardsISO28000Who: any;
  standardsISO28000When: any;
  standardsISO28000Exclusions: any;
  standardsCSASTAR: any;
  standardsCSASTARWhen: any;
  standardsCSASTARLevel: any;
  standardsCSASTARExclusions: any;
  standardsPCI: any;
  standardsPCIWho: any;
  standardsPCIWhen: any;
  standardsPCIExclusions: any;
  accreditationsOther: any;
  accreditationsOtherList: any;
  boardLevelServiceSecurity: any;
  securityGovernanceAccreditation: any;
  securityGovernanceStandards: any;
  securityGovernanceStandardsOther: any;
  informationSecurityPoliciesAndProcesses: any;
  configurationAndChangeManagementType: any;
  configurationAndChangeManagementProcesses: any;
  vulnerabilityManagementType: any;
  vulnerabilityManagementApproach: any;
  protectiveMonitoringType: any;
  protectiveMonitoringApproach: any;
  incidentManagementType: any;
  incidentManagementApproach: any;
  secureDevelopment: any;
  virtualisation: any;
  virtualisationImplementedBy: any;
  virtualisationTechnologiesUsed: any;
  virtualisationTechnologiesUsedOther: any;
  virtualisationSeparation: any;
  energyEfficientDatacentres: any;
  energyEfficientDatacentresDescription: any;
  fightingClimateChange: any;
  covid19Recovery: any;
  tacklingEconomicInequality: any;
  equalOpportunity: any;
  wellbeing: any;
  priceMin: any;
  priceUnit: any;
  priceInterval: any;
  educationPricing: any;
  freeVersionTrialOption: any;
  freeVersionDescription: any;
  freeVersionLink: any;
  pricingDocumentURL: any;
  sfiaRateDocumentURL: any;
  serviceDefinitionDocumentURL: any;
  termsAndConditionsDocumentURL: any;

  pricingDocumentEXTENTION: any;
  sfiaRateDocumentEXTENTION: any;
  serviceDefinitionDocumentEXTENTION: any;
  termsAndConditionsDocumentEXTENTION: any;

  frameworkName: any;
  id: any;
  // cloud software
  serviceAddOnType: any;
  serviceAddOnDetails: any;
  cloudDeploymentModel: any;
  browsersAccess: any;
  browsersSupported: any;
  installation: any;
  installationCompatibleOperatingSystems: any;
  mobile: any;
  mobileDifferences: any;
  serviceInterface: any;
  serviceInterfaceDescription: any;
  serviceInterfaceAccessibility: any;
  serviceInterfaceAccessibilityDescription: any;
  serviceInterfaceTesting: any;
  APISoftware: any;
  APISandbox: any;
  customisationAvailable: any;
  customisationDescription: any;
  metricsDescription: any;
  dataExportHow: any;
  dataExportFormats: any;
  dataExportFormatsOther: any;
  dataImportFormats: any;
  dataImportFormatsOther: any;
  dataProtectionWithinNetworkOther: any;
  userAuthenticationNeeded: any;
  publicSectorNetworks: any;
  publicSectorNetworksTypes: any;
  publicSectorNetworksOther: any;

  // cloud support
  planningService: any;
  planningServiceDescription: any;
  planningServiceCompatibility: any;
  planningServiceCompatibilityList: any;
  training: any;
  trainingDescription: any;
  trainingServiceSpecific: any;
  trainingServiceSpecificList: any;
  setupAndMigrationService: any;
  setupAndMigrationServiceDescription: any;
  setupAndMigrationServiceSpecific: any;
  setupAndMigrationServiceSpecificList: any;
  QAAndTesting: any;
  QAAndTestingDescription: any;
  securityTesting: any;
  securityTestingWhat: any;
  securityTestingAccredited: any;
  securityTestingAccreditations: any;
  ongoingSupport: any;
  ongoingSupportServices: any;
  ongoingSupportDescription: any;
  priceMax: any;
}

export interface SupplierModel {
  contactName: any;
  email: any;
  phoneNumber: any;
  modernSlaveryStatement: any;
  modernSlaveryStatementEXTENTION: any;
  modernSlaveryStatementOption: any;
  modernSlaveryStatementOptionEXTENTION: any;
}
