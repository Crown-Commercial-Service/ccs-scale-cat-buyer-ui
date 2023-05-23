let arr = $("#clarification_date_arr").attr("attr");
let totalElementSelectors=[];
 
if(arr!=undefined){
     totalElementSelectors = arr.split(',');
}

for (const selector of totalElementSelectors) {
   
    let elementID = "#rfi_clarification_date_expanded_" + selector;
    let elementSelector = $(elementID);
    if (elementSelector.length === 0)
        elementSelector = $("#rfi_clarification_date_expanded_" + selector);
    elementSelector.fadeOut();
}

for (const selector of totalElementSelectors) {
    let elementRadioID = ".resdateradioclass" + selector;
    let elementRadioIDSelector = $(elementRadioID);
    if(selector==7 || selector==8){
       // $('#headBodyContent_'+selector).hide();
    }else{
       // $('#headContent_'+selector).hide();
        
    }
    let elementID = "#change_clarification_date_" + selector;
    let elementCancelID = "#cancel_change_clarification_date_" + selector;
    let elementSelector = $(elementID);
    let elementSelectorCancel = $(elementCancelID);
    elementSelector.fadeIn();

    elementSelectorCancel.fadeIn();
    elementSelector.on('click', () => {
        removeErrorFieldsEoiTerms();
        localStorage.removeItem('dateItem');
        localStorage.setItem('dateItem', elementSelector.selector);
        let ClickedID = "#rfi_clarification_date_expanded_" + selector;
        let elementSelectorClicked = $(ClickedID);
        elementSelectorClicked.find('input[type=text]').val('');
        if (elementSelectorClicked.length === 0)
            elementSelectorClicked = $("#rfi_clarification_date_expanded_" + selector);
        if($('.rfi_hideFirst:visible').length){
            $('.rfi_hideFirst').hide();
            $('.change').show(); 
        }
        elementSelectorClicked.fadeIn();
        elementSelector.hide();
        saveButtonHideDateRfi();
    })
    
    //Radio Yes or no Select
    elementRadioIDSelector.on('click', () => {
        let getClassName = 'resdateradio'+selector;
         let checkedBox = $('input[name='+getClassName+']:checked').val();
        let erroReove = '#errorMsg'+selector+'-error';
        if(checkedBox=='yes'){
            $('.showDivDynamic'+selector).removeClass('govuk-form-group--error')
            $(erroReove).html(" ")
            $('#headBodyContent_'+selector).show();
           $('#headContent_'+selector).removeClass('hidehr');
        }
        if(checkedBox=='no'){
            $('.showDivDynamic'+selector).removeClass('govuk-form-group--error')
            $(erroReove).html("")
             $('#headBodyContent_'+selector).hide();
           $('#headContent_'+selector).addClass('hidehr');
        }
        })
     
}


var errorSelectorId = '';
let errorSelector = $("#click-error");
errorSelector.on('click', () => {
    let ClickedID = $("#click-error").attr("href");
    let errorText = $("#click-error").text();
    errorSelectorId = ClickedID;
    let elementSelectorClicked = $(ClickedID);
    const words = ClickedID.split('_');
    let changeElementClicked = $(`#change_clarification_date_${words[words.length - 1]}`)
    changeElementClicked.hide();
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
        elementSelectorClicked.find('input[type=text]').val('');
        ccsZremoveErrorMessageRFIDate(document.getElementById(ClickedID.slice(1)))

        if (errorSelectorId === ClickedID) {
            for (let selector of totalElementSelectors) {
                let changeID = "#change_clarification_date_" + selector;
                $(changeID).show();
            }
        } else {
            const elementIDChange = $("#change_clarification_date_" + selector);
            elementIDChange.show();
        }
        saveButtonUnHideDateRfi();
    });
}

//FormValidation
let submitValidation = "#hideMeWhileDateChange";
let submitValidationSelector = $(submitValidation);
submitValidationSelector.on('click', () => {
     removeErrorFieldsEoiTerms();
    errorStore = getRadioValidation();
    if (errorStore.length === 0) {
        document.getElementById(`timelineresponsedate`).submit()
        }
      else {
        ccsZPresentErrorSummary(errorStore);
    
      }
    return false;
})

function getRadioValidation(){
    errorStore=[];
for (const selector of totalElementSelectors) {
    let checkRadioSelectedClassName = 'resdateradio'+selector;
    let checkRadioSelected = $('input[name='+checkRadioSelectedClassName+']:checked').val();

    if(checkRadioSelected==undefined)
    {
    if(selector==7){
        ccsZaddErrorMessage(document.getElementById('errorMsg'+selector), "Select whether you want supplier presentations"); 
        fieldCheck = ['errorMsg'+selector, 'Select whether you want supplier presentations'];
        errorStore.push(fieldCheck);
        }
    if(selector==8){
        ccsZaddErrorMessage(document.getElementById('errorMsg'+selector), "Select whether you want a standstill"); 
        fieldCheck = ['errorMsg'+selector, 'Select whether you want a standstill'];
        errorStore.push(fieldCheck);
     }
    
    }

//Looend
}
 return errorStore;

}

const saveButtonHideDateRfi = () => {
    document.getElementById("hideMeWhileDateChange").disabled = true;
}

const saveButtonUnHideDateRfi = () => {
    document.getElementById("hideMeWhileDateChange").disabled = false;
}

// function myfunction(index) {
//     console.log(index)
// }
// document.querySelectorAll("input[name='resdateradio']").forEach((input) => {
//     input.addEventListener('change', myfunction);
// });