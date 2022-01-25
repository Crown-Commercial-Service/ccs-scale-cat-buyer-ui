let notApplicableTag = "No specific location, for example they can work remotely";

const ccsZvalidateRfpLocation = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  fieldCheck = ccsZisOptionChecked( "required_locations", "You must select at least one region where your staff will be working, or  the “No specific location....");
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["rfp_location"].submit(); //The Location page is mandatory 
  else ccsZPresentErrorSummary(errorStore);
};



document.addEventListener('DOMContentLoaded', () => {

  if (document.getElementById("rfp_location") !== null ) {

    let allCheckbox = document.getElementById("required_locations-14"),
      locationCheckboxes = document.querySelectorAll("input[name='required_locations']");

    if (allCheckbox.checked) {
      locationCheckboxes.forEach((cb) => {

        if (cb.value != notApplicableTag) cb.disabled = true;

      });
    }

    document.getElementById("required_locations-14").addEventListener('change', () => {
      let allCb = document.getElementById("required_locations-14"),
        locationCheckboxes = document.querySelectorAll("input[name='required_locations']");

      locationCheckboxes.forEach((cb) => {

        if (allCb.checked && cb.value != notApplicableTag) {
          cb.checked = false;
          cb.disabled = true;
        }

        if (!allCb.checked && cb.value != notApplicableTag) {
          cb.disabled = false;
        }

      });

    });
  }
});
