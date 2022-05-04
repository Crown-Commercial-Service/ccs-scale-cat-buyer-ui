

const FormSelector = $('#rfp_singleselect');
FormSelector.on('submit', (e)=> {
  
    let elementsOfSelectedFields = $('.govuk-radios__input:checked');
    let selectedtext=$('#rfp_security_confirmation').val();
    var regex = /^[a-zA-Z ]*$/;

    if(elementsOfSelectedFields.length > 0){
        
         if(($('.govuk-radios__input:checked').val()=='Yes')&&(!regex.test(selectedtext))){            
         $(`.govuk-form-group`).addClass("govuk-form-group--error");
         $('#rfp_singleSelect').text('please enter only text');
         const errorStore = [["form", "Please enter only text"]]
         ccsZPresentErrorSummary(errorStore);
     }
     else{
        $('form').submit()
        $(`.govuk-form-group`).removeClass("govuk-form-group--error");
        $('#rfp_singleSelect').text('');
        
        const errorStore = [[]]
        ccsZPresentErrorSummary(errorStore);
    }
    }    
    else{
        e.preventDefault();
        $(`.govuk-form-group`).addClass("govuk-form-group--error");
        $('#rfp_singleSelect').text('please select one of the mandatory Field');
        
        const errorStore = [["form", "Please Select one of the Mandatory Field"]]
        ccsZPresentErrorSummary(errorStore);
    }
    

})

$('input[type="radio"]').on('click change', function(e) {
    if (e.currentTarget.value === 'Yes') {
       $('#conditional-rfp_radio_security_confirmation').fadeIn();
    } else {
        $('#conditional-rfp_radio_security_confirmation').hide();
    }
});
