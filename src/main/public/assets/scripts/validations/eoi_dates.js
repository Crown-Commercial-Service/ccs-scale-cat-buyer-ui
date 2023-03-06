const DaySelector = $('#eoi_resource_start_date-day');
const MonthSelector = $('#eoi_resource_start_date-month');
const YearSelector = $('#eoi_resource_start_date-year');


DaySelector.on('keydown', (event) => {
    if (event.key === '.' || event.keyCode ===69 || event.keyCode ===189 || event.keyCode ===109)
    event.preventDefault(); });
MonthSelector.on('keydown', (event) => {
    if (event.key === '.' || event.keyCode ===69 || event.keyCode ===189 || event.keyCode ===109)
    event.preventDefault(); });  
YearSelector.on('keydown', (event) => {
    if (event.key === '.' || event.keyCode ===69 || event.keyCode ===189 || event.keyCode ===109)
    event.preventDefault(); });
    
let eoiDurationField = $('.eoi_duration');
  
    eoiDurationField.on('keydown', (event) => {
     if (event.key === '.'  || event.keyCode ===69 || event.keyCode ===189 || event.keyCode ===109)
       event.preventDefault(); });


let agreementData;
if ($('.agreement_no').attr('id')) {
    agreementData = $('.agreement_no').attr('id').split("-");
}

let expiryYears = null;
let expiryMonth = null;
let expiryDate = null;

if (agreementData != undefined && agreementData.length > 0) {
    expiryYears = Number(agreementData[0]);
    expiryMonth = Number(agreementData[1]);
    expiryDate = Number(agreementData[2]);
}

const ExpiryDates = new Date(expiryYears, expiryMonth-1, expiryDate);
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

$(".startdateyearlimitEoi").keyup(function (e) {
    var maxLen = $(this).val().length;
    let value = $(this).val();
    var keyCode = e.which;
 
    if (maxLen >= 4) {
       return false;
    }
 
 });
 $(".startdateyearlimitEoi").keypress(function (e) {
    var maxLen = $(this).val().length;
    let value = $(this).val();
    var keyCode = e.which;
    if (maxLen >= 4) {
      
       return false;
    }
 
 });

const currentYearDate = new Date();
const currentYear = currentYearDate.getFullYear()


const YearCheck = () => {
    const YearValues = YearSelector.val();
    let matchValue = !YearSelector.val().match(/^\d{4}$/);
    if (YearValues<1 || matchValue) {
        YearSelector.addClass('govuk-form-group--error');
        $('.durations').addClass('govuk-form-group--error');
        $('#event-name-error-year').html('Enter a year using the YYYY format');
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
        $('#eoi-event-name-error-pdate').html('Enter a valid year')
    }else{
        projectYears.removeClass('govuk-form-group--error');
        $('.p_durations').removeClass('govuk-form-group--error');
        $('#eoi-event-name-error-pdate').html('')
    }
})

projectMonths.on('blur', () => {
    if (projectMonths.val() < 0) {
        projectMonths.addClass('govuk-form-group--error');
        $('.p_durations').addClass('govuk-form-group--error');
        $('#eoi-event-name-error-pdate').html('Enter a valid month')
    }else{
        projectMonths.removeClass('govuk-form-group--error');
        $('.p_durations').removeClass('govuk-form-group--error');
        $('#eoi-event-name-error-pdate').html('')
          
    }
    
})


projectDays.on('blur', () => {
    if (projectDays.val() < 0) {
        projectDays.addClass('govuk-form-group--error');
        $('.p_durations').addClass('govuk-form-group--error');
        $('#eoi-event-name-error-pdate').html('Enter a valid date')
    }else{
        projectDays.removeClass('govuk-form-group--error');
        $('.p_durations').removeClass('govuk-form-group--error');
        $('#eoi-event-name-error-pdate').html('')
    }
})



$('.save-button').on('click', (e) => {
if(document.getElementById("eoi_resource_start_date-day") != null){
    e.preventDefault();
    const Day = $('#eoi_resource_start_date-day').val()
    const Month = $('#eoi_resource_start_date-month').val()
    const Year = $('#eoi_resource_start_date-year').val()
    const FormDate = new Date(Year, Month-1, Day);
    const getTimeOfFormDate = FormDate.getTime();
   
    const todayDate = new Date();

    DaySelector.removeClass('govuk-form-group--error');
    MonthSelector.removeClass('govuk-form-group--error');
    YearSelector.removeClass('govuk-form-group--error');
    $('.durations').removeClass('govuk-form-group--error');
    $('#event-name-error-date').html('');
    $('#event-name-error-month').html('');
    $('#event-name-error-year').html('');
    ccsZPresentErrorSummary();
    
    const YearValuesNew = YearSelector.val();
    let matchValueNew = !YearSelector.val().match(/^\d{4}$/);
    
    // DaySelector.addClass('govuk-form-group--error');
    // MonthSelector.addClass('govuk-form-group--error');
    // YearSelector.addClass('govuk-form-group--error');

    if(Day == "" && Month == "" && Year == ""){
        const errorStore = [["eoi_resource_start_date", "Enter a project start date"]]
        DaySelector.addClass('govuk-form-group--error');
        $('.durations').addClass('govuk-form-group--error');
        $('#event-name-error-date').html('Enter a project start date')
        ccsZPresentErrorSummary(errorStore);    
    }else if(Day == "" && Month != "" && Year != ""){
        const errorStore = [["eoi_resource_start_date", "Enter a project start day"]]
        DaySelector.addClass('govuk-form-group--error');
        $('.durations').addClass('govuk-form-group--error');
        $('#event-name-error-date').html('Enter a project start day')
        ccsZPresentErrorSummary(errorStore);    
    }else if(Day != "" && Month == "" && Year != ""){
        const errorStore = [["eoi_resource_start_date-month", "Enter a project start month"]]
        MonthSelector.addClass('govuk-form-group--error');
        $('.durations').addClass('govuk-form-group--error');
        $('#event-name-error-month').html('Enter a project start month')
        ccsZPresentErrorSummary(errorStore);    
    }else if(Day != "" && Month != "" && Year == ""){
        const errorStore = [["eoi_resource_start_date-year", "Enter a project start year"]]
        YearSelector.addClass('govuk-form-group--error');
        $('.durations').addClass('govuk-form-group--error');
        $('#event-name-error-year').html('Enter a project start year')
        ccsZPresentErrorSummary(errorStore);    
    }else if(Day != "" && Month == "" && Year == ""){
        const errorStore = [["eoi_resource_start_date-month", "Enter a project start month and year"]]
        MonthSelector.addClass('govuk-form-group--error');
        $('.durations').addClass('govuk-form-group--error');
        $('#event-name-error-month').html('Enter a project start month and year')
        ccsZPresentErrorSummary(errorStore);    
    }else if(Day == "" && Month != "" && Year == ""){
        const errorStore = [["eoi_resource_start_date", "Enter a project start day and year"]]
        DaySelector.addClass('govuk-form-group--error');
        $('.durations').addClass('govuk-form-group--error');
        $('#event-name-error-date').html('Enter a project start day and year')
        ccsZPresentErrorSummary(errorStore);    
    }else if(Day == "" && Month == "" && Year != ""){
        const errorStore = [["eoi_resource_start_date", "Enter a project start day and month"]]
        DaySelector.addClass('govuk-form-group--error');
        $('.durations').addClass('govuk-form-group--error');
        $('#event-name-error-date').html('Enter a project start day and month')
        ccsZPresentErrorSummary(errorStore);    
    }else if (YearValuesNew<1 || matchValueNew) {
        const errorStore = [["eoi_resource_start_date-year", "Enter a year using the YYYY format"]]
        DaySelector.addClass('govuk-form-group--error');
        MonthSelector.addClass('govuk-form-group--error');
        YearSelector.addClass('govuk-form-group--error');
        $('.durations').addClass('govuk-form-group--error');
        $('#event-name-error-year').html('Enter a year using the YYYY format')
        ccsZPresentErrorSummary(errorStore);    
    }else if (getTimeOfFormDate < todayDate.getTime()) {
       // $('#event-name-error-date').html('Enter a project start date in the future');
       DaySelector.addClass('govuk-form-group--error');
       MonthSelector.addClass('govuk-form-group--error');
       YearSelector.addClass('govuk-form-group--error');
      
       $('.durations').addClass('govuk-form-group--error'); 
       $('#event-name-error-year').html('Enter a project start date in the future');
        const errorStore = [["eoi_resource_start_date", "Enter a project start date in the future"]];
        ccsZPresentErrorSummary(errorStore);
    }else{
        document.forms['ccs_eoi_date_form'].submit();
    }
    
    // if (Day == "") {
    //     const errorStore = [["eoi_resource_start_date", "Project start date cannot be empty"]]
    //     DaySelector.addClass('govuk-form-group--error');
    //     $('.durations').addClass('govuk-form-group--error');
    //     $('#event-name-error-date').html('Enter a valid date')
    //     ccsZPresentErrorSummary(errorStore);
    // }else if (Month == "") {
    //     const errorStore = [["eoi_resource_start_date", "Project start month cannot be empty"]]
    //     MonthSelector.addClass('govuk-form-group--error');
    //     $('.durations').addClass('govuk-form-group--error');
    //     $('#event-name-error-month').html('Enter a valid month');
    //     ccsZPresentErrorSummary(errorStore);
    // }else if (Year == "") {
    //     const errorStore = [["eoi_resource_start_date", "Porject start year cannot be empty"]]
    //     YearSelector.addClass('govuk-form-group--error');
    //     $('.durations').addClass('govuk-form-group--error');
    //     $('#event-name-error-year').html('Enter a valid year');
    //     ccsZPresentErrorSummary(errorStore);
    // }



    //$('#event-name-error-year').html('Enter a valid year');
   // const errorStore = [["eoi_resource_start_date", "Project time's format is not valid"]]
   
    //balwinder added if condation
    if (document.forms['ccs_eoi_date_form'] != undefined && document.forms['ccs_eoi_date_form'] != null) {
       // console.log("errorStore",errorStore)
        //ccsZPresentErrorSummary(errorStore);
    }
    

    if (Day != "" && Month != "" && Year != ""){
        

        //if (getTimeOfFormDate > getMSOfExpiryDate) {
        
        //     $('#event-name-error-date').html('11It is recommended that your project does not start after lot expiry date');
        //     DaySelector.addClass('govuk-form-group--error');
        //     MonthSelector.addClass('govuk-form-group--error');
        //     YearSelector.addClass('govuk-form-group--error');
        //     $('.durations').addClass('govuk-form-group--error');
        //     const errorStore = [["eoi_resource_start_date", "22It is recommended that your project does not start after lot expiry date"]]
        //    // ccsZPresentErrorSummary(errorStore);
        //}
        // if (YearValuesNew<1 || matchValue) {
           
        //     $('#event-name-error-date').html('Enter a year using the YYYY format');
        //     DaySelector.addClass('govuk-form-group--error');
        //     MonthSelector.addClass('govuk-form-group--error');
        //     YearSelector.addClass('govuk-form-group--error');
        //     $('.durations').addClass('govuk-form-group--error');
        //     const errorStore = [["eoi_resource_start_date", "Enter a year using the YYYY format"]];
        //     ccsZPresentErrorSummary(errorStore);

        //     // const errorStore = [["eoi_resource_start_date-year", "Enter a year using the YYYY format"]]
        //     // DaySelector.addClass('govuk-form-group--error');
        //     // $('.durations').addClass('govuk-form-group--error');
        //     // $('#event-name-error-year').html('Enter a year using the YYYY format')
        //     // ccsZPresentErrorSummary(errorStore);    
    
           
        // }else 
        // if (getTimeOfFormDate < todayDate.getTime()) {
        //     $('#event-name-error-date').html('Enter a project start date in the future');
        //     DaySelector.addClass('govuk-form-group--error');
        //     MonthSelector.addClass('govuk-form-group--error');
        //     YearSelector.addClass('govuk-form-group--error');
        //     $('.durations').addClass('govuk-form-group--error');
        //     const errorStore = [["eoi_resource_start_date", "Enter a project start date in the future"]];
        //     ccsZPresentErrorSummary(errorStore);
        // }
        // else {
                
        //     document.forms['ccs_eoi_date_form'].submit();
        // }
    }

}

})