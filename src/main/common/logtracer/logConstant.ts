export enum logConstant {
    //@ All of the log message content related
    loginSuccess = 'Login successfully',
    logoutSuccess = 'Logout successfully',
    dashLandLog = 'Dashboard page reached',
    chooseCommercialLandLog = 'Choose a commercial agreement page reached',
    aggrementDetailFetch = 'Feached agreement details from Agreement service API',
    lotDetailsFromAggrement = 'Feached Lot details from Agreement service API',
    collaboratorDetailFetch = 'Feached collaborator details from Organization service API',
    userDetailFetch = 'Feached user details from Tender API',
    collaboratorSave = 'Saved collaborator from Tender API',
    collaboratorDelete = 'Delete collaborator from Tender API',
    evenTypeFromAggrementLot = 'Feached event types from specific Agreement lot service API',
    procurementCreated = 'Procurement created',
    procurementPage = 'Procurement page reached',
    postSaveEventsToProject = 'Selected events update to the project',
    exportDetailFetch = 'Download project details from Tender API',
    questionsFetch = 'Feached criterian group questions details from Tender API',
    questionsGroupFetch = 'Feached question group details from Tender API',
    documentsFetch = 'Feached Ir35 documents from Tender API',
    documentsSave = 'Saved Ir35 documents from Tender API',
    saveLeadProcurement = 'Saved Lead Procurement from Tender API',
    fetchEventDetails = 'Fetched event details from project',
    fetchAssesmentDetails = 'Fetched assessment details',
    fetchAssesmentDimentionDetails = 'Fetched assessment dimensions details',
    writePublishPage = 'Write and publish your requirements reached',
    criteriaDetailFetch =' Feached criteria details from Tender API',
    fetchedAssesstmentsQuestions = 'Feached Assesstments Questions from Tender API',
    yourassesstments = 'Your Assesstments page reached',
    saveassesstments = 'Saved Assesstments from Tender API',
    fetchedQuestions = 'Feached Questions from Tender API',
    savequestions = 'Saved Questions from Tender API',
    keyDates = 'Feached Dates from Tender API',
    addContectRequirementPage ='Add context and requirements reached',
    questionDetail ='Question detail',
    questionGroupDetail ='Question group detail',
    questionPage ='Question page reached',
    questionUpdated ='Question updated',
    ResponseDateLog = 'Response Date page reached',
    saveKeyDates = 'Saved Response Date from Tender API',
    ReviewLog = 'Review page reached',
    ReviewSave = 'Published the project from Tender API',
    fetchEvents = 'Feached Events from Tender API',
    fetchServices = 'Feached Services from Tender API',
    fetchSupplierScoreList = 'Feached Supplier Score List from Tender API',
    selectedService = 'Service page reached',
    criterianEventFetch = 'Feached event criteria details from Tender API',
    TaskListPageLog = 'Tasklist page reached',
    typePageLog = 'Type page reached',

    
    saveAssesmentDetails = 'Saved assesment from Tender API',
    savesupplier = 'Saved supplier from Tender API',
    supplierRateCard='Supplier Rate Card page reached',
   

    



    NameAProjectLog = 'Name your project page reached',
    NameAProjectUpdated = 'Name your project updated',
    rfichangeLeadProcurementPageLog='Change who will lead the procurement page reached',
    rfigetUserDetails="Get logged user detail",
    rfigetUserOrgProfile ="Get logged user organisation profiles detail",
    rfichangeLeadProcurementUpdate = 'Change who will lead the procurement Updated',
    rfiaddColleaguesPageLog = 'Add colleagues to your project reached',
    rfiaddColleaguesUpdated = 'Add colleagues to your project reached Updated',
     getUserDetails = 'Get logged user detail',
    getUserOrgProfile = 'Get logged user organisation profiles detail',
    changeLeadProcurementPage = 'Change who will lead the procurement reached',
    changeLeadProcurementUpdate = 'Change who will lead the procurement Updated',
    addColleaguesPage = 'Add colleagues to your project reached',
    addColleaguesUpdated = 'Add colleagues to your project reached Updated',
    addColleaguesDeleted = 'Delete collaborator from Tender API',
    chooseHowBuildYourRfiPageLog = 'Choose how to build your RfI page reached',
    chooseHowBuildYourRfiUpdated = 'Choose how to build your RfI Updated',
    rfiTaskListPageLog = 'Request for Information tasklist page reached',
    buildYourRfiPageLog = 'build your RfI page reached',
    buildYourRfiQuestionList= 'Fetched Rfi Questions From Tender Api',
    rfiQuestionPageLog= 'Rfi Question page reached',
    rfiQuestionDetails= 'Fetched Question details from Tender Api',
    rfiQuestionUpdated="Question updated",
    uploadPricingDocument ="Upload your pricing schedule page reached",
    uploadTermsAndConditionsPageLog="Upload Terms And Conditions Page Reached",
    uploadAdditionalPageLog="Upload additional documents page reached",

    rfiUploadDocumentPageLog="Upload documents page reached",
    rfigetUploadDocument="Fetched Upload Documents From Tender Api",
    rfiUploadDocumentUpdated="New document Uploaded from Tender Api",
    rfiUploadDocumentDeleted="Document deleted From Tender Api",
    rfiViewSuppliersPageLog="View suppliers page reached",
    supplierList="Fetched supplier List From Agreements Api",
    setYourTimeLinePageLog="Set your RfI timeline page reached",
    yourTimeLineUpdate="Rfi Tmeline updated",
    rfiGetTimeLineQuestions="Fetched Timeline Questions From Tender Api",
    reviewAndPublishPageLog="Review and publish your RFI page reached",
    eventDetails="Fetched the event details from tender api",
    rfiPublishLog="Your RfI has been published",
    rfiPublishPageLog="Rfi published page reached",

    eoiTaskListPageLog = 'Expression of Interest tasklist page reached',
    chooseHowBuildYourEoiPageLog = 'Choose how to build your Eoi page reached',
    chooseHowBuildYourEoiUpdated = 'Choose how to build your Eoi Updated',
    questionDetails= 'Fetched Question details from Tender Api',
    buildYourEoiQuestionList= 'Fetched Eoi Questions From Tender Api',
    buildYourEoiPageLog = 'build your Eoi page reached',
    eoiUploadDocumentPageLog="Upload documents page reached",
    UploadDocumentUpdated="New document uploaded From Tender Api",
    UploadDocumentDeleted="Document deleted From Tender Api",
    getUploadDocument="Fetched Upload Documents From Tender Api",
    eoirfiViewSuppliersPageLog="View suppliers page reached",
    setYourTimeLinePage="Set your timeline page reached",
    setYourTimeLineUpdated="Set your timeline updated",
    eoiSetYourTimeLinePageLog="Set your Eoi timeline page reached",
    eoiGetTimeLineQuestions="Fetched Timeline Questions From Tender Api",
     eoiyourTimeLineUpdate="Eoi Tmeline updated",
     eoireviewAndPublishPageLog="Review and publish your EOI page reached",
     eoiPublishLog="Your RfI has been published",
     eoiPublishPageLog="Eoi published page reached",

     chooseACategoryLog = 'Choose a category page reached',
     exportGcloud = 'Export Gcloud documents From Tender Service Api',
     assessmentDetail = 'Fetched Gcloud Assessment Details From Tender Api',
     downloadYourSearch = 'Download Your Search page Reached',
     exportResults = 'Export Results page Reached',
     exportResultsUpdate = 'Export Resultes Updated From Tender Api',
     newSearch = 'New Search page reached',
     savedSearches = 'Saved Search page reached',
     deleteSavedSearch = 'Saved Search deleted From Tender Api',
     supplierDetails="Fetched Supplier details from Aggrement Api",
     getReceivedMessage="Fetched Received messagegs from Tender Api",
     getSupplierResponse="Fetched Supplier Response From Tender Api",
     getSupplierScore="Fetched Supplier Score from tender Api",
     getSupplierAwardDetails="Fetched Supplier Award Details From Tender Api",
     getContractDetails="Fetched Supplier Award Details From Tender Api",
     getQuestionAndAnsDetails="Fetched Questions and answere From Tender Api",
     awardPageLogger="Award Page Reached",
     publishPageLogger="Publish Page Reached",
     
     saveYourSearch = 'Save Your Page Reached',
     saveSearch = 'Saved Search From Tender Api',
     gcSearch = 'Gcloud Search Page Reached',
     gcServices = 'Gcloud Services Page Reached',

}