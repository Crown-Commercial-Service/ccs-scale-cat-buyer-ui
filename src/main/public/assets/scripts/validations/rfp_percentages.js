document.addEventListener('DOMContentLoaded', () => {
  const formPercentage = $('#rfp_percentage_form');
  if (formPercentage !== undefined && formPercentage.length > 0) {
    let elements = document.querySelectorAll("[name='percentage']");
    let totalPercentageEvent = () => {
      let percentage = 0
      elements.forEach((el) => {
        percentage += isNaN(el.value) ? 0 : Number(el.value);
      });
      $("#totalPercentage").text(percentage);
    };

    elements.forEach((ele) => {
      ele.addEventListener('focusout', totalPercentageEvent)
    });
    totalPercentageEvent();
  }
});

const checkPercentagesCond = () => {
  let fieldCheck = "",
    errorStore = [];
  let allTextBox = $("form input:text");
  let totalValue = 0;
  if (Number($("#totalPercentage").text()) > 100) {
    for (let k = 0; k < allTextBox.length; k++) {
      fieldCheck = ccsZvalidateWithRegex(allTextBox[k].id, "The total weighting cannot exceed 100%", /\w+/, false);
      if (fieldCheck !== true) errorStore.push(fieldCheck);

    }
  } else
    for (let k = 0; k < allTextBox.length; k++) {
      totalValue += Number(allTextBox[k].value);
      var range = $("#range_p" + allTextBox[k].id.replace(" ", "")).attr("range");
      if (allTextBox[k].value == "") {
        fieldCheck = ccsZvalidateWithRegex(allTextBox[k].id, "Please enter range between [" + range.split("-")[0] + "-" + range.split("-")[1] + "%]", /\w+/, false);
        if (fieldCheck !== true) errorStore.push(fieldCheck);
      } else if (Number(allTextBox[k].value) > 0) {
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

    }
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
  const errorStore = checkPercentagesCond();
  if (errorStore != undefined && errorStore != null && errorStore.length === 0) {
    document.forms["rfp_percentage_form"].submit();
  }
  else {
    ccsZPresentErrorSummary(errorStore);
  }
}