const ccsZvalidateRfiProjectStatus = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

    fieldCheck = ccsZvalidateWithRegex( "rfi_prog_phase", "Enter the current phase of your project", /^.+$/ );
    if (fieldCheck !== true) errorStore.push(fieldCheck);

    fieldCheck = ccsZvalidateWithRegex( "rfi_prog_phase_req", "Specify the phase that the resource will work on", /^.+$/ );
    if (fieldCheck !== true) errorStore.push(fieldCheck);

    // fieldCheck = ccsZvalidateTextArea( "rfi_work_to_date", "Describe the work carried out to date on the problem" );
    // if (fieldCheck !== true) errorStore.push(fieldCheck);

    fieldCheck = ccsZvalidateTextArea( "rfi_engagement_to_date", "Describe any market engagement carried out to date" );
    if (fieldCheck !== true) errorStore.push(fieldCheck);

    fieldCheck = ccsZvalidateWithRegex( "rfi_work_arrangements", "Specify the working arrangements", /^.+$/ );
    if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) {
    document.forms["ccs_rfi_proj_status"].submit();
  }
  else ccsZPresentErrorSummary(errorStore);
};
