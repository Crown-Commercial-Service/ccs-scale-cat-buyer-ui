const ccsZCreateMessageSubmit = (event) => {
    event.preventDefault();

    let btn=document.getElementById('btnCreateMessage')
    if(btn!=null && btn!=undefined){
        btn.disabled=true;
    document.forms["ccs_message_create_form"].submit();
    }
    
  };


  $('#createMsgCancel').on('click', function () {
    if ($(this).hasClass('selected')) {
        deselect($(this));
        $(".backdrop-createmsgcancel").fadeOut(200);
        document.getElementById("createmsgcancelpopup").style.paddingTop="1000";
      } else {
        $(".backdrop-createmsgcancel").fadeTo(200, 1);
        document.getElementById("createmsgcancelpopup").style.paddingTop="1000";
        let btnSend = document.querySelector('#redirect-button-createmsgcancel');
        if (btnSend && this.className != "logo rfp_vetting-popup" && this.className != "govuk-footer__link logo rfp_vetting-popup") {
          btnSend.setAttribute('name', 'Cancel Message');
          document.body.scrollTop = document.documentElement.scrollTop = 0;
        } else {
          btnSend.setAttribute('name', 'CCS website');
          //document.body.scrollTop = document.documentElement.scrollTop = 0;
        }
        $(this).addClass('selected');
        $('.pop').slideFadeToggle();
      }
  });

  function deselect(e) {
    $('.pop').slideFadeToggle(function () {
      e.removeClass('selected');
    });
  }

  $(function () {
    var foundin = $('body:contains("Save and continue")');
    if (foundin.length < 1) {
      removeClass();
    }
  });

  function removeClass() {
    var allElements = document.querySelectorAll(".nav-popup");
    for (i = 0; i < allElements.length; i++) {
      allElements[i].classList.remove('nav-popup');
    }
  }

  $('.dialog-close-createmsgcancel').on('click', function () {
    $(".backdrop-createmsgcancel").fadeOut(200);
    deselect($('.dialog-close-createmsgcancel'));
    return false;
  });

  $('#redirect-button-createmsgcancel').on('click', function () {
    deselect($('.dialog-close-createmsgcancel'));
    $(".backdrop-createmsgcancel").fadeOut(200);
    document.location.href="/return/eventmanagement"
      return false;
    
  });

  $.fn.slideFadeToggle = function (easing, callback) {
    return this.animate({ opacity: 'toggle', height: 'toggle' }, 'fast', easing, callback);
  };