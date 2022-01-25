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
     let currentYear =  new Date().getFullYear();
     let startyearCheck = Number(value.val()) < currentYear;
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

 $('.save-button').on('click', (e)=> {
  let publication_date = new Date(document.getElementsByClassName("clarification_1")[0].innerText);
  let clarification_date = new Date(document.getElementsByClassName("clarification_2")[0].innerText);
  let deadline_publish_date = new Date(document.getElementsByClassName("clarification_3")[0].innerText);
  let deadline_supplier_date = new Date(document.getElementsByClassName("clarification_4")[0].innerText);
  let confirm_nextsteps_date =new Date(document.getElementsByClassName("clarification_5")[0].innerText);

  let isError = false;
  
  let selectors = [1,2,3,4,5];
  for(let element of selectors){
  let day = $(`#clarification_date-day_${element}`);
  let month = $(`#clarification_date-month_${element}`);
  let year = $(`#clarification_date-year_${element}`);
  let hour = $(`#clarification_date-hour_${element}`);
  let minutes = $(`#clarification_date-minute_${element}`);

  if((year.val() != undefined && year.val() != "") &&(month.val() != undefined && month.val() != "") && (day.val() != undefined && day.val() != "")){
  let inputDate =  new Date(year.val(),month.val()-1,day.val(),hour.val(),minutes.val());

    switch(element){
      case 1:if(inputDate < publication_date){
        isError = true;
      }
      break;
      case 2: if(inputDate < clarification_date){
        e.preventDefault();
        isError = true;
      }
      break;
      case 3:if(inputDate < deadline_publish_date){
        e.preventDefault();
        isError = true;
      }
      break;
      case 4:if(inputDate < deadline_supplier_date){
        e.preventDefault();
        isError = true;
      }
      break;
      case 5:if(inputDate < confirm_nextsteps_date){
        e.preventDefault();
        isError = true;
      }
      break;
      default : isError = false;
      }
    }
  }
  if(isError){
      $('#event-name-error-date').html('This milestone needs to be set after the previous milestone date');
      DaySelector.addClass('govuk-form-group--error');
      MonthSelector.addClass('govuk-form-group--error');
      YearSelector.addClass('govuk-form-group--error');
      $('.durations').addClass('govuk-form-group--error');
      const errorStore = [["eoi_clarification_date", "This milestone needs to be set after the previous milestone date"]]

      ccsZPresentErrorSummary(errorStore);
  }
  else{
    document.forms['ccs_eoi_response_date_form'].submit();
}


})
 
 
 
 
 
 
 
 