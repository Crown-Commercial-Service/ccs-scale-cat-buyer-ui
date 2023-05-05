const ccsZvalidateAward = (event) => {
    event.preventDefault();
    errorStore = [];
    const preAwardSupplierConfm = document.getElementById('pre_award_supplier_confirmation')

    if (preAwardSupplierConfm != undefined && !preAwardSupplierConfm.checked) {
        let fieldCheck;
         let agreementId =  document.getElementById('agreementId')
         if(agreementId != null && agreementId.value && agreementId.value == 'RM1043.8'){
          fieldCheck = ccsZisOptionChecked("pre_award_supplier_confirmation", "Confirm that you have received the signed contract");
        }else{
          fieldCheck = ccsZisOptionChecked("pre_award_supplier_confirmation", "Acknowledgement check box must be selected to continue with the awarding of the selected supplier.");
        }
        if (fieldCheck !== true) errorStore.push(fieldCheck);
        ccsZPresentErrorSummary(errorStore);
    }
    else {
      const openpopsupplier = document.querySelector('.backdrop-award')
        openpopsupplier.classList.add('showpopup');
        $(".dialog-close-award").on('click', function(){
          openpopsupplier.classList.remove('showpopup');
          ccsZremoveErrorMessage(preAwardSupplierConfm);
        });
        stnewsupplier = document.getElementById('btn_pre_award_supplier');
        stnewsupplier.addEventListener('click', ev => {
          if (errorStore.length === 0) document.forms["ccs_pre_award_supplier_form"].submit();
          else ccsZPresentErrorSummary(errorStore);
          openpopsupplier.classList.remove('showpopup');
        })
    

    }
};

const removeErrorFieldssdsd = () => {
  $('.govuk-error-message').remove();
  $('.govuk-form-group--error').removeClass('govuk-form-group--error')
  $('.govuk-error-summary').remove();
  $(".govuk-input").removeClass("govuk-input--error");
  $('.govuk-form-group textarea').removeClass('govuk-textarea--error');

}

document.addEventListener('DOMContentLoaded', () => {
  $('#award_supplier_confirmation').on('change', function (event) {
    const checkboxIscheked = document.getElementById("award_supplier_confirmation").checked;
    if (checkboxIscheked) {
      removeErrorFieldssdsd();
    }
  });
});

const ccsZvalidateStandStillPeriod = (event) => {
    event.preventDefault();

    const radioButtonYes = document.getElementById("standstill_period_yes").checked;
    const radioButtonNo = document.getElementById("standstill_period_no").checked;
    if (radioButtonYes || radioButtonNo) {
        document.forms["ccs_standstill_period_form"].submit();
    }
    else {
        errorStore = ['There is a problem', 'Please select an option']
        ccsZPresentErrorSummary([errorStore]);
    }
};

document.addEventListener('DOMContentLoaded', () => {
  $('.btn_event_managment_award').on('click', function (event) {
    console.log("!!!")
    event.preventDefault();
    const checkboxIscheked = document.getElementById("award_supplier_confirmation").checked;
    if (checkboxIscheked) {
        if ($(this).hasClass('selected')) {
            deselect($(this));
            $(".backdrop-vetting").fadeOut(200);
          } else {
            $(".backdrop-vetting").fadeTo(200, 1);
            let btnSend = document.querySelector('#redirect-button-vetting');
            if (btnSend && this.className != "logo rfp_vetting-popup" && this.className != "govuk-footer__link logo rfp_vetting-popup") {
              btnSend.setAttribute('name', 'Continue');
              $('#redirect-button-vetting').text('Continue')
            } else {
              //btnSend.setAttribute('name', 'CCS website');
              document.body.scrollTop = document.documentElement.scrollTop = 0;
            }
            // $(this).addClass('selected');
            $('.pop').slideFadeToggle();
          }
    }
    else {
      ccsZisOptionChecked("award_supplier_confirmation", "Please confirm that you are ready to award this contract.");
      errorStore = ['award_supplier_confirmation', 'Confirmation checkbox must be checked before progressing']
      ccsZPresentErrorSummary([errorStore]);
      document.getElementById("error-summary-title").innerText = "There has been an error awarding your FC";
    }
    return false;
  });
  
  $(".popupbutton").on('click', function(){ 
    ccsZvalidateAward();  
  });
  
  $('.event_managment_award').on('click', function (event) {
        event.preventDefault();
        const radioButtonYes = document.getElementById("standstill_period_yes").checked;
        const radioButtonNo = document.getElementById("standstill_period_no").checked;
        if (radioButtonYes || radioButtonNo) {
            if ($(this).hasClass('selected')) {
                deselect($(this));
                $(".backdrop-vetting").fadeOut(200);
              } else {
                $(".backdrop-vetting").fadeTo(200, 1);
                let btnSend = document.querySelector('#redirect-button-vetting');
                if (btnSend && this.className != "logo rfp_vetting-popup" && this.className != "govuk-footer__link logo rfp_vetting-popup") {
                  btnSend.setAttribute('name', 'Continue');
                  $('#redirect-button-vetting').text('Continue')
                } else {
                  btnSend.setAttribute('name', 'CCS website');
                  document.body.scrollTop = document.documentElement.scrollTop = 0;
                }
                // $(this).addClass('selected');
                $('.pop').slideFadeToggle();
              }
        }
        else {
            errorStore = ['There is a problem', 'Select if you want a standstill period']
            ccsZPresentErrorSummary([errorStore]);
        }
        return false;
      });
  
      $('.dialog-close-vetting').on('click', function () {
        $(".backdrop-vetting").fadeOut(200);
        deselect($('.dialog-close-vetting'));
        $('.pop').slideFadeToggle();
        return false;
      });
      $('.dialog-close-nav-menu').on('click', function () {
        $(".backdrop-nav-menu").fadeOut(200);
        deselect($('.dialog-close-nav-menu'));
        return false;
      });

      $('#redirect-button-vetting').on('click', function () {
        $('.rfp_cap').attr('checked', false);
        deselect($('.dialog-close-vetting'));
        $(".backdrop-vetting").fadeOut(200);
        var route = this.name;
        if (route == 'Continue') {
            document.forms["ccs_standstill_period_form"].submit();
        } else {
          return false;
        }
      });

})