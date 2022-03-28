const ccsZvalidateRfPAboutBG = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  if ($("#rfp_prob_statement_1").data('mandatory') == true) {
    fieldCheck = ccsZvalidateTextArea("rfp_prob_statement_1", "You must enter information here");
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  }
  if ($("#rfp_prob_statement_2").length > 0) {
    fieldCheck = ccsZvalidateTextArea("rfp_prob_statement_2", "You must enter information here");
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  }

  if (errorStore.length === 0) document.forms["ccs_rfp_about_proj"].submit();
  else ccsZPresentErrorSummary(errorStore);
};
