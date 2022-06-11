document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('rfp_budget_for') !== null) {
    let allInputfield = document.querySelectorAll(".govuk-input");
    allInputfield.forEach(element => {
      element.addEventListener(event => {
        var isDecimal = event.value.includes(".");
        if (event.keyCode == 69) { event.preventDefault(); }
      })
    })
  }
})
const emptyQuestionFieldCheckBudget = () => {
  let fieldCheck = '',
    errorStore = [];
  const pageHeading = document.getElementById('page-heading').innerHTML;
  var reg = new RegExp('^[0-9]$');
  if ($('#rfp_maximum_estimated_contract_value') != null && $('#rfp_maximum_estimated_contract_value') != undefined) {
    const maxBudget = $('#rfp_maximum_estimated_contract_value').val();
    const minBudget = $('#rfp_maximum_estimated_contract_value').val();
    if (maxBudget.includes("-")) {
      errorStore.push(["rfp_maximum_estimated_contract_value", "You must enter a positive value"]);
      ccsZPresentErrorSummary(errorStore)
      return;
    }
    if (minBudget.includes("-")) {
      errorStore.push(["rfp_maximum_estimated_contract_value", "You must enter a positive value"]);
      ccsZPresentErrorSummary(errorStore)
      return;
    }

    if (pageHeading.includes("(Optional)")) {
      let msg = '';
      //if (!maxBudget) msg = 'You must enter a value';
      if (Number(maxBudget) < 0) msg = 'You must enter a positive value';
      if (Number(maxBudget) > 0 && Number(minBudget) > 0 && Number(maxBudget) < Number(minBudget)) {
        msg = 'Entry should be greater than minimum estimated contract value';
        let element = document.getElementById("rfp_maximum_estimated_contract_value");
        ccsZaddErrorMessage(element, msg);
        fieldCheck = ccsZvalidateWithRegex('rfp_maximum_estimated_contract_value', msg, /\d+/);
        errorStore.push([element.id, msg])
      }
    }
  }
  if ($('#rfp_minimum_estimated_contract_value') != null && $('#rfp_minimum_estimated_contract_value') != undefined) {
    const maxBudget = $('#rfp_maximum_estimated_contract_value').val();
    const minBudget = $('#rfp_minimum_estimated_contract_value').val();
    if (maxBudget.includes("-")) {
      errorStore.push(["rfp_maximum_estimated_contract_value", "You must enter a positive value"]);
      ccsZPresentErrorSummary(errorStore)
      return;
    }
    if (minBudget.includes("-")) {
      errorStore.push(["rfp_maximum_estimated_contract_value", "You must enter a positive value"]);
      ccsZPresentErrorSummary(errorStore)
      return;
    }
    let msg = '';
    if (pageHeading.includes("(Optional)")) {
      //if (!minBudget) msg = 'You must enter a value';
      if (Number(minBudget) < 0) msg = 'You must enter a positive value';
      if (Number(minBudget) > 0 && Number(maxBudget) > 0 && Number(minBudget) > Number(maxBudget)) {
        msg = 'Entry should be lesser than maximum estimated contract value';
        let element = document.getElementById("rfp_minimum_estimated_contract_value");
        ccsZaddErrorMessage(element, msg);
        fieldCheck = ccsZvalidateWithRegex('rfp_minimum_estimated_contract_value', msg, /\d+/);
        errorStore.push([element.id, msg])
      }
    }

  }

  if ($('#rfp_contracting_auth')) {
    if (!pageHeading.includes("(Optional)")) {
      let msg = '';
      if (!$('#rfp_contracting_auth').val()) msg = 'You must enter information here';
      fieldCheck = ccsZvalidateTextArea('rfp_contracting_auth', msg);
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }

  if ($('#rfp_prob_statement_n')) {
    if (!pageHeading.includes("(Optional)")) {
      let msg = '';
      if (!$('#rfp_prob_statement_n').val()) msg = 'You must enter information here';
      if (condLength($('#rfp_prob_statement_n').val()))
        msg = char ? 'Entry must be <= 5000 characters' : 'Entry must be <= 500 words';
      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_n', msg, !condLength($('#rfp_prob_statement_n').val()));
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }

  if ($('#rfp_prob_statement_e')) {
    if (!pageHeading.includes("(Optional)")) {
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

const ccsZvalidateBudgetQuestions = event => {
  event.preventDefault();
  const errorStore = emptyQuestionFieldCheckBudget();
  if (errorStore.filter(Boolean).length === 0) document.forms['rfp_budget_for'].submit();
  else ccsZPresentErrorSummary(errorStore);
};
const removeErrorFieldsRfpBudget = () => {
  $('.govuk-error-message').remove();
  $('.govuk-form-group--error').removeClass('govuk-form-group--error')
  $('.govuk-error-summary').remove();
  $(".govuk-input").removeClass("govuk-input--error");
  $('.govuk-form-group textarea').removeClass('govuk-textarea--error');

}
$('#rfp_budget_for').on('submit', (event) => {
  removeErrorFieldsRfpBudget();
  event.preventDefault();
  const errorStore = emptyQuestionFieldCheckBudget();
  if (errorStore.filter(Boolean).length === 0) document.forms['rfp_budget_for'].submit();
  else ccsZPresentErrorSummary(errorStore);

})

