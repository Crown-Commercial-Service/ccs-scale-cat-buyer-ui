const countWords = (str) => { return str.trim().split(/\s+/).length };
document.addEventListener('DOMContentLoaded', () => {

  if (document.getElementById("service_user_type_form") !== null) {

    let with_value_count = 10,
      prev_input = 0,
      deleteButtons = document.querySelectorAll("a.del");
    let clearFieldsButtons = document.querySelectorAll("a.clear-fields");

    for (var acronym_fieldset = 10; acronym_fieldset > 1; acronym_fieldset--) {


      let this_fieldset = document.querySelector(".acronym_service_" + acronym_fieldset),
        term_box = document.getElementById("rfp_term_service_group_" + acronym_fieldset);

      if (term_box !=undefined && term_box !=null && term_box.value !== "") {
        this_fieldset.classList.remove('ccs-dynaform-hidden');

        if (acronym_fieldset === 10) {
          document.getElementById("ccs_rfpTerm_add").classList.add('ccs-dynaform-hidden');
        }

      } else {

        this_fieldset.classList.add('ccs-dynaform-hidden');
        with_value_count = acronym_fieldset;
      }
    }
    document.getElementById("ccs_rfpService_use_type_add").classList.remove("ccs-dynaform-hidden");


    document.getElementById("ccs_rfpService_use_type_add").addEventListener('click', (e) => {
      $('.govuk-form-group textarea').removeClass('govuk-textarea--error');
      //checkFieldsRfp();

      e.preventDefault();
      document.querySelector(".acronym_service_" + with_value_count).classList.remove("ccs-dynaform-hidden");

      if (with_value_count > 2) {
        prev_input = with_value_count - 1;
        document.querySelector(".acronym_service_" + prev_input + " a.del").classList.add("ccs-dynaform-hidden");
      }

      with_value_count++;

      if (with_value_count === 11) {
        document.getElementById("ccs_rfpService_use_type_add").classList.add('ccs-dynaform-hidden');
      }
    });

    // delete buttons
    deleteButtons.forEach((db) => {
      db.classList.remove('ccs-dynaform-hidden')
      db.addEventListener('click', (e) => {
        e.preventDefault();

        let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
          prev_coll = Number(target) - 1,
          target_fieldset = db.closest("fieldset");

        target_fieldset.classList.add("ccs-dynaform-hidden");

        document.getElementById('rfp_term_service_group_' + target).value = "";
        document.getElementById('rfp_term_more_details_' + target).value = "";


        if (prev_coll > 1) {
          document.querySelector('.acronym_service_' + prev_coll + ' a.del').classList.remove("ccs-dynaform-hidden");
        }

        document.getElementById("ccs_rfpService_use_type_add").classList.remove('ccs-dynaform-hidden');
        with_value_count--;
      });
    });
    clearFieldsButtons.forEach((db) => {
      db.addEventListener('click', (e) => {

        e.preventDefault();

        let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
          target_fieldset = db.closest("fieldset");

        target_fieldset.classList.add("ccs-dynaform");

        document.getElementById('rfp_term_service_group_' + target).value = "";
        document.getElementById('rfp_term_more_details_' + target).value = "";
        // removeErrorFieldsRfp();
      });

    });



  }
});

const checkFieldsRfp = () => {
  const start = 1;
  const end = 10;
  const pageHeading = document.getElementById('page-heading').innerHTML;
  for (var a = start; a <= end; a++) {
    let input = $(`#rfp_term_${a}`)
    let textbox = $(`#rfp_term_definition_${a}`);

    if (!pageHeading.includes("(Optional)")) {
      const field1 = countWords(input.val()) < 50;
      const field2 = countWords(textbox.val()) < 150;
      if (input.val() !== "" || field1) {

        $(`#rfp_term_${a}-error`).remove();
        $(`.acronym_${a} div`).removeClass('govuk-form-group--error');
        $(`.acronym_${a} input`).removeClass('govuk-input--error')

      }


      if (textbox.val() !== "" || field2) {

        $(`#rfp_term_definition_${a}-error`).remove();
        $(`.acronym_${a} div`).removeClass('govuk-form-group--error');
        $(`.acronym_${a} textarea`).removeClass('govuk-input--error');
        $(`.acronym_${a} textarea`).removeClass('govuk-textarea--error')
      }
    }

  }
}
const removeErrorFieldsRfp = () => {
  $('.govuk-error-message').remove();
  $('.govuk-form-group--error').removeClass('govuk-form-group--error')
  $('.govuk-error-summary').remove();
  $(".govuk-input").removeClass("govuk-input--error");
  $('.govuk-form-group textarea').removeClass('govuk-textarea--error');

}

const emptyFieldCheckRfp = () => {
  let fieldCheck = "",
    errorStore = [];
  const pageHeading = document.getElementById('page-heading').innerHTML;
  for (var x = 1; x < 11; x++) {
    let term_field = document.getElementById('rfp_term_' + x);
    let definition_field = document.getElementById("rfp_term_definition_" + x);
    let target_field = document.getElementById("rfp_term_target_" + x);

    if (term_field.value !== undefined && definition_field !== undefined) {
      const field1 = countWords(term_field.value) > 50;
      const field2 = countWords(definition_field.value) > 150;

      if (term_field.closest("fieldset").classList.value.indexOf("ccs-dynaform-hidden") === -1) {
        checkFieldsRfp();
        if (!pageHeading.includes("(Optional)")) {
          if (term_field.value.trim() === '' && definition_field.value.trim() === '') {
            fieldCheck = [definition_field.id, 'You must add information in all fields.'];
            ccsZaddErrorMessage(term_field, 'You must add information in all fields.');
            ccsZaddErrorMessage(definition_field, 'You must add information in all fields.');
            if (target_field !== undefined && target_field !== null && target_field.value.trim() === '')
              ccsZaddErrorMessage(target_field, 'You must add information in all fields.');
            errorStore.push(fieldCheck);
          }
          else {
            let isError = false;
            if (term_field.value.trim() === '') {
              ccsZaddErrorMessage(term_field, 'You must add information in all fields.');
              isError = true;
            }
            if (definition_field.value.trim() === '') {
              ccsZaddErrorMessage(definition_field, 'You must add information in all fields.');
              isError = true;
            }
            if (target_field !== undefined && target_field !== null && target_field.value.trim() === '') {
              ccsZaddErrorMessage(target_field, 'You must add information in all fields.');
              isError = true;
            }
            if (field1) {
              ccsZaddErrorMessage(term_field, 'No more than 50 words are allowed.');
              isError = true;
            }
            if (field2) {
              ccsZaddErrorMessage(definition_field, 'No more than 250 words are allowed.');
              isError = true;
            }
            if (isError) {
              fieldCheck = [definition_field.id, 'You must add information in all fields.'];
              errorStore.push(fieldCheck);
            }
          }
        }
      }
    }

  }
  return errorStore;
}
const ccsZvalidateRfpAcronyms = (event) => {

  // event.preventDefault();

  //errorStore = emptyFieldCheckRfp();

  //if (errorStore.length === 0) {

  document.forms["service_user_type_form"].submit();
  //}
  //else {
  //   ccsZPresentErrorSummary(errorStore);

  // }
};
