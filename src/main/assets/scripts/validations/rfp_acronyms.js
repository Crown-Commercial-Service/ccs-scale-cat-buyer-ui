const countWords1 = (str) => { return str?str.trim().split(/\s+/).length:false };
document.addEventListener('DOMContentLoaded', () => {

    if (document.getElementById("ccs_rfp_acronyms_form") !== null) {

        let q_mandatory;
        let agreementID;
        if(document.getElementById("q_mandatory")) q_mandatory = document.getElementById("q_mandatory").value;
        if(document.getElementById("agreementID")) agreementID = document.getElementById("agreementID").value;
        // let lID = document.getElementById("lID").value;

        let with_value_count = 20,
            prev_input = 0,
            deleteButtons = document.querySelectorAll("a.del");
        let clearFieldsButtons = document.querySelectorAll("a.clear-fields");
        let deleteButtonCount = [];
        for (var acronym_fieldset = 20; acronym_fieldset > 1; acronym_fieldset--) {


            let this_fieldset = document.querySelector(".acronym_" + acronym_fieldset),
                term_box = document.getElementById("rfp_term_" + acronym_fieldset); 
            // document.getElementById("deleteButton_acronym_" + acronym_fieldset).classList.add("ccs-dynaform-hidden");
            // if( agreementID == 'RM6187') {
                document.getElementById("deleteButton_acronym_" + acronym_fieldset).classList.remove("ccs-dynaform-hidden");
            // }

            if (term_box.value !== "") {
                this_fieldset.classList.remove('ccs-dynaform-hidden');
                deleteButtonCount.push(acronym_fieldset);
                if (acronym_fieldset === 20) {
                    document.getElementById("ccs_rfpTerm_add").classList.add('ccs-dynaform-hidden');
                }
            } else {

                this_fieldset.classList.add('ccs-dynaform-hidden');
                with_value_count = acronym_fieldset;
            }

            if (acronym_fieldset === 2 && deleteButtonCount.length > 0) {
                $("#deleteButton_acronym_" + deleteButtonCount[deleteButtonCount.sort((a, b) => a - b).length - 1]).removeClass("ccs-dynaform-hidden");
            }
        }
        if (deleteButtonCount.length != 19) {
            document.getElementById("ccs_rfpTerm_add").classList.remove("ccs-dynaform-hidden");
        }
        
        // document.getElementById("ccs_rfpTerm_add").classList.remove("ccs-dynaform-hidden");
        document.getElementById("ccs_rfpTerm_add").addEventListener('click', (e) => {
            $('.govuk-form-group textarea').removeClass('govuk-textarea--error');
            checkFieldsRfp1();
            e.preventDefault();
            errorStoreforOptional = emptyFieldCheckdos('addmore');
            if (errorStoreforOptional.length == 0) {
                errorStore = emptyFieldCheckRfp1();
                if (errorStore.length == 0) {
                    removeErrorFieldsRfp1();
                    let termvalue = document.getElementById('rfp_term_' + with_value_count).value;
                    let termdefvalue = document.getElementById('rfp_term_' + with_value_count).value;
                    if(termvalue != '' && termdefvalue != ''){
                    if(with_value_count == 20){
                        document.getElementById("ccs_rfpTerm_add").classList.add('ccs-dynaform-hidden');
                    }
                    else{
                    with_value_count++;
                    document.querySelector(".acronym_" + with_value_count).classList.remove("ccs-dynaform-hidden");
                    $("#deleteButton_acronym_" + with_value_count).removeClass("ccs-dynaform-hidden");
                    if (with_value_count === 20 ) {
                        document.getElementById("ccs_rfpTerm_add").classList.add('ccs-dynaform-hidden');
                    }
                    }
                  }
                  else{
                    document.querySelector(".acronym_" + with_value_count).classList.remove("ccs-dynaform-hidden");
                    $("#deleteButton_acronym_" + with_value_count).removeClass("ccs-dynaform-hidden");
                    // if(agreementID == 'RM1043.8' && q_mandatory != true) {
                    //     prev_input = with_value_count - 1;
                    //     if(document.querySelector(".acronym_" + prev_input + " a.del")){
                    //         document.querySelector(".acronym_" + prev_input + " a.del").classList.add("ccs-dynaform-hidden");
                    //     }
                    // }
                    with_value_count++;
                  }
                    // let hideBtnCount = agreementID == 'RM1043.8' && lID == '1' ? 17 : 21 ;
                    if (with_value_count === 21 ) {
                        document.getElementById("ccs_rfpTerm_add").classList.add('ccs-dynaform-hidden');
                    }
                } else ccsZPresentErrorSummary(errorStore);
            } else ccsZPresentErrorSummary(errorStoreforOptional);
        });

        // delete buttons
        deleteButtons.forEach((db) => {
            //db.classList.remove('ccs-dynaform-hidden')
            
            // db.addEventListener('click', (e) => {
            //     e.preventDefault();
            //     let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
            //         prev_coll = Number(target) - 1,
            //         target_fieldset = db.closest("fieldset");
            //     target_fieldset.classList.add("ccs-dynaform-hidden");
            //     document.getElementById('rfp_term_' + target).value = "";
            //     document.getElementById('rfp_term_definition_' + target).value = "";
            //     if (prev_coll > 1) {
            //         document.querySelector('.acronym_' + prev_coll + ' a.del').classList.remove("ccs-dynaform-hidden");
            //     }
            //     document.getElementById("ccs_rfpTerm_add").classList.remove('ccs-dynaform-hidden');
            //     with_value_count--;
            // });

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
                                document.getElementById('rfp_term_' + current_col).value = first.value;
                                document.getElementById('rfp_term_definition_' + current_col).value = last.value;
                                // target_fieldset.querySelector("[name='term']").value = first.value;
                                // target_fieldset.querySelector("[name='value']").value = last.value;
                            } else {
                                next_coll = next_coll + 1;
                                console.log(`Usual: ${ml} - ${next_coll}`)
                                var first = Sibling.querySelector("[name='term']");
                                var last  = Sibling.querySelector("[name='value']");
                                console.log(first.value)
                                console.log(last.value)
                                document.getElementById('rfp_term_' + next_coll).value = first.value;
                                document.getElementById('rfp_term_definition_' + next_coll).value = last.value;
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
                        document.getElementById('rfp_term_' + removeLogic).value = "";
                        document.getElementById('rfp_term_' + removeLogic).dispatchEvent(new Event("keyup"));

                        document.getElementById('rfp_term_definition_' + removeLogic).value = "";
                        document.getElementById('rfp_term_definition_' + removeLogic).dispatchEvent(new Event("keyup"));
                        document.getElementById('rfp_term_' + removeLogic).closest("fieldset").classList.add("ccs-dynaform-hidden")
                    } else {
                        target_fieldset.classList.add("ccs-dynaform-hidden");
                        document.getElementById('rfp_term_' + target).value = "";
                        document.getElementById('rfp_term_' + target).dispatchEvent(new Event("keyup"));
                        document.getElementById('rfp_term_definition_' + target).value = "";
                        document.getElementById('rfp_term_definition_' + target).dispatchEvent(new Event("keyup"));
                        if (prev_coll > 1) {
                            document.querySelector('.acronym_' + prev_coll + ' a.del').classList.remove("ccs-dynaform-hidden");
                        }
                        document.getElementById("ccs_rfpTerm_add").classList.remove('ccs-dynaform-hidden');
                    }
                } else {
                    target_fieldset.classList.add("ccs-dynaform-hidden");
                    document.getElementById('rfp_term_' + target).value = "";
                    document.getElementById('rfp_term_' + target).dispatchEvent(new Event("keyup"));
                    document.getElementById('rfp_term_definition_' + target).value = "";
                    document.getElementById('rfp_term_definition_' + target).dispatchEvent(new Event("keyup"));
                    if (prev_coll > 1) {
                        document.querySelector('.acronym_' + prev_coll + ' a.del').classList.remove("ccs-dynaform-hidden");
                    }
                    document.getElementById("ccs_rfpTerm_add").classList.remove('ccs-dynaform-hidden');
                }
                with_value_count--;
                if (with_value_count != 21) {
                    document.getElementById("ccs_rfpTerm_add").classList.remove("ccs-dynaform-hidden");
                }
            });
        });
        clearFieldsButtons.forEach((db) => {
            db.addEventListener('click', (e) => {

                e.preventDefault();
                let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
                    target_fieldset = db.closest("fieldset");
                    console.log('inside clear field target',target)

                target_fieldset.classList.add("ccs-dynaform");

                //document.getElementById('rfp_term_' + target).value = "";
                //document.getElementById('rfp_term_definition_' + target).value = "";
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
                    console.log('eleTerm',eleTerm,id)

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
                var performSubmitAction = function(ele1, ele2) {
                    console.log('inside submit')
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

   
    
});





const checkFieldsRfp1 = () => {
    const start = 1;
    const end = 20;
    const pageHeading = document.getElementById('page-heading').innerHTML;
    for (var a = start; a <= end; a++) {
        let input = $(`#rfp_term_${a}`)
        let textbox = $(`#rfp_term_definition_${a}`);

        if (!pageHeading.includes("(Optional)")) {
            const field1 = countWords1(input.val()) < 50;
            const field2 = countWords1(textbox.val()) < 150;
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
    $(".govuk-select").removeClass("govuk-select--error");
    $('.govuk-form-group textarea').removeClass('govuk-textarea--error');
    $('.govuk-form-group textarea').removeClass('govuk-textarea--error1');

}
let rfp_term_text = document.querySelectorAll('.rfpterm');
let rfp_term_definition = document.querySelectorAll('.rfp_term_definition');
let messagesendcountEle = document.querySelectorAll('.messagesendcount');
let subjecterror = document.querySelectorAll('#create_subject_input');
let classification_input = document.querySelectorAll('#create_message');
let supplier_error = document.querySelectorAll('#create_supplier_message');
let removeErr = document.querySelectorAll('.removeErr');
let removeErrCheckbox = document.querySelectorAll('.removeErrCheckbox');
removeErr.forEach(ele => {
    ele.addEventListener('keydown', (event) => {
        removeErrorFieldsRfp1();
    });
});
removeErrCheckbox.forEach(ele => {
    ele.addEventListener('change', (event) => {
        removeErrorFieldsRfp1();
    });
});
classification_input.forEach(ele => {
    ele.addEventListener('change', (event) => {
        removeErrorFieldsRfp1();
    });
});
supplier_error.forEach(ele => {
    ele.addEventListener('change', (event) => {
        removeErrorFieldsRfp1();
    });
});
subjecterror.forEach(ele => {
    ele.addEventListener('keydown', (event) => {
        removeErrorFieldsRfp1();
    });
});
rfp_term_text.forEach(ele => {
    ele.addEventListener('keydown', (event) => {
        removeErrorFieldsRfp1();
    });
});
rfp_term_definition.forEach(ele => {
    ele.addEventListener('keydown', (event) => {
        removeErrorFieldsRfp1();
    });
});
messagesendcountEle.forEach(ele => {
    ele.addEventListener('keydown', (event) => {
        removeErrorFieldsRfp1();
    });
});
const emptyFieldCheckdos = (type) => {
    let fieldCheck = "",
        errorStore = [];
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
    removeErrorFieldsRfp1();
    const pageHeading = document.getElementById('page-heading').innerHTML;
    
    if(pageHeading.trim() == 'Terms and acronyms (Optional)' || pageHeading.trim() == 'Terms and acronyms (optional)'){
        fieldMsg = 'Enter a term or acronym'
        descMsg = 'Enter a definition for the term or acronym';
    }else{
        fieldMsg = 'You must add information in all fields.';
        descMsg = 'You must add information in all fields.';
    }
    for (var x = 1; x < 21; x++) {
        let term_field = document.getElementById('rfp_term_' + x);
        let definition_field = document.getElementById("rfp_term_definition_" + x);

        if (term_field != null && term_field.value !== undefined && definition_field !== undefined) {
            
            if(type == 'addmore'){
                const field1 = countWords1(term_field.value) > 50;
                const field2 = countWords1(definition_field.value) > 150;
                if (term_field.closest("fieldset").classList.value.indexOf("ccs-dynaform-hidden") === -1) {
                    checkFieldsRfp1();
                         if (term_field.value.trim() === '') {
                            fieldCheck = [term_field.id, fieldMsg];
                            ccsZaddErrorMessage(term_field, fieldMsg);
                            errorStore.push(fieldCheck);
                        } 
                        if (definition_field.value.trim() === '') {
                            fieldCheck = [definition_field.id, descMsg];
                            //ccsZaddErrorMessage(term_field, 'You must add information in all fields.');
                            ccsZaddErrorMessage(definition_field, descMsg);
                            errorStore.push(fieldCheck);                        
                        } 
                }
            }else{
                if (!(term_field.value == '' && definition_field.value == '' || term_field.value != '' && definition_field.value != '') ) {
                    const field1 = countWords1(term_field.value) > 50;
                    const field2 = countWords1(definition_field.value) > 150;
                    if (term_field.closest("fieldset").classList.value.indexOf("ccs-dynaform-hidden") === -1) {
                        checkFieldsRfp1();
                            if (term_field.value.trim() === '') {
                                fieldCheck = [term_field.id, fieldMsg];
                                ccsZaddErrorMessage(term_field, fieldMsg);
                                errorStore.push(fieldCheck);
                            } else if (definition_field.value.trim() === '') {
                                fieldCheck = [definition_field.id, descMsg];
                                //ccsZaddErrorMessage(term_field, 'You must add information in all fields.');
                                ccsZaddErrorMessage(definition_field, descMsg);
                                errorStore.push(fieldCheck);                        
                            } 
                    }
                }
            }
        }

    }
    return errorStore;
}

const emptyFieldCheckRfp1 = () => {
    let fieldCheck = "",
        errorStore = [];
    removeErrorFieldsRfp1();
    const pageHeading = document.getElementById('page-heading').innerHTML;
    for (var x = 1; x < 21; x++) {
        let term_field = document.getElementById('rfp_term_' + x);
        let definition_field = document.getElementById("rfp_term_definition_" + x);

        if (term_field != null && term_field.value !== undefined && definition_field !== undefined) {
            const field1 = countWords1(term_field.value) > 50;
            const field2 = countWords1(definition_field.value) > 150;
            if (term_field.closest("fieldset").classList.value.indexOf("ccs-dynaform-hidden") === -1) {
                checkFieldsRfp1();
                if (!pageHeading.includes("Optional") && !pageHeading.includes("optional")) {
                    
                     if (term_field.value.trim() === '') {
                        fieldCheck = [term_field.id, 'You must add information in all fields.'];
                        ccsZaddErrorMessage(term_field, 'You must add information in all fields.');
                        errorStore.push(fieldCheck);
                    } else if (definition_field.value.trim() === '') {
                        fieldCheck = [definition_field.id, 'You must add information in all fields.'];
                        //ccsZaddErrorMessage(term_field, 'You must add information in all fields.');
                        ccsZaddErrorMessage(definition_field, 'You must add information in all fields.');
                        errorStore.push(fieldCheck);                        
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
                    //   if (field1) {
                    //     ccsZaddErrorMessage(term_field, 'No more than 50 words are allowed.');
                    //     isError = true;
                    //   }
                    //   if (field2) {
                    //     ccsZaddErrorMessage(definition_field, 'No more than 250 words are allowed.');
                    //     isError = true;
                    //   }
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

const emptyFieldCheckOptionalRfp1 = () => {
    let fieldCheck = "",
        errorStore = [];
    removeErrorFieldsRfp1();
    const pageHeading = document.getElementById('page-heading').innerHTML;
    const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            let LOTID_VAR;
            if(document.getElementById('lID') !== null) {
                LOTID_VAR = document.getElementById('lID').value;
            }
            if(urlParams.get('agreement_id') == 'RM1043.8' && urlParams.get('id') == 'Criterion 3' && ((LOTID_VAR == 1 && urlParams.get('group_id') == 'Group 19') || (LOTID_VAR == 3 && urlParams.get('group_id') == 'Group 17'))) {
                let term_field = document.getElementById('rfp_term_' + 1);
                let definition_field = document.getElementById("rfp_term_definition_" + 1);
                if (term_field != null && term_field.value !== undefined && term_field.value.trim() !== '') {
                    
                    if (term_field.closest("fieldset").classList.value.indexOf("ccs-dynaform-hidden") === -1) {
                        checkFieldsRfp1();
                            if (definition_field.value.trim() === '') {
                                fieldCheck = [definition_field.id, 'You must add information in all fields.'];
                                //ccsZaddErrorMessage(term_field, 'You must add information in all fields.');
                                ccsZaddErrorMessage(definition_field, 'You must add information in all fields.');
                                errorStore.push(fieldCheck);  
                                                      
                            } 
                    }
    
                   
                }
        
            }

    
    return errorStore;
}


const ccsZvalidateRfpAcronymsRFP = (event) => {

    event.preventDefault();
    // const classList = document.getElementsByClassName("govuk-hint-error-message");
    // const classLength = classList.length;


    // if (classLength != 0) {
    //     return false;
    // } else {
    //     // document.forms["ccs_rfp_acronyms_form"].submit();
    // }

    // return false;

    errorStoreforOptional = emptyFieldCheckdos('submit');
        if (errorStoreforOptional.length == 0) {
    
    errorStore = emptyFieldCheckRfp1();

    errorStore = errorStore == null || errorStore.length <= 0 ? emptyFieldCheckRfp1() : errorStore;
    console.log('Inside optional check errorStore after',errorStore)
   
    let term_field = document.getElementById('rfp_term_' + 1);
    let definition_field = document.getElementById("rfp_term_definition_" + 1);
    if (term_field != null && term_field.value !== undefined && term_field.value.trim() !== '') {
        if (definition_field != null && definition_field.value != undefined && definition_field.value.trim() == '') {

        errorStore =  emptyFieldCheckOptionalRfp1();
        }

    }


    if (errorStore.length === 0) {
        const classList = document.getElementsByClassName("govuk-hint-error-message");
        const classLength = classList.length;
    
    if (classLength != 0) {
        return false;
    } else {
        document.forms["ccs_rfp_acronyms_form"].submit();
    }
    
  }else {
    ccsZPresentErrorSummary(errorStore);
  }
} else ccsZPresentErrorSummary(errorStoreforOptional);
    //errorStore = emptyFieldCheckRfp();

    //if (errorStore.length === 0) {


    // Update at 02-08-2022 -> CCS For FC

    
    // if (errorStore.length === 0) { document.forms["ccs_rfp_acronyms_form"].submit(); } else { ccsZPresentErrorSummary(errorStore); }
};

var maxchars = 10000;

$('.rfp_term_definition').keyup(function(e) {
    var tlength = $(this).val().length;
    $(this).val($(this).val().substring(0, maxchars));
    var tlength = $(this).val().length;
    remain = maxchars - parseInt(tlength);
    $(this).text(remain);

});

let maxscount = 6;
$('.rfp_term_maxsupplycount').keyup(function(e) {
    if(document.getElementById("CurrentLotSupplierCount") !== null) {
        let initmax = document.getElementById("CurrentLotSupplierCount").value;
        if(initmax != "") {
            maxscount = parseInt(initmax);
            maxscount = maxscount.toString().length
        }
    }
    var tlength = $(this).val().length;
    $(this).val($(this).val().substring(0, maxscount));
    var tlength = $(this).val().length;
    remain = maxscount - parseInt(tlength);
    $(this).text(remain);

    // if(document.getElementById("CurrentLotSupplierCount") !== null) {
    //     let initmax = document.getElementById("CurrentLotSupplierCount").value;
    //     if(initmax != "") {
    //         //Error
    //         if(parseInt(initmax) < parseInt($(this).val())) {
    //             $(this).val("");
    //         }
    //     }
    // }
});

let maxscountscore = 3;
$('.percentage_limit').keyup(function(e) {
    var tlength = $(this).val().length;
    $(this).val($(this).val().substring(0, maxscountscore));
    var tlength = $(this).val().length;
    remain = maxscountscore - parseInt(tlength);
    $(this).text(remain);

});

    $('.percentage_limit_dos6').keypress(function (e) {
        var character = String.fromCharCode(e.keyCode)
          var strlen = this.value.length;
        if(strlen == 4) {
            if(character !== '.') {
              if(this.value[2] !== '.') {
                if(character !== undefined) {
                    e.preventDefault();
                    return false;
                }
            }
          }
        }
          
          var newValue = this.value + character;
          if (isNaN(newValue) || hasDecimalPlace(newValue, 3)) {
              e.preventDefault();
              return false;
          }
      });
      
      function hasDecimalPlace(value, x) {
          var pointIndex = value.indexOf('.');
          return  pointIndex >= 0 && pointIndex < value.length - x;
      }


var maxless = 10000;

$('.rfpterm').keyup(function(e) {
    var tlength = $(this).val().length;
    $(this).val($(this).val().substring(0, maxless));
    var tlength = $(this).val().length;
    remain = maxless - parseInt(tlength);
    $(this).text(remain);

});

var nameproject = 250;

$('.nameproject').keyup(function(e) {
    var tlength = $(this).val().length;

    $(this).val($(this).val().substring(0, nameproject));
    var tlength = $(this).val().length;
    remain = nameproject - parseInt(tlength);
    $(this).text(remain);

});

$(".nameproject").keypress(function(e) {
    var maxLen = $(this).val().length;
    var keyCode = e.which;

    if (maxLen >= 250 && (keyCode != 8) && (keyCode < 48 || keyCode > 57)) {
        return false;
    }

});

var nameprojectdos = 500;

$('.nameprojectdos').keyup(function(e) {
    var tlength = $(this).val().length;

    $(this).val($(this).val().substring(0, nameprojectdos));
    var tlength = $(this).val().length;
    remain = nameprojectdos - parseInt(tlength);
    $(this).text(remain);

});

$(".nameprojectdos").keypress(function(e) {
    var maxLen = $(this).val().length;
    var keyCode = e.which;

    if (maxLen >= 500 && (keyCode != 8) && (keyCode < 48 || keyCode > 57)) {
        return false;
    }

});



$(".rfpterm").keypress(function(e) {
    var maxLen = $(this).val().length;
    var keyCode = e.which;

    if (maxLen >= 500 && (keyCode != 8) && (keyCode < 48 || keyCode > 57)) {
        return false;
    }

});

$(".rfp_term_definition").keypress(function(e) {
    var maxLen = $(this).val().length;
    var keyCode = e.which;

    if (maxLen >= 10000 && (keyCode != 8) && (keyCode < 48 || keyCode > 57)) {
        return false;
    }

});

var messagesendcount = 5000;

$('.messagesendcount').keyup(function(e) {
    var tlength = $(this).val().length;
    
    $(this).val($(this).val().substring(0, messagesendcount));
    var tlength = $(this).val().length;
    remain = messagesendcount - parseInt(tlength);
    $(this).text(remain);

});

$(".messagesendcount").keypress(function(e) {
    var maxLen = $(this).val().length;
    
    var keyCode = e.which;

    if (maxLen >= 5000 && (keyCode != 8) && (keyCode < 48 || keyCode > 57)) {
        return false;
    }

});


var messagesendcountDaSocial = 2000;

$('.messagesendcountDaSocial').keyup(function(e) {
    var tlength = $(this).val().length;

    $(this).val($(this).val().substring(0, messagesendcountDaSocial));
    var tlength = $(this).val().length;
    remain = messagesendcountDaSocial - parseInt(tlength);
    $(this).text(remain);

});

$(".messagesendcountDaSocial").keypress(function(e) {
    var maxLen = $(this).val().length;
    var keyCode = e.which;

    if (maxLen >= 2000 && (keyCode != 8) && (keyCode < 48 || keyCode > 57)) {
        return false;
    }

});
$('.rfp_term_definition_new').on('keypress', function (evt) {
    let value = $(this).val();
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
    
});
