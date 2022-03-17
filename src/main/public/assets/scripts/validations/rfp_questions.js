
document.addEventListener('DOMContentLoaded', () => {
  $(".additional").addClass("ccs-dynaform-hidden")
  
  const FormSelector = $('#rfp_multianswer_question_form');
  if(FormSelector !== undefined && FormSelector.length > 0)
  {
    let with_value_count = 10,
        prev_input = 0,
        deleteButtons = document.querySelectorAll("a.del");
  
    let elements = document.querySelectorAll(".weightage");
    let totalPercentage = ()=>{
        let weightageSum = 0
        elements.forEach((el) =>{
         weightageSum += isNaN(el.value)?0:Number(el.value);
        });
        $("#totalPercentage").html(weightageSum);
    };
    elements.forEach((ele)=>{
      ele.addEventListener('focusout',totalPercentage)
    });
  
    const totalAnswerd = ()=>{
     $("#questionsCount").html($(".order_1").filter(function(){return this.value !== ''}).length)
    };

    totalAnswerd();
    totalPercentage();
  
    for (var box_num = 10; box_num > 1; box_num--) {
      let this_box = document.getElementById("fc_question_" + box_num)
      if (this_box.querySelector('.order_1').value !== "") {
        this_box.classList.remove('ccs-dynaform-hidden')
        if (box_num === 10) 
        {
          $(".add-another-btn").addClass('ccs-dynaform-hidden'); 
        }   
      } else {          
          with_value_count = box_num;
      }
    }
    if(with_value_count > 1)
    {
      $("#del_fc_question_"+with_value_count).removeClass("ccs-dynaform-hidden");
    }
    $(".add-another-btn").on('click', function(){      
        $(".govuk-error-summary").remove();
        errorStore = emptyQuestionFieldCheckRfp();
        if (errorStore.length == 0) {
          document.getElementById("fc_question_" + with_value_count).classList.remove("ccs-dynaform-hidden");      
          if (with_value_count > 2) {
            prev_input = with_value_count - 1;
            document.querySelector('label[for=fc_question_' + prev_input + '] a.del').classList.add("ccs-dynaform-hidden");
          }
          document.querySelector('label[for=fc_question_' + with_value_count + '] a.del').classList.remove("ccs-dynaform-hidden");
          with_value_count++;
        
          if (with_value_count === 11) {
            $(".add-another-btn").addClass('ccs-dynaform-hidden');
          }
          totalAnswerd();
        }
        else ccsZPresentErrorSummary(errorStore);                
    });
    $("a.del").on("click", function(event){
      event.preventDefault();
      $(this).parent().parent().find("input[type=text], textarea").val("");
      $(this).parent().parent().addClass("ccs-dynaform-hidden");
      $(this).addClass("ccs-dynaform-hidden");
      $('label[for=fc_question_' + prev_input + '] a.del').removeClass("ccs-dynaform-hidden");
    })



  }
});

    const emptyQuestionFieldCheckRfp = () => {
      let fieldCheck = "",
        errorStore = [];
      for (var i = 1; i < 11; i++) {
        let rootEl = document.getElementById("fc_question_" + i);
        if (!rootEl.classList.contains('ccs-dynaform-hidden') ){
          if(Number($("#totalPercentage").val) > 100)
          {
            fieldCheck = ccsZvalidateWithRegex("fc_question_"+i+"_4", "You cannot add / submit  question as your weightings exceed 100%", /\w+/);
            if (fieldCheck !== true) errorStore.push(fieldCheck);
          }
          if(rootEl.querySelector(".order_1").value == "" )
          { 
            fieldCheck = ccsZvalidateWithRegex("fc_question_"+i+"_1", "You must enter valid question", /\w+/);
            if (fieldCheck !== true) errorStore.push(fieldCheck);
          }
          if(rootEl.querySelector(".order_2").value == "" )
          { 
            fieldCheck = ccsZvalidateWithRegex("fc_question_"+i+"_2", "You must enter valid additional information", /\w+/);
            if (fieldCheck !== true) errorStore.push(fieldCheck);
          }
          if(rootEl.querySelector(".order_3").value == "" )
          { 
            fieldCheck = ccsZvalidateWithRegex("fc_question_"+i+"_3", "You must enter valid information", /\w+/);
            if (fieldCheck !== true) errorStore.push(fieldCheck);
          }
          if(rootEl.querySelector(".weightage").value == "" )
          { 
            fieldCheck = ccsZvalidateWithRegex("fc_question_"+i+"_4", "You must enter valid weightage", /\w+/);
            if (fieldCheck !== true) errorStore.push(fieldCheck);
          }
        }
      }
      return errorStore;
    };

    const ccsZvalidateRfpQuestions = (event) =>{
      event.preventDefault();
      const errorStore = emptyQuestionFieldCheckRfp();
      if (errorStore.length === 0) {
        document.forms["rfp_multianswer_question_form"].submit();
      }
      else {
        ccsZPresentErrorSummary(errorStore);
      }
    };
