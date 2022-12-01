document.addEventListener('DOMContentLoaded', () => {
  const formPercentage = $('#rfp_percentage_form');
  if (formPercentage !== undefined && formPercentage.length > 0) {
    let allTextBox = $("form input[type='number']");
    let elements = document.querySelectorAll("[name='percentage']");
    let totalPercentageEvent = () => {
     
      let percentage = 0
      let errorList = [];
      removeErrorFieldsRfpPercentage();
      elements.forEach((el) => {
        

        percentage += isNaN(el.value) ? 0 : Number(el.value);
      });
      // if (percentage > 100) {
      //   errorList.push(["There is a problem", "Your total percentage must be 100%"]);
      //   ccsZPresentErrorSummary(errorList)
      // }
      // if (percentage < 100) {
      //   errorList.push(["There is a problem", "Your total percentage must be 100%."]);
      //   ccsZPresentErrorSummary(errorList)
      // }
      
      $("#totalPercentage").text(percentage);
    };
    
    // for (let k = 0; k < allTextBox.length; k++){
     
    // }

    

    elements.forEach((ele) => {
      ele.addEventListener('focusout', totalPercentageEvent)
      ele.addEventListener('keydown', (event) => {
        if (event.key === '.' || event.keyCode === 69) { event.preventDefault(); }
      });
    });
     totalPercentageEvent();
  }
});

const checkPercentagesCond = () => {
  removeErrorFieldsRfpPercentage();
  let fieldCheck = "",
    errorStore = [];
    const urlParams = new URLSearchParams(window.location.search);
    const agrement_id = urlParams.get('agreement_id');
  let allTextBox = $("form input[type='number']");
  let totalValue = 0;
  console.log(Number($("#totalPercentage").text()));
  // if (Number($("#totalPercentage").text()) > 100) {
    // errorStore.push(['There is a problem', 'The total weighting cannot exceed 100%'])
    //ccsZPresentErrorSummary([errorStore]);
    // for (let k = 0; k < allTextBox.length; k++) {
    //   fieldCheck = ccsZvalidateWithRegex(allTextBox[k].id, "The total weighting cannot exceed 100%", /\w+/, false);
    //   if (fieldCheck !== true) errorStore.push(fieldCheck);

    // }
    for (let k = 0; k < allTextBox.length; k++) {
      totalValue += Number(allTextBox[k].value);
      var range = $("#range_p" + allTextBox[k].id.replace(" ", "")).attr("range");
    var subTitle = $('#getSubTitle'+allTextBox[k].id.replace(" ", "")).html();
      if (!subTitle.includes("optional") && allTextBox[k].value == "" || allTextBox[k].value < 0) {
        if (subTitle!= 'Social value'){

          if(agrement_id == 'RM6187'){
            fieldCheck = ccsZvalidateWithRegex(allTextBox[k].id, "You must enter "+subTitle.toLowerCase()+" range between [" + range.split("-")[0] + "-" + range.split("-")[1] + "%]", /\w+/, false);
          }else{
               fieldCheck = ccsZvalidateWithRegex(allTextBox[k].id+"-hint", "Enter a weighting for "+subTitle.toLowerCase()+" between " + range.split("-")[0] + " and " + range.split("-")[1] + "%", /\w+/, false);
          }

          
        }
        else {
          fieldCheck = ccsZvalidateWithRegex(allTextBox[k].id, "Enter a weighting for"+subTitle.toLowerCase()+" that is 0% or between " + range.split("-")[0] + " and " + range.split("-")[1] + "%", /\w+/, false);
        }
        if (fieldCheck !== true) errorStore.push(fieldCheck);
      } else if (Number(allTextBox[k].value) >= 0 && subTitle!= 'Social value') {
        var result = checkRange(range.split("-")[0], range.split("-")[1], allTextBox[k].value);
        if (result.start) {
          //fieldCheck = ccsZvalidateWithRegex("Question " + k, "The total weighting cannot exceed 100%", /\w+/, false);
          // $("#event-name-error-"+allTextBox[k].value.replace(" ","")).removeClass("govuk-visually-hidden").text("Range value incorrect");
          //errorStore.push("The value incorrect");
          fieldCheck = ccsZvalidateWithRegex(allTextBox[k].id, "Enter Range value between [" + range.split("-")[0] + "-" + range.split("-")[1] + "%]", /\w+/, false);
          if (fieldCheck !== true) errorStore.push(fieldCheck);

        }
        else if (result.end) {
          
          fieldCheck = ccsZvalidateWithRegex(allTextBox[k].id, "Range value between [" + range.split("-")[0] + "-" + range.split("-")[1] + "%]", /\w+/, false);
          if (fieldCheck !== true) errorStore.push(fieldCheck);
        }
      }
      else if (Number(allTextBox[k].value) > 0 && subTitle == 'Social value' && agrement_id == 'RM1043.8') {
        var result = checkRange(range.split("-")[0], range.split("-")[1], allTextBox[k].value);
        if (result.start) {
          //fieldCheck = ccsZvalidateWithRegex("Question " + k, "The total weighting cannot exceed 100%", /\w+/, false);
          // $("#event-name-error-"+allTextBox[k].value.replace(" ","")).removeClass("govuk-visually-hidden").text("Range value incorrect");
          //errorStore.push("The value incorrect");
          fieldCheck = ccsZvalidateWithRegex(allTextBox[k].id, "Enter Range value between [0%, or " + range.split("-")[0] + "-" + range.split("-")[1] + "%]", /\w+/, false);
          if (fieldCheck !== true) errorStore.push(fieldCheck);

        }
        else if (result.end) {
          console.log(range)
          fieldCheck = ccsZvalidateWithRegex(allTextBox[k].id, "Range value between [0%, or " + range.split("-")[0] + "-" + range.split("-")[1] + "%]", /\w+/, false);
          if (fieldCheck !== true) errorStore.push(fieldCheck);
        }

      }
    }
  // } 
  //} 
  // else if (Number($("#totalPercentage").text()) <= 0) {
  //   for (let k = 1; k < allTextBox.length; k++) {
  //     var range = $("#range_p").attr('range');
  //     fieldCheck = ccsZvalidateWithRegex("Question " + k, "Please enter range value", /\w+/, false);
  //     if (fieldCheck !== true) errorStore.push(fieldCheck);
  //   }
  // }
  return errorStore;
};

const checkRange = (s, e, val) => {
  let start = false;
  let end = false;
  if (Number(val) < Number(s)) {
    start = true;
    return { start, end };
  }

  if (Number(val) > Number(e)) {
    end = true;
    return { start, end };
  }
  return { start, end };
}
const ccsZvalidateRfpPercentages = (event) => {
  event.preventDefault();
  const urlParams = new URLSearchParams(window.location.search);
    const agrement_id = urlParams.get('agreement_id');
  let errorStore =[];
  const pageHeading = document.getElementById('page-heading').innerHTML;

  let elements = document.querySelectorAll("[name='percentage']");
  let percentage = 0;
  
  elements.forEach((el) => {
    percentage += isNaN(el.value) ? 0 : Number(el.value);
   
});

 
  errorStore = errorStore == null || errorStore.length <= 0 ? checkPercentagesCond() : errorStore;
  checkPercentagesCond()
  if (pageHeading.includes('Set the overall weighting between quality and price') && (percentage > 100 || percentage < 100)) {
    errorStore.push(["#", "Your total percentage must be 100%"]);
    ccsZPresentErrorSummary(errorStore)
  }
  if (pageHeading.includes('Set the overall weighting') && (percentage > 100 || percentage < 100) && agrement_id == 'RM1043.8') {
    errorStore.push(["#", "The weightings must add up to 100% in total"]);
    ccsZPresentErrorSummary(errorStore)
  }
  if (pageHeading.includes('Set the specific weighting of quality groups') && (percentage > 100 || percentage < 100) && agrement_id == 'RM6187') {
    errorStore.push(["#", "Your total percentage must be 100%"]);
    ccsZPresentErrorSummary(errorStore)
  }
  if (pageHeading.includes('Set the overall weighting for quality') && (percentage > 100 || percentage < 100)) {
    errorStore.push(["#", "Your total percentage must be 100%"]);
    ccsZPresentErrorSummary(errorStore)
  }
  if ((pageHeading.includes('Technical Competence') || pageHeading.includes('Technical competence') ) && (percentage > 100 || percentage < 100)) {
    var fieldCheck = ccsZvalidateWithRegex('Question 3-hint', "Your total percentage must be 100%", /\w+/);
    errorStore.push(fieldCheck);
    ccsZPresentErrorSummary(errorStore)
  }
  
  
  if (errorStore === undefined || errorStore === null || errorStore.length === 0) {
    document.forms["rfp_percentage_form"].submit();
  }
  else {
    ccsZPresentErrorSummary(errorStore);
  }
}

const removeErrorFieldsRfpPercentage = () => {
  $('.govuk-error-message').remove();
  $('.govuk-form-group--error').removeClass('govuk-form-group--error');
  $('.govuk-error-summary').remove();
  $('.govuk-input').removeClass('govuk-input--error');
  $('.govuk-form-group textarea').removeClass('govuk-textarea--error');
};

$('.questionweightagelimit').on('keypress', function (evt) {
  let value = $(this).val();
  evt = (evt) ? evt : window.event;
      var charCode = (evt.which) ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57) || value.length >=3) {
          return false;
      }
      return true;
   
   });
  