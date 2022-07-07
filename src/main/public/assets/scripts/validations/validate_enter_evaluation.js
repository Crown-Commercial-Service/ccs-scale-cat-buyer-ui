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