function initializeErrorStoreForFieldCheck(event) {
  event.preventDefault();
  let fieldCheck = "", errorStore = [];
  return { fieldCheck, errorStore };
}

function getGroup (event) {
  return decodeURI(event.currentTarget.action.match(/(\?|&)group_id\=([^&]*)/)[2]);
}

const ccsZvalidateIR35acknowledgement = (event) => {
  let { fieldCheck, errorStore } = initializeErrorStoreForFieldCheck(event);

  fieldCheck = ccsZisOptionChecked( "IR35_acknowledgement", "Please select an option");
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_ir35_acknowledgement_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
}

const ccsZvalidateCompetitionRoute = (event) => {
  let { fieldCheck, errorStore } = initializeErrorStoreForFieldCheck(event);
  fieldCheck = ccsZisOptionChecked( "ccs_route_to_market", "Please select an option");
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_route_to_market_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
}

const ccsZvalidateBuildType= (event) => {
  let { fieldCheck, errorStore } = initializeErrorStoreForFieldCheck(event);
  fieldCheck = ccsZisOptionChecked( "ccs_fc_type", "Please select an option");
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_rfp_type_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
}

const ccsZvalidateProjectPhase = (event) => {
  let { fieldCheck, errorStore } = initializeErrorStoreForFieldCheck(event);
  fieldCheck = ccsZisOptionChecked( "ccs_rfp_project_phase", "Please select an option");
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_rfp_project_phase_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
}

const ccsZvalidateRfiSecurity = (event) => {
  let { fieldCheck, errorStore } = initializeErrorStoreForFieldCheck(event);
  fieldCheck = ccsZisOptionCheckedForVetting( "ccs_vetting_type", "You must provide a security clearance level before proceeding");
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_rfi_vetting_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};

const ccsZvalidateEoiSecurity = (event) => {
  let { fieldCheck, errorStore } = initializeErrorStoreForFieldCheck(event);
  let msg = (getGroup(event) === 'Group 6') ? "Select whether this is a new or replacement product or service, or ‘Not sure’" : "Select a security clearance level";
      if(urlParams.get('agreement_id') == 'RM6187' && getGroup(event) === 'Group 7') msg = "Select whether there is an existing supplier";
  
  fieldCheck = ccsZisOptionChecked("ccs_vetting_type", msg);
  if (fieldCheck !== true) errorStore.push(fieldCheck);
  if ($('#rfp_security_confirmation') !== undefined && $('#rfp_security_confirmation').val() !== undefined && $("input[name='ccs_vetting_type']").prop('checked')) {
    // errorStore.length = 0;
    
    if ($('#rfp_security_confirmation').val().length === 0) {      
       if(urlParams.get('agreement_id') == 'RM6187' && getGroup(event) === 'Group 7')
            fieldCheck = ccsZvalidateTextArea('rfp_security_confirmation', 'You have the option to enter the name of an existing supplier.');
       else fieldCheck = ccsZvalidateTextArea('rfp_security_confirmation', 'Provide the name of the incumbent supplier');
       if (fieldCheck !== true) errorStore.push(fieldCheck);
     }
     else if ($('#rfp_security_confirmation').val().length > 500) {
       fieldCheck = ccsZvalidateTextArea('rfp_security_confirmation', 'supplier name must be less than 500 characters');
       if (fieldCheck !== true) errorStore.push(fieldCheck);
     }
  }

  if (errorStore.length === 0) document.forms["ccs_eoi_vetting_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};

const ccsZvalidateRfpSecurity = (event) => {
  let { fieldCheck, errorStore } = initializeErrorStoreForFieldCheck(event);
  fieldCheck = ccsZisOptionChecked( "ccs_rfp_vetting_type", "You must provide a security clearance level before proceeding");
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_rfp_vetting_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};

const ccsZvalidateCaaAssFCSecurity = (event) => {
  let { fieldCheck, errorStore } = initializeErrorStoreForFieldCheck(event);
  fieldCheck = ccsZisOptionChecked("ccs_vetting_type", "Enter your team scale");
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_ca_type_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};

const ccsZvalidateRfiType = (event) => {
  let { fieldCheck, errorStore } = initializeErrorStoreForFieldCheck(event);

  fieldCheck = ccsZisOptionChecked( "ccs_rfi_type", "Select how you will build your RfI");
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_rfi_type_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};

const ccsZvalidateRfiMcfType = (event) => {
  let { fieldCheck, errorStore } = initializeErrorStoreForFieldCheck(event);

  fieldCheck = ccsZisOptionChecked( "results-per-page-1", "Select how you will build your RfI");
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["choose_build_rfi"].submit();
  else ccsZPresentErrorSummary(errorStore);
};


const ccsZvalidateEoiType = (event) => {
  let { fieldCheck, errorStore } = initializeErrorStoreForFieldCheck(event);

  fieldCheck = ccsZisOptionChecked( "ccs_eoi_type", "Select an option");
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_eoi_type_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};

const ccsZvalidateEoiServiceType = (event) => {
  let { fieldCheck, errorStore } = initializeErrorStoreForFieldCheck(event);
  fieldCheck = ccsZisOptionChecked( "eoi_service_type", "Please select an option");
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_eoi_new_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
}

const ccsZvalidatePreMarketRoute = (event) => {
  let { fieldCheck, errorStore } = initializeErrorStoreForFieldCheck(event);
  fieldCheck = ccsZisOptionChecked( "choose_pre_engage", "Please select an option");
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_choose_pre_engage"].submit();
  else ccsZPresentErrorSummary(errorStore);
}