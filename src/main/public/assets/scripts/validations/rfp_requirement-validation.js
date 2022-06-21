document.addEventListener('DOMContentLoaded', () => {

    const totalInputFields = $('.rfp_weight_vetting_class');
    const inputFieldsLength = totalInputFields.length + 1

    var itemSubText = '';
    var itemText = '';
    var totalResourceAdded = $('#rfp_total_resource');
    var totalResourceAdded2 = $('#rfp_total_resource2');

    var tabLinks = document.querySelectorAll('.rfp-vetting-weighting');

    if (tabLinks != null && tabLinks.length > 0) {

        ccsTabMenuNaviation();
        itemSubText = document.getElementsByClassName('table-item-subtext')[0];;
        itemText = tabLinks[0].getElementsByTagName('a')[0].childNodes[0].data

        if (itemText != null && itemText != '') {

            itemText = itemText.replaceAll(" ", "_");
            resourceItemOnClick(itemText);
        }
        Array.from(tabLinks).forEach(link => {

            link.addEventListener('click', function (e) {
                let currentTarget = e.currentTarget;
                let clicked_index = $(this).index();

                itemSubText = currentTarget.getElementsByClassName('table-item-subtext')[0];
                itemText = tabLinks[clicked_index].getElementsByTagName('a')[0].childNodes[0].data

                itemText = itemText.replaceAll(" ", "_");
                itemText = itemText.replaceAll(/[\])}[{(]/g, '');

                resourceItemOnClick(itemText);
                // updateTotalResourceAdded();
                return false;
            });
        });


    }
    function resourceItemOnClick(category) {

        const weightVettingId = 'rfp_weight_vetting_' + category + "_"

        for (var a = 1; a < inputFieldsLength; a++) {

            let weightVetting = $(`#${weightVettingId}${a}`);

            weightVetting.on('blur', () => {

                if (weightVetting.val() != undefined && weightVetting.val() !== null && weightVetting.val() !== "") {
                    updateWeightVetting(weightVettingId);
                    updateTotalResource();
                }
                else {
                    updateWeightVetting(weightVettingId);
                    updateTotalResource();
                }

            });
        }
    }

    function updateWeightVetting(weightVettingId) {
        let value = 0;
        for (var a = 1; a < inputFieldsLength; a++) {

            let weightVetting = $(`#${weightVettingId}${a}`);
            if (weightVetting.val() != undefined && weightVetting.val() != '')
                value = value + Number(weightVetting.val());

        }
        itemSubText.innerHTML = value + ' resources added';
    }

    function updateTotalResource() {
        let resourceCount = 0
        for (index = 0; index < totalInputFields.length; ++index) {
            if (totalInputFields[index].value != "")
                resourceCount = resourceCount + Number(totalInputFields[index].value);
        }
        totalResourceAdded.text(resourceCount);
        totalResourceAdded2.text(resourceCount);
    }

    totalInputFields.on('keydown', (event) => {
        if (event.key === '.' || event.keyCode === 69)
            event.preventDefault();
    });

    // function updateTotalResourceAdded() {

    //     let resourceCount = 0;
    //     for (let index = 0; index < tabLinks.length; index++) {

    //         let subText = tabLinks[index].getElementsByTagName('div')[0].childNodes[0].data;
    //         var numbr = subText.match(/\d/g);

    //         if(numbr !=null)
    //         {
    //             numbr = numbr.join("");
    //             resourceCount = resourceCount + Number(numbr);
    //         }

    //     }
    //     totalResourceAdded.text(resourceCount);
    //     totalResourceAdded2.text(resourceCount);

    // }


    $('#ccs_ca_menu_tabs_form_rfp_vetting').on('submit', (e) => {


        const preventDefaultState = [];
        const inputtedtext = [];
        const decimalnumber = [];
        const nonnumerical = [];

        for (var a = 1; a < totalInputFields.length; a++) {
            const classTarget = document.getElementsByClassName("rfp_weight_vetting_class")[a - 1];
            if (classTarget.value != '') {
                inputtedtext.push(true)
            }
            if (classTarget.value.includes('.')) {
                document.getElementsByClassName("weight_vetting_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("weight_vetting_class_error")[a - 1].innerHTML = 'Decimal value is entered. Please enter number <100 and >0 ';

                decimalnumber.push(true)
            }
            else if (isNaN(classTarget.value) && classTarget.value !== '') {
                document.getElementsByClassName("weight_vetting_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("weight_vetting_class_error")[a - 1].innerHTML = 'Alphabetical value is entered. Please enter number <100 and >0';
                nonnumerical.push(true);
            }
            else if (classTarget.value > 99 && classTarget.value != '') {
                document.getElementsByClassName("weight_vetting_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("weight_vetting_class_error")[a - 1].innerHTML = 'Please enter number <100 and >0';
                preventDefaultState.push(true);
            }
            else if (classTarget.value <= 0 && classTarget.value !== '') {
                document.getElementsByClassName("weight_vetting_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("weight_vetting_class_error")[a - 1].innerHTML = 'Please enter number <100 and >0';
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

        switch (true) {
            case (preventDefaultState.length > 0 && decimalnumber.length > 0 && nonnumerical.length > 0):

                e.preventDefault();
                $('#rfp_vetting_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#summary_list").html('<li><a href="#">The input field must be a number less than 100 and greater than 0</a></li><br><li><a href="#">The input field should not contain decimal values</a></li><br><li><a href="#">The input field must be a number</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
                break;
            case (preventDefaultState.length > 0 && decimalnumber.length > 0):

                e.preventDefault();
                $('#rfp_vetting_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#summary_list").html('<li><a href="#">The input field must be a number less than 100 and greater than 0</a></li><br><li><a href="#">The input field should not contain decimal values</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
                break;
            case (preventDefaultState.length > 0 && nonnumerical.length > 0):

                e.preventDefault();
                $('#rfp_vetting_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#summary_list").html('<li><a href="#">The input field must be a number less than 100 and greater than 0</a></li><br><li><a href="#">The input field must be a number</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
                break;
            case (decimalnumber.length > 0 && nonnumerical.length > 0):

                e.preventDefault();
                $('#rfp_vetting_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#summary_list").html('<li><a href="#">The input field should not contain decimal values</a></li><br><li><a href="#">The input field must be a number</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
                break;
            case (preventDefaultState.length > 0):

                e.preventDefault();
                $('#rfp_vetting_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#summary_list").html('<li><a href="#">The input field must be a number less than 100 and greater than 0</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
                break;
            case (nonnumerical.length > 0):

                e.preventDefault();
                $('#rfp_vetting_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#summary_list").html('<li><a href="#">The input field must be a number</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
                break;
            case (decimalnumber.length > 0):

                e.preventDefault();
                $('#rfp_vetting_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#summary_list").html('<li><a href="#">The input field should not contain decimal values</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
                break;
            default:
                console.log("If all else fails");
                break;
        }

        if (!inputtedtext.length > 0) {

            e.preventDefault();
            $('#rfp_vetting_error_summary').removeClass('hide-block');
            $('.govuk-error-summary__title').text('There is a problem');
            $("#summary_list").html('You must enter atleast on value');
            $('html, body').animate({ scrollTop: 0 }, 'fast');
        }

    });

});
