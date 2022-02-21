document.addEventListener('DOMContentLoaded', () => {
if($('#ccs_ca_weighting').length > 0 || $('#ccs_daa_weighting').length > 0 )
{
var total = 0;
var dimensions = $(".dimensions");
updateTotal(dimensions);
dimensions.on("blur",()=>{
  updateTotal(dimensions);
});
}
});

const updateTotal = (dimensions) =>{
   let total = 0;  
    dimensions.each(function(){
        total = total+Number($(this).val());
    });
    $("#totalPercentage").text(total);
}

const ccsZvalidateCAWeightings = (event) => {
    event.preventDefault();
    var dimensions = $(".dimensions")
    let fieldCheck = "",
    errorStore = [], total = 0;
 dimensions.each(function(){
     var element = document.getElementById($(this).attr('id'));
     ccsZremoveErrorMessage(element)
     let  errMsg = "";
    if(element.value === '' )
        errMsg = "Entry box must contain a value"     
     else if (isNaN($(this).val()))
      errMsg = "Dimension value entered must be an integer"
     else if ((Number(element.value) < Number($(this).attr('min')) && Number($(this).attr('min')) !== 0) || (Number(element.value) > Number($(this).attr('max')) && Number($(this).attr('max')) !==0))
        errMsg = "Dimension value entered is outside the permitted range"
    else
        total +=Number(element.value);
    if(errMsg !== "")
    {        
        ccsZaddErrorMessage(element, errMsg);
        fieldCheck =[$(this).attr('id'),errMsg]
        errorStore.push(fieldCheck);
    }    
 });
 if(total !== 100){        
        fieldCheck =["totalPercentage","Dimension value entered does not total to 100%"]
        errorStore.push(fieldCheck);
    }
 if (errorStore.length === 0) document.forms["ccs_ca_weighting"].submit();
  else ccsZPresentErrorSummary(errorStore);
}


const ccsZvalidateDAAWeightings = (event) => {
    event.preventDefault();
    var dimensions = $(".dimensions")
    let fieldCheck = "",
    errorStore = [], total = 0;
 dimensions.each(function(){
     var element = document.getElementById($(this).attr('id'));
     ccsZremoveErrorMessage(element)
     let  errMsg = "";
    if(element.value === '' )
        errMsg = "Entry box must contain a value"     
     else if (isNaN($(this).val()))
      errMsg = "Dimension value entered must be an integer"
     else if ((Number(element.value) < Number($(this).attr('min')) && Number($(this).attr('min')) !== 0) || (Number(element.value) > Number($(this).attr('max')) && Number($(this).attr('max')) !==0))
        errMsg = "Dimension value entered is outside the permitted range"
    else
        total +=Number(element.value);
    if(errMsg !== "")
    {        
        ccsZaddErrorMessage(element, errMsg);
        fieldCheck =[$(this).attr('id'),errMsg]
        errorStore.push(fieldCheck);
    }    
 });
 if(total !== 100){        
        fieldCheck =["totalPercentage","Dimension value entered does not total to 100%"]
        errorStore.push(fieldCheck);
    }
 if (errorStore.length === 0) document.forms["ccs_daa_weighting"].submit();
  else ccsZPresentErrorSummary(errorStore);
}
