const ccsZvalidateAward = (event) => {
    event.preventDefault();
    errorStore = [];
    const preAwardSupplierConfm = document.getElementById('pre_award_supplier_confirmation')
    if (!preAwardSupplierConfm.checked) {
        const fieldCheck = ccsZisOptionChecked("pre_award_supplier_confirmation", "Acknowledgement tick box must be selected to continue with the awarding of the selected supplier.");
        if (fieldCheck !== true) errorStore.push(fieldCheck);
        ccsZPresentErrorSummary(errorStore);
    }
    else {
        if (errorStore.length === 0) document.forms["ccs_pre_award_supplier_form"].submit();
        else ccsZPresentErrorSummary(errorStore);
    }
};
