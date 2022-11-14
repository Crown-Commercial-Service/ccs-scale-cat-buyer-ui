const ccsZvalidateCreateOrChoose = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  fieldCheck = ccsZisOptionChecked( "create_or_choose", "Select an option");
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_create_or_choose"].submit();
  else ccsZPresentErrorSummary(errorStore);
};
