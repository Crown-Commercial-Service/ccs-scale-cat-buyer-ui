const ccsZvalidateEoiBudget = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  if (document.getElementById("eoi_minimum_budget").value.trim().length > 0) {
    fieldCheck = ccsZvalidateWithRegex( "eoi_minimum_budget", "Enter a numeric minimum value", /^\d{1,}$/ );
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  }

  fieldCheck = ccsZvalidateWithRegex( "eoi_maximum_budget", "Enter a numeric maximum value", /^\d{1,}$/ );
  if (fieldCheck !== true) errorStore.push(fieldCheck);


  if (errorStore.length === 0) document.forms["eoi_budget_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};
