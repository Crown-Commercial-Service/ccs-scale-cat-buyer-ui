const ccsZvalidateRfPAboutBG = event => {
  event.preventDefault();
  
  let fieldCheck = '',
    errorStore = [];

  if ($('#rfp_prob_statement_1').data('mandatory') == true) {
    fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_1', 'You must enter information here');
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  }
  if ($('#rfp_prob_statement_2').length > 0) {
    fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_2', 'You must enter information here');
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  }

  if (errorStore.length === 0) document.forms['ccs_rfp_about_proj'].submit();
  else ccsZPresentErrorSummary(errorStore);
};

const ccsZvalidateTextRfpChangeStrategy = event => {
  event.preventDefault();
  const classList = document.getElementsByClassName('govuk-hint-error-message');
  const classLength = classList.length;
  const pageHeading = document.getElementById('page-heading').innerHTML;
  errorStore = [];

  if ($('#rfp_contracting_auth').val() != undefined && $('#rfp_contracting_auth').val().length == 0 && (!pageHeading.includes("(Optional)") && !pageHeading.includes("(optional)"))) {
    if(pageHeading.trim().toLowerCase() == 'Summary of work'.toLowerCase()){
      fieldCheck = ccsZvalidateTextArea('rfp_contracting_auth', 'Enter your project summary ');
    }else{
      fieldCheck = ccsZvalidateTextArea('rfp_contracting_auth', 'You must enter information here');
    }
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  }
  const textPatternNew = /^[a-zA-Z,]+$/;
  var rfp_contracting_auth = document.getElementById('rfp_contracting_auth');
  var errorMsg = 'Supplier must be minimum 3';
  if($('#rfp_contracting_auth').val() != null && $('#rfp_contracting_auth').val() != '' && (pageHeading.includes("(Optional)"))){
    if(rfp_contracting_auth.value.length > 0 &&
      textPatternNew.test(rfp_contracting_auth.value) !== true){
      errorMsg = 'Please enter only character';
      fieldCheck = ccsZvalidateTextArea('rfp_contracting_auth', 'Please enter only character');
      if (fieldCheck !== true) errorStore.push(['rfp_contracting_auth', 'Please enter only character']);
    }
    
  }

    

  if (errorStore.length > 0) {
      ccsZPresentErrorSummary(errorStore);
      ccsZaddErrorMessage(rfp_contracting_auth, errorMsg);
  } else {
    errorStore = [];
    document.forms['ccs_rfp_who_form'].submit();
  }
  if (classLength != 0) {
    
    return false;
  }
};
