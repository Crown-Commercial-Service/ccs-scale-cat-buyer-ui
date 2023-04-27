document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('eoi_publish_confirmation') !== null) { 
    publishConfirmation('eoi_publish_confirmation', 'eoi_btn_publish_now')
  }
  
  if (document.getElementById('rfp_publish_confirmation') !== null) { 
    publishConfirmation('rfp_publish_confirmation', 'rfp_btn_publish_now')
  }
  
  if (document.getElementById('rfi_publish_confirmation') !== null) { 
    publishConfirmation('rfi_publish_confirmation', 'rfi_btn_publish_now')
  }
});

function publishConfirmation (publishConfirmationId, publishBtn){
  publishBtnDisable(publishBtn);
  const checker = document.getElementById(publishConfirmationId);
  checker.addEventListener('change', event => {
    if (event.target.checked) {
      publishBtnEnable(publishBtn);
    } else {
      publishBtnDisable(publishBtn);
    }
  });
}

function publishBtnDisable(btnId){
  document.getElementById(btnId).classList.add('govuk-button--disabled');
  document.getElementById(btnId).setAttribute('disabled', true);
  document.getElementById(btnId).setAttribute('aria-disabled', true);
}

function publishBtnEnable(btnId){
  document.getElementById(btnId).classList.remove('govuk-button--disabled');
  document.getElementById(btnId).removeAttribute('disabled');
  document.getElementById(btnId).removeAttribute('aria-disabled');
}