const ccsZvalidateEoiType = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  fieldCheck = ccsZisOptionChecked("ccs_eoi_type", "Select an option");
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_eoi_type_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};