document.addEventListener('DOMContentLoaded', () => {
  $('.additional').addClass('ccs-dynaform-hidden');

  //#reagion Number_of count 
  const checkHowManyQuestionAddedSoFar = function () {
    const pageHeading = document.getElementById('page-heading') != undefined && document.getElementById('page-heading') != null ? document.getElementById('page-heading').innerHTML : null;
    if (pageHeading?.includes("Enter your project requirements")) {
      for (var i = 1; i < 51; i++) {
        let rootEl = document.getElementById('fc_question_' + i);
        if (i <= 49 && !rootEl?.classList.contains('ccs-dynaform-hidden') && document.getElementsByClassName("add-another-btn").length > 0) {
          document.getElementsByClassName("add-another-btn")?.[0].classList.remove('ccs-dynaform-hidden')
        } else if (!rootEl?.classList.contains('ccs-dynaform-hidden') && document.getElementsByClassName("add-another-btn").length > 0) {
          document.getElementsByClassName("add-another-btn")?.[0].classList.add('ccs-dynaform-hidden')
        }
      }
    } else {
      for (var i = 1; i < 11; i++) {
        let rootEl = document.getElementById('fc_question_' + i);
        const divElem = document.querySelector('#fc_question_' + i);
        if (!rootEl?.classList.contains('ccs-dynaform-hidden') && pageHeading?.includes('technical questions')) {
          document.getElementById("questionsCount").textContent = i + ' techinical questions entered ';
        }
        if (!rootEl?.classList.contains('ccs-dynaform-hidden') && pageHeading?.includes('cultural fit questions')) {
          document.getElementById("questionsCount").textContent = i + ' cultural fit questions entered';
        }
        if (!rootEl?.classList.contains('ccs-dynaform-hidden') && pageHeading?.includes('social value questions')) {
          document.getElementById("questionsCount").textContent = i + ' social value questions entered';
        }
        if (i <= 9 && !rootEl?.classList.contains('ccs-dynaform-hidden') && document.getElementsByClassName("add-another-btn").length > 0) {

          document.getElementsByClassName("add-another-btn")?.[0].classList.remove('ccs-dynaform-hidden')
        } else if (!rootEl?.classList.contains('ccs-dynaform-hidden') && document.getElementsByClassName("add-another-btn").length > 0) {
          document.getElementsByClassName("add-another-btn")?.[0].classList.add('ccs-dynaform-hidden')
        }
      }
    }

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
    const pageHeading = document.getElementById('page-heading') != undefined && document.getElementById('page-heading') != null ? document.getElementById('page-heading').innerHTML : null;

    let with_value_count = 10,
      prev_input = 0,
      deleteButtons = document.querySelectorAll('a.del');
    let deleteButtonCount = [];
    let elements = document.querySelectorAll('.weightage');
    //#region Character count validation
    if (!pageHeading?.includes("Enter your project requirements")) {
      [].forEach.call(document.querySelectorAll('.order_1'), function (el) {
        el.maxLength = '500'
        let count = 500 - el.value.length;
        //$("#rfp_label_question_lable_" + el.id.substring(12, 15)).text(`You have ${count} characters remaining`);
      });
      [].forEach.call(document.querySelectorAll('.order_2'), function (el) {
        el.maxLength = '5000'
        let count = 5000 - el.value.length;
        //$("#rfp_label_question_lable_" + el.id.substring(12, 15)).text(`You have ${count} characters remaining`);
      });
      [].forEach.call(document.querySelectorAll('.order_3'), function (el) {
        el.maxLength = '5000'
        let count = 5000 - el.value.length;
        //$("#rfp_label_question_lable_" + el.id.substring(12, 15)).text(`You have ${count} characters remaining`);
      });
    }
    //#endregion

    let totalPercentage = () => {
      let errorStore = [];
      let weightageSum = 0;
      removeErrorFieldsRfpScoreQuestion();
      elements.forEach(el => {
        weightageSum += isNaN(el.value) ? 0 : Number(el.value);
      });
      //const pageHeading = document.getElementById('page-heading').innerHTML;
      if (!(pageHeading?.includes('Write your technical questions') || pageHeading?.includes('Write your cultural fit questions') || pageHeading?.includes('Write your social value questions'))) {
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
        if ((event.ctrlKey || event.metaKey) && event.keyCode == 86) { event.preventDefault(); return; }
      });
    });
    let allTextBox = document.getElementsByTagName("textarea");
    for (let index = 0; index < allTextBox.length; index++) {
      let ele = allTextBox[index];

      ele.id = ele.id + "_Requirements_" + index;
      if (pageHeading?.includes("Enter your project requirements")) {
        ele.addEventListener('keyup', (event) => {
          let maxLength = event.target.maxLength;
          let errorStore = [];
          removeErrorFieldsRfpScoreQuestion();
          let currentLength = event.target.value.length;
          let spanId = event.target.id?.split("_")[5];
          document.getElementById(spanId).innerText = `You have ${(maxLength - currentLength)} characters remaining`;;
          if ((currentLength) > maxLength) {
            errorStore.push([event.target.id, `No more than ${maxLength} characters are allowed.`]);
            ccsZPresentErrorSummary(errorStore);
            ccsZvalidateTextArea(event.target.id, `No more than ${maxLength} characters are allowed.`, '');
          }
        });
      } else {
        ele.addEventListener('keyup', (event) => {
          let maxLength = event.target.maxLength;
          let errorStore = [];
          removeErrorFieldsRfpScoreQuestion();
          let currentLength = event.target.value.length;
          let spanId = event.target.id?.split("_")[5];
          document.getElementById(spanId).innerText = `You have ${(maxLength - currentLength)} characters remaining`;;
          if ((currentLength) > maxLength) {
            errorStore.push([event.target.id, `No more than ${maxLength} characters are allowed.`]);
            ccsZPresentErrorSummary(errorStore);
            ccsZvalidateTextArea(event.target.id, `No more than ${maxLength} characters are allowed.`, '');
          }
        });
      }
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
      //db.classList.add('ccs-dynaform-hidden')
      db.addEventListener('click', (e) => {
        e.preventDefault();
        let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
          prev_input = Number(target) - 1,
          target_fieldset = db.closest("div");
        if (!pageHeading?.includes("Enter your")) {
          target_fieldset.classList.add("ccs-dynaform-hidden");
          let precentageValueofLast = 0;
          if (document.getElementById('fc_question_precenate_' + target) != undefined && document.getElementById('fc_question_precenate_' + target) != null) {
            precentageValueofLast = document.getElementById('fc_question_precenate_' + target).value;
          }
          document.getElementById('totalPercentage').textContent = Number(document.getElementById('totalPercentage').textContent) > 0 ? Number(document.getElementById('totalPercentage').textContent) - Number(precentageValueofLast) : 0;
          //let allTextArea=document.getElementById("fc_question_"+target).querySelector("textarea");

          let allTextArea = document.getElementById('fc_question_' + target).querySelectorAll("textarea")
          let allInput = document.getElementById('fc_question_' + target).querySelectorAll("textarea")

          // allTextArea.forEach(x => {

          // });

          document.getElementById(allTextArea[0].id).value = "";
          document.getElementById(allTextArea[1].id).value = "";
          document.getElementById(allTextArea[2].id).value = "";
          if (document.getElementById('fc_question_precenate_' + target) != undefined && document.getElementById('fc_question_precenate_' + target) != null) {
            document.getElementById('fc_question_precenate_' + target).value = "";
          }

          //RESET ALL DATA AFTER DELETED ANY DATA
          let resetKPIData = [{}];
          for (var question_fieldset = 1; question_fieldset < 11; question_fieldset++) {
            let allTextArea = document.getElementById('fc_question_' + question_fieldset).querySelectorAll("textarea")

            let questionName = allTextArea[0].value;
            let questionDetails = allTextArea[1].value;
            let questionExplation = allTextArea[2].value;
            let precenatage = '';
            if (document.getElementById('fc_question_precenate_' + question_fieldset) != undefined && document.getElementById('fc_question_precenate_' + question_fieldset) != null) {
              precenatage = document.getElementById('fc_question_precenate_' + question_fieldset).value;
            }

            if (precenatage != undefined && precenatage != null && precenatage != '' && questionName != undefined && questionName != null && questionName != '' && questionDetails != undefined && questionDetails != null && questionDetails != '' && questionExplation != undefined && questionExplation != null && questionExplation != '') {
              resetKPIData.push({ precenatage: precenatage, questionName: questionName, questionDetails: questionDetails, questionExplation: questionExplation });
            }

            document.getElementById(allTextArea[0].id).value = '';
            document.getElementById(allTextArea[1].id).value = '';
            document.getElementById(allTextArea[2].id).value = '';

            if (document.getElementById('fc_question_precenate_' + question_fieldset) != undefined && document.getElementById('fc_question_precenate_' + question_fieldset) != null) {
              document.getElementById('fc_question_precenate_' + question_fieldset).value = ''
            }
            let this_fieldset = document.getElementById('fc_question_' + (question_fieldset === 0 ? 1 : question_fieldset));
            this_fieldset?.classList.add('ccs-dynaform-hidden');

          }


          for (var question_fieldset = 0; question_fieldset < 11; question_fieldset++) {
            let allTextArea = null;
            if (question_fieldset != 0) {
              allTextArea = document.getElementById('fc_question_' + question_fieldset).querySelectorAll("textarea")
              document.getElementById(allTextArea[0].id).value = resetKPIData[question_fieldset]?.questionName != undefined ? resetKPIData[question_fieldset]?.questionName : '';
              document.getElementById(allTextArea[1].id).value = resetKPIData[question_fieldset]?.questionDetails != undefined ? resetKPIData[question_fieldset]?.questionDetails : '';
              document.getElementById(allTextArea[2].id).value = resetKPIData[question_fieldset]?.questionExplation != undefined ? resetKPIData[question_fieldset]?.questionExplation : '';
              document.getElementById('fc_question_precenate_' + question_fieldset).value = resetKPIData[question_fieldset]?.precenatage != undefined ? resetKPIData[question_fieldset]?.precenatage : ''
            }

            let this_fieldset = document.getElementById('fc_question_' + question_fieldset) != undefined && document.getElementById('fc_question_' + question_fieldset) != null ? document.getElementById('fc_question_' + question_fieldset) : null;
            let name_box = allTextArea != undefined && allTextArea != null ? document.getElementById(allTextArea[0].id) : null;
            if (this_fieldset != null && name_box?.value !== undefined && name_box?.value !== null && name_box?.value !== '') {
              with_value_count = question_fieldset;
              this_fieldset.classList.remove('ccs-dynaform-hidden');
              if (question_fieldset === 10) {
                document.getElementsByClassName('add-another-btn')[0].classList.add('ccs-dynaform-hidden');
              }
            } else if (this_fieldset != null && question_fieldset !== 0 && (name_box?.value == '' || name_box?.value == undefined || name_box?.value != null)) {
              this_fieldset?.classList.add('ccs-dynaform-hidden');
              with_value_count = question_fieldset;
            }
            if (this_fieldset != null && question_fieldset === 1) {
              this_fieldset?.classList.remove('ccs-dynaform-hidden');
              with_value_count = 1;
            }
          }
        } else if (pageHeading?.includes("Enter your")) {
          target_fieldset.classList.add("ccs-dynaform-hidden");
          const inputElements = target_fieldset.querySelectorAll("textarea")
          document.getElementById(inputElements[0].id).value = "";
          document.getElementById(inputElements[1].id).value = "";
          document.getElementById(inputElements[2].id).value = "";

          //RESET ALL DATA AFTER DELETED ANY DATA
          let resetKPIData = [{}];
          for (var question_fieldset = 1; question_fieldset < 51; question_fieldset++) {
            let target_fieldset_getValue = document.getElementById("fc_question_" + question_fieldset)
            //.querySelectorAll("textarea");

            let questionGroupName = target_fieldset_getValue.querySelectorAll("textarea")[0]?.value;
            let questionRequirement = target_fieldset_getValue.querySelectorAll("textarea")[1]?.value;
            let questionRequirementDescribe = target_fieldset_getValue.querySelectorAll("textarea")[2]?.value;;
            if (questionGroupName != undefined && questionGroupName != null && questionGroupName != '' && questionRequirement != undefined && questionRequirement != null && questionRequirement != '' && questionRequirementDescribe != undefined && questionRequirementDescribe != null && questionRequirementDescribe != '') {
              resetKPIData.push({ questionGroupName: questionGroupName, questionRequirement: questionRequirement, questionRequirementDescribe: questionRequirementDescribe });
            }

            document.getElementById(target_fieldset_getValue.querySelectorAll("textarea")[0].id).value = '';
            document.getElementById(target_fieldset_getValue.querySelectorAll("textarea")[1].id).value = '';
            document.getElementById(target_fieldset_getValue.querySelectorAll("textarea")[2].id).value = '';

            let this_fieldset = document.getElementById('fc_question_' + (question_fieldset === 0 ? 1 : question_fieldset));
            this_fieldset?.classList.add('ccs-dynaform-hidden');
          }


          for (var question_fieldset = 0; question_fieldset < 51; question_fieldset++) {
            let target_fieldset_getValue = document.getElementById("fc_question_" + question_fieldset)
            let allInputTargetField = target_fieldset_getValue?.querySelectorAll("textarea");

            if (question_fieldset != 0 && allInputTargetField != null && allInputTargetField.length > 0) {
              document.getElementById(allInputTargetField[0].id).value = resetKPIData[question_fieldset]?.questionGroupName != undefined ? resetKPIData[question_fieldset]?.questionGroupName : '';
              document.getElementById(allInputTargetField[1].id).value = resetKPIData[question_fieldset]?.questionRequirement != undefined ? resetKPIData[question_fieldset]?.questionRequirement : '';
              document.getElementById(allInputTargetField[2].id).value = resetKPIData[question_fieldset]?.questionRequirementDescribe != undefined ? resetKPIData[question_fieldset]?.questionRequirementDescribe : '';
            }

            let this_fieldset = document.getElementById('fc_question_' + question_fieldset) != undefined && document.getElementById('fc_question_' + question_fieldset) != null ? document.getElementById('fc_question_' + question_fieldset) : null;
            let name_box = allInputTargetField != null && allInputTargetField.length > 0 ? document.getElementById(allInputTargetField[0].id) : null;
            if (this_fieldset != null && name_box?.value !== undefined && name_box?.value !== null && name_box?.value !== '') {
              with_value_count = question_fieldset;
              this_fieldset?.classList.remove('ccs-dynaform-hidden');
              if (question_fieldset === 50) {
                document.getElementsByClassName('add-another-btn')[0].classList.add('ccs-dynaform-hidden');
              }
            } else if (this_fieldset != null && question_fieldset !== 0 && (name_box?.value == '' || name_box?.value == undefined || name_box?.value != null)) {
              this_fieldset?.classList.add('ccs-dynaform-hidden');
              with_value_count = question_fieldset;
            }
            if (this_fieldset != null && question_fieldset === 1) {
              this_fieldset?.classList.remove('ccs-dynaform-hidden');
              with_value_count = 1;
            }
          }
        }
        checkHowManyQuestionAddedSoFar();
      });
    });

    if (pageHeading?.includes("Enter your project requirements")) {
      let allSpantag = document.getElementById('enteryourProjectRequirement').querySelectorAll("span")
      allSpantag.forEach((e, index) => {
        e.id = index;
      })

      for (var i = 1; i < 51; i++) {
        let rootEl = document.getElementById('fc_question_' + i);
        const inputElements = rootEl?.querySelectorAll("textarea");
        //#region span char lenght message

        //#endregion

        //#region 
        inputElements[0].rows = 2;
        inputElements[0].maxLength = 500;

        inputElements[1].rows = 2;
        inputElements[1].maxLength = 500;

        inputElements[2].rows = 2;
        inputElements[2].maxLength = 5000;

        let currentLength = inputElements[0].value.length;
        let spanId = inputElements[0].id?.split("_")[5];

        let currentLength1 = inputElements[1].value.length;
        let spanId1 = inputElements[1].id?.split("_")[5];

        let currentLength2 = inputElements[2].value.length;
        let spanId2 = inputElements[2].id?.split("_")[5];

        document.getElementById(spanId).innerText = `You have ${(500 - currentLength)} characters remaining`;
        document.getElementById(spanId1).innerText = `You have ${(500 - currentLength1)} characters remaining`;
        document.getElementById(spanId2).innerText = `You have ${(5000 - currentLength2)} characters remaining`;


        let field1 = document.getElementById(inputElements[0].id).value;

        if (field1 != undefined && field1 != null && field1 != '') {
          rootEl?.classList.remove("ccs-dynaform-hidden");
        } else if (i != 1) {
          rootEl?.classList.add("ccs-dynaform-hidden");
        }
        if (i <= 49 && !rootEl?.classList.contains('ccs-dynaform-hidden') && document.getElementsByClassName("add-another-btn").length > 0) {
          document.getElementsByClassName("add-another-btn")?.[0].classList.remove('ccs-dynaform-hidden')
        } else if (!rootEl?.classList.contains('ccs-dynaform-hidden') && document.getElementsByClassName("add-another-btn").length > 0) {
          document.getElementsByClassName("add-another-btn")?.[0].classList.add('ccs-dynaform-hidden')
        }
      }
    } else {
      let allSpantag = document.querySelectorAll(".remaining_chrs_term")
      allSpantag.forEach((e, index) => {
        e.id = index;
      })
      for (var box_num = 1; box_num < 11; box_num++) {
        let this_box = document.getElementById('fc_question_' + box_num);
        let rootEl = document.getElementById('fc_question_' + box_num);
        const inputElements = rootEl?.querySelectorAll("textarea");

        let currentLength = inputElements[0].value.length;
        let spanId = inputElements[0].id?.split("_")[5];

        let currentLength1 = inputElements[1].value.length;
        let spanId1 = inputElements[1].id?.split("_")[5];

        let currentLength2 = inputElements[2].value.length;
        let spanId2 = inputElements[2].id?.split("_")[5];

        document.getElementById(spanId).innerText = `You have ${(500 - currentLength)} characters remaining`;
        document.getElementById(spanId1).innerText = `You have ${(5000 - currentLength1)} characters remaining`;
        document.getElementById(spanId2).innerText = `You have ${(5000 - currentLength2)} characters remaining`;

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
          //$("#del_fc_question_" + deleteButtonCount[deleteButtonCount.sort().length - 1]).removeClass("ccs-dynaform-hidden");
        }
      }
    }

    $('.add-another-btn').on('click', function () {
      errorStore = [];
      let containsHiddenClassAtPostion = []
      const pageHeading = document.getElementById('page-heading') != undefined && document.getElementById('page-heading') != null ? document.getElementById('page-heading').innerHTML : null;
      removeErrorFieldsRfpScoreQuestion();
      if (pageHeading?.includes("Enter your project requirements")) {
        //errorStore = emptyQuestionFieldCheckRfp();

        for (var i = 1; i < 51; i++) {
          let rootEl = document.getElementById('fc_question_' + i);
          if (rootEl?.classList?.contains('ccs-dynaform-hidden')) {
            containsHiddenClassAtPostion.push(i);
          }
        }
        let lastRowId = containsHiddenClassAtPostion.length > 0 ? containsHiddenClassAtPostion[0] - 1 : 0;
        const divElem = Number(lastRowId) > 0 ? document.querySelector('#fc_question_' + lastRowId) : null;
        const inputElements = divElem?.querySelectorAll("textarea");
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
        if (errorStore.length == 0) {
          document.getElementById('fc_question_' + containsHiddenClassAtPostion[0]).classList.remove('ccs-dynaform-hidden');
          //Added this condation section 5 (step 43/44/45)

          // if (with_value_count > 2) {
          //   prev_input = with_value_count - 1;
          // }
          // if (document.getElementById("questionsCount") != undefined) {
          //   document.getElementById("questionsCount").textContent = with_value_count + ' techinical questions entered so far';
          // }
          document
            .querySelector('label[for=fc_question_' + containsHiddenClassAtPostion[0] + '] a.del')
            .classList.remove('ccs-dynaform-hidden');
          // with_value_count++;

          // if (with_value_count === 11) {
          //   $('.add-another-btn').addClass('ccs-dynaform-hidden');
          // }
          totalAnswerd();
        } else ccsZPresentErrorSummary(errorStore);
      } else {
        errorStore = emptyQuestionFieldCheckRfp();
        for (var i = 1; i < 11; i++) {
          let rootEl = document.getElementById('fc_question_' + i);
          if (rootEl?.classList?.contains('ccs-dynaform-hidden')) {
            containsHiddenClassAtPostion.push(i);
          }
        }
        if (errorStore.length == 0) {
          document.getElementById('fc_question_' + containsHiddenClassAtPostion[0]).classList.remove('ccs-dynaform-hidden');
          //Added this condation section 5 (step 43/44/45)

          // if (with_value_count > 2) {
          //   prev_input = with_value_count - 1;
          // }
          // if (document.getElementById("questionsCount") != undefined) {
          //   document.getElementById("questionsCount").textContent = with_value_count + ' techinical questions entered so far';
          // }
          document
            .querySelector('label[for=fc_question_' + containsHiddenClassAtPostion[0] + '] a.del')
            .classList.remove('ccs-dynaform-hidden');
          // with_value_count++;

          // if (with_value_count === 11) {
          //   $('.add-another-btn').addClass('ccs-dynaform-hidden');
          // }
          totalAnswerd();
        } else ccsZPresentErrorSummary(errorStore);
      }

      checkHowManyQuestionAddedSoFar();
    });
  }

  const emptyQuestionFieldCheckRfp = () => {
    removeErrorFieldsRfpScoreQuestion();
    const countWords = str => str?.trim().split(/\s+/)?.length;
    let fieldCheck = '',
      errorStore = [], noOfRequirement_Group = 0;
    const weightage = $('.weightage');
    const pageHeading = document.getElementById('page-heading') != undefined && document.getElementById('page-heading') != null ? document.getElementById('page-heading').innerHTML : null;

    for (var i = 1; i < 11; i++) {
      let rootEl = document.getElementById('fc_question_' + i);
      const divElem = document.querySelector('#fc_question_' + i);

      if (!rootEl?.classList.contains('ccs-dynaform-hidden')) {
        if (Number($('#totalPercentage').text) > 100) {
          fieldCheck = ccsZvalidateWithRegex(
            'fc_question_' + i + '_4',
            'You cannot add / submit  question as your weightings exceed 100%',
            /\w+/,
          );
          if (fieldCheck !== true) errorStore.push(fieldCheck);
        }
        if (pageHeading?.includes("Enter your project requirements")) {
          const inputElements = divElem?.querySelectorAll("textarea");
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
          checkHowManyQuestionAddedSoFar();
        }
        else {
          if (rootEl?.querySelector('.order_1')) {
            let element = rootEl?.querySelector('.order_1');
            const condOrd1 = countWords(rootEl?.querySelector('.order_1')?.value) > 500;
            if (rootEl?.querySelector('.order_1').value == '' || condOrd1) {
              const msg = rootEl?.querySelector('.order_1').value
                ? 'Entry is limited to 500 words'
                : 'Enter your question';
              fieldCheck = ccsZvalidateWithRegex(rootEl?.querySelector('.order_1')?.id, msg, /\w+/, !condOrd1);
              if (fieldCheck !== true) errorStore.push(fieldCheck);
            }
          }
          if (rootEl?.querySelector('.order_2')) {
            const condOrd2 = countWords(rootEl?.querySelector('.order_2')?.value) > 5000;
            if (rootEl?.querySelector('.order_2').value == '' || !condOrd2) {
              const msg = rootEl?.querySelector('.order_2').value
                ? 'Entry is limited to 5000 words'
                : 'Add more details about this question';
              fieldCheck = ccsZvalidateWithRegex(rootEl?.querySelector('.order_2')?.id, msg, /\w+/, !condOrd2);
              if (fieldCheck !== true) errorStore.push(fieldCheck);
            }
          }
          if (rootEl?.querySelector('.order_3')) {
            const condOrd3 = countWords(rootEl?.querySelector('.order_3')?.value) > 5000;
            if (rootEl?.querySelector('.order_3').value == '' || condOrd3) {
              const msg = rootEl?.querySelector('.order_3').value
                ? 'Entry is limited to 5000 words'
                : 'Describe the type of answers you need from suppliers';
              fieldCheck = ccsZvalidateWithRegex(rootEl?.querySelector('.order_3')?.id, msg, /\w+/, !condOrd3);
              if (fieldCheck !== true) errorStore.push(fieldCheck);
            }
          }
          if (rootEl?.querySelector('.weightage')) {
            const condWeight = rootEl?.querySelector('.weightage')?.value > 100;
            if (rootEl?.querySelector('.weightage').value === '' || condWeight) {
              const msg = rootEl?.querySelector('.weightage').value
                ? 'Enter a weighting for this question <= 100%'
                : 'You must enter valid weightage';
              fieldCheck = ccsZvalidateWithRegex('fc_question_precenate_' + i, msg, /\w+/, !condWeight);
              if (fieldCheck !== true) errorStore.push(fieldCheck);
            } else if (rootEl?.querySelector('.weightage').value === '0') {
              fieldCheck = [weightage[i].id, 'The value cannot be less than 1%'];
              errorStore.push(fieldCheck);
              ccsZaddErrorMessage(weightage[i], 'The value cannot be less than 1%');
            }
          }
          checkHowManyQuestionAddedSoFar();
        }
      }
    }
    return errorStore;
  }

  $('#rfp_multianswer_question_form').on('submit', (event) => {
    event.preventDefault();
    let errorStore = [];
    //document.forms['rfp_multianswer_question_form'].submit();
    //return;
    removeErrorFieldsRfpScoreQuestion();
    const weightage = $('.weightage');
    let fieldCheck = "";
    const pageHeading = document.getElementById('page-heading') != undefined && document.getElementById('page-heading') != null ? document.getElementById('page-heading').innerHTML : null;

    if (!pageHeading?.includes("Enter your project requirements")) {
      for (let index = 0; index < weightage.length; index++) {
        if (pageHeading?.includes('Write your technical questions')) {
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
        else if (pageHeading?.includes('Write your cultural fit questions') || pageHeading?.includes('Write your social value questions')) {
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
    if (pageHeading?.includes("Enter your project requirements")) {
      for (var i = 1; i < 51; i++) {
        let rootEl = document.getElementById('fc_question_' + i);
        if (!rootEl?.classList.contains("ccs-dynaform-hidden")){
          const inputElements = rootEl.querySelectorAll("textarea");
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
        }          
      }
    }

    if (errorStore.length > 0) {
      ccsZPresentErrorSummary(errorStore)
    }
    if (!pageHeading?.includes("Enter your project requirements") && $('#totalPercentage') != null && $('#totalPercentage') != undefined && $('#totalPercentage').length > 0 && Number($('#totalPercentage').text()) > 100) {
      errorStore.push(["There is a problem", "The total weighting is more than 100% "]);
    }
    errorStore = errorStore.length <= 0 ? emptyQuestionFieldCheckRfp() : errorStore;
    if (errorStore.length === 0) {
      document.forms['rfp_multianswer_question_form'].submit();
    } else {
      ccsZPresentErrorSummary(errorStore);
    }
  });

  $(".terms_acr_description_count").keyup(function () {
    const pageHeading = document.getElementById('page-heading') != undefined && document.getElementById('page-heading') != null ? document.getElementById('page-heading').innerHTML : null;
    return

    if (!pageHeading?.includes("Enter your project requirements")) {
      let errorStore = [];
      removeErrorFieldsRfpScoreQuestion();
      $(this).removeAttr('maxlength');
      let currentLength = this.value.length;
      let tmpid = $(this).attr('id');
      let id = tmpid.substring(20);
      $(".term_accr_des_" + id).text(`You have ${(5000 - currentLength)} characters remaining`);

      if ((currentLength) > 5000) {
        errorStore.push([$(this).attr('id'), "No more than 5000 characters are allowed."]);
        ccsZPresentErrorSummary(errorStore);
        ccsZvalidateTextArea($(this).attr('id'), "No more than 5000 characters are allowed.", !condLength($(this).val()));
      }
    }

  });

  $(".rfp_background_procurement_textarea").keyup(function () {
    const pageHeading = document.getElementById('page-heading') != undefined && document.getElementById('page-heading') != null ? document.getElementById('page-heading').innerHTML : null;

    if (!pageHeading?.includes("Enter your project requirements")) {
      let errorStore = [];
      removeErrorFieldsRfpScoreQuestion();
      $(this).removeAttr('maxlength');
      let maxlength = $(this).attr('maxlength');
      let currentLength = this.value.length;
      let tmpid = $(this).attr('id');
      let id = tmpid.substring(19);
      $("#" + id).text(`You have ${(5000 - currentLength)} characters remaining`);

      if ((currentLength) > 5000) {
        errorStore.push([$(this).attr('id'), "No more than 5000 characters are allowed."]);
        ccsZPresentErrorSummary(errorStore);
        ccsZvalidateTextArea($(this).attr('id'), "No more than 5000 characters are allowed.", !condLength($(this).val()));
      }
    }
  });

  $(".rfp_term_more_description_count").keyup(function () {
    const pageHeading = document.getElementById('page-heading') != undefined && document.getElementById('page-heading') != null ? document.getElementById('page-heading').innerHTML : null;
    return
      ;
    if (!pageHeading?.includes("Enter your project requirements")) {
      let errorStore = [];
      removeErrorFieldsRfpScoreQuestion();
      $(this).removeAttr('maxlength');
      let maxlength = $(this).attr('maxlength');
      let currentLength = this.value.length;
      let tmpid = $(this).attr('id');
      let id = tmpid.substring(22);
      $(".rfp_term_more_details_" + id).text(`You have ${(5000 - currentLength)} characters remaining`);

      if ((currentLength) > 5000) {
        errorStore.push([$(this).attr('id'), "No more than 5000 characters are allowed."]);
        ccsZPresentErrorSummary(errorStore);
        ccsZvalidateTextArea($(this).attr('id'), "No more than 5000 characters are allowed.", !condLength($(this).val()));
      }
    }
  });

  $(".rfp_kpi_description_count").keyup(function () {
    const pageHeading = document.getElementById('page-heading') != undefined && document.getElementById('page-heading') != null ? document.getElementById('page-heading').innerHTML : null;
    return
      ;
    if (!pageHeading?.includes("Enter your project requirements") && !pageHeading?.includes("Write your social value questions")) {
      let errorStore = [];
      removeErrorFieldsRfpScoreQuestion();
      $(this).removeAttr('maxlength');
      let currentLength = this.value.length;
      let tmpid = $(this).attr('id');
      let id = tmpid.substring(39);
      $(".rfp_term_kpi_description_" + id).text(`You have ${(5000 - currentLength)} characters remaining`);


      if ((currentLength) > 5000) {
        errorStore.push([$(this).attr('id'), "No more than 5000 characters are allowed."]);
        ccsZPresentErrorSummary(errorStore);
        ccsZvalidateTextArea($(this).attr('id'), "No more than 5000 characters are allowed.", !condLength($(this).val()));
      }
    }
  });

  $(".rfp_fc_questions_description").keyup(function () {
    const pageHeading = document.getElementById('page-heading') != undefined && document.getElementById('page-heading') != null ? document.getElementById('page-heading').innerHTML : null;
    return
    if (!pageHeading?.includes("Enter your project requirements")) {
      let errorStore = [];
      removeErrorFieldsRfpScoreQuestion();
      $(this).removeAttr('maxlength');

      let maxlength = $(this).attr('maxlength');
      let currentLength = this.value.length;
      let tmpid = $(this).attr('id');
      let name = $(this).attr('name').replace(' ', '');
      let id = tmpid.substring(12, 15);

      $(".rfp_fc_req_" + id + '_' + name).text(`You have ${(5000 - currentLength)} characters remaining`);

      if ((currentLength) > 5000) {
        errorStore.push([$(this).attr('id'), "No more than 5000 characters are allowed."]);
        ccsZPresentErrorSummary(errorStore);
        ccsZvalidateTextArea($(this).attr('id'), "No more than 5000 characters are allowed.", !condLength($(this).val()));
      }
    }
  });

  $(".weightage").keyup(function () {
    const pageHeading = document.getElementById('page-heading') != undefined && document.getElementById('page-heading') != null ? document.getElementById('page-heading').innerHTML : null;

    var allElements = document.getElementsByClassName("weightage");
    var totalsum = 0;
    removeErrorFieldsRfpScoreQuestion();
    for (i = 1; i < allElements.length; i++) {
      totalsum += Number(document.getElementById("fc_question_precenate_" + i).value);
    }
    if (totalsum > 100) {
      document.getElementsByClassName("add-another-btn")[0].classList.add('ccs-dynaform-hidden');
      errorStore.push(["fc_question_precenate_" + i, "The weighting cannot exceed 100%"]);
      ccsZPresentErrorSummary(errorStore);
    }
    else if (totalsum >= 100) {
      document.getElementsByClassName("add-another-btn")[0].classList.add('ccs-dynaform-hidden');
    }
    else if (totalsum < 100) {
      document.getElementsByClassName("add-another-btn")[0].classList.remove('ccs-dynaform-hidden');
    }
  });
  checkHowManyQuestionAddedSoFar();

});