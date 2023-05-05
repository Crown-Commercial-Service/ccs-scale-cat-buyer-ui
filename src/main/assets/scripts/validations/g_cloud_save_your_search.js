$('input[type=radio]').click(function () {
  // to uncheck new and other names dynamically
  let clicked = this;
  $('input:radio').each(function () {
    if (clicked.value == 'new') {
      if ($(this).is(':checked') && this.value != 'new') {
        $("input[type='radio']").prop('checked', false);
      } else {
        $("input[type='radio']").prop('checked', true);
      }
      clicked.checked = true;
    } else {
      if ($(this).is(':checked') && this.value == 'new') {
        $("input[type='radio']").prop('checked', false);
        clicked.checked = true;
      }
    }
  });

  // to show and hide the new search name input filed while clicking new
  if (clicked.value == 'new' && clicked.checked == true) {
    $('#g_cloud_new_search_name').removeClass('govuk-!-display-none')
  } else {
    $('#g_cloud_new_search_name').addClass('govuk-!-display-none')
  }
});
// window back refresh radio button
if (document.querySelectorAll('#save-search').length==1) {
 $(document).ready(function () {
    setTimeout(function() { 
      $( "#remove_radio" ).trigger( "click" );
      $('#search_name').val('');
    }, 1000);
    $( "#remove_radio" ).on( "click", function() {
     $("input[type='radio']").prop('checked', false);
    });
});
}


// to hide the new search name input filed on load
document.addEventListener('DOMContentLoaded', () => {
  if(document.getElementById('g_cloud_new_search_name') !== null) {
    let newInputValue = document.getElementById('g_cloud_new_search_name').checked;
    if (newInputValue) {
      $('#g_cloud_new_search_name').removeClass('govuk-!-display-none')
    } else {
      $('#g_cloud_new_search_name').addClass('govuk-!-display-none')
    }
  }
});
