const countWordskpi = (str) => { return str?.trim().split(/\s+/).length };
document.addEventListener('DOMContentLoaded', () => {

  if (document.getElementById("service_levels_kpi_form") !== null) {

    let with_value_count = 10,
      prev_input = 0,
      deleteButtons = document.querySelectorAll("a.del");
    let precentageInputs = document.querySelectorAll(".govuk-input--width-5");

    for (var acronym_fieldset = 10; acronym_fieldset > 1; acronym_fieldset--) {

      let this_fieldset = document.querySelector(".acronym_service_levels_KPI_" + acronym_fieldset),
        term_box = document.getElementById("rfp_term_service_levels_KPI_" + acronym_fieldset),
        term_box1 = document.getElementById("rfp_term_definition_service_levels_KPI_" + acronym_fieldset),
        term_box2 = document.getElementById("rfp_term_percentage_KPI_" + acronym_fieldset);

      if (term_box != undefined && term_box != null && term_box.value !== "") {
        this_fieldset.classList.remove('ccs-dynaform-hidden');
        document.getElementById("kpiKeyLevel").textContent = acronym_fieldset;

        if (acronym_fieldset === 10) {
          document.getElementById("ccs_rfpTerm_add").classList.add('ccs-dynaform-hidden');
        }

      } else {

        this_fieldset.classList.add('ccs-dynaform-hidden');
        with_value_count = acronym_fieldset;
      }
    }
    document.getElementById("ccs_rfpTerm_add").classList.remove("ccs-dynaform-hidden");


    document.getElementById("ccs_rfpTerm_add").addEventListener('click', (e) => {

      $('.govuk-form-group').removeClass('govuk-textarea--error');
      //checkFieldsRfpKPI();
      errorStore = emptyFieldCheckRfpKPI();
      e.preventDefault();
      if (errorStore == null || errorStore.length <= 0) {
        document.querySelector(".acronym_service_levels_KPI_" + with_value_count).classList.remove("ccs-dynaform-hidden");
        if (with_value_count > 2) {
          prev_input = with_value_count - 1;
          document.querySelector(".acronym_service_levels_KPI_" + prev_input + " a.del").classList.add("ccs-dynaform-hidden");
        }

        with_value_count++;
        //document.getElementById("kpiKeyLevel").textContent = with_value_count;
        if (with_value_count === 11) {
          document.getElementById("ccs_rfpTerm_add").classList.add('ccs-dynaform-hidden');
        }
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


        document.getElementById('rfp_term_service_levels_KPI_' + target).value = "";
        document.getElementById('rfp_term_definition_service_levels_KPI_' + target).value = "";
        document.getElementById('rfp_term_percentage_KPI_' + target).value = "";
        target_fieldset.classList.add("ccs-dynaform-hidden");

        document.getElementById("kpiKeyLevel").textContent = prev_coll;
        if (prev_coll > 1) {
          document.getElementById("kpiKeyLevel").textContent = prev_coll;
          document.querySelector('.acronym_service_levels_KPI_' + prev_coll + ' a.del').classList.remove("ccs-dynaform-hidden");
        }

        document.getElementById("ccs_rfpTerm_add").classList.remove('ccs-dynaform-hidden');
        with_value_count--;
      });
    });
    precentageInputs.forEach(db => {
      db.addEventListener("keydown",(event) => {
        if (event.keyCode == '69') { event.preventDefault(); }
      })
    })

  }
});

const checkFieldsRfpKPI = () => {
  const start = 1;
  const end = 10;
  const pageHeading = document.getElementById('page-heading').innerHTML;
  for (var a = start; a <= end; a++) {
    let input = $(`#rfp_term_service_levels_KPI_${a}`)
    let textbox = $(`#rfp_term_definition_service_levels_KPI_${a}`);
    let textbox1 = $(`#rfp_term_percentage_KPI_${a}`);

    if (!pageHeading.includes("(Optional)")) {

      const field1 = countWordskpi(input.val()) < 50;
      const field2 = countWordskpi(textbox.val()) < 150;
      if (input.val() !== "" || field1) {
        $(`#rfp_term_service_levels_KPI_${a}`).remove();
        $(`.acronym_${a} div`).removeClass('govuk-form-group--error');
        $(`.acronym_${a} input`).removeClass('govuk-input--error')
      }
      if (textbox.val() !== "" || field2) {

        $(`#rfp_term_service_levels_KPI_${a}-error`).remove();
        $(`.acronym_${a} div`).removeClass('govuk-form-group--error');
        $(`.acronym_${a} textarea`).removeClass('govuk-input--error');
        $(`.acronym_${a} textarea`).removeClass('govuk-textarea--error')
      }

      // if (textbox1.val() !== "" || field2) {
      //   $(`#rfp_term_percentage_KPI_${a}-error`).remove();
      //   $(`.rfp_term_${a} div`).removeClass('govuk-form-group--error');
      //   $(`.rfp_term_definition_${a} textarea`).removeClass('govuk-input--error');
      //   //$(`.acronym_service_levels_KPI_${a} textarea`).removeClass('govuk-textarea--error');
      // }
    }

  }
}
const removeErrorFieldsRfpKPI = () => {
  $('.govuk-error-message').remove();
  $('.govuk-form-group--error').removeClass('govuk-form-group--error')
  $('.govuk-error-summary').remove();
  $(".govuk-input").removeClass("govuk-input--error");
  $('.govuk-form-group textarea').removeClass('govuk-textarea--error');

}

const emptyFieldCheckRfpKPI = () => {
  let fieldCheck = "",
    errorStore = [];
  const pageHeading = document.getElementById('page-heading').innerHTML;
  removeErrorFieldsRfpKPI();
  for (var x = 1; x < 11; x++) {
    let term_field = document.getElementById('rfp_term_service_levels_KPI_' + x);
    let definition_field = document.getElementById("rfp_term_definition_service_levels_KPI_" + x);
    let target_field = document.getElementById("rfp_term_percentage_KPI_" + x);

    if (term_field !== undefined && term_field !== null && definition_field !== undefined && definition_field !== null && target_field !== undefined && target_field !== null) {
      const field1 = countWordskpi(term_field?.value) > 50;
      const field2 = countWordskpi(definition_field?.value) > 150;

      if (term_field.closest("fieldset").classList.value.indexOf("ccs-dynaform-hidden") === -1) {
        //checkFieldsRfpKPI()
        if (term_field.value.trim() !== '' && definition_field.value.trim() !== '' && target_field.value.trim() !== '') {
          document.getElementById("kpiKeyLevel").textContent = x;
        }

        if (!pageHeading.includes("(Optional)")) {
          if (term_field.value.trim() === '' && definition_field.value.trim() === '' && target_field.value.trim() === '') {
            fieldCheck = [definition_field.id, 'You must add information in all fields.'];
            ccsZaddErrorMessage(term_field, 'You must add information in all fields.');
            ccsZaddErrorMessage(definition_field, 'You must add information in all fields.');
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
const ccsZvalidateRfpKPI = (event) => {
  event.preventDefault();

  errorStore = emptyFieldCheckRfpKPI();

  if (errorStore.length === 0) {

    document.forms["service_levels_kpi_form"].submit();
  }
  else {
    ccsZPresentErrorSummary(errorStore);

  }
};
$('#service_levels_kpi_form').on('submit', (event) => {
  event.preventDefault();

  errorStore = emptyFieldCheckRfpKPI();

  if (errorStore.length === 0) {

    document.forms["service_levels_kpi_form"].submit();
  }
  else {
    ccsZPresentErrorSummary(errorStore);

  }

});