const ccsZvalidateRfiProject = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  fieldCheck = ccsZvalidateTextArea("rfi_prob_statement", "You must enter information here");
  if (fieldCheck !== true && fieldCheck !== undefined) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_rfi_about_proj"].submit();
  else ccsZPresentErrorSummary(errorStore);
};
