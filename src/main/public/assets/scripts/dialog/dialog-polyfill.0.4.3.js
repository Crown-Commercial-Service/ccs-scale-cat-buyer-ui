function deselect(e) {
  $('.pop').slideFadeToggle(function () {
    e.removeClass('selected');
  });
}

$(function() {
  var foundin = $('body:contains("Save and continue")');
  if (foundin.length < 1) {
    removeClass();
  }
});

function removeClass()
  {
   var allElements = document.querySelectorAll(".nav-popup");
   for(i=0; i<allElements.length; i++)
   { 
    allElements[i].classList.remove('nav-popup');
   }
  }


$(function () {
  $('.nav-popup').on('click', function () {
    if ($(this).hasClass('selected')) {
      deselect($(this));
      $(".backdrop").fadeOut(200);
    } else {
      $(".backdrop").fadeTo(200, 1);
      let btnSend = document.querySelector('#redirect-dutton');
      if (btnSend && this.className != "logo nav-popup" && this.className != "govuk-footer__link logo nav-popup") {
        btnSend.setAttribute('name', this.innerHTML);
      } else {
        btnSend.setAttribute('name', 'CCS website');
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      }
      // $(this).addClass('selected');
      $('.pop').slideFadeToggle();
    }
    return false;
  });

  $('.dialog-close').on('click', function () {
    $(".backdrop").fadeOut(200);
    deselect($('.dialog-close'));
    return false;
  });

  $('#redirect-dutton').on('click', function () {
    deselect($('.dialog-close'));
    $(".backdrop").fadeOut(200);
    var route = this.name;
    if (route == 'Home') {
      document.location.href="/";
    } else if (route == 'My Projects') {
      document.location.href="/dashboard";
    } else if (route == 'CCS website') {
      document.location.href="https://www.crowncommercial.gov.uk/";
    } else if (route == 'Guidance') {
      document.location.href="#";
    } else if (route == 'Get help') {
      document.location.href="https://www.crowncommercial.gov.uk/contact";
    } else {
      return false;
    }
    
  });

});

$.fn.slideFadeToggle = function (easing, callback) {
  return this.animate({ opacity: 'toggle', height: 'toggle' }, 'fast', easing, callback);
};