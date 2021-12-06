const ccsZvalidateEoiWho = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  fieldCheck = ccsZvalidateWithRegex("eoi_contracting_auth", "Specify the contracting authority", /^.+$/);
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_eoi_who_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};
