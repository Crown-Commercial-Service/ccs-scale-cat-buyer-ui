const showEvaluateSuppliersPopup = (event) => {
    debugger;
    event.preventDefault();
    //const inputId=event.srcElement.id;
    // const element = document.getElementById("evaluate_suppliers");
    // if(element.checked){
        if ($(this).hasClass('selected')) {
            deselect($(this));
            $(".backdrop-evaluatesuppliers").fadeOut(200);
            // $(".backdrop-evaluatesuppliers").position("relative");
            document.getElementById("evaluatesupplierspopup").style.paddingTop="1000";
          } else {
            $(".backdrop-evaluatesuppliers").fadeTo(200, 1);
            // $(".backdrop-evaluatesuppliers").position("relative");
            document.getElementById("evaluatesupplierspopup").style.paddingTop="1000";
            let btnSend = document.querySelector('#redirect-button-evaluatesuppliers');
            if (btnSend && this.className != "logo rfp_vetting-popup" && this.className != "govuk-footer__link logo rfp_vetting-popup") {
              btnSend.setAttribute('name', 'Evaluate Suppliers');
              document.body.scrollTop = document.documentElement.scrollTop = 0;
            } else {
              btnSend.setAttribute('name', 'CCS website');
              //document.body.scrollTop = document.documentElement.scrollTop = 0;
            }
            $(this).addClass('selected');
            $('.pop').slideFadeToggle();
          }
    // }
    // else
    // {
    //     document.forms['ccs_evaluate_suppliers'].submit();
    // }
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


  const supplierMsgCancelPopup = (event) => {
    console.log("CANCEL")
    
    event.preventDefault();
    //const inputId=event.srcElement.id;
    // const element = document.getElementById("evaluate_suppliers");
    // if(element.checked){
        if ($(this).hasClass('selected')) {
            deselect($(this));
            $(".backdrop-evaluatesuppliers").fadeOut(200);
            // $(".backdrop-evaluatesuppliers").position("relative");
            document.getElementById("suplierevaluatesupplierspopup").style.paddingTop="1000";
          } else {
            $(".backdrop-evaluatesuppliers").fadeTo(200, 1);
            // $(".backdrop-evaluatesuppliers").position("relative");
           // document.getElementById("suplierevaluatesupplierspopup").style.paddingTop="1000";
            let btnSend = document.querySelector('#supplierredirect-button-evaluatesuppliers');
            if (btnSend && this.className != "logo rfp_vetting-popup" && this.className != "govuk-footer__link logo rfp_vetting-popup") {
              btnSend.setAttribute('name', 'Evaluate Suppliers');
              document.body.scrollTop = document.documentElement.scrollTop = 0;
            } else {
             // btnSend.setAttribute('name', 'CCS website');
              //document.body.scrollTop = document.documentElement.scrollTop = 0;
            }
            $(this).addClass('selected');
            // $('.pop').slideFadeToggle();
          }
    // }
    // else
    // {
    //     document.forms['ccs_evaluate_suppliers'].submit();
    // }
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
    var foundin = $('body:contains("Confirm Scores")');
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

  $('.dialog-close-evaluatesuppliers').on('click', function () {
    $(".backdrop-evaluatesuppliers").fadeOut(200);
    // deselect($('.dialog-close-evaluatesuppliers'));
    return false;
  });

  $('#redirect-button-evaluatesuppliers').on('click', function () {
    deselect($('.dialog-close-evaluatesuppliers'));
    $(".backdrop-evaluatesuppliers").fadeOut(200);
    var bodytg = document.body;
    bodytg.classList.add("pageblur");
    document.location.href="/evaluate-confirm"//scat-5013
      return false;
    
  });

  $('#supplierredirect-button-evaluatesuppliers').on('click', function () {
    deselect($('.dialog-close-evaluatesuppliers'));
    $(".backdrop-evaluatesuppliers").fadeOut(200);
    document.location.href="/message/inbox"//scat-6153
      return false;
    
  });
  

  $.fn.slideFadeToggle = function (easing, callback) {
    return this.animate({ opacity: 'toggle', height: 'toggle' }, 'fast', easing, callback);
  };

  /**
   * A popup will appear if the buyer selects a low-scoring supplier.
   * @param {String} suppliername 
   * @param {String} redirectUrl 
   */
  const showSuppliersAwardPopup = (suppliername, redirectUrl) => {
    // Create H2 element
    var elGo = document.querySelector(".backdrop-confirmLowScoreSupplierPopup").querySelector(".nodeDialogTitle");
    let h2Ele = document.createElement('h2');
    h2Ele.textContent = suppliername;
    elGo.after(h2Ele);

    const openpopGC = document.querySelector('.backdrop-confirmLowScoreSupplierPopup')
    openpopGC.classList.add('showpopup');

    $(".dialog-close-confirmLowScoreSupplierPopup").on('click', function(){
      openpopGC.classList.remove('showpopup');
    });
    $(".close-dialog-close").on('click', function(){
      openpopGC.classList.remove('showpopup');
    });
    deconf = document.getElementById('redirect-button-confirmLowScoreSupplierPopup');
    deconf.addEventListener('click', ev => {
      openpopGC.classList.remove('showpopup');
      document.location.href = redirectUrl;
    });

    // if ($(this).hasClass('selected')) {
    //     deselect($(this));
    //     $(".backdrop-evaluatesuppliers").fadeOut(200);
    //     document.getElementById("suppliersAwardPopup").style.paddingTop="1000";
    // } else {
    //     $(".backdrop-evaluatesuppliers").fadeTo(200, 1);
    //     document.getElementById("suppliersAwardPopup").style.paddingTop="1000";
    //     document.getElementById("suppliersName").innerHTML = suppliername;
    //     $('#redirect-button-confirmsuppliers').attr("href", redirectUrl);
    //     $(this).addClass('selected');
    //     $('.pop').slideFadeToggle();
    // }
  };
