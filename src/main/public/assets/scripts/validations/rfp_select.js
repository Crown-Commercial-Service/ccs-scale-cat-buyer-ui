
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
        let fieldCheck = '';
  errorStore.length = 0;
  const pageHeading = document.getElementById('page-heading').innerHTML;
  if ($('#ccs_vetting_type') !== undefined) {
    var listofRadionButton = document.querySelectorAll('.govuk-radios__input');
    let ischecked = false;
    listofRadionButton.forEach(element => {
      if (element.type === 'radio' && element.checked) {
        ischecked = true;
      }
    });
    if (!ischecked) {
      fieldCheck = ccsZisOptionChecked("ccs_vetting_type", "Please select an option");
      if (fieldCheck !== true && fieldCheck !== undefined) errorStore.push(fieldCheck);
    }
  }

  if ($('#rfp_prob_statement_t') !== undefined && $('#rfp_prob_statement_t').val() !== undefined) {
    if (!pageHeading.includes("(Optional)")) {
      if ($('#rfp_prob_statement_t').val().length === 0) {
        fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_t', 'You must enter information here');
        if (fieldCheck !== true) errorStore.push(fieldCheck);
      }
    }
    if (condLength($('#rfp_prob_statement_t').val())) {
      const msg = char ? 'Entry must be <= 5000 characters' : 'Entry must be <= 500 words';
      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_t', msg, !condLength($('#rfp_prob_statement_t').val()));
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }

  if ($('#rfp_prob_statement_s') !== undefined && $('#rfp_prob_statement_s').val() !== undefined) {

    if (condLength($('#rfp_prob_statement_s').val())) {
      const msg = char ? 'Entry must be <= 5000 characters' : 'Entry must be <= 500 words';
      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_s', msg, !condLength($('#rfp_prob_statement_s').val()));
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }
  if ($('#rfp_prob_statement_s') !== undefined && $('#rfp_prob_statement_s').val() !== undefined) {
    if ($('#rfp_prob_statement_s').val().length === 0) {

      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_s', 'You must add background information about your procurement');
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }

  if ($('#rfp_prob_statement_d') !== undefined && $('#rfp_prob_statement_d').val() !== undefined) {
    if ($('#rfp_prob_statement_d').val().length === 0) {
      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_d', 'You must add background information about your procurement');
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
    else if ($('#rfp_prob_statement_d').val().length > 500) {

      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_d', 'You must enter less than 500 characters');
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }

  if ($('#rfp_prob_statement_r') !== undefined && $('#rfp_prob_statement_r').val() !== undefined) {
    errorStore = [];
    if (!pageHeading.includes("(Optional)")) {
      if ($('#rfp_prob_statement_r').val().length === 0) {

        fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_r', 'You must enter information here');
        if (fieldCheck !== true) errorStore.push(fieldCheck);
      }

    }
    if ($('#rfp_prob_statement_r').val().length > 500) {

      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_r', 'You must enter less than 500 characters');
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }
  if ($('#rfp_security_confirmation') !== undefined && $('#rfp_security_confirmation').val() !== undefined && $("input[name='ccs_vetting_type']").prop('checked')) {
    // errorStore.length = 0;
    if ($('#rfp_security_confirmation').val().length === 0) {
      fieldCheck = ccsZvalidateTextArea('rfp_security_confirmation', 'Provide the name of the incumbent supplier');
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
    else{
    if ($('#rfp_security_confirmation').val().length === 0) {

      fieldCheck = ccsZvalidateTextArea('rfp_security_confirmation', 'Provide the name of the incumbent supplier');
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }

    // else if (textPattern.test($('#rfp_security_confirmation').val())) {
    //   if (wordLength($('#rfp_security_confirmation').val())) {
    //     const msg = char ? 'Entry must be <= 250 characters' : 'Entry must be <= 25 words';
    //     fieldCheck = ccsZvalidateTextArea('rfp_security_confirmation', msg, !wordLength($('#rfp_security_confirmation').val()));
    //     if (fieldCheck !== true) errorStore.push(fieldCheck);
    //   }
    // }
    // else if (!textPattern.test($('#rfp_security_confirmation').val())) {
    //   fieldCheck = ccsZvalidateTextArea('rfp_security_confirmation', 'You must enter characters here', false);
    //   if (fieldCheck !== true) errorStore.push(fieldCheck);
    // }
  }
  if ($('#rfp_prob_statement_e') !== undefined && $('#rfp_prob_statement_e').val() !== undefined) {

    if (!pageHeading.includes("(Optional)")) {
      if ($('#rfp_prob_statement_e').val().length === 0) {
        fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_e', 'You must enter information here');
        if (fieldCheck !== true) errorStore.push(fieldCheck);
      }
    }
    if ($('#rfp_prob_statement_e').val().length > 5000) {
      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_e', 'You must enter less than 5000 characters');
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }
  if (errorStore.length === 0) document.forms['rfp_singleselect'].submit();
  else ccsZPresentErrorSummary(errorStore);
    } else {
        if (ischecked) {
            document.forms['rfp_singleselect'].submit();
        } else
            ccsZPresentErrorSummary([["There is a problem", 'You must choose one option from list before proceeding']]);

    }

});
