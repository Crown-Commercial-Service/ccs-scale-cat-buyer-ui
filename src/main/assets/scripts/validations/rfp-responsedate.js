const rfp_totalElementSelectors = Array.from(Array(13+1).keys()).slice(1);


for(const selector of rfp_totalElementSelectors){

    let elementID = "#rfp_clarification_date_expanded_"+selector;    
    let elementSelector = $(elementID);
    if(elementSelector.length === 0)
        elementSelector = $("#rfp_clarification_date_expanded_"+selector); 
    elementSelector.fadeOut();
}


for(const selector of rfp_totalElementSelectors){
    let elementID = "#change_clarification_date_"+selector;
    let elementCancelID = "#rfp_cancel_change_clarification_date_"+selector;
    let elementSelector = $(elementID); 
    let elementSelectorCancel = $(elementCancelID); 
    elementSelector.fadeIn(); 
    elementSelectorCancel.fadeIn(); 
    elementSelector.on('click', () => {
        let element = document.getElementById(`ccs_rfp_response_date_form_${selector}`);
        element.reset();
        localStorage.removeItem('dateItem');
        localStorage.setItem('dateItem', elementID);
        let ClickedID = "#rfp_clarification_date_expanded_" + selector;
        let elementSelectorClicked = $(ClickedID);
        if (elementSelectorClicked.length === 0)
            elementSelectorClicked = $("#rfp_clarification_date_expanded_" + selector);
        if($('.hideFirst:visible').length){
                $('.hideFirst').hide();
                $('.change').show(); 
        }
        elementSelectorClicked.fadeIn();
        elementSelector.hide();
        saveButtonHideDateRFP();
        
    });
    
}


let rfperrorSelector = $("#click-error");
rfperrorSelector.on('click', () => {
    let ClickedID = $("#click-error").attr("href");
    let errorText = $("#click-error").text();
    errorSelectorId = ClickedID;
    let elementSelectorClicked = $(ClickedID);
    elementSelectorClicked.fadeIn();
    ccsZaddErrorMessage(document.getElementById(ClickedID.slice(1)), errorText);
});


for(const selector of rfp_totalElementSelectors){
    let elementID = "#rfp_cancel_change_clarification_date_"+selector;
    let elementSelector = $(elementID);
    elementSelector.on('click', () => {

        $(`#clarification_date-day_${selector}`).val("");
        $(`#clarification_date-month_${selector}`).val("");
        $(`#clarification_date-year_${selector}`).val("");
        $(`#clarification_date-hour_${selector}`).val("");
        $(`#clarification_date-minute_${selector}`).val("");
        
        let ClickedID = "#rfp_clarification_date_expanded_" + selector;
        let elementSelectorClicked = $(ClickedID);
        if (elementSelectorClicked.length === 0) {
            ClickedID = "#rfp_clarification_date_expanded_" + selector;
            elementSelectorClicked = $(ClickedID);
        }
        elementSelectorClicked.fadeOut();
        ccsZremoveErrorMessage(document.getElementById(ClickedID.slice(1)))
        const elementIDChange = $("#change_clarification_date_" + selector);
        elementIDChange.show();
        saveButtonUnHideDateRFP();
    });
}

const saveButtonHideDateRFP = () => {
    document.getElementById("hideMeWhileDateChange").disabled = true;
}

const saveButtonUnHideDateRFP = () => {
    document.getElementById("hideMeWhileDateChange").disabled = false;
}
