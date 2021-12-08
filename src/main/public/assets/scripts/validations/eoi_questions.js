document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById("ccs_eoi_questions_form") !== null) {

    let with_value_count = 10,
      prev_input = 0,
      deleteButtons = document.querySelectorAll("a.del");

    for (var text_box_num = 10; text_box_num > 1; text_box_num--) {

      let this_box = document.getElementById("eoi_question_" + text_box_num);

      if (this_box.value !== "") {
        this_box.classList.remove('ccs-dynaform-hidden');

        if (text_box_num === 10) {
          document.getElementById("ccs_criteria_add").classList.add('ccs-dynaform-hidden');
        }

      } else {
        let the_label = document.querySelector('label[for=eoi_question_' + text_box_num + ']');
        the_label.classList.add('ccs-dynaform-hidden');
        with_value_count = text_box_num;
      }

    }

    document.getElementById("ccs_criteria_add").classList.remove("ccs-dynaform-hidden");
    document.getElementById("ccs_criteria_add").addEventListener('click', (e) => {
      e.preventDefault();
      $(".govuk-error-summary").remove();
      errorStore = emptyQuestionFieldCheck();
      if (errorStore.length == 0) {

        document.getElementById("eoi_question_" + with_value_count).classList.remove("ccs-dynaform-hidden");

        document.querySelector('label[for=eoi_question_' + with_value_count + ']').classList.remove("ccs-dynaform-hidden");

        if (with_value_count > 2) {
          prev_input = with_value_count - 1;
          document.querySelector('label[for=eoi_question_' + prev_input + '] a.del').classList.add("ccs-dynaform-hidden");
        }

        with_value_count++;

        if (with_value_count === 11) {
          document.getElementById("ccs_criteria_add").classList.add('ccs-dynaform-hidden');
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
          prev_box = Number(target) - 1;
        document.getElementById('eoi_question_' + target).value = "";
        document.getElementById('eoi_question_' + target).classList.add("ccs-dynaform-hidden");
        let parentNode = document.querySelector('label[for=eoi_question_' + target + ']').parentNode;
        if (parentNode.children["eoi_question_" + target + '-error'] !== undefined) {
          parentNode.removeChild(document.getElementById("eoi_question_" + target + '-error'))
          parentNode.classList.remove("govuk-form-group--error");
          parentNode.children["eoi_question_" + target].classList.remove("govuk-input--error");
        }
        //document.getElementById('eoi_question_' + target + '-error').parentNode.removeChild(document.getElementById('eoi_question_' + target + '-error'));
        document.querySelector('label[for=eoi_question_' + target + ']').classList.add("ccs-dynaform-hidden");

        if (prev_box > 1) {
          document.querySelector('label[for=eoi_question_' + prev_box + '] a.del').classList.remove("ccs-dynaform-hidden");
        }
        document.getElementById("ccs_criteria_add").classList.remove('ccs-dynaform-hidden');
        with_value_count--;
      });
    });


    let length = 11;
    while (--length) {
      console.log(length);
      let element = document.querySelector("#eoi_question_" + length);
      element.addEventListener('focusout', (event) => {
        let eleValue = event.target.value;
        if (eleValue !== '') {
          let formElement = document.getElementById("ccs_eoi_questions_form");
          let action = formElement.getAttribute("action");
          action = action + "&stop_page_navigate=true";
          $.ajax({
            type: "POST",
            url: action,
            data: $("#ccs_eoi_questions_form").serialize(),
            success: function () {

              //success message mybe...
            }
          });
        }
      });
      // break;
    }
  }

  const emptyQuestionFieldCheck = () => {
    let fieldCheck = "",
      errorStore = [];

    //const event_typ = document.getElementById("event_type_label").value;

    //if (event_typ !== "Request for Information") {
    fieldCheck = ccsZvalidateWithRegex("eoi_question_1", "You must add at least one question", /\w+/);
    if (fieldCheck !== true) errorStore.push(fieldCheck);
    for (var i = 2; i < 11; i++) {
      if (!document.getElementById("eoi_question_" + i).classList.contains('ccs-dynaform-hidden')) {
        fieldCheck = ccsZvalidateWithRegex("eoi_question_" + i, "You must type a question before you can add another question", /\w+/);
        if (fieldCheck !== true) errorStore.push(fieldCheck);
      }
    }
    return errorStore;
  };
  const ccsZvalidateEoIQuestions = (event) => {
    event.preventDefault();
    errorStore = emptyQuestionFieldCheck();

    //}

    if (errorStore.length === 0) document.forms["ccs_eoi_questions_form"].submit();
    else ccsZPresentErrorSummary(errorStore);
  };
})

$('.add').addClass('ccs-dynaform-hidden');