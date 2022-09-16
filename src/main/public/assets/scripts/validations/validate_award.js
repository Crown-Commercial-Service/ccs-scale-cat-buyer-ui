const ccsZvalidateAward = (event) => {
    event.preventDefault();
    errorStore = [];
    const preAwardSupplierConfm = document.getElementById('pre_award_supplier_confirmation')

    if (preAwardSupplierConfm != undefined && !preAwardSupplierConfm.checked) {
        const fieldCheck = ccsZisOptionChecked("pre_award_supplier_confirmation", "Acknowledgement tick box must be selected to continue with the awarding of the selected supplier.");
        if (fieldCheck !== true) errorStore.push(fieldCheck);
        ccsZPresentErrorSummary(errorStore);
    }
    else {
        if (errorStore.length === 0) document.forms["ccs_pre_award_supplier_form"].submit();
        else ccsZPresentErrorSummary(errorStore);
    }
};

const ccsZvalidateConfirmAward = (event) => {
  event.preventDefault();
  errorStore = [];
  const preAwardSupplierConfm = document.getElementById('award_supplier_confirmation')

  if (preAwardSupplierConfm != undefined && !preAwardSupplierConfm.checked) {
      const fieldCheck = ccsZisOptionChecked("award_supplier_confirmation", "You must check this box to confirm that I have read and confirm the statements above.");
      if (fieldCheck !== true) errorStore.push(fieldCheck);
      ccsZPresentErrorSummary(errorStore);
  }
  else {
      if (errorStore.length === 0) document.forms["ccs_award_supplier_form"].submit();
      else ccsZPresentErrorSummary(errorStore);
  }
};

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

  $('#standstill_period_radios').removeClass('govuk-form-group--error');
  $('#standstill_period_yes').on('click', function (){
    $('#standstill_period_yes').prop('checked',true);
    $('#standstill_period_no').prop('checked', false);
  });

  $('#standstill_period_no').on('click', function (){
    $('#standstill_period_no').prop('checked',true);
    $('#standstill_period_yes').prop('checked',false);
  });
  
  if ($("#enter_evaluation_score_readOnly") !=undefined && $("#enter_evaluation_score_readOnly") !=null && $("#enter_evaluation_score_readOnly").length >0 ) {
    document.getElementById("enter_evaluation_score_readOnly").readOnly = "true";
    document.getElementById("enter_evaluation_feedback_readOnly").readOnly = "true";
  }
    $('.event_managment_award').on('click', function (event) {
        event.preventDefault();
        const radioButtonYes = document.getElementById("standstill_period_yes").checked;
        const radioButtonNo = document.getElementById("standstill_period_no").checked;
        $(".standstill-error-field").html('');
        if (radioButtonYes || radioButtonNo) {
            if ($(this).hasClass('selected')) {
                deselect($(this));
                $(".backdrop-vetting").fadeOut(200);
              } else {
                $(".backdrop-vetting").fadeTo(200, 1);
                let btnSend = document.querySelector('#redirect-button-vetting');
                $(this).attr("aria-label","Alert on dialog box, Please confirm your wish to award this supplier.");
                $(this).attr("role","button");

                setTimeout(()=>{
                  document.getElementById('redirect-button-vetting').focus();
                },1000)

                $('.dialog-close-vetting').attr("aria-label","Close dialog");
                $('.dialog-close-vetting').attr("role","button");

                if (btnSend && this.className != "logo rfp_vetting-popup" && this.className != "govuk-footer__link logo rfp_vetting-popup") {
                  btnSend.setAttribute('name', 'Continue');
                  btnSend.setAttribute('aria-label', 'Continue');
                  btnSend.setAttribute('role', 'button');                  
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
           $('#standstill_period_radios').addClass('govuk-form-group--error');
           errorStore = ['standstill_period_yes', 'Please select an option'];
            $(".standstill-error-field").html('<p class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Please select an option</p>');
            ccsZPresentErrorSummary([errorStore]);
        }
        return false;
      });
  
      $('.dialog-close-vetting').on('click', function () {
        $(".backdrop-vetting").fadeOut(200);
        deselect($('.dialog-close-vetting'));
        return false;
      });
/*       $('.dialog-close-nav-menu').on('click', function () {
        $(".backdrop-nav-menu").fadeOut(200);
        deselect($('.dialog-close-nav-menu'));
        return false;
      }); */

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