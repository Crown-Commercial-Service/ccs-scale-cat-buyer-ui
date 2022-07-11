const ccsZvalidateScore= (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  fieldCheck = ccsZvalidateWithRegex("enter_evaluation_score", "Enter Feedback.", /^.+$/);
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["enter_evaluation"].submit();
  else ccsZPresentErrorSummary(errorStore);
};

const ccsZvalidateFeedback= (event) => {
    event.preventDefault();
  
    let fieldCheck = "",
      errorStore = [];
  
    fieldCheck = ccsZvalidateWithRegex("enter_evaluation_feedback", "Enter Feedback.", /^.+$/);
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  
    if (errorStore.length === 0) document.forms["enter_evaluation"].submit();
    else ccsZPresentErrorSummary(errorStore);
  };
  
  
  const ccsZCountsupplierFeedback = (event) => {
    event.preventDefault();
  
    const element = document.getElementById("enter_evaluation_feedback");
    // if(element.value.length<500)
    // {
      
      let labelElement=document.getElementById("supplierFeedback");
      let count=5000-element.value.length;
      labelElement.innerText=count + " remaining of 5000";
  };

  const ccsZValidateDecimalScore = (event) => {
    //event.preventDefault();
  
    
    
    // if ((event.which != 46 || event.currentTarget.value.indexOf('.') != -1) &&
    // ((event.which < 48 || event.which > 57) &&
    // (event.which != 0 && event.which != 8))) {
    // event.preventDefault();
    // }
    
    // var text = event.key;
    
    // if ((text.indexOf('.') != -1) &&
    // (text.substring(text.indexOf('.')).length > 2) &&
    // (event.which != 0 && event.which != 8) &&
    // ($("#enter_evaluation_score")[0].selectionStart >= text.length - 2)) {
    // event.preventDefault();
    // }
    
  //   let element=document.getElementById("enter_evaluation_score").value+event.key;
  // //  document.getElementById("enter_evaluation_score").value=toTrunc(element.value,2).toFixed(2);
  // let str = element.toString().split('.');

  // var res = "";
  // if(str[1]!=undefined){res=str[1].slice(0, 2);document.getElementById("enter_evaluation_score").value = str[0]+'.'+res;}
  // else{
  // document.getElementById("enter_evaluation_score").value = str[0];
  // }

  };