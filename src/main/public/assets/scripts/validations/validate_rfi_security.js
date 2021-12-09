const ccsZvalidateRfiSecurity = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  fieldCheck = ccsZisOptionChecked( "ccs_vetting_type", "You must provide a security clearance level before proceeding");
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_eoi_vetting_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};
