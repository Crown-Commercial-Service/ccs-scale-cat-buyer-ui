document.addEventListener('DOMContentLoaded', () => {

  if (document.getElementById("ccs_rfi_acronyms_form") !== null) {

    let with_value_count = 10,
      prev_input = 0,
      deleteButtons = document.querySelectorAll("a.del");

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

    document.getElementById("ccs_rfiTerm_add").addEventListener('click', (e) => {
      e.preventDefault();

      document.querySelector(".acronym_" + with_value_count).classList.remove("ccs-dynaform-hidden");

      if (with_value_count > 2 ) {
        prev_input = with_value_count - 1;
        document.querySelector(".acronym_"  + prev_input + " a.del").classList.add("ccs-dynaform-hidden");
      }

      with_value_count++;

      if (with_value_count === 11) {
        document.getElementById("ccs_rfiTerm_add").classList.add('ccs-dynaform-hidden');
      }

    });

    // delete buttons
    deleteButtons.forEach((db) => {
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

  }

});

const ccsZvalidateAcronyms = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [],
    longNum = ["0", "1", "2", "3", "4", "5"];

  for (var x = 1; x < 6; x++) {
    let term_field = document.getElementById('rfi_term_' + x);
    let definition_field = document.getElementById("rfi_term_definition_" + x);

    // console.log(name_field.classList.value);

    if (term_field.closest("fieldset").classList.value.indexOf("ccs-dynaform-hidden") === -1) {

      if(term_field.value.trim() !== '' && definition_field.value.trim() === ''){
          ccsZaddErrorMessage(definition_field, 'Please provide definition for the term');      
          fieldCheck = [definition_field.id, 'Please provide definition for the term'];
          errorStore.push(fieldCheck);
      }
      if(term_field.value.trim() === '' && definition_field.value.trim() !== ''){
          ccsZaddErrorMessage(term_field, 'Please provide a term or acronym');      
          fieldCheck = [term_field.id, 'Please provide a term or acronym'];
          errorStore.push(fieldCheck);
      }
    }
  }

  if (errorStore.length === 0) document.forms["ccs_rfi_acronyms_form"].submit();
  else ccsZPresentErrorSummary(errorStore);

};
