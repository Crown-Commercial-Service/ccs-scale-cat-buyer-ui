let errorStore = [];
let words='';
let char='';
const condLength = (text) => {
 words= text.trim().split(/\s+/).length > 500;
 char= text.trim().length > 5000;
  if (words) return words;
  return char;
}
 const ccsZvalidateRfpChangeStrategy = event =>{
  event.preventDefault();

 }

const ccsZvalidateRfPStrategy = event => {
  event.preventDefault();
  let fieldCheck = '';
  if ($('#rfp_prob_statement_t').length) {
    errorStore = [];
    if (condLength($('#rfp_prob_statement_t').val())) {
      const msg = char ? 'Entry must be <= 5000': 'Entry must be <= 500 words';
      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_t', msg, !condLength($('#rfp_prob_statement_t').val()));
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }

  if ($('#rfp_prob_statement_s').length) {
    errorStore = [];
    if (condLength($('#rfp_prob_statement_s').val())) {
      const msg = char ? 'Entry must be <= 5000': 'Entry must be <= 500 words';
      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_s', msg, !condLength($('#rfp_prob_statement_s').val()));
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }

  if ($('#rfp_prob_statement_t') !== undefined && $('#rfp_prob_statement_t').val() !== undefined) {
    if ($('#rfp_prob_statement_t').val().length === 0) {
      errorStore = [];
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

const ccsZOnChange = event => {
  event.preventDefault();
  let id = event.path[0].id;
  let fieldCheck = ccsZvalidateTextArea(id, 'You must enter information here');
  if (fieldCheck !== true) errorStore.push(fieldCheck);
};
