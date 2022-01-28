const ccsZvalidateCASupplier = (event) => {
  event.preventDefault();
         let fieldCheck = "",
    errorStore = [];
    const val = $("#ca-supplier-count").val();
     if (val.length === 0 || val <3 || val > 49) {
    fieldCheck = ccsZvalidateWithRegex("ca-supplier-count", "Enter a valid value", null);
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  }
  
   if (errorStore.length === 0) document.forms["ccs_ca_suppliers_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};