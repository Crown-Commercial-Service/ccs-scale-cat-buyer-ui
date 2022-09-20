document.addEventListener('DOMContentLoaded', () => {

  const rfpDate = document.getElementById('rfp-date');
  let expandedIdName = 'rfi_clarification_date_expanded_';
  let responseDateFormName = 'ccs_rfi_response_date_form_';
  let selectors = [1, 2, 3, 4, 5];
  if (rfpDate != undefined && rfpDate != null) {
    selectors = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    expandedIdName = 'rfp_clarification_date_expanded_';
    responseDateFormName = 'ccs_rfp_response_date_form_';
  }
  for (let element of selectors) {
    let day = $(`#clarification_date-day_${element}`);
    let month = $(`#clarification_date-month_${element}`);
    let year = $(`#clarification_date-year_${element}`);
    let hour = $(`#clarification_date-hour_${element}`);
    let minutes = $(`#clarification_date-minute_${element}`);
    let hourFormat = $(`#clarification_date-hourFormat_${element}`);
    let dateExpandedId = expandedIdName + element;

    let responseDate = $(`#${responseDateFormName}${element}`);

    day.on('blur', () => {
      let value = day;
      if (value != undefined && value.val() != '') {
        let parentID = getParentId(element);
        let matchValue = !value.val().match(/^\d\d?$/);
        let endmonthCheck = Number(value.val()) > 31;
        let startmonthCheck = Number(value.val()) < 1;
        if (matchValue || endmonthCheck || startmonthCheck) {
          value.addClass("govuk-input--error")
          ccsZaddErrorMessage(document.getElementById(parentID), "Enter a valid date");
        }
        else {
          value.removeClass("govuk-input--error");
          ccsZremoveErrorMessage(document.getElementById(parentID));
        }
      }
    });

    month.on('blur', () => {
      let value = month;
      if (value != undefined && value.val() != '') {
        let parentID = getParentId(element);
        let matchValue = !value.val().match(/^\d\d?$/);
        let endmonthCheck = Number(value.val()) > 12;
        let startmonthCheck = Number(value.val()) <= 0;
        if (matchValue || endmonthCheck || startmonthCheck) {
          value.addClass("govuk-input--error")
          ccsZaddErrorMessage(document.getElementById(parentID), "Enter a valid month");
        }
        else {
          value.removeClass("govuk-input--error");
          ccsZremoveErrorMessage(document.getElementById(parentID));
        }
      }
    });

    year.on('blur', () => {
      let value = year;
      if (value != undefined && value.val() != '') {
        let parentID = getParentId(element);
        let matchValue = !value.val().match(/^\d{4}$/);
        let endyearCheck = Number(value.val()) > 2121;
        let currentYear = new Date().getFullYear();
        let startyearCheck = Number(value.val()) < currentYear;
        if (matchValue || endyearCheck || startyearCheck) {
          value.addClass("govuk-input--error")
          ccsZaddErrorMessage(document.getElementById(parentID), "Enter a valid year");
        }
        else {
          value.removeClass("govuk-input--error");
          ccsZremoveErrorMessage(document.getElementById(parentID));
        }
      }
    });

    hour.on('blur', () => {
      let value = hour;
      if (value != undefined && value.val() != '') {
        let parentID = getParentId(element);
        let matchValue = !value.val().match(/^\d\d?$/);
        let endmonthCheck = Number(value.val()) > 12;
        let startmonthCheck = Number(value.val()) < 0;
        if (day.val() !== '' && month.val() !== '' && day.val() !== '' && !isValidDate(year.val(), month.val(), day.val())) {
          value.addClass("govuk-input--error")
          ccsZaddErrorMessage(document.getElementById(parentID), "Enter a valid day");
        }
        else {
          if (matchValue || endmonthCheck || startmonthCheck || value == '') {
            value.addClass("govuk-input--error")
            ccsZaddErrorMessage(document.getElementById(parentID), "Enter a valid hour");
          } else {
            value.removeClass("govuk-input--error");
            ccsZremoveErrorMessage(document.getElementById(parentID));
          }
        }
      }
    });

    minutes.on('blur', () => {
      let value = minutes;
      if (value != undefined && value.val() != '') {
        let parentID = getParentId(element);
        let matchValue = !value.val().match(/^\d\d?$/);
        let endmonthCheck = Number(value.val()) > 59;
        let startmonthCheck = Number(value.val()) < 0;
        if (day.val() !== '' && month.val() !== '' && day.val() !== '' && !isValidDate(year.val(), month.val(), day.val())) {
          value.addClass("govuk-input--error")
          ccsZaddErrorMessage(document.getElementById(parentID), "Enter a valid day");
        }
        else {
          if (matchValue || endmonthCheck || startmonthCheck || value == '') {
            value.addClass("govuk-input--error")
            ccsZaddErrorMessage(document.getElementById(parentID), "Enter valid minutes");
          } else {
            value.removeClass("govuk-input--error");
            ccsZremoveErrorMessage(document.getElementById(parentID));
          }
        }
      }
    });

    responseDate.on('submit', (e) => {
      e.preventDefault();
      day.removeClass("govuk-input--error")
      month.removeClass("govuk-input--error")
      year.removeClass("govuk-input--error")
      minutes.removeClass("govuk-input--error")
      hour.removeClass("govuk-input--error")

      let errorStore = [];
      let parentID = getParentId(element);
      ccsZremoveErrorMessage(document.getElementById(parentID));

      if ((year.val() != undefined && year.val() == "") && (month.val() != undefined && month.val() == "") && (day.val() != undefined && day.val() == "")) {
        day.addClass("govuk-input--error")
        month.addClass("govuk-input--error")
        year.addClass("govuk-input--error")
        ccsZaddErrorMessage(document.getElementById(parentID), "Date should not be empty");
        errorStore = [[dateExpandedId, "Date should not be empty"]];
      }
      else if (day.val() != undefined && day.val() == "") {
        day.addClass("govuk-input--error")
        ccsZaddErrorMessage(document.getElementById(parentID), "Day should not be empty");
        errorStore = [[dateExpandedId, "Day should not be empty"]];
      }
      else if (month.val() != undefined && month.val() == "") {
        month.addClass("govuk-input--error")
        ccsZaddErrorMessage(document.getElementById(parentID), "Month should not be empty");
        errorStore = [[dateExpandedId, "Month should not be empty"]];
      }
      else if (year.val() != undefined && year.val() == "") {
        year.addClass("govuk-input--error")
        ccsZaddErrorMessage(document.getElementById(parentID), "Year should not be empty");
        errorStore = [[dateExpandedId, "Year should not be empty"]];
      }
      else if (hour.val() != undefined && hour.val() == "") {
        hour.addClass("govuk-input--error")
        ccsZaddErrorMessage(document.getElementById(parentID), "Hour should not be empty");
        errorStore = [[dateExpandedId, "Hour should not be empty"]];
      }
      else if (minutes.val() != undefined && minutes.val() == "") {
        minutes.addClass("govuk-input--error")
        ccsZaddErrorMessage(document.getElementById(parentID), "Minutes should not be empty");
        errorStore = [[dateExpandedId, "Minutes should not be empty"]];
      }
      else if (hourFormat[0].value != undefined && hourFormat[0].value == "") {
        ccsZaddErrorMessage(document.getElementById(parentID), "Please select hour format");
        errorStore = [[dateExpandedId, "Please select hour format"]];
      }
      else {
        if (!isValidDate(year.val(), month.val(), day.val())) {
          day.addClass("govuk-input--error")
          ccsZaddErrorMessage(document.getElementById(parentID), "Please enter valid date");
          errorStore = [[dateExpandedId, "Please enter valid date"]];
        }
        else {
          let currentDate = new Date();
          let enteredDate = new Date(year.val(), month.val() - 1, day.val());
          if (enteredDate < currentDate) {
            day.addClass("govuk-input--error")
            month.addClass("govuk-input--error")
            year.addClass("govuk-input--error")
            ccsZaddErrorMessage(document.getElementById(parentID), "Date should be in future");
            errorStore = [[dateExpandedId, "Date should be in future"]];
          }
          else {
            const questionNewDate = new Date(year.val(), month.val() - 1, day.val());
            const dayOfWeek = questionNewDate.getDay();
            if (dayOfWeek === 6 || dayOfWeek === 0) {
              day.addClass("govuk-input--error")
              month.addClass("govuk-input--error")
              year.addClass("govuk-input--error")
              ccsZaddErrorMessage(document.getElementById(parentID), "You can not set a date in weekend");
              errorStore = [[dateExpandedId, "You can not set a date in weekend"]];
            }
          }
        }
      }

      if (errorStore.length === 0)
      {
      let publication_date = new Date(document.getElementsByClassName("clarification_1")[0].innerText);
      let clarification_date = new Date(document.getElementsByClassName("clarification_2")[0].innerText);
      let deadline_publish_date = new Date(document.getElementsByClassName("clarification_3")[0].innerText);
      let deadline_supplier_date = new Date(document.getElementsByClassName("clarification_4")[0].innerText);
      let confirm_nextsteps_date = new Date(document.getElementsByClassName("clarification_5")[0].innerText);

      let isError = false;
      let inputDate = new Date(year.val(), month.val() - 1, day.val(), hour.val(), minutes.val());
      switch (element) {
        case 2: if (inputDate < publication_date || inputDate > deadline_publish_date) {
          isError = true;
          ccsZaddErrorMessage(document.getElementById(parentID), "You can not set date less than Publish and greater than Deadline for publishing date");
          errorStore = [[dateExpandedId, "You can not set date less than Publish and greater than Deadline for publishing date"]];
        }
          break;
        case 3: if (inputDate < clarification_date || inputDate > deadline_supplier_date) {
          isError = true;
          ccsZaddErrorMessage(document.getElementById(parentID), "You can not set date less than Clarification period and greater than Deadline for suppliers date");
          errorStore = [[dateExpandedId, "You can not set date less than Clarification period and greater than Deadline for suppliers date"]];
        }
          break;
        case 4: if (inputDate < deadline_publish_date || inputDate > confirm_nextsteps_date) {
          ccsZaddErrorMessage(document.getElementById(parentID), "You can not set date less than Deadline for publishing and greater than Confirm your next steps date");
          errorStore = [[dateExpandedId, "You can not set date less than Deadline for publishing and greater than Confirm your next steps date"]];
          isError = true;
        }
          break;
        case 5: if (inputDate < deadline_supplier_date) {
          ccsZaddErrorMessage(document.getElementById(parentID), "You can not set date less than Deadline for suppliers date");
          errorStore = [[dateExpandedId, "You can not set date less than Deadline for suppliers date"]];
          isError = true;
        }
          break;
        default: isError = false;
      }
    }
    
      if (errorStore.length === 0)
        document.getElementById(`${responseDateFormName}${element}`).submit()
      else
        ccsZPresentErrorSummary(errorStore);
    });

    function getParentId(element) {
      let parentID = '';
      if (document.getElementById(`rfi_clarification_date_expanded_${element}`) !== null) {
        parentID = `rfi_clarification_date_expanded_${element}`;
      }
      else if (document.getElementById(`rfp_clarification_date_expanded_${element}`) !== null) {
        parentID = `rfp_clarification_date_expanded_${element}`;
      }
      else if (document.getElementById(`eoi_clarification_date_expanded_${element}`) !== null) {
        parentID = `eoi_clarification_date_expanded_${element}`;
      }
      return parentID;
    }

    function isValidDate(year, month, day) {
      month = month - 1;
      var d = new Date(year, month, day);
      if (d.getFullYear() == year && d.getMonth() == month && d.getDate() == day) {
        return true;
      }
      return false;
    }
  }
});


$('.save-button').on('click', (e) => {
  e.preventDefault();
  const errorMsg= document.getElementsByClassName("govuk-error-message");
  if(errorMsg !=undefined && errorMsg !=null && errorMsg.length ==0)
  {
  let publication_date = new Date(document.getElementsByClassName("clarification_1")[0].innerText);
  let clarification_date = new Date(document.getElementsByClassName("clarification_2")[0].innerText);
  let deadline_publish_date = new Date(document.getElementsByClassName("clarification_3")[0].innerText);
  let deadline_supplier_date = new Date(document.getElementsByClassName("clarification_4")[0].innerText);
  let confirm_nextsteps_date = new Date(document.getElementsByClassName("clarification_5")[0].innerText);

  let isError = false;

  let selectors = [1, 2, 3, 4, 5];
  for (let element of selectors) {
    let day = $(`#clarification_date-day_${element}`);
    let month = $(`#clarification_date-month_${element}`);
    let year = $(`#clarification_date-year_${element}`);
    let hour = $(`#clarification_date-hour_${element}`);
    let minutes = $(`#clarification_date-minute_${element}`);

    if ((year.val() != undefined && year.val() != "") && (month.val() != undefined && month.val() != "") && (day.val() != undefined && day.val() != "")) {
      let inputDate = new Date(year.val(), month.val() - 1, day.val(), hour.val(), minutes.val());

      switch (element) {
        case 1: if (inputDate < publication_date) {
          isError = true;
        }
          break;
        case 2: if (inputDate < clarification_date) {
          e.preventDefault();
          isError = true;
        }
          break;
        case 3: if (inputDate < deadline_publish_date) {
          e.preventDefault();
          isError = true;
        }
          break;
        case 4: if (inputDate < deadline_supplier_date) {
          e.preventDefault();
          isError = true;
        }
          break;
        case 5: if (inputDate < confirm_nextsteps_date) {
          e.preventDefault();
          isError = true;
        }
          break;
        default: isError = false;
      }
    }
  }

  if (isError) {ccs_eoi_response_date_form
    $('#event-name-error-date').html('You can not set a date and time that is earlier than the previous milestone in the timeline');
    DaySelector.addClass('govuk-form-group--error');
    MonthSelector.addClass('govuk-form-group--error');
    YearSelector.addClass('govuk-form-group--error');
    $('.durations').addClass('govuk-form-group--error');
    const errorStore = [["eoi_clarification_date", "You can not set a date and time that is earlier than the previous milestone in the timeline"]]

    ccsZPresentErrorSummary(errorStore);
  }
  else {
    document.forms['ccs_response_date_form'].submit();
  }
}
});