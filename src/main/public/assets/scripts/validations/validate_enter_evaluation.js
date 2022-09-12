const ccsZvalidateScore= (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  fieldCheck = ccsZvalidateWithRegex("enter_evaluation_score", "Score should be between 0.00 to 100.00.", /^(?:100(?:[.,]00?)?|\d?\d(?:[.,]\d\d?)?)$/);
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["enter_evaluation"].submit();
  else ccsZPresentErrorSummary(errorStore);
};

const ccsZvalidateFeedbackScore= (event) => {
    event.preventDefault();
  
    let fieldCheck = "",
      errorStore = [];

      fieldCheck = ccsZvalidateWithRegex("enter_evaluation_score", "Enter Score.", /^.+$/);
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  fieldCheck = ccsZvalidateWithRegex("enter_evaluation_score", "The Score should be between the range 0.00 to 100.00.", /^(?:100(?:[.,]00?)?|\d?\d(?:[.,]\d\d?)?)$/);
  if (fieldCheck !== true) errorStore.push(fieldCheck);
  
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

  let labelElement=document.getElementById("supplierFeedback");
  labelElement.innerText= "5000 characters remaining";  


  var txt = document.getElementById('enter_evaluation_score');
    txt.addEventListener('keyup', myFunc);
    
    function myFunc(e) {
        var val = this.value;
        var re = /^([0-9]+[\.]?[0-9]?[0-9]?|[0-9]+)$/g;
        var re1 = /^([0-9]+[\.]?[0-9]?[0-9]?|[0-9]+)/g;
        if (re.test(val)) {
            //do something here
    
        } else {
            val = re1.exec(val);
            if (val) {
                this.value = val[0];
            } else {
                this.value = "";
            }
        }
    }

  const ccsZValidateDecimalScore = (event) => {
  };