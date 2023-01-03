document.addEventListener('DOMContentLoaded', () => {
   if (document.getElementById('rfp_date') !== null) {
      let rfpResourceStartDay = $('.rfp_resource_start_day');
      let rfpResourceStartMonth = $('.rfp_resource_start_month');
      let rfpResourceStartYear = $('.rfp_resource_start_year');

      rfpResourceStartDay.on('keydown', (event) => {

         if (event.key === '.' || event.keyCode ===69 || event.keyCode ===189 || event.keyCode ===109)
           event.preventDefault(); });

           rfpResourceStartMonth.on('keydown', (event) => {
            if (event.key === '.' || event.keyCode ===69 || event.keyCode ===189 || event.keyCode ===109)
              event.preventDefault(); });

              rfpResourceStartYear.on('keydown', (event) => {
               if (event.key === '.' || event.keyCode ===69 || event.keyCode ===189 || event.keyCode ===109)
                 event.preventDefault(); });

      rfpResourceStartDay.on('keyup', () => {
         DateCheckResourceStart();
      });

      rfpResourceStartMonth.on('keyup', () => {
         MonthCheckResourceStart();
         
      });

      rfpResourceStartYear.on('keyup', () => {
         YearCheckResourceStart();
         
      });

      var currentEventId = '';
      let rfpDurationField = $('.rfp_duration');
      
      rfpDurationField.on('keydown', (event) => {
        
         if (event.key === '.'  || event.keyCode ===69 || event.keyCode ===189 || event.keyCode ===109)
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
         if(document.getElementById('agreementID').value !== 'RM1043.8') {
            rfpResourceStartDay.removeClass('govuk-form-group--error');
            $('.durations').removeClass('govuk-form-group--error');
            $('#event-name-error-date').html('');
         if(value != undefined && value.val() != '')
         {
         if (matchValue || endmonthCheck || startmonthCheck) {

            rfpResourceStartDay.addClass('govuk-form-group--error');
            $('.durations').addClass('govuk-form-group--error');
            $('#event-name-error-date').html('Enter a valid date')
         } else {
            rfpResourceStartDay.removeClass('govuk-form-group--error');
            $('.durations').removeClass('govuk-form-group--error');
            $('#event-name-error-date').html('');
         }
         
         }
        }
      }

      const MonthCheckResourceStart = () => {
         const value = rfpResourceStartMonth;
         let matchValue = !value.val().match(/^\d\d?$/);
         let endmonthCheck = Number(value.val()) > 12;
         let startmonthCheck = Number(value.val()) <= 0;
         if(document.getElementById('agreementID').value !== 'RM1043.8') {
            rfpResourceStartMonth.removeClass('govuk-form-group--error');
            $('.durations').removeClass('govuk-form-group--error');
            $('#event-name-error-month').html('');
         if(value != undefined && value.val() != '')
         {
         if (matchValue || endmonthCheck || startmonthCheck) {
            rfpResourceStartMonth.addClass('govuk-form-group--error');
            $('.durations').addClass('govuk-form-group--error');
            $('#event-name-error-month').html('Enter a valid month');
         } else {
            rfpResourceStartMonth.removeClass('govuk-form-group--error');
            $('.durations').removeClass('govuk-form-group--error');
            $('#event-name-error-month').html('');
         }
          }
         }
      }
      const YearCheckResourceStart = () => {
        // let fieldCheck = "", errorStore = [];
         let value = rfpResourceStartYear;
         let matchValue = !value.val().match(/^\d{4}$/);
         let endyearCheck = Number(value.val()) > 2121;
         let currentYear = new Date().getFullYear();
         let startyearCheck = Number(value.val()) < currentYear;
         if(document.getElementById('agreementID').value !== 'RM1043.8') {
            rfpResourceStartYear.removeClass('govuk-form-group--error');
            $('.durations').removeClass('govuk-form-group--error');
            $('#event-name-error-year').html('');
         if(value != undefined && value.val() != '')
         {
         // if (matchValue || endyearCheck || startyearCheck) { XBN00121

         if (matchValue || endyearCheck) {
            rfpResourceStartYear.addClass('govuk-form-group--error');
            $('.durations').addClass('govuk-form-group--error');
            $('#event-name-error-year').html('Enter a valid year');
            
            // fieldCheck = ccsZvalidateWithRegex("rfp_resource_start_year", "Enter a valid year", /^\d{1,}$/);
            // if (fieldCheck !== true){ errorStore.push(fieldCheck)
            // }else{
            //   fieldCheck = ccsZvalidateWithRegex("rfp_resource_start_year", "Enter a valid year", /^\d{1,}$/);
            // }
            //  if(errorStore.length>0){
            //    ccsZPresentErrorSummary(errorStore);
            //    return false;
            //   }

         } else {
            rfpResourceStartYear.removeClass('govuk-form-group--error');
            $('.durations').removeClass('govuk-form-group--error');
            $('#event-name-error-year').html('');
            
        }
      }
      }
   }
     // const durationYear = document.getElementsByClassName('rfp_duration_year_25');
      const DateCheck = (rfpDay) => {
         let value = rfpDay;
         let matchValue = !value.val().match(/^\d\d?$/);
         let endmonthCheck = Number(value.val()) > 31;
         let startmonthCheck = Number(value.val()) < 0;
         if(document.getElementById('agreementID').value === 'RM1043.8' && document.getElementById('gID').value === 'Group 18' && document.getElementById('lID').value === '1') {
            removeErrorFieldsdates();
            }
            if(document.getElementById('agreementID').value === 'RM1557.13' && document.getElementById('gID').value === 'Group 10' && document.getElementById('lID').value === '4') {
               removeErrorFieldsdates();
               }   
         
         if(document.getElementById('agreementID').value === 'RM1043.8' && document.getElementById('gID').value === 'Group 18' && document.getElementById('lID').value === '1') {
           let fieldCheck = "",
            errorStore = [];
            if ((matchValue || endmonthCheck || startmonthCheck) && value.val() != '') {
               // $(`#${currentEventId}`).addClass('govuk-form-group--error');
               // $(`.${currentEventId}`).addClass('govuk-form-group--error');
               //     $(`.p_durations_${currentEventId}`).html('Enter a valid day');
               //    fieldCheck = ccsZvalidateWithRegex("rfp_duration_days", "Enter a valid day", /^\d{1,}$/);
               //    if (fieldCheck !== true) errorStore.push(fieldCheck);
               //    if(errorStore.length>0){
               //        ccsZPresentErrorSummary(errorStore);
               //        return false;
               //    }

              
              
            }
            else {
               $(`#${currentEventId}`).removeClass('govuk-form-group--error');
               $(`.${currentEventId}`).removeClass('govuk-form-group--error');
               $(`.p_durations_${currentEventId}`).html('');
            }
         }
         else if(document.getElementById('agreementID').value === 'RM1557.13' && document.getElementById('gID').value === 'Group 10' && document.getElementById('lID').value === '4') {
            let fieldCheck = "",
             errorStore = [];
             if ((matchValue || endmonthCheck || startmonthCheck) && value.val() != '') {
                // $(`#${currentEventId}`).addClass('govuk-form-group--error');
                // $(`.${currentEventId}`).addClass('govuk-form-group--error');
                //     $(`.p_durations_${currentEventId}`).html('Enter a valid day');
                //    fieldCheck = ccsZvalidateWithRegex("rfp_duration_days", "Enter a valid day", /^\d{1,}$/);
                //    if (fieldCheck !== true) errorStore.push(fieldCheck);
                //    if(errorStore.length>0){
                //        ccsZPresentErrorSummary(errorStore);
                //        return false;
                //    }
 
               
               
             }
             else {
                $(`#${currentEventId}`).removeClass('govuk-form-group--error');
                $(`.${currentEventId}`).removeClass('govuk-form-group--error');
                $(`.p_durations_${currentEventId}`).html('');
             }
          }
        else if ((matchValue || endmonthCheck || startmonthCheck) && value.val() != '') {
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
         if(document.getElementById('agreementID').value === 'RM1043.8' && document.getElementById('gID').value === 'Group 18' && document.getElementById('lID').value === '1') {
            removeErrorFieldsdates();
            }
            if(document.getElementById('agreementID').value === 'RM1557.13' && document.getElementById('gID').value === 'Group 10' && document.getElementById('lID').value === '4') {
               removeErrorFieldsdates();
               }
         
         if(document.getElementById('agreementID').value === 'RM1043.8' && document.getElementById('gID').value === 'Group 18' && document.getElementById('lID').value === '1') {
            endmonthCheck = Number(value.val()) > 11;
            let fieldCheck = "",
            errorStore = [];
            if ((matchValue || endmonthCheck || startmonthCheck) && value.val() != '') {
               // $(`#${currentEventId}`).addClass('govuk-form-group--error');
               // $(`.${currentEventId}`).addClass('govuk-form-group--error');
               // if((matchValue || startmonthCheck)){
               //     $(`.p_durations_${currentEventId}`).html('Enter a valid month');
               //    fieldCheck = ccsZvalidateWithRegex("rfp_duration_months", "Enter a valid month", /^\d{1,}$/);
               //    if (fieldCheck !== true) errorStore.push(fieldCheck);
               //    if(errorStore.length>0){
               //        ccsZPresentErrorSummary(errorStore);
               //        return false;
               //    }

               // }
               // if(endmonthCheck){
                  
               //    $(`.p_durations_${currentEventId}`).addClass('govuk-form-group--error');   
               //    $(`.p_durations_${currentEventId}`).html('Enter a month between 1 to 11');
               //    fieldCheck = ccsZvalidateWithRegex("rfp_duration_months", "Enter a month between 1 to 11", /^\d{1,}$/);
               //    if (fieldCheck !== true) errorStore.push(fieldCheck);
               //    if(errorStore.length>0){
               //        ccsZPresentErrorSummary(errorStore);
               //        return false;
               //    }
               // }
            }
            else {
               $(`#${currentEventId}`).removeClass('govuk-form-group--error');
               $(`.${currentEventId}`).removeClass('govuk-form-group--error');
               $(`.p_durations_${currentEventId}`).html('');
            }
         }
         else if(document.getElementById('agreementID').value === 'RM1557.13' && document.getElementById('gID').value === 'Group 10' && document.getElementById('lID').value === '4') {
            endmonthCheck = Number(value.val()) > 11;
            let fieldCheck = "",
            errorStore = [];
            if ((matchValue || endmonthCheck || startmonthCheck) && value.val() != '') {
               // $(`#${currentEventId}`).addClass('govuk-form-group--error');
               // $(`.${currentEventId}`).addClass('govuk-form-group--error');
               // if((matchValue || startmonthCheck)){
               //     $(`.p_durations_${currentEventId}`).html('Enter a valid month');
               //    fieldCheck = ccsZvalidateWithRegex("rfp_duration_months", "Enter a valid month", /^\d{1,}$/);
               //    if (fieldCheck !== true) errorStore.push(fieldCheck);
               //    if(errorStore.length>0){
               //        ccsZPresentErrorSummary(errorStore);
               //        return false;
               //    }

               // }
               // if(endmonthCheck){
                  
               //    $(`.p_durations_${currentEventId}`).addClass('govuk-form-group--error');   
               //    $(`.p_durations_${currentEventId}`).html('Enter a month between 1 to 11');
               //    fieldCheck = ccsZvalidateWithRegex("rfp_duration_months", "Enter a month between 1 to 11", /^\d{1,}$/);
               //    if (fieldCheck !== true) errorStore.push(fieldCheck);
               //    if(errorStore.length>0){
               //        ccsZPresentErrorSummary(errorStore);
               //        return false;
               //    }
               // }
            }
            else {
               $(`#${currentEventId}`).removeClass('govuk-form-group--error');
               $(`.${currentEventId}`).removeClass('govuk-form-group--error');
               $(`.p_durations_${currentEventId}`).html('');
            }
         }
         else if ((matchValue || endmonthCheck || startmonthCheck) && value.val() != '') {
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
         // let endyearCheck = Number(value.val()) > 4;
         let startyearCheck = Number(value.val()) < 0;
         if(document.getElementById('agreementID').value === 'RM1043.8' && document.getElementById('gID').value === 'Group 18' && document.getElementById('lID').value === '1') {
         removeErrorFieldsdates();
         }
         if(document.getElementById('agreementID').value === 'RM1557.13' && document.getElementById('gID').value === 'Group 10' && document.getElementById('lID').value === '4') {
            removeErrorFieldsdates();
            }
         if(document.getElementById('agreementID').value === 'RM6187'){
            
           if ((matchValue || startyearCheck) && value.val() != '') {
                $(`#${currentEventId}`).addClass('govuk-form-group--error');
               $(`.${currentEventId}`).addClass('govuk-form-group--error');
               $(`.p_durations_${currentEventId}`).html('Enter a valid year');
            }
            else {
               $(`#${currentEventId}`).removeClass('govuk-form-group--error');
               $(`.${currentEventId}`).removeClass('govuk-form-group--error');
               $(`.p_durations_${currentEventId}`).html('');
            }

         }
         else if(document.getElementById('agreementID').value === 'RM1043.8' && document.getElementById('gID').value === 'Group 18' && document.getElementById('lID').value === '1') {
            endyearCheck = Number(value.val()) > 2;
            let fieldCheck = "",
            errorStore = [];
            if ((matchValue || endyearCheck || startyearCheck) && value.val() != '') {
            }
            else {
               $(`#${currentEventId}`).removeClass('govuk-form-group--error');
               $(`.${currentEventId}`).removeClass('govuk-form-group--error');
               $(`.p_durations_${currentEventId}`).html('');
            }
         }
         else if(document.getElementById('agreementID').value === 'RM1557.13' && document.getElementById('gID').value === 'Group 10' && document.getElementById('lID').value === '4') {
            endyearCheck = Number(value.val()) > 2;
            let fieldCheck = "",
            errorStore = [];
            if ((matchValue || endyearCheck || startyearCheck) && value.val() != '') {
            }
            else {
               $(`#${currentEventId}`).removeClass('govuk-form-group--error');
               $(`.${currentEventId}`).removeClass('govuk-form-group--error');
               $(`.p_durations_${currentEventId}`).html('');
            }
         }
         else{
            if ((matchValue || startyearCheck) && value.val() != '') {
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
   
}
});

function daysInYear(year) {
   return ((year % 4 === 0 && year % 100 > 0) || year % 400 == 0) ? 366 : 365;
}

// For MCF3 message create
$('.btn-sendmsg').on('click', (e) => {
   e.preventDefault();
   document.getElementsByClassName("btn-sendmsg")[0].disabled = true;
                           
   document.forms['ccs_message_create_form'].submit();
});

//

$('.rfp_date').on('submit', (e) => {
   e.preventDefault();
   $('.durations').removeClass('govuk-form-group--error');
   $('.resource_start_date').html('');
   if(document.getElementById('agreementID').value !== 'RM1043.8' && document.getElementById('agreementID').value !== 'RM1557.13') {
      let fieldCheck = "", errorStore = [];
      ccsZPresentErrorSummary();
      removeErrorFieldsdates();
       if(checkResourceStartDate())
      {
         let isValid = isProjectStartDateValid();
         if (isValid) {
            // isValid = isProjectExtensionValid(); //XBN00121

         
         let yrValidation = false;
            const durationYear = document.getElementsByClassName('rfp_duration_year_25');
            const durationMonth = document.getElementsByClassName('rfp_duration_month_25');
            const durationDay = document.getElementsByClassName('rfp_duration_day_25');

            if(durationYear[0].value!='' || durationMonth[0].value!='' || durationDay[0].value!=''){
            const YearProjectRun = Number(durationYear[0].value);
            const MonthProjectRun = Number(durationMonth[0].value);
            const DaysProjectRun = Number(durationDay[0].value);
            
            if(MonthProjectRun<0 || MonthProjectRun>12){
               yrValidation = true;
            }
            if(DaysProjectRun<0 || DaysProjectRun>31){
               yrValidation = true;
            }
            
            if(yrValidation){
               fieldCheck = ccsZvalidateWithRegex("rfp_duration_Question12", "Enter the valid project date", /^\d{1,}$/);
               if (fieldCheck !== true) errorStore.push(fieldCheck); 
               if(errorStore.length>0){
                  ccsZPresentErrorSummary(errorStore);
                  return;
                 }
            }
         }

         if(durationYear[1].value!='' || durationMonth[1].value!='' || durationDay[1].value!=''){
            yrValidation2 = validateExtPeriod();
            if(yrValidation2){
               fieldCheck = ccsZvalidateWithRegex("rfp_duration_Question13", "Extension period must be 50% of the contract period or less", /^\d{1,}$/);
               if (fieldCheck !== true) errorStore.push(fieldCheck); 
               if(errorStore.length>0){
                  ccsZPresentErrorSummary(errorStore);
                  return;
                 }
            }
         }
            
         }

         if (isValid)
         document.forms['rfp_date'].submit();
      }
   } else {
      if(document.getElementById('agreementID') !== null) {
         if(document.getElementById('agreementID').value === 'RM1043.8' && document.getElementById('gID').value === 'Group 18' && document.getElementById('lID').value === '1') {
            isValid = isProjectExtensionValid(); //XBN00121
            if(isValid)
               document.forms['rfp_date'].submit();
            
         } else if(document.getElementById('agreementID').value === 'RM1043.8' && document.getElementById('gID').value === 'Group 17' && document.getElementById('lID').value === '1') {
            let isValid;
            removeErrorFieldsdates();

            if(checkResourceStartDate())
            {

            isValid = isProjectStartDateValid();
            } //XBN00121
            if(isValid)
               document.forms['rfp_date'].submit();
            
         } else if(document.getElementById('agreementID').value === 'RM1557.13' && document.getElementById('gID').value === 'Group 10' && document.getElementById('lID').value === '4') {
            isValid = isProjectExtensionValid(); //XBN00121
            if(isValid)
               document.forms['rfp_date'].submit();
            
         } else if(document.getElementById('agreementID').value === 'RM1557.13' && document.getElementById('gID').value === 'Group 9' && document.getElementById('lID').value === '4') {
            let isValid;
            if(checkResourceStartDate())
            {
            isValid = isProjectStartDateValid();
            } //XBN00121
            if(isValid)
               document.forms['rfp_date'].submit();
            
         } 
         else {
            isValid = isProjectStartDateValid(); //XBN00121
            if(isValid)
               document.forms['rfp_date'].submit();
         }
      }
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
   let fieldCheck = "", errorStore = [];
   
      let rfpResourceStartDay = $('.rfp_resource_start_day');
      let rfpResourceStartMonth = $('.rfp_resource_start_month');
      let rfpResourceStartYear = $('.rfp_resource_start_year');
      
      if(document.getElementById('agreementID').value === 'RM6187'){
         // removeErrorFieldsdates();
      }

      if(rfpResourceStartDay.val() == '' && rfpResourceStartMonth.val() == '' && rfpResourceStartYear.val() == '')
      {
         if(document.getElementById('agreementID').value !== 'RM1043.8' && document.getElementById('agreementID').value !== 'RM1557.13') {

         flag =false;
         rfpResourceStartDay.addClass('govuk-form-group--error');
         rfpResourceStartMonth.addClass('govuk-form-group--error');
         rfpResourceStartYear.addClass('govuk-form-group--error');
         $('.durations').addClass('govuk-form-group--error');
         // $('#event-name-error-date').html('Project start date should not be empty'); 
         let error_msg_new = 'Enter a project start date'
         //fieldCheck = ccsZvalidateWithRegex("rfp_resource_start_day11", "Project start date should not be empty", /^\d{1,}$/);
         fieldCheck = ccsZvalidateDateWithRegex("rfp_resource_start_date_day_Question11","rfp_resource_start_date", error_msg_new, /^\d{1,}$/);
         if (fieldCheck !== true){ 
            errorStore.push(fieldCheck)
         }else{
           fieldCheck = ccsZvalidateWithRegex("rfp_resource_start_day", error_msg_new, /^\d{1,}$/);
         }
      }
      }
       else if(rfpResourceStartDay.val() =='')
      {
        
         let error_msg = 'Enter a valid date'
         if(document.getElementById('agreementID').value === 'RM1043.8') {
            removeErrorFieldsdates();
            if(rfpResourceStartDay.val() == '' && rfpResourceStartMonth.val() == '' &&  rfpResourceStartYear.val() != ''){
              
               if(rfpResourceStartYear.val().length < 4){
                  error_msg = 'Enter a day and month with valid Year(YYYY Format)'
               }else{
                  error_msg = 'Enter a day and month'
               }
              
               rfpResourceStartMonth.addClass('govuk-form-group--error');

            }
            else if(rfpResourceStartDay.val() == '' && rfpResourceStartYear.val() == '' &&  rfpResourceStartMonth.val() != ''){
               error_msg = 'Enter a day and year'
               rfpResourceStartYear.addClass('govuk-form-group--error');

            }
            else if(rfpResourceStartDay.val() =='') {

               error_msg = 'Enter a Day'
              
               var urlParamsDefault = new URLSearchParams(window.location.search);
               if(document.getElementById('lID') !== null){
                  lotId = document.getElementById('lID').value;
                  if(lotId == '1' && urlParamsDefault.get('group_id') == 'Group 17'){
                     error_msg = 'Enter a Day with valid Year(YYYY Format)'
                  }   
               }

            rfpResourceStartMonth.removeClass('govuk-form-group--error');
            rfpResourceStartYear.removeClass('govuk-form-group--error');

            }

         }
          
         flag = false;
         rfpResourceStartDay.addClass('govuk-form-group--error');
         rfpResourceStartMonth.addClass('govuk-form-group--error');
         rfpResourceStartYear.addClass('govuk-form-group--error');
         $('.durations').addClass('govuk-form-group--error');
         $('#event-name-error-date').html('Enter a valid date');
         fieldCheck = ccsZvalidateDateWithRegex("rfp_resource_start_date_day_Question11","rfp_resource_start_date", error_msg, /^\d{1,}$/);
         if (fieldCheck !== true){ 
            errorStore.push(fieldCheck)
         }
         
         // else{
         //   fieldCheck = ccsZvalidateWithRegex("rfp_resource_start_date_day_Question11", "Enter a valid date", /^\d{1,}$/);
         // }
        
      }
      else if(rfpResourceStartDay.val() < 1)
      {
         flag = false;
         rfpResourceStartDay.addClass('govuk-form-group--error');
         rfpResourceStartMonth.addClass('govuk-form-group--error');
         rfpResourceStartYear.addClass('govuk-form-group--error');
         $('.durations').addClass('govuk-form-group--error');
         $('#event-name-error-date').html('Enter a valid date');
         fieldCheck = ccsZvalidateWithRegex("rfp_resource_start_date", "Enter a valid date", /^\d{1,}$/);
         if (fieldCheck !== true){ 
            errorStore.push(fieldCheck)
         }else{
           fieldCheck = ccsZvalidateWithRegex("rfp_resource_start_date", "Enter a valid date", /^\d{1,}$/);
         }
        
      }

      else if(rfpResourceStartMonth.val() =='')
      {
          error_msg = 'Enter a valid month'
         if(document.getElementById('agreementID').value === 'RM1043.8') {
            removeErrorFieldsdates();
            if(rfpResourceStartDay.val() != '' && rfpResourceStartMonth.val() == '' &&  rfpResourceStartYear.val() == ''){
               error_msg = 'Enter a month and year'
               rfpResourceStartYear.addClass('govuk-form-group--error');


            }
            else if(rfpResourceStartMonth.val() =='') {
               error_msg = 'Enter a Month'
               var urlParamsDefault = new URLSearchParams(window.location.search);
               if(document.getElementById('lID') !== null){
                  lotId = document.getElementById('lID').value;
                  if(lotId == '1' && urlParamsDefault.get('group_id') == 'Group 17'){
                     error_msg = 'Enter a Month with valid Year(YYYY Format)'
                  }   
               }
               rfpResourceStartYear.removeClass('govuk-form-group--error');
            }
         }

         flag =false;
         rfpResourceStartYear.addClass('govuk-form-group--error');
         rfpResourceStartMonth.addClass('govuk-form-group--error');
         rfpResourceStartDay.addClass('govuk-form-group--error');
            $('.durations').addClass('govuk-form-group--error');
            $('#event-name-error-date').html('Enter a valid month');
         fieldCheck = ccsZvalidateDateWithRegex("rfp_resource_start_date_month_Question 11","rfp_resource_start_date",error_msg, /^\d{1,}$/);
         if (fieldCheck !== true){ 
            errorStore.push(fieldCheck)
         }
         // else{
         //      fieldCheck = ccsZvalidateWithRegex("rfp_resource_start_date_month_Question 11", "Enter a valid month", /^\d{1,}$/);
         // }
      
      }
      else if(rfpResourceStartMonth.val() < 1)
      {
         flag =false;
         rfpResourceStartMonth.addClass('govuk-form-group--error');
         rfpResourceStartDay.addClass('govuk-form-group--error');
         rfpResourceStartYear.addClass('govuk-form-group--error');
            $('.durations').addClass('govuk-form-group--error');
            $('#event-name-error-date').html('Enter a valid month');
         fieldCheck = ccsZvalidateWithRegex("rfp_resource_start_month", error_msg, /^\d{1,}$/);
         if (fieldCheck !== true){ 
            errorStore.push(fieldCheck)
         }else{
              fieldCheck = ccsZvalidateWithRegex("rfp_resource_start_month", error_msg, /^\d{1,}$/);
         }        
      }
      else if(rfpResourceStartYear.val() =='')
      {
         error_msg = 'Enter a valid year'
         removeErrorFieldsdates();
         if(document.getElementById('agreementID').value === 'RM1043.8') {
            error_msg = 'Enter a Year'
            var urlParamsDefault = new URLSearchParams(window.location.search);
            if(document.getElementById('lID') !== null){
               lotId = document.getElementById('lID').value;
               if(lotId == '1' && urlParamsDefault.get('group_id') == 'Group 17'){
                  error_msg = 'Enter a valid Year(YYYY Format)'
               }   
            }
         }
         flag =false;
         rfpResourceStartYear.addClass('govuk-form-group--error');
         rfpResourceStartDay.addClass('govuk-form-group--error');
         rfpResourceStartMonth.addClass('govuk-form-group--error');
         $('.durations').addClass('govuk-form-group--error');
         $('#event-name-error-date').html('Enter a valid year');  
         fieldCheck = ccsZvalidateDateWithRegex("rfp_resource_start_date_year_Question 11","rfp_resource_start_date", error_msg, /^\d{1,}$/);
         if (fieldCheck !== true){ 
            errorStore.push(fieldCheck)
         }
         // else{
         //      fieldCheck = ccsZvalidateWithRegex("rfp_resource_start_date_year_Question 11", "Enter a valid year", /^\d{1,}$/);
         // }  
      }
      else if( rfpResourceStartYear.val() != '' && rfpResourceStartYear.val().length < 4){
         // if(document.getElementById('agreementID').value === 'RM1043.8') {
            removeErrorFieldsdates();
         // }
         flag =false;
         rfpResourceStartYear.addClass('govuk-form-group--error');
         rfpResourceStartDay.addClass('govuk-form-group--error');
         rfpResourceStartMonth.addClass('govuk-form-group--error');
         $('.durations').addClass('govuk-form-group--error');
         $('#event-name-error-date').html('Enter a valid year');  
         fieldCheck = ccsZvalidateDateWithRegex("rfp_resource_start_date_year_Question 11","rfp_resource_start_date", "Enter a valid Year(YYYY Format)", /^\d{4,}$/);

         if (fieldCheck !== true){
             errorStore.push(fieldCheck)
         }
      }
      else if(rfpResourceStartYear.val() <= 1)
      {
         flag =false;
         rfpResourceStartYear.addClass('govuk-form-group--error');
         rfpResourceStartDay.addClass('govuk-form-group--error');
         rfpResourceStartMonth.addClass('govuk-form-group--error');
         $('.durations').addClass('govuk-form-group--error');
         $('#event-name-error-date').html('Enter a valid year');  
         fieldCheck = ccsZvalidateWithRegex("rfp_resource_start_year", error_msg, /^\d{1,}$/);
         if (fieldCheck !== true){ 
            errorStore.push(fieldCheck)
         }else{
              fieldCheck = ccsZvalidateWithRegex("rfp_resource_start_year", error_msg, /^\d{1,}$/);
         }  
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
            if (fieldCheck !== true){ 
               fieldCheck = ccsZvalidateWithRegex("rfp_resource_start_date_day_Question11", "Enter a valid date", /^\d{1,}$/,false);
               errorStore.push(fieldCheck)
            }else{
                 fieldCheck = ccsZvalidateWithRegex("rfp_resource_start_date_day_Question11", "Enter a valid date", /^\d{1,}$/);
                 errorStore.push(fieldCheck)
            }
         }
         else 
         {
            flag =true;
            $('.durations').removeClass('govuk-form-group--error');
            $('#event-name-error-date').html(''); 
         }
      }

      if(errorStore.length>0){
         ccsZPresentErrorSummary(errorStore);
         return false;
        }

      return flag;
}

function isProjectExtensionValid() {
   let isValid = false;

   $('.p_durations').removeClass('govuk-form-group--error');
   removeErrorFieldsdates();
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
   let fieldCheck = "",
       errorStore = [];
       
       if (document.getElementById("rfp_duration-years_Question12") !=undefined && document.getElementById("rfp_duration-years_Question12") !=null && document.getElementById("rfp_duration-years_Question12").value.trim().length === 0) {
      if((document.getElementById('agreementID').value === 'RM1043.8' && document.getElementById('gID').value === 'Group 18' && document.getElementById('lID').value === '1')){
      if(document.getElementById("rfp_duration_months_Question12") !=undefined && document.getElementById("rfp_duration_months_Question12") !=null && document.getElementById("rfp_duration_months_Question12").value.trim().length === 0) {
         if (document.getElementById("rfp_duration_days_Question12") !=undefined &&document.getElementById("rfp_duration_days_Question12") !=null && document.getElementById("rfp_duration_days_Question12").value.trim().length === 0) {
         fieldCheck = ccsZvalidateWithRegex("rfp_duration_Question12", "Enter the expected contract length", /^\d{1,}$/);
         if (fieldCheck !== true) errorStore.push(fieldCheck);  
         }
      }
   }
   else{

      fieldCheck = ccsZvalidateWithRegex("rfp_duration_Question12", "Enter the expected contract length", /^\d{1,}$/);
      if (fieldCheck !== true) errorStore.push(fieldCheck);
   }
  }else{

   if(!(document.getElementById('agreementID').value === 'RM1043.8' && document.getElementById('gID').value === 'Group 18' && document.getElementById('lID').value === '1')){

      fieldCheck = ccsZvalidateWithRegex("rfp_duration-years_Question12", "Enter a year", /^\d{1,}$/);
            if (fieldCheck !== true) errorStore.push(fieldCheck);
   }

   if(!(document.getElementById('agreementID').value === 'RM1557.13' && document.getElementById('gID').value === 'Group 10' && document.getElementById('lID').value === '4')){

      fieldCheck = ccsZvalidateWithRegex("rfp_duration-years_Question12", "Enter a year", /^\d{1,}$/);
            if (fieldCheck !== true) errorStore.push(fieldCheck);
   }

  }
  if(document.getElementById("rfp_duration_months_Question12") !=undefined && document.getElementById("rfp_duration_months_Question12") !=null && document.getElementById("rfp_duration_months_Question12").value.trim().length === 0) {
     let year = document.getElementById("rfp_duration-years_Question12").value.trim(); 
     let month = document.getElementById("rfp_duration_months_Question12").value.trim();

     if((document.getElementById('agreementID').value === 'RM1043.8' && document.getElementById('gID').value === 'Group 18' && document.getElementById('lID').value === '1')){
      if(Number(year) < 2 && Number(month) > 0){
        fieldCheck = ccsZvalidateWithRegex("rfp_duration_months_Question12", "Enter a month", /^\d{1,}$/);
        if (fieldCheck !== true) errorStore.push(fieldCheck);

      }
     }
     else if((document.getElementById('agreementID').value === 'RM1557.13' && document.getElementById('gID').value === 'Group 10' && document.getElementById('lID').value === '4')){
      if(Number(year) < 2 && Number(month) > 0){
        fieldCheck = ccsZvalidateWithRegex("rfp_duration_months_Question12", "Enter a month", /^\d{1,}$/);
        if (fieldCheck !== true) errorStore.push(fieldCheck);

      }
     }
     else{
      if(!(document.getElementById('agreementID').value === 'RM1043.8' && document.getElementById('gID').value === 'Group 18' && document.getElementById('lID').value === '1')){
      fieldCheck = ccsZvalidateWithRegex("rfp_duration_months_Question12", "Enter a month", /^\d{1,}$/);
      if (fieldCheck !== true) errorStore.push(fieldCheck);
      }
      if(!(document.getElementById('agreementID').value === 'RM1557.13' && document.getElementById('gID').value === 'Group 10' && document.getElementById('lID').value === '4')){
         fieldCheck = ccsZvalidateWithRegex("rfp_duration_months_Question12", "Enter a month", /^\d{1,}$/);
         if (fieldCheck !== true) errorStore.push(fieldCheck);
         }

     }
  }else{
   if(!(document.getElementById('agreementID').value === 'RM1043.8' && document.getElementById('gID').value === 'Group 18' && document.getElementById('lID').value === '1')){

   fieldCheck = ccsZvalidateWithRegex("rfp_duration_months_Question12", "Enter a month", /^\d{1,}$/);
   }
   if(!(document.getElementById('agreementID').value === 'RM1557.13' && document.getElementById('gID').value === 'Group 10' && document.getElementById('lID').value === '4')){

      fieldCheck = ccsZvalidateWithRegex("rfp_duration_months_Question12", "Enter a month", /^\d{1,}$/);
      }
   
  }
  if (document.getElementById("rfp_duration_days_Question12") !=undefined &&document.getElementById("rfp_duration_days_Question12") !=null && document.getElementById("rfp_duration_days_Question12").value.trim().length === 0) {
   let year = document.getElementById("rfp_duration-years_Question12").value.trim(); 
   let day = document.getElementById("rfp_duration_days_Question12").value.trim(); 


   if((document.getElementById('agreementID').value === 'RM1043.8' && document.getElementById('gID').value === 'Group 18' && document.getElementById('lID').value === '1')){
    if(Number(year) < 2 && Number(day)>0){
      fieldCheck = ccsZvalidateWithRegex("rfp_duration_days_Question12", "Enter a day", /^\d{1,}$/);
      if (fieldCheck !== true) errorStore.push(fieldCheck);

    }
   }
   else if((document.getElementById('agreementID').value === 'RM1557.13' && document.getElementById('gID').value === 'Group 10' && document.getElementById('lID').value === '4')){
      if(Number(year) < 2 && Number(day)>0){
        fieldCheck = ccsZvalidateWithRegex("rfp_duration_days_Question12", "Enter a day", /^\d{1,}$/);
        if (fieldCheck !== true) errorStore.push(fieldCheck);
  
      }
     }
   else{
      if(!(document.getElementById('agreementID').value === 'RM1043.8' && document.getElementById('gID').value === 'Group 18' && document.getElementById('lID').value === '1')){
      fieldCheck = ccsZvalidateWithRegex("rfp_duration_days_Question12", "Enter a day", /^\d{1,}$/);
      if (fieldCheck !== true) errorStore.push(fieldCheck);
      }
      if(!(document.getElementById('agreementID').value === 'RM1557.13' && document.getElementById('gID').value === 'Group 10' && document.getElementById('lID').value === '4')){
         fieldCheck = ccsZvalidateWithRegex("rfp_duration_days_Question12", "Enter a day", /^\d{1,}$/);
         if (fieldCheck !== true) errorStore.push(fieldCheck);
         }

   }
  }else{
   if(!(document.getElementById('agreementID').value === 'RM1043.8' && document.getElementById('gID').value === 'Group 18' && document.getElementById('lID').value === '1')){

   fieldCheck = ccsZvalidateWithRegex("rfp_duration_days_Question12", "Enter a day", /^\d{1,}$/);
   }
   if(!(document.getElementById('agreementID').value === 'RM1557.13' && document.getElementById('gID').value === 'Group 10' && document.getElementById('lID').value === '4')){

      fieldCheck = ccsZvalidateWithRegex("rfp_duration_days_Question12", "Enter a day", /^\d{1,}$/);
      }
  }
   
  let durationYears='2';
  let durationMessage='Expected contract length must be 2 years or less';
  if((document.getElementById('agreementID').value === 'RM1557.13' && document.getElementById('gID').value === 'Group 10' && document.getElementById('lID').value === '4')){
   durationYears='3';
   durationMessage='Expected contract length must be 3 years or less';
  }
   
   if (YearProjectRun != null && YearProjectRun != "") {
      if(Number(YearProjectRun) < 0 )
      {
         isValid = false;
         $(`.${pDurationName}`).addClass('govuk-form-group--error');   
         $(`.${durationDayError[0].classList[2]}`).html('Enter a Valid Year');
         fieldCheck = ccsZvalidateWithRegex("rfp_duration-years", "Enter a Valid Year",/^\d{1,}$/);
         if (fieldCheck !== true) errorStore.push(fieldCheck); 
       }
      else if(Number(YearProjectRun) > durationYears )
      {
         isValid = false;
         $(`.${pDurationName}`).addClass('govuk-form-group--error');   
        // $(`.${durationDayError[0].classList[2]}`).html('Project extension duration should not be more than 2 years');
         fieldCheck = ccsZvalidateWithRegex("rfp_duration_Question12", durationMessage,/^\d{1,}$/);
         if (fieldCheck !== true) errorStore.push(fieldCheck); 
        

      }
      else if (Number(YearProjectRun) >= durationYears && (Number(MonthProjectRun)> 0 || Number(DaysProjectRun) > 0 ))
      {
         isValid = false;
         $(`.${pDurationName}`).addClass('govuk-form-group--error');
        // $(`.${durationDayError[0].classList[2]}`).html('Project extension duration should not be more than 2 years');
         fieldCheck = ccsZvalidateWithRegex("rfp_duration_Question12", durationMessage,/^\d{1,}$/);
         if (fieldCheck !== true) errorStore.push(fieldCheck); 
        // return false;
      }
      
      projectRunInDays = (365 * Number(YearProjectRun))
   }
   if (MonthProjectRun != null && MonthProjectRun != "") {
      if(Number(MonthProjectRun) < 0)
      {
         isValid = false;
         $(`.${pDurationName}`).addClass('govuk-form-group--error');   
         $(`.${durationDayError[0].classList[2]}`).html('Enter a valid month');
         fieldCheck = ccsZvalidateWithRegex("rfp_duration-years", "Enter a valid month",/^\d{1,}$/);
         if (fieldCheck !== true) errorStore.push(fieldCheck);    
      }
      else if(Number(MonthProjectRun) > 11 )
      {
         isValid = false;
         $(`.${pDurationName}`).addClass('govuk-form-group--error');   
         $(`.${durationDayError[0].classList[2]}`).html('Project extension duration month value should not be more than 11');
         fieldCheck = ccsZvalidateWithRegex("rfp_duration-years", "Project extension duration month value should not be more than 11",/^\d{1,}$/);
         if (fieldCheck !== true) errorStore.push(fieldCheck);    
      }
      projectRunInDays = projectRunInDays + (30 * Number(MonthProjectRun))
   }

   if (DaysProjectRun != null && DaysProjectRun != "") {
      if(Number(DaysProjectRun) < 0)
      {
         isValid = false;
         $(`.${pDurationName}`).addClass('govuk-form-group--error');   
         $(`.${durationDayError[0].classList[2]}`).html('Enter a valid day');
         fieldCheck = ccsZvalidateWithRegex("rfp_duration-years", "Enter a valid day",/^\d{1,}$/);
         if (fieldCheck !== true) errorStore.push(fieldCheck);    
      }
      else if(Number(DaysProjectRun) > 31)
      {
         isValid = false;
         $(`.${pDurationName}`).addClass('govuk-form-group--error');   
         $(`.${durationDayError[0].classList[2]}`).html('Enter a valid day');
         fieldCheck = ccsZvalidateWithRegex("rfp_duration-years", "Enter a valid day",/^\d{1,}$/);
         if (fieldCheck !== true) errorStore.push(fieldCheck);    
      }
      projectRunInDays = projectRunInDays + Number(DaysProjectRun)
   }
   if ((YearProjectRun != null && YearProjectRun != "" && Number(YearProjectRun) == 0) || (MonthProjectRun != null && MonthProjectRun != "" && Number(MonthProjectRun) == 0) || (DaysProjectRun != null && DaysProjectRun != "" && Number(DaysProjectRun)) ) {
      if(Number(projectRunInDays) == 0 )
      {
         isValid = false;
         $(`.${pDurationName}`).addClass('govuk-form-group--error');   
         fieldCheck = ccsZvalidateWithRegex("rfp_duration_Question12", "Enter a valid Expected contract length period",/^\d{1,}$/);
         if (fieldCheck !== true) errorStore.push(fieldCheck); 
       }
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

         if((document.getElementById('agreementID').value === 'RM1557.13' && document.getElementById('gID').value === 'Group 10' && document.getElementById('lID').value === '4')){

            if(tempExtensionRunInDays > 365 ){
               isValid = false;       
               $(`.${pExtDurationName}`).addClass('govuk-form-group--error');   
               //$(`.${durationDayError[1].classList[2]}`).html('This should not exceed 50% of the length of the original project');
               fieldCheck = ccsZvalidateWithRegex("rfp_duration_Question13", "Extension period must be 12 months or less",/^\d{1,}$/);
              if (fieldCheck !== true) errorStore.push(fieldCheck);

            }else{

               let dayDiffPercentage = ((tempExtensionRunInDays / tempProjectRunInDays) * 100);
            if (dayDiffPercentage > 50) {
               isValid = false;       
               $(`.${pExtDurationName}`).addClass('govuk-form-group--error');   
               //$(`.${durationDayError[1].classList[2]}`).html('This should not exceed 50% of the length of the original project');
               fieldCheck = ccsZvalidateWithRegex("rfp_duration_Question13", "Extension period must be 50% of the contract period or less",/^\d{1,}$/);
            if (fieldCheck !== true) errorStore.push(fieldCheck);
            }
            else {
               isValid = true;
               if(durationDayError && durationDayError[1]) $(`.${durationDayError[1].classList[2]}`).html('');
              
            }
               
            }
            
           }else{

            let dayDiffPercentage = ((tempExtensionRunInDays / tempProjectRunInDays) * 100);
            if (dayDiffPercentage > 50) {
               isValid = false;       
               $(`.${pExtDurationName}`).addClass('govuk-form-group--error');   
               //$(`.${durationDayError[1].classList[2]}`).html('This should not exceed 50% of the length of the original project');
               fieldCheck = ccsZvalidateWithRegex("rfp_duration_Question13", "Extension period must be 50% of the contract period or less",/^\d{1,}$/);
            if (fieldCheck !== true) errorStore.push(fieldCheck);
            }
            else {
               isValid = true;
               if(durationDayError && durationDayError[1]) $(`.${durationDayError[1].classList[2]}`).html('');
              
            }

        }

      }
      else {
         isValid = false;
         $(`.${pExtDurationName}`).addClass('govuk-form-group--error');  
        // $(`.${durationDayError[1].classList[2]}`).html('Contract extension should be less than project run date');
         fieldCheck = ccsZvalidateWithRegex("rfp_duration_Question13", "Extension period must be 50% of the contract period or less",/^\d{1,}$/);
         if (fieldCheck !== true) errorStore.push(fieldCheck);
      }
   }
   else {
      isValid = true;
   }

   if(errorStore.length>0){
      ccsZPresentErrorSummary(errorStore);
      return false;
     }
   return isValid;
}

function isProjectStartDateValid()
{
   let fieldCheck = "", errorStore = [];
   //removeErrorFieldsdates();
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
         const expiryMonthTot = rfpagreementData != undefined && rfpagreementData != null ? Number(rfpagreementData[1]) : null;
         const expiryMonth=expiryMonthTot-1;
         const expiryDate = rfpagreementData != undefined && rfpagreementData != null ? Number(rfpagreementData[2]) : null;

         const ExpiryDates = expiryYears != null && expiryMonth != null && expiryDate != null ? new Date(expiryYears, expiryMonth, expiryDate) : null;
         const getMSOfExpiryDate = ExpiryDates != null ? ExpiryDates.getTime() : null;
         const FormDate = new Date(Year.val(), (Month.val()-1), Day.val());
         
        

         const getTimeOfFormDate = FormDate.getTime();
         const todayDate = new Date();
         if (getTimeOfFormDate > getMSOfExpiryDate) {
          // $('#event-name-error-date').html('Start date cannot be after agreement expiry date');
            Day.addClass('govuk-form-group--error');
            Month.addClass('govuk-form-group--error');
            Year.addClass('govuk-form-group--error');
            $('.durations').addClass('govuk-form-group--error');
            fieldCheck = ccsZvalidateWithRegex("rfp_resource_start_date", "Start date cannot be after agreement expiry date", /^\d{1,}$/);
         if (fieldCheck !== true){ errorStore.push(fieldCheck)
         }else{
           fieldCheck = ccsZvalidateWithRegex("rfp_resource_start_date", "Start date cannot be after agreement expiry date", /^\d{1,}$/);
         }
         if(errorStore.length>0){
            ccsZPresentErrorSummary(errorStore);
            return false;
           }
                        return false;
         }else{
            $('#rfp_resource_start_date-hint-error').removeClass('govuk-error-message');
            $('.rfp_resource_start_day').removeClass('govuk-input--error');
            $('.rfp_resource_start_month').removeClass('govuk-input--error');
            $('.rfp_resource_start_year').removeClass('govuk-input--error');
            ccsZPresentErrorSummary();
         }
         if ((FormDate.setHours(0,0,0,0) != todayDate.setHours(0,0,0,0)) && getTimeOfFormDate < todayDate.getTime()) { 

           // $('#event-name-error-date').html('Start date must be a valid future date');
           removeErrorFieldsdates();
           var message = 'Start date must be a valid future date'
            if(document.getElementById('agreementID').value === 'RM1043.8'){
               message = ' Enter a date in the future'
            }
            Day.addClass('govuk-form-group--error');
            Month.addClass('govuk-form-group--error');
            Year.addClass('govuk-form-group--error');
            $('.durations').addClass('govuk-form-group--error');
            fieldCheck = ccsZvalidateWithRegex("rfp_resource_start_date", message, /^\d{1,}$/);
            if (fieldCheck !== true){ errorStore.push(fieldCheck)
            }else{
              fieldCheck = ccsZvalidateWithRegex("rfp_resource_start_date", message, /^\d{1,}$/);
            }
            if(errorStore.length>0){
               ccsZPresentErrorSummary(errorStore);
               return false;
              }
   
            return false;
         }else{
            $('#rfp_resource_start_date-hint-error').removeClass('govuk-error-message');
            $('.rfp_resource_start_day').removeClass('govuk-input--error');
            $('.rfp_resource_start_month').removeClass('govuk-input--error');
            $('.rfp_resource_start_year').removeClass('govuk-input--error');

            $('#rfp_resource_start_date-error').removeClass('govuk-error-message');
            $('#rfp_resource_start_date-error').html('');
            ccsZPresentErrorSummary();
         }
                 
      }

      const startDate = new Date(Number(Year.val()), Number(Month.val() - 1), Number(Day.val()));
      
      if (!isValidDate(Number(Year.val()), Number(Month.val()), Number(Day.val()))) {
         $('.durations').addClass('govuk-form-group--error');
         $('.resource_start_date').html('Enter a project start date');
         return false;
      } 
      else if (startDate>new Date(2025,07,23)) {
         $('.durations').addClass('govuk-form-group--error');
         $('.resource_start_date').html('Project cannot start after: 23 August 2025');
          return false;
      }
      else {
         $('.durations').removeClass('govuk-form-group--error');
         $('.resource_start_date').html('');
         return true;
      }
   }
   else  {
      if(document.getElementById('agreementID') !== null) {
         if(document.getElementById('agreementID').value === 'RM1043.8') {
            let errorStore = [];
            Day.addClass('govuk-form-group--error');
            Month.addClass('govuk-form-group--error');
            Year.addClass('govuk-form-group--error');
            $('.durations').addClass('govuk-form-group--error');
            $('#event-name-error-date').html('Enter a project start date'); 
            fieldCheck = ccsZvalidateWithRegex("rfp_resource_start_date-hint", "Enter a project start date", /^\d{1,}$/);
            if (fieldCheck !== true){ errorStore.push(fieldCheck)
            }
            if(errorStore.length>0){
               ccsZPresentErrorSummary(errorStore);
            }
         }
         if(document.getElementById('agreementID').value === 'RM1557.13') {
            let errorStore = [];
            Day.addClass('govuk-form-group--error');
            Month.addClass('govuk-form-group--error');
            Year.addClass('govuk-form-group--error');
            $('.durations').addClass('govuk-form-group--error');
            // $('#event-name-error-date').html('Project start date should not be empty'); 
            fieldCheck = ccsZvalidateWithRegex("rfp_resource_start_date-hint", "Project start date should not be empty", /^\d{1,}$/);
            if (fieldCheck !== true){ errorStore.push(fieldCheck)
            }
            if(errorStore.length>0){
               ccsZPresentErrorSummary(errorStore);
            }
         }
      }
      return false;
   }
}

function isValidDate(year, month, day) {
  
   month = month - 1;
   var d = new Date(year, month, day);
   if (d.getFullYear() == year && d.getMonth() == month && d.getDate() == day) {
      return true;
   }
   return false;
}

$(".textlimit").keyup(function(e) {
   var maxLen = $(this).val().length;
   let value = $(this).val();
   var keyCode = e.which;
   
   if (maxLen >= 1) {
       return false; 
   }

});


$(".textlimit").keypress(function(e) {
   var maxLen = $(this).val().length;
   let value = $(this).val();
  
   var keyCode = e.which;
   if (maxLen >= 1) {
      return false;
   }

});

$(".daylimit").keyup(function(e) {
   var maxLen = $(this).val().length;
   let value = $(this).val();
   var keyCode = e.which;
   
   if (maxLen >= 2 && (Number(value)>0 || Number(value) < 31)) {
       return false; 
   }

});


$(".daylimit").keypress(function(e) {
   var maxLen = $(this).val().length;
   let value = $(this).val();
  
   var keyCode = e.which;
   if (maxLen >= 2 && (Number(value)>0 || Number(value) <31)) {
      return false;
   }

});


$(".daymonthlimit").keyup(function(e) {
   var maxLen = $(this).val().length;
   let value = $(this).val();
   var keyCode = e.which;
   
   if (maxLen >= 2) {
       return false; 
   }

});


$(".daymonthlimit").keypress(function(e) {
   var maxLen = $(this).val().length;
   let value = $(this).val();
  
   var keyCode = e.which;
   if (maxLen >= 2) {
      return false;
   }

});

$(".startdateyearlimit").keyup(function(e) {
   var maxLen = $(this).val().length;
   let value = $(this).val();
   var keyCode = e.which;
   
   if (maxLen >= 4) {
       return false; 
   }

});


$(".startdateyearlimit").keypress(function(e) {
   var maxLen = $(this).val().length;
   let value = $(this).val();
   var keyCode = e.which;
   if (maxLen >= 4) {
      return false;
   }

});

$(".yearlimit").keyup(function(e) {
   var maxLen = $(this).val().length;
   let value = $(this).val();
   var keyCode = e.which;
   
   if (maxLen >= 1) {
       return false; 
   }

});


$(".yearlimit").keypress(function(e) {
   var maxLen = $(this).val().length;
   let value = $(this).val();
   var keyCode = e.which;
   if (maxLen >= 1) {
      return false;
   }

});

const removeErrorFieldsdates = () => {
   $('.govuk-error-message').remove();
   $('.govuk-form-group--error').removeClass('govuk-form-group--error');
   $('.govuk-error-summary').remove();
   $('.govuk-input').removeClass('govuk-input--error');
   $('.govuk-form-group textarea').removeClass('govuk-textarea--error');
 };
 

function validateExtPeriod() {
   let isValid = 0;
   const durationYear = document.getElementsByClassName('rfp_duration_year_25');
   const durationMonth = document.getElementsByClassName('rfp_duration_month_25');
   const durationDay = document.getElementsByClassName('rfp_duration_day_25');

   const YearProjectRun = Number(durationYear[0].value);
   const MonthProjectRun = Number(durationMonth[0].value);
   const DaysProjectRun = Number(durationDay[0].value);

   const YearProjectRun2 = Number(durationYear[1].value);
   const MonthProjectRun2 = Number(durationMonth[1].value);
   const DaysProjectRun2 = Number(durationDay[1].value);

let projectRunInDays = 0;
   if (YearProjectRun > 0) {
      projectRunInDays = (365 * YearProjectRun)
   }
   if (MonthProjectRun > 0) {
      projectRunInDays = projectRunInDays + (30 * MonthProjectRun)
   }

   if (DaysProjectRun > 0) {
      projectRunInDays = projectRunInDays + DaysProjectRun;
   }

let extensionRunInDays = 0;
   if (YearProjectRun2 > 0) {
      extensionRunInDays = (365 * YearProjectRun2)
   }
   if (MonthProjectRun2 > 0) {
      extensionRunInDays = extensionRunInDays + (30 * MonthProjectRun2)
   }

   if (DaysProjectRun2 > 0) {
      extensionRunInDays = extensionRunInDays + DaysProjectRun2;
   }


   if (projectRunInDays > extensionRunInDays) {
            let dayDiffPercentage = ((extensionRunInDays / projectRunInDays) * 100);
            if (dayDiffPercentage > 50) {
               isValid = 1; 
            }
   }else{
      isValid = 2;
   }
   return isValid;
}

function validateStartDate() {
   let isValid = '';
   const Day = $('.rfp_resource_start_day');
   const Month = $('.rfp_resource_start_month');
   const Year = $('.rfp_resource_start_year');

if (Day.val() !== null && Day.val() !== "" && Month.val() !== null && Month.val() !== "" && Year.val() !== null && Year.val() !== "") {
   
   let rfpagreementData;
   if ($('#rpf_section_3_aggrimentEndDate').attr('agreementEndDate')) {
            rfpagreementData = $('#rpf_section_3_aggrimentEndDate').attr('agreementEndDate').split("-");
         }
   if (rfpagreementData !== null && rfpagreementData !== undefined && rfpagreementData.length > 0) {
                  const expiryYears = rfpagreementData != undefined && rfpagreementData != null ? Number(rfpagreementData[0]) : null;
                  const expiryMonthTot = rfpagreementData != undefined && rfpagreementData != null ? Number(rfpagreementData[1]) : null;
                  const expiryMonth=expiryMonthTot-1;
                  const expiryDate = rfpagreementData != undefined && rfpagreementData != null ? Number(rfpagreementData[2]) : null;

                  const ExpiryDates = expiryYears != null && expiryMonth != null && expiryDate != null ? new Date(expiryYears, expiryMonth, expiryDate) : null;
                  const getMSOfExpiryDate = ExpiryDates != null ? ExpiryDates.getTime() : null;
                  const FormDate = new Date(Year.val(), (Month.val()-1), Day.val());

                  const getTimeOfFormDate = FormDate.getTime();
                  const todayDate = new Date();
                  if (getTimeOfFormDate > getMSOfExpiryDate) {
                     isValid = 'Start date cannot be after agreement expiry date';
                  }
                  
                  if ((FormDate.setHours(0,0,0,0) != todayDate.setHours(0,0,0,0)) && getTimeOfFormDate < todayDate.getTime()) {
                     isValid = 'Start date must be a valid future date';
                  }
      }

   }
   return isValid;
}



