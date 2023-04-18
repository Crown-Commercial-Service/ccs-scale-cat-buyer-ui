const ccsZvalidateEoiDeadline = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  fieldCheck = ccsZvalidateThisDate( "eoi_response_date", "Deadline must be 7 or more days in the future", 1, 7 );
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  fieldCheck = ccsZvalidateWithRegex( "eoi_response_date_time", "Select a time for your EoI deadline", /^.+$/ );
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_eoi_deadline_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};
