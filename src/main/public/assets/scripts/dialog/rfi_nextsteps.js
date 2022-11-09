const showPopup = (event) => {
    debugger;
    event.preventDefault();
    //const inputId=event.srcElement.id;
    const element = document.getElementById("rfi_next_steps-2");
    if(element.checked){
        if ($(this).hasClass('selected')) {
            deselect($(this));
            $(".backdrop-nextsteps").fadeOut(200);
            // $(".backdrop-nextsteps").position("relative");
            document.getElementById("nextstepspopup").style.paddingTop="1000";
          } else {
            $(".backdrop-nextsteps").fadeTo(200, 1);
            // $(".backdrop-nextsteps").position("relative");
            document.getElementById("nextstepspopup").style.paddingTop="1000";
            let btnSend = document.querySelector('#redirect-button-nextsteps');
            if (btnSend && this.className != "logo rfp_vetting-popup" && this.className != "govuk-footer__link logo rfp_vetting-popup") {
              btnSend.setAttribute('name', 'Next Step');
              document.body.scrollTop = document.documentElement.scrollTop = 0;
            } else {
              btnSend.setAttribute('name', 'CCS website');
              //document.body.scrollTop = document.documentElement.scrollTop = 0;
            }
            $(this).addClass('selected');
            $('.pop').slideFadeToggle();
          }
    }
    else
    {
        document.forms['ccs_rfi_next_steps'].submit();
    }
    // if(element.)
    //const arr=inputId.split("rfi_question_");
    // if(element.value.length<500)
    // {
    //   for(var i=1;i<=10;i++)
    //   {
    //     document.getElementById("rfi_label_question_"+i).innerText="";
    //   }
    //   let labelElement=document.getElementById("rfi_label_question_"+arr[1]);
    //   let count=500-element.value.length;
    //   labelElement.innerText=count + " remaining of 500";
      //labelElement.classList.remove('ccs-dynaform-hidden')
    // }
    // else
    // {
  
    // }
  };


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

  $('.dialog-close-nextsteps').on('click', function () {
    $(".backdrop-nextsteps").fadeOut(200);
    deselect($('.dialog-close-nextsteps'));
    return false;
  });

  $('#redirect-button-nextsteps').on('click', function () {
    deselect($('.dialog-close-nextsteps'));
    $(".backdrop-nextsteps").fadeOut(200);
    document.location.href="../rfi/closerfi"//scat-5013
      return false;
    
  });

  $.fn.slideFadeToggle = function (easing, callback) {
    return this.animate({ opacity: 'toggle', height: 'toggle' }, 'fast', easing, callback);
  };