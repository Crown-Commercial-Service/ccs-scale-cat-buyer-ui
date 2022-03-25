const emptyQuestionFieldCheckBudget = () => {
  let fieldCheck = '',
    errorStore = [];

  if ($('#rfp_maximum_estimated_contract_value')) {
    const maxBudget = $('#rfp_maximum_estimated_contract_value').val();
    const minBudget = $('#rfp_minimum_estimated_contract_value').val();
    let msg = '';
    if (!maxBudget) msg = 'You must enter a value';
    if (Number(maxBudget) < 0) msg = 'You must enter a positive value';
    if (Number(maxBudget) < Number(minBudget)) {
      msg = 'Entry should be greater than minimum estimated contract value';
      ccsZaddErrorMessage('rfp_maximum_estimated_contract_value', msg);
    }
    fieldCheck = ccsZvalidateWithRegex('rfp_maximum_estimated_contract_value', msg, /\d+/);
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  }
  if ($('#rfp_minimum_estimated_contract_value')) {
    const maxBudget = $('#rfp_maximum_estimated_contract_value').val();
    const minBudget = $('#rfp_minimum_estimated_contract_value').val();
    let msg = '';
    if (!minBudget) msg = 'You must enter a value';
    if (Number(minBudget) < 0) msg = 'You must enter a positive value';
    if (Number(minBudget) > Number(maxBudget)) {
      msg = 'Entry should be lesser than maximum estimated contract value';
      ccsZaddErrorMessage('rfp_minimum_estimated_contract_value', msg);
    }
    fieldCheck = ccsZvalidateWithRegex('rfp_minimum_estimated_contract_value', msg, /\d+/);
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  }

  if ($('#rfp_contracting_auth')) {
    let msg = '';
    if (!$('#rfp_contracting_auth').val()) msg = 'You must enter information here';
    fieldCheck = ccsZvalidateTextArea('rfp_contracting_auth', msg);
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  }

  if ($('#rfp_prob_statement_n')) {
    let msg = '';
    if (!$('#rfp_prob_statement_n').val()) msg = 'You must enter information here';
    if (condLength($('#rfp_prob_statement_n').val()))
      msg = char ? 'Entry must be <= 5000 characters' : 'Entry must be <= 500 words';
    fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_n', msg, !condLength($('#rfp_prob_statement_n').val()));
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  }

  if ($('#rfp_prob_statement_e')) {
    let msg = '';
    if (!$('#rfp_prob_statement_e').val()) msg = 'You must enter information here';
    if (condLength($('#rfp_prob_statement_e').val()))
      msg = char ? 'Entry must be <= 5000 characters' : 'Entry must be <= 500 words';
    fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_e', msg, !condLength($('#rfp_prob_statement_e').val()));
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  }
  return errorStore;
};

const ccsZvalidateBudgetQuestions = event => {
  event.preventDefault();
  const errorStore = emptyQuestionFieldCheckBudget();
  if (errorStore.filter(Boolean).length === 0) document.forms['rfp_budget_for'].submit();
  else ccsZPresentErrorSummary(errorStore);
};
