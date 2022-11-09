let noLocationTag = "No specific location, for example they can work remotely";

const ccsZvalidateEoiLocation = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  fieldCheck = ccsZisOptionChecked( "required_locations", "You must select at least one region, or the “No specific location...");
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["eoi_location"].submit(); //The Location page is mandatory for EOI only
  else ccsZPresentErrorSummary(errorStore);
};

document.addEventListener('DOMContentLoaded', () => {
  // console.log('va from eoi onload>>>>');
  if (document.getElementById("ccs_select_location") !== null || document.getElementById("rfi_location")!==null || document.getElementById("eoi_location")!==null ) {
    nospeclocationCheckboxeseoi = document.querySelectorAll("input[name='required_locations']");
    nospeclocationCheckboxeseoi.forEach((cl) => {
      
      if(cl.value === "No specific location, for example they can work remotely") {
        noLocationtagideoi = cl.id;
        console.log('va from rfi onload>>>>',noLocationtagideoi);
      }
      
    })
    let allCheckbox = document.getElementById(noLocationtagideoi),
      locationCheckboxes = document.querySelectorAll("input[name='required_locations']");

    if (allCheckbox.checked) {
      locationCheckboxes.forEach((cb) => {

        if (cb.value != allCheckbox.value) cb.disabled = true;

      });
    }

    document.getElementById(noLocationtagideoi).addEventListener('change', () => {
      let allCb = document.getElementById(noLocationtagideoi),
        locationCheckboxes = document.querySelectorAll("input[name='required_locations']");
        // console.log('va from eoi>>>>');
      locationCheckboxes.forEach((cb) => {

        if (allCb.checked && cb.value != allCb.value) {
          cb.checked = false;
          cb.disabled = true;
        }

        if (!allCb.checked && cb.value != allCb.value) {
          cb.disabled = false;
        }

      });

    });
  }
});
