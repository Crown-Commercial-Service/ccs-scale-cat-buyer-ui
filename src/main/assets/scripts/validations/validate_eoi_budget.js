const ccsZvalidateEoiBudget = event => {
  event.preventDefault();

  let fieldCheck = '',
   fieldChecks = '',
    isError = false,
    errorStore = [];
    const pageHeading = document.getElementById('page-heading').innerHTML;
    
  ccsZremoveErrorMessage($('#eoi_minimum_budget'));
  ccsZremoveErrorMessage($('#eoi_maximum_budget'));

  // fieldCheck = ccsZvalidateWithRegex('eoi_maximum_budget', 'Enter a maximum value with 2 decimals', /^\d{1,}\.\d{2}$/);
  
  if (!pageHeading.includes("(Optional)")) {
  fieldCheck = ccsZvalidateWithRegex('eoi_maximum_budget', 'Enter a maximum value', /^.+$/);
  fieldChecks = ccsZvalidateWithRegex('eoi_maximum_budget','Enter a valid maximum value',/^[+]?(\d*|\d{1,3}(,\d{3})*)(\.\d+)?\b$/);
  }
  
  if (fieldCheck !== true){
    
    if (!pageHeading.includes("(Optional)")) {
    errorStore.push(fieldCheck);
    }

  } 
  else if (fieldChecks !== true) errorStore.push(fieldChecks);
  if ($('#eoi_minimum_budget').val() && $('#eoi_minimum_budget').val().trim().length > 0 && $('#eoi_maximum_budget').val() && $('#eoi_maximum_budget').val().trim().length > 0) {
    fieldCheck = ccsZvalidateWithRegex(
      'eoi_minimum_budget',
      'Enter a minimum value',
      /^.+$/,
    );
    fieldChecks = ccsZvalidateWithRegex(
      'eoi_minimum_budget',
      'Enter a valid minimum value',
      /^[+]?(\d*|\d{1,3}(,\d{3})*)(\.\d+)?\b$/,
    );
    
    if (fieldCheck !== true) {
      errorStore.push(fieldCheck);
    }
    else if (fieldChecks !== true){
      errorStore.push(fieldChecks);
    } 
    else if (Number($('#eoi_maximum_budget').val()) < Number($('#eoi_minimum_budget').val())) {
      errorStore.push(
        ccsZvalidateWithRegex('eoi_minimum_budget', 'Minimum budget should be less than maximum budget', /(?=a)b/),
      );
    }

  }
  if (errorStore.length === 0) {
    document.forms['eoi_budget_form'].submit();
  }
  else {
    ccsZPresentErrorSummary(errorStore);
  }
};
