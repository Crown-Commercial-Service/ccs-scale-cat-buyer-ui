document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('rfp_budget_for') !== null) {
    let allInputfield = document.querySelectorAll('.govuk-input');
    var validNumber = new RegExp(/^\d+$/);
    allInputfield.forEach(element => {
      element.addEventListener('keydown', event => {
        if (event.key === '.') {
          event.preventDefault();
          return;
        }
        if (event.keyCode === 69) {
          event.preventDefault();
          return;
        }
        if (event.keyCode === 187) {
          event.preventDefault();
          return;
        }
        if (event.keyCode === 189) {
          event.preventDefault();
          return;
        }
      });
    });
  }
});
const emptyQuestionFieldCheckBudget = () => {
  let fieldCheck = '',
    errorStore = [];
  const pageHeadingVal = document.getElementById('page-heading').innerHTML;
  const pageHeading = pageHeadingVal.toLowerCase();

  var reg = new RegExp('^[0-9]$');
  if ($('#rfp_maximum_estimated_contract_value').val() != null && $('#rfp_maximum_estimated_contract_value').val() != undefined) {
    const maxBudget = $('#rfp_maximum_estimated_contract_value').val();
    const minBudget = $('#rfp_minimum_estimated_contract_value').val();
    
    
    if(maxBudget=='0'){
      errorStore.push(['rfp_maximum_estimated_contract_value', 'Value must be greater then or equal to 1']);
      ccsZPresentErrorSummary(errorStore);
      return;
    }

    if(minBudget!='' && maxBudget==''){
      errorStore.push(['rfp_maximum_estimated_contract_value', 'Please enter the Maximum']);
      ccsZPresentErrorSummary(errorStore);
      return;
    }

    if (maxBudget.includes('-')) {
      errorStore.push(['rfp_maximum_estimated_contract_value', 'You must enter a positive value']);
      ccsZPresentErrorSummary(errorStore);
      return;
    }
    if (minBudget.includes('-')) {
      errorStore.push(['rfp_maximum_estimated_contract_value', 'You must enter a positive value']);
      ccsZPresentErrorSummary(errorStore);
      return;
    }

    if (pageHeading.includes('(optional)')) {
      let msg = '';
      //if (!maxBudget) msg = 'You must enter a value';
      if (Number(maxBudget) < 0) msg = 'You must enter a positive value';
      if (Number(maxBudget) > 0 && Number(minBudget) > 0 && Number(maxBudget) < Number(minBudget)) {
        msg = 'Entry should be greater than minimum estimated contract value';
        let element = document.getElementById('rfp_maximum_estimated_contract_value');
        ccsZaddErrorMessage(element, msg);
        fieldCheck = ccsZvalidateWithRegex('rfp_maximum_estimated_contract_value', msg, /\d+/);

        errorStore.push([element.id, msg]);
      }
    }
  }

  if ($('#rfp_minimum_estimated_contract_value').val() != null && $('#rfp_minimum_estimated_contract_value').val() != undefined) {
    const maxBudget = $('#rfp_maximum_estimated_contract_value').val();
    const minBudget = $('#rfp_minimum_estimated_contract_value').val();

    if (maxBudget.includes('-')) {
      errorStore.push(['rfp_maximum_estimated_contract_value', 'You must enter a positive value']);
      ccsZPresentErrorSummary(errorStore);
      return;
    }
    }
    if (minBudget.includes('-')) {
      errorStore.push(['rfp_maximum_estimated_contract_value', 'You must enter a positive value']);
      ccsZPresentErrorSummary(errorStore);
      return;
    }
    let msg = '';

    if (pageHeading.includes('(optional)')) {
      //if (!minBudget) msg = 'You must enter a value';
      if (Number(minBudget) < 0) msg = 'You must enter a positive value';
      if (Number(minBudget) > 0 && Number(maxBudget) > 0 && Number(minBudget) > Number(maxBudget)) {
        msg = 'Entry should be lesser than maximum estimated contract value';
        let element = document.getElementById('rfp_minimum_estimated_contract_value');
        ccsZaddErrorMessage(element, msg, false);
        fieldCheck = ccsZvalidateWithRegex('rfp_minimum_estimated_contract_value', msg, /\d+/);
        errorStore.push([element.id, msg, false]);
      }
    }
  }

  if ($('#rfp_contracting_auth')) {
    if (!pageHeading.includes('(optional)')) {
      let msg = '';
      if (!$('#rfp_contracting_auth').val()) msg = 'You must enter information here';
      fieldCheck = ccsZvalidateTextArea('rfp_contracting_auth', msg);

      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }

  if ($('#rfp_prob_statement_n')) {
    if (!pageHeading.includes('(optional)')) {
      let msg = '';
      if (!$('#rfp_prob_statement_n').val()) msg = 'You must enter information here';
      if (condLength($('#rfp_prob_statement_n').val()))
        msg = char ? 'Entry must be <= 5000 characters' : 'Entry must be <= 500 words';
      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_n', msg, !condLength($('#rfp_prob_statement_n').val()));

      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }

  if ($('#rfp_prob_statement_e')) {
    if (!pageHeading.includes('(optional)')) {
      let msg = '';
      if (!$('#rfp_prob_statement_e').val()) msg = 'You must enter information here';
      if (condLength($('#rfp_prob_statement_e').val()))
        msg = char ? 'Entry must be <= 5000 characters' : 'Entry must be <= 500 words';
      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_e', msg, !condLength($('#rfp_prob_statement_e').val()));

      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }
  return errorStore;
};

const ccsZvalidateBudgetQuestions =  event  => {
  event.preventDefault();
  const errorStore = emptyQuestionFieldCheckBudget();

  if (errorStore.filter(Boolean).length === 0) document.forms['rfp_budget_for'].submit();
  else ccsZPresentErrorSummary(errorStore);
};
const removeErrorFieldsRfpBudget = () => {
  $('.govuk-error-message').remove();
  $('.govuk-form-group--error').removeClass('govuk-form-group--error');
  $('.govuk-error-summary').remove();
  $('.govuk-input').removeClass('govuk-input--error');
  $('.govuk-form-group textarea').removeClass('govuk-textarea--error');
};
$('#rfp_budget_for').on('submit', event => {
  removeErrorFieldsRfpBudget();
  event.preventDefault();
  const errorStore = emptyQuestionFieldCheckBudget();

  if (errorStore.filter(Boolean).length === 0) document.forms['rfp_budget_for'].submit();
  else ccsZPresentErrorSummary(errorStore);
  //document.forms['rfp_budget_for'].submit();
});

let evaluateSupplierForm = $('#suppliers_to_evaluate');
let initmax = document.getElementById("CurrentLotSupplierCount");
evaluateSupplierForm.on('submit', event => {
  event.preventDefault();
  errorStore = [];
  let supplierCountInput = document.getElementById('rfp_contracting_auth');
  ccsZremoveErrorMessage(supplierCountInput)
  // if(supplierCountInput.value.length > 8){
  //   ccsZaddErrorMessage(supplierCountInput, 'Supplier cannot be more than 8 digits');
  //   errorStore.push(['suppliers_to_evaluate', 'Supplier cannot be more than 8 digits']);
  //   ccsZPresentErrorSummary(errorStore);
  // }

  if (supplierCountInput.value < 3) {
    var urlParamsDefault = new URLSearchParams(window.location.search);
    var agreement_id =  urlParamsDefault.get('agreement_id');
    var criteria = urlParamsDefault.get('id');
    var group_id = urlParamsDefault.get('group_id');
    if(agreement_id == 'RM1043.8' && criteria == 'Criterion 2' && group_id == 'Group 2'){
      ccsZaddErrorMessage(supplierCountInput, 'Enter the quantity, minimum 3');
      errorStore.push(['suppliers_to_evaluate', 'Enter the quantity, minimum 3']);
    }else {
      ccsZaddErrorMessage(supplierCountInput, 'Supplier must be minimum 3');
      errorStore.push(['suppliers_to_evaluate', 'Supplier must be minimum 3']);
    }
    ccsZPresentErrorSummary(errorStore);
  } 
  
  if(parseInt(supplierCountInput.value) > parseInt(initmax.value)) {
    ccsZaddErrorMessage(supplierCountInput, `Value should not exceed current lot's suppliers (${initmax.value})`);
    errorStore.push(['suppliers_to_evaluate', `Value should not exceed current lot's suppliers (${initmax.value})`]);
    ccsZPresentErrorSummary(errorStore);
  }
  
  if(errorStore.length == 0){
    document.forms['suppliers_to_evaluate'].submit();
  }

});
