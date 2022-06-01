const totalElementSelectors = Array.from(Array(5 + 1).keys()).slice(1);


for (const selector of totalElementSelectors) {

    let elementID = "#rfi_clarification_date_expanded_" + selector;
    let elementSelector = $(elementID);
    if (elementSelector.length === 0)
        elementSelector = $("#rfi_clarification_date_expanded_" + selector);
    elementSelector.fadeOut();
}


for (const selector of totalElementSelectors) {
    let elementID = "#change_clarification_date_" + selector;
    let elementCancelID = "#cancel_change_clarification_date_" + selector;
    let elementSelector = $(elementID);
    let elementSelectorCancel = $(elementCancelID);
    elementSelector.fadeIn();
    elementSelectorCancel.fadeIn();
    elementSelector.on('click', () => {
        localStorage.removeItem('dateItem');
        localStorage.setItem('dateItem', elementSelector.selector);
        let ClickedID = "#rfi_clarification_date_expanded_" + selector;
        let elementSelectorClicked = $(ClickedID);
        if (elementSelectorClicked.length === 0)
            elementSelectorClicked = $("#rfi_clarification_date_expanded_" + selector);
        elementSelectorClicked.fadeIn();
        elementSelector.hide();
    })
}
var errorSelectorId ='';
let errorSelector = $("#click-error");
errorSelector.on('click', () => {
    let ClickedID = $("#click-error").attr("href");
    let errorText = $("#click-error").text();
    errorSelectorId = ClickedID;
    let elementSelectorClicked = $(ClickedID);
    elementSelectorClicked.fadeIn();
    ccsZaddErrorMessage(document.getElementById(ClickedID.slice(1)), errorText);
});

for (const selector of totalElementSelectors) {
    let elementID = "#cancel_change_clarification_date_" + selector;
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

        if(errorSelectorId === ClickedID)
        {
            for (let selector of totalElementSelectors) {
                let changeID = "#change_clarification_date_" + selector;
                $(changeID).show();
            }
        }
        else
        {
       const elementIDChange = $("#change_clarification_date_" + selector);
        elementIDChange.show();
        }
       
    });
}

