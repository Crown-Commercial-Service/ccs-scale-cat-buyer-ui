

/*************************************************************************
 * Client-side validation for GDS form elements:
 * Validate against a regex (text or file inputs);
 * Radio buttons and checkboxes;
 * Date (is the input date a valid date);
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Add and remove error messages from GDS form elements.
 ************************************************************************/

/**
 * Validate that input value matches the supplied regex.
 * Works with text, number and file inputs (make sure the
 * 'accepts' attribute is set for files).
 */
//debugger;
const ccsZvalidateWithRegex = (elementName, errMsg, typeRegex, valid = true) => {
  const element = document.getElementById(elementName);

  if (element?.value != undefined && element.value != null && element.value.trim().match(typeRegex) && valid) {
    ccsZremoveErrorMessage(element);
    return true;
  } else {
    ccsZremoveErrorMessage(element);
    ccsZaddErrorMessage(element, errMsg);
    return [element?.id, errMsg];
  }
};

/**
 * Validate that a textarea cointains a value
 */
const ccsZvalidateTextArea = (elementName, errMsg, valid = true) => {
  const element = document.getElementById(elementName);
  if (element != undefined && element != null && element.value && element.value.trim().length > 0 && valid) {
    ccsZremoveErrorMessage(element);
  }
  else if (element != undefined && element != null) {
    ccsZaddErrorMessage(element, errMsg);
    return [element?.id, errMsg];
  }
};
const ccsZvalidateTextAreaMultipleSameElement = (elementName, errMsg, valid = true) => {
  const element = document.getElementById(elementName);
  if (element != undefined && element != null && element.value && element.value.trim().length > 0 && valid) {
    ccsZremoveErrorMessage(element);
  }
  if (element != undefined && element != null) {
    ccsZaddErrorMessage(element, errMsg);
    return [element?.id, errMsg];
  }
};
/**
 * Validate that one checkbox or radio button in a set has been selected
 */

const ccsZisOptionCheckedForVetting = (elementName, errMsg) => {
  const element = document.getElementById(elementName);


  let checkForAllVettingRadioFields = $('.ccs_vetting').is(':checked');
  let gotACheck = false,
    containingDiv = ".govuk-checkboxes";

  if (!checkForAllVettingRadioFields) {
    gotACheck = false;

  }
  else {
    gotACheck = true;
  }
  if (element != undefined && element != null) {
    if (element.type === "radio") containingDiv = ".govuk-radios";

    if (gotACheck) ccsZremoveErrorMessage(element);
    else ccsZaddErrorMessage(element, errMsg)

    if (gotACheck) return true;
    else return [element.id, errMsg];
  }
}





const ccsZisOptionChecked = (elementName, errMsg) => {
  const element = document.getElementById(elementName);

  let gotACheck = false,
    containingDiv = ".govuk-checkboxes";

  if (element != undefined && element != null) {
    if (element.type === "radio") containingDiv = ".govuk-radios";

    let theOptions = element.closest(containingDiv).querySelectorAll('input');

    theOptions.forEach((opt) => {
      if (opt.checked) gotACheck = true;
    });

    if (gotACheck) ccsZremoveErrorMessage(element);
    else ccsZaddErrorMessage(element, errMsg)

    if (gotACheck) return true;
    else return [element.id, errMsg];

  }

}

/**
 * Simple date validation. Can a Date object be created successfully
 * using the supplied data and is it in the past or future as
 * specified by the 'direction' param?
 * If yes, we've passed validation.
 *
 * If there's a time assosiated with this date, it will be included in the
 * validation if the field is named elementName + '_time'
 *
 * @direction: -1 = date must be past, 0 = any valid date, 1 = date must
 *  be in the future
 * @offset: number of days in the future the date must be (only works for
 *  future dates, set as '0' otherwise)
 */
const ccsZvalidateThisDate = (elementName, errMsg, direction, offset) => {
  const element = document.getElementById(elementName);

  let theDay = parseInt(document.getElementById(element.id + "-day").value.trim()),
    theMonth = parseInt(document.getElementById(element.id + "-month").value.trim()),
    theYear = document.getElementById(element.id + "-year").value.trim(),
    timeField = document.getElementById(elementName + "_time"),
    timeString = "",
    dayPrepend = "",
    monthPrepend = "",
    isValidDate = false;

  if (theDay < 10) dayPrepend = "0";
  if (theMonth < 10) monthPrepend = "0";
  if (timeField !== null) timeString = timeField.value;
  else timeString = "00:01";

  // create a new date object from the submitted data
  let dateString = theYear + "-" + monthPrepend + theMonth + "-" + dayPrepend + theDay + "T" + timeString + ":00";
  let submittedDate = new Date(dateString);

  // first off, is it a valid date?
  isValidDate = !isNaN(submittedDate.getTime());

  // if it is a valid date, is it 'past', 'future' or 'don't mind'?
  if (isValidDate && direction === 0) {
    ccsZremoveErrorMessage(element);
  } else if (isValidDate) {

    let nowDate = new Date(),
      testMonth = nowDate.getMonth() + 1,
      testDay = nowDate.getDate(),
      testHours = nowDate.getHours(),
      testMins = nowDate.getMinutes();

    if (testMonth < 10) testMonth = "0" + testMonth;
    if (testDay < 10) testDay = "0" + testDay;
    if (testHours < 10) testHours = "0" + testHours;
    if (testMins < 10) testMins = "0" + testMins;

    let relativeTestDate = new Date(nowDate.getFullYear() + "-" + testMonth + "-" + testDay + "T" + testHours + ":" + testMins + ":00"),
      testTime = 0;

    if (direction > 0 && offset > 0) {
      let offsetTime = 86400000 * offset;
      testTime = relativeTestDate.getTime() + offsetTime;
    } else {
      testTime = relativeTestDate.getTime();
    }

    if ((direction < 0 && submittedDate.getTime() < testTime) || (direction > 0 && submittedDate.getTime() > testTime)) {
      ccsZremoveErrorMessage(element);
    } else {
      ccsZaddErrorMessage(element, errMsg);
      return [element.id, errMsg];
    }

  } else {
    ccsZaddErrorMessage(element, errMsg);
  }

  if (isValidDate) return true;
  else return [element.id, errMsg];

};

/**
 * Remove an error message from around an element (if it's present)
 * @param {object} element - DOM element from which to remove the
 * error message.
 */
const ccsZremoveErrorMessage = (element) => {

  if (element !=null && document.getElementById(element.id + "-error") !== null) {
    element.closest('.govuk-form-group').classList.remove('govuk-form-group--error');
    if (element.tagName === "TEXTAREA") {
      element.closest('.govuk-textarea').classList.remove('govuk-textarea--error');
    }
    if (element.tagName === "INPUT") {
      element.classList.remove("govuk-input--error");
    } else {
      let childInputs = element.querySelectorAll('input');
      childInputs.forEach((child_i) => {
        child_i.classList.remove("govuk-input--error");
      });
    }

    document.getElementById(element?.id + "-error").remove();
  }

};

/**
 * Add an error message around an element, if not already present
 *  - adds 'error' classes to the 'form group' and the input and
 * inserts an error message element
 * @param {object} element - DOM element to add the error message to
 * @param {string} message - the error message
 */
const ccsZaddErrorMessage = (element, message) => {

  if (element != undefined && element != null && document.getElementById(element.id + "-error") === null) {
    element.closest('.govuk-form-group').classList.add('govuk-form-group--error');

    if (element.tagName === "INPUT" && (element.type !== "radio" || element.type !== "checkbox")) {
      element.classList.add("govuk-input--error");
    } else {
      let childInputs = element.querySelectorAll('input');
      childInputs.forEach((child_i) => {
        child_i.classList.add("govuk-input--error");
      });
    }
    if (element.tagName === "TEXTAREA" && (element.type !== "radio" || element.type !== "checkbox")) {
      element.classList.add("govuk-textarea--error");
    } else {
      let childInputs = element.querySelectorAll('textarea');
      childInputs.forEach((child_i) => {
        child_i.classList.add("govuk-textarea--error");
      });
    }

    errorEl = ccsZcreateCcsErrorMsg(element.id, message);

    if (element.type === "radio") {
      element.closest(".govuk-radios").insertBefore(errorEl, element.parentNode);
    } else if (element.type === "checkbox") {
      element.closest(".govuk-checkboxes").insertBefore(errorEl, element.parentNode);
    } else if (element.parentNode.classList.contains("govuk-input__wrapper")) {
      element.closest(".govuk-form-group").insertBefore(errorEl, element.parentNode);
    } else {
      element.parentNode.insertBefore(errorEl, element);
    }
  }
};
const ccsZaddErrorMessageClass = (element, message) => {

  if (element != undefined && element != null && !element.className.includes("-error")) {
    element.closest('.govuk-form-group').classList.add('govuk-form-group--error');

    if (element.tagName === "INPUT" && (element.type !== "radio" || element.type !== "checkbox")) {
      element.classList.add("govuk-input--error");
    } else {
      let childInputs = element.querySelectorAll('input');
      childInputs.forEach((child_i) => {
        child_i.classList.add("govuk-input--error");
      });
    }
    if (element.tagName === "TEXTAREA" && (element.type !== "radio" || element.type !== "checkbox")) {
      element.classList.add("govuk-textarea--error");
    } else {
      let childInputs = element.querySelectorAll('textarea');
      childInputs.forEach((child_i) => {
        child_i.classList.add("govuk-textarea--error");
      });
    }

    errorEl = ccsZcreateCcsErrorMsg(element.id, message);

    if (element.type === "radio") {
      element.closest(".govuk-radios").insertBefore(errorEl, element.parentNode);
    } else if (element.type === "checkbox") {
      element.closest(".govuk-checkboxes").insertBefore(errorEl, element.parentNode);
    } else if (element.parentNode.classList.contains("govuk-input__wrapper")) {
      element.closest(".govuk-form-group").insertBefore(errorEl, element.parentNode);
    } else {
      element.parentNode.insertBefore(errorEl, element);
    }
  }
};
/*
 * Helper to create an error message span that can be inserted
 * above the erroring input
 */
const ccsZcreateCcsErrorMsg = (elName, message) => {

  let errorElement = document.createElement("span");
  errorElement.id = elName + "-error";
  errorElement.className = "govuk-error-message";
  errorElement.innerHTML = '<span class="govuk-visually-hidden">Error:</span>';

  let errorMessage = document.createTextNode(" " + message);
  errorElement.appendChild(errorMessage);

  return errorElement;
};

/*
 * Create an 'error summary box', populate it with the messages in
 * errorStore and scroll to the top of the page.
 */
const ccsZPresentErrorSummary = (errorStore) => {
  // remove the error summary if its there
  const existingSummary = document.querySelector(".govuk-error-summary");
  if (existingSummary !== null) existingSummary.parentNode.removeChild(existingSummary);

  // create the div
  let errSummaryBox = document.createElement("div"),
    errSummaryBody = document.createElement("div"),
    errSummaryList = document.createElement("ul");

  errSummaryBox.className = "govuk-error-summary";
  errSummaryBody.className = "govuk-error-summary__body";
  errSummaryList.classList.add("govuk-list", "govuk-error-summary__list");

  errSummaryBox.innerHTML = '<h2 class="govuk-error-summary__title" id="error-summary-title">There is a problem </h2>';

  errSummaryBox.setAttribute("aria-labelledby", "error-summary-title");
  errSummaryBox.setAttribute("role", "alert");
  errSummaryBox.setAttribute("tabindex", "-1");
  errSummaryBox.setAttribute("data-module", "govuk-error-summary");

  // Add the error messages
  errorStore.forEach((errDetail) => {
    let errListItem = document.createElement("li"),
      errAnchorItem = document.createElement("a")
    let errItemText = document.createTextNode(errDetail[1]);

    errAnchorItem.setAttribute("href", "#" + errDetail[0]);
    errAnchorItem.appendChild(errItemText);

    errListItem.appendChild(errAnchorItem);

    errSummaryList.appendChild(errListItem);
  });

  // add the errors to the box
  errSummaryBody.appendChild(errSummaryList);
  errSummaryBox.appendChild(errSummaryBody);

  // and finally, insert the error summary box into the page
  document.querySelector(".govuk-heading-xl").parentNode.insertBefore(errSummaryBox, document.querySelector(".govuk-heading-xl"));
  window.scrollTo(0, 0);

};
