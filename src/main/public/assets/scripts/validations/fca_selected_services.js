/**
 * Validate for Selected Services.
 * */
 const ccsFcaSelectedServices = (event) => {
  event.preventDefault();
  let fieldCheck ='';
  let errorStore = [];
    let itemForm = document.getElementById('fca_select_services_form'); 
    let checkBoxes = itemForm.querySelectorAll('input[type="checkbox"]'); 
    let checkError = true;
      checkBoxes.forEach(item => { 
          if (item.checked) {  
            checkError = false;
          }
      });
      if (checkError) {
          fieldCheck = [itemForm.id, 'Minimum one service you have to pick'];
          errorStore.push(fieldCheck);
          ccsZPresentErrorSummary(errorStore);
      }
      else {
        document.forms["fca_select_services_form"].submit();
      }

 };


