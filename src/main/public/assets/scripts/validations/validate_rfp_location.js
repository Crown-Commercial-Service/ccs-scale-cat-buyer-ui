let notApplicableTag = "Not Applicable";



document.addEventListener('DOMContentLoaded', () => {

  if (document.getElementById("rfp_location") !== null ) {

    let allCheckbox = document.getElementById("required_locations-6"),
      locationCheckboxes = document.querySelectorAll("input[name='required_locations']");

    if (allCheckbox.checked) {
      locationCheckboxes.forEach((cb) => {

        if (cb.value != notApplicableTag) cb.disabled = true;

      });
    }

    document.getElementById("required_locations-6").addEventListener('change', () => {
      let allCb = document.getElementById("required_locations-6"),
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
