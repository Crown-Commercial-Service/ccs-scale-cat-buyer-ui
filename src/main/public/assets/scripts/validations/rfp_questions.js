
document.addEventListener('DOMContentLoaded', () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    $(".rpf_500").attr('maxlength','500');
    $(".rpf_5000").attr('maxlength','5000');
    $(".rpf_10000").attr('maxlength','10000');
    if(urlParams.get('agreement_id') == 'RM1043.8'){
    $("#rfp_prob_statement_d").attr('maxlength','500');
    $("#rfp_prob_statement_e").attr('maxlength','5000');
    $("#rfp_prob_statement_g").attr('maxlength','5000');
    $("#rfp_prob_statement_t").attr('maxlength','5000');
    $("#rfp_prob_statement_m").attr('maxlength','5000');
    $("#rfp_prob_statement_n").attr('maxlength','5000');
    $("#rfp_prob_statement_s").attr('maxlength','5000');
    $(".min_supplier").attr('maxlength','8');

    }


    const removeErrorFieldsRfpScoreQuestion = () => {
        $('.govuk-error-message').remove();
        $('.govuk-form-group--error').removeClass('govuk-form-group--error');
        $('.govuk-error-summary').remove();
        $('.govuk-input').removeClass('govuk-input--error');
        $('.govuk-form-group textarea').removeClass('govuk-textarea--error');
    };

    const FormSelector = $('#rfp_multianswer_question_form');

    if (FormSelector !== undefined && FormSelector.length > 0 ) {
        $('.additional').addClass('ccs-dynaform-hidden');
        let with_value_count = 50,
            prev_input = 0,
            deleteButtons = document.querySelectorAll('a.del');
        let deleteButtonCount = [];
        let elements = document.querySelectorAll('.weightage');
        let totalPercentage = () => {
            let errorStore = [];
            let weightageSum = 0;
            let urlParamsData = new URLSearchParams(window.location.search);
            removeErrorFieldsRfpScoreQuestion();
            elements.forEach(el => {
                weightageSum += isNaN(el.value) ? 0 : Number(el.value);
            });
            if (weightageSum > 100) {
                errorStore = emptyQuestionFieldCheckRfp();
                if(urlParamsData.get('agreement_id') == 'RM1043.8' && urlParamsData.get('id') == 'Criterion 2' && (urlParamsData.get('group_id') == 'Group 9' || urlParamsData.get('group_id') == 'Group 5' || urlParamsData.get('group_id') == 'Group 6' ||  urlParamsData.get('group_id') == 'Group 7')  && urlParamsData.get('section') == 5) {
                    let textboxCount =  $('.order_1').filter(function() {return this.value !== '';}).length;
                    var percentageCheck = ccsZvalidateWeihtageValue('fc_question_precenate_' + textboxCount, "The total weighting is exceeded more than 100%",weightageSum, /\w+/);
                    errorStore.push(percentageCheck)
                }
                else{
                errorStore.push(["There is a problem", "The total weighting is exceeded more than 100%"]);
                }
                ccsZPresentErrorSummary(errorStore);
            }
            $('#totalPercentage').html(weightageSum);
        };
        elements.forEach(ele => {
            ele.addEventListener('focusout', totalPercentage);
            ele.addEventListener('keydown', (event) => {
                if (event.key === '.' || event.keyCode === 69) { event.preventDefault(); }
            });
        });

        const totalAnswerd = () => {
            $('#questionsCount').html(
                $('.order_1').filter(function() {
                    return this.value !== '';
                }).length,
            );
        };

             
        totalAnswerd();
        totalPercentage();
        deleteButtons.forEach((db) => {
            db.classList.add('ccs-dynaform-hidden')
            db.addEventListener('click', (e) => {
                if($('.add-another-btn').hasClass("ccs-dynaform-hidden")){
                    $('.add-another-btn').removeClass("ccs-dynaform-hidden");
                }
                e.preventDefault();
                let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
                    prev_input = Number(target) - 1,
                    target_fieldset = db.closest("div");
                if(Number(target) == 20){
                    $('.add-another-btn').removeClass("ccs-dynaform-hidden");
                }
                target_fieldset.classList.add("ccs-dynaform-hidden");
                // document.querySelector('#fc_question_'+prev_input+' a.del').classList.remove("ccs-dynaform-hidden");
                //let precentageValueofLast = document.getElementById('fc_question_precenate_'+target).value;

                if (document.getElementById('fc_question_precenate_' + target) != undefined) {

                    var precentageValueofLast = document.getElementById('fc_question_precenate_' + target).value;

                }


                //let precentageValueofLast = document.getElementById('fc_question_'+target).value;
                if (document.getElementById("totalPercentage") != undefined) {
                    document.getElementById('totalPercentage').textContent = Number(document.getElementById('totalPercentage').textContent) > 0 ? Number(document.getElementById('totalPercentage').textContent) - Number(precentageValueofLast) : 0;

                }

                $('.class_question_remove_' + target).val("");

                if (document.getElementById('fc_question_' + target + "_1") != undefined) {
                    document.getElementById('fc_question_' + target + "_1").value = "";
                }
                if (document.getElementById('fc_question_' + target + "_2") != undefined) {
                    document.getElementById('fc_question_' + target + "_2").value = "";
                }
                if (document.getElementById('fc_question_' + target + "_3") != undefined) {
                    document.getElementById('fc_question_' + target + "_3").value = "";
                }

                if (document.getElementById('fc_question_precenate_' + target) != undefined) {
                    document.getElementById('fc_question_precenate_' + target).value = "";
                }

                // document.getElementById('fc_question_'+target+"_1").value = "";
                // document.getElementById('fc_question_'+target+"_2").value = "";
                // document.getElementById('fc_question_'+target+"_3").value = "";
                // document.getElementById('fc_question_'+target).value = "";
                if (prev_input > 1) {

                    document.querySelector('#fc_question_' + prev_input + ' a.del').classList.remove("ccs-dynaform-hidden");
                } else {

                }
                //document.getElementsByClassName("add-another-btn").classList.remove('ccs-dynaform-hidden');
                if(urlParams.get('agreement_id') == 'RM1043.8' && with_value_count > 20){
                    with_value_count = 21
                }
                with_value_count--;
            });
        });

      
    var urlParamsDefault = new URLSearchParams(window.location.search);
    var agreement_id_Default =  urlParamsDefault.get('agreement_id')
    var lotid_Default;
    var group_id =  urlParamsDefault.get('group_id')

    if(document.getElementById('lID') !== null) {
        lotid_Default = document.getElementById('lID').value;
    }
   
        var total_countva=10;
        var withValue=11;
    if(urlParamsDefault.get('agreement_id') == 'RM1043.8' && urlParamsDefault.get('id') == 'Criterion 2' && lotid_Default == 1 && (urlParamsDefault.get('group_id') == 'Group 8' || urlParamsDefault.get('group_id') == 'Group 5' || urlParamsDefault.get('group_id') == 'Group 7' || urlParamsDefault.get('group_id') == 'Group 9') && urlParamsDefault.get('section') == 5 && (urlParamsDefault.get('step') == 48 || urlParamsDefault.get('step') == 44 || urlParamsDefault.get('step') == 46 )) {
            var total_countva=20;
            var withValue=21;
            with_value_count = 20
        }   
    else if(urlParamsDefault.get('agreement_id') == 'RM1043.8' && urlParamsDefault.get('id') == 'Criterion 2' && urlParamsDefault.get('group_id') == 'Group 9'  && urlParamsDefault.get('section') == 5) { 
        var total_countva=20;
            var withValue=21;
            with_value_count = 20
    }    
    else if(agreement_id_Default=='RM1043.8'){
        var total_countva=20;
        var withValue=21;
    }
    else{
        if($('.question_count').hasClass("question_count")) {      
               
            var total_countva=50;
           var withValue=51;
       }else{
           var total_countva=10;
           var withValue=11;
       }
    }

    let deleteButtonClicked = false
        
     
      
      

        for (var box_num = total_countva; box_num > 1; box_num--) {
            let this_box = document.getElementById('fc_question_' + box_num);
           
            if (this_box.querySelector('.order_1') != undefined && this_box.querySelector('.order_1').value !== '') {
                this_box.classList.remove('ccs-dynaform-hidden');
                if (box_num === total_countva) {

                    // $('.add-another-btn').addClass('ccs-dynaform-hidden');
                    var object = $('.add-another-btn').closest('.ccs-page-section');
                    if (object.length) {
                        $('.add-another-btn').closest('.ccs-page-section').css("border-bottom", "0px");
                    }
                }
                deleteButtonCount.push(box_num);
            } else if (this_box.querySelector('.order_2') != undefined && this_box.querySelector('.order_2').value !== '') {
                this_box.classList.remove('ccs-dynaform-hidden');
                if (box_num === total_countva) {

                    // $('.add-another-btn').addClass('ccs-dynaform-hidden');
                    var object = $('.add-another-btn').closest('.ccs-page-section');
                    if (object.length) {
                        $('.add-another-btn').closest('.ccs-page-section').css("border-bottom", "0px");
                    }
                }
                deleteButtonCount.push(box_num);
            } else {
                with_value_count = box_num;
            }
            if (box_num === 2 && deleteButtonCount.length > 0) {


                $("#del_fc_question_" + deleteButtonCount[0]).removeClass("ccs-dynaform-hidden");
           
            }

            // $("#del_fc_question_"+box_num).removeClass("ccs-dynaform-hidden");



        }

    


        if (with_value_count > 1) {
            $('#del_fc_question_' + with_value_count).removeClass('ccs-dynaform-hidden');
        }
        if($('#del_dos_question_'+ with_value_count)){
            $('#del_dos_question_' + with_value_count).removeClass('ccs-dynaform-hidden');
        }

        $('.add-another-btn').on('click', function() {
            errorStore = [];
            let textboxCount =  0;
            if($('.order_1').length > 0){
                textboxCount =  $('.order_1').filter(function() {return this.value !== '';}).length;
            }else{
                textboxCount =  $('.order_2').filter(function() {return this.value !== '';}).length;
            }
            
            if(urlParamsDefault.get('agreement_id') == 'RM1043.8' && textboxCount == 19){
                $('.add-another-btn').addClass("ccs-dynaform-hidden");
            }
            if(urlParamsDefault.get('agreement_id') != 'RM1043.8' && with_value_count == 50){
                $('.add-another-btn').addClass("ccs-dynaform-hidden");
            }
            
        if(textboxCount <= 20 && urlParamsDefault.get('agreement_id') == 'RM1043.8' && urlParamsDefault.get('id') == 'Criterion 2' && (urlParamsDefault.get('group_id') == 'Group 8' || urlParamsDefault.get('group_id') == 'Group 5' || urlParamsDefault.get('group_id') == 'Group 6' || urlParamsDefault.get('group_id') == 'Group 7') && urlParamsDefault.get('section') == 5 && (urlParamsDefault.get('step') == 48 || urlParamsDefault.get('step') == 44 || urlParamsDefault.get('step') == 45 || urlParamsDefault.get('step') == 46)) {

         if ((textboxCount < (withValue-1)) && Number($('#totalPercentage').text()) >= 100) {
            $('.govuk-error-summary').remove();
        $('.govuk-form-group--error').remove();
        removeErrorFieldsRfpScoreQuestion();
            errorStore.push(["There is a problem", "The total weighting is 100% so you can not add more questions"]);
        }
       else if (textboxCount == (withValue-1)) {

             $('.govuk-error-summary').remove();
             $('.govuk-form-group--error').remove();
             removeErrorFieldsRfpScoreQuestion();
             if (Number($('#totalPercentage').text()) < 100) {
             var percentageCheck = ccsZvalidateWeihtageValue('fc_question_precenate_' + textboxCount, "The total weighting is less than 100%", Number($('#totalPercentage').text()),/\w+/);
             errorStore.push(percentageCheck)

             }
             errorStore.push(["There is a problem", "Cannot add another question already "+ textboxCount +" questions created"]);
            var object = $('.add-another-btn').closest('.ccs-page-section');
            if (object.length) {
                $('.add-another-btn').closest('.ccs-page-section').css("border-bottom", "0px");
            }
        }
        else {
          //  if(urlParamsDefault.get('group_id') == 'Group 6' && urlParamsDefault.get('section') == 5 && urlParamsDefault.get('step') == 45){
                let textareaVal = $('#fc_question_'+textboxCount+ '_1').val();
                let percentageval = $('#fc_question_precenate_'+textboxCount).val();
                if(textareaVal != null || textareaVal != undefined || textareaVal != ''){
                    if((textareaVal != undefined && textareaVal.length != 0) && (percentageval == '' || percentageval == null || percentageval == undefined)){

                        var fieldCheck =  ccsZvalidateWithRegex('fc_question_precenate_' + textboxCount, "You must enter percentage", /\w+/);
                        errorStore.push(fieldCheck)
                   }
                   else{
                    errorStore = emptyQuestionFieldCheckRfp(); 

                }
                }
                else{
                    let textareaData = $('#fc_question_'+with_value_count+ '_1').val();
                let percentageData = $('#fc_question_precenate_'+with_value_count).val();

                if(textareaData.trim() != '' || textareaData != null || textareaData != undefined){
                    errorStore = emptyQuestionFieldCheckRfp(); 

                }
                }
            // }
            // else{
            //     errorStore = emptyQuestionFieldCheckRfp(); 
            // }
        }

        }
        else if(urlParamsDefault.get('agreement_id') == 'RM1043.8' && urlParamsDefault.get('id') == 'Criterion 2' && urlParamsDefault.get('group_id') == 'Group 9'  && urlParamsDefault.get('section') == 5) {
           
           if(textboxCount <= 20){
           if ((textboxCount < (withValue-1)) && Number($('#totalPercentage').text()) >= 100) {
               $('.govuk-error-summary').remove();
           $('.govuk-form-group--error').remove();
           removeErrorFieldsRfpScoreQuestion();
               errorStore.push(["There is a problem", "The total weighting is 100% so you can not add more questions"]);
           }
          else if (textboxCount == (withValue-1)) {
                $('.govuk-error-summary').remove();
                $('.govuk-form-group--error').remove();
                removeErrorFieldsRfpScoreQuestion();
                if (Number($('#totalPercentage').text()) < 100) {
                var percentageCheck = ccsZvalidateWeihtageValue('fc_question_precenate_' + textboxCount, "The total weighting is less than 100%", Number($('#totalPercentage').text()),/\w+/);
                errorStore.push(percentageCheck)
   
                }
                errorStore.push(["There is a problem", "Cannot add another question already "+ textboxCount +" questions created"]);
               var object = $('.add-another-btn').closest('.ccs-page-section');
               if (object.length) {
                   $('.add-another-btn').closest('.ccs-page-section').css("border-bottom", "0px");
               }
           }
           else {
                    let textareaVal = $('#fc_question_'+textboxCount+ '_1').val();
                    let percentageval = $('#fc_question_precenate_'+textboxCount).val();
                    if(textareaVal != null || textareaVal != undefined || textareaVal != ''){
                        if( (textareaVal != undefined && textareaVal.length != 0) && (percentageval == '' || percentageval == null || percentageval == undefined)){
    
                            var fieldCheck =  ccsZvalidateWithRegex('fc_question_precenate_' + textboxCount, "You must enter percentage", /\w+/);
                            errorStore.push(fieldCheck)
                       }
                       else{
                        errorStore = emptyQuestionFieldCheckRfp(); 

                    }
                    }
                    else{
                        let textareaData = $('#fc_question_'+with_value_count+ '_1').val();
                    let percentageData = $('#fc_question_precenate_'+with_value_count).val();

                    if(textareaData.trim() != '' || textareaData != null || textareaData != undefined){
                        errorStore = emptyQuestionFieldCheckRfp(); 

                    }
                    }
                    
           }
        }
           }
        else if(textboxCount <= 20 && urlParamsDefault.get('agreement_id') == 'RM1043.8' && urlParamsDefault.get('id') == 'Criterion 3' && urlParamsDefault.get('group_id') == 'Group 15'){
            for (var i = 1; i < withValue; i++) {
                const divElem = document.querySelector('#fc_question_' + i);
                const inputElements = divElem.querySelectorAll("textarea");
                let error_classes = $('#fc_question_'+i).hasClass('ccs-dynaform-hidden');
                    if (inputElements != null && inputElements != undefined && inputElements.length > 0) {
                        for (let index = 0; index < inputElements.length; index++) {
                            const element = inputElements[index];
                            ccsZremoveErrorMessage(element)
                            if (element.value == '' && index >= 0 && (error_classes == false)) {
                                    let error = ccsZvalidateWithRegex(element.id, "You must add information in all fields.", /^.+$/);
                                    errorStore.push(error);
                            }
                            if (textboxCount == 19) {
                                $('.add-another-btn').addClass("ccs-dynaform-hidden");
                            }
                        }
                    }
            }
        }
        else{
            if (Number($('#totalPercentage').text()) >= 100) {
                $('.govuk-error-summary').remove();
            $('.govuk-form-group--error').remove();
            removeErrorFieldsRfpScoreQuestion();
                errorStore.push(["There is a problem", "The total weighting is 100% so you can not add more questions"]);
            }
            else {
                errorStore = emptyQuestionFieldCheckRfp(); 
            }
        }

            const pageHeading = document.getElementById('page-heading').innerHTML;
            if (errorStore.length == 0) {
                prev_input = with_value_count - 1;
                deleteButtonClicked = true
                if(agreement_id_Default == "RM1043.8" && with_value_count > 20){
                    with_value_count = 20
                }
                        document.getElementById('fc_question_'+ with_value_count).classList.remove('ccs-dynaform-hidden');

                //Added this condation section 5 (step 43/44/45)

                if (with_value_count > 2) {
                    if($('#del_dos_question_'+ with_value_count) || $('#del_fc_question_'+ with_value_count)){
                        document.querySelector('label[for=fc_question_' + prev_input + '] a.del').classList.add('ccs-dynaform-hidden');
                    }else {
                        document.querySelector('label[for=fc_question_' + prev_input + '] a.del').classList.remove('ccs-dynaform-hidden');
                    }
                }
                if (document.getElementById("questionsCount") != undefined) {
                    document.getElementById("questionsCount").textContent = with_value_count + ' technical questions entered so far';
                }
                document
                    .querySelector('label[for=fc_question_' + with_value_count + '] a.del')
                    .classList.remove('ccs-dynaform-hidden');
                //Add question set more than 5
                // if (pageHeading.includes('Write your cultural questions') || pageHeading.includes('Write your technical questions') || pageHeading.includes('Write your social value questions')) {
                //   if (with_value_count === 5) {
                //     errorStore.push(["There is a problem", "You can add a maximum of 5 question"]);
                //     ccsZPresentErrorSummary(errorStore);
                //     return;
                //   }
                // }
                
                with_value_count++;
                if(!(urlParamsDefault.get('agreement_id') == 'RM1043.8' && urlParamsDefault.get('id') == 'Criterion 2' && lotid_Default == 1 && (urlParamsDefault.get('group_id') == 'Group 8' || urlParamsDefault.get('group_id') == 'Group 5') && urlParamsDefault.get('section') == 5 && (urlParamsDefault.get('step') == 48 || urlParamsDefault.get('step') == 44))) {
                 if (with_value_count == withValue) {
                    // $('.add-another-btn').addClass('ccs-dynaform-hidden');
                    errorStore.push(["There is a problem", "Cannot add another question already "+ with_value_count +" questions created"]);
                    var object = $('.add-another-btn').closest('.ccs-page-section');
                    if (object.length) {
                        $('.add-another-btn').closest('.ccs-page-section').css("border-bottom", "0px");
                    }
                }
                }
                totalAnswerd();
                $('#del_dos_question_' + prev_input).addClass("ccs-dynaform-hidden");
                
            } else ccsZPresentErrorSummary(errorStore);
        });
        




        deleteButtons.forEach((db) => {
            //db.classList.remove('ccs-dynaform-hidden')
            db.addEventListener('click', (e) => {
                totalAnswerd();
                e.preventDefault();
                let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
                    prev_input = Number(target) - 1,
                    target_fieldset = db.closest("div");

                target_fieldset.classList.add("ccs-dynaform-hidden");
                if (document.getElementById('fc_question_precenate_' + target) != undefined) {
                    var precentageValueofLast = document.getElementById('fc_question_precenate_' + target).value;
                }
                if (document.getElementById("totalPercentage") != undefined) {
                    document.getElementById('totalPercentage').textContent = Number(document.getElementById('totalPercentage').textContent) > 0 ? Number(document.getElementById('totalPercentage').textContent) - Number(precentageValueofLast) : 0;
                }
                // document.getElementById('fc_question_' + target + "_1").value = "";
                // document.getElementById('fc_question_' + target + "_2").value = "";
                // document.getElementById('fc_question_' + target + "_3").value = "";

                $('.class_question_remove_' + target).val("");

                if (document.getElementById('fc_question_' + target + "_1") != undefined) {
                    document.getElementById('fc_question_' + target + "_1").value = "";
                }
                if (document.getElementById('fc_question_' + target + "_2") != undefined) {
                    document.getElementById('fc_question_' + target + "_2").value = "";
                }
                if (document.getElementById('fc_question_' + target + "_3") != undefined) {
                    document.getElementById('fc_question_' + target + "_3").value = "";
                }

                if (document.getElementById('fc_question_precenate_' + target) != undefined) {
                    document.getElementById('fc_question_precenate_' + target).value = "";
                }

                if (prev_input > 1) {
                    document.querySelector('#fc_question_' + prev_input + ' a.del').classList.remove("ccs-dynaform-hidden");
                }

            })
        });

        $('.dos_question_count').on('change keyup paste', (event) => {
            totalAnswerd();
        });
        
        $('.weightage').on('change keyup paste', (event) => {
            totalAnswerd();
        });

        if(deleteButtonClicked == false){
            let showinputarray = [];
        for (var i = 1; i < withValue; i++) {
            let additional_classes = $('#fc_question_'+i).hasClass('additional');
            let error_classes = $('#fc_question_'+i).hasClass('ccs-dynaform-hidden');
            let lastElement = showinputarray[showinputarray.length -1];
            if(additional_classes == true && error_classes == false){
                showinputarray.push(i);
            }
            if(showinputarray.length > 0){
                let prevvaalue = lastElement -1;
                $('#del_dos_question_' + lastElement).removeClass("ccs-dynaform-hidden");
                $('#del_dos_question_' + prevvaalue).addClass("ccs-dynaform-hidden");
            }
            if(urlParamsDefault.get('agreement_id') == 'RM1043.8' && showinputarray.length == 19){
                $('.add-another-btn').addClass("ccs-dynaform-hidden");
                $('#del_dos_question_19').addClass("ccs-dynaform-hidden");
                $('#del_dos_question_20').removeClass("ccs-dynaform-hidden");
                }
                if(urlParamsDefault.get('agreement_id') != 'RM1043.8' && showinputarray.length == 49){
                    $('.add-another-btn').addClass("ccs-dynaform-hidden");
                }
        }
        } 
    }

    const emptyQuestionFieldCheckRfp = () => {
        removeErrorFieldsRfpScoreQuestion();
        const countWords = str => str.trim().split(/\s+/).length;
        let fieldCheck = '',
            errorStore = [],
            noOfRequirement_Group = 0;

        const pageHeading = document.getElementById('page-heading').innerHTML;
        for (var i = 1; i < withValue; i++) {
            let rootEl = document.getElementById('fc_question_' + i);
            const divElem = document.querySelector('#fc_question_' + i);

            if (!rootEl.classList.contains('ccs-dynaform-hidden')) {
                if (Number($('#totalPercentage').text) > 100) {
                    fieldCheck = ccsZvalidateWithRegex(
                        'fc_question_' + i + '_4',
                        'You cannot add / submit  question as your weightings exceed 100%',
                        /\w+/,
                    );
                    if (fieldCheck !== true) errorStore.push(fieldCheck);
                }
                if (pageHeading.includes("Enter your project requirements")) {
                    const inputElements = divElem.querySelectorAll("textarea");
                    if (inputElements != null && inputElements != undefined && inputElements.length > 0) {
                        for (let index = 0; index < inputElements.length; index++) {
                            const element = inputElements[index];
                            var labelElement = element.previousElementSibling.previousElementSibling;
                            var labelText = labelElement.innerHTML;
                            var msg = '';
                            var desmsg = '';
                            if(labelText.trim() == 'Name of the requirement'){
                                msg = 'You must enter your name of the requirement';
                            }else{
                                msg = 'You must enter your name of the group';
                            }
                            if(labelText.trim() == 'Describe the requirement'){
                                desmsg = 'You must enter your description of the requirement';
                            }else{
                                desmsg = 'You must enter your name of the requirement';
                            }
                            if (index === 0) {
                                if (element.value == '' || element.value === undefined || element.value === null) {
                                    errorStore.push([element.id, msg])
                                }
                            } else if(index === 1){
                                if (element.value == '' || element.value === undefined || element.value === null) {
                                    errorStore.push([element.id, desmsg])
                                }
                            }else {
                                if (element.value == '' || element.value === undefined || element.value === null) {
                                    errorStore.push([element.id, "You must enter your description of the requirement"])
                                }
                            }
                        }
                    }
                    noOfRequirement_Group += 1;
                } else if( pageHeading.trim().toLowerCase() != 'Special terms and conditions (Optional)'.toLowerCase()) {
                    if (rootEl.querySelector('.order_1')) {
                        let element = rootEl.querySelector('.order_1');

                        if ((rootEl.querySelector('.order_1').value == '' || ((rootEl.querySelector('.weightage') != null && rootEl.querySelector('.weightage') != undefined) && rootEl.querySelector('.weightage').value == '')) && !pageHeading.includes("Assisted digital and accessibility requirements (Optional)") && !pageHeading.includes("Write your social value questions (Optional)")) {
                            const msg = rootEl.querySelector('.order_1').value ?
                                'Entry is limited to 50 words' :
                                'You must enter valid question';
                            fieldCheck = ccsZvalidateWithRegex('fc_question_' + i + '_1', msg, /\w+/);
                            let percentageCheck = ccsZvalidateWithRegex('fc_question_precenate_' + i, "You must enter percentage", /\w+/);
                            if (fieldCheck !== true){
                                errorStore.push(fieldCheck);
                            }

                            if(percentageCheck){
                                errorStore.push(percentageCheck);
                            }
                        }
                    }
                    if (rootEl.querySelector('.order_2')) {
                        if (rootEl.querySelector('.order_2').value == '') {

                            const msg = rootEl.querySelector('.order_2').value ?
                                'Entry is limited to 50 words' :
                                'You must enter valid additional information';

                            fieldCheck = ccsZvalidateWithRegex('fc_question_' + i + '_2', msg, /\w+/);
                            if (fieldCheck !== true) errorStore.push(fieldCheck);
                        }
                    }
                    if (rootEl.querySelector('.order_3')) {
                        if (rootEl.querySelector('.order_3').value == '') {
                            const msg = rootEl.querySelector('.order_3').value ?
                                'Entry is limited to 50 words' :
                                'You must enter valid information';

                            fieldCheck = ccsZvalidateWithRegex('fc_question_' + i + '_3', msg, /\w+/);
                            if (fieldCheck !== true) errorStore.push(fieldCheck);
                        }
                    }
                    if (rootEl.querySelector('.weightage')) {
                        const condWeight = rootEl.querySelector('.weightage').value > 100;
                        if (rootEl.querySelector('.weightage').value != '' && condWeight || rootEl.querySelector('.weightage').value < 0) {
                            const msg = rootEl.querySelector('.weightage').value ?
                                'Enter a weighting for this question <= 100%' :
                                'You must enter valid weightage';
                            fieldCheck = ccsZvalidateWithRegex('fc_question_' + i + '_4', msg, /\w+/, !condWeight);
                            if (fieldCheck !== true) errorStore.push(fieldCheck);
                        }
                    }
                }
            }
        }
        return errorStore;
    }


    $('#rfp_multianswer_question_form').on('submit', (event) => {
        let weightArr = 0;
        let weightTotal = 0;
        event.preventDefault();
        let errorStore = [];
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const pageHeading = document.getElementById('page-heading').innerHTML;
        let LOTID_VAR;
        if(document.getElementById('lID') !== null) {
            LOTID_VAR = document.getElementById('lID').value;
        }
        
        var weightLoop = document.getElementsByClassName("weightage");
        if(urlParams.get('agreement_id') == 'RM1043.8' && urlParams.get('id') == 'Criterion 2' && (LOTID_VAR == 1 && (urlParams.get('group_id') == 'Group 5' || urlParams.get('group_id') == 'Group 6' || urlParams.get('group_id') == 'Group 7'|| urlParams.get('group_id') == 'Group 9')) || (LOTID_VAR == 3 && (urlParams.get('group_id') == 'Group 5' || urlParams.get('group_id') == 'Group 6' || urlParams.get('group_id') == 'Group 7'|| urlParams.get('group_id') == 'Group 8')) ) {
            Array.prototype.forEach.call(weightLoop, function(el) {
                // Do stuff here
                if(el.value !== "") {
                    weightArr = weightArr + 1
                }
                if(!el.parentElement.parentElement.parentElement.classList.contains('ccs-dynaform-hidden')) {
                    weightTotal = weightTotal + 1
                }
            });
        } else if(urlParams.get('agreement_id') == 'RM6187' && urlParams.get('id') == 'Criterion 2' && urlParams.get('group_id') == 'Group 6') {
            Array.prototype.forEach.call(weightLoop, function(el) {
                // Do stuff here
                if(el.value !== "") {
                    weightArr = weightArr + 1
                }
                if(!el.parentElement.parentElement.parentElement.classList.contains('ccs-dynaform-hidden')) {
                    weightTotal = weightTotal + 1
                }
            });
        }

        if(weightArr == 0) {
            if(urlParams.get('agreement_id') == 'RM1043.8' && urlParams.get('id') == 'Criterion 2' && (LOTID_VAR == 1 && (urlParams.get('group_id') == 'Group 6' || urlParams.get('group_id') == 'Group 9')) || (LOTID_VAR == 3 && (urlParams.get('group_id') == 'Group 6' || urlParams.get('group_id') == 'Group 8')) ) {
              
              
                 /*let i = 0
                Array.prototype.forEach.call(weightLoop, function(el) {
                    if(i == 0) {
                        el.value = '100';
                    }
                    i++
                });
                var textareaLoop = document.getElementsByClassName("govuk-textarea");
                let l = 0
                Array.prototype.forEach.call(textareaLoop, function(el) {
                    if(l == 0) {

                        var txtArea = document.getElementById(el.getAttribute('id'));
                        txtArea.value = 'None';
                    }
                    l++
                });*/

                if((urlParams.get('group_id') == 'Group 9' || urlParams.get('group_id') == 'Group 6' ) && urlParamsDefault.get('section') == 5){
                    var textareaVal = $('#fc_question_'+1+ '_1').val();
                    var percentageval = $('#fc_question_precenate_'+1).val();
                    if(textareaVal.trim() != '' || textareaVal != null || textareaVal != undefined){
                        if(textareaVal.length != 0 && (percentageval == '' || percentageval == null || percentageval == undefined)){
                            var fieldCheck =  ccsZvalidateWithRegex('fc_question_precenate_' + 1, "You must enter percentage", /\w+/);
                            errorStore.push(fieldCheck)
                       }
                    }
                    if (errorStore.length === 0) {
                        const classList = document.getElementsByClassName("govuk-hint-error-message");
                        const classLength = classList.length;
                        if (classLength != 0) {
                            return false;
                        } else {
                            document.forms['rfp_multianswer_question_form'].submit();
                        }
                    } else { ccsZPresentErrorSummary(errorStore); }
                }  
                else{
                    document.forms['rfp_multianswer_question_form'].submit();

                }

            } else if(urlParams.get('agreement_id') == 'RM6187' && urlParams.get('id') == 'Criterion 2' && urlParams.get('group_id') == 'Group 6') {
                document.forms['rfp_multianswer_question_form'].submit();
            } else {
                if ($('#totalPercentage') != null && $('#totalPercentage') != undefined && $('#totalPercentage').length > 0 && Number($('#totalPercentage').text()) > 100) {
                    errorStore.push(["There is a problem", "The total weighting is more than 100% "]);
                }
        
                if ($('#totalPercentage') != null && $('#totalPercentage') != undefined && $('#totalPercentage').length > 0 && Number($('#totalPercentage').text()) < 100) {
                    for (var i = 1; i < withValue; i++) {
                        let error_classes = $('#fc_question_'+i).hasClass('ccs-dynaform-hidden');
                        let additional_classes = $('#fc_question_'+i).hasClass('additional');

                        if((($('#fc_question_'+i+ '_1').val() == '' && (error_classes == false && additional_classes == false )) || 
                        ($('#fc_question_'+i+ '_1').val() == '' && (error_classes == false && additional_classes == true ))
                        ) && !pageHeading.includes('Write your social value questions (Optional)')){
                            var fieldCheck = ccsZvalidateWithRegex('fc_question_' + i + '_1', "You must enter your question", /\w+/);
                            errorStore.push(fieldCheck)
                        } 
                        if((($('#fc_question_precenate_'+i).val() == '' && (error_classes == false && additional_classes == false )) ||
                        ($('#fc_question_precenate_'+i).val() == '' && ( error_classes == false && additional_classes == true ))
                        ) && !pageHeading.includes('Write your social value questions (Optional)')) {
                        var percentageCheck = ccsZvalidateWithRegex('fc_question_precenate_' + i, "You must enter a weighting for this question", /\w+/);
                        errorStore.push(percentageCheck)
                        }
                        if($('#fc_question_precenate_'+i).val() == '' && !pageHeading.includes('Write your social value questions (Optional)')){
                            errorStore.push(["There is a problem", "Your total weighting must be 100% "]);
                        }
                        if($('#fc_question_precenate_'+i).val() != '' && pageHeading.includes('Write your social value questions (Optional)')){
                            errorStore.push(["There is a problem", "Your total weighting must be 100% "]);
                        }
                    }
                    if((urlParams.get('group_id') == 'Group 7' || urlParams.get('group_id') == 'Group 5' ) && urlParamsDefault.get('section') == 5){
                        var percentageCheck = ccsZvalidateWeihtageValue('fc_question_precenate_' + 1, "Your total weighting must be 100%",Number($('#totalPercentage').text()), /\w+/);
                        errorStore.push(percentageCheck)
        
                    }
                    // else{
                        // console.log('com')
                        // console.log(i)
                        // console.log($('#fc_question_precenate_'+i).val());
                        // console.log(pageHeading.includes('Write your social value questions (Optional)'));
                        
                        
                    // }

                }
                errorStore = errorStore.length <= 0 ? emptyQuestionFieldCheckRfp() : errorStore;
                if (errorStore.length === 0) {
                    const classList = document.getElementsByClassName("govuk-hint-error-message");
                    const classLength = classList.length;
                    if (classLength != 0) {
                        return false;
                    } else {
                        document.forms['rfp_multianswer_question_form'].submit();
                    }
                } else { ccsZPresentErrorSummary(errorStore); }
            }
        } else {
           
    
            if ($('#totalPercentage') != null && $('#totalPercentage') != undefined && $('#totalPercentage').length > 0 && Number($('#totalPercentage').text()) < 100) {
                var fieldCheck = ccsZvalidateWithRegex('fc_question_' + i + '_1', "You must enter information here", /\w+/);
                errorStore = emptyQuestionFieldCheckRfp(); 
                if(urlParams.get('agreement_id') == 'RM1043.8' && urlParams.get('id') == 'Criterion 2' && (urlParams.get('group_id') == 'Group 9' || urlParams.get('group_id') == 'Group 5' || urlParams.get('group_id') == 'Group 7' || urlParams.get('group_id') == 'Group 6')  && urlParams.get('section') == 5) {

                let textboxCount =  $('.order_1').filter(function() {return this.value !== '';}).length;
                var percentageCheck = ccsZvalidateWeihtageValue('fc_question_precenate_' + textboxCount, "The total weighting is less than 100%",Number($('#totalPercentage').text()), /\w+/);
                errorStore.push(percentageCheck)
                }
                else{
                     errorStore.push(["There is a problem", "The total weighting is less than 100% "]);
                }
            }
             //Remain Agreement
            if ($('#totalPercentage') != null && $('#totalPercentage') != undefined && $('#totalPercentage').length > 0 && Number($('#totalPercentage').text()) > 100) {
                errorStore = emptyQuestionFieldCheckRfp(); 
                if(urlParams.get('agreement_id') == 'RM1043.8' && urlParams.get('id') == 'Criterion 2' && urlParams.get('group_id') == 'Group 9'  && urlParams.get('section') == 5) {
                    let textboxCount =  $('.order_1').filter(function() {return this.value !== '';}).length;
                    var percentageCheck = ccsZvalidateWeihtageValue('fc_question_precenate_' + textboxCount, "The total weighting is more than 100% ",Number($('#totalPercentage').text()), /\w+/);
                    errorStore.push(percentageCheck)
                    
    
                }
                else{
                     errorStore.push(["There is a problem", "The total weighting is more than 100% "]);
                }

            }
            if(urlParams.get('agreement_id') == 'RM1043.8' && urlParams.get('id') == 'Criterion 2' && weightTotal == 1 && (LOTID_VAR == 1 && (urlParams.get('group_id') == 'Group 6' || urlParams.get('group_id') == 'Group 9')) || (LOTID_VAR == 3 && (urlParams.get('group_id') == 'Group 6' || urlParams.get('group_id') == 'Group 8')) ) {
            if((urlParams.get('group_id') == 'Group 9' || urlParams.get('group_id') == 'Group 6' ) && urlParamsDefault.get('section') == 5 && Number($('#totalPercentage').text()) == 100){
                let textareaVal = $('#fc_question_'+1+ '_1').val();
                let percentageval = $('#fc_question_precenate_'+1).val();
               
                if(percentageval.trim() != '' || percentageval != null || percentageval != undefined){
                    if(percentageval.length != 0 && (textareaVal == '' || textareaVal == null || textareaVal == undefined)){

                        var fieldCheck =  ccsZvalidateWithRegex('fc_question_'+1+ '_1', "You must enter valid question", /\w+/);
                        errorStore.push(fieldCheck)
                   }
                }
                
            }
            } else {
                errorStore = errorStore.length <= 0 ? emptyQuestionFieldCheckRfp() : errorStore;
            }
            if (errorStore.length === 0) {
                const classList = document.getElementsByClassName("govuk-hint-error-message");
                const classLength = classList.length;
                if (classLength != 0) {
                    return false;
                } else {
                    document.forms['rfp_multianswer_question_form'].submit();
                }
            } else { ccsZPresentErrorSummary(errorStore); }
        }
    });

    

});

$('.weightagelimit').on('keypress', function (evt) {
let value = $(this).val();
evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) || value.length >=3) {
        return false;
    }
    return true;
 
 });
 
 
 $(document.body).on("keyup", ".weightagelimit", function (event) {

    var numero=$(this).val();
     if(parseInt($(this).val())>100){    
        let value = $(this).val().slice(0, $(this).val(). length - 1);
        $(this).val(value)
     }
});

