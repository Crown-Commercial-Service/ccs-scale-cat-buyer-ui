const ccsZvalidateEoiBudget = event => {
  event.preventDefault();

  let fieldCheck = '',
    isError = false,
    errorStore = [];
  ccsZremoveErrorMessage($('#eoi_minimum_budget'));
  ccsZremoveErrorMessage($('#eoi_maximum_budget'));

  fieldCheck = ccsZvalidateWithRegex('eoi_maximum_budget', 'Enter a maximum value with 2 decimals', /^\d{1,}\.\d{2}$/);
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if ($('#eoi_minimum_budget').val().trim().length > 0 && $('#eoi_maximum_budget').val().trim().length > 0) {
    fieldCheck = ccsZvalidateWithRegex(
      'eoi_minimum_budget',
      'Enter a minimum value with 2 decimals',
      /^\d{1,}\.\d{2}$/,
    );
    if (fieldCheck !== true) errorStore.push(fieldCheck);
    else if (Number($('#eoi_maximum_budget').val()) < Number($('#eoi_minimum_budget').val())) {
      errorStore.push(
        ccsZvalidateWithRegex('eoi_minimum_budget', 'Minimum budget should be less than maximum budget', /(?=a)b/),
      );
    }
  }

  if (errorStore.length === 0) document.forms['eoi_budget_form'].submit();
  else ccsZPresentErrorSummary(errorStore);
};
