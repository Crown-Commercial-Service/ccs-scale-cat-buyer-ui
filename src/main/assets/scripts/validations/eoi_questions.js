document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById("ccs_eoi_questions_form") !== null) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    let with_value_count = 10,
      prev_input = 0,
      filled_input = 0,
      deleteButtons = document.querySelectorAll("a.del");

    for (var text_box_num = 10; text_box_num > 1; text_box_num--) {

      let this_box = document.getElementById("eoi_question_" + text_box_num);

      if (this_box.value !== "") {
        this_box.classList.remove('ccs-dynaform-hidden');

        if (text_box_num === 10) {
          document.getElementById("ccs_criteria_add").classList.add('ccs-dynaform-hidden');
        }

      } else {
       
        document.querySelector('#fc_question_' + text_box_num).classList.add("ccs-dynaform-hidden");
        //let the_label = document.querySelector('label[for=eoi_question_' + text_box_num + ']');
        document.getElementById("eoi_question_"+text_box_num+"-info" ).classList.add('ccs-dynaform-hidden');
        //the_label.classList.add('ccs-dynaform-hidden');
        filled_input++;
        with_value_count = text_box_num;
      }

    }
   

    document.getElementById("ccs_criteria_add").classList.remove("ccs-dynaform-hidden");

    if(filled_input===0){
    
        document.getElementById("ccs_criteria_add").classList.add('ccs-dynaform-hidden');
      }

    document.getElementById("ccs_criteria_add").addEventListener('click', (e) => {
      e.preventDefault();
      $(".govuk-error-summary").remove();
      errorStore = emptyObjectiveFieldCheck();
      if (errorStore.length == 0) {

        document.getElementById("eoi_question_" + with_value_count).classList.remove("ccs-dynaform-hidden");

        document.querySelector('#fc_question_' + with_value_count).classList.remove("ccs-dynaform-hidden");

        document.querySelector('label[for=eoi_question_' + with_value_count + ']').classList.remove("ccs-dynaform-hidden");
        document.getElementById("eoi_question_"+with_value_count+"-info" ).classList.remove('ccs-dynaform-hidden');

        if (with_value_count > 2) {
          prev_input = with_value_count - 1;
          // document.querySelector('label[for=eoi_question_' + prev_input + '] a.del').classList.add("ccs-dynaform-hidden");
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
       
        $('.govuk-error-message').html('');
        e.preventDefault();
        console.log("e.target.href",e.target.href);
        let target = e.target.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
        prev_coll = Number(target) - 1,
       target_fieldset = db.closest("div");

                let Sibling = target_fieldset.nextElementSibling; //document.getElementById(e.target.id).nextElementSibling;
                let next_coll = Number(target);
                    let nextLevel_coll = Number(target);
                if(target != 20) {
                    let ml = 1;
                 
                    let eptArr = [];
                    while (Sibling) {
                        
                        let siblingClassList = Sibling.classList;
                        if (Object.keys(siblingClassList).find(key => siblingClassList[key] === 'closeCCS') !== undefined && Object.keys(siblingClassList).find(key => siblingClassList[key] === 'ccs-dynaform-hidden') === undefined) {
                           let current_col = nextLevel_coll;
                            nextLevel_coll = (nextLevel_coll + 1);

                            eptArr.push(nextLevel_coll)
                            if(ml == 1) {
                                console.log(`First: ${ml} - ${next_coll}`)
                                console.log("nextLevel_coll",nextLevel_coll);
                                console.log("current_col",current_col);
                                
                                first = document.getElementById('eoi_question_'+nextLevel_coll).value;
                                console.log("first",first);
                                document.getElementById('eoi_question_'+current_col).value=first;
                               
                                
                            } else {
                                next_coll = next_coll + 1;

                                first = document.getElementById('eoi_question_'+nextLevel_coll).value;
                                console.log("first",first);
                                document.getElementById('eoi_question_'+current_col).value=first;
                               
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
                        document.getElementById('eoi_question_' + removeLogic).value = "";
                        document.getElementById('eoi_question_' + removeLogic).dispatchEvent(new Event("keyup"));
                        document.getElementById('fc_question_' + removeLogic).closest("div").classList.add("ccs-dynaform-hidden")
                    } else {
                        target_fieldset.classList.add("ccs-dynaform-hidden");
                        document.getElementById('eoi_question_' + target).value = "";
                        document.getElementById('eoi_question_' + target).dispatchEvent(new Event("keyup"));
                        if (prev_coll > 1) {
                          document.querySelector('#fc_question_' + next_coll).classList.add("ccs-dynaform-hidden");
                        }
                        document.getElementById("ccs_criteria_add").classList.remove('ccs-dynaform-hidden');
                    }
                } else {
                    target_fieldset.classList.add("ccs-dynaform-hidden");
                    document.getElementById('eoi_question_' + target).value = "";
                    document.getElementById('eoi_question_' + target).dispatchEvent(new Event("keyup"));
                    if (prev_coll > 1) {
                      document.querySelector('#main_eoi_question_' + next_coll).classList.add("ccs-dynaform-hidden");
                    }
                    document.getElementById("ccs_criteria_add").classList.remove('ccs-dynaform-hidden');
                }
                with_value_count--;
                if (with_value_count != 21) {
                    document.getElementById("ccs_criteria_add").classList.remove("ccs-dynaform-hidden");
                }


      //   e.preventDefault();
    
      //   let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
      //     prev_box = Number(target) - 1;
      //   document.getElementById('eoi_question_' + target).value = "";
      //   document.getElementById('eoi_question_' + target).classList.add("ccs-dynaform-hidden");
      //   let parentNode = document.querySelector('label[for=eoi_question_' + target + ']').parentNode;
      //   if (parentNode.children["eoi_question_" + target + '-error'] !== undefined) {
      //     parentNode.removeChild(document.getElementById("eoi_question_" + target + '-error'))
      //     parentNode.classList.remove("govuk-form-group--error");
      //     parentNode.children["eoi_question_" + target].classList.remove("govuk-input--error");
      //   }
      //   //document.getElementById('eoi_question_' + target + '-error').parentNode.removeChild(document.getElementById('eoi_question_' + target + '-error'));
      //   document.querySelector('label[for=eoi_question_' + target + ']').classList.add("ccs-dynaform-hidden");
      //   document.getElementById("eoi_question_"+target+"-info" ).classList.add('ccs-dynaform-hidden');
      //   if (prev_box > 1) {
      //     document.querySelector('label[for=eoi_question_' + prev_box + '] a.del').classList.remove("ccs-dynaform-hidden");
      //   }
      //   document.getElementById("ccs_criteria_add").classList.remove('ccs-dynaform-hidden');
      //   with_value_count--;
       });


    });


    let length = 11;
    while (--length) {
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

  

  const emptyObjectiveFieldCheck = () => {
    var words = ['','first ','second ','third ','fourth ', 'fifth ','sixth','seventh ','eighth ','nineth ','tenth'];

    let fieldCheck = "",
      errorStore = [];

    let errorText = '';
    if ($("#page-heading").text().includes("Project scope")) {
      errorText = "You must type first project scope before you can add another"
    } else {
      errorText = "Enter an objective before attempting to add another"
    }
    fieldCheck = ccsZvalidateWithRegex("eoi_question_1", errorText, /\w+/);
    if (fieldCheck !== true) errorStore.push(fieldCheck);
    for (var i = 2; i < 11; i++) {
      if (!document.getElementById("fc_question_" + i).classList.contains('ccs-dynaform-hidden')) {
        if ($("#page-heading").text().includes("Project scope")) {
          errorText = `You must type ${words[i]} project scope before you can add another`;
        }
        fieldCheck = ccsZvalidateWithRegex("eoi_question_" + i, errorText, /\w+/);
        if (fieldCheck !== true) errorStore.push(fieldCheck);
      }
    }
    return errorStore;
  };
});

const emptyObjectiveFieldCheckForSave = () => {
  let fieldCheck = "",
    errorStore = [];
  if ($("#page-heading").text().includes("Project objectives"))
  if(urlParams.get('agreement_id') == 'RM6187'){
    fieldCheck = ccsZvalidateWithRegex("eoi_question_1", "Enter at least 1 project objective", /\w+/);
  }else{
    fieldCheck = ccsZvalidateWithRegex("eoi_question_1", "You must add at least one objective", /\w+/);
  }
    
  if (fieldCheck !== true && ($("#page-heading").text().includes("Project objectives"))) errorStore.push(fieldCheck);
  return errorStore;
};

const ccsZvalidateEoIQuestions = (event) => {
  event.preventDefault();
  errorStore = emptyObjectiveFieldCheckForSave();

  //}

  if (errorStore.length === 0) document.forms["ccs_eoi_questions_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};

$('.add').addClass('ccs-dynaform-hidden');
