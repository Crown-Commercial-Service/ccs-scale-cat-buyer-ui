const ccsZvalidateRfiWho = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  // fieldCheck = ccsZvalidateWithRegex( "rfi_contracting_auth", "Specify the contracting authority", /^.+$/ );
  // if (fieldCheck !== true) errorStore.push(fieldCheck);
  const pageHeading = document.getElementById('page-heading').innerHTML;
  const textPatternNew = /^[a-zA-Z,]+$/;
  var rfi_contracting_auth = document.getElementById('rfi_contracting_auth');
  var errorMsg = '';
  if($('#rfi_contracting_auth').val() != '' && (pageHeading.includes("(optional)"))){
    // if(rfi_contracting_auth.value.length > 0 &&
    //   textPatternNew.test(rfi_contracting_auth.value) !== true){
    //   errorMsg = 'Please enter only character';
    //   fieldCheck = ccsZvalidateWithRegex('rfi_contracting_auth', 'Please enter only character','^[a-zA-Z,]+$/');
    //   if (fieldCheck !== true) errorStore.push(['rfi_contracting_auth', 'Please enter only character']);
    // }
    
  }

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
    // labelElement.innerText=count + " remaining of 500";
    labelElement.innerText="You have " +count + " characters remaining";
    //labelElement.classList.remove('ccs-dynaform-hidden')
  // }
  // else
  // {

  // }
};
