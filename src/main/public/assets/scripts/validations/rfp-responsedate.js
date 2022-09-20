const rfp_totalElementSelectors = Array.from(Array(11+1).keys()).slice(1);


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
        localStorage.removeItem('dateItem');
        localStorage.setItem('dateItem', elementSelector.selector);
        let ClickedID = "#rfp_clarification_date_expanded_" + selector;
        let elementSelectorClicked = $(ClickedID);
        if (elementSelectorClicked.length === 0)
            elementSelectorClicked = $("#rfp_clarification_date_expanded_" + selector);
        elementSelectorClicked.fadeIn();
        elementSelector.hide();
    });
    let errorSelector = $("#click-error");

    
    errorSelector.on('click', () => {
        let storedClickedID = localStorage.getItem('dateItem');
        let cleanedClickedID = storedClickedID.slice(1);
        let elementSelectorClicked = $(storedClickedID);
        if (elementSelector.selector === elementSelectorClicked.selector) {
            elementSelectorClicked = $("#rfp_clarification_date_expanded_" + selector);
            elementSelectorClicked.fadeIn();
            elementSelector.hide();
        } else {
            elementSelectorClicked.hide();
            elementSelector.fadeIn();
        }
        ccsZaddErrorMessage(document.getElementById(cleanedClickedID), 'You can not set a date and time that is earlier than the previous milestone in the timeline');
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
        $("div.govuk-error-summary").remove()
        ccsZremoveErrorMessage(document.getElementById(ClickedID.slice(1)))
        const elementIDChange = $("#change_clarification_date_" + selector);
        elementIDChange.show();
    });
}

$('#form_rfp_response_date').on('submit', (event) => {
    event.preventDefault();
    let errorHeading=document.getElementById("error-summary-title");
    if(errorHeading==undefined)
    {
        document.forms["form_rfp_response_date"].submit();
    }
});

