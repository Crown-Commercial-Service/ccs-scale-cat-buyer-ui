const ccsZvalidateDaProjectName = (event) => {
    event.preventDefault();
    let fieldCheck = "",
      errorStore = [];
  
    fieldCheck = ccsZvalidateWithRegex("da_projLongName", "Your project must have a name.", /^.+$/);
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  
    if (errorStore.length === 0) document.forms["ccs_da_project_name_form"].submit();
    else ccsZPresentErrorSummary(errorStore);
  };
  
  
  const ccsZCountDaProjectName = (event) => {
    event.preventDefault();
  
    const element = document.getElementById("da_projLongName");
    // if(element.value.length<500)
    // {
      
      let labelElement=document.getElementById("da_label_name_project");
      let count=500-element.value.length;
      labelElement.innerText=count + " remaining of 500";
  };