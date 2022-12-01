document.addEventListener('DOMContentLoaded', () => {
  $(".check-popup").on('click', function(){
    console.log("Workied******");
    // openpop.classList.remove('showpopup');
    const openpopsupplier = document.querySelector('.backdrop-supplier-popup')
        openpopsupplier.classList.add('showpopup');
        $(".dialog-close-supplier").on('click', function(){
          openpopsupplier.classList.remove('showpopup');
        });
        stnewsupplier = document.getElementById('redirect-button-supplier');
        stnewsupplier.addEventListener('click', ev => {
          openpopsupplier.classList.remove('showpopup');
          console.log("Workied confirm******");
        })
  });

  if (document.getElementById('ccs_rfp_scoring_criteria') !== null) {
    let noOfCountfieldNotNull = [], with_value_count = 10,
      prev_input = 0,

      deleteButtons = document.querySelectorAll('a.del').length > 0 ? document.querySelectorAll('a.del') : document.querySelectorAll('a.clear-fields');
    selectTierButtons = document.querySelectorAll('.tier-popup');
    let tierDataList = document.querySelectorAll('.tierLable');
    document.getElementById('ccs_rfp_score_criteria_add').classList.remove('ccs-dynaform-hidden');

    const points_for_this_level = document.querySelectorAll(".govuk-input--width-3");
    const allinput = document.querySelectorAll(".govuk-input");
    const alltextarea = document.querySelectorAll(".govuk-textarea");

    allinput.forEach(element => {
      element.addEventListener("focusout", (event) => {
        if (event.target.value != undefined && event.target.value !== '') {
          removeErrorFieldsRfpScore();
        }
      })
    })

    alltextarea.forEach(element => {
      element.addEventListener("focusout", (event) => {
        if (event.target.value != undefined && event.target.value !== '') {
          removeErrorFieldsRfpScore();
        }
      })
    })
    document.getElementById('tiersAdded').textContent = '0';
    //GET DATA FROM OWN TIER
    let rowsAndHead = {}
    tierDataList.forEach(e => {
      if (e.attributes != undefined && e.attributes[2] != undefined && e.attributes[2].textContent != undefined && e.attributes != null && e.attributes[2] != null && e.attributes[2].textContent != null) {
        if (e.attributes[2].textContent.toLowerCase() === 'Create your own scoring criteria'.toLowerCase()) {
          if (e.attributes != undefined && e.attributes[4] != undefined && e.attributes != null && e.attributes[4] != null) {
            rowsAndHead = e.attributes[4].value != null ? JSON.parse(e.attributes[4].value) : null;
          }
        }
      }
    })

    //fill data on page reaload
    let activateField9thAreFilledReload = false;
    for (var score_criteria_fieldset = 1; score_criteria_fieldset < 11; score_criteria_fieldset++) {
      if (rowsAndHead != null && rowsAndHead != undefined && rowsAndHead.rows != undefined && rowsAndHead.rows != null) {
        if (score_criteria_fieldset == 1) {
          rowsAndHead.rows.unshift([{ text: 'ignore' }]);
        }

        if (rowsAndHead.rows[score_criteria_fieldset] != null && rowsAndHead.rows[score_criteria_fieldset] != undefined) {
          document.getElementById('rfp_score_criteria_name_' + score_criteria_fieldset).value = rowsAndHead != undefined && rowsAndHead != null && rowsAndHead.rows[score_criteria_fieldset].at(0).text != undefined ? rowsAndHead.rows[score_criteria_fieldset].at(0).text : '';
          document.getElementById('rfp_score_criteria_point_' + score_criteria_fieldset).value = rowsAndHead != undefined && rowsAndHead != null && rowsAndHead.rows[score_criteria_fieldset].at(1).text != undefined ? rowsAndHead.rows[score_criteria_fieldset].at(1).text : '';
          document.getElementById('rfp_score_criteria_desc_' + score_criteria_fieldset).value = rowsAndHead != undefined && rowsAndHead != null && rowsAndHead.rows[score_criteria_fieldset].at(2).text != undefined ? rowsAndHead.rows[score_criteria_fieldset].at(2).text : '';
        }
      }

      let this_fieldset = document.querySelector('.score_criteria_' + (score_criteria_fieldset === 0 ? 1 : score_criteria_fieldset)),
        name_box = document.getElementById('rfp_score_criteria_name_' + (score_criteria_fieldset === 0 ? 1 : score_criteria_fieldset));

      if (name_box.value !== '' && name_box.value !== undefined && name_box.value !== null) {
        this_fieldset.classList.remove('ccs-dynaform-hidden');
        if (score_criteria_fieldset === 10) {
          document.getElementById('ccs_rfp_score_criteria_add').classList.add('ccs-dynaform-hidden');
        }
        if (score_criteria_fieldset === 9) {
          activateField9thAreFilledReload = true;
        }
        document.getElementById('tiersAdded').textContent = score_criteria_fieldset;
      } else if (score_criteria_fieldset !== 1) {
        if (this_fieldset != null && this_fieldset != undefined) {
          this_fieldset.classList.add('ccs-dynaform-hidden');
        }
        with_value_count = score_criteria_fieldset;
      }
      else if (score_criteria_fieldset === 10 && activateField9thAreFilledReload) {
        document.getElementById('ccs_rfp_score_criteria_add').classList.add('ccs-dynaform-hidden');
      } else {
        document.getElementById('ccs_rfp_score_criteria_add').classList.remove('ccs-dynaform-hidden');
      }

    }
    //document.getElementById('ccs_rfp_score_criteria_add').classList.remove('ccs-dynaform-hidden');
    selectTierButtons.forEach(st => {
      st.addEventListener('click', e => {
        const rowsAndHead = JSON.parse(e.currentTarget.attributes[2].value);
        let count = 0;

        const openpop = document.querySelector('.backdrop-tier') 
        openpop.classList.add('showpopup');
        
        $(".dialog-close-tier").on('click', function(){
          openpop.classList.remove('showpopup');
        });
        stnew = document.getElementById('redirect-button-tier');
        stnew.addEventListener('click', ev => {
          openpop.classList.remove('showpopup');
          removeErrorFieldsRfpScore();
        for (var score_criteria_fieldset = 1; score_criteria_fieldset < 11; score_criteria_fieldset++) {
          document.getElementById('rfp_score_criteria_name_' + score_criteria_fieldset).value = '';
          document.getElementById('rfp_score_criteria_point_' + score_criteria_fieldset).value = '';
          document.getElementById('rfp_score_criteria_desc_' + score_criteria_fieldset).value = '';
          var elements = document.getElementsByClassName("score_criteria_" + score_criteria_fieldset);
          // elements.classList.removeClass("ccs-dynaform-hidden");
          //while (elements.length)
          elements[0].classList.add("ccs-dynaform-hidden");
        }

        if (rowsAndHead != undefined && rowsAndHead != null) {
          document.getElementById('tiersAdded').textContent = rowsAndHead.rows.length;
          with_value_count = rowsAndHead.rows.length + 1;
          rowsAndHead.rows.unshift({ text: "Ignore" })

          if(document.getElementById('agreement_id') && document.getElementById('agreement_id').value == 'RM1043.8'){ 
            rowsAndHead.rows.reverse();
              for (let i = 0; i < rowsAndHead.rows.length; i++) {
              if (i !== 4) {
               const ii = i + 1;
               var elements = document.getElementsByClassName("score_criteria_" + ii);
                elements[0].classList.remove("ccs-dynaform-hidden");
                document.getElementById("rfp_score_criteria_name_" + ii).value = rowsAndHead.rows[i].at(0).text;
                document.getElementById("rfp_score_criteria_point_" + ii).value = rowsAndHead.rows[i].at(1).text;
                document.getElementById("rfp_score_criteria_desc_" + ii).value = rowsAndHead.rows[i].at(2).text;
                document.getElementById("rfp_score_criteria_desc_" + ii).focus();
                document.getElementById("rfp_score_criteria_name_" + ii).focus();
              }
              if (rowsAndHead.rows.length == 11 && $('#ccs_rfp_score_criteria_add').hasClass('ccs-dynaform-hidden')) {
                document.getElementById('ccs_rfp_score_criteria_add').classList.add('ccs-dynaform-hidden');
              } else {
                document.getElementById('ccs_rfp_score_criteria_add').classList.remove('ccs-dynaform-hidden');
              }
            }
          }else{
            for (let i = 0; i < rowsAndHead.rows.length; i++) {
              if (i !== 0) {
                //const ii = i + 1;
                var elements = document.getElementsByClassName("score_criteria_" + i);
                // elements.classList.removeClass("ccs-dynaform-hidden");
                //while (elements.length)
                elements[0].classList.remove("ccs-dynaform-hidden");
                // if (rowsAndHead.rows.length == i) {
                //   //$("#deleteButton_" + ii).removeClass("ccs-dynaform-hidden");
                //   //$("#ccs_rfp_score_criteria_add").addClass("ccs-dynaform-hidden");
                // }
                // else {
                //   //$("#deleteButton_" + ii).addClass("ccs-dynaform-hidden");
                // }
  
                document.getElementById("rfp_score_criteria_name_" + i).value = rowsAndHead.rows[i].at(0).text;
                document.getElementById("rfp_score_criteria_point_" + i).value = rowsAndHead.rows[i].at(1).text;
                document.getElementById("rfp_score_criteria_desc_" + i).value = rowsAndHead.rows[i].at(2).text;
  
                // $("#rfp_score_criteria_name_" + ii).prop('readonly', true);
                // $("#rfp_score_criteria_point_" + ii).prop('readonly', true);
                // $("#rfp_score_criteria_desc_" + ii).prop('readonly', true);
                document.getElementById("rfp_score_criteria_name_" + i).focus();
                document.getElementById("rfp_score_criteria_desc_" + i).focus();
  
              }
              if (rowsAndHead.rows.length == 11 && $('#ccs_rfp_score_criteria_add').hasClass('ccs-dynaform-hidden')) {
                document.getElementById('ccs_rfp_score_criteria_add').classList.add('ccs-dynaform-hidden');
              } else {
                document.getElementById('ccs_rfp_score_criteria_add').classList.remove('ccs-dynaform-hidden');
              }
            }
          }

        
        }
        })
        })
                       
       
        

        
      // })
    })

    document.getElementById('ccs_rfp_score_criteria_add').addEventListener('click', e => {
      $('.govuk-form-group textarea').removeClass('govuk-textarea--error');
      checkFieldsRfpScore();
      removeErrorFieldsRfpScore();
      e.preventDefault();
      errorStore = emptyFieldCheckRfpScore();
      // if (with_value_count === 11) {
      //   let errlist = [];
      //   errlist.push(["There is a problem", 'You must add min maximum 10 tiers.'])
      //   ccsZPresentErrorSummary(errlist);
      //   return;
      // }
      let activateField = 1;
      let activateField9thAreFilled = false;
      if (errorStore.length == 0) {
        for (var score_criteria_fieldset = 1; score_criteria_fieldset < 11; score_criteria_fieldset++) {
          let this_fieldset = document.querySelector('.score_criteria_' + (score_criteria_fieldset === 0 ? 1 : score_criteria_fieldset)),
            name_box = document.getElementById('rfp_score_criteria_name_' + (score_criteria_fieldset === 0 ? 1 : score_criteria_fieldset));

          if (name_box.value !== '' && name_box.value !== undefined && name_box.value !== null) {
            //if (score_criteria_fieldset !== 1) {
            activateField += 1;
            document.getElementById('tiersAdded').textContent = score_criteria_fieldset;
            //}
            this_fieldset.classList.remove('ccs-dynaform-hidden');
            if (score_criteria_fieldset === 9) {
              activateField9thAreFilled = true;
            }
            if (score_criteria_fieldset === 10) {
              document.getElementById('ccs_rfp_score_criteria_add').classList.add('ccs-dynaform-hidden');
              errorStore.push(["There is a problem", 'You must add min maximum 10 tiers.']);
            }
          }
          if (score_criteria_fieldset === 10 && activateField9thAreFilled) {
            document.getElementById('ccs_rfp_score_criteria_add').classList.add('ccs-dynaform-hidden');
          }
        }
        if ($(".score_criteria_" + Number(activateField)).length > 0 && $(".score_criteria_" + Number(activateField)).hasClass("ccs-dynaform-hidden")) {
          document.querySelector('.score_criteria_' + Number(activateField)).classList.remove('ccs-dynaform-hidden');
          document.getElementById('tiersAdded').textContent = activateField;
        }
        if (errorStore.length > 0) {
          ccsZPresentErrorSummary(errorStore);
        }
      } else ccsZPresentErrorSummary(errorStore);
    });

    // delete buttons
    deleteButtons.forEach(db => {
      db.classList.remove('ccs-dynaform-hidden');
      db.addEventListener('click', e => {
        e.preventDefault();
        let totalAddedTierSoFar = Number(document.getElementById('tiersAdded').textContent)
        let target = db.href.replace(/^(.+\/)(\d{1,2})$/, '$2'),
          prev_coll = Number(target) - 1,
          desc_fieldset = db.closest('fieldset');

        desc_fieldset.classList.add('ccs-dynaform-hidden');

        document.getElementById('rfp_score_criteria_name_' + target).value = '';
        document.getElementById('rfp_score_criteria_point_' + target).value = '';
        document.getElementById('rfp_score_criteria_desc_' + target).value = '';

        document.getElementById('rfp_score_criteria_name_' + target).removeAttribute('readonly');
        document.getElementById('rfp_score_criteria_point_' + target).removeAttribute('readonly');
        document.getElementById('rfp_score_criteria_desc_' + target).removeAttribute('readonly');
        //RESET ALL TIER DATA AFTER DELETED ANY DATA
        let resetTierData = [];
        for (var score_criteria_fieldset = 1; score_criteria_fieldset < 11; score_criteria_fieldset++) {
          let name = document.getElementById('rfp_score_criteria_name_' + score_criteria_fieldset).value;
          let point = document.getElementById('rfp_score_criteria_point_' + score_criteria_fieldset).value;
          let desc = document.getElementById('rfp_score_criteria_desc_' + score_criteria_fieldset).value;
          if (name != undefined && name != null && name != '' && point != undefined && point != null && point != '' && desc != undefined && desc != null && point != '') {
            resetTierData.push({ name: name, point: point, desc: desc });
          }
          document.getElementById('rfp_score_criteria_name_' + score_criteria_fieldset).value = '';
          document.getElementById('rfp_score_criteria_point_' + score_criteria_fieldset).value = '';
          document.getElementById('rfp_score_criteria_desc_' + score_criteria_fieldset).value = '';

          let this_fieldset = document.querySelector('.score_criteria_' + (score_criteria_fieldset === 0 ? 1 : score_criteria_fieldset));

          if (this_fieldset != null && this_fieldset != undefined) {
            this_fieldset.classList.add('ccs-dynaform-hidden');
          }
        }

        for (var score_criteria_fieldset = 1; score_criteria_fieldset < 11; score_criteria_fieldset++) {
          if (score_criteria_fieldset == 1) {
            document.getElementById('rfp_score_criteria_name_' + 1).value = resetTierData[0] != undefined && resetTierData[0].name != undefined ? resetTierData[0].name : '';
            document.getElementById('rfp_score_criteria_point_' + 1).value = resetTierData[0] != undefined && resetTierData[0].point != undefined ? resetTierData[0].point : '';
            document.getElementById('rfp_score_criteria_desc_' + 1).value = resetTierData[0] != undefined && resetTierData[0].desc != undefined ? resetTierData[0].desc : '';
          } else {
            document.getElementById('rfp_score_criteria_name_' + score_criteria_fieldset).value = resetTierData[score_criteria_fieldset - 1] != undefined && resetTierData[score_criteria_fieldset - 1].name != undefined ? resetTierData[score_criteria_fieldset - 1].name : '';
            document.getElementById('rfp_score_criteria_point_' + score_criteria_fieldset).value = resetTierData[score_criteria_fieldset - 1] != undefined && resetTierData[score_criteria_fieldset - 1].point != undefined ? resetTierData[score_criteria_fieldset - 1].point : '';
            document.getElementById('rfp_score_criteria_desc_' + score_criteria_fieldset).value = resetTierData[score_criteria_fieldset - 1] != undefined && resetTierData[score_criteria_fieldset - 1].desc != undefined ? resetTierData[score_criteria_fieldset - 1].desc : '';
          }

          let this_fieldset = document.querySelector('.score_criteria_' + (score_criteria_fieldset === 0 ? 1 : score_criteria_fieldset)),
            name_box = document.getElementById('rfp_score_criteria_name_' + (score_criteria_fieldset === 0 ? 1 : score_criteria_fieldset));

          if (name_box.value !== '' && name_box.value !== undefined && name_box.value !== null) {
            this_fieldset.classList.remove('ccs-dynaform-hidden');
            if (score_criteria_fieldset === 10) {
              document.getElementById('ccs_rfp_score_criteria_add').classList.add('ccs-dynaform-hidden');
            }
            document.getElementById('tiersAdded').textContent = score_criteria_fieldset;
          } else if (score_criteria_fieldset !== 0) {
            if (this_fieldset != null && this_fieldset != undefined) {
              this_fieldset.classList.add('ccs-dynaform-hidden');
            }
            with_value_count = score_criteria_fieldset;
          }
          if (score_criteria_fieldset === 1) {
            if (this_fieldset != null && this_fieldset != undefined) {
              this_fieldset.classList.remove('ccs-dynaform-hidden');
            }
            with_value_count = 1;
          }
        }
        document.getElementById('ccs_rfp_score_criteria_add').classList.remove('ccs-dynaform-hidden');
        with_value_count--;
        if (totalAddedTierSoFar === 0) {
          document.getElementById('tiersAdded').textContent = 0;
        }
        if (totalAddedTierSoFar === 1) {
          document.getElementById('tiersAdded').textContent = 1;
        }
        if (totalAddedTierSoFar > 0) {
          document.getElementById('tiersAdded').textContent = totalAddedTierSoFar - 1;
        }
      });
    });
    points_for_this_level.forEach(element => {
      element.addEventListener("keydown", (event) => {
        if (event.key === '.' || event.keyCode === 69) { event.preventDefault(); }
      })
    })
    if (document.getElementsByClassName('score_criteria_fieldset').length > 0) {
      let fieldSets = document.getElementsByClassName('score_criteria_fieldset');
      let length = fieldSets.length;
      while (length--) {
        let id = length + 1;
        let eleName = fieldSets[length].querySelector('#rfp_score_criteria_name_' + id);
        eleName.addEventListener('focusout', event => {
          let ele1 = event.target;
          let elePointId = 'rfp_score_criteria_point_' + id;
          let eleDescId = 'rfp_score_criteria_desc_' + id;
          let ele2 = document.getElementById(elePointId);
          let ele3 = document.getElementById(eleDescId);
          //performSubmitAction(ele1, ele2, ele3);
        });
        let elePoint = fieldSets[length].querySelector('#rfp_score_criteria_point_' + id);
        elePoint.addEventListener('focusout', event => {
          let ele2 = event.target;
          let eleNameId = 'rfp_score_criteria_name_' + id;
          let eleDescId = 'rfp_score_criteria_desc_' + id;
          let ele1 = document.getElementById(eleNameId);
          let ele3 = document.getElementById(eleDescId);
          //performSubmitAction(ele1, ele2, ele3);
        });
        let eleDesc = fieldSets[length].querySelector('#rfp_score_criteria_desc_' + id);
        eleDesc.addEventListener('focusout', event => {
          let ele3 = event.target;
          let eleNameId = 'rfp_score_criteria_name_' + id;
          let elePointId = 'rfp_score_criteria_point_' + id;
          let ele1 = document.getElementById(eleNameId);
          let ele2 = document.getElementById(elePointId);
          //performSubmitAction(ele1, ele2, ele3);
        });
        var performSubmitAction = function (ele1, ele2, ele3) {
          if (ele1.value !== '' && ele2.value !== '' && ele3.value !== '') {
            let formElement = document.getElementById('ccs_rfp_scoring_criteria');
            let action = formElement.getAttribute('action');
            action = action + '&stop_page_navigate=true';
            $.ajax({
              type: 'POST',
              url: action,
              data: $('#ccs_rfp_scoring_criteria').serialize(),
              success: function () {
                //success message mybe...
              },
            });
          }
        };
        // break;
      }
    }
  }
  
  DelGCButtons = document.querySelectorAll('.DelGCButtons-popup');
  DelGCButtons.forEach(st => {
    st.addEventListener('click', e => {
      e.preventDefault();
      // deletePost(e.target.getAttribute('data-link'));
      urldel = e.target.getAttribute('data-link');
      //Gcloude
      const openpopGC = document.querySelector('.backdrop-gcloud_delete')
      openpopGC.classList.add('showpopup');
      $(".dialog-close-gcloud_delete").on('click', function(){
        openpopGC.classList.remove('showpopup');
      });
      $(".close-dialog-close").on('click', function(){
        openpopGC.classList.remove('showpopup');
      });
      deconf = document.getElementById('redirect-button-gcloud_delete');
      deconf.addEventListener('click', ev => {
        openpopGC.classList.remove('showpopup');
        window.location.href = window.location.origin+urldel;
      });
    });
  });

});



function preventNumberInput(e){
  var keyCode = (e.keyCode ? e.keyCode : e.which);
  if (keyCode > 47 && keyCode < 58 || keyCode > 95 && keyCode < 107 ){
      e.preventDefault();
  }
}


  // $('.maxValueValidate').keypress(function(e) {
  //     preventNumberInput(e);
  // });

// $(".maxValueValidate").keyup(function(e) {
//   let maxLen = parseInt($(this).val());
//   console.log("maxLen",maxLen);
// if(maxLen > 100){
//   $(this).val('')
// }else{
// }
// });

$(".maxValueValidate").keyup(function(e) {
  let maxLen = $(this).val();
  if(maxLen.length > 2 || parseInt($(this).val()) > 100 ){
    let inputVal = $(this).val();
    $(this).val(inputVal.slice(0,2));
  }
});









const checkFieldsRfpScore = () => {
  const start = 1;
  const end = 10;

  for (var a = start; a <= end; a++) {
    let inputName = $(`#rfp_score_criteria_name_${a}`);
    let inputPoint = $(`#rfp_score_criteria_point_${a}`);
    let textbox = $(`#rfp_score_criteria_desc_${a}`);

    if (inputName.val() !== '') {
      $(`#rfp_score_criteria_name_${a}-error`).remove();
      $(`score_criteria_${a} div`).removeClass('govuk-form-group--error');
      $(`score_criteria_${a} input`).removeClass('govuk-input--error');
    }
    if (inputPoint.val() !== '') {
      $(`#rfp_score_criteria_point_${a}-error`).remove();
      $(`score_criteria_${a} div`).removeClass('govuk-form-group--error');
      $(`score_criteria_${a} input`).removeClass('govuk-input--error');
    }
    if (textbox.val() !== '') {
      $(`#rfp_score_criteria_desc_${a}-error`).remove();
      $(`score_criteria_${a} div`).removeClass('govuk-form-group--error');
      $(`score_criteria_${a} textarea`).removeClass('govuk-textarea--error');
    }
  }
};
const removeErrorFieldsRfpScore = () => {
  $('.govuk-error-message').remove();
  $('.govuk-form-group--error').removeClass('govuk-form-group--error');
  $('.govuk-error-summary').remove();
  $('.govuk-input').removeClass('govuk-input--error');
  $('.govuk-form-group textarea').removeClass('govuk-textarea--error');
};

const emptyFieldCheckRfpScore = () => {
  let fieldCheck = '',
    errorStore = [];
    let agreement_id = document.getElementById('agreement_id');
        
  removeErrorFieldsRfpScore();
  for (var x = 1; x < 11; x++) {
    let name_field = document.getElementById('rfp_score_criteria_name_' + x);
    let point_field = document.getElementById('rfp_score_criteria_point_' + x);
    let desc_field = document.getElementById('rfp_score_criteria_desc_' + x);

    if (name_field != undefined && name_field != null && name_field.closest('fieldset').classList.value.indexOf('ccs-dynaform-hidden') === -1) {
      checkFieldsRfpScore();
      if (name_field.value.trim() === '' && point_field.value.trim() === '' && desc_field.value.trim() === '' && agreement_id.value.trim() != 'RM6187' ) {

        let focusField; 
        if (name_field.value.trim() === '') {
          focusField = name_field;
        }else if(point_field.value.trim() === '') {
          focusField = point_field;
        }else if (desc_field.value.trim() === '') {
          focusField = desc_field;
        }

        fieldCheck = [focusField.id, 'You must add information in all fields.'];
        ccsZaddErrorMessage(name_field, 'You must add information in all fields.');
        ccsZaddErrorMessage(point_field, 'Enter a valid number.');
        ccsZaddErrorMessage(desc_field, 'You must add information in all fields.');
        errorStore.push(fieldCheck);
      } 
      else if(agreement_id.value.trim() == 'RM6187' && name_field.value.trim() === '' && point_field.value.trim() === '' && desc_field.value.trim() === '') {
        fieldCheck = [point_field.id, 'You must add information in all fields.'];
        ccsZaddErrorMessage(name_field, 'You must enter the name for this level.');
        ccsZaddErrorMessage(point_field, 'You must enter the score for this level.');
        ccsZaddErrorMessage(desc_field, 'You must enter the description for this level.');
        errorStore.push(fieldCheck);
      }
      else if (agreement_id.value.trim() == 'RM1043.8' && point_field.value.trim() >= 100){
        let errorObj = {
          field: point_field,
          isError: false,
        };
        fieldCheck = [point_field.id, 'Enter valid score.'];
        ccsZaddErrorMessage(point_field, 'Enter valid score.');
        errorObj.isError = true;
        errorObj.field = point_field;
        if (errorObj.isError) {
          fieldCheck = [errorObj.field.id, 'Enter valid score.'];
          errorStore.push(fieldCheck);
        }
      }else {
        let errorObj = {
          field: name_field,
          isError: false
        };
        if (name_field.value.trim() === '' && agreement_id.value.trim() == 'RM6187') {
          ccsZaddErrorMessage(name_field, 'You must enter the name for this level.');
          errorObj.isError = true;
          errorObj.field = name_field;
        }
        if (point_field.value.trim() === '' && agreement_id.value.trim() == 'RM6187') {
          ccsZaddErrorMessage(point_field, 'You must enter the score for this level.');
          errorObj.isError = true;
          errorObj.field = point_field;
        }
        if (point_field.value.trim() < 0 && agreement_id.value.trim() == 'RM6187') {
          ccsZaddErrorMessage(point_field, 'Enter a valid score');
          errorObj.isError = true;
          errorObj.field = point_field;
        }
        if (desc_field.value.trim() === '' && agreement_id.value.trim() == 'RM6187') {
          ccsZaddErrorMessage(desc_field, 'You must enter the description for this level.');
          errorObj.isError = true;
          errorObj.field = desc_field;
        }

        if (name_field.value.trim() === '' && agreement_id.value.trim() != 'RM6187' ) {
          ccsZaddErrorMessage(name_field,'you must add name for this level.');
          errorObj.isError = true;
          errorObj.field = name_field;
        }
        if (point_field.value.trim() === '' && agreement_id.value.trim() != 'RM6187') {
          ccsZaddErrorMessage(point_field, 'Enter a valid number');
          errorObj.isError = true;
          errorObj.field = point_field;
        }
        
        if(agreement_id.value.trim() == 'RM1043.8' && (point_field.value.trim().length > 2 || point_field.value.trim() < 0 || point_field.value.trim() > 10 )){
            ccsZaddErrorMessage(point_field,'Enter valid score.');
            errorObj.isError = true;
            errorObj.field = point_field;
        }
        
        if (desc_field.value.trim() === '' && agreement_id.value.trim() != 'RM6187') {
          ccsZaddErrorMessage(desc_field,'you must add description for this level');
          errorObj.isError = true;
          errorObj.field = desc_field;
        }
        if(agreement_id.value.trim() == 'RM6187'){
          if (errorObj.isError) {
            fieldCheck = [errorObj.field.id, 'You must add information in all fields.'];
            errorStore.push(fieldCheck);
          }
        }
       if(agreement_id.value.trim() != 'RM6187'){
        let errMsg = '';
        if (name_field.value.trim() === '') {
          errorObj.field = name_field;
          errMsg = 'you must add name for this level.';
        }else if(point_field.value.trim() === '') {
          errorObj.field = point_field;
          errMsg = 'you must add score for this level';
        }else if(agreement_id.value.trim() == 'RM1043.8' && (point_field.value.trim().length > 2 || point_field.value.trim() < 0 || point_field.value.trim() > 10 )){
          errorObj.field = point_field;
          errMsg = 'Enter valid score.';
        }else if (desc_field.value.trim() === '') {
          errorObj.field = desc_field;
          errMsg = 'you must add description for this level';
        }

        if (errorObj.isError) {
          fieldCheck = [errorObj.field.id, errMsg == ''?'You must add information in all fields.':errMsg];
          errorStore.push(fieldCheck);
        }
       }
        
      }
    }
  }
  return errorStore;
};
const ccsZvalidateScoringCriteria = event => {
  event.preventDefault();
  errorStore = [];
  errorStore = emptyFieldCheckRfpScore();
  let tierVal = document.getElementById("tiersAdded").textContent;

  if (errorStore.length === 0 && tierVal.match(/(\d+)/)[0] >= 2) {
    document.forms['ccs_rfp_scoring_criteria'].submit();
  }
  else if (tierVal.match(/(\d+)/)[0] < 2) {
    errorStore.push(["There is a problem", 'You must add minmum 2 tiers.'])
    ccsZPresentErrorSummary(errorStore);
  }
  else if (tierVal.match(/(\d+)/)[0] > 10) {
    errorStore.push(["There is a problem", 'You must add maximum 10 tiers.'])
    ccsZPresentErrorSummary(errorStore);
  }
  else {
    ccsZPresentErrorSummary(errorStore);
  }
};


// user 


const checkFieldsRfpScore2 = () => {
  const start = 1;
  const end = 10;

  for (var a = start; a <= end; a++) {
    let inputName = $(`#rfp_term_service_group_${a}`);
    let textbox = $(`#rfp_term_more_details_${a}`);

    if (inputName.val() !== '') {
      $(`#rfp_term_service_group_${a}-error`).remove();
      $(`acronym_service_${a} div`).removeClass('govuk-form-group--error');
      $(`acronym_service_${a} input`).removeClass('govuk-input--error');
    }
    if (textbox.val() !== '') {
      $(`#rfp_term_more_details_${a}-error`).remove();
      $(`acronym_service_${a} div`).removeClass('govuk-form-group--error');
      $(`acronym_service_${a} textarea`).removeClass('govuk-textarea--error');
    }
  }
};

const removeErrorFieldsRfpScore2 = () => {
  $('.govuk-error-message').remove();
  $('.govuk-form-group--error').removeClass('govuk-form-group--error');
  $('.govuk-error-summary').remove();
  $('.govuk-input').removeClass('govuk-input--error');
  $('.govuk-form-group textarea').removeClass('govuk-textarea--error');
};

const emptyFieldCheckRfpScore2 = () => {
  let fieldCheck = '',
  fieldCheck1 = '',
    errorStore = [];
  removeErrorFieldsRfpScore2();
  var urlParams = new URLSearchParams(window.location.search);
  var agreement_id = urlParams.get("agreement_id");
  var group_id = urlParams.get("group_id");
  var criterion = urlParams.get("id"); 
  for (var x = 1; x < 11; x++) {
    let name_field = document.getElementById('rfp_term_service_group_' + x);
    let desc_field = document.getElementById('rfp_term_more_details_' + x);

    if (name_field != undefined && name_field != null && name_field.closest('fieldset').classList.value.indexOf('ccs-dynaform-hidden') === -1) {
      checkFieldsRfpScore2();
      if (name_field.value.trim() === '' && desc_field.value.trim() === '') {
        if(agreement_id == "RM1043.8" && group_id == "Group 9" && criterion == 'Criterion 3'){
        fieldCheck = [name_field.id, 'Enter a user type.'];
        ccsZaddErrorMessage(name_field, 'Enter a user type.');
        fieldCheck1 = [desc_field.id, 'Enter details about your users.'];
        ccsZaddErrorMessage(desc_field, 'Enter details about your users.');
        errorStore.push(fieldCheck);
        errorStore.push(fieldCheck1);
        }
        else{
        fieldCheck = [name_field.id, 'You must add information in all fields.'];
        ccsZaddErrorMessage(name_field, 'You must add information in all fields.');
        ccsZaddErrorMessage(desc_field, 'You must add information in all fields.');
        errorStore.push(fieldCheck);

        }
      } else {
        let errorObj = {
          field: name_field,
          isError: false,
        };
        if (name_field.value.trim() === '') {
          if(agreement_id == "RM1043.8" && group_id == "Group 9" && criterion == 'Criterion 3'){
            fieldCheck = [name_field.id, 'Enter a user type.'];
            ccsZaddErrorMessage(name_field, 'Enter a user type.');
           errorStore.push(fieldCheck);
          }
          else{
          ccsZaddErrorMessage(name_field, 'You must add information in all fields.');
          errorObj.isError = true;
          errorObj.field = name_field;
          }
                  }
        if (desc_field.value.trim() === '') {
          if(agreement_id == "RM1043.8" && group_id == "Group 9" && criterion == 'Criterion 3'){
             fieldCheck = [desc_field.id, 'Enter details about your users.'];
             ccsZaddErrorMessage(desc_field, 'Enter details about your users.');
            errorStore.push(fieldCheck);
           }
           else{
            ccsZaddErrorMessage(desc_field, 'You must add information in all fields.');
            errorObj.isError = true;
            errorObj.field = desc_field;
           }
          
        }
        if (errorObj.isError) {
          fieldCheck = [errorObj.field.id, 'You must add information in all fields.'];
          errorStore.push(fieldCheck);
        }
      }
    }
  }
  return errorStore;
};

const ccsZvalidateScoringCriteria2 = event => {
  event.preventDefault();
  errorStore = [];
  errorStore = emptyFieldCheckRfpScore2();

  if (errorStore.length === 0) {
    document.forms['service_user_type_form'].submit();
  }
  else {
    console.log('errorStore',errorStore)
    ccsZPresentErrorSummary(errorStore);
  }
};

const selectedTiers = (tiers) => {

}

const  deletePost = (url) => {
  var ask = window.confirm("Are you sure you want to delete this record?");
  if (ask) {
      window.location.href = window.location.origin+url;
  }
}