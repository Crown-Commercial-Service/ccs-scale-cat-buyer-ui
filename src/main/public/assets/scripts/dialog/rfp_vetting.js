document.addEventListener('DOMContentLoaded', () => {
  let inputs;
  let index;
  let resources = [];
  let weightingStaff = [];
  let weightingVetting = [];

  inputs = $("#ccs_ca_menu_tabs_form_rfp_vetting .weight_vetting_class")
  if (document.querySelectorAll('.ons-list__item') !== null) ccsTabMenuNaviation();

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


  $(function () {
    $('.nav-popup').on('click', function () {
      if ($(this).hasClass('selected')) {
        deselect($(this));
        $(".backdrop-nav-menu").fadeOut(200);
      } else {
        $(".backdrop-nav-menu").fadeTo(200, 1);
        let btnSend = document.querySelector('#redirect-button-nav-menu');
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

    $('.rfp_vetting-popup').on('click', function () {
      if ($(this).hasClass('selected')) {
        deselect($(this));
        $(".backdrop-vetting").fadeOut(200);
      } else {
        $(".backdrop-vetting").fadeTo(200, 1);
        let btnSend = document.querySelector('#redirect-button-vetting');
        if (btnSend && this.className != "logo rfp_vetting-popup" && this.className != "govuk-footer__link logo rfp_vetting-popup") {
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

    $('.dialog-close-vetting').on('click', function () {
      $(".backdrop-vetting").fadeOut(200);
      deselect($('.dialog-close-vetting'));
      return false;
    });
    $('.dialog-close-nav-menu').on('click', function () {
      $(".backdrop-nav-menu").fadeOut(200);
      deselect($('.dialog-close-nav-menu'));
      return false;
    });

    $('#redirect-button-nav-menu').on('click', function () {
      deselect($('.dialog-close-nav-menu'));
      $(".backdrop-nav-menu").fadeOut(200);
      var route = this.name;
      if (route == 'Home') {
        document.location.href = "/";
      } else if (route == 'My Projects') {
        document.location.href = "/dashboard";
      } else if (route == 'CCS website') {
        document.location.href = "https://www.crowncommercial.gov.uk/";
      } else if (route == 'Guidance') {
        document.location.href = "#";
      } else if (route == 'Get help') {
        document.location.href = "https://www.crowncommercial.gov.uk/contact";
      } else {
        return false;
      }
      $(".backdrop-nav-menu").fadeOut(200);
    });

    $('#redirect-button-vetting').on('click', function () {
      deselect($('.dialog-close-vetting'));
      $(".backdrop-vetting").fadeOut(200);
      var route = this.name;
      if (route == 'Clear form') {
        for (index = 0; index < inputs.length; ++index) {
          inputs[index].value = '';
        }
        let liItems=document.getElementsByClassName("ons-list__item");//sections
        for(let j=0;j<liItems.length;j++){
        liItems[j].getElementsByClassName("table-item-subtext")[0].innerHTML="0 resources added";
      }
      document.getElementsByClassName("govuk-!-display-inline")[0].textContent=0;
      document.getElementsByClassName("govuk-!-display-inline")[1].textContent=0;
      } else {
        return false;
      }
    });
  });


  $.fn.slideFadeToggle = function (easing, callback) {
    return this.animate({ opacity: 'toggle', height: 'toggle' }, 'fast', easing, callback);
  };


});