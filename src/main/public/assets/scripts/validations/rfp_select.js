
$('input[type="radio"]').on('click change', function (e) {
    if (e.currentTarget.value === 'Yes') {
        $('#conditional-rfp_radio_security_confirmation').fadeIn();
    } else {
        $('#conditional-rfp_radio_security_confirmation').hide();
    }
});
const removeErrorFieldsRfpSelect = () => {
    $('.govuk-error-message').remove();
    $('.govuk-form-group--error').removeClass('govuk-form-group--error');
    $('.govuk-error-summary').remove();
    $('.govuk-input').removeClass('govuk-input--error');
    $('.govuk-form-group textarea').removeClass('govuk-textarea--error');
  };
$('#rfp_singleselect').on('submit', (event) => {
    event.preventDefault();
    removeErrorFieldsRfpSelect();
    var listofRadionButton = document.querySelectorAll('.govuk-radios__input');
    let ischecked = false;
    listofRadionButton.forEach(element => {
        if (element.type === 'radio' && element.checked) {
            ischecked = true;
        }
    });
    if (ischecked) {
        document.forms['rfp_singleselect'].submit();
    } else
        ccsZPresentErrorSummary([["There is a problem", 'You must choose one option from list before proceeding']]);
    
});
