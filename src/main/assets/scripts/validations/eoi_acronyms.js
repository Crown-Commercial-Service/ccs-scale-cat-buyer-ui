if ($('#eoi_keyterm').length > 0) {
  $('.eoi_form').attr('id', 'ccs_eoi_acronyms_form');
  $('.eoi_form').attr('name', 'ccs_eoi_acronyms_form');
}

document.addEventListener('DOMContentLoaded', () => {

  if (document.getElementById("ccs_eoi_acronyms_form") !== null) {

    let with_value_count = 20,
      prev_input = 0,
      filled_input = 0,
      deleteButtons = document.querySelectorAll("a.del");
    let clearFieldsButtons = document.querySelectorAll("a.clear-fields");

    for (var acronym_fieldset = 20; acronym_fieldset > 1; acronym_fieldset--) {


      let this_fieldset = document.querySelector(".acronym_" + acronym_fieldset),
        term_box = document.getElementById("eoi_term_" + acronym_fieldset);

      if (term_box.value !== "") {
       // this_fieldset.classList.remove('ccs-dynaform-hidden');

        if (acronym_fieldset === 20) {
          document.getElementById("ccs_eoiTerm_add").classList.add('ccs-dynaform-hidden');
        }

      } else {

        this_fieldset.classList.add('ccs-dynaform-hidden');
        with_value_count = acronym_fieldset;
        filled_input++;
      }

    }
    document.getElementById("ccs_eoiTerm_add").classList.remove("ccs-dynaform-hidden");

    if(filled_input===0){
    
      document.getElementById("ccs_eoiTerm_add").classList.add('ccs-dynaform-hidden');
    }


    document.getElementById("ccs_eoiTerm_add").addEventListener('click', (e) => {



      $('.govuk-form-group textarea').removeClass('govuk-textarea--error');
      checkFieldsEoi();

      e.preventDefault();
      errorStore = emptyFieldCheckEoi('add_more');
      if (errorStore.length == 0) {

        removeErrorFieldsEoi();


        document.querySelector(".acronym_" + with_value_count).classList.remove("ccs-dynaform-hidden");

        if (with_value_count > 2) {
          prev_input = with_value_count - 1;
         // document.querySelector(".acronym_" + prev_input + " a.del").classList.add("ccs-dynaform-hidden");
        }

        with_value_count++;

        if (with_value_count === 21) {
          document.getElementById("ccs_eoiTerm_add").classList.add('ccs-dynaform-hidden');
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
        
    let Sibling = target_fieldset.nextElementSibling; //document.getElementById(e.target.id).nextElementSibling;
    console.log(`target: ${target}`)
    if(target != 20) {
        let ml = 1;
        
        let next_coll = Number(target);
        let nextLevel_coll = Number(target);
        let eptArr = [];
        while (Sibling) {
            
            let siblingClassList = Sibling.classList;
            if (Object.keys(siblingClassList).find(key => siblingClassList[key] === 'closeCCS') !== undefined && Object.keys(siblingClassList).find(key => siblingClassList[key] === 'ccs-dynaform-hidden') === undefined) {
               let current_col = nextLevel_coll;
                nextLevel_coll = (nextLevel_coll + 1);

                eptArr.push(nextLevel_coll)
                if(ml == 1) {
                    console.log(`First: ${ml} - ${next_coll}`)
                    var first = Sibling.querySelector("[name='term']");
                    var last  = Sibling.querySelector("[name='value']");
                    console.log(first.value)
                    console.log(last.value)
                    document.getElementById('eoi_term_' + current_col).value = first.value;
                    document.getElementById('eoi_term_definition_' + current_col).value = last.value;
                    // target_fieldset.querySelector("[name='term']").value = first.value;
                    // target_fieldset.querySelector("[name='value']").value = last.value;
                } else {
                    next_coll = next_coll + 1;
                    console.log(`Usual: ${ml} - ${next_coll}`)
                    var first = Sibling.querySelector("[name='term']");
                    var last  = Sibling.querySelector("[name='value']");
                    console.log(first.value)
                    console.log(last.value)
                    document.getElementById('eoi_term_' + next_coll).value = first.value;
                    document.getElementById('eoi_term_definition_' + next_coll).value = last.value;
                }

                console.log(Sibling.classList);
                Sibling = Sibling.nextElementSibling;
            } else {
                Sibling = false;
            }
        ml++;}
        if(eptArr.length > 0) {
            console.log(eptArr);
            let removeLogic = eptArr.at(-1);
            console.log(`removeLogic: ${removeLogic}`);
            document.getElementById('eoi_term_' + removeLogic).value = "";
            document.getElementById('eoi_term_' + removeLogic).dispatchEvent(new Event("keyup"));
            document.getElementById('eoi_term_definition_' + removeLogic).value = "";
            document.getElementById('eoi_term_definition_' + removeLogic).dispatchEvent(new Event("keyup"));
            document.getElementById('eoi_term_' + removeLogic).closest("fieldset").classList.add("ccs-dynaform-hidden")
        } else {
            target_fieldset.classList.add("ccs-dynaform-hidden");
            document.getElementById('eoi_term_' + target).value = "";
            document.getElementById('eoi_term_' + target).dispatchEvent(new Event("keyup"));
            document.getElementById('eoi_term_definition_' + target).value = "";
            document.getElementById('eoi_term_definition_' + target).dispatchEvent(new Event("keyup"));
            if (prev_coll > 1) {
                document.querySelector('.acronym_' + prev_coll + ' a.del').classList.remove("ccs-dynaform-hidden");
            }
            document.getElementById("ccs_eoiTerm_add").classList.remove('ccs-dynaform-hidden');
        }
    } else {
        target_fieldset.classList.add("ccs-dynaform-hidden");
        document.getElementById('eoi_term_' + target).value = "";
        document.getElementById('eoi_term_' + target).dispatchEvent(new Event("keyup"));
        document.getElementById('eoi_term_definition_' + target).value = "";
        document.getElementById('eoi_term_definition_' + target).dispatchEvent(new Event("keyup"));
        if (prev_coll > 1) {
            document.querySelector('.acronym_' + prev_coll + ' a.del').classList.remove("ccs-dynaform-hidden");
        }
        document.getElementById("ccs_eoiTerm_add").classList.remove('ccs-dynaform-hidden');
    }
    with_value_count--;
    if (with_value_count != 21) {
        document.getElementById("ccs_eoiTerm_add").classList.remove("ccs-dynaform-hidden");
    }
});

        // let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
        //   prev_coll = Number(target) - 1,
        //   target_fieldset = db.closest("fieldset");

        // target_fieldset.classList.add("ccs-dynaform-hidden");

        // document.getElementById('eoi_term_' + target).value = "";
        // document.getElementById('eoi_term_definition_' + target).value = "";


        // if (prev_coll > 1) {
        //   document.querySelector('.acronym_' + prev_coll + ' a.del').classList.remove("ccs-dynaform-hidden");
        // }

        // document.getElementById("ccs_eoiTerm_add").classList.remove('ccs-dynaform-hidden');
        // with_value_count--;
     
    });
    clearFieldsButtons.forEach((db) => {
      db.addEventListener('click', (e) => {

        e.preventDefault();

        let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
          target_fieldset = db.closest("fieldset");

        target_fieldset.classList.add("ccs-dynaform");

        document.getElementById('eoi_term_' + target).value = "";
        document.getElementById('eoi_term_definition_' + target).value = "";
        removeErrorFieldsEoi();
      });

    });


    if (document.getElementsByClassName("term_acronym_fieldset").length > 0) {
      let fieldSets = document.getElementsByClassName("term_acronym_fieldset");
      let length = fieldSets.length;
      while (length--) {
        let id = length + 1;
        let eleTerm = fieldSets[length].querySelector("#eoi_term_" + id);
        eleTerm.addEventListener('focusout', (event) => {
          let ele1 = event.target;
          let definitionElementId = "eoi_term_definition_" + id;
          let ele2 = document.getElementById(definitionElementId);
          performSubmitAction(ele1, ele2);

        });
        let eleTermDefinition = fieldSets[length].querySelector("#eoi_term_definition_" + id);
        eleTermDefinition.addEventListener('focusout', (event) => {
          let ele2 = event.target;
          let ele1Id = "eoi_term_" + id;
          let ele1 = document.getElementById(ele1Id);
          performSubmitAction(ele1, ele2);
        });
        var performSubmitAction = function (ele1, ele2) {
          if (ele1.value !== '' && ele2.value !== '') {
            let formElement = document.getElementById("ccs_eoi_acronyms_form");
            let action = formElement.getAttribute("action");
            action = action + "&stop_page_navigate=true";
            $.ajax({
              type: "POST",
              url: action,
              data: $("#ccs_eoi_acronyms_form").serialize(),
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
const checkFieldsEoi = () => {
  const start = 1;
  const end = 20;

  for (var a = start; a <= end; a++) {
    let input = $(`#eoi_term_${a}`)
    let textbox = $(`#eoi_term_definition_${a}`);


    if (input.val() !== "") {

      $(`#eoi_term_${a}-error`).remove();
      $(`.acronym_${a} div`).removeClass('govuk-form-group--error');
      $(`.acronym_${a} input`).removeClass('govuk-input--error')


    }
    if (textbox.val() !== "") {

      $(`#eoi_term_definition_${a}-error`).remove();
      $(`.acronym_${a} div`).removeClass('govuk-form-group--error');
      $(`.acronym_${a} textarea`).removeClass('govuk-input--error');
      $(`.acronym_${a} textarea`).removeClass('govuk-textarea--error')
    }

  }
}
const removeErrorFieldsEoi = () => {
  $('.govuk-error-message').remove();
  $('.govuk-form-group--error').removeClass('govuk-form-group--error')
  $('.govuk-error-summary').remove();
  $(".govuk-input").removeClass("govuk-input--error");
  $('.govuk-form-group textarea').removeClass('govuk-textarea--error');

}

const emptyFieldCheckEoi = (add_more='') => {
  let fieldCheck = "",
    errorStore = [];

  for (var x = 1; x < 21; x++) {
    let term_field = document.getElementById('eoi_term_' + x);
    let definition_field = document.getElementById("eoi_term_definition_" + x);
    if (term_field.closest("fieldset").classList.value.indexOf("ccs-dynaform-hidden") === -1) {
      checkFieldsEoi();
      
      if (term_field.value.trim() == '' && definition_field.value.trim() == '' && add_more=='add_more') {
        ccsZaddErrorMessage(term_field, 'Enter a term or acronym');
        ccsZaddErrorMessage(definition_field, 'Enter a definition for the term or acronym');
        //fieldCheck = [definition_field.id, 'You must add information in both fields.'];
        fieldCheck = [term_field, 'Enter a term or acronym'];
        errorStore.push(fieldCheck);
        fieldCheck = [definition_field, 'Enter a definition for the term or acronym'];
        errorStore.push(fieldCheck);
      }

      if (term_field.value.trim() !== '' && definition_field.value.trim() === '') {
        ccsZaddErrorMessage(definition_field, 'Enter a definition for the term or acronym');
        fieldCheck = [definition_field.id, 'Enter a definition for the term or acronym'];
        errorStore.push(fieldCheck);
      }
      if (term_field.value.trim() === '' && definition_field.value.trim() !== '') {
        ccsZaddErrorMessage(term_field, 'Enter a term or acronym');
        fieldCheck = [term_field.id, 'Enter a term or acronym'];
        errorStore.push(fieldCheck);
      }
    }
  }
  return errorStore;
}
const ccsZvalidateEoiAcronyms = (event) => {
  event.preventDefault();

  errorStore = emptyFieldCheckEoi();

  if (errorStore.length === 0) {

    document.forms["ccs_eoi_acronyms_form"].submit();
  }
  else {
    ccsZPresentErrorSummary(errorStore);

  }
};
