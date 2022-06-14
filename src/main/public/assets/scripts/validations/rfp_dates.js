document.addEventListener('DOMContentLoaded', () => {
   if (document.getElementById('rfp_date') !== null) {
      let rfpResourceStartDay = $('.rfp_resource_start_day');
      let rfpResourceStartMonth = $('.rfp_resource_start_month');
      let rfpResourceStartYear = $('.rfp_resource_start_year');

      rfpResourceStartDay.on('keydown', (event) => {
         if (event.key === '.' || event.keyCode ===69)
           event.preventDefault(); });

           rfpResourceStartMonth.on('keydown', (event) => {
            if (event.key === '.' || event.keyCode ===69)
              event.preventDefault(); });

              rfpResourceStartYear.on('keydown', (event) => {
               if (event.key === '.' || event.keyCode ===69)
                 event.preventDefault(); });

      rfpResourceStartDay.on('blur', () => {
         if(DateCheckResourceStart())
         {
            if(MonthCheckResourceStart())
            YearCheckResourceStart();
         }
      });

      rfpResourceStartMonth.on('blur', () => {
         if(MonthCheckResourceStart())
         {
            if( DateCheckResourceStart())
            YearCheckResourceStart();
         }
      });

      rfpResourceStartYear.on('blur', () => {
         if(YearCheckResourceStart())
         {
            if(MonthCheckResourceStart())
            DateCheckResourceStart();
         }   
      });

      var currentEventId = '';
      let rfpDurationField = $('.rfp_duration');
      
      rfpDurationField.on('keydown', (event) => {
         if (event.key === '.'  || event.keyCode ===69)
           event.preventDefault(); });

      rfpDurationField.on('blur', (event) => {

         let currentId = event.currentTarget.id;
         let currentIdValue = $(`#${currentId}`);
         currentEventId = currentId;
         if (currentId.includes('day')) {
            DateCheck(currentIdValue);
         }

         else if (currentId.includes('month')) {
            MonthCheck(currentIdValue);
         }

         else if (currentId.includes('year')) {
            YearCheck(currentIdValue)
         }

      });

      const DateCheckResourceStart = () => {

         let value = rfpResourceStartDay;
         let matchValue = !value.val().match(/^\d\d?$/);
         let endmonthCheck = Number(value.val()) > 31;
         let startmonthCheck = Number(value.val()) < 1;
         if(value != undefined && value.val() != '')
         {
         if (matchValue || endmonthCheck || startmonthCheck) {
            rfpResourceStartDay.addClass('govuk-form-group--error');
            $('.durations').addClass('govuk-form-group--error');
            $('#event-name-error-date').html('Enter a valid date')
            return false ;
         } else {
            rfpResourceStartDay.removeClass('govuk-form-group--error');
            $('.durations').removeClass('govuk-form-group--error');
            $('#event-name-error-date').html('')
            return true ;
         }
      }
      }

      const MonthCheckResourceStart = () => {
         const value = rfpResourceStartMonth;
         let matchValue = !value.val().match(/^\d\d?$/);
         let endmonthCheck = Number(value.val()) > 12;
         let startmonthCheck = Number(value.val()) <= 0;
         if(value != undefined && value.val() != '')
         {
         if (matchValue || endmonthCheck || startmonthCheck) {
            rfpResourceStartMonth.addClass('govuk-form-group--error');
            $('.durations').addClass('govuk-form-group--error');
            $('#event-name-error-date').html('Enter a valid month');
            return false ;
         } else {
            rfpResourceStartMonth.removeClass('govuk-form-group--error');
            $('.durations').removeClass('govuk-form-group--error');
            $('#event-name-error-date').html('');
            return true ;
          
         }
      }
      }
      const YearCheckResourceStart = () => {

         let value = rfpResourceStartYear;
         let matchValue = !value.val().match(/^\d{4}$/);
         let endyearCheck = Number(value.val()) > 2121;
         let currentYear = new Date().getFullYear();
         let startyearCheck = Number(value.val()) < currentYear;
         if(value != undefined && value.val() != '')
         {
         if (matchValue || endyearCheck || startyearCheck) {
            rfpResourceStartYear.addClass('govuk-form-group--error');
            $('.durations').addClass('govuk-form-group--error');
            $('#event-name-error-date').html('Enter a valid year');
            return false ;
         } else {
            rfpResourceStartYear.removeClass('govuk-form-group--error');
            $('.durations').removeClass('govuk-form-group--error');
            $('#event-name-error-date').html('');
            return true ;
         }
      }
      }
     // const durationYear = document.getElementsByClassName('rfp_duration_year_25');
      const DateCheck = (rfpDay) => {
         let value = rfpDay;
         let matchValue = !value.val().match(/^\d\d?$/);
         let endmonthCheck = Number(value.val()) > 31;
         let startmonthCheck = Number(value.val()) < 0;
         if ((matchValue || endmonthCheck || startmonthCheck) && value.val() != '') {
            $(`#${currentEventId}`).addClass('govuk-form-group--error');
            $(`.${currentEventId}`).addClass('govuk-form-group--error');
            $(`.p_durations_${currentEventId}`).html('Enter a valid day');
         } else {
            $(`#${currentEventId}`).removeClass('govuk-form-group--error');
            $(`.${currentEventId}`).removeClass('govuk-form-group--error');
            $(`.p_durations_${currentEventId}`).html('');
         }
   }
   
      const MonthCheck = (rfpMonth) => {
         const value = rfpMonth;
         let matchValue = !value.val().match(/^\d\d?$/);
         let endmonthCheck = Number(value.val()) > 12;
         let startmonthCheck = Number(value.val()) < 0;
         if ((matchValue || endmonthCheck || startmonthCheck) && value.val() != '') {
            $(`#${currentEventId}`).addClass('govuk-form-group--error');
            $(`.${currentEventId}`).addClass('govuk-form-group--error');
            $(`.p_durations_${currentEventId}`).html('Enter a valid month');
         }
         else {
            $(`#${currentEventId}`).removeClass('govuk-form-group--error');
            $(`.${currentEventId}`).removeClass('govuk-form-group--error');
            $(`.p_durations_${currentEventId}`).html('');
         }
      }
      const YearCheck = (rfpYear) => {

         let value = rfpYear;
         let matchValue = !value.val().match(/^\d\d?$/);
         let endyearCheck = Number(value.val()) > 4;
         let startyearCheck = Number(value.val()) < 0;
         if ((matchValue || endyearCheck || startyearCheck) && value.val() != '') {
            $(`#${currentEventId}`).addClass('govuk-form-group--error');
            $(`.${currentEventId}`).addClass('govuk-form-group--error');
            $(`.p_durations_${currentEventId}`).html('Enter a year between 1 to 4');
         }
         else {
            $(`#${currentEventId}`).removeClass('govuk-form-group--error');
            $(`.${currentEventId}`).removeClass('govuk-form-group--error');
            $(`.p_durations_${currentEventId}`).html('');
         }
      }
   }
});

function daysInYear(year) {
   return ((year % 4 === 0 && year % 100 > 0) || year % 400 == 0) ? 366 : 365;
}

$('.rfp_date').on('submit', (e) => {
   e.preventDefault();

   $('.durations').removeClass('govuk-form-group--error');
   $('.resource_start_date').html('');

   if(checkResourceStartDate())
   {
      let isValid = isProjectStartDateValid();
      if (isValid) {
         isValid = isProjectExtensionValid();
      }
       if(isValid)
      document.forms['rfp_date'].submit();
   } 
});

function isValidDate(year, month, day) {
   month = month-1;
     var d = new Date(year, month, day);
     if (d.getFullYear() == year && d.getMonth() == month && d.getDate() == day) {
         return true;
     }
   return false;
 }
function checkResourceStartDate()
{
   let flag = true;
   
      let rfpResourceStartDay = $('.rfp_resource_start_day');
      let rfpResourceStartMonth = $('.rfp_resource_start_month');
      let rfpResourceStartYear = $('.rfp_resource_start_year');
      if(rfpResourceStartDay.val() == '' && rfpResourceStartMonth.val() == '' && rfpResourceStartYear.val() == '')
      {
         flag =false;
         $('.durations').addClass('govuk-form-group--error');
         $('#event-name-error-date').html('Project start date should not be empty'); 
      }
      else if(rfpResourceStartDay.val() =='')
      {
         flag = false;
         rfpResourceStartDay.addClass('govuk-form-group--error');
         rfpResourceStartMonth.removeClass('govuk-form-group--error');
         rfpResourceStartYear.removeClass('govuk-form-group--error');
         $('.durations').addClass('govuk-form-group--error');
         $('#event-name-error-date').html('Enter a valid date');
        
      }
      else if(rfpResourceStartMonth.val() =='')
      {
         flag =false;
         rfpResourceStartMonth.addClass('govuk-form-group--error');
         rfpResourceStartDay.removeClass('govuk-form-group--error');
         rfpResourceStartYear.removeClass('govuk-form-group--error');
            $('.durations').addClass('govuk-form-group--error');
            $('#event-name-error-date').html('Enter a valid month');
            
      }
      else if(rfpResourceStartYear.val() =='')
      {
         flag =false;
         rfpResourceStartYear.addClass('govuk-form-group--error');
         rfpResourceStartDay.removeClass('govuk-form-group--error');
         rfpResourceStartMonth.removeClass('govuk-form-group--error');
         $('.durations').addClass('govuk-form-group--error');
         $('#event-name-error-date').html('Enter a valid year');    
      }
      else 
      {
         flag =true;
         rfpResourceStartYear.removeClass('govuk-form-group--error');
         rfpResourceStartMonth.removeClass('govuk-form-group--error');
         rfpResourceStartDay.removeClass('govuk-form-group--error');
         $('.durations').removeClass('govuk-form-group--error');
         $('#event-name-error-date').html('')

         if(!isValidDate(rfpResourceStartYear.val(),rfpResourceStartMonth.val(),rfpResourceStartDay.val()))
         {
            flag =false;
            $('.durations').addClass('govuk-form-group--error');
            $('#event-name-error-date').html('Enter a valid date'); 
         }
         else 
         {
            flag =true;
            $('.durations').removeClass('govuk-form-group--error');
            $('#event-name-error-date').html(''); 
         }
      }
      
      return flag;
}

function isProjectExtensionValid() {
   let isValid = false;

   $('.p_durations').removeClass('govuk-form-group--error');
   let pDurationName = $('.p_durations')[0].classList[1];
   let pExtDurationName = $('.p_durations')[1].classList[1];

   const durationYear = document.getElementsByClassName('rfp_duration_year_25');
   const durationMonth = document.getElementsByClassName('rfp_duration_month_25');
   const durationDay = document.getElementsByClassName('rfp_duration_day_25');
   const durationDayError = document.getElementsByClassName('p_durations_pday_25');

   const YearProjectRun = durationYear[0].value;
   const MonthProjectRun = durationMonth[0].value;
   const DaysProjectRun = durationDay[0].value;

   var projectRunInDays = 0;
   if (YearProjectRun != null && YearProjectRun != "") {
      if(Number(YearProjectRun) > 4 )
      {
         $(`.${pDurationName}`).addClass('govuk-form-group--error');   
         $(`.${durationDayError[0].classList[2]}`).html('Project extension duration should not be more than 4 years');
         return false;
      }
      else if (Number(YearProjectRun) >= 4 && (Number(MonthProjectRun)> 0 || Number(DaysProjectRun) > 0 ))
      {
         $(`.${pDurationName}`).addClass('govuk-form-group--error');
         $(`.${durationDayError[0].classList[2]}`).html('Project extension duration should not be more than 4 years');
         return false;
      }
      
      projectRunInDays = (365 * Number(YearProjectRun))
   }
   if (MonthProjectRun != null && MonthProjectRun != "") {
      projectRunInDays = projectRunInDays + (30 * Number(MonthProjectRun))
   }

   if (DaysProjectRun != null && DaysProjectRun != "") {
      projectRunInDays = projectRunInDays + Number(DaysProjectRun)
   }

   const YearExtensionPeriod = durationYear[1].value;
   const MonthExtensionPeriod = durationMonth[1].value;
   const DaysExtensionPeriod = durationDay[1].value;

   var extensionRunInDays = 0;
   if (YearExtensionPeriod != null && YearExtensionPeriod != "") {
      extensionRunInDays = (365 * Number(YearExtensionPeriod))
   }
   if (MonthExtensionPeriod != null && MonthExtensionPeriod != "") {
      extensionRunInDays = extensionRunInDays + (30 * Number(MonthExtensionPeriod))
   }

   if (DaysExtensionPeriod != null && DaysExtensionPeriod != "") {
      extensionRunInDays = extensionRunInDays + Number(DaysExtensionPeriod)
   }

   if (projectRunInDays != null && projectRunInDays > 0 && extensionRunInDays != null && extensionRunInDays > 0) {
      let tempProjectRunInDays = Number(projectRunInDays);
      let tempExtensionRunInDays = Number(extensionRunInDays);
      if (tempProjectRunInDays > tempExtensionRunInDays) {
         let dayDiffPercentage = ((tempExtensionRunInDays / tempProjectRunInDays) * 100);
         if (dayDiffPercentage > 25) {
            isValid = false;       
            $(`.${pExtDurationName}`).addClass('govuk-form-group--error');   
            $(`.${durationDayError[1].classList[2]}`).html('This should not exceed 25% of the length of the original project');
         }
         else {
            isValid = true;
            $(`.${durationDayError[1].classList[2]}`).html('');
         }
      }
      else {
         isValid = false;
         $(`.${pExtDurationName}`).addClass('govuk-form-group--error');  
         $(`.${durationDayError[1].classList[2]}`).html('Contract extension should be less than project run date');
      }
   }
   else {
      isValid = true;
   }
   return isValid;
}

function isProjectStartDateValid()
{
   const Day = $('.rfp_resource_start_day');
   const Month = $('.rfp_resource_start_month');
   const Year = $('.rfp_resource_start_year');
   
   if (Day.val() !== null && Day.val() !== "" && Month.val() !== null && Month.val() !== "" && Year.val() !== null && Year.val() !== "") {
            Day.removeClass('govuk-form-group--error');
            Month.removeClass('govuk-form-group--error');
            Year.removeClass('govuk-form-group--error');
            $('.durations').removeClass('govuk-form-group--error');

      let rfpagreementData;
      // if ($('.agreement_no').attr('id')) {
      //     rfpagreementData = $('.agreement_no').attr('id').split("-");
      // }
      if ($('#rpf_section_3_aggrimentEndDate').attr('agreementEndDate')) {
         rfpagreementData = $('#rpf_section_3_aggrimentEndDate').attr('agreementEndDate').split("-");
      }

      if (rfpagreementData !== null && rfpagreementData !== undefined && rfpagreementData.length > 0) {
         const expiryYears = rfpagreementData != undefined && rfpagreementData != null ? Number(rfpagreementData[0]) : null;
         const expiryMonth = rfpagreementData != undefined && rfpagreementData != null ? Number(rfpagreementData[1]) : null;
         const expiryDate = rfpagreementData != undefined && rfpagreementData != null ? Number(rfpagreementData[2]) : null;

         const ExpiryDates = expiryYears != null && expiryMonth != null && expiryDate != null ? new Date(expiryYears, expiryMonth, expiryDate) : null;
         const getMSOfExpiryDate = ExpiryDates != null ? ExpiryDates.getTime() : null;
         const FormDate = new Date(Year.val(), (Month.val()-1), Day.val());

         const getTimeOfFormDate = FormDate.getTime();
         const todayDate = new Date();
         if (getTimeOfFormDate > getMSOfExpiryDate) {

            $('#event-name-error-date').html('Start date cannot be after agreement expiry date');
            Day.addClass('govuk-form-group--error');
            Month.addClass('govuk-form-group--error');
            Year.addClass('govuk-form-group--error');
            $('.durations').addClass('govuk-form-group--error');
            return false;
         }
         if (getTimeOfFormDate < todayDate.getTime()) {

            $('#event-name-error-date').html('Start date must be a valid future date');
            Day.addClass('govuk-form-group--error');
            Month.addClass('govuk-form-group--error');
            Year.addClass('govuk-form-group--error');
            $('.durations').addClass('govuk-form-group--error');
            return false;
         }
      }

      const startDate = new Date(Number(Year.val()), Number(Month.val() - 1), Number(Day.val()));
      if (!isValidDate(Number(Year.val()), Number(Month.val()), Number(Day.val()))) {

         $('.durations').addClass('govuk-form-group--error');
         $('.resource_start_date').html('Enter a valid project start date');
         return false;
      }
      else if (startDate > new Date(2024, 00, 19)) {
         $('.durations').addClass('govuk-form-group--error');
         $('.resource_start_date').html('Project cannot start after: 19 January 2024');
          return false;
      }
      else {
         $('.durations').removeClass('govuk-form-group--error');
         $('.resource_start_date').html('');
         return true;
      }
   }
   else return false;
}

function isValidDate(year, month, day) {
   month = month - 1;
   var d = new Date(year, month, day);
   if (d.getFullYear() == year && d.getMonth() == month && d.getDate() == day) {
      return true;
   }
   return false;
}
