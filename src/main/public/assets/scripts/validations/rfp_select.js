let rfp_security_confirmation = null;

document.addEventListener('DOMContentLoaded', () => {  
  if (document.getElementById('rfp_singleselect_Dos')) {
    document.getElementById('rfp_singleselect_Dos').onsubmit = function (event) {
      event.preventDefault();
      removeErrorFieldsRfpSelect();
      let { fieldCheck, errorStore } = initializeErrorStoreForFieldCheck(event);
      if (document.getElementsByName('ccs_vetting_type')) {
        fieldCheck = [];
        var ccs_vetting_type = document.getElementsByName('ccs_vetting_type');
        if (ccs_vetting_type.length > 0) {
          if (ccs_vetting_type[0].checked == true) { 
            let inputArray = $('input[name=rfp_prob_statement_m]');
            let minBudget = Number(inputArray[1].value);
            let maxBudget = Number(inputArray[0].value); 
            let msg = '';
            if ((maxBudget == '') || (maxBudget == 0)) {
              msg = 'Enter an indicative maximum';
            } else if (maxBudget > 0 && (maxBudget < minBudget) || (maxBudget == minBudget)) {
              msg = 'Indicative minimum budget must be less than indicative maximum budget';
            } 
           errorStore = [];
           if(msg != '') {
            if(msg == 'Indicative minimum budget must be less than indicative maximum budget'){
              errorStore.push(['rfp_prob_statement_min', msg]);
            }else{
              errorStore.push(['rfp_prob_statement_max', msg]);
            }          
          }
            if (errorStore.length === 0) {
              document.forms['rfp_singleselect_Dos'].submit();
            } else {
              let element = document.getElementById('rfp_prob_statement_max');
              if(msg == 'Indicative minimum budget must be less than indicative maximum budget'){
                element = document.getElementById('rfp_prob_statement_min');
              }
              ccsZaddErrorMessage(element, msg);
              ccsZPresentErrorSummary(errorStore);
            }
          }else if (ccs_vetting_type[1].checked == true) {
            let inputArray = $('input[name=rfp_prob_statement_m]');
            inputArray[0].value = "";
            inputArray[1].value = "";
            if (errorStore.length === 0) {
              document.forms['rfp_singleselect_Dos'].submit();
            }
          }
           else if (!(ccs_vetting_type[0].checked || ccs_vetting_type[1].checked)) {
            var headerText = document.getElementById('page-heading').innerHTML;
            var msg = 'You must choose one option from list before proceeding';
            if(headerText.includes('Set your budget')){
              msg = 'Select “Yes” if you are prepared to share budget details, or select “No”.'
            } else if(headerText.includes('Confirm if you require a contracted out service or supply of resource')) {
              msg = 'Select whether you need a contracted out service or a supply of resource'
            }
            fieldCheck = ccsZisOptionChecked(
              'ccs_vetting_type',
              msg,
            );
            if (fieldCheck !== true) errorStore.push(fieldCheck);
            if (errorStore.length === 0) document.forms[''].submit();
            else ccsZPresentErrorSummary(errorStore);
          } else if (errorStore.length === 0) {
            document.forms['rfp_singleselect_Dos'].submit();
          }
        }
      }
    };
  }

  if (document.getElementById('rfp_singleselect_Dos') !== null) {
    if (document.querySelector('#ccs_vetting_type') !== null) {
      if (document.querySelector('#ccs_vetting_type').checked) {
        $('.main_rfp_prob_statement_m').fadeIn();
        // $('.main_rfp_indicative_maximum').fadeIn();
        // $('.main_rfp_indicative_minimum').fadeIn();
      } else {
        $('.main_rfp_prob_statement_m').hide();
        // $('.main_rfp_indicative_maximum').hide();
        // $('.main_rfp_indicative_minimum').hide();
      }
    }
  }

  if (document.getElementById('rfp_singleselect') !== null) {
    if (
      document.getElementById('rfp_security_confirmation') !== undefined &&
      document.getElementById('rfp_security_confirmation') !== null &&
      document.getElementById('rfp_security_confirmation').value != ''
    ) {
      $('#conditional-rfp_radio_security_confirmation').fadeIn();
    } else {
      $('#conditional-rfp_radio_security_confirmation').hide();
    }
  }

  $('input[type="checkbox"]:checked').each(function () {
    if (this.value == 'other') {
      $('.otherTextArea').removeClass('ccs-dynaform-hidden');
      $('.otherTextAreaMsg').removeClass('ccs-dynaform-hidden');
    }
  });
  $('input[type="checkbox"]:not(:checked)').each(function () {
    if (this.value == 'other') {
      $('.otherTextAreaMsg').addClass('ccs-dynaform-hidden');
      $('.otherTextArea').addClass('ccs-dynaform-hidden');
      $('.otherTextArea').html('');
    }
  });
  $('input[type="checkbox"]').on('click', function (e) {
    $('input[type="checkbox"]:checked').each(function () {
      if (this.value == 'other') {
        $('.otherTextArea').removeClass('ccs-dynaform-hidden');
        $('.otherTextAreaMsg').removeClass('ccs-dynaform-hidden');
      }
    });
    $('input[type="checkbox"]:not(:checked)').each(function () {
      if (this.value == 'other') {
        $('.otherTextAreaMsg').addClass('ccs-dynaform-hidden');
        $('.otherTextArea').addClass('ccs-dynaform-hidden');
        $('.otherTextArea').html('');
      }
    });
  });

  $('.otherTextArea').on('keypress', function () {
    var aInput = this.value;
    if (aInput.length > 500) {
      return false;
    }
    return true;
  });
});

$('input[type="radio"]').on('change', function (e) {
  if (e.currentTarget.value == 'Yes') {
    $('.main_rfp_prob_statement_m').fadeIn();
    $('.main_rfp_indicative_maximum').fadeIn();
    $('.main_rfp_indicative_minimum').fadeIn();
  } else {
    $('.main_rfp_prob_statement_m').hide();
    $('.main_rfp_indicative_maximum').hide();
    $('.main_rfp_indicative_minimum').hide();
  }
});
let rfp_vetting = document.querySelectorAll('.rpf_500');
let rfp_term_percentage = document.querySelectorAll('.rfp_term_percentage');
let ccs_vetting = document.querySelectorAll('.ccs_vetting');
let rfp_term_definition_new = document.querySelectorAll('.rfp_term_definition_new');
rfp_vetting.forEach(ele => {
  ele.addEventListener('keydown', (event) => {
    removeErrorFieldsRfpSelect();
  });
});
rfp_term_percentage.forEach(ele => {
  ele.addEventListener('keydown', (event) => {
    removeErrorFieldsRfpSelect();
  });
});
rfp_term_definition_new.forEach(ele => {
  ele.addEventListener('keydown', (event) => {
    removeErrorFieldsRfpSelect();
  });
});
ccs_vetting.forEach(ele => {
  ele.addEventListener('click', (event) => {
    removeErrorFieldsRfpSelect();
  });
});
// $("#rfp_security_confirmation").keypress(function(e) {
//   var keycode =e.which;

//   if ((keycode != 8) && (keycode < 48 || keycode > 57)) {
//       return false;
//   }

// });
$('input[type="radio"]').on('change', function (e) {
  if (e.currentTarget.value === 'Yes') {
    if (
      rfp_security_confirmation != null &&
      rfp_security_confirmation != '' &&
      document.getElementById('rfp_security_confirmation') != undefined
    )
      document.getElementById('rfp_security_confirmation').value = rfp_security_confirmation;
    $('#conditional-rfp_radio_security_confirmation').fadeIn();
  } else {
    if (document.getElementById('rfp_security_confirmation') != undefined) {
      rfp_security_confirmation = document.getElementById('rfp_security_confirmation').value;
      document.getElementById('rfp_security_confirmation').value = '';
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
$('#rfp_singleselect').on('submit', event => {
  event.preventDefault();
  if(document.getElementById('agreementID').value == 'RM1557.13' && document.getElementById('gID').value === 'Group 8' && document.getElementById('lID').value === '4') {
    document.forms['rfp_singleselect'].submit();
  }else{
  removeErrorFieldsRfpSelect();
  var urlParams = new URLSearchParams(window.location.search);
  var agreement_id = urlParams.get("agreement_id");
  var group_id = urlParams.get("group_id");
  var criterion = urlParams.get("id");
  const textPattern = /^[a-zA-Z ]+$/;
  var listofRadionButton = document.querySelectorAll('.govuk-radios__input');
  let ischecked = false;
  var headerText = document.getElementById('page-heading').innerHTML;
  listofRadionButton.forEach(element => {
    if (element.type === 'radio' && element.checked) {
      ischecked = true;
    }
  });

  if (headerText.includes('existing supplier') && ischecked) {
    var ccs_vetting_type = document.getElementById('ccs_vetting_type').checked;

    var rfp_security_confirmation = document.getElementById('rfp_security_confirmation');
    if (ccs_vetting_type && rfp_security_confirmation.value === '' && Number(rfp_security_confirmation.value)) {
      ccsZaddErrorMessage(rfp_security_confirmation, 'You must add information in field.');
      ccsZPresentErrorSummary([
        ['rfp_security_confirmationrfp_security_confirmation', 'You must add information in field.'],
      ]);
    } else if (
      ccs_vetting_type &&
      rfp_security_confirmation.value !== undefined &&
      rfp_security_confirmation.value !== null &&
      rfp_security_confirmation.value !== '' &&
      !textPattern.test(rfp_security_confirmation.value) &&
      Number(rfp_security_confirmation.value)
    ) {
      ccsZaddErrorMessage(rfp_security_confirmation, 'Please enter only character.');
      ccsZPresentErrorSummary([['rfp_security_confirmation', 'Please enter only character.']]);
    } else if (ccs_vetting_type == true && $('#rfp_security_confirmation').val().length === 0) {
      ccsZaddErrorMessage(rfp_security_confirmation, 'Provide the name of the incumbent supplier.');
    } else {
      document.forms['rfp_singleselect'].submit();
    }
  } else {
    if (ischecked) {
      document.forms['rfp_singleselect'].submit();
    } else {
      var ccs_vetting_type = document.getElementById('ccs_vetting_type');
      if(headerText.trim().toLowerCase() == 'Which phase the project is in'.toLowerCase()){
        ccsZPresentErrorSummary([['ccs_vetting_type', 'Select a project phase']]);
      }else if(headerText.trim().toLowerCase() == 'Confirm if you require a contracted out service or supply of resource'.toLowerCase()){
        ccsZPresentErrorSummary([['There is a problem', 'Select whether you need a contracted out service or a supply of resource']]);
      }else{
        ccsZPresentErrorSummary([['ccs_vetting_type', 'You must choose one option from list before proceeding']]);
      }
    }
    if (ccs_vetting_type) {
      if(headerText.trim().toLowerCase() == 'Which phase the project is in'.toLowerCase()){
        ccsZaddErrorMessage(ccs_vetting_type, 'Select one project phase');
      }else if(headerText.trim().toLowerCase() == 'Confirm if you require a contracted out service or supply of resource'.toLowerCase()){
        ccsZaddErrorMessage(ccs_vetting_type, 'Select whether you need a contracted out service or a supply of resource');
      }else{
        ccsZaddErrorMessage(ccs_vetting_type, 'Choose one option before proceeding');
      }

    }
  }
}
});

$('#rfp_security_confirmation').on('input', function() {
  $(this).val($(this).val().replace(/[^a-z0-9]/gi, ''));
});