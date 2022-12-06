if ($('#eoi_splterm').length > 0) {
  $('.eoi_form').attr('id', 'ccs_eoi_splterms_form');
  $('.eoi_form').attr('name', 'ccs_eoi_splterms_form');
}


document.addEventListener('DOMContentLoaded', () => {

  if (document.getElementById("ccs_eoi_splterms_form") !== null) {

    let with_value_count = 10,
      prev_input = 0,
      filled_input = 0,
      deleteButtons = document.querySelectorAll("a.del");
    let clearFieldsButtons = document.querySelectorAll("a.clear-fields");

    for (var acronym_fieldset = 10; acronym_fieldset > 1; acronym_fieldset--) {


      let this_fieldset = document.querySelector(".splterm_" + acronym_fieldset),
        term_box = document.getElementById("eoi_splterm_" + acronym_fieldset);

      if (term_box.value !== "") {
        this_fieldset.classList.remove('ccs-dynaform-hidden');

        if (acronym_fieldset === 10) {
          document.getElementById("ccs_eoisplTerm_add").classList.add('ccs-dynaform-hidden');
        }

      } else {

        this_fieldset.classList.add('ccs-dynaform-hidden');
        with_value_count = acronym_fieldset;
        filled_input++;
      }

    }
    document.getElementById("ccs_eoisplTerm_add").classList.remove("ccs-dynaform-hidden");

    if(filled_input===0){
    
      document.getElementById("ccs_eoisplTerm_add").classList.add('ccs-dynaform-hidden');
    }


    document.getElementById("ccs_eoisplTerm_add").addEventListener('click', (e) => {



      $('.govuk-form-group textarea').removeClass('govuk-textarea--error');
      checkFieldsEoiTerms();

      e.preventDefault();
      errorStore = emptyFieldCheckEoiTerms("add_more");
      if (errorStore.length == 0) {

        removeErrorFieldsEoiTerms();


        document.querySelector(".splterm_" + with_value_count).classList.remove("ccs-dynaform-hidden");

        if (with_value_count > 2) {
          prev_input = with_value_count - 1;
          // document.querySelector(".splterm_" + prev_input + " a.del").classList.add("ccs-dynaform-hidden");
        }

        with_value_count++;

        if (with_value_count === 11) {
          document.getElementById("ccs_eoisplTerm_add").classList.add('ccs-dynaform-hidden');
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
                    
                    document.getElementById('eoi_splterm_' + current_col).value = first.value;
                    //document.getElementById('eoi_term_definition_' + current_col).value = last.value;
                    // target_fieldset.querySelector("[name='term']").value = first.value;
                    // target_fieldset.querySelector("[name='value']").value = last.value;
                } else {
                    next_coll = next_coll + 1;
                    console.log(`Usual: ${ml} - ${next_coll}`)
                    var first = Sibling.querySelector("[name='term']");
                    
                  
                    document.getElementById('eoi_splterm_' + next_coll).value = first.value;
                   
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
            document.getElementById('eoi_splterm_' + removeLogic).value = "";
           
            document.getElementById('eoi_splterm_' + removeLogic).closest("fieldset").classList.add("ccs-dynaform-hidden")
        } else {
            target_fieldset.classList.add("ccs-dynaform-hidden");
            document.getElementById('eoi_splterm_' + target).value = "";
           
            if (prev_coll > 1) {
                document.querySelector('.splterm_' + prev_coll + ' a.del').classList.remove("ccs-dynaform-hidden");
            }
            document.getElementById("ccs_eoisplTerm_add").classList.remove('ccs-dynaform-hidden');
        }
    } else {
        target_fieldset.classList.add("ccs-dynaform-hidden");
        document.getElementById('eoi_splterm_' + target).value = "";
       
        if (prev_coll > 1) {
            document.querySelector('.splterm_' + prev_coll + ' a.del').classList.remove("ccs-dynaform-hidden");
        }
        document.getElementById("ccs_eoisplTerm_add").classList.remove('ccs-dynaform-hidden');
    }
    with_value_count--;
    if (with_value_count != 21) {
        document.getElementById("ccs_eoisplTerm_add").classList.remove("ccs-dynaform-hidden");
    }
});

        // let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
        //   prev_coll = Number(target) - 1,
        //   target_fieldset = db.closest("fieldset");

        // target_fieldset.classList.add("ccs-dynaform-hidden");

        // document.getElementById('eoi_splterm_' + target).value = "";
        // // document.getElementById('eoi_splterm_definition_' + target).value = "";


        // if (prev_coll > 1) {
        //   document.querySelector('.splterm_' + prev_coll + ' a.del').classList.remove("ccs-dynaform-hidden");
        // }

        // document.getElementById("ccs_eoisplTerm_add").classList.remove('ccs-dynaform-hidden');
        // with_value_count--;
    //  });
    });
    clearFieldsButtons.forEach((db) => {
      db.addEventListener('click', (e) => {

        e.preventDefault();

        let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
          target_fieldset = db.closest("fieldset");

        target_fieldset.classList.add("ccs-dynaform");

        document.getElementById('eoi_splterm_' + target).value = "";
        document.getElementById('eoi_splterm_definition_' + target).value = "";
        removeErrorFieldsEoiTerms();
      });

    });


    if (document.getElementsByClassName("term_fieldset").length > 0) {
      let fieldSets = document.getElementsByClassName("term_fieldset");
      let length = fieldSets.length;
      while (length--) {
        let id = length + 1;
        let eleTerm = fieldSets[length].querySelector("#eoi_splterm_" + id);
        eleTerm.addEventListener('focusout', (event) => {
          let ele1 = event.target;
          let definitionElementId = "eoi_splterm_definition_" + id;
          let ele2 = document.getElementById(definitionElementId);
          performSubmitActionSpecial(ele1, ele2);

        });
        let eleTermDefinition = fieldSets[length].querySelector("#eoi_splterm_definition_" + id);
        if(eleTermDefinition!=undefined){
        eleTermDefinition.addEventListener('focusout', (event) => {
          let ele2 = event.target;
          let ele1Id = "eoi_splterm_" + id;
          let ele1 = document.getElementById(ele1Id);
          performSubmitAction(ele1, ele2);
        });
      }else{
        eleTerm.addEventListener('focusout', (event) => {
          
          let ele1Id = "eoi_splterm_" + id;
          let ele1 = document.getElementById(ele1Id);
          performSubmitActionSpecial(ele1);
        });
      }

      var performSubmitActionSpecial = function (ele1) {
        if (ele1.value !== '') {
          let formElement = document.getElementById("ccs_eoi_splterms_form");
          let action = formElement.getAttribute("action");
          action = action + "&stop_page_navigate=true";
          $.ajax({
            type: "POST",
            url: action,
            data: $("#ccs_eoi_splterms_form").serialize(),
            success: function () {

              //success message mybe...
            }
          });
        }
      };

        var performSubmitAction = function (ele1, ele2) {
          if (ele1.value !== '' && ele2.value !== '') {
            let formElement = document.getElementById("ccs_eoi_splterms_form");
            let action = formElement.getAttribute("action");
            action = action + "&stop_page_navigate=true";
            $.ajax({
              type: "POST",
              url: action,
              data: $("#ccs_eoi_splterms_form").serialize(),
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
const checkFieldsEoiTerms = () => {
  const start = 1;
  const end = 10;

  for (var a = start; a <= end; a++) {
    let input = $(`#eoi_splterm_${a}`)
    let textbox = $(`#eoi_splterm_definition_${a}`);


    if (input.val() !== "") {

      $(`#eoi_splterm_${a}-error`).remove();
      $(`.splterm_${a} div`).removeClass('govuk-form-group--error');
      $(`.splterm_${a} input`).removeClass('govuk-input--error')


    }
    if (textbox.val() !== "") {

      $(`#eoi_splterm_definition_${a}-error`).remove();
      $(`.splterm_${a} div`).removeClass('govuk-form-group--error');
      $(`.splterm_${a} textarea`).removeClass('govuk-input--error');
      $(`.splterm_${a} textarea`).removeClass('govuk-textarea--error')
    }

  }
}
const removeErrorFieldsEoiTerms = () => {
  $('.govuk-error-message').remove();
  $('.govuk-form-group--error').removeClass('govuk-form-group--error')
  $('.govuk-error-summary').remove();
  $(".govuk-input").removeClass("govuk-input--error");
  $('.govuk-form-group textarea').removeClass('govuk-textarea--error');

}

const emptyFieldCheckEoiTerms = (add_more='') => {
  let fieldCheck = "",
    errorStore = [];
  checkFieldsEoiTerms();
  let termFieldError = false, defFieldError = false;
  for (var x = 1; x < 11; x++) {
    let term_field = document.getElementById('eoi_splterm_' + x);
    let definition_field = document.getElementById("eoi_splterm_definition_" + x);
    if (term_field.closest("fieldset").classList.value.indexOf("ccs-dynaform-hidden") === -1) {
      //
     // if (term_field.value.trim() !== '' && definition_field.value.trim() === '') {
      const pageHeading = document.getElementById('page-heading').innerHTML;
      if (term_field.value.trim() !== '' && (!pageHeading.includes('Optional') || add_more=='add_more')) {
        //ccsZaddErrorMessage(definition_field, 'You must explain the special term or condition.');
        //fieldCheck = [definition_field.id, 'You must explain the special term or condition.'];
        //errorStore.push(fieldCheck);
      }
      //if (term_field.value.trim() === '' && definition_field.value.trim() !== '') {
        if(!pageHeading.includes('Optional') || add_more=='add_more'){  
        if (term_field.value.trim() === '' ) {
        ccsZaddErrorMessage(term_field, 'You must add special term or condition.');
        fieldCheck = [term_field.id, 'You must add special term or condition.'];
        errorStore.push(fieldCheck);
      }

      if (term_field.value != null && term_field.value != undefined && term_field.value.length > 10000) {
        ccsZaddErrorMessage(term_field, 'Term and condition title must be 100 characters or fewer');
        termFieldError = true;
      }
    }

    }
  }
  if (termFieldError) {
    fieldCheck = ["#", 'Term and condition title must be 500 characters or fewer'];
    errorStore.push(fieldCheck);
  }
  if (defFieldError) {
    fieldCheck = ["#", 'Term and condition description must be 10000 characters or fewer'];
    errorStore.push(fieldCheck);
  }
  return errorStore;
}

const ccsZvalidateEoiSpecialTerms = (event) => {
  event.preventDefault();

  errorStore = emptyFieldCheckEoiTerms();

  if (errorStore.length === 0) {

    document.forms["ccs_eoi_splterms_form"].submit();
  }
  else {
    ccsZPresentErrorSummary(errorStore);

  }
};