const ccsZvalidateEoiProject = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  // fieldCheck = ccsZvalidateWithRegex( "rfi_prog_name", "Enter the Project / Programme Name", /^.+$/ );
  // if (fieldCheck !== true) errorStore.push(fieldCheck);

  // fieldCheck = ccsZvalidateTextArea( "rfi_why_this_work", "Describe why this work is required" );
  // if (fieldCheck !== true) errorStore.push(fieldCheck);

  fieldCheck = ccsZvalidateTextArea("eoi_prob_statement", "You must enter information here");
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  // fieldCheck = ccsZvalidateTextArea( "rfi_will_work_on", "Describe the areas or techologies the resource will work on" );
  // if (fieldCheck !== true) errorStore.push(fieldCheck);

  // fieldCheck = ccsZvalidateWithRegex( "rfi_key_users_name", "List the key users", /^.+$/ );
  // if (fieldCheck !== true) errorStore.push(fieldCheck);

  // fieldCheck = ccsZvalidateTextArea( "rfi_key_users_outcomes", "Describe your key outcomes" );
  // if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_eoi_about_proj"].submit();
  else ccsZPresentErrorSummary(errorStore);
};
