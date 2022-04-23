document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('eoi_publish_confirmation') !== null) {
    const checker = document.getElementById('eoi_publish_confirmation');
    checker.addEventListener('change', event => {
      if (event.target.checked) {
        document.getElementById('eoi_btn_publish_now').classList.remove('govuk-button--disabled');
        document.getElementById('eoi_btn_publish_now').removeAttribute('disabled');
        document.getElementById('eoi_btn_publish_now').removeAttribute('aria-disabled');
      } else {
        document.getElementById('eoi_btn_publish_now').classList.add('govuk-button--disabled');
        document.getElementById('eoi_btn_publish_now').setAttribute('disabled', true);
        document.getElementById('eoi_btn_publish_now').setAttribute('aria-disabled', true);
      }
    });
  }
});
