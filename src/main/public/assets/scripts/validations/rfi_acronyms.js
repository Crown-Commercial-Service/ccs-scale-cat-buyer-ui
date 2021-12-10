document.addEventListener('DOMContentLoaded', () => {

  if (document.getElementById("ccs_rfi_acronyms_form") !== null) {

    let with_value_count = 10,
      prev_input = 0,
      deleteButtons = document.querySelectorAll("a.del");
    let clearFieldsButtons = document.querySelectorAll("a.clear-fields");

    for (var acronym_fieldset = 10; acronym_fieldset > 1; acronym_fieldset--) {


      let this_fieldset = document.querySelector(".acronym_" + acronym_fieldset),
        term_box = document.getElementById("rfi_term_" + acronym_fieldset);

      if (term_box.value !== "") {
        this_fieldset.classList.remove('ccs-dynaform-hidden');

        if (acronym_fieldset === 10) {
          document.getElementById("ccs_rfiTerm_add").classList.add('ccs-dynaform-hidden');
        }

      } else {

        this_fieldset.classList.add('ccs-dynaform-hidden');
        with_value_count = acronym_fieldset;
      }

    }
    document.getElementById("ccs_rfiTerm_add").classList.remove("ccs-dynaform-hidden");


    document.getElementById("ccs_rfiTerm_add").addEventListener('click', (e) => {



      $('.govuk-form-group textarea').removeClass('govuk-textarea--error');
      checkFields();

      e.preventDefault();
      errorStore = emptyFieldCheck();
      if (errorStore.length == 0) {

        removeErrorFields();


        document.querySelector(".acronym_" + with_value_count).classList.remove("ccs-dynaform-hidden");

        if (with_value_count > 2) {
          prev_input = with_value_count - 1;
          document.querySelector(".acronym_" + prev_input + " a.del").classList.add("ccs-dynaform-hidden");
        }

        with_value_count++;

        if (with_value_count === 11) {
          document.getElementById("ccs_rfiTerm_add").classList.add('ccs-dynaform-hidden');
        }



      }
      else ccsZPresentErrorSummary(errorStore);
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

        document.getElementById('rfi_term_' + target).value = "";
        document.getElementById('rfi_term_definition_' + target).value = "";


        if (prev_coll > 1) {
          document.querySelector('.acronym_' + prev_coll + ' a.del').classList.remove("ccs-dynaform-hidden");
        }

        document.getElementById("ccs_rfiTerm_add").classList.remove('ccs-dynaform-hidden');
        with_value_count--;
      });
    });
    clearFieldsButtons.forEach((db) => {
      db.addEventListener('click', (e) => {

        e.preventDefault();

        let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
          target_fieldset = db.closest("fieldset");

        target_fieldset.classList.add("ccs-dynaform");

        document.getElementById('rfi_term_' + target).value = "";
        document.getElementById('rfi_term_definition_' + target).value = "";
      });
    });


    if (document.getElementsByClassName("term_acronym_fieldset").length > 0) {
      let fieldSets = document.getElementsByClassName("term_acronym_fieldset");
      let length = fieldSets.length;
      while (length--) {
        let id = length + 1;
        let eleTerm = fieldSets[length].querySelector("#rfi_term_" + id);
        eleTerm.addEventListener('focusout', (event) => {
          let ele1 = event.target;
          let definitionElementId = "rfi_term_definition_" + id;
          let ele2 = document.getElementById(definitionElementId);
          performSubmitAction(ele1, ele2);

        });
        let eleTermDefinition = fieldSets[length].querySelector("#rfi_term_definition_" + id);
        eleTermDefinition.addEventListener('focusout', (event) => {
          let ele2 = event.target;
          let ele1Id = "rfi_term_" + id;
          let ele1 = document.getElementById(ele1Id);
          performSubmitAction(ele1, ele2);
        });
        var performSubmitAction = function (ele1, ele2) {
          if (ele1.value !== '' && ele2.value !== '') {
            let formElement = document.getElementById("ccs_rfi_acronyms_form");
            let action = formElement.getAttribute("action");
            action = action + "&stop_page_navigate=true";
            // console.log($("#ccs_rfi_acronyms_form").serialize());
            $.ajax({
              type: "POST",
              url: action,
              data: $("#ccs_rfi_acronyms_form").serialize(),
              success: function () {

                //success message mybe...
              }
            });
          }
        };
        // break;
      }
    }
  }

});
const checkFields = () => {
  const start = 1;
  const end = 10;

  for (var a = start; a <= end; a++) {
    let input = $(`#rfi_term_${a}`)
    let textbox = $(`#rfi_term_definition_${a}`);


    if (input.val() !== "") {

      $(`#rfi_term_${a}-error`).remove();
      $(`.acronym_${a} div`).removeClass('govuk-form-group--error');
      $(`.acronym_${a} input`).removeClass('govuk-input--error')


    }
    if (textbox.val() !== "") {

      $(`#rfi_term_definition_${a}-error`).remove();
      $(`.acronym_${a} div`).removeClass('govuk-form-group--error');
      $(`.acronym_${a} textarea`).removeClass('govuk-input--error');
      $(`.acronym_${a} textarea`).removeClass('govuk-textarea--error')
    }

  }
}
const removeErrorFields = () => {
  $('.govuk-error-message').remove();
  $('.govuk-form-group--error').removeClass('govuk-form-group--error')
  $('.govuk-error-summary').remove();
  $(".govuk-input").removeClass("govuk-input--error")

}

const emptyFieldCheck = () => {
  let fieldCheck = "",
    errorStore = [];

  for (var x = 1; x < 11; x++) {
    let term_field = document.getElementById('rfi_term_' + x);
    let definition_field = document.getElementById("rfi_term_definition_" + x);

    // console.log(name_field.classList.value);

    if (term_field.closest("fieldset").classList.value.indexOf("ccs-dynaform-hidden") === -1) {
      checkFields();
      if (term_field.value.trim() !== '' && definition_field.value.trim() === '') {
        ccsZaddErrorMessage(definition_field, 'You must add information in both fields.');
        fieldCheck = [definition_field.id, 'You must add information in both fields.'];
        errorStore.push(fieldCheck);
      }
      if (term_field.value.trim() === '' && definition_field.value.trim() !== '') {
        ccsZaddErrorMessage(term_field, 'You must add information in both fields.');
        fieldCheck = [term_field.id, 'You must add information in both fields.'];
        errorStore.push(fieldCheck);
      }
    }
  }
  return errorStore;
}
const ccsZvalidateRfiAcronyms = (event) => {
  event.preventDefault();

  errorStore = emptyFieldCheck();

  if (errorStore.length === 0) {

    document.forms["ccs_rfi_acronyms_form"].submit();
  }
  else {
    ccsZPresentErrorSummary(errorStore);

  }

};
