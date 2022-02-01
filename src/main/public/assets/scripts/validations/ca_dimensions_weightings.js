document.addEventListener('DOMContentLoaded', () => {
if($('#ccs_ca_weighting').length > 0 )
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
    errorStore = [], errMsg = "";
 dimensions.each(function(){
     var element = document.getElementById($(this).attr('id'));
     ccsZremoveErrorMessage(element)
    if($(this).val() === '' )
        errMsg = "Entry box must contain a value"     
     else if (isNaN($(this).val()))
      errMsg = "Dimension value entered must be an integer"
     else if (Number($(this).val()) < $(this).attr('min') || Number($(this).val()) > $(this).attr('max'))
        errMsg = "Dimension value entered is outside the permitted range"
    if(errMsg !== "")
    {        
        ccsZaddErrorMessage(element, errMsg);
        fieldCheck =[$(this).attr('id'),errMsg]
        errorStore.push(fieldCheck);
    }
 });
 if (errorStore.length === 0) document.forms["ccs_ca_weighting"].submit();
  else ccsZPresentErrorSummary(errorStore);
}
