const ccsZvalidateRfiProjectName = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

      var rfi_projLongName=$('#rfi_projLongName').val();
      if(rfi_projLongName==''){
        fieldCheck = ccsZvalidateWithRegex("rfi_projLongName", "Your project must have a name.", /^.+$/);
        errorStore.push(fieldCheck);
      }

  
  // if (fieldCheck !== true) errorStore.push(fieldCheck);
  if (errorStore.length === 0) document.forms["ccs_rfi_project_name_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};


const ccsZCountRfiProjectName = (event) => {
  event.preventDefault();

  // const element = document.getElementById("rfi_projLongName");
  // // if(element.value.length<500)
  // // {
    
  //   let labelElement=document.getElementById("rfi_label_name_project");
  //   let count=250-element.value.length;
  //   labelElement.innerText=count + " remaining of 250";
};