
document.addEventListener('DOMContentLoaded', () => {  
  const formPercentage = $('#rfp_percentage_form');
  if ( formPercentage !== undefined && formPercentage.length > 0 ){
        let elements = document.querySelectorAll("[name='percentage']");
        let totalPercentageEvent = () => {
          let percentage = 0
          elements.forEach((el) =>{
           percentage += isNaN(el.value)?0:Number(el.value);
          });
          $("#totalPercentage").text(percentage);
        };

        elements.forEach((ele)=>{
          ele.addEventListener('focusout',totalPercentageEvent)
        });
        totalPercentageEvent();
  }
});

    const checkPercentagesCond = () => {
      let fieldCheck = "",
        errorStore = [];
        if(Number($("#totalPercentage").text()) > 100)
        {
          for (let k = 1; k < 3; k++){
            fieldCheck = ccsZvalidateWithRegex("Question "+k, "The total weighting cannot exceed 100%", /\w+/,false);
            if (fieldCheck !== true) errorStore.push(fieldCheck); 
          }
        }
      return errorStore;
    };

    const ccsZvalidateRfpPercentages = (event) =>{
      event.preventDefault();
      const errorStore = checkPercentagesCond();
      if (errorStore.length === 0) {
        document.forms["rfp_percentage_form"].submit();
      }
      else {
        ccsZPresentErrorSummary(errorStore);
      }
    };
