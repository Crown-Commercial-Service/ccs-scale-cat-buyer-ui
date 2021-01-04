$( document ).ready(function() {


    $("#save-answers").click(function(e){
        e.preventDefault();
        var isValid = true;
        var form = $(this).closest('form');
        var formType = form.attr('data-type');

        if(formType === "input-radio"){

           var checkedInputLenght =  form.find('input:checked').length;

           if(checkedInputLenght == 0){
               isValid = false;
           }

        }
        if(!isValid){
            $('.govuk-form-group').addClass('govuk-form-group--error');
            $('.govuk-error-summary').show();
            $('.govuk-error-message').show();
            return false;
        }

        form.submit();

    })
})