document.addEventListener('DOMContentLoaded', () => {

  let selectors = [1,2,3,4,5];
  for(let element of selectors){
 
 
   let day = $(`#clarification_date-day_${element}`);
   let month = $(`#clarification_date-month_${element}`);
   let year = $(`#clarification_date-year_${element}`);
   let hour = $(`#clarification_date-hour_${element}`);
   let minutes = $(`#clarification_date-minute_${element}`);
 
   day.on('blur', ()=>{
     let value  = day;
     let parentID = `rfi_clarification_date_expanded_${element}`;
     let elementSelector = $(parentID);
     if(elementSelector.length === 0)
        elementSelector = `eoi_clarification_date_expanded_${element}`;
     let matchValue = !value.val().match(/^\d\d?$/);
     let endmonthCheck = Number(value.val()) > 31;
     let startmonthCheck = Number(value.val()) < 1;
     if (matchValue || endmonthCheck || startmonthCheck) {
       value.addClass("govuk-input--error")
       ccsZaddErrorMessage(document.getElementById(elementSelector), "Enter a valid date");
     } else {
      value.removeClass("govuk-input--error");
       ccsZremoveErrorMessage(document.getElementById(elementSelector));
     }
 
   });
 
 
   month.on('blur', ()=>{
     let value  = month;
     let parentID = `rfi_clarification_date_expanded_${element}`;
     let elementSelector = $(parentID);
     if(elementSelector.length === 0)
        elementSelector = `eoi_clarification_date_expanded_${element}`;
     let matchValue = !value.val().match(/^\d\d?$/);
     let endmonthCheck = Number(value.val()) > 12;
     let startmonthCheck = Number(value.val()) <= 0;
     if (matchValue || endmonthCheck || startmonthCheck) {
       value.addClass("govuk-input--error")
       ccsZaddErrorMessage(document.getElementById(elementSelector), "Enter a valid month");
     } else {
      value.removeClass("govuk-input--error");
       ccsZremoveErrorMessage(document.getElementById(elementSelector));
     }
 
   });
 
 
   year.on('blur', ()=>{
     let value  = year;
     let parentID = `rfi_clarification_date_expanded_${element}`;
     let elementSelector = $(parentID);
     if(elementSelector.length === 0)
        elementSelector = `eoi_clarification_date_expanded_${element}`;
     let matchValue = !value.val().match(/^\d{4}$/);
     let endyearCheck = Number(value.val()) > 2121;
     let startyearCheck = Number(value.val()) < 2021;
     if (matchValue || endyearCheck || startyearCheck) {
       value.addClass("govuk-input--error")
       ccsZaddErrorMessage(document.getElementById(elementSelector), "Enter a valid year");
     } else {
      value.removeClass("govuk-input--error");
       ccsZremoveErrorMessage(document.getElementById(elementSelector));
     }
 
   });
 
 
   hour.on('blur', ()=>{
     let value  = hour;
     let parentID = `rfi_clarification_date_expanded_${element}`;
     let elementSelector = $(parentID);
     if(elementSelector.length === 0)
        elementSelector = `eoi_clarification_date_expanded_${element}`;
     let matchValue = !value.val().match(/^\d\d?$/);
     let endmonthCheck = Number(value.val()) > 12;
     let startmonthCheck = Number(value.val()) <= 0;
     if (matchValue || endmonthCheck || startmonthCheck) {
       value.addClass("govuk-input--error")
       ccsZaddErrorMessage(document.getElementById(elementSelector), "Enter a valid hour");
     } else {
      value.removeClass("govuk-input--error");
       ccsZremoveErrorMessage(document.getElementById(elementSelector));
     }
 
   });
 
 
   minutes.on('blur', ()=>{
     let value  = minutes;
     let parentID = `rfi_clarification_date_expanded_${element}`;
     let elementSelector = $(parentID);
     if(elementSelector.length === 0)
        elementSelector = `eoi_clarification_date_expanded_${element}`;
     let matchValue = !value.val().match(/^\d\d?$/);
     let endmonthCheck = Number(value.val()) > 59;
     let startmonthCheck = Number(value.val()) <= 0;
     if (matchValue || endmonthCheck || startmonthCheck || value == '' ) {
       value.addClass("govuk-input--error")
       ccsZaddErrorMessage(document.getElementById(elementSelector), "Enter valid minutes");
     } else {
      value.removeClass("govuk-input--error");
       ccsZremoveErrorMessage(document.getElementById(elementSelector));
     }
 
   });
 
 
 
 
  }
 
 
 
 
 
 });
 
 
 
 
 
 
 
 