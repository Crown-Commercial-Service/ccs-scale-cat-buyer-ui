const ccsZvalidateEoiIncumbent = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  fieldCheck = ccsZisOptionChecked( "ccs_eoi_incumbent", "Indicate if there is an incumbent supplier");
  if (fieldCheck !== true) {
    errorStore.push(fieldCheck);

  } else {
    ccsZremoveErrorMessage("ccs_eoi_incumbent");
  }

  if ($("input[type='radio'][name='ccs_eoi_incumbent']:checked").val() === "Yes" && document.getElementById("incumbent_supplier").value.trim().length === 0) {
    errorStore.push(["incumbent_supplier", "Provide the name of the incumbent supplier"])
    ccsZaddErrorMessage(document.getElementById("incumbent_supplier"), "Provide the name of the incumbent supplier");
  } else {
    ccsZremoveErrorMessage("incumbent_supplier");
  }

  if (errorStore.length === 0) document.forms["ccs_eoi_incumbent_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};


document.addEventListener('DOMContentLoaded', () => {

  if (document.getElementById("ccs_eoi_incumbent_form") !== null) {

    if (document.getElementById("ccs_eoi_incumbent-2").checked ||
      (!document.getElementById("ccs_eoi_incumbent-2").checked &&
        !document.getElementById("ccs_eoi_incumbent").checked)) {
      document.getElementById("incumbent_supplier").classList.add('ccs-dynaform-hidden');
      document.querySelector('label[for="incumbent_supplier"]').classList.add('ccs-dynaform-hidden');
    } else {
      let theParentNode = document.getElementById("incumbent_supplier").parentNode;
      theParentNode.classList.add('yes');
      document.getElementById("incumbent_supplier").classList.add('yeswho');
      document.querySelector('label[for="incumbent_supplier"]').classList.add('yeswho');
    }

    document.querySelectorAll('input[name="ccs_eoi_incumbent"]').forEach((elem) => {
      elem.addEventListener("change", function(event) {
        let itemval = event.target.value;


        if (itemval === "Yes" && event.target.checked) {
          document.getElementById("incumbent_supplier").classList.remove('ccs-dynaform-hidden');
          document.querySelector('label[for="incumbent_supplier"]').classList.remove('ccs-dynaform-hidden');

          event.target.parentNode.classList.add('yes');
          document.getElementById("incumbent_supplier").parentNode.classList.add('yeswho');

        } else if (itemval === "No" && event.target.checked){
          document.getElementById("incumbent_supplier").classList.add('ccs-dynaform-hidden');
          document.querySelector('label[for="incumbent_supplier"]').classList.add('ccs-dynaform-hidden');

          document.getElementById("ccs_eoi_incumbent").parentNode.classList.remove('yes');
          document.getElementById("incumbent_supplier").parentNode.classList.remove('yeswho');

          if (document.getElementById("incumbent_supplier-error") !== null) document.getElementById("incumbent_supplier-error").classList.add('ccs-dynaform-hidden');
        }


      });
    });
  }
});
