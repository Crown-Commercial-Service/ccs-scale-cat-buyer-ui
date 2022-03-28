document.addEventListener('DOMContentLoaded', () => {

    const totalInputFields = $('.rfp_weight_vetting_class');


    $('#ccs_ca_menu_tabs_form_rfp_vetting').on('submit', (e) => {


        const preventDefaultState = [];

        for (var a = 1; a < totalInputFields.length; a++) {
            const classTarget = document.getElementsByClassName("rfp_weight_vetting_class")[a - 1];
            if (classTarget.value > 99 && classTarget.value != '') {
                document.getElementsByClassName("weight_vetting_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("weight_vetting_class_error")[a - 1].innerHTML = 'There is a problem with this field';
                preventDefaultState.push(true);
            }
            else if (classTarget.value <= 0 && classTarget.value !== '') {
                document.getElementsByClassName("weight_vetting_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("weight_vetting_class_error")[a - 1].innerHTML = 'There is a problem with this field';
                preventDefaultState.push(true);
            }
            else if (isNaN(classTarget.value) && classTarget.value !== '') {
                document.getElementsByClassName("weight_vetting_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("weight_vetting_class_error")[a - 1].innerHTML = 'There is a problem with this field';
                preventDefaultState.push(true);
            }
            else {
                document.getElementsByClassName("weight_vetting_class")[a - 1].classList.remove('govuk-input--error')
                document.getElementsByClassName("weight_vetting_class_error")[a - 1].innerHTML = '';
                // $(`#rfp_weight_vetting_${a}`).removeClass('govuk-input--error');
            }
        }
        /**
         *  
         */

        if (preventDefaultState.length > 0) {
            e.preventDefault();
            $('#rfp_vetting_error_summary').removeClass('hide-block');
            $('.govuk-error-summary__title').text('There is a problem');
            $("#summary_list").html('<li><a href="#">The input field must be a number less than 100 and greater than 0</a></li>');
            $('html, body').animate({ scrollTop: 0 }, 'fast');


        }


    });

});
