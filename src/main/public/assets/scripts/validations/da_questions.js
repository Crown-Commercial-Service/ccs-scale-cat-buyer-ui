document.addEventListener('DOMContentLoaded', () => {
    // $('.additional').addClass('ccs-dynaform-hidden');
    const removeErrorFieldsDAScoreQuestion = () => {
        $('.govuk-error-message').remove();
        $('.govuk-form-group--error').removeClass('govuk-form-group--error');
        $('.govuk-error-summary').remove();
        $('.govuk-input').removeClass('govuk-input--error');
        $('.govuk-form-group textarea').removeClass('govuk-textarea--error');
    };

    const FormSelector = $('#da_multianswer_question_form');
    if (FormSelector !== undefined && FormSelector.length > 0) {
        $('.additional').addClass('ccs-dynaform-hidden');
        let with_value_count = 10,
            prev_input = 0,
            deleteButtons = document.querySelectorAll('a.del');
        let deleteButtonCount = [];
        let elements = document.querySelectorAll('.weightage');
        let totalPercentage = () => {
            let errorStore = [];
            let weightageSum = 0;
            removeErrorFieldsDAScoreQuestion();
            elements.forEach(el => {
                weightageSum += isNaN(el.value) ? 0 : Number(el.value);
            });
            if (weightageSum > 100) {
                errorStore.push(["There is a problem", "The total weighting is exceeded more than 100%"]);
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
              
                    e.preventDefault();
            let target = e.target.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
              prev_coll = Number(target) - 1,
              target_fieldset = db.closest("div");
    
                   let Sibling = target_fieldset.nextElementSibling; //document.getElementById(e.target.id).nextElementSibling;
                   
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
                                   console.log(`Usual: ${ml} - ${next_coll}`)
                              
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
                           
                           var fc_question_precenate_fir = document.getElementsByClassName('class_question_remove_'+current_col)[0];
                           if(fc_question_precenate_fir){
                            document.getElementsByClassName('class_question_remove_'+current_col)[0].value="";
                           }
                           var fc_question_precenate_sec = document.getElementsByClassName('class_question_remove_'+current_col)[1];
                           if(fc_question_precenate_sec){
                            document.getElementsByClassName('class_question_remove_'+current_col)[1].value="";
                           }
                           var fc_question_precenate_third = document.getElementsByClassName('class_question_remove_'+current_col)[2];
                           if(fc_question_precenate_third){
                            document.getElementsByClassName('class_question_remove_'+current_col)[2].value="";
                           }
                           //ID BASED
                           var fc_question_precenate_El = document.getElementById("fc_question_precenate_"+current_col);
                           if(fc_question_precenate_El){
                             document.getElementById('fc_question_precenate_'+current_col).value="";
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
    
                    var fc_question_precenate_fir = document.getElementsByClassName('class_question_remove_'+current_col)[0];
                           if(fc_question_precenate_fir){
                            document.getElementsByClassName('class_question_remove_'+current_col)[0].value="";
                           }
                           var fc_question_precenate_sec = document.getElementsByClassName('class_question_remove_'+current_col)[1];
                           if(fc_question_precenate_sec){
                            document.getElementsByClassName('class_question_remove_'+current_col)[1].value="";
                           }
                           var fc_question_precenate_third = document.getElementsByClassName('class_question_remove_'+current_col)[2];
                           if(fc_question_precenate_third){
                            document.getElementsByClassName('class_question_remove_'+current_col)[2].value="";
                           }
                           //ID BASED
                           var fc_question_precenate_El = document.getElementById("fc_question_precenate_"+current_col);
                           if(fc_question_precenate_El){
                             document.getElementById('fc_question_precenate_'+current_col).value="";
                           }
                 
                       if (prev_coll > 1) {
                        document.querySelector('#fc_question_' + prev_coll + ' a.del').classList.remove("ccs-dynaform-hidden");
                       }
                       $('.add-another-btn').removeClass("ccs-dynaform-hidden");
                   }
                   with_value_count--;
                   if (with_value_count != 11) {
                    
                    $('.add-another-btn').removeClass("ccs-dynaform-hidden");
                   }
               });

            // db.addEventListener('click', (e) => {
            //     console.log("Delete")
            //     e.preventDefault();
            //     let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
            //         prev_input = Number(target) - 1,
            //         target_fieldset = db.closest("div");

            //     target_fieldset.classList.add("ccs-dynaform-hidden");
            //     // document.querySelector('#fc_question_'+prev_input+' a.del').classList.remove("ccs-dynaform-hidden");
            //     //let precentageValueofLast = document.getElementById('fc_question_precenate_'+target).value;

            //     if (document.getElementById('fc_question_precenate_' + target) != undefined) {
                    
            //         var precentageValueofLast = document.getElementById('fc_question_precenate_' + target).value;
                    
            //     }
                
            //   //  console.log("Target",precentageValueofLast);
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
            //         //console.log("PREVIOUSS")
            //         document.querySelector('#fc_question_' + prev_input + ' a.del').classList.remove("ccs-dynaform-hidden");
            //     } else {
            //         //console.log("Else statement")
            //     }

            //     //document.getElementsByClassName("add-another-btn").classList.remove('ccs-dynaform-hidden');
            //     with_value_count--;
            // });


        });

        for (var box_num = 10; box_num > 1; box_num--) {
            let this_box = document.getElementById('fc_question_' + box_num);
            if (this_box.querySelector('.order_1').value !== '') {
                this_box.classList.remove('ccs-dynaform-hidden');
                document.getElementById("del_fc_question_" + box_num).classList.remove("ccs-dynaform-hidden");
                if (box_num === 10) {
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

        $('.add-another-btn').on('click', function() {
         
           // $('.govuk-error-summary').remove();
           // $('.govuk-form-group--error').remove();
            removeErrorFieldsDAScoreQuestion();
            
            if (Number($('#totalPercentage').text()) >= 100) {
                errorStore.push(["There is a problem", "The total weighting is 100% so you can not add more questions"]);
            } else {
                errorStore = emptyQuestionFieldCheckDa("add_more");
            }
            
            if (with_value_count === 11 && document.getElementById("fc_question_10_1").value != "") {
                errorStore.push(["There is a problem", "Cannot add another question already 10 questions created"]);
            } else {
                errorStore = emptyQuestionFieldCheckDa("add_more");
            }

            const pageHeading = document.getElementById('page-heading').innerHTML;
            if (errorStore.length == 0) {

                document.getElementById('fc_question_' + with_value_count).classList.remove('ccs-dynaform-hidden');

                if (with_value_count > 2) {
                    prev_input = with_value_count - 1;
                 //   document.querySelector('label[for=fc_question_' + prev_input + '] a.del').classList.add('ccs-dynaform-hidden');
                }

                if (pageHeading.includes('Write your social value questions')) {
                    if (document.getElementById("questionsCount") != undefined) {
                        document.getElementById("questionsCount").innerHTML = with_value_count;
                    }
                }

                if (pageHeading.includes('Write your technical questions')) {
                    if (document.getElementById("questionsCount") != undefined) {
                        document.getElementById("questionsCount").innerHTML = with_value_count;
                    }
                }

                document.querySelector('label[for=fc_question_' + with_value_count + '] a.del')
                    .classList.remove('ccs-dynaform-hidden');

                // if (pageHeading.includes('Write your social value questions')) {
                //   if (with_value_count === 5) {
                //     errorStore.push(["There is a problem", "You can add a maximum of 5 question"]);
                //     ccsZPresentErrorSummary(errorStore);
                //     return;
                //   }
                // }

                with_value_count++;
                if (with_value_count === 11 && document.getElementById("fc_question_10_1").value != "") {
                    errorStore.push(["There is a problem", "Cannot add another question already 10 questions created"]);
                    ccsZPresentErrorSummary(errorStore);
                    return;
                }
                totalAnswerd();
            } else ccsZPresentErrorSummary(errorStore);
        });

        // deleteButtons.forEach((db) => {
        //     //db.classList.remove('ccs-dynaform-hidden')
        //     db.addEventListener('click', (e) => {
        //         e.preventDefault();
                
        //         const pageHeading = document.getElementById('page-heading').innerHTML;
        //         const AnswerdQuestion = document.getElementById('questionsCount').innerHTML;

        //         if (pageHeading.includes('Write your social value questions')) {
        //             if (document.getElementById("questionsCount") != undefined) {
        //                 document.getElementById("questionsCount").innerHTML =(with_value_count-1);
        //             }
        //         }

        //         if (pageHeading.includes('Write your technical questions')) {
        //             if (document.getElementById("questionsCount") != undefined) {
        //                 document.getElementById("questionsCount").innerHTML =(with_value_count-1);
        //             }
        //         }

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
    }

    const emptyQuestionFieldCheckDa = (add_more='') => {
        removeErrorFieldsDAScoreQuestion();
        const countWords = str => str.trim().split(/\s+/).length;
        let fieldCheck = '',
            errorStore = [],
            noOfRequirement_Group = 0;

        const pageHeading = document.getElementById('page-heading').innerHTML;
        for (var i = 1; i < 11; i++) {
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
                            if (index === 0) {
                                if (element.value == '' || element.value === undefined || element.value === null) {
                                    errorStore.push([element.id, "Please enter name of the group"])
                                }
                            } else if(index === 1) {
                                if (element.value == '' || element.value === undefined || element.value === null) {
                                    errorStore.push([element.id, "Please enter name of the requirement"])
                                }
                            }
                            else{
                                if (element.value == '' || element.value === undefined || element.value === null) {
                                    errorStore.push([element.id, "Please enter description of the requirement"])
                                }
                            }
                        }
                    }
                    noOfRequirement_Group += 1;
                } else {
                    if (rootEl.querySelector('.order_1')) {
                        let element = rootEl.querySelector('.order_1');
                        //const condOrd1 = countWords(rootEl.querySelector('.order_1') ?.value) > 50;
                        //if (rootEl.querySelector('.order_1').value == '' || condOrd1) {
                            
                        if ((rootEl.querySelector('.order_1').value == '' && !pageHeading.includes('Optional')) || add_more=='add_more') {
                            if (pageHeading.includes('Write your social value questions')){
                                const msg = rootEl.querySelector('.order_1').value ?
                                'Entry is limited to 50 words' :
                                'You must enter your social value question';
                                fieldCheck = ccsZvalidateWithRegex('fc_question_' + i + '_1', msg, /\w+/);
                                //fieldCheck = ccsZvalidateWithRegex('fc_question_' + i + '_1', msg, /\w+/, !condOrd1);
                                if (fieldCheck !== true) errorStore.push(fieldCheck);
                            }
                            else if(pageHeading.includes('Write your technical questions')){
                                    const msg = rootEl.querySelector('.order_1').value ?
                                'Entry is limited to 50 words' :
                                'You must enter your technical question';
                                
                                fieldCheck = ccsZvalidateWithRegex('fc_question_' + i + '_1', msg, /\w+/);
                                //fieldCheck = ccsZvalidateWithRegex('fc_question_' + i + '_1', msg, /\w+/, !condOrd1);
                                if (fieldCheck !== true) errorStore.push(fieldCheck);
                            }
                        }
                    }
                    if (rootEl.querySelector('.order_2')) {
                        //const condOrd2 = countWords(rootEl.querySelector('.order_2') ?.value) > 150;
                       // if (rootEl.querySelector('.order_2').value == '' || !condOrd2) {
                        if (rootEl.querySelector('.order_2').value == '') {
                        
                       const msg = rootEl.querySelector('.order_2').value ?
                                'Entry is limited to 50 words' :
                                'You must enter valid additional information';
                            //fieldCheck = ccsZvalidateWithRegex('fc_question_' + i + '_2', msg, /\w+/, !condOrd2);
                            fieldCheck = ccsZvalidateWithRegex('fc_question_' + i + '_2', msg, /\w+/);
                            if (fieldCheck !== true) errorStore.push(fieldCheck);
                        }
                    }
                    if (rootEl.querySelector('.order_3')) {
                        //const condOrd3 = countWords(rootEl.querySelector('.order_3') ?.value) > 500;
                        //if (rootEl.querySelector('.order_3').value == '' || condOrd3) {
                        if (rootEl.querySelector('.order_3').value == '') {
                            const msg = rootEl.querySelector('.order_3').value ?
                                'Entry is limited to 50 words' :
                                'You must enter valid information';
                            //fieldCheck = ccsZvalidateWithRegex('fc_question_' + i + '_3', msg, /\w+/, !condOrd3);
                                fieldCheck = ccsZvalidateWithRegex('fc_question_' + i + '_3', msg, /\w+/);
                            if (fieldCheck !== true) errorStore.push(fieldCheck);
                        }
                    }
                    if (rootEl.querySelector('.weightage')) {
                        const condWeight = rootEl.querySelector('.weightage').value > 100;
                        if (rootEl.querySelector('.weightage').value === '' || condWeight || rootEl.querySelector('.weightage').value < 0) {
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

    $('#da_multianswer_question_form').on('submit', (event) => {
        event.preventDefault();
        let errorStore = [];
        if ($('#totalPercentage') != null && $('#totalPercentage') != undefined && $('#totalPercentage').length > 0 && Number($('#totalPercentage').text()) > 100) {
            errorStore.push(["There is a problem", "The total weighting is more than 100% "]);
        }
        errorStore = errorStore.length <= 0 ? emptyQuestionFieldCheckDa() : errorStore;
        if (errorStore.length === 0) {

            const classList = document.getElementsByClassName("govuk-hint-error-message");
            const classLength = classList.length;

            if (classLength != 0) {

                return false;
            } else {
                document.forms['da_multianswer_question_form'].submit();
            }



        } else {
            ccsZPresentErrorSummary(errorStore);
        }
    });
});