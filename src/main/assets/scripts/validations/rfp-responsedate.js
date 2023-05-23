//const rfp_totalElementSelectors = Array.from(Array(13+1).keys()).slice(1);


// for(const selector of rfp_totalElementSelectors){

//     let elementID = "#rfp_clarification_date_expanded_"+selector;    
//     let elementSelector = $(elementID);
//     if(elementSelector.length === 0)
//         elementSelector = $("#rfp_clarification_date_expanded_"+selector); 
//     elementSelector.fadeOut();
// }

// for(const selector of rfp_totalElementSelectors){
//     let elementID = "#rfp_change_clarification_date_"+selector;
//     let elementCancelID = "#rfp_cancel_change_clarification_date_"+selector;
//     let elementSelector = $(elementID); 
//     let elementSelectorCancel = $(elementCancelID); 
//     elementSelector.fadeIn(); 
//     elementSelectorCancel.fadeIn(); 
//     elementSelector.on('click', () => {
//         localStorage.removeItem('dateItem');
//         localStorage.setItem('dateItem', elementSelector.selector);
//         let ClickedID = "#rfp_clarification_date_expanded_" + selector;
//         alert(ClickedID)
        
//         let elementSelectorClicked = $(ClickedID);
//         alert(elementSelectorClicked.length)
//         if (elementSelectorClicked.length === 0)
//             elementSelectorClicked = $("#rfp_clarification_date_expanded_" + selector);
//         if($('.rfp_hideFirst:visible').length){
//                 $('.rfp_hideFirst').hide();
//                 $('.change').show(); 
//         }
//         elementSelectorClicked.fadeIn();
//         alert('.rfp_hideFirst:visible')
//         elementSelector.hide();
//         saveButtonHideDateRFP();
        
//     });
    
// }

// let rfperrorSelectorId = '';
// let rfperrorSelector = $("#click-error");
// rfperrorSelector.on('click', () => {
//     let ClickedID = $("#click-error").attr("href");
//     let errorText = $("#click-error").text();
//     rfperrorSelectorId = ClickedID;
//     alert(ClickedID)
//     let elementSelectorClicked = $(ClickedID);
//     const words = ClickedID.split('_');
//     let changeElementClicked = $(`#rfp_change_clarification_date_${words[words.length - 1]}`)
//     changeElementClicked.hide();
//     elementSelectorClicked.fadeIn();
//     ccsZaddErrorMessage(document.getElementById(ClickedID.slice(1)), errorText);
// });

// for(const selector of rfp_totalElementSelectors){
//     let elementID = "#rfp_change_clarification_date_"+selector;
//     let elementSelector = $(elementID);
//     elementSelector.on('click', () => {
//         let ClickedID = "#rfp_clarification_date_expanded_" + selector;
//         let elementSelectorClicked = $(ClickedID);
//         if (elementSelectorClicked.length === 0) {
//             ClickedID = "#rfp_clarification_date_expanded_" + selector;
//             elementSelectorClicked = $(ClickedID);
//         }
//         elementSelectorClicked.fadeOut();
//         elementSelectorClicked.find('input[type=text]').val('');
//         ccsZremoveErrorMessage(document.getElementById(ClickedID.slice(1)))
//         if (rfperrorSelectorId === ClickedID) {
//             for (let selector of totalElementSelectors) {
//                 let changeID = "#rfp_change_clarification_date_" + selector;
//                 $(changeID).show();
//             }
//         } else {
//             const elementIDChange = $("#rfp_change_clarification_date_" + selector);
//             elementIDChange.show();
//         }
//         saveButtonUnHideDateRFP();
//     });
// }

// const saveButtonHideDateRFP = () => { 
//     document.getElementById("hideMeWhileDateChange").disabled = true;
// }

// const saveButtonUnHideDateRFP = () => {
//     document.getElementById("hideMeWhileDateChange").disabled = false;
// }
