
const DaySelector = $('#eoi_resource_start_date-day');
const MonthSelector = $('#eoi_resource_start_date-month');
const YearSelector = $('#eoi_resource_start_date-year');



const agreementData = $('.agreement_no').attr('id').split("-");

const expiryYears = Number(agreementData[0]);
const expiryMonth = Number(agreementData[1]);
const expiryDate = Number(agreementData[2])


const ExpiryDates = new Date(expiryYears, expiryMonth, expiryDate);
const getMSOfExpiryDate = ExpiryDates.getTime()



DaySelector.on('blur', ()=> {
  DateCheck();
  MonthCheck();

})

MonthSelector.on('blur', ()=> {
    DateCheck();
    MonthCheck();

})
YearSelector.on('blur', ()=> {
    DateCheck();
    MonthCheck();
    YearCheck();
})


const DateCheck = ()=> {
    const dayValue = DaySelector.val();
    if(dayValue > 31 || dayValue < 0 ){
        DaySelector.addClass('govuk-form-group--error');
        $('.durations').addClass('govuk-form-group--error');
        $('#event-name-error-date').html('Enter a valid date')
    }
    else{
     DaySelector.removeClass('govuk-form-group--error');
     $('.durations').removeClass('govuk-form-group--error');
     $('#event-name-error-date').html('')
    }
}

const MonthCheck = ()=> {
    const MonthValue = MonthSelector.val();
    if(MonthValue > 12 || MonthValue < 0 ){
     MonthSelector.addClass('govuk-form-group--error');
     $('.durations').addClass('govuk-form-group--error');
     $('#event-name-error-month').html('Enter a valid month');
 
    }
    else{
     MonthSelector.removeClass('govuk-form-group--error');
     $('.durations').removeClass('govuk-form-group--error');
     $('#event-name-error-month').html('');
    }
}


const YearCheck = ()=> {
    const YearValues = YearSelector.val();
    if(YearValues < 2022){
        YearSelector.addClass('govuk-form-group--error');
    $('.durations').addClass('govuk-form-group--error');
    $('#event-name-error-year').html('Enter a valid year');
    } 
    else if(YearValues == ""){
        YearSelector.removeClass('govuk-form-group--error');
        $('.durations').removeClass('govuk-form-group--error');
        $('#event-name-error-year').html('');s
    }
    else{
        YearSelector.removeClass('govuk-form-group--error');
        $('.durations').removeClass('govuk-form-group--error');
        $('#event-name-error-year').html('');
    }
}


const projectYears = $('#eoi_duration-years');
const projectMonths = $('#eoi_duration-months');
const projectDays = $('#eoi_duration-days');

projectYears.on('blur', ()=> {
    if(projectYears.val() < 0){
        projectYears.addClass('govuk-form-group--error');
        $('.p_durations').addClass('govuk-form-group--error');
        $('#event-name-error-pdate').html('Enter a valid Year')
    }
    else{
        projectYears.removeClass('govuk-form-group--error');
        $('.p_durations').removeClass('govuk-form-group--error');
        $('#event-name-error-pdate').html('')
    }
})

projectMonths.on('blur', ()=> {
    if(projectMonths.val() < 0){
        projectMonths.addClass('govuk-form-group--error');
        $('.p_durations').addClass('govuk-form-group--error');
        $('#event-name-error-pdate').html('Enter a valid Month')
    }
    else{
        projectMonths.removeClass('govuk-form-group--error');
        $('.p_durations').removeClass('govuk-form-group--error');
        $('#event-name-error-pdate').html('')
    }
})


projectDays.on('blur', ()=> {
    if(projectDays.val() < 0){
        projectDays.addClass('govuk-form-group--error');
        $('.p_durations').addClass('govuk-form-group--error');
        $('#event-name-error-pdate').html('Enter a valid date')
    }
    else{
        projectDays.removeClass('govuk-form-group--error');
        $('.p_durations').removeClass('govuk-form-group--error');
        $('#event-name-error-pdate').html('')
    }
})



$('.save-button').on('click', (e)=> {
        const Day = $('#eoi_resource_start_date-day').val()
        const Month = $('#eoi_resource_start_date-month').val()
        const Year = $('#eoi_resource_start_date-year').val()
        const FormDate = new Date(Year, Month, Day);
        const getTimeOfFormDate = FormDate.getTime();

        const todayDate = new Date();


        

        if(getTimeOfFormDate > getMSOfExpiryDate){
            e.preventDefault();
            $('#event-name-error-date').html('Start date cannot be after agreement expiry date');
            DaySelector.addClass('govuk-form-group--error');
            MonthSelector.addClass('govuk-form-group--error');
            YearSelector.addClass('govuk-form-group--error');
            $('.durations').addClass('govuk-form-group--error');
            const errorStore = [["eoi_resource_start_date", "Start date cannot be after agreement expiry date"]]

            ccsZPresentErrorSummary(errorStore);



        }
        else if(getTimeOfFormDate < todayDate.getTime()){
            e.preventDefault();
            $('#event-name-error-date').html('Start date cannot be after agreement expiry date');
            DaySelector.addClass('govuk-form-group--error');
            MonthSelector.addClass('govuk-form-group--error');
            YearSelector.addClass('govuk-form-group--error');
            $('.durations').addClass('govuk-form-group--error');
            const errorStore = [["eoi_resource_start_date", "Start date cannot be after agreement expiry date"]];
            ccsZPresentErrorSummary(errorStore);
        }
        else{
            document.forms['ccs_eoi_date_form'].submit();
        }



})