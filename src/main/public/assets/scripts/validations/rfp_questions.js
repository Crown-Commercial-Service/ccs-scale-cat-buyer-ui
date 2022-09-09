document.addEventListener('DOMContentLoaded', () => {
  $('.additional').addClass('ccs-dynaform-hidden');
  const pageHeading = document.getElementById('page-heading').innerHTML;
  if (pageHeading.includes("Enter your project requirements")) {
    [].forEach.call(document.querySelectorAll('.character-count'), function (el) {
      el.style.display = 'none'
      // document.getElementsByClassName('character-count').style.display='none';
    });
  }

  //#region Character count validation
  if (!pageHeading.includes("Enter your project requirements")) {
    [].forEach.call(document.querySelectorAll('.order_1'), function (el) {
      el.maxLength = '500'
      let count = 500 - el.value.length;
      $("#rfp_label_question_lable_" + el.id.substring(12, 15)).text(`You have ${count} characters remaining`);
    });
    [].forEach.call(document.querySelectorAll('.order_2'), function (el) {
      el.maxLength = '5000'
      let count = 5000 - el.value.length;
      $("#rfp_label_question_lable_" + el.id.substring(12, 15)).text(`You have ${count} characters remaining`);
    });
    [].forEach.call(document.querySelectorAll('.order_3'), function (el) {
      el.maxLength = '5000'
      let count = 5000 - el.value.length;
      $("#rfp_label_question_lable_" + el.id.substring(12, 15)).text(`You have ${count} characters remaining`);
    });
  }
  //#endregion
  const ccsZCountRfpQuestions = (event) => {
    event.preventDefault();
    const inputId = event.srcElement.id;
    const element = document.getElementById(inputId);
    const arr = inputId.split("rfp_question_");
    for (var i = 1; i <= 10; i++) {
      document.getElementById("rfp_label_question_" + i).innerText = "";
    }
    let labelElement = document.getElementById("rfp_label_question_" + arr[1]);
    let count = 500 - element.value.length;
    labelElement.innerText = count + " remaining of 500";

  };
  const removeErrorFieldsRfpScoreQuestion = () => {
    $('.govuk-error-message').remove();
    $('.govuk-form-group--error').removeClass('govuk-form-group--error');
    $('.govuk-error-summary').remove();
    $('.govuk-input').removeClass('govuk-input--error');
    $('.govuk-form-group textarea').removeClass('govuk-textarea--error');
  };
  const FormSelector = $('#rfp_multianswer_question_form');
  if (FormSelector !== undefined && FormSelector.length > 0) {
    let with_value_count = 10,
      prev_input = 0,
      deleteButtons = document.querySelectorAll('a.del');
    let deleteButtonCount = [];
    let elements = document.querySelectorAll('.weightage');
    let totalPercentage = () => {
      let errorStore = [];
      let weightageSum = 0;
      removeErrorFieldsRfpScoreQuestion();
      elements.forEach(el => {
        weightageSum += isNaN(el.value) ? 0 : Number(el.value);
      });
      const pageHeading = document.getElementById('page-heading').innerHTML;
      if (!(pageHeading.includes('Write your technical questions') || pageHeading.includes('Write your cultural fit questions') || pageHeading.includes('Write your social value questions'))) {
        if (weightageSum > 100) {
          errorStore.push(["There is a problem", "The weighting cannot exceed 100%"]);
          ccsZPresentErrorSummary(errorStore);
        }
      }


      $('#totalPercentage').html(weightageSum);
    };
    elements.forEach(ele => {
      ele.addEventListener('focusout', totalPercentage);
      ele.addEventListener('keydown', (event) => {
        if (event.key === '.' || event.keyCode === 69) { event.preventDefault(); }
      });
    });
    let allTextBox = document.getElementsByTagName("textarea");
    for (let index = 0; index < allTextBox.length; index++) {
      let ele = allTextBox[index];
      ele.addEventListener('keyup', (event) => {
        let maxLength = event.target.maxLength;
        let count = maxLength - event.target.value.length;
        if (count <= maxLength) {
          $("#rfp_label_question_lable_" + event.target.id.substring(12, 15)).text(`You have ${count} characters remaining`);
        } else {
          $("#rfp_label_question_lable_" + event.target.id.substring(12, 15)).text(`You have ${count} characters remaining`);
          event.preventDefault();
        }
      });
    }
    //    this_box.addEventListener('input', ccsZCountRfpQuestions);
    const totalAnswerd = () => {
      $('#questionsCount').html(
        $('.order_1').filter(function () {
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
        let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
          prev_input = Number(target) - 1,
          target_fieldset = db.closest("div");

        target_fieldset.classList.add("ccs-dynaform-hidden");
        let precentageValueofLast = document.getElementById('fc_question_precenate_' + target).value;
        document.getElementById('totalPercentage').textContent = Number(document.getElementById('totalPercentage').textContent) > 0 ? Number(document.getElementById('totalPercentage').textContent) - Number(precentageValueofLast) : 0;

        document.getElementById('fc_question_' + target + "_1").value = "";
        document.getElementById('fc_question_' + target + "_2").value = "";
        document.getElementById('fc_question_' + target + "_3").value = "";
        document.getElementById('fc_question_precenate_' + target).value = "";
        if (prev_input > 1) {
          document.querySelector('#fc_question_' + prev_input + ' a.del').classList.remove("ccs-dynaform-hidden");
        }

        //document.getElementsByClassName("add-another-btn").classList.remove('ccs-dynaform-hidden');
        with_value_count--;
      });
    });
    for (var box_num = 10; box_num > 1; box_num--) {
      let this_box = document.getElementById('fc_question_' + box_num);

      if (this_box.querySelector('.order_1').value !== '') {
        this_box.classList.remove('ccs-dynaform-hidden');
        if (box_num === 10) {
          $('.add-another-btn').addClass('ccs-dynaform-hidden');
        }
        deleteButtonCount.push(box_num);
      } else {
        with_value_count = box_num;
      }
      if (box_num === 2 && deleteButtonCount.length > 0) {
        $("#del_fc_question_" + deleteButtonCount[deleteButtonCount.sort().length - 1]).removeClass("ccs-dynaform-hidden");
      }
    }
    if (with_value_count > 1) {
      $('#del_fc_question_' + with_value_count).removeClass('ccs-dynaform-hidden');
    }
    $('.add-another-btn').on('click', function () {
      errorStore = [];
      const pageHeading = document.getElementById('page-heading').innerHTML;

      //$('.govuk-error-summary').remove();
      // $('.govuk-form-group--error').remove();
      removeErrorFieldsRfpScoreQuestion();
      // if (!pageHeading.includes("Enter your project requirements") && Number($('#totalPercentage').text()) >= 100) {
      //   errorStore.push(["There is a problem", "The total weighting is 100% so you can not add more questions"]);
      // } else if (!pageHeading.includes("Enter your project requirements") && Number($('#totalPercentage').text()) <= 0) {
      //   errorStore.push(["There is a problem", "The value cannot be less than 1%"]);
      // }
      // else {
      errorStore = emptyQuestionFieldCheckRfp();
      //}

      if (errorStore.length == 0) {
        document.getElementById('fc_question_' + with_value_count).classList.remove('ccs-dynaform-hidden');
        //Added this condation section 5 (step 43/44/45)

        if (with_value_count > 2) {
          prev_input = with_value_count - 1;
          document
            .querySelector('label[for=fc_question_' + prev_input + '] a.del')
            .classList.add('ccs-dynaform-hidden');
        }
        if (document.getElementById("questionsCount") != undefined) {
          document.getElementById("questionsCount").textContent = with_value_count + ' techinical questions entered so far';
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

        if (with_value_count === 11) {
          $('.add-another-btn').addClass('ccs-dynaform-hidden');
        }
        totalAnswerd();
      } else ccsZPresentErrorSummary(errorStore);
    });

    deleteButtons.forEach((db) => {
      //db.classList.remove('ccs-dynaform-hidden')
      db.addEventListener('click', (e) => {
        e.preventDefault();
        let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
          prev_input = Number(target) - 1,
          target_fieldset = db.closest("div");

        target_fieldset.classList.add("ccs-dynaform-hidden");
        let precentageValueofLast = document.getElementById('fc_question_precenate_' + target).value;
        document.getElementById('totalPercentage').textContent = Number(document.getElementById('totalPercentage').textContent) > 0 ? Number(document.getElementById('totalPercentage').textContent) - Number(precentageValueofLast) : 0;

        document.getElementById('fc_question_' + target + "_1").value = "";
        document.getElementById('fc_question_' + target + "_2").value = "";
        document.getElementById('fc_question_' + target + "_3").value = "";
        document.getElementById('fc_question_precenate_' + target).value = "";
        if (prev_input > 1) {
          document.querySelector('#fc_question_' + prev_input + ' a.del').classList.remove("ccs-dynaform-hidden");
        }

      })
    });
  }

  const emptyQuestionFieldCheckRfp = () => {
    removeErrorFieldsRfpScoreQuestion();
    const countWords = str => str?.trim().split(/\s+/)?.length;
    let fieldCheck = '',
      errorStore = [], noOfRequirement_Group = 0;
    const weightage = $('.weightage');
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
                  errorStore.push([element.id, "Please enter your requirement group name"])
                  ccsZaddErrorMessageClass(element, 'Please enter your requirement group name.')
                }
              } else {
                if (element.value == '' || element.value === undefined || element.value === null) {
                  errorStore.push([element.id, "Please enter your requirement"])
                  ccsZaddErrorMessageClass(element, 'Please enter your requirement.')
                }
              }
            }
          }
          noOfRequirement_Group += 1;
        }
        else {
          if (rootEl.querySelector('.order_1')) {
            let element = rootEl.querySelector('.order_1');
            const condOrd1 = countWords(rootEl.querySelector('.order_1')?.value) > 500;
            if (rootEl.querySelector('.order_1').value == '' || condOrd1) {
              const msg = rootEl.querySelector('.order_1').value
                ? 'Entry is limited to 500 words'
                : 'Enter your question';
              fieldCheck = ccsZvalidateWithRegex('fc_question_' + i + '_1', msg, /\w+/, !condOrd1);
              if (fieldCheck !== true) errorStore.push(fieldCheck);
            }
          }
          if (rootEl.querySelector('.order_2')) {
            const condOrd2 = countWords(rootEl.querySelector('.order_2')?.value) > 5000;
            if (rootEl.querySelector('.order_2').value == '' || !condOrd2) {
              const msg = rootEl.querySelector('.order_2').value
                ? 'Entry is limited to 5000 words'
                : 'Add more details about this question';
              fieldCheck = ccsZvalidateWithRegex('fc_question_' + i + '_2', msg, /\w+/, !condOrd2);
              if (fieldCheck !== true) errorStore.push(fieldCheck);
            }
          }
          if (rootEl.querySelector('.order_3')) {
            const condOrd3 = countWords(rootEl.querySelector('.order_3')?.value) > 5000;
            if (rootEl.querySelector('.order_3').value == '' || condOrd3) {
              const msg = rootEl.querySelector('.order_3').value
                ? 'Entry is limited to 5000 words'
                : 'Describe the type of answers you need from suppliers';
              fieldCheck = ccsZvalidateWithRegex('fc_question_' + i + '_3', msg, /\w+/, !condOrd3);
              if (fieldCheck !== true) errorStore.push(fieldCheck);
            }
          }
          if (rootEl.querySelector('.weightage')) {
            const condWeight = rootEl.querySelector('.weightage')?.value > 100;
            if (rootEl.querySelector('.weightage').value === '' || condWeight) {
              const msg = rootEl.querySelector('.weightage').value
                ? 'Enter a weighting for this question <= 100%'
                : 'You must enter valid weightage';
              fieldCheck = ccsZvalidateWithRegex('fc_question_precenate_' + i, msg, /\w+/, !condWeight);
              if (fieldCheck !== true) errorStore.push(fieldCheck);
            } else if (rootEl.querySelector('.weightage').value === '0') {
              fieldCheck = [weightage[i].id, 'The value cannot be less than 1%'];
              errorStore.push(fieldCheck);
              ccsZaddErrorMessage(weightage[i], 'The value cannot be less than 1%');
            }
          }
        }
      }
    }
    return errorStore;
  }

  $('#rfp_multianswer_question_form').on('submit', (event) => {
    event.preventDefault();
    let errorStore = [];
    removeErrorFieldsRfpScoreQuestion();
    const weightage = $('.weightage');
    let fieldCheck = "";
    const pageHeading = document.getElementById('page-heading').innerHTML;
    if (!pageHeading.includes("Enter your project requirements")) {
      for (let index = 0; index < weightage.length; index++) {
        if (pageHeading.includes('Write your technical questions')) {
          if (weightage[index].value != "") {
            if (Number(weightage[index].value) == 0) {
              fieldCheck = [weightage[index].id, 'The value cannot be less than 1%'];
              errorStore.push(fieldCheck);
              ccsZaddErrorMessage(weightage[index], 'The value cannot be less than 1%');
            }
            if (Number(weightage[index].value) > 100) {
              fieldCheck = [weightage[index].id, 'The weighting cannot exceed 100%'];
              errorStore.push(fieldCheck);
              ccsZaddErrorMessage(weightage[index], 'The weighting cannot exceed 100%');
            }
            if (Number(weightage[index].value) < 0) {
              fieldCheck = [weightage[index].id, 'Enter whole numbers only'];
              errorStore.push(fieldCheck);
              ccsZaddErrorMessage(weightage[index], 'Enter whole numbers only');
            }
          }
        }
        else if (pageHeading.includes('Write your cultural fit questions') || pageHeading.includes('Write your social value questions')) {
          if (weightage[index].value != "") {
            if (Number(weightage[index].value) == 0) {
              fieldCheck = [weightage[index].id, 'The value cannot be less than 1%'];
              errorStore.push(fieldCheck);
              ccsZaddErrorMessage(weightage[index], 'The value cannot be less than 1%');
            }
            if (Number(weightage[index].value) > 100) {
              fieldCheck = [weightage[index].id, 'This weighting cannot exceed 100%'];
              errorStore.push(fieldCheck);
              ccsZaddErrorMessage(weightage[index], 'The weighting cannot exceed 100%');
            }
            if (Number(weightage[index].value) < 0) {
              fieldCheck = [weightage[index].id, 'You must enter whole numbers only'];
              errorStore.push(fieldCheck);
              ccsZaddErrorMessage(weightage[index], 'You must enter whole numbers only');
            }
          }
        }
        else if (Number(weightage[index].value) < 0) {
          fieldCheck = [weightage[index].id, 'You must enter positive value.'];
          errorStore.push(fieldCheck);
          ccsZaddErrorMessage(weightage[index], 'You must enter positive value.');
        }
      }
    }

    if (errorStore.length > 0) {
      ccsZPresentErrorSummary(errorStore)
    }
    if (!pageHeading.includes("Enter your project requirements") && $('#totalPercentage') != null && $('#totalPercentage') != undefined && $('#totalPercentage').length > 0 && Number($('#totalPercentage').text()) > 100) {
      errorStore.push(["There is a problem", "The total weighting is more than 100% "]);
    }
    errorStore = errorStore.length <= 0 ? emptyQuestionFieldCheckRfp() : errorStore;
    if (errorStore.length === 0) {
      document.forms['rfp_multianswer_question_form'].submit();
    } else {
      ccsZPresentErrorSummary(errorStore);
    }
  });

  $(".terms_acr_description_count").keyup(function(){
    let maxlength = $(this).attr('maxlength');
    let currentLength = this.value.length;
    let tmpid = $(this).attr('id');
    let id = tmpid.substring(20);
    $(".term_accr_des_"+id).text(`You have ${(maxlength-currentLength)} characters remaining`);
  });

  $(".rfp_background_procurement_textarea").keyup(function(){
   
    let maxlength = $(this).attr('maxlength');
    let currentLength = this.value.length;
    let tmpid = $(this).attr('id');
    let id = tmpid.substring(19);
    $("#"+id).text(`You have ${(maxlength-currentLength)} characters remaining`);
  });

  $(".rfp_term_more_description_count").keyup(function(){
   
    let maxlength = $(this).attr('maxlength');
    let currentLength = this.value.length;
    let tmpid = $(this).attr('id');
    let id = tmpid.substring(22);
    $(".rfp_term_more_details_"+id).text(`You have ${(maxlength-currentLength)} characters remaining`);
  });

  $(".rfp_kpi_description_count").keyup(function(){
   
    let maxlength = $(this).attr('maxlength');
    let currentLength = this.value.length;
    let tmpid = $(this).attr('id');
    let id = tmpid.substring(39);
    $(".rfp_term_kpi_description_"+id).text(`You have ${(maxlength-currentLength)} characters remaining`);
  });
  
  $(".rfp_fc_questions_description").keyup(function(){
   
    let maxlength = $(this).attr('maxlength');
    let currentLength = this.value.length;
    let tmpid = $(this).attr('id');
    let name = $(this).attr('name').replace(' ','');
    let id = tmpid.substring(12);
    $(".rfp_fc_req_"+id+'_'+name).text(`You have ${(maxlength-currentLength)} characters remaining`);
  });

});