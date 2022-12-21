document.addEventListener('DOMContentLoaded', () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  if (document.getElementById("ccs_rfi_questions_form") !== null) {
    let question_length = $('.add').length;
    if(question_length == 20){
      
     // document.getElementById("ccs_criteria_add").classList.add('ccs-dynaform-hidden');
    }
    let with_value_count = 20,
      prev_input = 0,
      deleteButtons = document.querySelectorAll("a.del");
      document.getElementById("ccs_criteria_add").classList.remove("ccs-dynaform-hidden");
      //document.getElementById("rfi_question_1").addEventListener('input', ccsZCountRfiQuestions);
    for (var text_box_num = 20; text_box_num >= 1; text_box_num--) {

      let this_box = document.getElementById("rfi_question_" + text_box_num);
      this_box.addEventListener('input', ccsZCountRfiQuestions);

      if (text_box_num === 1) {
        document.getElementById("rfi_question_" + text_box_num).classList.remove('ccs-dynaform-hidden');
        let the_label = document.querySelector('label[for=rfi_question_' + text_box_num + ']');
        the_label.classList.remove('ccs-dynaform-hidden');
        
        
        

      }
      else{
      if (this_box.value !== "") {
        this_box.classList.remove('ccs-dynaform-hidden');

        if (text_box_num === 20) {
         
          document.getElementById("ccs_criteria_add").classList.add('ccs-dynaform-hidden');
        }

      } else {
        // let the_label = document.querySelector('label[for=rfi_question_' + text_box_num + ']');
        // the_label.classList.add('ccs-dynaform-hidden');
        
        document.querySelector('#fc_question_' + text_box_num).classList.add("ccs-dynaform-hidden");

        with_value_count = text_box_num;
      }
    }

    }

  //  document.getElementById("ccs_criteria_add").classList.remove("ccs-dynaform-hidden");
    document.getElementById("ccs_criteria_add").addEventListener('click', (e) => {
      e.preventDefault();
      $(".govuk-error-summary").remove();
      errorStore = emptyQuestionFieldCheck();
      if (errorStore.length == 0) {

        document.getElementById("rfi_question_" + with_value_count).classList.remove("ccs-dynaform-hidden");
        document.querySelector('#fc_question_' + with_value_count).classList.remove("ccs-dynaform-hidden");
        document.querySelector('label[for=rfi_question_' + with_value_count + ']').classList.remove("ccs-dynaform-hidden");

        if (with_value_count > 2) {
          prev_input = with_value_count - 1;
          //document.querySelector('label[for=rfi_question_' + prev_input + '] a.del').classList.add("ccs-dynaform-hidden");
        }

        with_value_count++;
      
        if (with_value_count === 21) {
          
          document.getElementById("ccs_criteria_add").classList.add('ccs-dynaform-hidden');
        }
      }
      else ccsZPresentErrorSummary(errorStore);
    });

    // delete buttons
    deleteButtons.forEach((db) => {
      //debugger;
      // for(var i=1;i<=10;i++)
      // {
      //   document.getElementById("rfi_label_question_"+i).innerText="";
      // }
      db.classList.remove('ccs-dynaform-hidden')
      db.addEventListener('click', (e) => {

        e.preventDefault();
        let target = e.target.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
          prev_coll = Number(target) - 1,
          target_fieldset = db.closest("div");
         
         
           
          
               let Sibling = target_fieldset.nextElementSibling; //document.getElementById(e.target.id).nextElementSibling;
              

               if(target != 21) {
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
                               
                               let last;
                               
                               //ID BASED
                               var fc_question_precenate_El = document.getElementById("rfi_question_"+nextLevel_coll);
                               if(fc_question_precenate_El){
                                 last = document.getElementById("rfi_question_"+nextLevel_coll).value;
                                 document.getElementById('rfi_question_'+current_col).value=last;
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
                          
                            let last;
                          
                            //ID BASED
                            var fc_question_precenate_El = document.getElementById("rfi_question_"+nextLevel_coll);
                            if(fc_question_precenate_El){
                              last = document.getElementById("rfi_question_"+nextLevel_coll).value;
                              document.getElementById('rfi_question_'+current_col).value=last;
                            }
                            
                           }
       
                        
                           Sibling = Sibling.nextElementSibling;
                       } else {
                           Sibling = false;
                       }
                   ml++;}
                   if(eptArr.length > 0) {
                       console.log(eptArr);
                       let removeLogic = eptArr.at(-1);
                       console.log(`removeLogic: ${removeLogic}`);
                      
                       
                       //ID BASED
                       var fc_question_precenate_El = document.getElementById("rfi_question_"+removeLogic);
                       if(fc_question_precenate_El){
                         document.getElementById('rfi_question_'+removeLogic).value="";
                       }

                    //    document.getElementsByClassName('class_question_remove_'+removeLogic)[0].value="";
                    //    document.getElementsByClassName('class_question_remove_'+removeLogic)[1].value="";
                    //    document.getElementsByClassName('class_question_remove_'+removeLogic)[2].value="";
                    
                    document.querySelector('#fc_question_' + removeLogic).classList.add("ccs-dynaform-hidden");
                } else {
                   
                       target_fieldset.classList.add("ccs-dynaform-hidden");
                       
                       
                       //ID BASED
                       var fc_question_precenate_El = document.getElementById("rfi_question_"+nextLevel_coll);
                       if(fc_question_precenate_El){
                         document.getElementById('rfi_question_'+nextLevel_coll).value="";
                       }

                    //    document.getElementsByClassName('class_question_remove_'+current_col)[0].value="";
                    //    document.getElementsByClassName('class_question_remove_'+current_col)[1].value="";
                    //    document.getElementsByClassName('class_question_remove_'+current_col)[2].value="";
                    
                       if (prev_coll > 1) {
                        document.querySelector('#fc_question_' + prev_coll + ' a.del').classList.remove("ccs-dynaform-hidden");
                       }
                      
                       document.getElementById("ccs_criteria_add").classList.remove('ccs-dynaform-hidden');
                   }
               } else {
               
                   target_fieldset.classList.add("ccs-dynaform-hidden");
                //    document.getElementsByClassName('class_question_remove_'+current_col)[0].value="";
                //    document.getElementsByClassName('class_question_remove_'+current_col)[1].value="";
                //    document.getElementsByClassName('class_question_remove_'+current_col)[2].value="";


                       //ID BASED
                       var fc_question_precenate_El = document.getElementById("rfi_question_"+nextLevel_coll);
                       if(fc_question_precenate_El){
                         document.getElementById('rfi_question_'+nextLevel_coll).value="";
                       }
             
                   if (prev_coll > 1) {
                    document.querySelector('#fc_question_' + prev_coll + ' a.del').classList.remove("ccs-dynaform-hidden");
                   }
                   
                   document.getElementById("ccs_criteria_add").classList.remove('ccs-dynaform-hidden');
               }
               with_value_count--;
               if (with_value_count != 11) {
             
                document.getElementById("ccs_criteria_add").classList.remove('ccs-dynaform-hidden');
               }
           });









        //debugger;



        // let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
        //   prev_box = Number(target) - 1;
        //   for (var k=1;k<=10;k++)
        //   {
        //     document.getElementById("rfi_label_question_"+k).innerText="";
            
        //   }
        // for (var i=target;i<11;i++){
        //   var j=Number(i)+1;
        //  let nextelmnt= document.getElementById('rfi_question_' + j);
        // //  let prevelmnt= document.getElementById('rfi_question_' + i);
        // if(nextelmnt!=null){
        //  if((!nextelmnt.classList.contains('ccs-dynaform-hidden')))
        //  {
        //   document.getElementById('rfi_question_' + i).value=nextelmnt.value;
        //   document.getElementById("rfi_label_question_"+i).innerText="";
        //  }
        //  else
        //  {
        //    target=i;
        //    document.getElementById("rfi_label_question_"+i).innerText="";
        //    break;
        //  }
        // }
        // else
        // {
        //   target=i;
        //    document.getElementById("rfi_label_question_"+i).innerText="";
        //    break;
        // }
        // }

        // document.getElementById('rfi_question_' + target).value = "";
        // document.getElementById('rfi_question_' + target).classList.add("ccs-dynaform-hidden");
        // let parentNode = document.querySelector('label[for=rfi_question_' + target + ']').parentNode;
        // if (parentNode.children["rfi_question_" + target + '-error'] !== undefined) {
        //   parentNode.removeChild(document.getElementById("rfi_question_" + target + '-error'))
        //   parentNode.classList.remove("govuk-form-group--error");
        //   parentNode.children["rfi_question_" + target].classList.remove("govuk-input--error");
        // }
        // //document.getElementById('rfi_question_' + target + '-error').parentNode.removeChild(document.getElementById('rfi_question_' + target + '-error'));
        // document.querySelector('label[for=rfi_question_' + target + ']').classList.add("ccs-dynaform-hidden");

        // if (prev_box > 1) {
        //   //document.querySelector('label[for=rfi_question_' + prev_box + '] a.del').classList.remove("ccs-dynaform-hidden");
        // }
        // document.getElementById("ccs_criteria_add").classList.remove('ccs-dynaform-hidden');
        // with_value_count--;
        // console.log("with_value_count>>>",with_value_count)
   //   });
    });


    let length = 21;
    while (--length) {
      console.log(length);
      let element = document.querySelector("#rfi_question_" + length);
      element.addEventListener('focusout', (event) => {
        let eleValue = event.target.value;
        if (eleValue !== '') {
          let formElement = document.getElementById("ccs_rfi_questions_form");
          let action = formElement.getAttribute("action");
          action = action + "&stop_page_navigate=true";
          $.ajax({
            type: "POST",
            url: action,
            data: $("#ccs_rfi_questions_form").serialize(),
            success: function () {

              //success message mybe...
            }
          });
        }
      });
      // break;
    }
  }
});

const emptyQuestionFieldCheck = () => {
  let fieldCheck = true,
    errorStore = [];

  //const event_typ = document.getElementById("event_type_label").value;

  //if (event_typ !== "Request for Information") {
  //fieldCheck = ccsZvalidateWithRegex("rfi_question_1", "You must add at least one question", /\w+/);
  if (fieldCheck !== true) errorStore.push(fieldCheck);
  for (var i = 1; i < 21; i++) {
   // if (!document.getElementById("rfi_question_" + i).classList.contains('ccs-dynaform-hidden')) {
    if (!document.getElementById("fc_question_" + i).classList.contains('ccs-dynaform-hidden')) {
      if(i==1){
        if(urlParams.get('agreement_id') == 'RM6187'){
          errText = "You must ask at least one question";
        }else{
          errText = "You must add at least one question";
        }
        fieldCheck = ccsZvalidateWithRegex("rfi_question_1", errText, /\w+/);
      }
      else{
      fieldCheck = ccsZvalidateWithRegex("rfi_question_" + i, "You must type a question before you can add another question", /\w+/);
      }
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }
  return errorStore;
};


const emptyQuestionFieldCheckForSave = () => {
  let fieldCheck = "",
    errorStore = [];
    if(urlParams.get('agreement_id') == 'RM6187'){
      errText = "You must ask at least one question";
    }else{
      errText = "You must add at least one question";
    }
  fieldCheck = ccsZvalidateWithRegex("rfi_question_1", errText, /\w+/);
  if (fieldCheck !== true) errorStore.push(fieldCheck);
    return errorStore;
};

const ccsZvalidateRfIQuestions = (event) => {
  event.preventDefault();
  errorStore = emptyQuestionFieldCheck();

  //}

  if (errorStore.length === 0) document.forms["ccs_rfi_questions_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};

const ccsZCountRfiQuestions = (event) => {
  //debugger;
  event.preventDefault();
  const inputId=event.srcElement.id;
  const element = document.getElementById(inputId);
  const arr=inputId.split("rfi_question_");
  // if(element.value.length<500)
  // {
    for(var i=1;i<=20;i++)
    {
      document.getElementById("rfi_label_question_"+i).innerText="";
    }
    let labelElement=document.getElementById("rfi_label_question_"+arr[1]);
    let maxlength = element.getAttribute("maxlength");
    let count=maxlength-element.value.length;
    // labelElement.innerText=count + " remaining of "+maxlength;
    labelElement.innerText="You have "+count+" characters remaining";
    //labelElement.classList.remove('ccs-dynaform-hidden')
  // }
  // else
  // {

  // }
};


$('.add').addClass('ccs-dynaform-hidden');