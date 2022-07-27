document.addEventListener('DOMContentLoaded', () => {

    $('input:radio[name="ccs_rfp_choose_security"]').on('change', function () {
        if ($(this).is(':checked')) {
            $('.rfp_choosesecurity_resources').val(" ")
        }
        removeErrorFieldsRfpChoose_Security();
    });
    var value_rfp_ = document.getElementsByClassName("rfp_choosesecurity_resources")
    for (var i = 0; i < value_rfp_.length; i++) {

        value_rfp_[i].addEventListener('keydown', function (event) {

            // Checking for Backspace.
            if (event.keyCode == 8) {

                $('.rfp_choosesecurity_resources').val(" ")
            }
            // Checking for Delete.
            if (event.keyCode == 46) {

                $('.rfp_choosesecurity_resources').val(" ")
            }
        });
    }


    $('#rfp_choose_security_form').on('submit', (e) => {
        debugger
        var resources_rfp = '';
        var resources_rfp_IsZero = false;
        let errorStore = [];
        for (var i = 0; i < 4; i++) {
            var value_rfp = document.getElementsByClassName("rfp_choosesecurity_resources")[i].value
            if (value_rfp != undefined && value_rfp != " " && value_rfp != '') {
                resources_rfp = value_rfp;
                if (resources_rfp === "0") {
                    resources_rfp_IsZero = true;
                }
            }
        }
        var totalQuantityrfp = $('#totalQuantityrfp').val();
        var choosenoption_rfp = $('input[name="ccs_rfp_choose_security"]:checked').val();
        var choosenoption_rfp_Id = $('input[name="ccs_rfp_choose_security"]:checked')[0].id;
        var selectednumber_rfp = choosenoption_rfp ? choosenoption_rfp.replace(/[^0-9.]/g, '') : null
        removeErrorFieldsRfpChoose_Security();

        if ($('input:radio[name="ccs_rfp_choose_security"]:checked').length == 0) {
            e.preventDefault();
            errorStore.push(["There is a problem", 'You must select the highest level of security clearance that staff supplied to the project will need to have.'])
        }
        else if (selectednumber_rfp && ['1', '2', '3', '4'].includes(selectednumber_rfp) && !resources_rfp) {
            e.preventDefault();
            errorStore = [];
            errorStore.push(["There is a problem", 'You must enter the number of staff requiring the highest level of clearance.'])
            let elementId ="ccs_rfp_resources"+choosenoption_rfp_Id.split('-')[1];
            ccsZvalidateTextArea(elementId, 'You must enter information here');
        }
        else if (selectednumber_rfp && ['1', '2', '3', '4'].includes(selectednumber_rfp) && (resources_rfp < 0 || resources_rfp > (totalQuantityrfp - 1))) {
            e.preventDefault();
           
            errorStore = [];
            errorStore.push(["There is a problem", 'A Quantity must be between 1 to Quantity(' + totalQuantityrfp + ') - 1.'])
            let elementId ="ccs_rfp_resources"+choosenoption_rfp_Id.split('-')[1];
            ccsZvalidateTextAreaMultipleSameElement(elementId, 'A Quantity must be between 1 to Quantity(' + totalQuantityrfp + ') - 1.');
        }
        if (errorStore.length > 0) {
            ccsZPresentErrorSummary(errorStore);
            
        }
    })
});



const removeErrorFieldsRfpChoose_Security = () => {
    $('.govuk-error-message').remove();
    $('.govuk-form-group--error').removeClass('govuk-form-group--error');
    $('.govuk-error-summary').remove();
    $('.govuk-input').removeClass('govuk-input--error');
    $('.govuk-form-group textarea').removeClass('govuk-textarea--error');
};