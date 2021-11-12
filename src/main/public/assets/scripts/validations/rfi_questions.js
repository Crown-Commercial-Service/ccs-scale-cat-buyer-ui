document.addEventListener('DOMContentLoaded', () => {

  if (document.getElementById("ccs_rfi_questions_form") !== null) {

    let with_value_count = 10,
      prev_input = 0,
      deleteButtons = document.querySelectorAll("a.del");

    for (var text_box_num = 10; text_box_num > 1; text_box_num--) {

      let this_box = document.getElementById("rfi_question_" + text_box_num);

      if (this_box.value !== "") {
        this_box.classList.remove('ccs-dynaform-hidden');

        if (text_box_num === 10) {
          document.getElementById("ccs_criteria_add").classList.add('ccs-dynaform-hidden');
        }

      } else {
        let the_label = document.querySelector('label[for=rfi_question_' + text_box_num + ']');
        the_label.classList.add('ccs-dynaform-hidden');
        with_value_count = text_box_num;
      }

    }

    document.getElementById("ccs_criteria_add").addEventListener('click', (e) => {
      e.preventDefault();

      document.getElementById("rfi_question_" + with_value_count).classList.remove("ccs-dynaform-hidden");

      document.querySelector('label[for=rfi_question_' + with_value_count + ']').classList.remove("ccs-dynaform-hidden");

      if (with_value_count > 2 ) {
        prev_input = with_value_count - 1;
        document.querySelector('label[for=rfi_question_' + prev_input + '] a.del').classList.add("ccs-dynaform-hidden");
      }

      with_value_count++;

      if (with_value_count === 10) {
        document.getElementById("ccs_criteria_add").classList.add('ccs-dynaform-hidden');
      }

    });

    // delete buttons
    deleteButtons.forEach((db) => {
      db.addEventListener('click', (e) => {

        e.preventDefault();

        let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
          prev_box = Number(target) - 1;
        document.getElementById('rfi_question_' + target).value = "";
        document.getElementById('rfi_question_' + target).classList.add("ccs-dynaform-hidden");
        //document.getElementById('rfi_question_' + target + '-error').parentNode.removeChild(document.getElementById('rfi_question_' + target + '-error'));
        document.querySelector('label[for=rfi_question_' + target + ']').classList.add("ccs-dynaform-hidden");

        if (prev_box > 1) {
          document.querySelector('label[for=rfi_question_' + prev_box + '] a.del').classList.remove("ccs-dynaform-hidden");
        }
        document.getElementById("ccs_criteria_add").classList.remove('ccs-dynaform-hidden');
        with_value_count--;
      });
    });

  }
});

const ccsZvalidateRfIQuestions = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  //const event_typ = document.getElementById("event_type_label").value;

  //if (event_typ !== "Request for Information") {
    fieldCheck = ccsZvalidateWithRegex( "rfi_question_1", "Enter question 1", /\w+/);
    if (fieldCheck !== true) errorStore.push(fieldCheck);

    for (var i = 2; i < 11; i++) {
      if (!document.getElementById("rfi_question_" + i).classList.contains('ccs-dynaform-hidden')) {
        fieldCheck = ccsZvalidateWithRegex( "rfi_question_" + i, "Enter question " + i, /\w+/);
        if (fieldCheck !== true) errorStore.push(fieldCheck);
      }
    }
  //}

  if (errorStore.length === 0) document.forms["ccs_rfi_questions_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};
