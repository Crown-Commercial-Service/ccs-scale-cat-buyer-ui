document.addEventListener('DOMContentLoaded', () => {

    $('#ccs_ca_menu_tabs_form_later').on('submit', (e) => {

        const totalInputFields = $('.error_check_weight');
        const stafffield=$('.error_check_staff');
        const vettingfield=$('.error_check_vetting');
        const inputFieldsLength = totalInputFields.length + 1
        const weightStaffId=document.querySelectorAll('[id^="ca_weight_staff_"]');
        const weightQuantityId = document.querySelectorAll('[id^="ca_sfia_weight_vetting_"]');
        const weightVettingId=document.querySelectorAll('[id^="ca_weight_vetting_"]');
        const hiddenId=document.querySelectorAll('[id^="ca_hidden_vetting"]');


        var preventDefaultState = [];
        var inputtedtext = [];
        var decimalnumber = [];
        var nonnumerical = [];
        var rolevalidation=[];
        var staffval=[];
        var vettval=[];
        let totalStaff=0;
        let totalVetting=0;

//staff 100% validation
        for (var a = 0; a < weightStaffId.length; a++) {

            let weightStaff = $(`#${weightStaffId[a].id}`);
            if (weightStaff.val() != undefined && weightStaff.val() != '')
            totalStaff = totalStaff + Number(weightStaff.val());
        }
        if(totalStaff<100 || totalStaff>100)
        {
            ///staffvalidation.push(true);
            staffval.push(true);
        }

// vetting 100% validation    
for (var a = 0; a < weightVettingId.length; a++) {

    let weightVetting = $(`#${weightVettingId[a].id}`);
    if (weightVetting.val() != undefined && weightVetting.val() != '')
    totalVetting = totalVetting + Number(weightVetting.val());
}
if(totalVetting<100 || totalVetting>100)
{
    ///staffvalidation.push(true);
    vettval.push(true);
}    
        
        //empty DDAT roles validation
        for (var a = 0; a < weightStaffId.length; a++) {

            let weightStaff = $(`#${weightStaffId[a].id}`);
            if (weightStaff.val() != undefined && weightStaff.val() != '')
            {
                let weightVetting = $(`#${weightVettingId[a].id}`);
                if (weightVetting.val() != undefined && weightVetting.val() != '')
                {
                    let vetting_hidden = $(`#${hiddenId[a].id}`);
                    let name=vetting_hidden.val()
                    let quantity_roles=document.querySelectorAll('[id^="ca_sfia_weight_vetting_"][id$='+name+']');
                    let quantity_flag=false;
                    for (var b = 0; b < quantity_roles.length; b++) {
                        let role_box = $(`#${quantity_roles[b].id}`);
                        if (role_box.val() != undefined && role_box.val() != ''){
                            quantity_flag=true;
                        }
                    }
                    if(quantity_flag==false){
                        rolevalidation.push(true);
                    }
                }
            }
        }
        
        for (var a = 1; a < totalInputFields.length; a++) {
            const classTarget = document.getElementsByClassName("error_check_weight")[a - 1];
            if (classTarget.value != '') {
                inputtedtext.push(true)
            }
            if (classTarget.value.includes('.')) {
                document.getElementsByClassName("weight_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("ca_weight_class_error")[a - 1].innerHTML = 'All entry boxes are integer numeric  ';

                decimalnumber.push(true)
            }
            else if (isNaN(classTarget.value) && classTarget.value !== '') {
                document.getElementsByClassName("weight_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("ca_weight_class_error")[a - 1].innerHTML = 'All entry boxes are integer numeric';
                nonnumerical.push(true);
            }
            else if (classTarget.value > 99 && classTarget.value != '') {
                document.getElementsByClassName("weight_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("ca_weight_class_error")[a - 1].innerHTML = 'Please enter number <100 and >0';
                preventDefaultState.push(true);
            }
            else if (classTarget.value <= 0 && classTarget.value !== '') {
                document.getElementsByClassName("weight_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("ca_weight_class_error")[a - 1].innerHTML = 'Please enter number <100 and >0';
                preventDefaultState.push(true);
            }
            else {
                document.getElementsByClassName("weight_class")[a - 1].classList.remove('govuk-input--error')
                document.getElementsByClassName("ca_weight_class_error")[a - 1].innerHTML = '';
                // $(`#rfp_weight_vetting_${a}`).removeClass('govuk-input--error');
            }
        }

        for (var a = 1; a < stafffield.length; a++) {
            const classTarget = document.getElementsByClassName("error_check_staff")[a - 1];
            if (classTarget.value != '') {
                inputtedtext.push(true)
            }
            if (classTarget.value.includes('.')) {
                document.getElementsByClassName("weight_staff_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("ca_weight_staff_class_error")[a - 1].innerHTML = 'All entry boxes are integer numeric';

                decimalnumber.push(true)
            }
            else if (isNaN(classTarget.value) && classTarget.value !== '') {
                document.getElementsByClassName("weight_staff_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("ca_weight_staff_class_error")[a - 1].innerHTML = 'All entry boxes are integer numeric';
                nonnumerical.push(true);
            }
            else if (classTarget.value >100 && classTarget.value !== '') {
                document.getElementsByClassName("weight_staff_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("ca_weight_staff_class_error")[a - 1].innerHTML = 'Value entered in any [Weighting for number of staff] entry box <= 100';
                staffval.push(true);
            }
            else if (classTarget.value <= 0 && classTarget.value !== '') {
                document.getElementsByClassName("weight_staff_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("ca_weight_staff_class_error")[a - 1].innerHTML = 'Please enter number <100 and >0';
                preventDefaultState.push(true);
            }
            else {
                document.getElementsByClassName("weight_staff_class")[a - 1].classList.remove('govuk-input--error')
                document.getElementsByClassName("ca_weight_staff_class_error")[a - 1].innerHTML = '';
                // $(`#rfp_weight_vetting_${a}`).removeClass('govuk-input--error');
            }
        }

        for (var a = 1; a < vettingfield.length; a++) {
            const classTarget = document.getElementsByClassName("error_check_vetting")[a - 1];
            if (classTarget.value != '') {
                inputtedtext.push(true)
            }
            if (classTarget.value.includes('.')) {
                document.getElementsByClassName("weight_vetting_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("ca_weight_vetting_class_p_error")[a - 1].innerHTML = 'All entry boxes are integer numeric';

                decimalnumber.push(true)
            }
            else if (isNaN(classTarget.value) && classTarget.value !== '') {
                document.getElementsByClassName("weight_vetting_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("ca_weight_vetting_class_p_error")[a - 1].innerHTML = 'All entry boxes are integer numeric';
                nonnumerical.push(true);
            }
            else if (classTarget.value >100 && classTarget.value !== '') {
                document.getElementsByClassName("weight_vetting_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("ca_weight_vetting_class_p_error")[a - 1].innerHTML = 'Value entered in any [Weighting for related vetting requirement] entry box <= 100';
                vettval.push(true);
            }
            else if (classTarget.value <= 0 && classTarget.value !== '') {
                document.getElementsByClassName("weight_vetting_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("ca_weight_vetting_class_p_error")[a - 1].innerHTML = 'Please enter number <100 and >0';
                preventDefaultState.push(true);
            }
            else {
                document.getElementsByClassName("weight_vetting_class")[a - 1].classList.remove('govuk-input--error')
                document.getElementsByClassName("ca_weight_vetting_class_p_error")[a - 1].innerHTML = '';
                // $(`#rfp_weight_vetting_${a}`).removeClass('govuk-input--error');
            }
        }
        

        /**
         *  
         */


    
            switch (true) {
                case (preventDefaultState.length > 0 && decimalnumber.length > 0 && nonnumerical.length > 0):

                    e.preventDefault();
                    $('#ca_vetting_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#ca_summary_list").html('<li><a href="#">The input field must be a number less than 100 and greater than 0</a></li><br><li><a href="#">The input field should not contain decimal values</a></li><br><li><a href="#">The input field must be a number</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
                    break;
                case (preventDefaultState.length > 0 && decimalnumber.length > 0):

                    e.preventDefault();
                    $('#ca_vetting_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#ca_summary_list").html('<li><a href="#">The input field must be a number less than 100 and greater than 0</a></li><br><li><a href="#">The input field should not contain decimal values</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
                    break;
                case (preventDefaultState.length > 0 && nonnumerical.length > 0):

                    e.preventDefault();
                    $('#ca_vetting_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#ca_summary_list").html('<li><a href="#">The input field must be a number less than 100 and greater than 0</a></li><br><li><a href="#">The input field must be a number</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
                    break;
                case (decimalnumber.length > 0 && nonnumerical.length > 0):

                    e.preventDefault();
                    $('#ca_vetting_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#ca_summary_list").html('<li><a href="#">The input field should not contain decimal values</a></li><br><li><a href="#">The input field must be a number</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
                    break;
                case (preventDefaultState.length > 0):

                    e.preventDefault();
                    $('#ca_vetting_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#ca_summary_list").html('<li><a href="#">The input field must be a number less than 100 and greater than 0</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
                    break;
                case (nonnumerical.length > 0):

                    e.preventDefault();
                    $('#ca_vetting_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#ca_summary_list").html('<li><a href="#">The input field must be a number</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
                    break;
                case (decimalnumber.length > 0):

                    e.preventDefault();
                    $('#ca_vetting_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#ca_summary_list").html('<li><a href="#">The input field should not contain decimal values</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
                    break;
                   
                 case (rolevalidation.length>0):
                    e.preventDefault();
                     $('#ca_vetting_error_summary').removeClass('hide-block');
                     $('.govuk-error-summary__title').text('There is a problem');
                     $("#ca_summary_list").html('<li><a href="#">At least 1 DDaT role must be populated with a quantity value</a></li>');
                     $('html, body').animate({ scrollTop: 0 }, 'fast'); 
                     break;  
                     
                case(staffval.length>0):
                e.preventDefault();
                $('#ca_vetting_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#ca_summary_list").html('<li><a href="#">The number of staff weightings for all Role Family entries must = 100%</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast'); 
                break;
            
                case(vettval.length>0):
                e.preventDefault();
                $('#ca_vetting_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#ca_summary_list").html('<li><a href="#">The number of vetting weightings for all Role Family entries must = 100%</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast'); 
                break;



                default:
                    console.log("If all else fails");
                    break;
            }

            


               
            


        if (!inputtedtext.length > 0) {

            e.preventDefault();
            $('#ca_vetting_error_summary').removeClass('hide-block');
            $('.govuk-error-summary__title').text('There is a problem');
            $("#ca_summary_list").html('At least 1 Role Family set of values are defined and 1 DDaT Role value is defined for that Role Family');
            $('html, body').animate({ scrollTop: 0 }, 'fast');
        }

    });

       
    }


);
