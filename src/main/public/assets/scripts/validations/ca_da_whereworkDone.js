document.addEventListener('DOMContentLoaded', () => {

  if ($('#ca_where_work_done').length > 0 || $('#da_where_work_done').length > 0) {
    var total = 0;
    var dimensions = $(".dimensions");
    updateLocationTotal(dimensions);
    dimensions.on("blur", () => {
      updateLocationTotal(dimensions);
    });
  }
//POP-UP START//
  $('.ca_whereworkdone_popup').on('click', function () {
    
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
      $(this).addClass('selected');
       $('.pop').slideFadeToggle();
    }
    return false;
  });

  $('.da_whereworkdone_popup').on('click', function () {
    
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
      $(this).addClass('selected');
       $('.pop').slideFadeToggle();
    }
    return false;
  });

  function deselect(e) {
    
    $('.pop').slideFadeToggle(function () {
      e.removeClass('selected');
    });
  }

  function removeClass() {
    
    var allElements = document.querySelectorAll(".nav-popup");
    for (i = 0; i < allElements.length; i++) {
      allElements[i].classList.remove('nav-popup');
    }
  }

  $('.dialog-close-vetting').on('click', function () {
    
    $(".backdrop-vetting").fadeOut(200);
    deselect($('.dialog-close-vetting'));
    return false;
  });

  $('#redirect-button-vetting').on('click', function () {
    
    deselect($('.dialog-close-vetting'));
    $(".backdrop-vetting").fadeOut(200);
    var route = this.name;
    if (route == 'Clear form') {
      clearAllTextboxes();
    } else {
      return false;
    }
  });

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
      $('.pop').slideFadeToggle();
    }
    return false;
  });

  $('.dialog-close-nav-menu').on('click', function () {
    
    $(".backdrop-nav-menu").fadeOut(200);
    deselect($('.dialog-close-nav-menu'));
    return false;
  });
});


function clearAllTextboxes()
{
  
  var dimensions = $(".dimensions");
  for(var a =0; a < dimensions.length; a++){
    dimensions[a].value = ''  
  }
  $('#totalPercentage').text('');
}

$.fn.slideFadeToggle = function (easing, callback) {
  
  return this.animate({ opacity: 'toggle', height: 'toggle' }, 'fast', easing, callback);
};
//POP-UP END//

const updateLocationTotal = dimensions => {
  let total = 0;
  dimensions.each(function () {
    
    if (!isNaN($(this).val()) && $(this).val()>0) total = total + Number($(this).val());
  });
  $('#totalPercentage').text(total);
};


const ccsZvalidateDAWhereWorkDone = event => {
  event.preventDefault();
  var dimensions = $(".dimensions")
  let fieldCheck = "",
    errorStore = [], total = 0;
    emptycontent=[];
  dimensions.each(function () {
    var element = document.getElementById($(this).attr('id'));
    ccsZremoveErrorMessage(element)
    let errMsg = "";   
    if (isNaN($(this).val())&&element.value != '')
    {
      errMsg = "location weighting value must be an integer"
      emptycontent.push("false")
    }
    else if(element.value.includes('.')&& element.value != '')
    {
      errMsg = "location weighting value must not contain decimal values"
      emptycontent.push("false")
    }
    else if(element.value>100 && element.value != '')
    {
      errMsg = "location weighting value must be <=100"
      emptycontent.push("false")
    } 
    else if(element.value<=0 && element.value != '')
    {
      errMsg = "location weighting value must be >0"
      emptycontent.push("false")
    } 
     else if (element.value != '')
      { 
        total += Number(element.value);
        emptycontent.push("true")
      }     
    if (errMsg !== "") {
      ccsZaddErrorMessage(element, errMsg);
      fieldCheck = [$(this).attr('id'), errMsg]
      errorStore.push(fieldCheck);
    }
  });
  if( !emptycontent.length > 0)
  {
      fieldCheck = ["","At least one location must be selected"]
      errorStore.push(fieldCheck);   
  }
  else if (total !== 100) {
    fieldCheck = ["totalPercentage", "Sum of the weighting values across all locations = 100%"]
    errorStore.push(fieldCheck);
  }
  if (errorStore.length === 0) document.forms["da_where_work_done"].submit();
  else ccsZPresentErrorSummary(errorStore);
};


const ccsZvalidateCAWhereWorkDone = (event) => {
  event.preventDefault();
  var dimensions = $(".dimensions")
  let fieldCheck = "",
    errorStore = [], total = 0;
    emptycontent=[];
  dimensions.each(function () {
    var element = document.getElementById($(this).attr('id'));
    ccsZremoveErrorMessage(element)
    let errMsg = "";   
    if (isNaN($(this).val())&&element.value != '')
    {
      errMsg = "location weighting value must be an integer"
      emptycontent.push("false")
    }
    else if(element.value.includes('.')&& element.value != '')
    {
      errMsg = "location weighting value must not contain decimal values"
      emptycontent.push("false")
    }
    else if(element.value>100 && element.value != '')
    {
      errMsg = "location weighting value must be <= 100%"
      emptycontent.push("false")
    } 
    else if(element.value<=0 && element.value != '')
    {
      errMsg = "location weighting value must be >0"
      emptycontent.push("false")
    } 
     else if (element.value != '')
      { 
        total += Number(element.value);
        emptycontent.push("true")
      }     
    if (errMsg !== "") {
      ccsZaddErrorMessage(element, errMsg);
      fieldCheck = [$(this).attr('id'), errMsg]
      errorStore.push(fieldCheck);
    }
  });
  if( !emptycontent.length > 0)
  {
      fieldCheck = ["","At least one location must be selected"]
      errorStore.push(fieldCheck);   
  }
  else if (total !== 100) {
    fieldCheck = ["totalPercentage", "Sum of the weighting values across all locations = 100%"]
    errorStore.push(fieldCheck);
  }
  if (errorStore.length === 0) document.forms["ca_where_work_done"].submit();
  else ccsZPresentErrorSummary(errorStore);



};
