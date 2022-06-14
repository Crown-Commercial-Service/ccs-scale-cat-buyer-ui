document.addEventListener('DOMContentLoaded', () => {

  let selectors = [1,2,3,4,5];
  for(let element of selectors){
   let day = $(`#clarification_date-day_${element}`);
   let month = $(`#clarification_date-month_${element}`);
   let year = $(`#clarification_date-year_${element}`);
   let hour = $(`#clarification_date-hour_${element}`);
   let minutes = $(`#clarification_date-minute_${element}`);

   let responseDate = $(`#ccs_rfi_response_date_form_${element}`);

   day.on('blur', ()=>{
     let value  = day;
     if(value != undefined && value.val() != '')
     {
     let parentID = getParentId(element);  
     let matchValue = !value.val().match(/^\d\d?$/);
     let endmonthCheck = Number(value.val()) > 31;
     let startmonthCheck = Number(value.val()) < 1;     
     if (matchValue || endmonthCheck || startmonthCheck) {
       value.addClass("govuk-input--error")
       ccsZaddErrorMessage(document.getElementById(parentID), "Enter a valid date");
     } 
      else
      {
        value.removeClass("govuk-input--error");
        ccsZremoveErrorMessage(document.getElementById(parentID));
     }
    }
   });
 
   month.on('blur', ()=>{
     let value  = month;
     if(value != undefined && value.val() != '')
     {
     let parentID = getParentId(element);  
     let matchValue = !value.val().match(/^\d\d?$/);
     let endmonthCheck = Number(value.val()) > 12;
     let startmonthCheck = Number(value.val()) <= 0;
     if (matchValue || endmonthCheck || startmonthCheck) {
       value.addClass("govuk-input--error")
       ccsZaddErrorMessage(document.getElementById(parentID), "Enter a valid month");
     }
      else{
      value.removeClass("govuk-input--error");
       ccsZremoveErrorMessage(document.getElementById(parentID));
      }
    }
     });
 
   year.on('blur', ()=>{
     let value  = year;
     if(value != undefined && value.val() != '')
     {
     let parentID = getParentId(element);
     let matchValue = !value.val().match(/^\d{4}$/);
     let endyearCheck = Number(value.val()) > 2121;
     let currentYear =  new Date().getFullYear();
     let startyearCheck = Number(value.val()) < currentYear;
     if (matchValue || endyearCheck || startyearCheck) {
       value.addClass("govuk-input--error")
       ccsZaddErrorMessage(document.getElementById(parentID), "Enter a valid year");
     }
        else{
        value.removeClass("govuk-input--error");
         ccsZremoveErrorMessage(document.getElementById(parentID));
        }
      }
   });
 
   hour.on('blur', ()=>{
     let value  = hour;
     if(value != undefined && value.val() != '')
     {
     let parentID = getParentId(element);
     let matchValue = !value.val().match(/^\d\d?$/);
     let endmonthCheck = Number(value.val()) > 12;
     let startmonthCheck = Number(value.val()) <= 0;
     if (day.val() !=='' && month.val() !== '' && day.val() !=='' && !isValidDate(year.val(),month.val(),day.val()))
        {
          value.addClass("govuk-input--error")
          ccsZaddErrorMessage(document.getElementById(parentID), "Enter a valid day");
        }
        else
        {
     if (matchValue || endmonthCheck || startmonthCheck|| value == '' ) {
       value.addClass("govuk-input--error")
       ccsZaddErrorMessage(document.getElementById(parentID), "Enter a valid hour");
     } else {
      value.removeClass("govuk-input--error");
       ccsZremoveErrorMessage(document.getElementById(parentID));
     }
    }
  }
   });
 
   minutes.on('blur', ()=>{
     let value  = minutes;
     if(value != undefined && value.val() != '')
     {
     let parentID = getParentId(element);
     let matchValue = !value.val().match(/^\d\d?$/);
     let endmonthCheck = Number(value.val()) > 59;
     let startmonthCheck = Number(value.val()) < 0;
     if (day.val() !=='' && month.val() !== '' && day.val() !=='' && !isValidDate(year.val(),month.val(),day.val()))
        {
          value.addClass("govuk-input--error")
          ccsZaddErrorMessage(document.getElementById(parentID), "Enter a valid day");
        }
        else
        {
     if (matchValue || endmonthCheck || startmonthCheck || value == '' ) {
       value.addClass("govuk-input--error")
       ccsZaddErrorMessage(document.getElementById(parentID), "Enter valid minutes");
     } else {
       value.removeClass("govuk-input--error");
       ccsZremoveErrorMessage(document.getElementById(parentID));
     }
    }
    }
   });

   responseDate.on('submit', (e)=> {
    e.preventDefault();
    day.removeClass("govuk-input--error")
    month.removeClass("govuk-input--error")
    year.removeClass("govuk-input--error")

    let parentID = getParentId(element);
 ccsZremoveErrorMessage(document.getElementById(parentID));

    if((year.val() != undefined && year.val() == "") &&(month.val() != undefined && month.val() == "") && (day.val() != undefined && day.val() == ""))
    {
      day.addClass("govuk-input--error")
      month.addClass("govuk-input--error")
      year.addClass("govuk-input--error")
      ccsZaddErrorMessage(document.getElementById(parentID), "Date should not be empty");
    }
    else if(day.val() != undefined && day.val() == "")
    {
      day.addClass("govuk-input--error")
      ccsZaddErrorMessage(document.getElementById(parentID), "Day should not be empty");
    }
    else if(month.val() != undefined && month.val() == "")
    {
      month.addClass("govuk-input--error")
      ccsZaddErrorMessage(document.getElementById(parentID), "Month should not be empty");
    }
    else if(year.val() != undefined && year.val() == "")
    { 
      year.addClass("govuk-input--error")
      ccsZaddErrorMessage(document.getElementById(parentID), "Year should not be empty");
    }
    else 
    { 
      if(!isValidDate(year.val(),month.val(),day.val()))
      {
        day.addClass("govuk-input--error")
        ccsZaddErrorMessage(document.getElementById(parentID), "Please enter valid date");
      } 
      else 
      {
        let currentDate = new Date();
        let enteredDate = new Date(year.val(),month.val()-1,day.val());
        if(enteredDate < currentDate)
        {
          day.addClass("govuk-input--error")
          month.addClass("govuk-input--error")
          year.addClass("govuk-input--error")
          ccsZaddErrorMessage(document.getElementById(parentID), "Date should be in future");
        }
        else 
        {
          document.getElementById(`ccs_rfi_response_date_form_${element}`).submit()
        }
      }
    }
  });

   function getParentId(element)
   {
      let parentID ='';
    if (document.getElementById(`rfi_clarification_date_expanded_${element}`) !== null)
      {
       parentID = `rfi_clarification_date_expanded_${element}`;
      }
    else if (document.getElementById(`rfp_clarification_date_expanded_${element}`) !== null)
      {
       parentID = `rfp_clarification_date_expanded_${element}`;
      }
    else if(document.getElementById(`eoi_clarification_date_expanded_${element}`) !== null)
      {
      parentID = `eoi_clarification_date_expanded_${element}`;
      }
      return parentID;
    }

    function isValidDate(year, month, day) {
      month = month-1;
        var d = new Date(year, month, day);
        if (d.getFullYear() == year && d.getMonth() == month && d.getDate() == day) {
            return true;
        }
      return false;
    }
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
      $('#event-name-error-date').html('You can not set a date and time that is earlier than the previous milestone in the timeline');
      DaySelector.addClass('govuk-form-group--error');
      MonthSelector.addClass('govuk-form-group--error');
      YearSelector.addClass('govuk-form-group--error');
      $('.durations').addClass('govuk-form-group--error');
      const errorStore = [["eoi_clarification_date", "You can not set a date and time that is earlier than the previous milestone in the timeline"]]

      ccsZPresentErrorSummary(errorStore);
  }
  else{
    document.forms['ccs_eoi_response_date_form'].submit();
}
});
 