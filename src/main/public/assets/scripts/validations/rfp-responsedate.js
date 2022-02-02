const rfp_totalElementSelectors = Array.from(Array(5+1).keys()).slice(1);


for(const selector of rfp_totalElementSelectors){

    let elementID = "#rfp_clarification_date_expanded_"+selector;    
    let elementSelector = $(elementID);
    if(elementSelector.length === 0)
        elementSelector = $("#rfp_clarification_date_expanded_"+selector); 
    elementSelector.fadeOut();
}


for(const selector of rfp_totalElementSelectors){
    let elementID = "#change_clarification_date_"+selector;
    let elementSelector = $(elementID);   
    elementSelector.on('click', (event) => {
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
        ccsZaddErrorMessage(document.getElementById(cleanedClickedID), 'this milestone needs to be set after the previous milestone date');
    });
}




for(const selector of rfp_totalElementSelectors){
    let elementID = "#rfp_cancel_change_clarification_date_"+selector;
    let elementSelector = $(elementID);

    elementSelector.on('click', ()=> {
        $('#rfp_clarification_date_expanded_'+selector).fadeOut();
        $('#change_clarification_date_'+selector).fadeIn();
    })
}

