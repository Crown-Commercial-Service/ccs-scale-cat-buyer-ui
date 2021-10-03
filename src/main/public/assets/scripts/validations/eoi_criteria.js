document.addEventListener('DOMContentLoaded', () => {

  if (document.getElementById("ccs_eoi_criteria_form") !== null) {

    // add '(optional)' to the label for EoIs
    if (document.getElementById("event_type_label").value === "Request for Information") {
      var all_labels = document.querySelectorAll(".govuk-label");

      all_labels.forEach((alabel) => {
        let new_label = alabel.innerHTML.replace("requirement", "requirement (optional)");
        alabel.innerHTML = new_label;
      });
    }

    let with_value_count = 6,
      prev_input = 0,
      deleteButtons = document.querySelectorAll("a.del");

    for (var text_box_num = 6; text_box_num > 1; text_box_num--) {

      let this_box = document.getElementById("eoi_eval_criterion_" + text_box_num);

      if (this_box.value !== "") {
        this_box.classList.remove('ccs-dynaform-hidden');

        if (text_box_num === 6) {
          document.getElementById("ccs_eoi_criteria_add").classList.add('ccs-dynaform-hidden');
        }

      } else {
        let the_label = document.querySelector('label[for=\'eoi_eval_criterion_' + text_box_num + '\']');
        the_label.classList.add('ccs-dynaform-hidden');
        with_value_count = text_box_num;
      }

    }

    document.getElementById("ccs_eoi_criteria_add").addEventListener('click', (e) => {
      e.preventDefault();

      document.getElementById("eoi_eval_criterion_" + with_value_count).classList.remove("ccs-dynaform-hidden");

      document.querySelector('label[for=\'eoi_eval_criterion_' + with_value_count + '\']').classList.remove("ccs-dynaform-hidden");

      if (with_value_count > 2 ) {
        prev_input = with_value_count - 1;
        document.querySelector('label[for=\'eoi_eval_criterion_' + prev_input + '\'] a.del').classList.add("ccs-dynaform-hidden");
      }

      with_value_count++;

      if (with_value_count === 7) {
        document.getElementById("ccs_eoi_criteria_add").classList.add('ccs-dynaform-hidden');
      }

    });

    // delete buttons
    deleteButtons.forEach((db) => {
      db.addEventListener('click', (e) => {

        e.preventDefault();

        let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
          prev_box = Number(target) - 1;
        document.getElementById('eoi_eval_criterion_' + target).value = "";
        document.getElementById('eoi_eval_criterion_' + target).classList.add("ccs-dynaform-hidden");
        document.getElementById('eoi_eval_criterion_' + target + '-error').parentNode.removeChild(document.getElementById('eoi_eval_criterion_' + target + '-error'));
        document.querySelector('label[for=\'eoi_eval_criterion_' + target + '\']').classList.add("ccs-dynaform-hidden");

        if (prev_box > 1) {
          document.querySelector('label[for=\'eoi_eval_criterion_' + prev_box + '\'] a.del').classList.remove("ccs-dynaform-hidden");
        }
        document.getElementById("ccs_eoi_criteria_add").classList.remove('ccs-dynaform-hidden');
        with_value_count--;
      });
    });

  }
});

const ccsZvalidateEoiCriteria = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  const event_typ = document.getElementById("event_type_label").value;

  if (event_typ !== "Request for Information") {
    fieldCheck = ccsZvalidateWithRegex( "eoi_eval_criterion_1", "Enter evaluation criterion " + i, /\w+/);
    if (fieldCheck !== true) errorStore.push(fieldCheck);

    for (var i = 2; i < 7; i++) {
      if (!document.getElementById("eoi_eval_criterion_" + i).classList.contains('ccs-dynaform-hidden')) {
        fieldCheck = ccsZvalidateWithRegex( "eoi_eval_criterion_" + i, "Enter evaluation criterion " + i, /\w+/);
        if (fieldCheck !== true) errorStore.push(fieldCheck);
      }
    }
  }

  if (errorStore.length === 0) document.forms["ccs_eoi_criteria_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};

