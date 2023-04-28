const ccsZvalidateScore= (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  fieldCheck = ccsZvalidateWithRegex("enter_evaluation_score", "Enter Feedback.", /^.+$/);
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["enter_evaluation"].submit();
  else ccsZPresentErrorSummary(errorStore);
};

$("#enter_evaluation").submit(function(){
  let errorStore = [];
  let scoreValue = Number(document.getElementById("enter_evaluation_score").value) > 100;
  let error = "";
  let fieldId = document.getElementById("enter_evaluation_score")
  ccsZremoveErrorMessage(fieldId);
  if(scoreValue == true){
    error = ccsZvalidateWithRegex("enter_evaluation_score", "Enter a score between 0 and 100", null);
    if (error !== true) errorStore.push(error);
    // ccsZaddErrorMessage(document.getElementById("enter_evaluation_score"), "Please enter score between 0 to 100");
    // errorStore.push(error);

  }
  if($("#enter_evaluation_score").val() == ''){
     error = ccsZvalidateWithRegex("enter_evaluation_score", "Enter a score between 0 and 100", /^.+$/);
    errorStore.push(error);
  }
  if($("#enter_evaluation_feedback").val() == ''){
     error = ccsZvalidateWithRegex("enter_evaluation_feedback", "Please enter final feedback", /^.+$/);
    errorStore.push(error);
    console.log("errorStore",errorStore);
  }
  if (errorStore.length === 0) {
    var bodytg = document.body;
    bodytg.classList.add("pageblur");
    document.forms["enter_evaluation"].submit();
  }else { ccsZPresentErrorSummary(errorStore);
  return false;
}
});

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

  if(document.getElementById('enter_evaluation_score') !== null) {
    var txt = document.getElementById('enter_evaluation_score');
    txt.addEventListener('keyup', myFunc);
  }
    
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