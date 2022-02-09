const eoi_totalElementSelectors = Array.from(Array(5+1).keys()).slice(1);


for(const selector of eoi_totalElementSelectors){

    let elementID = "#eoi_clarification_date_expanded_"+selector;    
    let elementSelector = $(elementID);
    if(elementSelector.length === 0)
        elementSelector = $("#eoi_clarification_date_expanded_"+selector); 
    elementSelector.fadeOut();
}


for(const selector of eoi_totalElementSelectors){
    let elementID = "#change_clarification_date_"+selector;
    let elementSelector = $(elementID);   
    elementSelector.on('click', (event) => {
        localStorage.removeItem('dateItem');
        localStorage.setItem('dateItem', elementSelector.selector);
        let ClickedID = "#eoi_clarification_date_expanded_" + selector;
        let elementSelectorClicked = $(ClickedID);
        if (elementSelectorClicked.length === 0)
            elementSelectorClicked = $("#eoi_clarification_date_expanded_" + selector);
        elementSelectorClicked.fadeIn();
        elementSelector.hide();
    });
    let errorSelector = $("#click-error");

    
    errorSelector.on('click', () => {
        let storedClickedID = localStorage.getItem('dateItem');
        let cleanedClickedID = storedClickedID.slice(1);
        let elementSelectorClicked = $(storedClickedID);
        if (elementSelector.selector === elementSelectorClicked.selector) {
            elementSelectorClicked = $("#eoi_clarification_date_expanded_" + selector);
            elementSelectorClicked.fadeIn();
            elementSelector.hide();
        } else {
            elementSelectorClicked.hide();
            elementSelector.fadeIn();
        }
        ccsZaddErrorMessage(document.getElementById(cleanedClickedID), 'You can not set a date and time that is earlier than the previous milestone in the timeline');
    });
}




for(const selector of eoi_totalElementSelectors){
    let elementID = "#cancel_change_clarification_date_"+selector;
    let elementSelector = $(elementID);
    elementSelector.on('click', () => {

        let ClickedID = "#eoi_clarification_date_expanded_" + selector;
        let elementSelectorClicked = $(ClickedID);
        if (elementSelectorClicked.length === 0) {
            ClickedID = "#eoi_clarification_date_expanded_" + selector;
            elementSelectorClicked = $(ClickedID);
        }
       // elementSelectorClicked.fadeOut();
        console.log('ClickedID.slice(1) ', ClickedID.slice(1))
        ccsZremoveErrorMessage(document.getElementById(ClickedID.slice(1)))
        const elementIDChange = $("#change_clarification_date_" + selector);
        //elementIDChange.show();
    });
}

