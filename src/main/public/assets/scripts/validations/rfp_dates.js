document.addEventListener('DOMContentLoaded', () => {
   if (document.getElementById('rfp_date') !== null) {
    let rfpResourceStartDay = $('.rfp_resource_start_day');
    let rfpResourceStartMonth = $('.rfp_resource_start_month');
    let rfpResourceStartYear = $('.rfp_resource_start_year');

    rfpResourceStartDay.on('blur', () => {
      DateCheckResourceStart();
      MonthCheckResourceStart();
   });

  rfpResourceStartMonth.on('blur', () => {
   MonthCheckResourceStart();
   DateCheckResourceStart();
   });

rfpResourceStartYear.on('blur', () => {
   YearCheckResourceStart();
   MonthCheckResourceStart();
   DateCheckResourceStart();
   });

   var currentEventId = '';
   let rfpDurationField = $('.rfp_duration');

    rfpDurationField.on('blur',(event) => {

   let currentId  = event.currentTarget.id;
   let currentIdValue = $(`#${currentId}`);
   currentEventId = currentId;
   if(currentId.includes('day'))
   {
      DateCheck(currentIdValue);
   }
  
   else if(currentId.includes('month'))
   {
      MonthCheck(currentIdValue);
   }
  
   else if(currentId.includes('year'))
   {
      YearCheck(currentIdValue)
   }
  
});

const DateCheckResourceStart = () => {

   let value = rfpResourceStartDay;
   let matchValue = !value.val().match(/^\d\d?$/);
    let endmonthCheck = Number(value.val()) > 31;
    let startmonthCheck = Number(value.val()) < 1;     
    if (matchValue || endmonthCheck || startmonthCheck|| value == '' ) {
      rfpResourceStartDay.addClass('govuk-form-group--error');
           $('.durations').addClass('govuk-form-group--error');
           $('#event-name-error-date').html('Enter a valid date')
    } else {
      rfpResourceStartDay.removeClass('govuk-form-group--error');
           $('.durations').removeClass('govuk-form-group--error');
           $('#event-name-error-date').html('')
    }
   }

 const MonthCheckResourceStart = () => {
   const value = rfpResourceStartMonth;
  let matchValue = !value.val().match(/^\d\d?$/);
  let endmonthCheck = Number(value.val()) > 12;
  let startmonthCheck = Number(value.val()) <= 0;
  if (matchValue || endmonthCheck || startmonthCheck|| value == '' ) {
   rfpResourceStartMonth.addClass('govuk-form-group--error');
   $('.durations').addClass('govuk-form-group--error');
   $('#event-name-error-month').html('Enter a valid month');
} else {
   rfpResourceStartMonth.removeClass('govuk-form-group--error');
   $('.durations').removeClass('govuk-form-group--error');
   $('#event-name-error-month').html('');
}
 }
 const YearCheckResourceStart = () => {

  let value  = rfpResourceStartYear;
  let matchValue = !value.val().match(/^\d{4}$/);
  let endyearCheck = Number(value.val()) > 2121;
  let currentYear =  new Date().getFullYear();
  let startyearCheck = Number(value.val()) < currentYear;
  if (matchValue || endyearCheck || startyearCheck|| value == '' ) {
   rfpResourceStartYear.addClass('govuk-form-group--error');
   $('.durations').addClass('govuk-form-group--error');
   $('#event-name-error-year').html('Enter a valid year');
} else {
   rfpResourceStartYear.removeClass('govuk-form-group--error');
   $('.durations').removeClass('govuk-form-group--error');
   $('#event-name-error-year').html('');
}
 }

   const DateCheck = (rfpDay) => {

      let value = rfpDay;
      let matchValue = !value.val().match(/^\d\d?$/);
       let endmonthCheck = Number(value.val()) > 31;
       let startmonthCheck = Number(value.val()) < 1;     
       if (matchValue || endmonthCheck || startmonthCheck|| value == '' ) {
        $(`#${currentEventId}`).addClass('govuk-form-group--error');
        $(`.${currentEventId}`).addClass('govuk-form-group--error');
        $(`.p_durations_pday_${currentEventId}`).html('Enter a valid day');
     } else {
      $(`#${currentEventId}`).removeClass('govuk-form-group--error');
        $(`.${currentEventId}`).removeClass('govuk-form-group--error');
        $(`.p_durations_pday_${currentEventId}`).html('');
     }
      }

    const MonthCheck = (rfpMonth) => {
        const value = rfpMonth;
     let matchValue = !value.val().match(/^\d\d?$/);
     let endmonthCheck = Number(value.val()) > 12;
     let startmonthCheck = Number(value.val()) <= 0;
     if (matchValue || endmonthCheck || startmonthCheck|| value == '' ) {
      $(`#${currentEventId}`).addClass('govuk-form-group--error');
        $(`.${currentEventId}`).addClass('govuk-form-group--error');
        $(`.p_durations_pmonth_${currentEventId}`).html('Enter a valid month');
     }
      else {
      $(`#${currentEventId}`).removeClass('govuk-form-group--error');
        $(`.${currentEventId}`).removeClass('govuk-form-group--error');
        $(`.p_durations_pmonth_${currentEventId}`).html('');
     }
    }
    const YearCheck = (rfpYear) => {

     let value  = rfpYear;
     let matchValue = !value.val().match(/^\d{4}$/);
     let endyearCheck = Number(value.val()) > 2121;
     let currentYear =  new Date().getFullYear();
     let startyearCheck = Number(value.val()) < currentYear;
     if (matchValue || endyearCheck || startyearCheck|| value == '' ) {
      $(`#${currentEventId}`).addClass('govuk-form-group--error');
        $(`.${currentEventId}`).addClass('govuk-form-group--error');
        $(`.p_durations_pyear_${currentEventId}`).html('Enter a valid year');
     }
      else {
      $(`#${currentEventId}`).removeClass('govuk-form-group--error');
        $(`.${currentEventId}`).removeClass('govuk-form-group--error');
        $(`.p_durations_pyear_${currentEventId}`).html('');
     }
    }
}});

$('.rfp_date').on('submit', (e) => {
   e.preventDefault();

    let isValid = false;
   
    const Day = $('.rfp_resource_start_day');
    const Month = $('.rfp_resource_start_month');
    const Year = $('.rfp_resource_start_year');

     $('.durations').removeClass('govuk-form-group--error');
      $('.resource_start_date').html('');

    if (Day.val() !== null && Day.val() !== "" && Month.val() !== null && Month.val() !== "" && Year.val() !== null && Year.val() !== "" )
    {
      let rfpagreementData;
      // if ($('.agreement_no').attr('id')) {
      //     rfpagreementData = $('.agreement_no').attr('id').split("-");
      // }
      if ($('#rpf_section_3_aggrimentEndDate').attr('agreementEndDate')) {
         rfpagreementData = $('#rpf_section_3_aggrimentEndDate').attr('agreementEndDate').split("-");
      }
  
      if(rfpagreementData !==null && rfpagreementData !== undefined && rfpagreementData.length > 0)
      {
         const expiryYears =rfpagreementData !=undefined && rfpagreementData !=null? Number(rfpagreementData[0]):null;
         const expiryMonth = rfpagreementData !=undefined && rfpagreementData !=null? Number(rfpagreementData[1]):null;
         const expiryDate = rfpagreementData !=undefined && rfpagreementData !=null? Number(rfpagreementData[2]):null;
     
         const ExpiryDates =expiryYears !=null &&expiryMonth !=null && expiryDate !=null? new Date(expiryYears, expiryMonth, expiryDate):null;
         const getMSOfExpiryDate =ExpiryDates !=null? ExpiryDates.getTime():null;
          const FormDate = new Date(Year.val(), Month.val(), Day.val());

      const getTimeOfFormDate = FormDate.getTime();
      const todayDate = new Date();
      if (getTimeOfFormDate > getMSOfExpiryDate) {
         
            $('#event-name-error-date').html('Start date cannot be after agreement expiry date');
            Day.addClass('govuk-form-group--error');
            Month.addClass('govuk-form-group--error');
            Year.addClass('govuk-form-group--error');
            $('.durations').addClass('govuk-form-group--error');
         const errorStore = [["rfp_resource_start_date", "Start date cannot be after agreement expiry date"]]
         ccsZPresentErrorSummary(errorStore);
         
    }
    else if (getTimeOfFormDate < todayDate.getTime()) {
   
      $('#event-name-error-date').html('Start date must be a valid future date');
        Day.addClass('govuk-form-group--error');
        Month.addClass('govuk-form-group--error');
        Year.addClass('govuk-form-group--error');
         $('.durations').addClass('govuk-form-group--error');
         const errorStore = [["rfp_resource_start_date", "Start date must be a valid future date"]];
         ccsZPresentErrorSummary(errorStore);
  }
      }

      const startDate = new Date(Number(Year.val()),Number(Month.val()-1),Number(Day.val()));
      if(!isValidDate(Number(Year.val()),Number(Month.val()),Number(Day.val())))
      {
           
        $('.durations').addClass('govuk-form-group--error');
            $('.resource_start_date').html('Enter a valid project start date');   
}
else if(startDate > new Date(2024,00,19))
{ 
 $('.durations').addClass('govuk-form-group--error');
$('.resource_start_date').html('project cannot start after: 19 January 2024');
}
      else {
         $('.durations').removeClass('govuk-form-group--error');
         $('.resource_start_date').html('');
         isValid = true;
      }
}
    else 
    {
      $('.durations').addClass('govuk-form-group--error');
      $('.resource_start_date').html('Project start date cannot be Empty or Invalid');
    }

    function isValidDate(year, month, day) {
      month = month-1;
        var d = new Date(year, month, day);
        if (d.getFullYear() == year && d.getMonth() == month && d.getDate() == day) {
            return true;
        }
      return false;
    }
     let allDurationFieldValue = [];
    const allDurationField = $('.rfp_duration');
    for (let i = 0; i < allDurationField.length; i++) {
       if(allDurationField[i].value !=='' && allDurationField[i].value !==null)
           
             allDurationFieldValue.push(true);
        }

        if(allDurationFieldValue.length !=0 && allDurationFieldValue.length != allDurationField.length)
        {
         isValid = false; 
        }
 
    if(isValid)
    document.forms['rfp_date'].submit();
});