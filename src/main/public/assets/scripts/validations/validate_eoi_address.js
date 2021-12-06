const ccsZvalidateEoiAddress = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [],
    addyLineOne = document.getElementById("eoi_proj_address-line-1").value,
    addyTown = document.getElementById("eoi_proj_address-town").value,
    addyPostCode = document.getElementById("eoi_proj_address-postcode").value;

  if (addyLineOne !== "" || addyTown !== "" || addyPostCode !== "") {

    fieldCheck = ccsZvalidateWithRegex("eoi_proj_address-line-1", "Specify the building and street", /^.+$/);
    if (fieldCheck !== true) errorStore.push(fieldCheck);

    fieldCheck = ccsZvalidateWithRegex("eoi_proj_address-town", "Specify the town or city", /^[A-Z|a-z| ]+$/);
    if (fieldCheck !== true) errorStore.push(fieldCheck);

    fieldCheck = ccsZvalidateWithRegex("eoi_proj_address-postcode", "Enter a valid postcode", /A([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})$/);
    if (fieldCheck !== true) errorStore.push(fieldCheck);

  }

  if (errorStore.length === 0) document.forms["ccs_eoi_address_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};
