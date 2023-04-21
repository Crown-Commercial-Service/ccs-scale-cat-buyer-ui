var errorStore = [];
let words = '';
let char = '';
const textPattern = /^[a-zA-Z ]+$/;
const condLength = (text) => {
  char = text.trim().length > 10000;

  return char;
}

const wordLength = (text) => {
  words = text.trim().split(/\s+/).length > 25;
  char = text.trim().length > 250;
  if (words) return words;
  return char;
}

const ccsZvalidateRfpChangeStrategy = event => {
  event.preventDefault();

}
const removeErrorFieldsRfpStar = () => {
  $('.govuk-error-message').remove();
  $('.govuk-form-group--error').removeClass('govuk-form-group--error')
  $('.govuk-error-summary').remove();
  $(".govuk-input").removeClass("govuk-input--error");
  $('.govuk-form-group textarea').removeClass('govuk-textarea--error');

}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById("ccs_rfp_exit_strategy_form") !== null || document.getElementById("ccs_eoi_vetting_form") !== null) {
    if (document.getElementById("rfp_security_confirmation") !== undefined && document.getElementById("rfp_security_confirmation") !== null && document.getElementById("rfp_security_confirmation").value != '') {
      $('#conditional-rfp_radio_security_confirmation').fadeIn();
    } else {
      $('#conditional-rfp_radio_security_confirmation').hide();
    }
  }
})

const ccsZvalidateRfPStrategy = event => {
  event.preventDefault();
  let fieldCheck = '';
  errorStore.length = 0;
  const pageHeading = document.getElementById('page-heading').innerHTML;
  var urlParams = new URLSearchParams(window.location.search);
  var agreement_id = urlParams.get("agreement_id");
  var group_id = urlParams.get("group_id");
  var criterion = urlParams.get('id'); 

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
    if (!(pageHeading.includes("(Optional)") || pageHeading.includes("(optional)"))) {
      if ($('#rfp_prob_statement_t').val().length === 0) {
        fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_t', 'You must enter information here');
        if (fieldCheck !== true) errorStore.push(fieldCheck);
      }
    }
    if (condLength($('#rfp_prob_statement_t').val())) {
      const msg = char ? 'Entry must be <= 10000 characters' : 'Entry must be <= 500 words';
      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_t', msg, !condLength($('#rfp_prob_statement_t').val()));
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }

  if ($('#rfp_prob_statement_m') !== undefined && $('#rfp_prob_statement_m').val() !== undefined) {
    if (!pageHeading.includes("(Optional)")) {
      if ($('#rfp_prob_statement_m').val().length === 0) {
        if(agreement_id == "RM1043.8" && group_id == "Group 13"){
          fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_m', 'Enter the details of your existing team');
        }
        else{
        fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_m', 'You must enter information here');
        }
        if (fieldCheck !== true) errorStore.push(fieldCheck);
      }
    }
    if (condLength($('#rfp_prob_statement_m').val())) {
      const msg = char ? 'Entry must be <= 5000 characters' : 'Entry must be <= 500 words';
      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_m', msg, !condLength($('#rfp_prob_statement_m').val()));
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }

  if ($('#rfp_prob_statement_n') !== undefined && $('#rfp_prob_statement_n').val() !== undefined) {
      if (!(pageHeading.includes("(Optional)") || pageHeading.includes("(optional)"))) {
        if ($('#rfp_prob_statement_n').val().length === 0) {
 
          if(agreement_id == "RM1043.8" && criterion == "Criterion 3" && group_id == "Group 10"){
          fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_n', 'Enter the number of rounds');
          }
          else  if(agreement_id == "RM1043.8" && criterion == "Criterion 3" && group_id == "Group 12"){
            fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_n', 'Enter the research location');
          }
          else{
            fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_n', 'You must enter information here');
          }
          if (fieldCheck !== true) errorStore.push(fieldCheck);
        }
      }
      if (condLength($('#rfp_prob_statement_n').val())) {
        const msg = char ? 'Entry must be <= 5000 characters' : 'Entry must be <= 500 words';
        fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_n', msg, !condLength($('#rfp_prob_statement_n').val()));
        if (fieldCheck !== true) errorStore.push(fieldCheck);
      }
    } 
  
  if ($('#rfp_prob_statement_g') !== undefined && $('#rfp_prob_statement_g').val() !== undefined) {
      if (!pageHeading.includes("(Optional)")) {
        if ($('#rfp_prob_statement_g').val().length === 0) {
          if(pageHeading.trim().toLowerCase() == 'The business problem you need to solve'.toLowerCase()){
            fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_g', 'Enter the business problem you need to solve');
          }else{
            fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_g', 'You must enter information here');
          }
          if (fieldCheck !== true) errorStore.push(fieldCheck);
        }
      }
      if (condLength($('#rfp_prob_statement_g').val())) {
        const msg = char ? 'Entry must be <= 5000 characters' : 'Entry must be <= 500 words';
        fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_g', msg, !condLength($('#rfp_prob_statement_g').val()));
        if (fieldCheck !== true) errorStore.push(fieldCheck);
      }
    } 
    
  if ($('#rfp_prob_statement_s') !== undefined && $('#rfp_prob_statement_s').val() !== undefined) {

    if (condLength($('#rfp_prob_statement_s').val())) {
      const msg = char ? 'Entry must be <= 10000 characters' : 'Entry must be <= 500 words';
      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_s', msg, !condLength($('#rfp_prob_statement_s').val()));
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }

  if ($('#rfp_prob_statement_d') !== undefined && $('#rfp_prob_statement_d').val() !== undefined) {
      if (!pageHeading.includes("(Optional)")) {
        if ($('#rfp_prob_statement_d').val().length === 0) {
          if(pageHeading.trim().toLowerCase() == 'Add background to your project'.toLowerCase()){
          fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_d', 'Add background information about your procurement');
          }else{
            fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_d', 'You must add background information about your procurement');
          }
          if (fieldCheck !== true) errorStore.push(fieldCheck);
        }
      }
      if ($('#rfp_prob_statement_d').val().length > 500) {
        fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_d', 'You must enter less than 500 characters');
        if (fieldCheck !== true) errorStore.push(fieldCheck);
      }
  }
 
  if ($('#rfp_prob_statement_s') !== undefined && $('#rfp_prob_statement_s').val() !== undefined && (!(pageHeading.includes("(optional)")  || pageHeading.includes("(Optional)"))) && agreement_id !== "RM6187") {
    if ($('#rfp_prob_statement_s').val().length === 0 && pageHeading.includes("Number of research rounds")) {
      if(agreement_id == "RM1043.8"){
         fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_s', 'Enter details about the number of research rounds');
      }
      else{
        fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_s', 'Enter the number of research round');
      }
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
    else if ($('#rfp_prob_statement_s').val().length === 0 && pageHeading.includes("Number of participants per round")) {

      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_s', 'Enter the number of participants per round');
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
    else if ($('#rfp_prob_statement_s').val().length === 0 && pageHeading.includes("Research dates")) {

      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_s', 'Enter research dates');
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
    else if ($('#rfp_prob_statement_s').val().length === 0 && pageHeading.includes("Description of your participants")) {
      if(agreement_id == "RM1043.8"){
      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_s', 'Enter a description of your participants');
      }
      else{
        fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_s', 'Enter description of your participants');
      }
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
    else if ($('#rfp_prob_statement_s').val().length === 0 && pageHeading.includes("Add background to your project")) {

      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_s', 'Add the social value, economic and environmental benefits of your procurement');
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }else if ($('#rfp_prob_statement_s').val().length === 0 && pageHeading.includes("Management information and reporting")) {

      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_s', 'Enter your reporting requirements');
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
    else {
      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_s', 'Enter details of your working arrangements');
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }

  if ($('#rfp_prob_statement_s') !== undefined && $('#rfp_prob_statement_s').val() !== undefined && !pageHeading.includes("(Optional)") && pageHeading.includes('Management information and reporting') && agreement_id === "RM6187") {
    if ($('#rfp_prob_statement_s').val().length === 0) {

      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_s', 'Enter management information and reporting requirements');
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }

  if ($('#rfp_prob_statement_s') !== undefined && $('#rfp_prob_statement_s').val() !== undefined && !pageHeading.includes("(Optional)") &&!pageHeading.includes('Management information and reporting')&& agreement_id === "RM6187") {
    if ($('#rfp_prob_statement_s').val().length === 0) {

      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_s', 'You must enter the social value, economic and environmental benefits');
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
    if ($('#rfp_prob_statement_r').val().length > 10000 ) {

      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_r', 'You must enter less than 10000 characters',false);
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }
  
  if ($('#rfp_security_confirmation') !== undefined && $('#rfp_security_confirmation').val() !== undefined && $("input[name='ccs_vetting_type']").prop('checked')) {
    // errorStore.length = 0;
    
    if ($('#rfp_security_confirmation').val().length === 0) {
      fieldCheck = ccsZvalidateTextArea('rfp_security_confirmation', 'Provide the name of the incumbent supplier');
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
    else if ($('#rfp_security_confirmation').val().length > 500) {
      fieldCheck = ccsZvalidateTextArea('rfp_security_confirmation', 'supplier name must be less than 500 characters');
      if (fieldCheck !== true) errorStore.push(fieldCheck);
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
    
    if (!pageHeading.includes("(optional)") && !pageHeading.includes("(Optional)") && agreement_id !== "RM6187") {
      if ($('#rfp_prob_statement_e').val().length === 0) {
        if(pageHeading.trim().toLowerCase() == 'Why the work is being done'.toLowerCase()){
          fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_e', 'Enter the reason for doing the work ');
        }else if(pageHeading.trim().toLowerCase() == 'Address where the work will be done'.toLowerCase()){
          fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_e', 'Enter the address where the work will be done');
        }else if(pageHeading.trim().toLowerCase() == 'The business need'.toLowerCase()){
          fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_e', 'Add details about your business need')
        }else{
          fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_e', 'You must enter information here');
        }
        if (fieldCheck !== true) errorStore.push(fieldCheck);
      }
    }

    if (!pageHeading.includes("(optional)") && !pageHeading.includes("(Optional)")  && agreement_id === "RM6187") {
      if (!pageHeading.includes('Management information and reporting') && !pageHeading.includes('The business need')){
        if ($('#rfp_prob_statement_e').val().length === 0) {
          fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_e', 'You must add background information about your procurement');
          if (fieldCheck !== true) errorStore.push(fieldCheck);
        }
      }
      else if(!pageHeading.includes('The business need') && !pageHeading.includes('Add background to your procurement')){
        if ($('#rfp_prob_statement_e').val().length === 0) {
          fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_e', 'Enter management information and reporting requirements');
          if (fieldCheck !== true) errorStore.push(fieldCheck);
        }
      }
      else if(!pageHeading.includes('Management information and reporting') && !pageHeading.includes('Add background to your procurement')){
        if ($('#rfp_prob_statement_e').val().length === 0) {
          fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_e', 'Add details about your business need');
          if (fieldCheck !== true) errorStore.push(fieldCheck);
        }
      }
      
    }
    

    if ($('#rfp_prob_statement_e').val().length > 10000) {
      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_e','You must enter less than 10000 characters',false);
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }

  if (!pageHeading.includes("(Optional)") && agreement_id != "RM1043.8" && group_id != "Group 207" && agreement_id != "RM6187" && agreement_id != "RM1557.13") {
    if ($('#rfp_prob_statement_s') !== undefined && $('#rfp_prob_statement_s').val() !== undefined) {
      if ($('#rfp_prob_statement_s').val().length === 0) {
      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_s', 'You must enter information here');
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
    }
  }
  
  


  if (errorStore.length === 0){
  document.forms['ccs_rfp_exit_strategy_form'].submit();
  
  }else{
    ccsZPresentErrorSummary(errorStore);
    
  } 
};

const ccsZOnChange = event => {
  removeErrorFieldsRfpStar();
  event.preventDefault();
  let id = event.path[0].id;
  //let fieldCheck = ccsZvalidateTextArea(id, 'You must enter information here');
  //if (fieldCheck !== true) errorStore.push(fieldCheck);
};
