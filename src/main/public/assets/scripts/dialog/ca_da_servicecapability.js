document.addEventListener('DOMContentLoaded', () => {
  let inputs;
  let index;
  let resources = [];
  let weightingStaff = [];
  let weightingVetting = [];

  inputs = $("#ccs_ca_menu_tabs_form .weight")


  function deselect(e) {
    $('.pop').slideFadeToggle(function () {
      e.removeClass('selected');
    });
  }

  /*     $(function () {
        var foundin = $('body:contains("Save and continue")');
        if (foundin.length < 1) {
          removeClass();
        }
      }); */

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

    $('.ca_da_service_cap').on('click', function () {
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
      $('.rfp_cap').attr('checked', false);
      deselect($('.dialog-close-vetting'));
      $(".backdrop-vetting").fadeOut(200);
      var route = this.name;
      if (route == 'Clear form') {
        $('#service_capability_error_summary').addClass('hide-block');

      var servCapWhole=document.getElementsByClassName("weight_vetting_whole_t")
      if (servCapWhole != null && servCapWhole.length > 0) {
        for(index=0;index<servCapWhole.length;index++)
        {
        
          servCapWhole[index].innerText =''
        }
      }

      var servCapWholeInput=document.getElementsByClassName("weight_vetting_whole")
      if (servCapWholeInput != null && servCapWholeInput.length > 0) {
        for(index=0;index<servCapWholeInput.length;index++)
        {
          servCapWholeInput[index].classList.remove('govuk-input--error')
          
        }
      }

      var servCapPart=document.getElementsByClassName("weight_vetting_partial_t")
      if (servCapPart != null && servCapPart.length > 0) {
        for(index=0;index<servCapPart.length;index++)
        {
          
          servCapPart[index].innerText =''
        }
      }


      var servCapPartInput=document.getElementsByClassName("weight_vetting_partial")
      if (servCapPartInput != null && servCapPartInput.length > 0) {
        for(index=0;index<servCapPartInput.length;index++)
        {
          servCapPartInput[index].classList.remove('govuk-input--error')
          
        }
      }

        clearServiceCapabilitiesSubText();
        for (index = 0; index < inputs.length; ++index) {
          inputs[index].value = '';
        }
      } else {
        return false;
      }
    });
  });


  function clearServiceCapabilitiesSubText() {

    var tabLinks = '';
    var totalWeighting = '';
    var daServiceCapaTabLinks = document.querySelectorAll('.da-service-capabilities');
    var caServiceCapaTabLinks = document.querySelectorAll('.ca-service-capabilities');

    if (daServiceCapaTabLinks !== null && daServiceCapaTabLinks.length > 0)
    {
      tabLinks = daServiceCapaTabLinks;
      totalWeighting = $('#da_total_weighting');
    }
    else if(caServiceCapaTabLinks !==null && caServiceCapaTabLinks.length > 0)
    {
      tabLinks = caServiceCapaTabLinks;
      totalWeighting = $('#ca_total_weighting');
    }
    totalWeighting.text('0 of 100% total weighting for service capabilities');

    for (let index = 0; index < tabLinks.length; index++) {
      document.getElementsByClassName('table-item-subtext')[index].innerHTML = '[ 0 % ]';
    }

  }

  $.fn.slideFadeToggle = function (easing, callback) {
    return this.animate({ opacity: 'toggle', height: 'toggle' }, 'fast', easing, callback);
  };


});