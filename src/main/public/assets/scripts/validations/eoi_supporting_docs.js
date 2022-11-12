document.addEventListener('DOMContentLoaded', () => {

  if (document.getElementById("ccs_eoi_docs_form") !== null) {

    let with_value_count = 4,
      prev_input = 0,
      deleteButtons = document.querySelectorAll("a.del");

    for (var text_box_num = 4; text_box_num > 1; text_box_num--) {

      let this_box = document.getElementById("eoi_file_upload_" + text_box_num);

      if (this_box.value !== "") {
        this_box.classList.remove('ccs-dynaform-hidden');

        if (text_box_num === 4) {
          document.getElementById("ccs_eoi_file_add").classList.add('ccs-dynaform-hidden');
        }

      } else {
        let the_label = document.querySelector('label[for=\'eoi_file_upload_' + text_box_num + '\']');
        the_label.classList.add('ccs-dynaform-hidden');
        with_value_count = text_box_num;
      }
    }

    document.getElementById("ccs_eoi_file_add").addEventListener('click', (e) => {
      e.preventDefault();

      document.getElementById("eoi_file_upload_" + with_value_count).classList.remove("ccs-dynaform-hidden");

      document.querySelector('label[for=\'eoi_file_upload_' + with_value_count + '\']').classList.remove("ccs-dynaform-hidden");

      if (with_value_count > 2 ) {
        prev_input = with_value_count - 1;
        document.querySelector('label[for=\'eoi_file_upload_' + prev_input + '\'] a.del').classList.add("ccs-dynaform-hidden");
      }

      with_value_count++;

      if (with_value_count === 5) {
        document.getElementById("ccs_eoi_file_add").classList.add('ccs-dynaform-hidden');
      }

    });

    // delete buttons
    deleteButtons.forEach((db) => {
      db.addEventListener('click', (e) => {

        e.preventDefault();

        let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
          prev_box = Number(target) - 1;
        document.getElementById('eoi_file_upload_' + target).value = "";
        document.getElementById('eoi_file_upload_' + target).classList.add("ccs-dynaform-hidden");
        document.getElementById('eoi_file_upload_' + target + '-error').parentNode.removeChild(document.getElementById('eoi_file_upload_' + target + '-error'));
        document.querySelector('label[for=\'eoi_file_upload_' + target + '\']').classList.add("ccs-dynaform-hidden");
        if (prev_box > 1) {
          document.querySelector('label[for=\'eoi_file_upload_' + prev_box + '\'] a.del').classList.remove("ccs-dynaform-hidden");
        }
        document.getElementById("ccs_eoi_file_add").classList.remove('ccs-dynaform-hidden');
        with_value_count--;
      });
    });
  }
});

const ccsZvalidateEoiDocs = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  if (document.getElementById("eoi_file_upload_1").value.length > 0) {
    fieldCheck = ccsZvalidateWithRegex( "eoi_file_upload_1", "Document 1 must be a Word or Acrobat file",         /^(\w|\W)+\.(docx?|pdf)$/);
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  }

  for (var i = 2; i < 5; i++) {
    if (!document.getElementById("eoi_file_upload_" + i).classList.contains('ccs-dynaform-hidden')) {
      fieldCheck = ccsZvalidateWithRegex( "eoi_file_upload_" + i, "Document " + i + " must be a Word or Acrobat file",         /^(\w|\W)+\.(docx?|pdf)$/);
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }

  if (errorStore.length === 0) document.forms["ccs_eoi_docs_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};

