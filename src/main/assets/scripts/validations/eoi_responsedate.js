// const eoi_totalElementSelectors = Array.from(Array(5 + 1).keys()).slice(1);


// for (const selector of eoi_totalElementSelectors) {

//     let elementID = "#eoi_clarification_date_expanded_" + selector;
//     let elementSelector = $(elementID);
//     if (elementSelector.length === 0)
//         elementSelector = $("#eoi_clarification_date_expanded_" + selector);
//     elementSelector.fadeOut();
// }


// for (const selector of eoi_totalElementSelectors) {
//     let elementID = "#change_clarification_date_" + selector;
//     let elementCancelID = "#eoi_cancel_change_clarification_date_" + selector;
//     let elementSelector = $(elementID);
//     let elementSelectorCancel = $(elementCancelID);
//     elementSelector.fadeIn();
//     elementSelectorCancel.fadeIn();
//     elementSelector.on('click', (event) => {
//         localStorage.removeItem('dateItem');
//         localStorage.setItem('dateItem', elementSelector.selector);
//         let ClickedID = "#eoi_clarification_date_expanded_" + selector;
//         let elementSelectorClicked = $(ClickedID);
//         if (elementSelectorClicked.length === 0)
//             elementSelectorClicked = $("#eoi_clarification_date_expanded_" + selector);
//         if($('.eoi_hideFirst:visible').length){
//             $('.eoi_hideFirst').hide();
//             $('.change').show(); 
//         }
//         elementSelectorClicked.fadeIn();
//         elementSelector.hide();
//         saveButtonHideDateEoi();
//     });
// }


// let eoierrorSelector = $("#click-error");
// eoierrorSelector.on('click', () => {
//     let ClickedID = $("#click-error").attr("href");
//     let errorText = $("#click-error").text();
//     errorSelectorId = ClickedID;
//     let elementSelectorClicked = $(ClickedID);
//     elementSelectorClicked.fadeIn();
//     ccsZaddErrorMessage(document.getElementById(ClickedID.slice(1)), errorText);
// });


// for (const selector of eoi_totalElementSelectors) {
//     let elementID = "#eoi_cancel_change_clarification_date_" + selector;
//     let elementSelector = $(elementID);
//     elementSelector.on('click', () => {
//         $(`#clarification_date-day_${selector}`).val("");
//         $(`#clarification_date-month_${selector}`).val("");
//         $(`#clarification_date-year_${selector}`).val("");
//         $(`#clarification_date-hour_${selector}`).val("");
//         $(`#clarification_date-minute_${selector}`).val("");
        
//         let ClickedID = "#eoi_clarification_date_expanded_" + selector;
//         let elementSelectorClicked = $(ClickedID);
//         if (elementSelectorClicked.length === 0) {
//             ClickedID = "#eoi_clarification_date_expanded_" + selector;
//             elementSelectorClicked = $(ClickedID);
//         }
//         elementSelectorClicked.fadeOut();

//         ccsZremoveErrorMessage(document.getElementById(ClickedID.slice(1)))
//         if (errorSelectorId === ClickedID) {
//             for (let selector of totalElementSelectors) {
//                 let changeID = "#change_clarification_date_" + selector;
//                 $(changeID).show();
//             }
//         } else {
//             const elementIDChange = $("#change_clarification_date_" + selector);
//             elementIDChange.show();
//         }
//         saveButtonUnHideDateEoi();
//     });
// }

// const saveButtonHideDateEoi = () => {
//     document.getElementById("hideMeWhileDateChange").disabled = true;
// }

// const saveButtonUnHideDateEoi = () => {
//     document.getElementById("hideMeWhileDateChange").disabled = false;
// }


