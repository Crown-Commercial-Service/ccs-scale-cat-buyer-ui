
if ($('#rfi_keyterm').length > 0) {
  $('.rfi_form').attr('id', 'ccs_rfi_acronyms_form');
  $('.rfi_form').attr('name', 'ccs_rfi_acronyms_form');
}

const buttonTermsHidden = () => {
  //Reload patch update
  var allGo = document.querySelectorAll(".term_acronym_fieldset");
  var countButtonHide = 0;
  for (var i=0, max=allGo.length; i < max; i++) {
      let classStage = allGo[i].getAttribute('class');
      let classArr = classStage.split(" ");
      let findClass = classArr.filter(el => el === 'ccs-dynaform-hidden');
      if(findClass.length > 0) {
        countButtonHide =+ countButtonHide + 1
      }
  }
  if(countButtonHide == 0) {
    if(document.getElementById("ccs_rfiTerm_add") !== null) {
      document.getElementById("ccs_rfiTerm_add").classList.add('ccs-dynaform-hidden');
    }
  }
}

let rfi_term_def = document.querySelectorAll('.rfitermdef');
rfi_term_def.forEach(ele => {
  ele.addEventListener('keyup', (event) => {
    checkFields();
  });
}); 
let rfitermtext = document.querySelectorAll('.rfitermtext');
rfitermtext.forEach(ele => {
  ele.addEventListener('keyup', (event) => {
    checkFields();
  });
});
const urlParams = new URLSearchParams(window.location.search);
const agrement_id = urlParams.get('agreement_id');
document.addEventListener('DOMContentLoaded', () => {
  

  if (document.getElementById("ccs_rfi_acronyms_form") !== null) {
    let with_value_count;
    let total_count;
    let total_count_index;
    let prev_input;
    let deleteButtons;
    if(agrement_id == 'RM1557.13' || agrement_id == 'RM6187'){
      with_value_count = 20;
      total_count = 20;
      total_count_index = 21;
      prev_input = 0;
      deleteButtons = document.querySelectorAll("a.del");
    }else{
      with_value_count = 10;
      total_count = 10;
      total_count_index = 11;
      prev_input = 0;
      deleteButtons = document.querySelectorAll("a.del");
    }
    
    let clearFieldsButtons = document.querySelectorAll("a.clear-fields");
    // document.getElementById("rfi_term_1").addEventListener('input', ccsZCountRfiTerms);
    document.getElementById("rfi_term_definition_1").addEventListener('input', ccsZCountRfiAcronyms);
    for (var acronym_fieldset = total_count; acronym_fieldset >= 1; acronym_fieldset--) {


      let this_fieldset = document.querySelector(".acronym_" + acronym_fieldset),
        term_box = document.getElementById("rfi_term_" + acronym_fieldset);
        term_box.addEventListener('input', ccsZCountRfiTerms);

        acronym_box = document.getElementById("rfi_term_definition_" + acronym_fieldset);
        acronym_box.addEventListener('input', ccsZCountRfiAcronyms);

        if (acronym_fieldset === 1) {
          this_fieldset.classList.remove('ccs-dynaform-hidden');
        }
        else{
      if (term_box.value !== "") {
        this_fieldset.classList.remove('ccs-dynaform-hidden');

        if (acronym_fieldset === total_count) {
          document.getElementById("ccs_rfiTerm_add").classList.add('ccs-dynaform-hidden');
        }

      } else {

        this_fieldset.classList.add('ccs-dynaform-hidden');
        with_value_count = acronym_fieldset;
      }
    }
    }
    document.getElementById("ccs_rfiTerm_add").classList.remove("ccs-dynaform-hidden");
    var divHide = $('fieldset.ccs-dynaform-hidden').length;
    if(divHide == 0 && with_value_count == 20 && urlParams.get('agreement_id') == 'RM1557.13' && urlParams.get('id') == 'Criterion 1' && (urlParams.get('group_id') == 'Group 2')){
        with_value_count++;
    }

    document.getElementById("ccs_rfiTerm_add").addEventListener('click', (e) => {


      $('.govuk-form-group textarea').removeClass('govuk-textarea--error');
      checkFields();


      e.preventDefault();
      errorStore = emptyFieldCheck('add_more');
      if (errorStore.length == 0) {

        removeErrorFields();


        document.querySelector(".acronym_" + with_value_count).classList.remove("ccs-dynaform-hidden");

        if (with_value_count > 2) {
          prev_input = with_value_count - 1;
          //document.querySelector(".acronym_" + prev_input + " a.del").classList.add("ccs-dynaform-hidden");
        }

        with_value_count++;

        if (with_value_count === total_count_index) {
          document.getElementById("ccs_rfiTerm_add").classList.add('ccs-dynaform-hidden');
        }



      }
      else ccsZPresentErrorSummary(errorStore);
    });

    // delete buttons
    deleteButtons.forEach((db) => {
      db.classList.remove('ccs-dynaform-hidden')
      db.addEventListener('click', (e) => {

        e.preventDefault();
       // debugger;
        let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
          prev_coll = Number(target) - 1,
          target_fieldset = db.closest("fieldset");

          for (var k=1;k<=total_count;k++)
          {
            // document.getElementById("rfi_label_term_"+k).innerText="";
            // document.getElementById("rfi_label_acronym_"+k).innerText="";
          }
          for (var i=target;i<total_count_index;i++){
            var j=Number(i)+1;
           //let nextelmnt= document.getElementById('rfi_term_' + j);
           let nextelmnt=document.getElementsByClassName('term_acronym_fieldset acronym_'+j);
          //  let prevelmnt= document.getElementById('rfi_question_' + i);
          if(nextelmnt.length>0){
           if((!nextelmnt[0].classList.contains('ccs-dynaform-hidden')))
           {
            document.getElementById('rfi_term_' + i).value=document.getElementById('rfi_term_' + j).value;
            document.getElementById('rfi_term_definition_' + i).value=document.getElementById('rfi_term_definition_' + j).value;
            // document.getElementById("rfi_label_term_"+i).innerText="";
            // document.getElementById("rfi_label_acronym_"+i).innerText="";
          }
           else
           {
             target=i;
            //  document.getElementById("rfi_label_acronym_"+i).innerText="";
             break;
           }
          }
          else
        {
          target=i;
          //  document.getElementById("rfi_label_acronym_"+i).innerText="";
           break;
        }
          }
  

        //target_fieldset.classList.add("ccs-dynaform-hidden");
        document.getElementsByClassName('term_acronym_fieldset acronym_'+target)[0].classList.add("ccs-dynaform-hidden");

        document.getElementById('rfi_term_' + target).value = "";
        document.getElementById('rfi_term_definition_' + target).value = "";


        if (prev_coll > 1) {
          //document.querySelector('.acronym_' + prev_coll + ' a.del').classList.remove("ccs-dynaform-hidden");
        }

        document.getElementById("ccs_rfiTerm_add").classList.remove('ccs-dynaform-hidden');
        with_value_count--;
      });
    });
    clearFieldsButtons.forEach((db) => {
      db.addEventListener('click', (e) => {

        e.preventDefault();

        let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
          target_fieldset = db.closest("fieldset");

        target_fieldset.classList.add("ccs-dynaform");

        document.getElementById('rfi_term_' + target).value = "";
        document.getElementById('rfi_term_definition_' + target).value = "";
        removeErrorFields();
      });
    });


    if (document.getElementsByClassName("term_acronym_fieldset").length > 0) {
      let fieldSets = document.getElementsByClassName("term_acronym_fieldset");
      let length = fieldSets.length;
      while (length--) {
        let id = length + 1;
        let eleTerm = fieldSets[length].querySelector("#rfi_term_" + id);
        eleTerm.addEventListener('focusout', (event) => {
          let ele1 = event.target;
          let definitionElementId = "rfi_term_definition_" + id;
          let ele2 = document.getElementById(definitionElementId);
          performSubmitAction(ele1, ele2);

        });
        let eleTermDefinition = fieldSets[length].querySelector("#rfi_term_definition_" + id);
        eleTermDefinition.addEventListener('focusout', (event) => {
          let ele2 = event.target;
          let ele1Id = "rfi_term_" + id;
          let ele1 = document.getElementById(ele1Id);
          performSubmitAction(ele1, ele2);
        });
        var performSubmitAction = function (ele1, ele2) {
          if (ele1.value !== '' && ele2.value !== '') {
            let formElement = document.getElementById("ccs_rfi_acronyms_form");
            let action = formElement.getAttribute("action");
            action = action + "&stop_page_navigate=true";
            $.ajax({
              type: "POST",
              url: action,
              data: $("#ccs_rfi_acronyms_form").serialize(),
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
  buttonTermsHidden();
});
let with_value_count;
let total_count;
let total_count_index;
let prev_input;
let deleteButtons;
if(agrement_id == 'RM1557.13' || agrement_id == 'RM6187'){
  with_value_count = 20;
  total_count = 20;
  total_count_index = 21;
  prev_input = 0;
  deleteButtons = document.querySelectorAll("a.del");
}else{
  with_value_count = 10;
  total_count = 10;
  total_count_index = 11;
  prev_input = 0;
  deleteButtons = document.querySelectorAll("a.del");
}
const checkFields = () => {
  const start = 1;
  const end = total_count;

  for (var a = start; a <= end; a++) {
    let input = $(`#rfi_term_${a}`)
    let textbox = $(`#rfi_term_definition_${a}`);


    if (input.val() !== "") {

      $(`#rfi_term_${a}-error`).remove();
      $(`.acronym_${a} div`).removeClass('govuk-form-group--error');
      $(`.acronym_${a} input`).removeClass('govuk-input--error')


    }
    if (textbox.val() !== "") {

      $(`#rfi_term_definition_${a}-error`).remove();
      $(`.acronym_${a} div`).removeClass('govuk-form-group--error');
      $(`.acronym_${a} textarea`).removeClass('govuk-input--error');
      $(`.acronym_${a} textarea`).removeClass('govuk-textarea--error')
    }

  }
}
const removeErrorFields = () => {
  $('.govuk-error-message').remove();
  $('.govuk-form-group--error').removeClass('govuk-form-group--error')
  $('.govuk-error-summary').remove();
  $(".govuk-input").removeClass("govuk-input--error");
  $('.govuk-form-group textarea').removeClass('govuk-textarea--error');

}
$('.rfi_term_definition').keyup(function(e) {
  var tlength = $(this).val().length;
  $(this).val($(this).val().substring(0, maxchars));
  var tlength = $(this).val().length;
  remain = maxchars - parseInt(tlength);
  $(this).text(remain);

});
$(".rfi_term_definition").keypress(function(e) {
  var maxLen = $(this).val().length;
  var keyCode = e.which;

  if (maxLen >= 10000 && (keyCode != 8) && (keyCode < 48 || keyCode > 57)) {
      return false;
  }

});

    
const emptyFieldCheck = (add_more='') => {
  let fieldCheck = "",
    errorStore = [];
  for (var x = 1; x < total_count_index; x++) {
    let term_field = document.getElementById('rfi_term_' + x);
    let definition_field = document.getElementById("rfi_term_definition_" + x);

    if (term_field.closest("fieldset").classList.value.indexOf("ccs-dynaform-hidden") === -1) {
      checkFields();
      if (term_field.value.trim() == '' && definition_field.value.trim() == '' && add_more=='add_more') {
        ccsZaddErrorMessage(term_field, 'You must add the term or acronym');
        ccsZaddErrorMessage(definition_field, 'You must include the descripton of the term or acronym');
        fieldCheck = [term_field.id, 'You must add the term or acronym'];
        errorStore.push(fieldCheck);
        fieldCheck = [definition_field.id, 'You must include the descripton of the term or acronym'];
        errorStore.push(fieldCheck);
      }

      if (term_field.value.trim() != '' && definition_field.value.trim() == '') {
        ccsZaddErrorMessage(definition_field, 'You must include the descripton of the term or acronym');
        fieldCheck = [definition_field.id, 'You must include the descripton of the term or acronym'];
        errorStore.push(fieldCheck);
      }
      

      if (term_field.value.trim() == '' && definition_field.value.trim() != '') {
        ccsZaddErrorMessage(term_field, 'You must add the term or acronym');
        fieldCheck = [term_field.id, 'You must add the term or acronym'];
        errorStore.push(fieldCheck);
      }
    }
  }
  return errorStore;
}

const ccsZCountRfiTerms = (event) => {
  //debugger;
  event.preventDefault();
  const inputId=event.srcElement.id;
  const element = document.getElementById(inputId);
  const arr=inputId.split("rfi_term_");
  // if(element.value.length<500)
  // {
    for(var i=1;i<=total_count;i++)
    {
      // document.getElementById("rfi_label_term_"+i).innerText="";
      // document.getElementById("rfi_label_acronym_"+i).innerText="";
    }
    let labelElement=document.getElementById("rfi_label_term_"+arr[1]);
    let count=500-element.value.length;
    // labelElement.innerText=count + " remaining2 of 500";
    labelElement.innerText="You have "+count+" characters remaining";
    //labelElement.classList.remove('ccs-dynaform-hidden')
  // }
  // else
  // {

  // }
};

const ccsZCountRfiAcronyms = (event) => {
  //debugger;
  event.preventDefault();
  const inputId=event.srcElement.id;
  const element = document.getElementById(inputId);
  const arr=inputId.split("rfi_term_definition_");
  // if(element.value.length<500)
  // {
    for(var i=1;i<=total_count;i++)
    {
      // document.getElementById("rfi_label_acronym_"+i).innerText="";
      // document.getElementById("rfi_label_term_"+i).innerText="";
    }
    let labelElement=document.getElementById("rfi_label_acronym_"+arr[1]);
    let maxlength = element.getAttribute("maxlength");
    let count=maxlength-element.value.length;
    // labelElement.innerText=count + " remaining1 of "+maxlength;
    labelElement.innerText="You have "+count+" characters remaining";
    //labelElement.classList.remove('ccs-dynaform-hidden')
  // }
  // else
  // {

  // }
};


const ccsZvalidateRfiAcronyms = (event) => {
  event.preventDefault();

  errorStore = emptyFieldCheck();

  if (errorStore.length === 0) {

    document.forms["ccs_rfi_acronyms_form"].submit();
  }
  else {
    ccsZPresentErrorSummary(errorStore);

  }

};
