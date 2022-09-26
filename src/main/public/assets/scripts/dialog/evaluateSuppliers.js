const showEvaluateSuppliersPopup = (event) => {
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
          $("#evaluate_suppliers").attr("aria-label","Alert You are about to complete your evaluation.Click Continue, or click Return to further edit your scores.");
          // $(".backdrop-evaluatesuppliers").position("relative");
          document.getElementById("evaluatesupplierspopup").style.paddingTop="1000";
          setTimeout(()=>{
            document.getElementsByClassName('dialog-close-evaluatesuppliers')[1].focus();
            },200);
          
          
          $("#return-dialog-evaluatesuppliers").blur(function(event){
            document.getElementsByClassName('dialog-close-evaluatesuppliers')[1].focus();
          });  
        
          $("#dialog-close-evaluatesupplier").blur(function(){
            document.getElementById("dialog-close-evaluatesupplier").tabIndex = "1";
            document.getElementById("redirect-button-evaluatesuppliers").tabIndex = "2";
            document.getElementById("return-dialog-evaluatesuppliers").tabIndex = "3";     
          });   

         
          
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

$('.dialog-close-evaluatesuppliers').on('click', function () {
  $(".backdrop-evaluatesuppliers").fadeOut(200);
  $('#evaluate_suppliers').attr('aria-label','confirm scores'); 
  $('#evaluate_suppliers').attr('role','button');      
  setTimeout(()=>{
    document.getElementById('evaluate_suppliers').focus();
  },300)
  deselect($('.dialog-close-evaluatesuppliers'));
  return false;
});

$('#redirect-button-evaluatesuppliers').on('click', function () {
  deselect($('.dialog-close-evaluatesuppliers'));
  $(".backdrop-evaluatesuppliers").fadeOut(200);
  document.location.href="/evaluate-confirm"//scat-5013
    return false;
  
});


$.fn.slideFadeToggle = function (easing, callback) {
  return this.animate({ opacity: 'toggle', height: 'toggle' }, 'fast', easing, callback);
};