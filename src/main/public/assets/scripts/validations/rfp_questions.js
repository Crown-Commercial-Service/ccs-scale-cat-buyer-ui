
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
        let textboxelements = document.querySelectorAll('.order_1');
        let textboxelementsorder2 = document.querySelectorAll('.order_2');
        let urlParamsData = new URLSearchParams(window.location.search);
        let totalPercentage = () => {
            let errorStore = [];
            let weightageSum = 0;
            
            //removeErrorFieldsRfpScoreQuestion();
            elements.forEach(el => {
                weightageSum += isNaN(el.value) ? 0 : Number(el.value);
            });
            
            if (weightageSum > 100) {
                errorStore = emptyQuestionFieldCheckRfp();
                if(urlParamsData.get('agreement_id') == 'RM1043.8' && urlParamsData.get('id') == 'Criterion 2' && (urlParamsData.get('group_id') == 'Group 9' || urlParamsData.get('group_id') == 'Group 5' || urlParamsData.get('group_id') == 'Group 6' ||  urlParamsData.get('group_id') == 'Group 7' ||  urlParamsData.get('group_id') == 'Group 8')  && urlParamsData.get('section') == 5) {
                    let textboxCount =  $('.order_1').filter(function() {return this.value !== '';}).length;
                    var percentageCheck;
                    if(errorStore.length == 0){
                    percentageCheck = ccsZvalidateWeihtageValue('fc_question_precenate_' + textboxCount, "The total weighting is exceeded more than 100%",weightageSum, /\w+/);
                    errorStore.push(percentageCheck)
                    }
                }
                else if(urlParamsData.get('agreement_id') == 'RM1557.13' && urlParamsData.get('id') == 'Criterion 2' && (urlParamsData.get('group_id') == 'Group 4' || urlParamsData.get('group_id') == 'Group 6') && urlParamsData.get('section') == 5){
                    errorStore.push(["There is a problem", "The total weighting exceeded more than 100%"]);
                }
                else{
                    errorStore.push(["There is a problem", "The total weighting exceeded more than 100%"]);
                }
                ccsZPresentErrorSummary(errorStore);
            }
            if(urlParamsData.get('agreement_id') == 'RM6187'){
                $('#totalPercentage').html(weightageSum);
                $('#totalPercentageDown').html(weightageSum);
            }else{
                $('#totalPercentage').html(weightageSum);
                $('#totalPercentageDown').html(weightageSum);
            }
        };
        
        textboxelements.forEach(ele => {
            ele.addEventListener('keydown', (event) => {
                removeErrorFieldsRfpScoreQuestion();
            });
        });
        textboxelementsorder2.forEach(ele => {
            ele.addEventListener('keydown', (event) => {
                removeErrorFieldsRfpScoreQuestion();
            });
        });
        elements.forEach(ele => {
            ele.addEventListener('focusout', totalPercentage);
            ele.addEventListener('keydown', (event) => {
                removeErrorFieldsRfpScoreQuestion();
                if (event.key === '.' || event.keyCode === 69) { event.preventDefault(); }
            });
        });

        const totalAnswerd = () => {
            let qCount = $('.order_1').filter(function() {
                return this.value !== '';
            }).length;
            if(urlParamsData.get('agreement_id') == 'RM6187'){
                $('#questionsCount').html(qCount);
            }else{
                $('#questionsCount').html(qCount);
            }
        };
        

             
        totalAnswerd();
        totalPercentage();
        deleteButtons.forEach((db) => {
            db.classList.add('ccs-dynaform-hidden')
            
            db.addEventListener('click', (e) => {
               
                e.preventDefault();
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
                               let first;
                               let last;
                               let percentage;

                               var fc_question_precenate_fir = document.getElementsByClassName('class_question_remove_'+nextLevel_coll)[0];
                               if(fc_question_precenate_fir){
                                first = document.getElementsByClassName('class_question_remove_'+nextLevel_coll)[0].value;
                                document.getElementsByClassName('class_question_remove_'+current_col)[0].value=first;
                               }
                               var fc_question_precenate_sec = document.getElementsByClassName('class_question_remove_'+nextLevel_coll)[1];
                               if(fc_question_precenate_sec){
                                var lastIdValue = document.getElementsByClassName('class_question_remove_'+nextLevel_coll)[1].value;
                                document.getElementsByClassName('class_question_remove_'+current_col)[1].value=lastIdValue;
                               }
                               var fc_question_precenate_third = document.getElementsByClassName('class_question_remove_'+nextLevel_coll)[2];
                               if(fc_question_precenate_third){
                                 percentage  = document.getElementsByClassName('class_question_remove_'+nextLevel_coll)[2].value;
                                document.getElementsByClassName('class_question_remove_'+current_col)[2].value=percentage;
                               }
                               //ID BASED
                               var fc_question_precenate_El = document.getElementById("fc_question_precenate_"+nextLevel_coll);
                               if(fc_question_precenate_El){
                                 last = document.getElementById("fc_question_precenate_"+nextLevel_coll).value;
                                 document.getElementById('fc_question_precenate_'+current_col).value=last;
                               }
                              
                           
                            
                            
                            //    document.getElementsByClassName('class_question_remove_'+current_col)[0].value=first;
                            //    document.getElementsByClassName('class_question_remove_'+current_col)[1].value=last;
                            //    document.getElementsByClassName('class_question_remove_'+current_col)[2].value=percentage;

                              
                           } else {
                               next_coll = next_coll + 1;
                           
                            // var first = document.getElementsByClassName('class_question_remove_'+nextLevel_coll)[0].value;
                            // var last = document.getElementsByClassName('class_question_remove_'+nextLevel_coll)[1].value;
                            // var percentage  = document.getElementsByClassName('class_question_remove_'+nextLevel_coll)[2].value;
                           
                               
                            //    document.getElementsByClassName('class_question_remove_'+current_col)[0].value=first;
                            //    document.getElementsByClassName('class_question_remove_'+current_col)[1].value=last;
                            //    document.getElementsByClassName('class_question_remove_'+current_col)[2].value=percentage;
                            let first;
                            let last;
                            let percentage;

                            var fc_question_precenate_fir = document.getElementsByClassName('class_question_remove_'+nextLevel_coll)[0];
                            if(fc_question_precenate_fir){
                             first = document.getElementsByClassName('class_question_remove_'+nextLevel_coll)[0].value;
                             document.getElementsByClassName('class_question_remove_'+current_col)[0].value=first;
                            }
                            var fc_question_precenate_sec = document.getElementsByClassName('class_question_remove_'+nextLevel_coll)[1];
                            if(fc_question_precenate_sec){
                             var lastIdValue = document.getElementsByClassName('class_question_remove_'+nextLevel_coll)[1].value;
                             document.getElementsByClassName('class_question_remove_'+current_col)[1].value=lastIdValue;
                            }
                            var fc_question_precenate_third = document.getElementsByClassName('class_question_remove_'+nextLevel_coll)[2];
                            if(fc_question_precenate_third){
                              percentage  = document.getElementsByClassName('class_question_remove_'+nextLevel_coll)[2].value;
                             document.getElementsByClassName('class_question_remove_'+current_col)[2].value=percentage;
                            }
                            //ID BASED
                            var fc_question_precenate_El = document.getElementById("fc_question_precenate_"+nextLevel_coll);
                            if(fc_question_precenate_El){
                              last = document.getElementById("fc_question_precenate_"+nextLevel_coll).value;
                              document.getElementById('fc_question_precenate_'+current_col).value=last;
                            }
                            
                           }
       
                           
                           Sibling = Sibling.nextElementSibling;
                       } else {
                           Sibling = false;
                       }
                   ml++;}
                   if(eptArr.length > 0) {
                       let removeLogic = eptArr.at(-1);
                      
                       var fc_question_precenate_fir = document.getElementsByClassName('class_question_remove_'+removeLogic)[0];
                       if(fc_question_precenate_fir){
                        document.getElementsByClassName('class_question_remove_'+removeLogic)[0].value="";
                       }
                       var fc_question_precenate_sec = document.getElementsByClassName('class_question_remove_'+removeLogic)[1];
                       if(fc_question_precenate_sec){
                        document.getElementsByClassName('class_question_remove_'+removeLogic)[1].value="";
                       }
                       var fc_question_precenate_third = document.getElementsByClassName('class_question_remove_'+removeLogic)[2];
                       if(fc_question_precenate_third){
                        document.getElementsByClassName('class_question_remove_'+removeLogic)[2].value="";
                       }
                       //ID BASED
                       var fc_question_precenate_El = document.getElementById("fc_question_precenate_"+removeLogic);
                       if(fc_question_precenate_El){
                         document.getElementById('fc_question_precenate_'+removeLogic).value="";
                       }

                    //    document.getElementsByClassName('class_question_remove_'+removeLogic)[0].value="";
                    //    document.getElementsByClassName('class_question_remove_'+removeLogic)[1].value="";
                    //    document.getElementsByClassName('class_question_remove_'+removeLogic)[2].value="";
                    
                    document.querySelector('#fc_question_' + removeLogic).classList.add("ccs-dynaform-hidden");
                } else {
                   
                       target_fieldset.classList.add("ccs-dynaform-hidden");
                       
                       var fc_question_precenate_fir = document.getElementsByClassName('class_question_remove_'+nextLevel_coll)[0];
                       if(fc_question_precenate_fir){
                        document.getElementsByClassName('class_question_remove_'+nextLevel_coll)[0].value="";
                       }
                       var fc_question_precenate_sec = document.getElementsByClassName('class_question_remove_'+nextLevel_coll)[1];
                       if(fc_question_precenate_sec){
                        document.getElementsByClassName('class_question_remove_'+nextLevel_coll)[1].value="";
                       }
                       var fc_question_precenate_third = document.getElementsByClassName('class_question_remove_'+nextLevel_coll)[2];
                       if(fc_question_precenate_third){
                        document.getElementsByClassName('class_question_remove_'+nextLevel_coll)[2].value="";
                       }
                       //ID BASED
                       var fc_question_precenate_El = document.getElementById("fc_question_precenate_"+nextLevel_coll);
                       if(fc_question_precenate_El){
                         document.getElementById('fc_question_precenate_'+nextLevel_coll).value="";
                       }

                    //    document.getElementsByClassName('class_question_remove_'+current_col)[0].value="";
                    //    document.getElementsByClassName('class_question_remove_'+current_col)[1].value="";
                    //    document.getElementsByClassName('class_question_remove_'+current_col)[2].value="";
                    
                       if (prev_coll > 1) {
                        document.querySelector('#fc_question_' + prev_coll + ' a.del').classList.remove("ccs-dynaform-hidden");
                       }
                       $('.add-another-btn').removeClass("ccs-dynaform-hidden");
                   }
               } else {
               
                   target_fieldset.classList.add("ccs-dynaform-hidden");
                //    document.getElementsByClassName('class_question_remove_'+current_col)[0].value="";
                //    document.getElementsByClassName('class_question_remove_'+current_col)[1].value="";
                //    document.getElementsByClassName('class_question_remove_'+current_col)[2].value="";

                var fc_question_precenate_fir = document.getElementsByClassName('class_question_remove_'+nextLevel_coll)[0];
                       if(fc_question_precenate_fir){
                        document.getElementsByClassName('class_question_remove_'+nextLevel_coll)[0].value="";
                       }
                       var fc_question_precenate_sec = document.getElementsByClassName('class_question_remove_'+nextLevel_coll)[1];
                       if(fc_question_precenate_sec){
                        document.getElementsByClassName('class_question_remove_'+nextLevel_coll)[1].value="";
                       }
                       var fc_question_precenate_third = document.getElementsByClassName('class_question_remove_'+nextLevel_coll)[2];
                       if(fc_question_precenate_third){
                        document.getElementsByClassName('class_question_remove_'+nextLevel_coll)[2].value="";
                       }
                       //ID BASED
                       var fc_question_precenate_El = document.getElementById("fc_question_precenate_"+nextLevel_coll);
                       if(fc_question_precenate_El){
                         document.getElementById('fc_question_precenate_'+nextLevel_coll).value="";
                       }
             
                   if (prev_coll > 1) {
                    document.querySelector('#fc_question_' + prev_coll + ' a.del').classList.remove("ccs-dynaform-hidden");
                   }
                   $('.add-another-btn').removeClass("ccs-dynaform-hidden");
               }
               with_value_count--;
               totalAnswerd();
               totalPercentage();
               if (with_value_count != 21) {
                $('.add-another-btn').removeClass("ccs-dynaform-hidden");
               }
           });
            
            
            // db.addEventListener('click', (e) => {
            //     if($('.add-another-btn').hasClass("ccs-dynaform-hidden")){
            //         $('.add-another-btn').removeClass("ccs-dynaform-hidden");
            //     }
            //     e.preventDefault();
            //     let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
            //         prev_input = Number(target) - 1,
            //         target_fieldset = db.closest("div");
            //     if(Number(target) == 20){
            //         $('.add-another-btn').removeClass("ccs-dynaform-hidden");
            //     }
            //     target_fieldset.classList.add("ccs-dynaform-hidden");
            //     // document.querySelector('#fc_question_'+prev_input+' a.del').classList.remove("ccs-dynaform-hidden");
            //     //let precentageValueofLast = document.getElementById('fc_question_precenate_'+target).value;

            //     if (document.getElementById('fc_question_precenate_' + target) != undefined) {

            //         var precentageValueofLast = document.getElementById('fc_question_precenate_' + target).value;

            //     }


            //     //let precentageValueofLast = document.getElementById('fc_question_'+target).value;
            //     if (document.getElementById("totalPercentage") != undefined) {
            //         document.getElementById('totalPercentage').textContent = Number(document.getElementById('totalPercentage').textContent) > 0 ? Number(document.getElementById('totalPercentage').textContent) - Number(precentageValueofLast) : 0;

            //     }

            //     $('.class_question_remove_' + target).val("");

            //     if (document.getElementById('fc_question_' + target + "_1") != undefined) {
            //         document.getElementById('fc_question_' + target + "_1").value = "";
            //     }
            //     if (document.getElementById('fc_question_' + target + "_2") != undefined) {
            //         document.getElementById('fc_question_' + target + "_2").value = "";
            //     }
            //     if (document.getElementById('fc_question_' + target + "_3") != undefined) {
            //         document.getElementById('fc_question_' + target + "_3").value = "";
            //     }

            //     if (document.getElementById('fc_question_precenate_' + target) != undefined) {
            //         document.getElementById('fc_question_precenate_' + target).value = "";
            //     }

            //     // document.getElementById('fc_question_'+target+"_1").value = "";
            //     // document.getElementById('fc_question_'+target+"_2").value = "";
            //     // document.getElementById('fc_question_'+target+"_3").value = "";
            //     // document.getElementById('fc_question_'+target).value = "";
            //     if (prev_input > 1) {

            //         document.querySelector('#fc_question_' + prev_input + ' a.del').classList.remove("ccs-dynaform-hidden");
            //     } else {

            //     }
            //     //document.getElementsByClassName("add-another-btn").classList.remove('ccs-dynaform-hidden');
            //     if(urlParams.get('agreement_id') == 'RM1043.8' && with_value_count > 20){
            //         with_value_count = 21
            //     }
            //     with_value_count--;
            // });
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
    if(urlParamsDefault.get('agreement_id') == 'RM1043.8' && urlParamsDefault.get('id') == 'Criterion 2' && lotid_Default == 1 && (urlParamsDefault.get('group_id') == 'Group 8' || urlParamsDefault.get('group_id') == 'Group 5' || urlParamsDefault.get('group_id') == 'Group 7' || urlParamsDefault.get('group_id') == 'Group 9') && urlParamsDefault.get('section') == 5 ) {
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
    else if(urlParamsDefault.get('agreement_id') == 'RM1557.13' && urlParamsDefault.get('id') == 'Criterion 2' && urlParamsDefault.get('group_id') == 'Group 4'){
        var total_countva=20;
        var withValue=21;
        with_value_count = 20
    }
    else if(urlParamsDefault.get('agreement_id') == 'RM1557.13' && urlParamsDefault.get('id') == 'Criterion 2' && urlParamsDefault.get('group_id') == 'Group 6'){
        var total_countva=5;
        var withValue=6;
    }else{
        if($('.question_count').hasClass("question_count")) {      
               
            var total_countva=50;
           var withValue=51;
       }else{
           var total_countva=10;
           var withValue=11;
           with_value_count = 10;
       }
    }
   
    let deleteButtonClicked = false
        
     
      
      

        for (var box_num = total_countva; box_num > 1; box_num--) {
            let this_box = document.getElementById('fc_question_' + box_num);
           
            if (this_box.querySelector('.order_1') != undefined && this_box.querySelector('.order_1').value !== '') {
              
                this_box.classList.remove('ccs-dynaform-hidden');

                if(urlParamsDefault.get('agreement_id') == 'RM1043.8' || urlParamsDefault.get('agreement_id') == 'RM1557.13'){ 

                    if(document.getElementById("del_fc_question_" + box_num)){
                       document.getElementById("del_fc_question_" + box_num).classList.remove("ccs-dynaform-hidden");
                    }
                }
                if(urlParamsDefault.get('agreement_id') != 'RM1043.8'){
                    
                  //  document.getElementById("del_fc_question_" + box_num).classList.remove("ccs-dynaform-hidden");
                }

                
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
                
                if(urlParamsDefault.get('agreement_id') == 'RM1043.8'){
                  
                    document.getElementById("del_dos_question_" + box_num).classList.remove("ccs-dynaform-hidden");  
                }else{
                  
                    document.getElementById("del_fc_question_" + box_num).classList.remove("ccs-dynaform-hidden");
                }
                
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
        var divHide = $('div.ccs-dynaform-hidden').length;
        if(divHide == 30 && with_value_count == 20 && urlParams.get('agreement_id') == 'RM1557.13' && urlParams.get('id') == 'Criterion 2' && (urlParams.get('group_id') == 'Group 4')){
            with_value_count++;
        }
        if(divHide == 0 && with_value_count == 50 && urlParams.get('agreement_id') == 'RM1557.13' && urlParams.get('id') == 'Criterion 3' && (urlParams.get('group_id') == 'Group 18')){
            with_value_count++;
        }
        $('.add-another-btn').on('click', function() {
            totalPercentage();
            errorStore = [];
            let textboxCount =  0;
            if($('.order_1').length > 0){
                textboxCount =  $('.order_1').filter(function() {return this.value !== '';}).length;
            }else{
                textboxCount =  $('.order_2').filter(function() {return this.value !== '';}).length;
            }
                  
           let rootEl = document.getElementById('fc_question_' + textboxCount);
           
            if(urlParamsDefault.get('agreement_id') == 'RM1043.8' && textboxCount == 19 && with_value_count == 20){
                
                if (((rootEl.querySelector('.weightage') != null && rootEl.querySelector('.weightage') != undefined) && rootEl.querySelector('.weightage').value.length != 0 && rootEl.querySelector('.weightage').value != '0' && errorStore.length == 0)){
              
               $('.add-another-btn').addClass("ccs-dynaform-hidden");
                }
            }

            if(urlParamsDefault.get('agreement_id') != 'RM1043.8' && with_value_count == 50){
                $('.add-another-btn').addClass("ccs-dynaform-hidden");
            }

            if(urlParamsDefault.get('agreement_id') == 'RM6187' && (urlParamsDefault.get('group_id') == 'Group 4' || urlParamsDefault.get('group_id') == 'Group 6') && urlParamsDefault.get('id') == 'Criterion 2' && with_value_count == 10){
                
                $('.add-another-btn').addClass("ccs-dynaform-hidden");
            }
            
            let percentageval = $('#fc_question_precenate_'+textboxCount).val();

            if(urlParamsDefault.get('agreement_id') == 'RM1557.13' && (urlParamsDefault.get('group_id') == 'Group 4' || urlParamsDefault.get('group_id') == 'Group 6') && urlParamsDefault.get('id') == 'Criterion 2' && with_value_count == 10 && errorStore.length !=0){
                $('.add-another-btn').addClass("ccs-dynaform-hidden");
            }
          
        if(textboxCount <= 20 && urlParamsDefault.get('agreement_id') == 'RM1043.8' && urlParamsDefault.get('id') == 'Criterion 2' && (urlParamsDefault.get('group_id') == 'Group 8' || urlParamsDefault.get('group_id') == 'Group 5' || urlParamsDefault.get('group_id') == 'Group 6' || urlParamsDefault.get('group_id') == 'Group 7') && urlParamsDefault.get('section') == 5 ) {

         if ((textboxCount < (withValue-1)) && Number($('#totalPercentage').text()) >= 100) {
        //     $('.govuk-error-summary').remove();
        // $('.govuk-form-group--error').remove();
        // removeErrorFieldsRfpScoreQuestion();
        errorStore = emptyQuestionFieldCheckRfp();
        let count =1;
        if(textboxCount >0){
          count = textboxCount;
        }
         var percentageCheck = ccsZvalidateWithRegex('fc_question_precenate_' + count, 'The total weighting is 100% so you can not add more questions', /\wd+/);
        errorStore.push(percentageCheck)
        if(percentageCheck){
            $('.add-another-btn').removeClass("ccs-dynaform-hidden");
        }
            // errorStore.push(["There is a problem", "The total weighting is 100% so you can not add more questions"]);
        }
       else if (textboxCount == (withValue-1)) {


            if(urlParamsDefault.get('agreement_id') == 'RM6187' && (urlParamsDefault.get('group_id') == 'Group 4' || urlParamsDefault.get('group_id') == 'Group 6') && urlParamsDefault.get('id') == 'Criterion 2' && with_value_count == 10){
               
                $('.add-another-btn').addClass("ccs-dynaform-hidden");
            }
            
            if(textboxCount <= 20 && urlParamsDefault.get('agreement_id') == 'RM1043.8' && urlParamsDefault.get('id') == 'Criterion 2' && (urlParamsDefault.get('group_id') == 'Group 9' || urlParamsDefault.get('group_id') == 'Group 8' || urlParamsDefault.get('group_id') == 'Group 5' || urlParamsDefault.get('group_id') == 'Group 6' || urlParamsDefault.get('group_id') == 'Group 7') && urlParamsDefault.get('section') == 5 ) {
                if ((textboxCount < (withValue-1)) && Number($('#totalPercentage').text()) >= 100) {
                    // $('.govuk-error-summary').remove();
                    // $('.govuk-form-group--error').remove();
                    // removeErrorFieldsRfpScoreQuestion();
                    errorStore = emptyQuestionFieldCheckRfp();
                    let count =1;
                    if(textboxCount >0){
                      count = textboxCount;
                    }
                    var percentageCheck = ccsZvalidateWithRegex('fc_question_precenate_' + count, 'The total weighting is 100% so you can not add more questions', /\wd+/);
                    errorStore.push(percentageCheck)
                    if(percentageCheck){
                        $('.add-another-btn').removeClass("ccs-dynaform-hidden");
                        }
                    // errorStore.push(["There is a problem", "The total weighting is 100% so you can not add more questions"]);
                } else if (textboxCount == (withValue-1)) {

                    $('.govuk-error-summary').remove();
                    $('.govuk-form-group--error').remove();
                    removeErrorFieldsRfpScoreQuestion();
                    if (Number($('#totalPercentage').text()) < 100) {
                    var percentageCheck = ccsZvalidateWeihtageValue('fc_question_precenate_' + textboxCount, "The total weighting is less than 100%", Number($('#totalPercentage').text()),/\w+/);
                    errorStore.push(percentageCheck)
                    }
        }
        else {
          //  if(urlParamsDefault.get('group_id') == 'Group 6' && urlParamsDefault.get('section') == 5 && urlParamsDefault.get('step') == 45){
                let textareaVal = $('#fc_question_'+textboxCount+ '_1').val();
                let percentageval = $('#fc_question_precenate_'+textboxCount).val();
                if(textareaVal != null || textareaVal != undefined || textareaVal != ''){
                    if((textareaVal != undefined && textareaVal.length != 0) && (percentageval == '' || percentageval == null || percentageval == undefined)){
                        let msgWeightageContent = 'You must enter percentage';
 
                        if(urlParams.get('group_id') == 'Group 5') {
                            msgWeightageContent = 'Enter a weighting for this essential skill or experience';
                        }
                        else if(urlParams.get('group_id') == 'Group 6') {

                            msgWeightageContent = 'Enter a weighting for this nice-to-have skill and experience';
                        }
                        else if(urlParams.get('group_id') == 'Group 7' ) {

                            msgWeightageContent = 'Enter a weighting for this technical question';
                        }
                        else if(lotid_Default == 1 && urlParams.get('group_id') == 'Group 8') {

                            msgWeightageContent = 'Enter a weighting for this cultural fit question';
                        }
                        else if(lotid_Default == 3 && urlParams.get('group_id') == 'Group 8') {

                            msgWeightageContent = 'Enter a weighting for this social value question';
                        }
                        var fieldCheck =  ccsZvalidateWithRegex('fc_question_precenate_' + textboxCount, msgWeightageContent, /\w+/);
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
                    errorStore.push(["There is a problem", "Cannot add another question already "+ textboxCount +" questions created"]);
                    var object = $('.add-another-btn').closest('.ccs-page-section');
                    if (object.length) {
                    $('.add-another-btn').closest('.ccs-page-section').css("border-bottom", "0px");
                    }
                } else {
                    //  if(urlParamsDefault.get('group_id') == 'Group 6' && urlParamsDefault.get('section') == 5 && urlParamsDefault.get('step') == 45){
                    let textareaVal = $('#fc_question_'+textboxCount+ '_1').val();
                    let percentageval = $('#fc_question_precenate_'+textboxCount).val();
                    if(textareaVal != null || textareaVal != undefined || textareaVal != ''){
                    if((textareaVal != undefined && textareaVal.length != 0) && (percentageval == '' || percentageval == null || percentageval == undefined)){
                        let msgWeightageContent = 'You must enter percentage';
                        if(urlParams.get('group_id') == 'Group 5') {
                            msgWeightageContent = 'Enter a weighting for this essential skill or experience';
                        }
                       else if(urlParams.get('group_id') == 'Group 6') {

                            msgWeightageContent = 'Enter a weighting for this nice-to-have skill and experience';
                        }
                        else if(urlParams.get('group_id') == 'Group 7') {

                            msgWeightageContent = 'Enter a weighting for this technical question';
                        }
                        else if(lotid_Default == 1 && urlParams.get('group_id') == 'Group 8') {

                            msgWeightageContent = 'Enter a weighting for this cultural fit question';
                        }
                        else if(lotid_Default == 3 && urlParams.get('group_id') == 'Group 8') {

                            msgWeightageContent = 'Enter a weighting for this social value question';
                        }
                        var fieldCheck =  ccsZvalidateWithRegex('fc_question_precenate_' + textboxCount, msgWeightageContent, /\w+/);
                        errorStore.push(fieldCheck)
                    } else{
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

            } else if(urlParamsDefault.get('agreement_id') == 'RM1043.8' && urlParamsDefault.get('id') == 'Criterion 2' && urlParamsDefault.get('group_id') == 'Group 9'  && urlParamsDefault.get('section') == 5) {
               
                if(textboxCount <= 20){
                    if ((textboxCount < (withValue-1)) && Number($('#totalPercentage').text()) >= 100) {
                            // $('.govuk-error-summary').remove();
                            // $('.govuk-form-group--error').remove();
                            // removeErrorFieldsRfpScoreQuestion();
                            errorStore = emptyQuestionFieldCheckRfp();
                            let count =1;
                            if(textboxCount >0){
                              count = textboxCount;
                    }
                           var percentageCheck = ccsZvalidateWithRegex('fc_question_precenate_' + count, 'The total weighting is 100% so you can not add more questions', /\wd+/);
                            errorStore.push(percentageCheck)

                            if(percentageCheck){
                                $('.add-another-btn').removeClass("ccs-dynaform-hidden");
                            }

                            // errorStore.push(["There is a problem", "The total weighting is 100% so you can not add more questions"]);
                    } else if (textboxCount == (withValue-1)) {
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
                    }  else {
                        let textareaVal = $('#fc_question_'+textboxCount+ '_1').val();
                        let percentageval = $('#fc_question_precenate_'+textboxCount).val();
                        if(textareaVal != null || textareaVal != undefined || textareaVal != ''){
                            if( (textareaVal != undefined && textareaVal.length != 0) && (percentageval == '' || percentageval == null || percentageval == undefined)){
                                var fieldCheck =  ccsZvalidateWithRegex('fc_question_precenate_' + textboxCount, "Enter a weighting for this social value question", /\w+/);
                                errorStore.push(fieldCheck)
                            } else{
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
            } else if(textboxCount <= 20 && urlParamsDefault.get('agreement_id') == 'RM1043.8' && urlParamsDefault.get('id') == 'Criterion 3' && (urlParamsDefault.get('group_id') == 'Group 15' || urlParamsDefault.get('group_id') == 'Group 19') || (lotid_Default == 3 && urlParamsDefault.get('group_id') == 'Group 17')){
                removeErrorFieldsRfpScoreQuestion();
                for (var i = 1; i < withValue; i++) {
                    const divElem = document.querySelector('#fc_question_' + i);
                    const inputElements = divElem.querySelectorAll("textarea");
                    let error_classes = $('#fc_question_'+i).hasClass('ccs-dynaform-hidden');
                    if (inputElements != null && inputElements != undefined && inputElements.length > 0) {
                        for (let index = 0; index < inputElements.length; index++) {
                            const element = inputElements[index];
                            ccsZremoveErrorMessage(element)
                            if (element.value == '' && index >= 0 && (error_classes == false)) {
                                let errorMsg = '';
                                if(urlParamsDefault.get('group_id') == 'Group 19' || (lotid_Default == 3 && urlParamsDefault.get('group_id') == 'Group 17')){
                                    errorMsg = "Enter your special terms and conditions";
                                }
                                else if(urlParamsDefault.get('group_id') == 'Group 15'){
                                    errorMsg = "Enter accessibility requirements";
                                }
                                else {
                                    errorMsg = "You must add information in all fields";
                                }
                                    let error = ccsZvalidateWithRegex(element.id, errorMsg, /^.+$/);
                                    errorStore.push(error);
                            }

                            if (textboxCount == 19) {

                                $('.add-another-btn').addClass("ccs-dynaform-hidden");
                            }
                        }
                    }
                }
            } else {

                if(textboxCount <= total_countva){
                    if ((textboxCount < (withValue-1)) && Number($('#totalPercentage').text()) >= 100) {
                            if((urlParams.get('agreement_id') == 'RM1557.13') && ((urlParams.get('group_id') == 'Group 4') || (urlParams.get('group_id') == 'Group 6' )))
                            {
                                errorStore = emptyQuestionFieldCheckRfp();
                                errorStore.push(["There is a problem", "The total weighting is 100% so you cannot add more questions without changing your weightings"]);
                            }
                            else if((urlParams.get('agreement_id') == 'RM6187') && (urlParams.get('group_id') == 'Group 4' ))
                            {
                                errorStore = emptyQuestionFieldCheckRfp();
                                errorStore.push(["There is a problem", "The total weighting is 100% so you cannot add more questions without changing your weightings"]);
                            }
                            else{
                                errorStore = emptyQuestionFieldCheckRfp();
                                errorStore.push(["There is a problem", "The total weighting is 100% so you can not add more questions"]);
                            }
                    } else if (textboxCount == (withValue-1)) {
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
                    }  else {

                        let textareaVal = $('#fc_question_'+textboxCount+ '_1').val();
                        let percentageval = $('#fc_question_precenate_'+textboxCount).val();
                        const pageHeading = document.getElementById('page-heading').innerHTML;
                        if(textareaVal != undefined ||textareaVal != null || textareaVal != ''){
                            if( (textareaVal != undefined && textareaVal.length != 0) && (percentageval == '' || percentageval == null || percentageval == undefined || percentageval == 0) && (!pageHeading.includes("Enter your project requirements"))){
                                if(urlParams.get('agreement_id') == 'RM1557.13' || urlParams.get('agreement_id') == 'RM6187' && urlParams.get('id') == 'Criterion 2' && (urlParams.get('group_id') == 'Group 4' || urlParams.get('group_id') == 'Group 6')){
                                    var fieldCheck = ccsZvalidateWeihtageValue('fc_question_precenate_'+ textboxCount, "You must enter valid percentage",'','',false);
                                    errorStore.push(fieldCheck)
                                }else{
                                var fieldCheck =  ccsZvalidateWithRegex('fc_question_precenate_' + textboxCount, "Enter a weighting for this social value question", /\w+/);
                                errorStore.push(fieldCheck)
                                }
                            } else{
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


               
                // if (Number($('#totalPercentage').text()) >= 100) {
                // $('.govuk-error-summary').remove();

                // $('.govuk-form-group--error').remove();
                // removeErrorFieldsRfpScoreQuestion();

                // errorStore.push(["There is a problem", "The total weighting is 100% so you can not add more questions"]);
                // }
                // else {
                //     errorStore = emptyQuestionFieldCheckRfp(); 
                // }
            }
            
            if (errorStore.length == 0) {
                prev_input = with_value_count - 1;
                deleteButtonClicked = true
                if(agreement_id_Default == "RM1043.8" && with_value_count > 20){
                    with_value_count = 20
                }
                
                // if(divHide == 31 && with_value_count == 19 && urlParams.get('agreement_id') == 'RM1557.13' && urlParams.get('id') == 'Criterion 2' && (urlParams.get('group_id') == 'Group 4')){
                //   with_value_count = with_value_count;
                // }
                // if(divHide == 1 && with_value_count == 49 && urlParams.get('agreement_id') == 'RM1557.13' && urlParams.get('id') == 'Criterion 3' && (urlParams.get('group_id') == 'Group 18')){
                //   with_value_count = total_countva;
                // }
                if(divHide == 46 && with_value_count == 49 && urlParams.get('agreement_id') == 'RM1557.13' && urlParams.get('id') == 'Criterion 2' && (urlParams.get('group_id') == 'Group 6')){
                    with_value_count = 5;
                }
                if(agreement_id_Default == "RM1043.8" ){
                    let termvalue = document.getElementById('fc_question_' + with_value_count).value;
                    let termdefvalue = document.getElementById('fc_question_precenate_' + with_value_count).value;
                    if(termvalue != '' && termdefvalue != ''){
                        if(with_value_count == 20){
                            $('.add-another-btn').addClass("ccs-dynaform-hidden");
                          // document.getElementById("ccs_rfpTerm_add").classList.add('ccs-dynaform-hidden');
                        }
                        else{
                        with_value_count++;
                        document.getElementById('fc_question_'+ with_value_count).classList.remove('ccs-dynaform-hidden');
               
                       
                        if (document.getElementById("questionsCount") != undefined) {
                            document.getElementById("questionsCount").textContent = with_value_count + ' technical questions entered so far';
                        }
                        document
                            .querySelector('label[for=fc_question_' + with_value_count + '] a.del')
                            .classList.remove('ccs-dynaform-hidden');
                        if (with_value_count === 20 ) {
                            $('.add-another-btn').addClass("ccs-dynaform-hidden");
                        }
                        }
                      } 
                      else{
                        document.getElementById('fc_question_'+ with_value_count).classList.remove('ccs-dynaform-hidden');

                //Added this condation section 5 (step 43/44/45)

                if (with_value_count > 2) {
                    // if($('#del_dos_question_'+ with_value_count) || $('#del_fc_question_'+ with_value_count)){
                    //     document.querySelector('label[for=fc_question_' + prev_input + '] a.del').classList.add('ccs-dynaform-hidden');
                    // }else {
                    //     document.querySelector('label[for=fc_question_' + prev_input + '] a.del').classList.remove('ccs-dynaform-hidden');
                    // }
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
            }
        }else{
            document.getElementById('fc_question_'+ with_value_count).classList.remove('ccs-dynaform-hidden');

            //Added this condation section 5 (step 43/44/45)

            if (with_value_count > 2) {
                // if($('#del_dos_question_'+ with_value_count) || $('#del_fc_question_'+ with_value_count)){
                //     document.querySelector('label[for=fc_question_' + prev_input + '] a.del').classList.add('ccs-dynaform-hidden');
                // }else {
                //     document.querySelector('label[for=fc_question_' + prev_input + '] a.del').classList.remove('ccs-dynaform-hidden');
                // }
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
        }
                
                if(!(urlParamsDefault.get('agreement_id') == 'RM1043.8' && urlParamsDefault.get('id') == 'Criterion 2' && lotid_Default == 1 && (urlParamsDefault.get('group_id') == 'Group 8' || urlParamsDefault.get('group_id') == 'Group 5') && urlParamsDefault.get('section') == 5)) {
                 if (with_value_count == withValue) {
                    $('.add-another-btn').addClass('ccs-dynaform-hidden');
                    errorStore.push(["There is a problem", "Cannot add another question already "+ with_value_count +" questions created"]);
                    var object = $('.add-another-btn').closest('.ccs-page-section');
                    if (object.length) {
                        $('.add-another-btn').closest('.ccs-page-section').css("border-bottom", "0px");
                    }
                }
                }
                totalAnswerd();
               // $('#del_dos_question_' + prev_input).addClass("ccs-dynaform-hidden");
                
            } else ccsZPresentErrorSummary(errorStore);
        });
        




        // deleteButtons.forEach((db) => {
        //     //db.classList.remove('ccs-dynaform-hidden')
        //     db.addEventListener('click', (e) => {
        //         totalAnswerd();
        //         e.preventDefault();
        //         let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
        //             prev_input = Number(target) - 1,
        //             target_fieldset = db.closest("div");

        //         target_fieldset.classList.add("ccs-dynaform-hidden");
        //         if (document.getElementById('fc_question_precenate_' + target) != undefined) {
        //             var precentageValueofLast = document.getElementById('fc_question_precenate_' + target).value;
        //         }
        //         if (document.getElementById("totalPercentage") != undefined) {
        //             document.getElementById('totalPercentage').textContent = Number(document.getElementById('totalPercentage').textContent) > 0 ? Number(document.getElementById('totalPercentage').textContent) - Number(precentageValueofLast) : 0;
        //         }
        //         // document.getElementById('fc_question_' + target + "_1").value = "";
        //         // document.getElementById('fc_question_' + target + "_2").value = "";
        //         // document.getElementById('fc_question_' + target + "_3").value = "";

        //         $('.class_question_remove_' + target).val("");

        //         if (document.getElementById('fc_question_' + target + "_1") != undefined) {
        //             document.getElementById('fc_question_' + target + "_1").value = "";
        //         }
        //         if (document.getElementById('fc_question_' + target + "_2") != undefined) {
        //             document.getElementById('fc_question_' + target + "_2").value = "";
        //         }
        //         if (document.getElementById('fc_question_' + target + "_3") != undefined) {
        //             document.getElementById('fc_question_' + target + "_3").value = "";
        //         }

        //         if (document.getElementById('fc_question_precenate_' + target) != undefined) {
        //             document.getElementById('fc_question_precenate_' + target).value = "";
        //         }

        //         if (prev_input > 1) {
        //             document.querySelector('#fc_question_' + prev_input + ' a.del').classList.remove("ccs-dynaform-hidden");
        //         }

        //     })
        // });

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
              //  $('#del_dos_question_' + prevvaalue).addClass("ccs-dynaform-hidden");
            }
            if(urlParamsDefault.get('agreement_id') == 'RM1043.8' && showinputarray.length == 19){
                $('.add-another-btn').addClass("ccs-dynaform-hidden");
                //$('#del_dos_question_19').addClass("ccs-dynaform-hidden");
                $('#del_dos_question_20').removeClass("ccs-dynaform-hidden");
                }
                if(urlParamsDefault.get('agreement_id') != 'RM1043.8' && showinputarray.length == 49){
                    $('.add-another-btn').addClass("ccs-dynaform-hidden");
                }
                if(urlParamsDefault.get('agreement_id') == 'RM1557.13' && showinputarray.length == 4 && urlParams.get('id') == 'Criterion 2' && (urlParams.get('group_id') == 'Group 6')){
                    $('.add-another-btn').addClass("ccs-dynaform-hidden");
                }
                if(urlParamsDefault.get('agreement_id') == 'RM6187' && (urlParamsDefault.get('group_id') == 'Group 4' || urlParamsDefault.get('group_id') == 'Group 6') && urlParamsDefault.get('id') == 'Criterion 2' && showinputarray.length == 9){
                    $('.add-another-btn').addClass("ccs-dynaform-hidden");
                }
        }
        } 
    }

    const checkFieldsRfpgl4 = () => {
        const start = 1;
        const end = 20;
        const pageHeading = document.getElementById('page-heading').innerHTML;
        for (var a = start; a <= end; a++) {
            let input = $(`#fc_question_1_${a}`)
            let textbox = $(`#fc_question_precenate_${a}`);
    
            if (!pageHeading.includes("(Optional)")) {
                const field1 = countWords1(input.val()) < 50;
                const field2 = countWords1(textbox.val()) < 150;
                if (input.val() !== "" || field1) {
    
                    $(`#fc_question_1_${a}-error`).remove();
                    $(`.acronym_${a} div`).removeClass('govuk-form-group--error');
                    $(`.acronym_${a} input`).removeClass('govuk-input--error')
    
                }
    
    
                if (textbox.val() !== "" || field2) {
    
                    $(`#fc_question_precenate_${a}-error`).remove();
                    $(`.acronym_${a} div`).removeClass('govuk-form-group--error');
                    $(`.acronym_${a} textarea`).removeClass('govuk-input--error');
                    $(`.acronym_${a} textarea`).removeClass('govuk-textarea--error')
                }
            }
    
        }
    }

    const removeErrorFieldsgl4 = () => {
        $('.govuk-error-message').remove();
        $('.govuk-form-group--error').removeClass('govuk-form-group--error')
        $('.govuk-error-summary').remove();
        $(".govuk-input").removeClass("govuk-input--error");
        $('.govuk-form-group textarea').removeClass('govuk-textarea--error');
    }

    const emptyFieldCheckgl4 = (type) => {
        let fieldCheck = "",
            errorStore = [];
        removeErrorFieldsgl4();
        const pageHeading = document.getElementById('page-heading').innerHTML;
       
        fieldMsg = 'You must add information in all fields.';
        descMsg = 'You must add information in all fields.';
        
        for (var x = 1; x < 21; x++) {
            let term_field = document.getElementById('fc_question_1_' + x);
            let definition_field = document.getElementById("fc_question_precenate_" + x);
    
            if (term_field != null && term_field.value !== undefined && definition_field !== null && definition_field !== undefined) {
                
                if(type == 'addmore'){
                    const field1 = countWords1(term_field.value) > 50;
                    const field2 = countWords1(definition_field.value) > 150;
                    //if (term_field.closest("fieldset").classList.value.indexOf("ccs-dynaform-hidden") === -1) {
                        if (!term_field.classList.contains('ccs-dynaform-hidden')) {
                        checkFieldsRfpgl4();
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
                   if(pageHeading.trim().toLowerCase() != 'Special terms and conditions (Optional)'.toLowerCase()) {
                    if (!(term_field.value == '' && definition_field.value == '' || term_field.value != '' && definition_field.value != '') ) {
                        const field1 = countWords1(term_field.value) > 50;
                        const field2 = countWords1(definition_field.value) > 150;
                        if (!term_field.classList.contains('ccs-dynaform-hidden')) {
                            checkFieldsRfpgl4();
                                if (term_field.value.trim() === '') {
                                    fieldCheck = [term_field.id, fieldMsg];
                                    ccsZaddErrorMessage(term_field, 'You must enter valid question');
                                    errorStore.push(fieldCheck);
                                } else if (definition_field.value.trim() === '') {
                                    fieldCheck = [definition_field.id, descMsg];
                                    ccsZaddErrorMessage(definition_field, 'You must enter percentage');
                                    errorStore.push(fieldCheck);                        
                                } 
                        }
                    }
                   }
                }
            }
    
        }
        return errorStore;
    }

    const emptyQuestionFieldCheckRfp = () => {
        removeErrorFieldsRfpScoreQuestion();
        const countWords = str => str.trim().split(/\s+/).length;
        let LOTID_VAR;
        if(document.getElementById('lID') !== null) {
            LOTID_VAR = document.getElementById('lID').value;
        }
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
                            }else if(labelText.trim() == 'Describe the requirement'){
                               
                                msg = 'You must enter your description of the requirement';
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
                                   
                                    ccsZvalidateWithRegex(element.id, msg,/\w+/)
                                    $('.add-another-btn').removeClass("ccs-dynaform-hidden");
                                    errorStore.push([element.id, msg])
                                }
                            } else if(index === 1){
                              
                                if (element.value == '' || element.value === undefined || element.value === null) {
                                    ccsZvalidateWithRegex(element.id, msg,/\w+/)
                                    $('.add-another-btn').removeClass("ccs-dynaform-hidden");
                                    errorStore.push([element.id, desmsg])
                                }
                            }else {
                                
                                if (element.value == '' || element.value === undefined || element.value === null) {
                                    ccsZvalidateWithRegex(element.id, msg,/\w+/)
                                    errorStore.push([element.id, "You must enter your description of the requirement"])
                                }
                            }
                        }
                    }
                    noOfRequirement_Group += 1;
                } else if( pageHeading.trim().toLowerCase() != 'Special terms and conditions (Optional)'.toLowerCase()) {
                    if (rootEl.querySelector('.order_1')) {
                        let element = rootEl.querySelector('.order_1');


                        if ((rootEl.querySelector('.order_1').value == '' || ((rootEl.querySelector('.weightage') != null && rootEl.querySelector('.weightage') != undefined) && (rootEl.querySelector('.weightage').value == '' || rootEl.querySelector('.weightage').value == '0'))) && !(pageHeading.includes("Assisted digital and accessibility requirements (optional)") || (pageHeading.includes("Assisted digital and accessibility requirements (Optional)")))) {
                            let msgContent = 'You must enter valid question';
                            let msgWeightageContent = 'You must enter percentage';

                          
                            if(urlParams.get('agreement_id') == 'RM1043.8' && urlParams.get('id') == 'Criterion 2' && (LOTID_VAR == 1 && (urlParams.get('group_id') == 'Group 5')) || (LOTID_VAR == 3 && (urlParams.get('group_id') == 'Group 5' )) ) {
                                msgContent = 'Enter an essential skill or experience';
                                msgWeightageContent = 'Enter a weighting for this essential skill or experience';
                            }
                            else if(urlParams.get('agreement_id') == 'RM1043.8' && urlParams.get('id') == 'Criterion 2' && (LOTID_VAR == 1 && (urlParams.get('group_id') == 'Group 6')) || (LOTID_VAR == 3 && (urlParams.get('group_id') == 'Group 6' )) ) {
                                msgContent = 'Enter a nice-to-have skill and experience';
                                msgWeightageContent = 'Enter a weighting for this nice-to-have skill and experience';
                            }
                            else if(urlParams.get('agreement_id') == 'RM1043.8' && urlParams.get('id') == 'Criterion 2' && (LOTID_VAR == 1 && (urlParams.get('group_id') == 'Group 7')) || (LOTID_VAR == 3 && (urlParams.get('group_id') == 'Group 7' )) ) {
                                msgContent = 'Enter a technical question';
                                msgWeightageContent = 'Enter a weighting for this technical question';
                            }
                            else if(urlParams.get('agreement_id') == 'RM1043.8' && urlParams.get('id') == 'Criterion 2' && (LOTID_VAR == 1 && (urlParams.get('group_id') == 'Group 9')) || (LOTID_VAR == 3 && (urlParams.get('group_id') == 'Group 8' )) ) {
                                msgContent = 'Enter a social value question';
                                msgWeightageContent = 'Enter a weighting for this social value question';
                            }
                            else if(urlParams.get('agreement_id') == 'RM1043.8' && urlParams.get('id') == 'Criterion 2' && (LOTID_VAR == 1 && (urlParams.get('group_id') == 'Group 8')) ) {
                                msgContent = 'Enter a cultural fit question';
                                msgWeightageContent = 'Enter a weighting for this cultural fit question';
                            }
                            
                            
                            const msg = rootEl.querySelector('.order_1').value ?
                                'Entry is limited to 50 words' :
                                msgContent;
                            fieldCheck = ccsZvalidateWithRegex('fc_question_' + i + '_1', msg, /\w+/);

                            let percentageCheck;
                            if(urlParams.get('agreement_id') == 'RM1557.13' && urlParams.get('id') == 'Criterion 2' && urlParams.get('group_id') == 'Group 4' && rootEl.querySelector('.weightage').value == '0'){
                                 percentageCheck = ccsZvalidateWithRegex('fc_question_precenate_' + i, 'You must enter valid percentage', /\wd+/);
                            }else{
                                 percentageCheck = ccsZvalidateWithRegex('fc_question_precenate_' + i, msgWeightageContent, /\w+/);
                            }
                           
                            if (fieldCheck !== true){
                                errorStore.push(fieldCheck);
                            }


                               
                            if(percentageCheck){
                                if(urlParams.get('agreement_id') == 'RM1043.8' && rootEl.querySelector('.weightage').value == '0'){
                                    errorStore.push(ccsZvalidateWithRegex('fc_question_precenate_' + i, 'You must enter valid percentage', /\wd+/));
                                }else{
                                errorStore.push(percentageCheck);
                            }
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
       let errorStoreforOptional = '';
       if(urlParams.get('agreement_id') == 'RM1557.13' || urlParams.get('agreement_id') == 'RM6187'){
       errorStoreforOptional = emptyFieldCheckgl4('submit');
       }
     
        if (errorStoreforOptional.length == 0) {

        var weightLoop = document.getElementsByClassName("weightage");
        if(urlParams.get('agreement_id') == 'RM1043.8' && urlParams.get('id') == 'Criterion 2' && (LOTID_VAR == 1 && (urlParams.get('group_id') == 'Group 8' || urlParams.get('group_id') == 'Group 5' || urlParams.get('group_id') == 'Group 6' || urlParams.get('group_id') == 'Group 7'|| urlParams.get('group_id') == 'Group 9')) || (LOTID_VAR == 3 && (urlParams.get('group_id') == 'Group 5' || urlParams.get('group_id') == 'Group 6' || urlParams.get('group_id') == 'Group 7'|| urlParams.get('group_id') == 'Group 8')) ) {
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
        else if(urlParams.get('agreement_id') == 'RM1557.13' && urlParams.get('id') == 'Criterion 2' && urlParams.get('group_id') == 'Group 6') {
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
                
                if((urlParams.get('group_id') == 'Group 9' || urlParams.get('group_id') == 'Group 6' || urlParams.get('group_id') == 'Group 8') && urlParamsDefault.get('section') == 5){
                    var textareaVal = $('#fc_question_'+1+ '_1').val();
                    var percentageval = $('#fc_question_precenate_'+1).val();
                    if(textareaVal.trim() != '' || textareaVal != null || textareaVal != undefined){
                        if(textareaVal.length != 0 && (percentageval == '' || percentageval == null || percentageval == undefined)){
                           let msgContent = 'You must enter percentage';
                           if(urlParams.get('group_id') == 'Group 6' ){
                            msgContent = 'Enter a weighting for this nice-to-have skill and experience';
                           }
                           else if(urlParams.get('group_id') == 'Group 9' || (LOTID_VAR == 3 && urlParams.get('group_id') == 'Group 8') ){
                            msgContent = 'Enter a weighting for this social value question';
                           }
                           
                            var fieldCheck =  ccsZvalidateWithRegex('fc_question_precenate_' + 1, msgContent, /\w+/);
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
            }else if(urlParams.get('agreement_id') == 'RM1557.13' && urlParams.get('id') == 'Criterion 2' && urlParams.get('group_id') == 'Group 6') {
                document.forms['rfp_multianswer_question_form'].submit();
            }
             else {
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
                            let msgContent = 'You must enter your question';

                            if(urlParams.get('agreement_id') == 'RM1043.8' && urlParams.get('id') == 'Criterion 2' && (LOTID_VAR == 1 && (urlParams.get('group_id') == 'Group 5')) || (LOTID_VAR == 3 && (urlParams.get('group_id') == 'Group 5' )) ) {
                                msgContent = 'Enter an essential skill or experience';
                                msgWeightageContent = 'Enter a weighting for this essential skill or experience';
                            }
                            else if(urlParams.get('agreement_id') == 'RM1043.8' && urlParams.get('id') == 'Criterion 2' && (LOTID_VAR == 1 && (urlParams.get('group_id') == 'Group 7')) || (LOTID_VAR == 3 && (urlParams.get('group_id') == 'Group 7' )) ) {
                                msgContent = 'Enter a technical question';
                                msgWeightageContent = 'Enter a weighting for this technical question';
                            }
                            else if(urlParams.get('agreement_id') == 'RM1043.8' && urlParams.get('id') == 'Criterion 2' && (LOTID_VAR == 1 && (urlParams.get('group_id') == 'Group 8'))) {
                                msgContent = 'Enter a cultural fit question';
                                msgWeightageContent = 'Enter a weighting for this cultural fit question';
                            }
                            

                            var fieldCheck = ccsZvalidateWithRegex('fc_question_' + i + '_1', msgContent, /\w+/);

                            errorStore.push(fieldCheck)
                        } 
                        if((($('#fc_question_precenate_'+i).val() == '' && (error_classes == false && additional_classes == false )) ||
                        ($('#fc_question_precenate_'+i).val() == '' && ( error_classes == false && additional_classes == true ))

                        ) && !pageHeading.includes('Write your social value questions (Optional)')) {
                             let msgWeightageContent = 'You must enter a weighting for this question';
 
                             if(urlParams.get('agreement_id') == 'RM1043.8' && urlParams.get('id') == 'Criterion 2' && (LOTID_VAR == 1 && (urlParams.get('group_id') == 'Group 5')) || (LOTID_VAR == 3 && (urlParams.get('group_id') == 'Group 5' )) ) {
                                 msgWeightageContent = 'Enter a weighting for this essential skill or experience';
                             }
                             else if(urlParams.get('agreement_id') == 'RM1043.8' && urlParams.get('id') == 'Criterion 2' && (LOTID_VAR == 1 && (urlParams.get('group_id') == 'Group 7')) || (LOTID_VAR == 3 && (urlParams.get('group_id') == 'Group 7' )) ) {
                                msgWeightageContent = 'Enter a weighting for this technical question';
                             }
                             else if(urlParams.get('agreement_id') == 'RM1043.8' && urlParams.get('id') == 'Criterion 2' && (LOTID_VAR == 1 && (urlParams.get('group_id') == 'Group 8')) ) {
                                msgWeightageContent = 'Enter a weighting for this cultural fit question';
                             }
                            
                        var percentageCheck = ccsZvalidateWithRegex('fc_question_precenate_' + i, msgWeightageContent, /\w+/);

                        errorStore.push(percentageCheck)
                        }
                        
                       if(urlParams.get('agreement_id') == 'RM1557.13'){
                      
                        if($('#fc_question_precenate_'+i).val() == '' && (error_classes == false && additional_classes == false ) && !pageHeading.includes('Write your social value questions (Optional)')){
                            errorStore.push(["There is a problem", "Your total weighting must be 100%"]);

                        }
                        else if($('#fc_question_precenate_'+i).val() != '' && (error_classes == false && additional_classes == false ) && !pageHeading.includes('Write your social value questions (Optional)') && Number($('#totalPercentage').text()) < 1){
                            errorStore.push(["There is a problem", "Your total weighting is must be greater than 1%"]);
                        }
                        else if($('#fc_question_precenate_'+i).val() != '' && (error_classes == false && additional_classes == false ) && !pageHeading.includes('Write your social value questions (Optional)') && Number($('#totalPercentage').text()) < 100){
                            errorStore.push(["There is a problem", "Your total weighting must be 100%"]);
                        }

                        if($('#fc_question_precenate_'+i).val() != '' && (error_classes == false && additional_classes == false ) && pageHeading.includes('Write your social value questions (Optional)')){
                            errorStore.push(["There is a problem", "Your total weighting must be 100% "]);
                        }
                    }
                   
                    }
                    
                    if((urlParams.get('group_id') == 'Group 8' || urlParams.get('group_id') == 'Group 7' || urlParams.get('group_id') == 'Group 5') && urlParamsDefault.get('section') == 5){
                     
                    
                        if(urlParams.get('agreement_id') == 'RM1043.8'){
                            if($('#fc_question_precenate_' + 1).val() == '' && $('#fc_question_precenate_' + 1).val() < 100){
                                // var percentageCheck = ccsZvalidateWeihtageValue('fc_question_precenate_' + 1, "Your total weighting must be 100%",Number($('#totalPercentage').text()), /\w+/);
        
                                // errorStore.push(percentageCheck)
                                errorStore.push(["There is a problem", "Your total weighting must be 100%"]);
                                }
                        }
                        else{
                        if($('#fc_question_precenate_' + 1).val() == ''){
                        var percentageCheck = ccsZvalidateWeihtageValue('fc_question_precenate_' + 1, "Your total weighting must be 100%",Number($('#totalPercentage').text()), /\w+/);

                        errorStore.push(percentageCheck)
                        }
                    }
        
                    }
                    // else{
                        // console.log('com')
                        // console.log(i)
                        // console.log($('#fc_question_precenate_'+i).val());
                        // console.log(pageHeading.includes('Write your social value questions (Optional)'));
                        
                        
                    // }

                    if(urlParams.get('agreement_id') == 'RM6187' && urlParams.get('id') == 'Criterion 2' && urlParams.get('group_id') == 'Group 4'){
                        if (Number($('#totalPercentage').text()) < 100) {
                            errorStore.push(["There is a problem", "The total weighting is less than 100% "]);
                            }
                    }

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
                if(urlParams.get('agreement_id') == 'RM1043.8' && urlParams.get('id') == 'Criterion 2' && (urlParams.get('group_id') == 'Group 9' || urlParams.get('group_id') == 'Group 5' || urlParams.get('group_id') == 'Group 7' || urlParams.get('group_id') == 'Group 8' || urlParams.get('group_id') == 'Group 6' )  && urlParams.get('section') == 5) {

                let textboxCount =  $('.order_1').filter(function() {return this.value !== '';}).length;
                let weighttage_1 = $('#fc_question_precenate_' + 1).val();
                if(textboxCount == 0 && weighttage_1 != '' && Number(weighttage_1) != 0 ){
                    textboxCount = 1
                }
                
                if($('#fc_question_precenate_' + textboxCount).val() != '' && Number($('#fc_question_precenate_' + textboxCount).val()) != 0 ){

                var percentageCheck = ccsZvalidateWeihtageValue('fc_question_precenate_' + textboxCount, "The total weighting is less than 100%",Number($('#totalPercentage').text()), /\w+/);
                errorStore.push(percentageCheck)
                }
                else if($('#fc_question_'+textboxCount+ '_1').val() != '' && $('#fc_question_precenate_' + textboxCount).val() == '' && Number($('#totalPercentage').text()) > 0 ){
                    let textcount = textboxCount-1;
                    var percentageCheck = ccsZvalidateWeihtageValue('fc_question_precenate_' + textcount, "The total weighting is less than 100%",Number($('#totalPercentage').text()), /\w+/);
                    errorStore.push(percentageCheck)
                }
                } else{
                     errorStore.push(["There is a problem", "The total weighting is less than 100% "]);
                }
            }
             //Remain Agreement
            if ($('#totalPercentage') != null && $('#totalPercentage') != undefined && $('#totalPercentage').length > 0 && Number($('#totalPercentage').text()) > 100) {
                errorStore = emptyQuestionFieldCheckRfp(); 
                if(urlParams.get('agreement_id') == 'RM1043.8' && urlParams.get('id') == 'Criterion 2' && (urlParams.get('group_id') == 'Group 9' || urlParams.get('group_id') == 'Group 5' || urlParams.get('group_id') == 'Group 7' || urlParams.get('group_id') == 'Group 8' || urlParams.get('group_id') == 'Group 6' )  && urlParams.get('section') == 5) {
                // if(urlParams.get('agreement_id') == 'RM1043.8' && urlParams.get('id') == 'Criterion 2' && urlParams.get('group_id') == 'Group 9'  && urlParams.get('section') == 5) {
                    let textboxCount =  $('.order_1').filter(function() {return this.value !== '';}).length;
                    var percentageCheck = ccsZvalidateWeihtageValue('fc_question_precenate_' + textboxCount, "The total weighting is more than 100% ",Number($('#totalPercentage').text()), /\w+/);
                    errorStore.push(percentageCheck)
             
                }
                else{
                     errorStore.push(["There is a problem", "The total weighting is more than 100% "]);
                }

            }
            if(urlParams.get('agreement_id') == 'RM1043.8' && urlParams.get('id') == 'Criterion 2' && weightTotal == 1 && (LOTID_VAR == 1 && (urlParams.get('group_id') == 'Group 6' || urlParams.get('group_id') == 'Group 9')) || (LOTID_VAR == 3 && (urlParams.get('group_id') == 'Group 6' || urlParams.get('group_id') == 'Group 8')) ) {
            if((urlParams.get('group_id') == 'Group 9' || urlParams.get('group_id') == 'Group 6' || urlParams.get('group_id') == 'Group 8' ) && urlParamsDefault.get('section') == 5 && Number($('#totalPercentage').text()) == 100){
                let textareaVal = $('#fc_question_'+1+ '_1').val();
                let percentageval = $('#fc_question_precenate_'+1).val();
               
                if(percentageval.trim() != '' || percentageval != null || percentageval != undefined){
                    if(percentageval.length != 0 && (textareaVal == '' || textareaVal == null || textareaVal == undefined)){
                       let msgContent = 'You must enter valid question';
                        if(urlParams.get('group_id') == 'Group 6'){
                        msgContent = 'Enter a nice-to-have skill and experience';
                        }
                        else if(urlParams.get('group_id') == 'Group 9' || urlParams.get('group_id') == 'Group 8'){
                            msgContent = 'Enter a social value question';
                            }

                        var fieldCheck =  ccsZvalidateWithRegex('fc_question_'+1+ '_1', msgContent, /\w+/);
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

         } else ccsZPresentErrorSummary(errorStoreforOptional);
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

 $('.rfp_duration').on('keypress', function (evt) {
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

$('.weightage').on('input', function() {
    $(this).val($(this).val().replace(/[^a-z0-9]/gi, ''));
  });


  
