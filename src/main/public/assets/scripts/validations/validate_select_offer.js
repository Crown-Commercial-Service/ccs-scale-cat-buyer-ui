const ccsZvalidateSelectOffer = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  fieldCheck = ccsZisOptionChecked( "offer_required", "Select an option");
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_select_offer"].submit();
  else ccsZPresentErrorSummary(errorStore);
};
