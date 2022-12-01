const ccsZvalidateRfiProject = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  fieldCheck = ccsZvalidateTextArea("rfi_prob_statement", "You must add background information about your procurement");
  if (fieldCheck !== true && fieldCheck !== undefined) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_rfi_about_proj"].submit();
  else ccsZPresentErrorSummary(errorStore);
};

const ccsZCountRfiProject = (event) => {
  //debugger;
  event.preventDefault();

  const element = document.getElementById("rfi_prob_statement");
  // if(element.value.length<500)
  // {
    
    let labelElement=document.getElementById("rfi_label_prob_statement");
    let maxlength = element.getAttribute("maxlength");
    let count=maxlength-element.value.length;
    labelElement.innerText=count + " remaining of "+maxlength;
    //labelElement.classList.remove('ccs-dynaform-hidden')
  // }
  // else
  // {

  // }
};
