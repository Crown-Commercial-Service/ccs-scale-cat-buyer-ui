if (document.getElementById('rfp_date') !== null) {
const rfpProjectYears = $('#rfp_duration-years');
const rfpProjectMonths = $('#rfp_duration-months');
const rfpProjectDays = $('#rfp_duration-days');

const rfpDaySelector = $('#rfp_resource_start_date-day');
const rfpMonthSelector = $('#rfp_resource_start_date-month');
const rfpYearSelector = $('#rfp_resource_start_date-year');

const rfpagreementData = $('.agreement_no').attr('id').split("-");

const expiryYears = Number(rfpagreementData[0]);
const expiryMonth = Number(rfpagreementData[1]);
const expiryDate = Number(rfpagreementData[2])

const ExpiryDates = new Date(expiryYears, expiryMonth, expiryDate);
const getMSOfExpiryDate = ExpiryDates.getTime()



rfpDaySelector.on('blur', ()=> {
  DateCheck();
  MonthCheck();

})

rfpMonthSelector.on('blur', ()=> {
    DateCheck();
    MonthCheck();

})
rfpYearSelector.on('blur', ()=> {
    DateCheck();
    MonthCheck();
    YearCheck();
})


const DateCheck = ()=> {
  
    const dayValue = rfpDaySelector.val();
    console.log(dayValue)
    if(dayValue > 31 || dayValue < 0 ){
        rfpDaySelector.addClass('govuk-form-group--error');
        $('.durations').addClass('govuk-form-group--error');
        $('#event-name-error-date').html('Enter a valid date')
    }
    else{
     rfpDaySelector.removeClass('govuk-form-group--error');
     $('.durations').removeClass('govuk-form-group--error');
     $('#event-name-error-date').html('')
    }
}

const MonthCheck = ()=> {
    const MonthValue = rfpMonthSelector.val();
    if(MonthValue > 12 || MonthValue < 0 ){
     rfpMonthSelector.addClass('govuk-form-group--error');
     $('.durations').addClass('govuk-form-group--error');
     $('#event-name-error-month').html('Enter a valid month');
 
    }
    else{
     rfpMonthSelector.removeClass('govuk-form-group--error');
     $('.durations').removeClass('govuk-form-group--error');
     $('#event-name-error-month').html('');
    }
}

const currentYearDate = new Date();
const currentYear = currentYearDate.getFullYear()


const YearCheck = ()=> {
    const YearValues = rfpYearSelector.val();
    if(YearValues < currentYear){
        rfpYearSelector.addClass('govuk-form-group--error');
    $('.durations').addClass('govuk-form-group--error');
    $('#event-name-error-year').html('Enter a valid year');
    } 
    else if(YearValues == ""){
        rfpYearSelector.removeClass('govuk-form-group--error');
        $('.durations').removeClass('govuk-form-group--error');
        $('#event-name-error-year').html('');s
    }
    else{
        rfpYearSelector.removeClass('govuk-form-group--error');
        $('.durations').removeClass('govuk-form-group--error');
        $('#event-name-error-year').html('');
    }
}


rfpProjectYears.on('blur', ()=> {
    if(rfpProjectYears.val() < 0){
        rfpProjectYears.addClass('govuk-form-group--error');
        $('.p_durations').addClass('govuk-form-group--error');
        $('#event-name-error-pdate').html('Enter a valid Year')
    }
    else{
        rfpProjectYears.removeClass('govuk-form-group--error');
        $('.p_durations').removeClass('govuk-form-group--error');
        $('#event-name-error-pdate').html('')
    }
})

rfpProjectMonths.on('blur', ()=> {
    if(rfpProjectMonths.val() < 0){
        rfpProjectMonths.addClass('govuk-form-group--error');
        $('.p_durations').addClass('govuk-form-group--error');
        $('#event-name-error-pdate').html('Enter a valid Month')
    }
    else{
        rfpProjectMonths.removeClass('govuk-form-group--error');
        $('.p_durations').removeClass('govuk-form-group--error');
        $('#event-name-error-pdate').html('')
    }
})


rfpProjectDays.on('blur', ()=> {
    if(rfpProjectDays.val() < 0){
        rfpProjectDays.addClass('govuk-form-group--error');
        $('.p_durations').addClass('govuk-form-group--error');
        $('#event-name-error-pdate').html('Enter a valid date')
    }
    else{
        rfpProjectDays.removeClass('govuk-form-group--error');
        $('.p_durations').removeClass('govuk-form-group--error');
        $('#event-name-error-pdate').html('')
    }
})


$('#rfp_date').on('submit', (e)=> {
    e.preventDefault();
        const Day = $('#rfp_resource_start_date-day').val()
        const Month = $('#rfp_resource_start_date-month').val()
        const Year = $('#rfp_resource_start_date-year').val()
        const FormDate = new Date(Year, Month, Day);
        const getTimeOfFormDate = FormDate.getTime();

        const todayDate = new Date();


        if(Day == ""){
            const errorStore = [["rfp_resource_start_date", "Project start day cannot be Empty"]]
            rfpDaySelector.addClass('govuk-form-group--error');
            $('.durations').addClass('govuk-form-group--error');
            $('#event-name-error-date').html('Enter a valid date')
            ccsZPresentErrorSummary(errorStore);
            e.preventDefault()
        }
        
        if (Month == ""){
            const errorStore = [["rfp_resource_start_date", "Project start Month cannot be Empty"]]
            rfpMonthSelector.addClass('govuk-form-group--error');
            $('.durations').addClass('govuk-form-group--error');
            $('#event-name-error-month').html('Enter a valid month');
            ccsZPresentErrorSummary(errorStore);
            e.preventDefault()
        }
        
        if(Year == ""){
            const errorStore = [["rfp_resource_start_date", "Porject start Year cannot be Empty"]]
            rfpYearSelector.addClass('govuk-form-group--error');
            $('.durations').addClass('govuk-form-group--error');
            ccsZPresentErrorSummary(errorStore);
            e.preventDefault()
        }



        if(projectYears.val() < 0 || projectMonths.val() < 0 || projectDays.val() < 0){
            const errorStore = [["rfp_resource_start_date", "Project time's format is not valid"]]
            $('#event-name-error-year').html('Enter a valid year');
            ccsZPresentErrorSummary(errorStore);
            e.preventDefault()
        }


        

        if(getTimeOfFormDate > getMSOfExpiryDate){
            e.preventDefault();
            $('#event-name-error-date').html('Start date cannot be after agreement expiry date');
            rfpDaySelector.addClass('govuk-form-group--error');
            rfpMonthSelector.addClass('govuk-form-group--error');
            rfpYearSelector.addClass('govuk-form-group--error');
            $('.durations').addClass('govuk-form-group--error');
            const errorStore = [["rfp_resource_start_date", "Start date cannot be after agreement expiry date"]]

            ccsZPresentErrorSummary(errorStore);



        }
        else if(getTimeOfFormDate < todayDate.getTime()){
            e.preventDefault();
            $('#event-name-error-date').html('Start date must be a valid future date');
            rfpDaySelector.addClass('govuk-form-group--error');
            rfpMonthSelector.addClass('govuk-form-group--error');
            rfpYearSelector.addClass('govuk-form-group--error');
            $('.durations').addClass('govuk-form-group--error');
            const errorStore = [["rfp_resource_start_date", "Start date must be a valid future date"]];
            ccsZPresentErrorSummary(errorStore);
        }
        else{
            document.forms['rfp_date'].submit();
        }
})
}
