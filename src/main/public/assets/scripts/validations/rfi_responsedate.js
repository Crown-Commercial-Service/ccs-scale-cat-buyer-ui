const totalElementSelectors = Array.from(Array(5+1).keys()).slice(1);


for(const selector of totalElementSelectors){

    let elementID = "#rfi_clarification_date_expanded_"+selector;    
    let elementSelector = $(elementID);
    if(elementSelector.length === 0)
        elementSelector = $("#eoi_clarification_date_expanded_"+selector); 
    elementSelector.fadeOut();
}


for(const selector of totalElementSelectors){
    let elementID = "#change_clarification_date_"+selector;
    let elementSelector = $(elementID);    
    elementSelector.on('click', ()=> {

        let ClickedID = "#rfi_clarification_date_expanded_"+selector;
        let elementSelectorClicked = $(ClickedID);
        if(elementSelectorClicked.length === 0)
            elementSelectorClicked = $("#eoi_clarification_date_expanded_"+selector);
        elementSelectorClicked.fadeIn();
        elementSelector.hide();
    })
}



for(const selector of totalElementSelectors){
    let elementID = "#cancel_change_clarification_date_"+selector;
    let elementSelector = $(elementID);
    elementSelector.on('click', ()=> {

        let ClickedID = "#rfi_clarification_date_expanded_"+selector;
        let elementSelectorClicked = $(ClickedID);
        if(elementSelectorClicked.length === 0) {
            ClickedID = "#eoi_clarification_date_expanded_"+selector;
            elementSelectorClicked = $(ClickedID);
        }
        elementSelectorClicked.fadeOut();
        ccsZremoveErrorMessage(document.getElementById(ClickedID.slice(1)))
        const elementIDChange = $("#change_clarification_date_"+selector);
        elementIDChange.show();
    })
}

