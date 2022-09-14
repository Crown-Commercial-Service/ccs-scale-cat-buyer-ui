function deselect(e) {
  $('.pop').slideFadeToggle(function () {
    e.removeClass('selected');
  });
}

$(function () {
  var foundinsave = $('body:contains("Save and continue")');
  var foundin = $('body:contains("Confirm Scores")');
  if (foundin.length < 1 && foundinsave.length < 1) {
    removeClass();
  }
});


function removeClass() {
  var allElements = document.querySelectorAll(".nav-popup");
  for (i = 0; i < allElements.length; i++) {
    allElements[i].classList.remove('nav-popup');
  }
}

$(function () {
  $('.close-event').on('click', function () {
    var option = document.querySelector('input[name="event_management_next_step"]:checked').value;
    if (option == 'close') {
      if ($(this).hasClass('selected')) {
        deselect($(this));
        $(".backdrop-close").fadeOut(200);
      } else {
        $(".backdrop-close").fadeTo(200, 1);
        let btnSend = document.querySelector('#redirect-dutton');
        if (btnSend && this.className != "logo nav-popup" && this.className != "govuk-footer__link logo nav-popup") {
          btnSend.setAttribute('name', this.innerHTML);
        } else {
          btnSend.setAttribute('name', 'CCS website');
          document.body.scrollTop = document.documentElement.scrollTop = 0;
        }
        $('.pop').slideFadeToggle();
      }
      return false;
    } else {
      return true;
    }
  });

  $('.close-dialog-close').on('click', function () {
    $(".backdrop-close").fadeOut(200);
    deselect($('.close-dialog-close'));
    return false;
  });

  $('#redirect-dutton').on('click', function () {
    deselect($('.close-dialog-close'));
    $(".backdrop-close").fadeOut(200);
    document.location.href = "/dashboard";
  });

});

$.fn.slideFadeToggle = function (easing, callback) {
  return this.animate({ opacity: 'toggle', height: 'toggle' }, 'fast', easing, callback);
};