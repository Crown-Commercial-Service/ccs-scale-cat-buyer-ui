const ccsZvalidateRfiWho = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  fieldCheck = ccsZvalidateWithRegex( "rfi_contracting_auth", "Specify the contracting authority", /^.+$/ );
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_rfi_who_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};
