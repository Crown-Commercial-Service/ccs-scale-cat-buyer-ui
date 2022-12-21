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
      if(cl.value === "Overseas") {
        overSeesid = cl.id;
        // console.log('va from rfi onload>>>>',noLocationtagid);
      }
      

    })
   
    let allCheckboxOverSees = document.getElementById(overSeesid);

    let allCheckbox = document.getElementById("required_locations-14"),
      locationCheckboxes = document.querySelectorAll("input[name='required_locations']");

    if (allCheckbox && allCheckbox.checked) {
      locationCheckboxes.forEach((cb) => {

        if (cb.value != notApplicableTag) cb.disabled = true;

      });
    }

    if(document.getElementById("required_locations-14")){
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

    // document.getElementById(noLocationtagid).addEventListener('change', () => {
    //   let alloverSeesid = document.getElementById(overSeesid);

    //   let allCb = document.getElementById(noLocationtagid),
    //     locationCheckboxes = document.querySelectorAll("input[name='required_locations']");
    //   // console.log('va from rfi>>>>');
    //   locationCheckboxes.forEach((cb) => {

    //     if (allCb.checked && cb.value != allCb.value && cb.value != alloverSeesid.value) {
    
    //     //    cb.checked = false;
    //     //  cb.disabled = true;
    //     }

    //     if (!allCb.checked && cb.value != allCb.value) {
    //       //cb.disabled = false;
    //     }

    //     if (!allCb.checked && cb.value != alloverSeesid.value) {
    //       //cb.disabled = false;
    //     }

    //   });

    // });
  }
});
