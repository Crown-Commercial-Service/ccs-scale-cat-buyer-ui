const ccsZvalidateEoiDate = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];
  
    const start_day = document.getElementById("eoi_resource_start_date-day"),
    start_month = document.getElementById("eoi_resource_start_date-month"),
    start_year = document.getElementById("eoi_resource_start_date-year");

    

    let start_date = "";
      start_date = getDate(start_day, start_month, start_year, start_date);
   
  if (document.getElementById("eoi_resource_start_date-day") !=undefined &&document.getElementById("eoi_resource_start_date-day") !=null && document.getElementById("eoi_resource_start_date-day").value.trim().length === 0) {
    fieldCheck = ccsZvalidateWithRegex("eoi_resource_start_date-day", "Enter a day", /^\d{1,}$/);
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  }
  if (document.getElementById("eoi_resource_start_date-month") !=undefined && document.getElementById("eoi_resource_start_date-month") !=null && document.getElementById("eoi_resource_start_date-month").value.trim().length === 0) {
    fieldCheck = ccsZvalidateWithRegex("eoi_resource_start_date-month", "Enter a month", /^\d{1,}$/);
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  }
  if (document.getElementById("eoi_resource_start_date-year") !=undefined && document.getElementById("eoi_resource_start_date-year") !=null && document.getElementById("eoi_resource_start_date-year").value.trim().length === 0) {
    fieldCheck = ccsZvalidateWithRegex("eoi_resource_start_date-year", "Enter a year", /^\d{1,}$/);
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  }
  if (document.getElementById("eoi_resource_start_date-year") !=undefined && document.getElementById("eoi_resource_start_date-year") !=null && document.getElementById("eoi_resource_start_date-year").value.trim().length < 4) {
    fieldCheck = ccsZvalidateWithRegex("eoi_resource_start_date-year", "The date format should be YYYY", /^\d{4,}$/);
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  }
  
  if (document.getElementById("eoi_resource_start_date-year") !=undefined && document.getElementById("eoi_resource_start_date-year") !=null && document.getElementById("eoi_resource_start_date-year").value.trim().length === 4) {
  fieldCheck = ccsZvalidateThisDate( "eoi_resource_start_date", "Start date must be a valid future date", 1, 0 );
  if (fieldCheck !== true) errorStore.push(fieldCheck);
  else
  {
    
    // var description =document.getElementById("eoi_resource_start_date-hint") !=undefined && document.getElementById("eoi_resource_start_date-hint") !=null ?  document.getElementById("eoi_resource_start_date-hint").innerText.trim().split('\n')[0].split(' '):null;
    
    // var agreement_expiry_date =description !=null? description[5]+","+description[6]+","+description[7]:null;
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
    // const ExpiryDates = new Date(expiryYears, expiryMonth-1, expiryDate);
    // const getMSOfExpiryDate = ExpiryDates.getTime()
    
    var agreement_expiry_date =expiryYears+","+expiryMonth+","+expiryDate;
    fieldCheck =agreement_expiry_date !=null? isValidEoiStartDateForSelectedLot(start_date,agreement_expiry_date):null;
      if(fieldCheck !=null && fieldCheck !== true) {
        ccsZaddErrorMessage(document.getElementById("eoi_resource_start_date"), "Start date cannot be after agreement expiry date");
          errorStore.push(["eoi_resource_start_date", "Start date cannot be after agreement expiry date"]);
      }
  }
  }


  if (errorStore.length === 0 && document.forms["ccs_eoi_date_form"] !=undefined && document.forms["ccs_eoi_date_form"] !=null && document.forms["ccs_eoi_date_form"].length >0) document.forms["ccs_eoi_date_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};


function getDate(start_day, start_month, start_year, start_date) {
 
  

  if (start_day !=undefined && start_day !=null && start_day.value.match(/^\d\d?$/) &&
      start_month.value.match(/^\d\d?$/) &&
      start_year.value.match(/^\d{4}$/)) {
      let start_day_str = start_day.value, start_month_str = start_month.value;
        
        
      if (start_day_str !=undefined && start_day_str !=null && start_day_str < 10 && !start_day_str.match(/^0\d$/))
          start_day_str = "0" + start_day_str;
      if (start_month_str !=undefined && start_month_str !=null && start_month_str < 10 && !start_month_str.match(/^0\d$/))
          start_month_str = "0" + start_month_str;
      //start_date = new Date(start_year.value + "-" + start_month_str + "-" + start_day_str + "T11:00:00").getTime();
      start_date = new Date(start_year.value + "-" + start_month_str + "-" + start_day_str + "T00:00:00").getTime();
  }
  return start_date;
}

function isValidEoiStartDateForSelectedLot(start_date,agreement_expiry_date) {
    if(start_date !=undefined && start_date !=null && start_date <= new Date(agreement_expiry_date)) { // This will only work in prototype for MCF-3 lot 1 for enabling this page for other agreements need to add hidden field in the page to read lot endDate
      return true;
  }else {
      return false;
  }
}
 const setInputFilter = (textbox, inputFilter) => {
   if (textbox !=undefined && textbox !=null) {
     ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {

       textbox.addEventListener(event, function () {

         if (inputFilter(this.value)) {
           this.oldValue = this.value;
           this.oldSelectionStart = this.selectionStart;
           this.oldSelectionEnd = this.selectionEnd;
         } else if (this.hasOwnProperty("oldValue")) {
           this.value = this.oldValue;
           this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
         } else {
           this.value = "";
         }
       });
     });
   }
  
} 