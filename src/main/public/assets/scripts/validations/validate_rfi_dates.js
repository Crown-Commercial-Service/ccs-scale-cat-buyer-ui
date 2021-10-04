const ccsZvalidateRfiDates = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    endDateStore = [],
    errorStore = [];

  fieldCheck = ccsZvalidateThisDate( "rfi_proj_start_date", "Service Start Date must be a valid future date", 1, 0 );
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  fieldCheck = ccsZvalidateWithRegex( "rfi_proj_duration_number", "Specify the project duration", /^.+$/ );
  if (fieldCheck !== true) endDateStore.push(fieldCheck);

  fieldCheck = ccsZvalidateThisDate( "rfi_proj_end_date", "Service End Date must be a valid future date", 1, 0 );
  if (fieldCheck !== true) endDateStore.push(fieldCheck);

  if (endDateStore.length === 2) {
    errorStore.push(["rfi_proj_duration_number", "One of either project duration or project end date must be specified"]);
  } else if (document.getElementById("rfi_proj_duration_number").value < 1) {
    errorStore.push(["rfi_proj_duration_number", "Project end date must be after project start date"]);
  }

  if (errorStore.length === 0) document.forms["ccs_rfi_dates_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};
const ccsZvalidateRfiResponseDate = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    endDateStore = [],
    errorStore = [];

  fieldCheck = ccsZvalidateThisDate( "rfi_response_date", "Response date must be a valid future date", 1, 0 );
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_rfi_response_date_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};