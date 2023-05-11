let noLocationTag = "No specific location, for example they can work remotely";

const ccsZvalidateEoiLocation = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  fieldCheck = ccsZisOptionChecked( "required_locations", "Select at least one location");
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
       
      }
      if(cl.value === "Overseas") {
        overSeesid = cl.id;
        // console.log('va from rfi onload>>>>',noLocationtagid);
      }
      
    })

    let allCheckboxOverSees = document.getElementById(overSeesid);
    let allCheckbox = document.getElementById(noLocationtagideoi),
      locationCheckboxes = document.querySelectorAll("input[name='required_locations']");

    if (allCheckbox.checked) {
      locationCheckboxes.forEach((cb) => {

        if (cb.value != allCheckbox.value && cb.value != allCheckboxOverSees.value) {
         
          //cb.disabled = true;
        }
        

      });
    }

    document.getElementById(noLocationtagideoi).addEventListener('change', () => {
      let alloverSeesid = document.getElementById(overSeesid);
      let allCb = document.getElementById(noLocationtagideoi),
        locationCheckboxes = document.querySelectorAll("input[name='required_locations']");
        // console.log('va from eoi>>>>');
      locationCheckboxes.forEach((cb) => {

        if (allCb.checked && cb.value != allCb.value && cb.value != alloverSeesid.value) {
          // cb.checked = false;
          // cb.disabled = true;
        }

        if (!allCb.checked && cb.value != allCb.value) {
          //cb.disabled = false;
        }

        if (!allCb.checked && cb.value != alloverSeesid.value) {
          // cb.disabled = false;
         }

      });

    });
  }
});
