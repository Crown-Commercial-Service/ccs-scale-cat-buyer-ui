const ccsZvalidateEoiProjectName = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  fieldCheck = ccsZvalidateWithRegex("eoi_projLongName", "Enter the name of your project", /^.+$/);
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_eoi_project_name_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};