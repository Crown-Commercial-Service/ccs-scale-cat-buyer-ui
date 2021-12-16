const totalElementSelectors = Array.from(Array(5+1).keys()).slice(1);


for(const selector of totalElementSelectors){

    let elementID = "#clarification_date_expanded_"+selector;
    let elementSelector = $(elementID);
    elementSelector.fadeOut();
}


for(const selector of totalElementSelectors){
    let elementID = "#change_clarification_date_"+selector;
    let elementSelector = $(elementID);
    elementSelector.on('click', ()=> {

        let ClickedID = "#clarification_date_expanded_"+selector;
        let elementSelectorClicked = $(ClickedID);
        elementSelectorClicked.fadeIn();
    })
}



for(const selector of totalElementSelectors){
    let elementID = "#cancel_change_clarification_date_"+selector;
    let elementSelector = $(elementID);
    elementSelector.on('click', ()=> {

        let ClickedID = "#clarification_date_expanded_"+selector;
        let elementSelectorClicked = $(ClickedID);
        elementSelectorClicked.fadeOut();

    })
}

