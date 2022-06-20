
let rfp_security_confirmation = null;

document.addEventListener('DOMContentLoaded', () => {

    if (document.getElementById("rfp_singleselect") !== null) {
        if (document.getElementById("rfp_security_confirmation") !== undefined && document.getElementById("rfp_security_confirmation") !== null && document.getElementById("rfp_security_confirmation").value != '') {
            $('#conditional-rfp_radio_security_confirmation').fadeIn();
        } else {
            $('#conditional-rfp_radio_security_confirmation').hide();
        }
    }
});
$('input[type="radio"]').on('change', function (e) {
    if (e.currentTarget.value === 'Yes') {
        if (rfp_security_confirmation != null && rfp_security_confirmation != '' && document.getElementById("rfp_security_confirmation") != undefined)
            document.getElementById("rfp_security_confirmation").value = rfp_security_confirmation;
        $('#conditional-rfp_radio_security_confirmation').fadeIn();
    } else {
        if (document.getElementById("rfp_security_confirmation") != undefined) {
            rfp_security_confirmation = document.getElementById("rfp_security_confirmation").value;
            document.getElementById("rfp_security_confirmation").value = '';
        }
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
    const textPattern = /^[a-zA-Z ]+$/
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
            ccsZPresentErrorSummary([["rfp_security_confirmationrfp_security_confirmation", 'You must add information in field.']]);
        }
        else if (ccs_vetting_type && rfp_security_confirmation.value !== undefined && rfp_security_confirmation.value !== null && rfp_security_confirmation.value !== '' && !textPattern.test(rfp_security_confirmation.value) && Number(rfp_security_confirmation.value)) {
            ccsZaddErrorMessage(rfp_security_confirmation, 'Please enter only character.');
            ccsZPresentErrorSummary([["rfp_security_confirmation", 'Please enter only character.']]);
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
