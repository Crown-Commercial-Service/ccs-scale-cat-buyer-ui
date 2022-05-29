


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
    var headerText = document.getElementById('page-heading').innerHTML;
    listofRadionButton.forEach(element => {
        if (element.type === 'radio' && element.checked) {
            ischecked = true;
        }
    });
    if (headerText.includes("existing supplier") && ischecked) {
        var ccs_vetting_type = document.getElementById("ccs_vetting_type").checked;
        var rfp_security_confirmation = document.getElementById("rfp_security_confirmation");
        if (ccs_vetting_type && rfp_security_confirmation.value === '' && Number(rfp_security_confirmation.value)) {
            ccsZaddErrorMessage(rfp_security_confirmation, 'You must add information in field.');
            ccsZPresentErrorSummary([["There is a problem", 'You must add information in field.']]);
        }
        else if (ccs_vetting_type && rfp_security_confirmation.value !== '' && Number(rfp_security_confirmation.value)) {
            ccsZaddErrorMessage(rfp_security_confirmation, 'Please enter only character.');
            ccsZPresentErrorSummary([["There is a problem", 'Please enter only character.']]);
        }
        else {
            document.forms['rfp_singleselect'].submit();
        }
    } else {
        if (ischecked) {
            document.forms['rfp_singleselect'].submit();
        } else
            ccsZPresentErrorSummary([["There is a problem", 'You must choose one option from list before proceeding']]);

    }

});
