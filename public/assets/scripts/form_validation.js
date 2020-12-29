$( document ).ready(function() {


    $("#save-answers").click(function(e){
        e.preventDefault();
        var isValid = true;
        var form = $(this).closest('form');
        var formType = form.attr('data-type');

        if(formType === "input-radio"){

            form.find('input').each(function(i,o){

                var obj = $(o);

                if(!obj.is(":checked")){
                    isValid = false;
                }

                return false;
            })
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