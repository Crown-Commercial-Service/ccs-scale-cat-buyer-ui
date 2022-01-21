const rfpProjectYears = $('#rfp_duration-years');
const rfpProjectMonths = $('#rfp_duration-months');
const rfpProjectDays = $('#rfp_duration-days');

const rfpDaySelector = $('#rfp_resource_start_date-day');
const rfpMonthSelector = $('#rfp_resource_start_date-month');
const rfpYearSelector = $('#rfp_resource_start_date-year');

rfpProjectYears.on('blur', ()=> {
    if(rfpProjectYears.val() <= 0){
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
    if(rfpProjectMonths.val() <= 0){
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
    if(rfpProjectDays.val() <= 0){
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
        const Day = $('#rfp_resource_start_date-day').val()
        const Month = $('#rfp_resource_start_date-month').val()
        const Year = $('#rfp_resource_start_date-year').val()
        const formDateMaxTime = new Date(parseInt(Year) + 4, Month, Day);
        const durationTime = new Date(parseInt(Year) + parseInt(rfpProjectYears.val()), parseInt(Month) + parseInt(rfpProjectMonths.val()), parseInt(Day) + parseInt(rfpProjectDays.val()));  

        if(durationTime > formDateMaxTime){
            e.preventDefault();
            $('#event-name-error-pdate').html('Indicative duration cannot exceed 4 years from the indicative start date');
            rfpDaySelector.addClass('govuk-form-group--error');
            rfpMonthSelector.addClass('govuk-form-group--error');
            rfpYearSelector.addClass('govuk-form-group--error');
            $('.durations').addClass('govuk-form-group--error');
            const errorStore = [["rfp_resource_start_date", "Indicative duration cannot exceed 4 years from the indicative start date"]];
            ccsZPresentErrorSummary(errorStore);
        }
        else{
            document.forms['ccs_rfp_date_form'].submit();
        }



})