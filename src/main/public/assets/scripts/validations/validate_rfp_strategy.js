const ccsZvalidateRfPStrategy = event => {
  event.preventDefault();
  let fieldCheck = '',
    errorStore = [];
  if ($('#rfp_prob_statement_t')) {
    if ($('#rfp_prob_statement_t').data('mandatory') == true) {
      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_t', 'You must enter information here');
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }

  if ($('#rfp_prob_statement_s') !== undefined && $('#rfp_prob_statement_s').val() !== undefined) {
    if ($('#rfp_prob_statement_s').val().length === 0) {
      errorStore = [];
      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_s', 'You must enter information here');
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }

  if ($('#rfp_prob_statement_d') !== undefined && $('#rfp_prob_statement_d').val() !== undefined) {
    if ($('#rfp_prob_statement_d').val().length > 500) {
      errorStore = [];
      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_d', 'You must enter less than 500 characters');
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }

  if ($('#rfp_prob_statement_d') !== undefined && $('#rfp_prob_statement_d').val() !== undefined) {
    if ($('#rfp_prob_statement_d').val().length === 0) {
      errorStore = [];
      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_d', 'You must enter information here');
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }

  if ($('#rfp_prob_statement_r') !== undefined && $('#rfp_prob_statement_r').val() !== undefined) {
    if ($('#rfp_prob_statement_r').val().length > 500) {
      errorStore = [];
      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_r', 'You must enter less than 500 characters');
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }

  if ($('#rfp_prob_statement_r') !== undefined && $('#rfp_prob_statement_r').val() !== undefined) {
    if ($('#rfp_prob_statement_r').val().length === 0) {
      errorStore = [];
      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_r', 'You must enter information here');
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }

  if (errorStore.length === 0) document.forms['ccs_rfp_exit_strategy_form'].submit();
  else ccsZPresentErrorSummary(errorStore);
};
