const ccsZvalidateEoiContact = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  fieldCheck = ccsZisOptionChecked( "use_stored_contact", "Select an option");
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_eoi_contact_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};
