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
            errorStore = ['There is a problem', 'Please select an option']
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