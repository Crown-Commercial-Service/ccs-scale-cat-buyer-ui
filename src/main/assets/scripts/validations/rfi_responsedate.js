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
    // if(selector==7 || selector==8){
    //     $('#headBodyContent_'+selector).hide();
    // }else{
    //     $('#headContent_'+selector).hide();
        
    // }
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
            $('#headBodyContent_'+selector).removeClass('hide');
           $('#headContent_'+selector).removeClass('hidehr');
           
        }
        if(checkedBox=='no'){
            $('.showDivDynamic'+selector).removeClass('govuk-form-group--error')
            $(erroReove).html("")
             $('#headBodyContent_'+selector).hide();
           $('#headContent_'+selector).addClass('hidehr');
           $('#headBodyContent_'+selector).addClass('hide');
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

// StandstilSupplierPresentation - Start
$('.timeLineEventTrigger').on('change', function(e) {
    var tl_val = $(this).val();
    var tl_aggrementID = $(this).attr("data-aggrement");
    var tl_eventType = $(this).attr("data-eventtype");
    var tl_questionID = $(this).attr("data-question");
    let q7Selected, q8Selected, compareAccess;
    if(tl_aggrementID == "RM6187" && tl_eventType == 'FC') {
        compareAccess = [{"question":"Q7","label":"clarification_7","input_hidden":"evaluation_process_start_date"},{"question":"Q8","label":"clarification_8","input_hidden":"bidder_presentations_date"},{"question":"Q9","label":"clarification_9","input_hidden":"standstill_period_starts_date"},{"question":"Q10","label":"clarification_10","input_hidden":"proposed_award_date"},{"question":"Q11","label":"clarification_11","input_hidden":"expected_signature_date"}];
        if(tl_questionID == 7) {
            if( $('.resdateradioclass7').is(':checked') ){
                if($(this).val() == 'yes') {
                    q7Selected = true;
                } else {
                    q7Selected = false;
                }
            }
            if( !$('.resdateradioclass8').is(':checked') ){
                q8Selected = false;
            } else {
                if($(".resdateradioclass8:checked").val() == 'yes') {
                    q8Selected = true;
                } else {
                    q8Selected = false;
                }
            }
        } else if(tl_questionID == 8) {
            if( $('.resdateradioclass8').is(':checked') ){
                if($(this).val() == 'yes') {
                    q8Selected = true;
                } else {
                    q8Selected = false;
                }
            }
            if( !$('.resdateradioclass7').is(':checked') ){
                q7Selected = false;
            } else {
                if($(".resdateradioclass7:checked").val() == 'yes') {
                    q7Selected = true;
                } else {
                    q7Selected = false;
                }
            }
        }
    }

    let tl_Q6_split = $("input[name='deadline_for_submission_of_stage_one']").val();
    let tl_Q6 = tl_Q6_split.split('*')[1];
        
    let postTLData = {
        tl_aggrementID,
        tl_eventType,
        tl_questionID,
        tl_val,
        manipulation: {
            'Q6': {value: tl_Q6, selected: null},
            'Q7': {value: null, selected: q7Selected, config: 5},
            'Q8': {value: null, selected: q8Selected, config: 10}
        }
    };
          
    $.ajax({
        url: `/timeline_standstill_supplier`,
        type: "POST",
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify(postTLData)
    }).done(function (res) {
        let items = res;
        items.sort((a, b) => a.value - b.value);
        items.forEach((value, key) => {
            let dataAccess = compareAccess.find((el) => el.question == value.question);
            let labelAppend = value.value.split('*')[1];
            if(labelAppend != 'Invalid date') {
                $("."+ dataAccess.label).html(labelAppend);
            }
            $("input[name='"+dataAccess.input_hidden+"']").val(value.value);

        });
    }).fail((err) => {
    })
});
// StandstilSupplierPresentation - End