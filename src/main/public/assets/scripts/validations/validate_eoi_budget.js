const ccsZvalidateEoiBudget = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  if (document.getElementById("eoi_min_budget").value.trim().length > 0) {
    fieldCheck = ccsZvalidateWithRegex( "eoi_min_budget", "Enter a numeric minimum value", /^\d{1,}$/ );
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  }

  fieldCheck = ccsZvalidateWithRegex( "eoi_max_budget", "Enter a numeric maximum value", /^\d{1,}$/ );
  if (fieldCheck !== true) errorStore.push(fieldCheck);


  if (errorStore.length === 0) document.forms["ccs_eoi_budget_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};
