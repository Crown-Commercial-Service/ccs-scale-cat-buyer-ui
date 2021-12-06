const ccsZvalidateEoiDocs = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  if (document.getElementById("eoi_file_upload_1").value.length > 0) {
    fieldCheck = ccsZvalidateWithRegex("eoi_file_upload_1", "Document must be a Word or Acrobat file", /^(\w|\W)+\.(docx?|pdf)$/);
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  }

  if (document.getElementById("eoi_additional_link").value.length > 0) {
    fieldCheck = ccsZvalidateWithRegex("eoi_additional_link", "Please enter a valid link", /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/);
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  }

  if (errorStore.length === 0) document.forms["ccs_eoi_docs_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};