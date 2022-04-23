const ccsZvalidateCASupplier = (event) => {
  event.preventDefault();
         let fieldCheck = "",
    errorStore = [];
    const val = $("#ca-supplier-count").val();
     if (val.length === 0 || val <3 || val > 49) {
    fieldCheck = ccsZvalidateWithRegex("ca-supplier-count", "Enter a valid value", null);
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  }
  
   if (errorStore.length === 0) document.forms["ccs_ca_suppliers_form"].submit();
  else{
    $('.govuk-error-summary__title').text('There is a problem');

    $("#summary_list").html('<li><a href="#summary">There is a problem with the value below</a></li> ');
    $([document.documentElement, document.body]).animate({
        scrollTop: $("#summary_list").offset().top
    }, 1000);     

    $('#service_capability_error_summary').removeClass('hide-block');
  }
};