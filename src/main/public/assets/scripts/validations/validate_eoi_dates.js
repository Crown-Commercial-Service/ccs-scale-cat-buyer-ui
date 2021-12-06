const ccsZvalidateEoiDates = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    endDateStore = [],
    errorStore = [];

  fieldCheck = ccsZvalidateThisDate("eoi_proj_start_date", "Service Start Date must be a valid future date", 1, 0);
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  fieldCheck = ccsZvalidateWithRegex("eoi_proj_duration_number", "Specify the project duration", /^.+$/);
  if (fieldCheck !== true) endDateStore.push(fieldCheck);

  fieldCheck = ccsZvalidateThisDate("eoi_proj_end_date", "Service End Date must be a valid future date", 1, 0);
  if (fieldCheck !== true) endDateStore.push(fieldCheck);

  if (endDateStore.length === 2) {
    errorStore.push(["eoi_proj_duration_number", "One of either project duration or project end date must be specified"]);
  } else if (document.getElementById("eoi_proj_duration_number").value < 1) {
    errorStore.push(["eoi_proj_duration_number", "Project end date must be after project start date"]);
  }

  if (errorStore.length === 0) document.forms["ccs_eoi_dates_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};
const ccsZvalidateEoiResponseDate = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    endDateStore = [],
    errorStore = [];

  fieldCheck = ccsZvalidateThisDate("eoi_response_date", "Response date must be a valid future date", 1, 0);
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_eoi_response_date_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};