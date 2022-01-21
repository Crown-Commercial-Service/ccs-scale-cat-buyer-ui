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
            elementSelectorClicked = $("#rfi_clarification_date_expanded_"+selector);
        elementSelectorClicked.fadeIn();
        elementSelector.hide();
    })
    let errorSelector = $("#click-error");
    errorSelector.on('click', () => {
        let ClickedID = localStorage.getItem('dateItem');
        let elementSelectorClicked = $(ClickedID);
        if (elementSelector.selector === elementSelectorClicked.selector) {
            elementSelectorClicked = $("#rfi_clarification_date_expanded_" + selector);
            elementSelectorClicked.fadeIn();
            elementSelector.hide();
        } else {
            elementSelectorClicked.hide();
            elementSelector.fadeIn();
        }
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
        console.log('ClickedID.slice(1) ', ClickedID.slice(1))
        ccsZremoveErrorMessage(document.getElementById(ClickedID.slice(1)))
        const elementIDChange = $("#change_clarification_date_" + selector);
        elementIDChange.show();
    });
}

