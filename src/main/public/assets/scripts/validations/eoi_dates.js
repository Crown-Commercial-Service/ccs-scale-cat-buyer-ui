// const { isNull } = require("util");

const DaySelector = $('#eoi_resource_start_date-day');
const MonthSelector = $('#eoi_resource_start_date-month');
const YearSelector = $('#eoi_resource_start_date-year');

let agreementData;
if ($('.agreement_no').attr('id')) {
    agreementData = $('.agreement_no').attr('id').split("-");
}


const expiryYears = agreementData?.length > 0 ? Number(agreementData[0]) : null;
const expiryMonth = agreementData?.length > 0 ? Number(agreementData[1]) : null;
const expiryDate = agreementData?.length > 0 ? Number(agreementData[2]) : null;


const ExpiryDates = new Date(expiryYears, expiryMonth, expiryDate);
const getMSOfExpiryDate = ExpiryDates.getTime()



DaySelector.on('blur', () => {
    DateCheck();
    MonthCheck();

})

MonthSelector.on('blur', () => {
    DateCheck();
    MonthCheck();

})
YearSelector.on('blur', () => {
    DateCheck();
    MonthCheck();
    YearCheck();
})


const DateCheck = () => {
    const dayValue = DaySelector.val();
    if (dayValue > 31 || dayValue < 0) {
        DaySelector.addClass('govuk-form-group--error');
        $('.durations').addClass('govuk-form-group--error');
        $('#event-name-error-date').html('Enter a valid date')
    }
    else {
        DaySelector.removeClass('govuk-form-group--error');
        $('.durations').removeClass('govuk-form-group--error');
        $('#event-name-error-date').html('')
    }
}

const MonthCheck = () => {
    const MonthValue = MonthSelector.val();
    if (MonthValue > 12 || MonthValue < 0) {
        MonthSelector.addClass('govuk-form-group--error');
        $('.durations').addClass('govuk-form-group--error');
        $('#event-name-error-month').html('Enter a valid month');

    }
    else {
        MonthSelector.removeClass('govuk-form-group--error');
        $('.durations').removeClass('govuk-form-group--error');
        $('#event-name-error-month').html('');
    }
}

const currentYearDate = new Date();
const currentYear = currentYearDate.getFullYear()


const YearCheck = () => {
    const YearValues = YearSelector.val();
    if (YearValues < currentYear) {
        YearSelector.addClass('govuk-form-group--error');
        $('.durations').addClass('govuk-form-group--error');
        $('#event-name-error-year').html('Enter a valid year');
    }
    else if (YearValues == "") {
        YearSelector.removeClass('govuk-form-group--error');
        $('.durations').removeClass('govuk-form-group--error');
        $('#event-name-error-year').html('');
    }
    else {
        YearSelector.removeClass('govuk-form-group--error');
        $('.durations').removeClass('govuk-form-group--error');
        $('#event-name-error-year').html('');
    }
}


const projectYears = $('#eoi_duration-years');
const projectMonths = $('#eoi_duration-months');
const projectDays = $('#eoi_duration-days');

projectYears.on('blur', () => {
    if (projectYears.val() < 0) {
        projectYears.addClass('govuk-form-group--error');
        $('.p_durations').addClass('govuk-form-group--error');
        $('#eoi-event-name-error-pdate').html('Enter a valid Year')
    }else{
        let yrValidation = false;
        let durationDays = document.getElementById('eoi_duration-days');
        let durationMonth = document.getElementById('eoi_duration-months');
        DaysProjectRun = Number(durationDays.value);
        MonthProjectRun = Number(durationMonth.value);
        let YearProjectRun = Number(projectYears.val());

            if(YearProjectRun==4){
               if(MonthProjectRun>0 || DaysProjectRun>0){
                  yrValidation = true;
               }
            }else if(YearProjectRun==3){
               if(MonthProjectRun==12 && DaysProjectRun>0){
                  yrValidation = true;
               }
            }else if(YearProjectRun>4){
               yrValidation = true;
            }
            if(yrValidation){
                projectYears.addClass('govuk-form-group--error');
                $('.p_durations').addClass('govuk-form-group--error');
                $('#eoi-event-name-error-pdate').html('Project Duration should not be greater than 4 years')
            }else {
                projectYears.removeClass('govuk-form-group--error');
                $('.p_durations').removeClass('govuk-form-group--error');
                $('#eoi-event-name-error-pdate').html('')
            }
            $('#eoi_duration-months').blur();
            $('#eoi_duration-days').blur();
    }
})

projectMonths.on('blur', () => {
    if (projectMonths.val() < 0) {
        projectMonths.addClass('govuk-form-group--error');
        $('.p_durations').addClass('govuk-form-group--error');
        $('#eoi-event-name-error-pdate').html('Enter a valid Month')
    }else{
        let yrValidation = false;
        let durationYear = document.getElementById('eoi_duration-years');
        let durationDay = document.getElementById('eoi_duration-days');
        YearProjectRun = Number(durationYear.value);
        DaysProjectRun = Number(durationDay.value);
        let MonthProjectRun = Number(projectMonths.val());

            if(YearProjectRun==4){
               if(MonthProjectRun>0 || DaysProjectRun>0){
                  yrValidation = true;
               }
            }else if(YearProjectRun==3){
               if(MonthProjectRun==12 && DaysProjectRun>0){
                  yrValidation = true;
               }
            }else if(YearProjectRun>4){
               yrValidation = true;
            }
            if(yrValidation){
                projectMonths.addClass('govuk-form-group--error');
                $('.p_durations').addClass('govuk-form-group--error');
                $('#eoi-event-name-error-pdate').html('Project Duration should not be greater than 4 years')
            }else {
                projectMonths.removeClass('govuk-form-group--error');
                $('.p_durations').removeClass('govuk-form-group--error');
                $('#eoi-event-name-error-pdate').html('')
            }
            $('#eoi_duration-days').blur();
            // $('#eoi_duration-years').blur();
    }
    
})


projectDays.on('blur', () => {
    if (projectDays.val() < 0) {
        projectDays.addClass('govuk-form-group--error');
        $('.p_durations').addClass('govuk-form-group--error');
        $('#eoi-event-name-error-pdate').html('Enter a valid date')
    }else{
        let yrValidation = false;
        let durationYear = document.getElementById('eoi_duration-years');
        let durationMonth = document.getElementById('eoi_duration-months');
        YearProjectRun = Number(durationYear.value);
        MonthProjectRun = Number(durationMonth.value);
        let DaysProjectRun = Number(projectDays.val());

            if(YearProjectRun==4){
               if(MonthProjectRun>0 || DaysProjectRun>0){
                  yrValidation = true;
               }
            }else if(YearProjectRun==3){
               if(MonthProjectRun==12 && DaysProjectRun>0){
                  yrValidation = true;
               }
            }else if(YearProjectRun>4){
               yrValidation = true;
            }
            if(yrValidation){
                projectDays.addClass('govuk-form-group--error');
                $('.p_durations').addClass('govuk-form-group--error');
                $('#eoi-event-name-error-pdate').html('Project Duration should not be greater than 4 years')
            }else {
                projectDays.removeClass('govuk-form-group--error');
                $('.p_durations').removeClass('govuk-form-group--error');
                $('#eoi-event-name-error-pdate').html('')
            }
            // $('#eoi_duration-years').blur();
            // $('#eoi_duration-months').blur();
    }
})



$('.save-button').on('click', (e) => {
if(document.getElementById("eoi_resource_start_date-day") != null){
    const Day = $('#eoi_resource_start_date-day').val()
    const Month = $('#eoi_resource_start_date-month').val()
    const Year = $('#eoi_resource_start_date-year').val()
    const FormDate = new Date(Year, Month, Day);
    const getTimeOfFormDate = FormDate.getTime();

    const todayDate = new Date();


    if (Day == "") {
        const errorStore = [["eoi_resource_start_date", "Project start day cannot be Empty"]]
        DaySelector.addClass('govuk-form-group--error');
        $('.durations').addClass('govuk-form-group--error');
        $('#event-name-error-date').html('Enter a valid date')
        ccsZPresentErrorSummary(errorStore);
        e.preventDefault()
    }

    if (Month == "") {
        const errorStore = [["eoi_resource_start_date", "Project start Month cannot be Empty"]]
        MonthSelector.addClass('govuk-form-group--error');
        $('.durations').addClass('govuk-form-group--error');
        $('#event-name-error-month').html('Enter a valid month');
        ccsZPresentErrorSummary(errorStore);
        e.preventDefault()
    }

    if (Year == "") {
        const errorStore = [["eoi_resource_start_date", "Porject start Year cannot be Empty"]]
        YearSelector.addClass('govuk-form-group--error');
        $('.durations').addClass('govuk-form-group--error');
        $('#event-name-error-year').html('Enter a valid year');
        ccsZPresentErrorSummary(errorStore);
        e.preventDefault()
    }



    //$('#event-name-error-year').html('Enter a valid year');
   // const errorStore = [["eoi_resource_start_date", "Project time's format is not valid"]]
   
    //balwinder added if condation
    if (document.forms['ccs_eoi_date_form'] != undefined && document.forms['ccs_eoi_date_form'] != null) {
       // console.log("errorStore",errorStore)
        //ccsZPresentErrorSummary(errorStore);
    }
    console.log("getTimeOfFormDate",getTimeOfFormDate);
    console.log("getMSOfExpiryDate",getMSOfExpiryDate);
    
    if (getTimeOfFormDate > getMSOfExpiryDate) {
        e.preventDefault();
        $('#event-name-error-date').html('Start date cannot be after agreement expiry date');
        DaySelector.addClass('govuk-form-group--error');
        MonthSelector.addClass('govuk-form-group--error');
        YearSelector.addClass('govuk-form-group--error');
        $('.durations').addClass('govuk-form-group--error');
        const errorStore = [["eoi_resource_start_date", "Start date cannot be after agreement expiry date"]]
        ccsZPresentErrorSummary(errorStore);
    }
    else if (getTimeOfFormDate < todayDate.getTime()) {
        e.preventDefault();
        $('#event-name-error-date').html('Start date must be a valid future date');
        DaySelector.addClass('govuk-form-group--error');
        MonthSelector.addClass('govuk-form-group--error');
        YearSelector.addClass('govuk-form-group--error');
        $('.durations').addClass('govuk-form-group--error');
        const errorStore = [["eoi_resource_start_date", "Start date must be a valid future date"]];
        ccsZPresentErrorSummary(errorStore);
    }
    else {
        let yrValidation = false;
            const durationYear = document.getElementById('eoi_duration-years');
            const durationMonth = document.getElementById('eoi_duration-months');
            const durationDay = document.getElementById('eoi_duration-days');

            if(durationYear.value!='' || durationMonth.value!='' || durationDay.value!=''){
            const YearProjectRun = Number(durationYear.value);
            const MonthProjectRun = Number(durationMonth.value);
            const DaysProjectRun = Number(durationDay.value);
            
            if(YearProjectRun==4){
               if(MonthProjectRun>0 || DaysProjectRun>0){
                  yrValidation = true;
               }
            }else if(YearProjectRun==3){
               if(MonthProjectRun==12 && DaysProjectRun>0){
                  yrValidation = true;
               }
            }else if(YearProjectRun>4){
               yrValidation = true;
            }
            if(yrValidation){
                e.preventDefault()
               return;
            }
            }
               
            document.forms['ccs_eoi_date_form'].submit();
    }

}

})