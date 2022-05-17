const ccsZvalidateRfiWho = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  fieldCheck = ccsZvalidateWithRegex( "rfi_contracting_auth", "Specify the contracting authority", /^.+$/ );
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_rfi_who_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};

const ccsZCountRfiWho = (event) => {
  //debugger;
  event.preventDefault();

  const element = document.getElementById("rfi_contracting_auth");
  // if(element.value.length<500)
  // {
    
    let labelElement=document.getElementById("rfi_label_contracting_auth");
    let count=500-element.value.length;
    labelElement.innerText=count + " remaining of 500";
    //labelElement.classList.remove('ccs-dynaform-hidden')
  // }
  // else
  // {

  // }
};
