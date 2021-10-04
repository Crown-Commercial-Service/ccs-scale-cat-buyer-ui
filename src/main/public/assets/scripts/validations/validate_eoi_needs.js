const ccsZvalidateEoiNeeds = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  fieldCheck = ccsZvalidateTextArea( "eoi_about_cust_org", "Briefly describe your organisation" );
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  fieldCheck = ccsZvalidateTextArea( "eoi_work_objectives", "Briefly describe the aims and objectives of the work" );
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_eoi_needs"].submit();
  else ccsZPresentErrorSummary(errorStore);
};
