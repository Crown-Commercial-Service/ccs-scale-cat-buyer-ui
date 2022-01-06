let noLocationTag = "No specific location, for example they can work remotely";

const ccsZvalidateEoiLocation = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  fieldCheck = ccsZisOptionChecked( "required_locations", "You must select at least one region where your staff will be working, or  the “No specific location....");
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["eoi_location"].submit(); //The Location page is mandatory for EOI only
  else ccsZPresentErrorSummary(errorStore);
};

document.addEventListener('DOMContentLoaded', () => {

  if (document.getElementById("ccs_select_location") !== null || document.getElementById("rfi_location")!==null || document.getElementById("eoi_location")!==null ) {

    let allCheckbox = document.getElementById("required_locations-14"),
      locationCheckboxes = document.querySelectorAll("input[name='required_locations']");

    if (allCheckbox.checked) {
      locationCheckboxes.forEach((cb) => {

        if (cb.value != noLocationTag) cb.disabled = true;

      });
    }

    document.getElementById("required_locations-14").addEventListener('change', () => {
      let allCb = document.getElementById("required_locations-14"),
        locationCheckboxes = document.querySelectorAll("input[name='required_locations']");

      locationCheckboxes.forEach((cb) => {

        if (allCb.checked && cb.value != noLocationTag) {
          cb.checked = false;
          cb.disabled = true;
        }

        if (!allCb.checked && cb.value != noLocationTag) {
          cb.disabled = false;
        }

      });

    });
  }
});
