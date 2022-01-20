

const FormSelector = $('#rfp_singleselect');
FormSelector.on('submit', (e)=> {
  
    let elementsOfSelectedFields = $('.govuk-radios__input:checked');
    
    if(elementsOfSelectedFields.length > 0){
        $('form').submit()
        $(`.govuk-form-group`).removeClass("govuk-form-group--error");
        $('#rfp_singleSelect').text('');
        
        const errorStore = [[]]
        ccsZPresentErrorSummary(errorStore);

    }
    else{
        e.preventDefault();
        $(`.govuk-form-group`).addClass("govuk-form-group--error");
        $('#rfp_singleSelect').text('please select one of the mandatory Field');
        
        const errorStore = [["form", "Please Select one of the Mandatory Field"]]
        ccsZPresentErrorSummary(errorStore);
    }
    

})