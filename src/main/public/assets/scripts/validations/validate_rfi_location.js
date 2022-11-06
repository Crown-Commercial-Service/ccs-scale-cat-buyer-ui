noLocationTag = "No specific location, for example they can work remotely";



document.addEventListener('DOMContentLoaded', () => {

  if (document.getElementById("ccs_select_location") !== null || document.getElementById("rfi_location")!==null || document.getElementById("rfi_location")!==null ) {
    // console.log('va from rfi onload>>>>');
    nospeclocationCheckboxes = document.querySelectorAll("input[name='required_locations']");
    nospeclocationCheckboxes.forEach((cl) => {
      
      if(cl.value === "No specific location, for example they can work remotely") {
        noLocationtagid = cl.id;
        // console.log('va from rfi onload>>>>',noLocationtagid);
      }
      
    })
    let allCheckbox = document.getElementById(noLocationtagid),
      locationCheckboxes = document.querySelectorAll("input[name='required_locations']");

    if (allCheckbox.checked) {
      locationCheckboxes.forEach((cb) => {

        if (cb.value != allCheckbox.value) cb.disabled = true;

      });
    }

    document.getElementById(noLocationtagid).addEventListener('change', () => {
      let allCb = document.getElementById(noLocationtagid),
        locationCheckboxes = document.querySelectorAll("input[name='required_locations']");
      // console.log('va from rfi>>>>');
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
