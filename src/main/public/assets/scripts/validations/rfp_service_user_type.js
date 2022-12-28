
const countWords = (str) => { return str.trim().split(/\s+/).length };
document.addEventListener('DOMContentLoaded', () => {

    if (document.getElementById("service_user_type_form") !== null) {

        var urlParam = new URLSearchParams(window.location.search);
        var agreement_Id = urlParam.get("agreement_id");
       
       if(agreement_Id == "RM1557.13"){
        document.getElementById('service_user_type_form').addEventListener('submit', ccsZvalidateRfpAcronyms);
       }

        let with_value_count = 10,
            prev_input = 0,
            deleteButtons = document.querySelectorAll("a.del");
        let clearFieldsButtons = document.querySelectorAll("a.clear-fields");
        let deleteButtonCount = [];
        for (var acronym_fieldset = 10; acronym_fieldset > 1; acronym_fieldset--) {


            let this_fieldset = document.querySelector(".acronym_service_" + acronym_fieldset),
                term_box = document.getElementById("rfp_term_service_group_" + acronym_fieldset);
               document.getElementById("deleteButton_service_useer_type_" + acronym_fieldset).classList.remove("ccs-dynaform-hidden");
              
            if (term_box != undefined && term_box != null && term_box.value !== "") {
                this_fieldset.classList.remove('ccs-dynaform-hidden');
                deleteButtonCount.push(acronym_fieldset);
                if (acronym_fieldset === 10) {

                    // document.getElementById("ccs_rfpTerm_add").classList.add('ccs-dynaform-hidden');
                    document.getElementById("ccs_rfpService_use_type_add").classList.add('ccs-dynaform-hidden');
                }

            } else {

                this_fieldset.classList.add('ccs-dynaform-hidden');
                with_value_count = acronym_fieldset;
            }


        }

        if (deleteButtonCount.length != 9) {
            document.getElementById("ccs_rfpService_use_type_add").classList.remove("ccs-dynaform-hidden");
        }


        document.getElementById("ccs_rfpService_use_type_add").addEventListener('click', (e) => {
            removeErrorFieldsRfpScoreQuestion()
            //checkFieldsRfp();
            errorStore = [];
            e.preventDefault();
            var urlParams = new URLSearchParams(window.location.search);
            var agreement_id = urlParams.get("agreement_id");
            var group_id = urlParams.get("group_id");
            var criterion = urlParams.get("id");
            let last_value = with_value_count - 1;
            let groupName='',groupDetails='';
            const group_name = document.querySelector('#rfp_term_service_group_' + last_value).value;
            const group_details =  document.querySelector('#rfp_term_more_details_' + last_value).value;
            const hidden = document.querySelector(".acronym_service_" + last_value).classList.contains("ccs-dynaform-hidden")
        if( (group_name == '' || group_details == '') ){
            if(group_name == '') {
                if(agreement_id == "RM1043.8" && group_id == "Group 9" && criterion == 'Criterion 3'){
                  groupName = ccsZvalidateWithRegex('rfp_term_service_group_' + last_value , "Enter a user type", /\w+/);
                }
                else{
                    groupName = ccsZvalidateWithRegex('rfp_term_service_group_' + last_value , "You must enter information here", /\w+/);
                }
            }
            if(group_details == ''){
                if(agreement_id == "RM1043.8" && group_id == "Group 9" && criterion == 'Criterion 3'){
                    groupDetails = ccsZvalidateWithRegex('rfp_term_more_details_' + last_value , "Enter details about your users", /\w+/);
                }
                else{
                    groupDetails = ccsZvalidateWithRegex('rfp_term_more_details_' + last_value , "You must enter information here", /\w+/);
                }
            }  
           
            // else{
            //  if(group_name == '')  groupName = ccsZvalidateWithRegex('rfp_term_service_group_' + last_value , "You must enter information here11", /\w+/);
            //  if(group_details == '')  groupDetails = ccsZvalidateWithRegex('rfp_term_more_details_' + last_value , "You must enter information here12", /\w+/);
            // }
            if(groupName !== true) errorStore.push(groupName);
            if(groupDetails !== true) errorStore.push(groupDetails);

            if(errorStore.length != 0){
            ccsZPresentErrorSummary(errorStore);
            }
            

        }else if(errorStore.length ==0) {
            removeErrorFieldsRfpScoreQuestion()
            document.querySelector(".acronym_service_" + with_value_count).classList.remove("ccs-dynaform-hidden");

        }
            // if (with_value_count > 2) {
            //     prev_input = with_value_count - 1;
            //     document.querySelector(".acronym_service_" + prev_input + " a.del").classList.add("ccs-dynaform-hidden");
            // }

           
            // console.log('with_value_count',with_value_count)
            if (with_value_count === 10) {
                document.getElementById("ccs_rfpService_use_type_add").classList.add('ccs-dynaform-hidden');
            }
            if(errorStore.length == 0){
                if($("#deleteButton_service_useer_type_" + last_value)){
                    $("#deleteButton_service_useer_type_" + last_value).removeClass("ccs-dynaform-hidden");
                }
                with_value_count++;
            }
        });

        // delete buttons
        deleteButtons.forEach((db) => {
            // db.classList.remove('ccs-dynaform-hidden')
            db.addEventListener('click', (e) => {
                e.preventDefault();

                let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
                    prev_coll = Number(target) - 1,
                    target_fieldset = db.closest("fieldset");

                // target_fieldset.classList.add("ccs-dynaform-hidden");

                // document.getElementById('rfp_term_service_group_' + target).value = "";
                // document.getElementById('rfp_term_more_details_' + target).value = "";


                // if (prev_coll > 1) {
                //     document.querySelector('.acronym_service_' + prev_coll + ' a.del').classList.remove("ccs-dynaform-hidden");
                // }

                // document.getElementById("ccs_rfpService_use_type_add").classList.remove('ccs-dynaform-hidden');
                let Sibling = target_fieldset.nextElementSibling; //document.getElementById(e.target.id).nextElementSibling;
                console.log(`target: ${target}`)

                if(target != 10) {
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
                                document.getElementById('rfp_term_service_group_' + current_col).value = first.value;
                                document.getElementById('rfp_term_more_details_' + current_col).value = last.value;
                                // target_fieldset.querySelector("[name='term']").value = first.value;
                                // target_fieldset.querySelector("[name='value']").value = last.value;
                            } else {
                                next_coll = next_coll + 1;
                                console.log(`Usual: ${ml} - ${next_coll}`)
                                var first = Sibling.querySelector("[name='term']");
                                var last  = Sibling.querySelector("[name='value']");
                                console.log(first.value)
                                console.log(last.value)
                                document.getElementById('rfp_term_service_group_' + next_coll).value = first.value;
                                document.getElementById('rfp_term_more_details_' + next_coll).value = last.value;
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
                        document.getElementById('rfp_term_service_group_' + removeLogic).value = "";
                        document.getElementById('rfp_term_more_details_' + removeLogic).value = "";
                        document.getElementById('rfp_term_service_group_' + removeLogic).closest("fieldset").classList.add("ccs-dynaform-hidden")
                    } else {
                        // target_fieldset.classList.add("ccs-dynaform-hidden");
                        // document.getElementById('rfp_term_' + target).value = "";
                        // document.getElementById('rfp_term_definition_' + target).value = "";
                        // if (prev_coll > 1) {
                        //     document.querySelector('.acronym_' + prev_coll + ' a.del').classList.remove("ccs-dynaform-hidden");
                        // }
                        // document.getElementById("ccs_rfpTerm_add").classList.remove('ccs-dynaform-hidden');
                         target_fieldset.classList.add("ccs-dynaform-hidden");
                         document.getElementById('rfp_term_service_group_' + target).value = "";
                         document.getElementById('rfp_term_more_details_' + target).value = "";
                        if (prev_coll > 1) {
                            document.querySelector('.acronym_service_' + prev_coll + ' a.del').classList.remove("ccs-dynaform-hidden");
                        }
                        document.getElementById("ccs_rfpService_use_type_add").classList.remove('ccs-dynaform-hidden');
                    }
                } else {
                    // target_fieldset.classList.add("ccs-dynaform-hidden");
                    // document.getElementById('rfp_term_' + target).value = "";
                    // document.getElementById('rfp_term_definition_' + target).value = "";
                    // if (prev_coll > 1) {
                    //     document.querySelector('.acronym_' + prev_coll + ' a.del').classList.remove("ccs-dynaform-hidden");
                    // }
                    // document.getElementById("ccs_rfpTerm_add").classList.remove('ccs-dynaform-hidden');
                         target_fieldset.classList.add("ccs-dynaform-hidden");
                         document.getElementById('rfp_term_service_group_' + target).value = "";
                         document.getElementById('rfp_term_more_details_' + target).value = "";
                        if (prev_coll > 1) {
                            document.querySelector('.acronym_service_' + prev_coll + ' a.del').classList.remove("ccs-dynaform-hidden");
                        }
                        document.getElementById("ccs_rfpService_use_type_add").classList.remove('ccs-dynaform-hidden');
                }

                with_value_count--;
                if (with_value_count != 11) {
                    document.getElementById("ccs_rfpService_use_type_add").classList.remove('ccs-dynaform-hidden');

                }
            });
        });
        clearFieldsButtons.forEach((db) => {
            db.addEventListener('click', (e) => {

                e.preventDefault();

                let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
                    target_fieldset = db.closest("fieldset");

                target_fieldset.classList.add("ccs-dynaform");

               // document.getElementById('rfp_term_service_group_' + target).value = "";
                //document.getElementById('rfp_term_more_details_' + target).value = "";
                // removeErrorFieldsRfp();
            });

        });

        if(deleteButtonCount.length >= 2){
            deleteButtonCount.forEach((val,index)=>{
                if(index == 0){
                    $("#deleteButton_service_useer_type_" + val).removeClass("ccs-dynaform-hidden");
                }else {
                //    $("#deleteButton_service_useer_type_" + val).addClass("ccs-dynaform-hidden");
                }
            })
        }


    }
});

const removeErrorFieldsRfpScoreQuestion = () => {
    $('.govuk-error-message').remove();
    $('.govuk-form-group--error').removeClass('govuk-form-group--error');
    $('.govuk-error-summary').remove();
    $('.govuk-input').removeClass('govuk-input--error');
    $('.govuk-form-group textarea').removeClass('govuk-textarea--error');
};


const checkFieldsRfp = () => {
    const start = 1;
    const end = 10;
    const pageHeading = document.getElementById('page-heading').innerHTML;
    for (var a = start; a <= end; a++) {
        let input = $(`#rfp_term_${a}`)
        let textbox = $(`#rfp_term_definition_${a}`);

        if (!pageHeading.includes("(Optional)")) {
            const field1 = countWords(input.val()) < 50;
            const field2 = countWords(textbox.val()) < 150;
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
const removeErrorFieldsRfp = () => {
    $('.govuk-error-message').remove();
    $('.govuk-form-group--error').removeClass('govuk-form-group--error')
    $('.govuk-error-summary').remove();
    $(".govuk-input").removeClass("govuk-input--error");
    $('.govuk-form-group textarea').removeClass('govuk-textarea--error');

}

const emptyFieldCheckRfp = () => {
    let fieldCheck = "",
        errorStore = [];
    const pageHeading = document.getElementById('page-heading').innerHTML;
    for (var x = 1; x < 11; x++) {
        let term_field = document.getElementById('rfp_term_' + x);
        let definition_field = document.getElementById("rfp_term_definition_" + x);
        let target_field = document.getElementById("rfp_term_target_" + x);

        if (term_field.value !== undefined && definition_field !== undefined) {
            const field1 = countWords(term_field.value) > 50;
            const field2 = countWords(definition_field.value) > 150;

            if (term_field.closest("fieldset").classList.value.indexOf("ccs-dynaform-hidden") === -1) {
                checkFieldsRfp();
                if (!pageHeading.includes("(Optional)")) {
                    if (term_field.value.trim() === '' && definition_field.value.trim() === '') {
                        fieldCheck = [definition_field.id, 'You must add information in all fields.'];
                        ccsZaddErrorMessage(term_field, 'You must add information in all fields.');
                        ccsZaddErrorMessage(definition_field, 'You must add information in all fields.');
                        if (target_field !== undefined && target_field !== null && target_field.value.trim() === '')
                            ccsZaddErrorMessage(target_field, 'You must add information in all fields.');
                        errorStore.push(fieldCheck);
                    } else {
                        let isError = false;
                        if (term_field.value.trim() === '') {
                            ccsZaddErrorMessage(term_field, 'You must add information in all fields.');
                            isError = true;
                        }
                        if (definition_field.value.trim() === '') {
                            ccsZaddErrorMessage(definition_field, 'You must add information in all fields.');
                            isError = true;
                        }
                        if (target_field !== undefined && target_field !== null && target_field.value.trim() === '') {
                            ccsZaddErrorMessage(target_field, 'You must add information in all fields.');
                            isError = true;
                        }
                        if (field1) {
                            ccsZaddErrorMessage(term_field, 'No more than 50 words are allowed.');
                            isError = true;
                        }
                        if (field2) {
                            ccsZaddErrorMessage(definition_field, 'No more than 250 words are allowed.');
                            isError = true;
                        }
                        if (isError) {
                            fieldCheck = [definition_field.id, 'You must add information in all fields.'];
                            errorStore.push(fieldCheck);
                        }
                    }
                }
            }
        }

    }
    return errorStore;
}

const removeErrorFieldsRfpgc = () => {
    $('.govuk-error-message').remove();
    $('.govuk-form-group--error').removeClass('govuk-form-group--error')
    $('.govuk-error-summary').remove();
    $(".govuk-input").removeClass("govuk-input--error");
    $('.govuk-form-group textarea').removeClass('govuk-textarea--error');

}

const checkFieldsRfpgc = () => {
    const start = 1;
    const end = 20;
    const pageHeading = document.getElementById('page-heading').innerHTML;
    for (var a = start; a <= end; a++) {
        let input = $(`#rfp_term_service_group_${a}`)
        let textbox = $(`#rfp_term_more_details_${a}`);

        if (!pageHeading.includes("(Optional)")) {
            
            const field1 = countWords1(input.val()) < 50;
            const field2 = countWords1(textbox.val()) < 150;
            
            if (input.val() !== "" || field1) {
                $(`#rfp_term_service_group_${a}-error`).remove();
                $(`.acronym_${a} div`).removeClass('govuk-form-group--error');
                $(`.acronym_${a} input`).removeClass('govuk-input--error')
            }

            if (textbox.val() !== "" || field2) {
                $(`#rfp_term_more_details_${a}-error`).remove();
                $(`.acronym_${a} div`).removeClass('govuk-form-group--error');
                $(`.acronym_${a} textarea`).removeClass('govuk-input--error');
                $(`.acronym_${a} textarea`).removeClass('govuk-textarea--error')
            }
        }

    }
}

const emptyFieldCheckgcloud = (type) => {
    let fieldCheck = "",
        errorStore = [];
    removeErrorFieldsRfpgc();
    const pageHeading = document.getElementById('page-heading').innerHTML;
    
    fieldMsg = 'You must add information in all fields.';
    descMsg = 'You must add information in all fields.';

    for (var x = 1; x < 21; x++) {
        let term_field = document.getElementById('rfp_term_service_group_' + x);
        let definition_field = document.getElementById("rfp_term_more_details_" + x);

        if (term_field != null && term_field.value !== undefined && definition_field != null && definition_field !== undefined) {
            
            if(type == 'addmore'){
                const field1 = countWords1(term_field.value) > 50;
                const field2 = countWords1(definition_field.value) > 150;
                if (term_field.closest("fieldset").classList.value.indexOf("ccs-dynaform-hidden") === -1) {
                    checkFieldsRfpgc();
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

const ccsZvalidateRfpAcronyms = (event) => {

    // event.preventDefault();

    errorStoreforOptional = emptyFieldCheckgcloud('submit');
    if (errorStoreforOptional.length == 0) {

    //errorStore = emptyFieldCheckRfp();

    //if (errorStore.length === 0) {

    document.forms["service_user_type_form"].submit();
    //}
    //else {
    //   ccsZPresentErrorSummary(errorStore);

    // }
} else ccsZPresentErrorSummary(errorStoreforOptional);
};