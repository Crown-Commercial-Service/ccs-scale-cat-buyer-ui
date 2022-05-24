
$('input[type="radio"]').on('click change', function(e) {
    if (e.currentTarget.value === 'Yes') {
       $('#conditional-rfp_radio_security_confirmation').fadeIn();
    } else {
        $('#conditional-rfp_radio_security_confirmation').hide();
    }
});
const removeErrorFieldsRfpIR35 = () => {
    $('.govuk-error-message').remove();
    $('.govuk-form-group--error').removeClass('govuk-form-group--error')
    $('.govuk-error-summary').remove();
    $(".govuk-input").removeClass("govuk-input--error");
    $('.govuk-form-group textarea').removeClass('govuk-textarea--error');
  
  }

$('#rfp_IR35_form').on('submit', (event) => {
    debugger
    event.preventDefault();
    const radioButtonOne=  document.getElementById("ccs_vetting_type").checked;
    const radioButtonTwo=  document.getElementById("ccs_vetting_type-2").checked;
    //errorStore = emptyFieldCheckRfpKPI();
  
    if (radioButtonOne || radioButtonTwo) {
      document.forms["rfp_IR35_form"].submit();
    }
    else {
        removeErrorFieldsRfpIR35();
        errorStore=['There is a problem','Please select at least one option to proceed']
      ccsZPresentErrorSummary([errorStore]);
    }
  
  });