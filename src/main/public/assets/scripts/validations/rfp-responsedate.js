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
    let errorSelector = $("#click-error");
    let noChanges = $('#rfp_cancel_change_clarification_date_'+ selector);
    

    noChanges.click(function() {
        $( ".govuk-error-message" ).hide();
        $( ".govuk-error-summary" ).hide();
        elementClicked = $("#showDateDiv" + selector);
        elementClicked.removeClass('govuk-form-group--error')
        
        

    });

    errorSelector.on('click', () => {
        
        let storedClickedID = localStorage.getItem('dateItem');
        let cleanedClickedID = storedClickedID.slice(1);
        let elementSelectorClicked = $(storedClickedID);
        let hasError = $("#showDateDiv"+ selector).hasClass("govuk-form-group--error");
        if (elementSelector.selector === elementSelectorClicked.selector && hasError ) {
            elementSelectorClicked = $("#rfp_clarification_date_expanded_" + selector);
            elementSelectorClicked.fadeIn();
            elementSelector.hide();
           
        } else {
            elementSelectorClicked.hide();
            elementSelector.fadeIn();
        }
        let agreementID;
        if(document.getElementById("agreementID")) agreementID = document.getElementById("agreementID").value;
        if(agreementID != 'RM1043.8'  && agreementID != 'RM1557.13') {
        ccsZaddErrorMessage(document.getElementById(cleanedClickedID), 'You can not set a date and time that is earlier than the previous milestone in the timeline');
        }
    });
}




for(const selector of rfp_totalElementSelectors){
    let elementID = "#rfp_cancel_change_clarification_date_"+selector;
    let elementSelector = $(elementID);
    elementSelector.on('click', () => {
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
