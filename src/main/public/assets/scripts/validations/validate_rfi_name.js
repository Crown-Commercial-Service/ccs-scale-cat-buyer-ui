const countCharacterRfp = (str) => { return str.length };

const ccsZvalidateRfiProjectName = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  const textbox = document.getElementById("rfi_projLongName");

  fieldCheck = ccsZvalidateWithRegex("rfi_projLongName", "Your project must have a name.", /^.+$/);
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  const field = countCharacterRfp(textbox.value) > 500;

  if(field)
  {
    errorStore.push(["rfi_projLongName", 'No more than 500 characters are allowed']);
  }


  if (errorStore.length === 0) document.forms["ccs_rfi_project_name_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};


const ccsZCountRfiProjectName = (event) => {
  event.preventDefault();

  const element = document.getElementById("rfi_projLongName");
  // if(element.value.length<500)
  // {
    
    let labelElement=document.getElementById("rfi_label_name_project");
    let count=500-element.value.length;
    if(count>0)
    {
      labelElement.innerText= "You have "+count + " characters remaining";
    }
    else if(count<0)
    {
      labelElement.innerText= "You have "+String(count).replace("-","") + " characters too many";
    }
};

