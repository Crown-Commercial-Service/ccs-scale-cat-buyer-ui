document.addEventListener('DOMContentLoaded', () => {

  if ($('#ccs_ca_weighting').length > 0 || $('#ccs_daa_weighting').length > 0) {
    var dimensions = $(".dimensionweightings");
    updateTotal(dimensions);
    dimensions.on("blur", () => {
      updateTotal(dimensions);
    });
  }
});

const updateTotal = dimensions => {
  
  let total = 0;
  dimensions.each(function () {
    var element = document.getElementById($(this).attr('id'));
    var min=Number(element.min);
    var max=Number(element.max);
    if (!isNaN($(this).val()) && Number($(this).val())>=min && Number($(this).val())<=max && !$(this).val().includes('.')) total = total + Number($(this).val());
  });
  $('#totalPercentage').text(total);
};

const ccsZvalidateCAWeightings = event => {
  event.preventDefault();
  var dimensionweightings = $(".dimensionweightings")
  let fieldCheck = "",errorStore = [], total = 0;emptycontent=[];
  dimensionweightings.each(function () {
    var element = document.getElementById($(this).attr('id'));
    var min=element.min
    var max=element.max
    var number=Number(element.value)
    ccsZremoveErrorMessage(element)
    let errMsg = "";   
    if (isNaN($(this).val())&&number != '')
    {
      errMsg = "Dimension value entered must be an integer"
      emptycontent.push("false")
    }
    else if(element.value.includes('.')&& number != '')
    {
      errMsg = "Dimension value entered must not contain decimal values"
      emptycontent.push("false")
    }
    else if(number>100 && number != '')
    {
      errMsg = "Dimension value entered must be <100"
      emptycontent.push("false")
    } 
    else if(number<=0 && number != '')
    {
      errMsg = "Dimension value entered must be >0"
      emptycontent.push("false")
    } 
    else if(number < min || number > max) 
    {
      errMsg = "Dimension value is not in the range."
      emptycontent.push("false")
    } 
     else if (number != '')
      { 
        total += Number(number);
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
      fieldCheck = ["","Entry box must contain a value"]
      errorStore.push(fieldCheck);   
  }
  else if (total !== 100) {
    fieldCheck = ["totalPercentage", "Your total weighting must add up to 100%"]
    errorStore.push(fieldCheck);
  }
  if (errorStore.length === 0) document.forms["ccs_ca_weighting"].submit();
  else ccsZPresentErrorSummary(errorStore);
};

const ccsZvalidateDAAWeightings = event => {
  event.preventDefault();
  var dimensionweightings = $(".dimensionweightings")
  let fieldCheck = "",errorStore = [], total = 0;emptycontent=[];
  dimensionweightings.each(function () {
    var element = document.getElementById($(this).attr('id'));
    
    var min=element.min
    var max=element.max
    var number=Number(element.value)
    ccsZremoveErrorMessage(element)
    let errMsg = "";   
    if (isNaN($(this).val())&&number != '')
    {
      errMsg = "Enter whole numbers only"
      emptycontent.push("false")
    }
    else if(element.value.includes('.')&& number != '')
    {
      errMsg = "Dimension value entered must not contain decimal values"
      emptycontent.push("false")
    }
    else if(number>100 && number != '')
    {
      errMsg = "Dimension value entered must be <100"
      emptycontent.push("false")
    } 
    else if(number<=0 && number != '')
    {
      errMsg = "Dimension value entered must be >0"
      emptycontent.push("false")
    } 
    else if(number < min || number > max) 
    {
      errMsg = "Enter whole numbers within the specified range only "
      emptycontent.push("false")
    } 
     else if (number != '')
      { 
        total += Number(number);
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
      fieldCheck = ["","Entry box must contain a value"]
      errorStore.push(fieldCheck);   
  }
  else if (total !== 100) {
    fieldCheck = ["totalPercentage", "Your total weighting must add up to 100%"]
    errorStore.push(fieldCheck);
  }
  if (errorStore.length === 0) document.forms["ccs_daa_weighting"].submit();
  else ccsZPresentErrorSummary(errorStore);
};

