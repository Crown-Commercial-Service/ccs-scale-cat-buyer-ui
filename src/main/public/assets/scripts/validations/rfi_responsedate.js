const totalElementSelectors = Array.from(Array(5+1).keys()).slice(1);


for(const selector of totalElementSelectors){

    let elementID = "#rfi_clarification_date_expanded_"+selector;    
    let elementSelector = $(elementID);
    if(elementSelector.length === 0)
        elementSelector = $("#rfi_clarification_date_expanded_"+selector); 
    elementSelector.fadeOut();
}


for(const selector of totalElementSelectors){
    let elementID = "#change_clarification_date_"+selector;
    let elementSelector = $(elementID);    
    elementSelector.on('click', ()=> {
        localStorage.removeItem('dateItem');
        localStorage.setItem('dateItem', elementSelector.selector);
        let ClickedID = "#rfi_clarification_date_expanded_"+selector;
        let elementSelectorClicked = $(ClickedID);
        if(elementSelectorClicked.length === 0)
            elementSelectorClicked = $("#rf_clarification_date_expanded_"+selector);
        elementSelectorClicked.fadeIn();
        elementSelector.hide();
    })
    let errorSelector = $("#click-error");
    errorSelector.on('click', () => {
        let storedClickedID = localStorage.getItem('dateItem');
        let cleanedClickedID = storedClickedID.slice(1);
        let elementSelectorClicked = $(storedClickedID);
        if (elementSelector.selector === elementSelectorClicked.selector) {
            elementSelectorClicked = $("#rfi_clarification_date_expanded_" + selector);
            elementSelectorClicked.fadeIn();
            elementSelector.hide();
        } else {
            elementSelectorClicked.hide();
            elementSelector.fadeIn();
        }
        ccsZaddErrorMessage(document.getElementById(cleanedClickedID), 'this milestone needs to be set after the previous milestone date');
    });
}



for(const selector of totalElementSelectors){
    let elementID = "#cancel_change_clarification_date_"+selector;
    let elementSelector = $(elementID);
    elementSelector.on('click', () => {

        let ClickedID = "#rfi_clarification_date_expanded_" + selector;
        let elementSelectorClicked = $(ClickedID);
        if (elementSelectorClicked.length === 0) {
            ClickedID = "#rfi_clarification_date_expanded_" + selector;
            elementSelectorClicked = $(ClickedID);
        }
        elementSelectorClicked.fadeOut();
        ccsZremoveErrorMessage(document.getElementById(ClickedID.slice(1)))
        const elementIDChange = $("#change_clarification_date_" + selector);
        elementIDChange.show();
    });
}

