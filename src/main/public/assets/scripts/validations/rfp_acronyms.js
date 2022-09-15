"use strict";
//const countWordsAcronymsFx = (str) => { return str?.trim()?.split(/\s+/).length };
document.addEventListener('DOMContentLoaded', () => {
  const countCharacters = (str) => { return str.length };

  if (document.getElementById("ccs_rfp_acronyms_form") !== null) {
    const checkHowManyQuestionAddedSoFar = function () {
      for (var i = 1; i < 11; i++) {
        let rootEl = document.getElementsByClassName('acronym_' + i);
        if (i <= 9 && !rootEl?.[0].classList.contains('ccs-dynaform-hidden')) {
          document.getElementById("ccs_rfpTerm_add").classList.remove('ccs-dynaform-hidden')
        } else if (!rootEl?.[0].classList.contains('ccs-dynaform-hidden')) {
          document.getElementById("ccs_rfpTerm_add").classList.add('ccs-dynaform-hidden')
        }
      }
    }
    let with_value_count = 10,
      prev_input = 0,
      deleteButtons = document.querySelectorAll("a.del");
    let clearFieldsButtons = document.querySelectorAll("a.clear-fields");
    let allInput = document.querySelectorAll(".govuk-input");
    let allInputTextArea = document.querySelectorAll(".govuk-textarea");
    allInput?.forEach(element => {
      element.maxLength = 500;
    })
    allInputTextArea?.forEach(element => {
      element.maxLength = 5000;
    })
    let deleteButtonCount = [];
    for (var acronym_fieldset = 10; acronym_fieldset > 1; acronym_fieldset--) {
      let this_fieldset = document.querySelector(".acronym_" + acronym_fieldset),
        term_box = document.getElementById("rfp_term_" + acronym_fieldset);
      // document.getElementById("deleteButton_acronym_" + acronym_fieldset).classList.add("ccs-dynaform-hidden");
      if (term_box.value !== "") {
        this_fieldset.classList.remove('ccs-dynaform-hidden');
        deleteButtonCount.push(acronym_fieldset);
        if (acronym_fieldset === 10) {
          document.getElementById("ccs_rfpTerm_add").classList.add('ccs-dynaform-hidden');
        }
      } else {
        this_fieldset.classList.add('ccs-dynaform-hidden');
        with_value_count = acronym_fieldset;
      }
      if (acronym_fieldset <= 9 && !this_fieldset?.classList.contains('ccs-dynaform-hidden') && document.getElementsByClassName("ccs_rfpTerm_add").length >0) {
        document.getElementsByClassName("ccs_rfpTerm_add")?.[0].classList.remove('ccs-dynaform-hidden')
      } else if (!this_fieldset?.classList.contains('ccs-dynaform-hidden') && document.getElementsByClassName("ccs_rfpTerm_add").length>0) {
        document.getElementsByClassName("ccs_rfpTerm_add")?.[0].classList.add('ccs-dynaform-hidden')
      }
      if (acronym_fieldset === 2 && deleteButtonCount.length > 0) {
        $("#deleteButton_acronym_" + deleteButtonCount[deleteButtonCount.sort().length - 1]).removeClass("ccs-dynaform-hidden");
      }
    }

    document.getElementById("ccs_rfpTerm_add").classList.remove("ccs-dynaform-hidden");
    document.getElementById("ccs_rfpTerm_add").addEventListener('click', (e) => {
      $('.govuk-form-group textarea').removeClass('govuk-textarea--error');
      checkFieldsRfp1();

      e.preventDefault();
      errorStore = emptyFieldCheckRfp1();
      if (errorStore.length == 0) {
        removeErrorFieldsRfp1();
        //$("#deleteButton_acronym_" + with_value_count).removeClass("ccs-dynaform-hidden");
        let containsHiddenClassAtPostion = []
        for (var i = 1; i < 11; i++) {
          let rootEl = document.getElementsByClassName('acronym_' + i)?.[0];
          if (rootEl?.classList?.contains('ccs-dynaform-hidden')) {
            containsHiddenClassAtPostion.push(i);
          }
        }
        if (containsHiddenClassAtPostion.length > 0) {
          let previousElementId = containsHiddenClassAtPostion[0] - 1;
          if (Number(previousElementId) > 0) {
            let element1 = document.getElementById('rfp_term_' + previousElementId);
            let element2 = document.getElementById('rfp_term_definition_' + previousElementId);
            if (element1?.value == undefined || element1?.value == null || element1?.value == '') {
              ccsZaddErrorMessage(element1, 'You must add information in this fields.');
              errorStore.push([element1.id, 'You must add information in this fields.']);
            }
            if (element2?.value == undefined || element2?.value == null || element2?.value == '') {
              ccsZaddErrorMessage(element2, 'You must add information in this fields.');
              errorStore.push([element2.id, 'You must add information in this fields.']);
            }
            //fieldCheck = [definition_field.id, 'You must add information in all fields.'];
            //ccsZaddErrorMessage(term_field, 'You must add information in all fields.');

          }
          if (errorStore.length > 0) {
            ccsZPresentErrorSummary(errorStore)
          } else
            document.querySelector(".acronym_" + containsHiddenClassAtPostion[0]).classList.remove("ccs-dynaform-hidden");
        }
        checkHowManyQuestionAddedSoFar();
      }
      else ccsZPresentErrorSummary(errorStore);
    });

    // delete buttons
    deleteButtons.forEach((db) => {
      //db.classList.remove('ccs-dynaform-hidden')
      db.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById("ccs_rfpTerm_add").classList.remove('ccs-dynaform-hidden');

        let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
          prev_coll = Number(target) - 1,
          target_fieldset = db.closest("fieldset");

        //target_fieldset.classList.add("ccs-dynaform-hidden");

        document.getElementById('rfp_term_' + target).value = "";
        document.getElementById('rfp_term_definition_' + target).value = "";

        //region Reset All field

        //RESET ALL DATA AFTER DELETED ANY DATA
        let resetTermsAcronymsData = [{}];
        for (var question_fieldset = 1; question_fieldset < 11; question_fieldset++) {
          let termNameValue = document.getElementById('rfp_term_' + question_fieldset).value;
          let definitionValue = document.getElementById('rfp_term_definition_' + question_fieldset).value;

          if (termNameValue != undefined && termNameValue != null && termNameValue != '' && definitionValue != undefined && definitionValue != null && definitionValue != '') {
            resetTermsAcronymsData.push({ termNameValue: termNameValue, definitionValue: definitionValue });
          }

          document.getElementById('rfp_term_' + question_fieldset).value = '';
          document.getElementById('rfp_term_definition_' + question_fieldset).value = '';

          let this_fieldset = document.getElementById('acronym_' + question_fieldset);
          this_fieldset?.classList.add('ccs-dynaform-hidden');

        }


        for (var question_fieldset = 0; question_fieldset < 11; question_fieldset++) {
          if (question_fieldset != 0) {
            document.getElementById('rfp_term_' + question_fieldset).value = resetTermsAcronymsData[question_fieldset]?.termNameValue != undefined ? resetTermsAcronymsData[question_fieldset]?.termNameValue : '';
            document.getElementById('rfp_term_definition_' + question_fieldset).value = resetTermsAcronymsData[question_fieldset]?.definitionValue != undefined ? resetTermsAcronymsData[question_fieldset]?.definitionValue : '';
          }

          let this_fieldset = document.getElementsByClassName('acronym_' + question_fieldset) != undefined && document.getElementsByClassName('acronym_' + question_fieldset) != null ? document.getElementsByClassName('acronym_' + question_fieldset) : null;
          let name_box = document.getElementById('rfp_term_' + question_fieldset);
          if (this_fieldset != undefined && this_fieldset != null && this_fieldset.length > 0 && name_box?.value !== undefined && name_box?.value !== null && name_box?.value !== '') {
            with_value_count = question_fieldset;
            this_fieldset?.[0].classList.remove('ccs-dynaform-hidden');
            if (question_fieldset === 10) {
              document.getElementById('ccs_rfpTerm_add').classList.add('ccs-dynaform-hidden');
            }
          } else if (this_fieldset != undefined && this_fieldset != null && this_fieldset.length > 0 && question_fieldset !== 0 && (name_box?.value == '' || name_box?.value == undefined || name_box?.value != null)) {
            this_fieldset?.[0].classList.add('ccs-dynaform-hidden');
            with_value_count = question_fieldset;
          }
          if (this_fieldset != undefined && this_fieldset != null && this_fieldset.length > 0 && question_fieldset === 1) {
            this_fieldset?.[0].classList.remove('ccs-dynaform-hidden');
            with_value_count = 1;
          }
        }
        //endregion
        checkHowManyQuestionAddedSoFar();
      });
    });
    clearFieldsButtons.forEach((db) => {
      db.addEventListener('click', (e) => {
        return;
        e.preventDefault();

        let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
          target_fieldset = db.closest("fieldset");

        target_fieldset.classList.add("ccs-dynaform");

        document.getElementById('rfp_term_' + target).value = "";
        document.getElementById('rfp_term_definition_' + target).value = "";
        removeErrorFieldsRfp1();
      });

    });


    if (document.getElementsByClassName("term_acronym_fieldset").length > 0) {
      let fieldSets = document.getElementsByClassName("term_acronym_fieldset");
      let length = fieldSets.length;
      while (length--) {
        let id = length + 1;

        let eleTerm = fieldSets[length].querySelector("#rfp_term_" + id);
        if (eleTerm != undefined && eleTerm != null) {
          eleTerm.addEventListener('focusout', (event) => {
            let ele1 = event.target;
            let definitionElementId = "rfp_term_definition_" + id;
            let ele2 = document.getElementById(definitionElementId);
            performSubmitAction(ele1, ele2);

          });
        }
        let eleTermDefinition = fieldSets[length].querySelector("#rfp_term_definition_" + id);
        eleTermDefinition.addEventListener('focusout', (event) => {
          let ele2 = event.target;
          let ele1Id = "rfp_term_" + id;
          let ele1 = document.getElementById(ele1Id);
          performSubmitAction(ele1, ele2);
        });
        var performSubmitAction = function (ele1, ele2) {
          if (ele1.value !== '' && ele2.value !== '') {
            let formElement = document.getElementById("ccs_rfp_acronyms_form");
            let action = formElement.getAttribute("action");
            action = action + "&stop_page_navigate=true";

            // $.ajax({
            //   type: "POST",
            //   url: action,
            //   data: $("#ccs_rfp_acronyms_form").serialize(),
            //   success: function () {

            //     //success message mybe...
            //   }
            // });
          }
        };
        // break;
      }
    }
  }

const checkFieldsRfp1 = () => {
  const start = 1;
  const end = 10;
  const pageHeading = document.getElementById('page-heading').innerHTML;
  for (var a = start; a <= end; a++) {
    let input = $(`#rfp_term_${a}`)
    let textbox = $(`#rfp_term_definition_${a}`);

    if (!pageHeading.includes("(Optional)")) {
      const field1 = countCharacters(input.val()) < 50;
      const field2 = countCharacters(textbox.val()) < 150;
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
const removeErrorFieldsRfp1 = () => {
  $('.govuk-error-message').remove();
  $('.govuk-form-group--error').removeClass('govuk-form-group--error')
  $('.govuk-error-summary').remove();
  $(".govuk-input").removeClass("govuk-input--error");
  $('.govuk-form-group textarea').removeClass('govuk-textarea--error');

}

const emptyFieldCheckRfp1 = () => {
  let fieldCheck = "",
    errorStore = [];
  removeErrorFieldsRfp1();
  const pageHeading = document.getElementById('page-heading').innerHTML;
  for (var x = 1; x < 11; x++) {
    let term_field = document.getElementById('rfp_term_' + x);
    let definition_field = document.getElementById("rfp_term_definition_" + x);
    let target_field = document.getElementById("rfp_term_target_" + x);

    if (term_field.value !== undefined && definition_field !== undefined) {
      const field1 = countCharacters(term_field.value) > 50;
      const field2 = countCharacters(definition_field.value) > 5000;
      
      if (term_field.closest("fieldset").classList.value.indexOf("ccs-dynaform-hidden") === -1) {
        checkFieldsRfp1();
        if (pageHeading.includes("(Optional)")) {
          
          
          if (x != 1 && term_field.value.trim() !== '' && definition_field.value.trim() === '') {
            fieldCheck = [definition_field.id, 'You must add information in all fields.'];
            //ccsZaddErrorMessage(term_field, 'You must add information in all fields.');
            ccsZaddErrorMessage(definition_field, 'You must add information in all fields.');
            errorStore.push(fieldCheck);
          } else if (x != 1 && term_field.value.trim() === '' && definition_field.value.trim() !== '') {
            fieldCheck = [term_field.id, 'You must add information in all fields.'];
            ccsZaddErrorMessage(term_field, 'You must add information in all fields.');
            errorStore.push(fieldCheck);
          }
          else if (field2) {

            errorStore.push([definition_field, 'No more than 5000 characters are allowed.']);
            ccsZaddErrorMessage(definition_field, 'No more than 5000 characters are allowed.');
            isError = true;
          }  
    
          // else if (x != 1) {
          //   let isError = false;
          //   if (term_field.value.trim() === '') {
          //     ccsZaddErrorMessage(term_field, 'You must add information in all fields.');
          //     isError = true;
          //   }
          //   if (definition_field.value.trim() === '') {
          //     ccsZaddErrorMessage(definition_field, 'You must add information in all fields.');
          //     isError = true;
          //   }
          //   if (target_field !== undefined && target_field !== null && target_field.value.trim() === '') {
          //     ccsZaddErrorMessage(target_field, 'You must add information in all fields.');
          //     isError = true;
          //   }
            // if (field1) {
            //   ccsZaddErrorMessage(term_field, 'No more than 50 words are allowed.');
            //   isError = true;
            // }

          //   if (isError) {
          //     fieldCheck = [definition_field.id, 'You must add information in all fields.'];
          //     errorStore.push(fieldCheck);
          //   }
          // }
        }
      }
    }

  }
  return errorStore;
}
const ccsZvalidateRfpAcronymsRFP = (event) => {

  event.preventDefault();

  errorStore = emptyFieldCheckRfp1();

  if (errorStore.length === 0) {

    document.forms["ccs_rfp_acronyms_form"].submit();
  }
  else {
    ccsZPresentErrorSummary(errorStore);

  }
};
});

