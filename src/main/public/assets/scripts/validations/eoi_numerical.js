const ccsZvalidateEoiDate = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  if (document.getElementById("eoi_resource_start_date-day").value.trim().length === 0) {
    fieldCheck = ccsZvalidateWithRegex("eoi_resource_start_date-day", "Enter a day", /^\d{1,}$/);
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  }
  if (document.getElementById("eoi_resource_start_date-month").value.trim().length === 0) {
    fieldCheck = ccsZvalidateWithRegex("eoi_resource_start_date-month", "Enter a month", /^\d{1,}$/);
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  }
  if (document.getElementById("eoi_resource_start_date-year").value.trim().length === 0) {
    fieldCheck = ccsZvalidateWithRegex("eoi_resource_start_date-year", "Enter a year", /^\d{1,}$/);
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  }
  if (document.getElementById("eoi_duration-days").value.trim().length === 0) {
    fieldCheck = ccsZvalidateWithRegex("eoi_duration-days", "Enter numbers of days", /^\d{1,}$/);
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  }
  if (document.getElementById("eoi_duration-months").value.trim().length === 0) {
    fieldCheck = ccsZvalidateWithRegex("eoi_duration-months", "Enter numbers of month", /^\d{1,}$/);
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  }
  if (document.getElementById("eoi_duration-years").value.trim().length === 0) {
    fieldCheck = ccsZvalidateWithRegex("eoi_duration-years", "Enter numbers of years", /^\d{1,}$/);
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  }
  if (document.getElementById("eoi_resource_start_date-day").value.trim().length === 0) {
    fieldCheck = ccsZvalidateWithRegex("eoi_resource_start_date-day", "Enter a day value", /^\d{1,}$/);
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  }


  if (errorStore.length === 0) document.forms["ccs_eoi_date_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};

const setInputFilter = (textbox, inputFilter) => {
  ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
    textbox.addEventListener(event, function () {
      if (inputFilter(this.value)) {
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      } else {
        this.value = "";
      }
    });
  });
}