document.addEventListener('DOMContentLoaded', () => {

    $('#ccs_da_menu_tabs_form_later').on('submit', (e) => {

        const totalInputFields = $('.error_check_weight');
        const stafffield=$('.error_check_staff');
        const vettingfield=$('.error_check_vetting');
        const inputFieldsLength = totalInputFields.length + 1
        const weightStaffId=document.querySelectorAll('[id^="da_weight_staff_"]');
        const weightQuantityId = document.querySelectorAll('[id^="da_sfia_weight_vetting_"]');
        const weightVettingId=document.querySelectorAll('[id^="da_weight_vetting_"]');
        const hiddenId=document.querySelectorAll('[id^="da_hidden_vetting"]');

    
        const preventDefaultState = [];
        const inputtedtext = [];
        const decimalnumber = [];
        const nonnumerical = [];
        var rolevalidation=[];
        var staffval=[];
        var vettval=[];
        var rolebox_validation=[];
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
                let quantity_roles=document.querySelectorAll('[id^="da_sfia_weight_vetting_"][id$='+name+']');
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
    

        
        for (var a = 1; a < stafffield.length; a++) {
            const classTarget = document.getElementsByClassName("error_check_staff")[a - 1];
            if (classTarget.value != '') {
                inputtedtext.push(true)
            }
            if (classTarget.value.includes('.')) {
                document.getElementsByClassName("weight_staff_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("da_weight_staff_class_error")[a - 1].innerHTML = 'Enter whole numbers only  ';

                decimalnumber.push({id:document.getElementsByClassName("weight_staff_class")[a - 1].id,isError:true})
            }
            else if (isNaN(classTarget.value) && classTarget.value !== '') {
                document.getElementsByClassName("weight_staff_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("da_weight_staff_class_error")[a - 1].innerHTML = 'Enter whole numbers only';
                nonnumerical.push({id:document.getElementsByClassName("weight_staff_class")[a - 1].id,isError:true});
            }
            else if (classTarget.value >100 && classTarget.value !== '') {
                document.getElementsByClassName("weight_staff_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("da_weight_staff_class_error")[a - 1].innerHTML = 'Value entered in any [Weighting for number of staff] entry box <= 100';
                staffval.push({id:document.getElementsByClassName("weight_staff_class")[a - 1].id,isError:true});
            }
            else if (classTarget.value <= 0 && classTarget.value !== '') {
                document.getElementsByClassName("weight_staff_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("da_weight_staff_class_error")[a - 1].innerHTML = 'Please enter number <100 and >0';
                preventDefaultState.push({id:document.getElementsByClassName("weight_staff_class")[a - 1].id,isError:true});
            }
            else {
                document.getElementsByClassName("weight_staff_class")[a - 1].classList.remove('govuk-input--error')
                document.getElementsByClassName("da_weight_staff_class_error")[a - 1].innerHTML = '';
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
                document.getElementsByClassName("da_weight_vetting_class_p_error")[a - 1].innerHTML = 'Enter whole numbers only  ';

                decimalnumber.push({id:document.getElementsByClassName("weight_vetting_class")[a - 1].id,isError:true})
            }
            else if (isNaN(classTarget.value) && classTarget.value !== '') {
                document.getElementsByClassName("weight_vetting_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("da_weight_vetting_class_p_error")[a - 1].innerHTML = 'Enter whole numbers only';
                nonnumerical.push({id:document.getElementsByClassName("weight_vetting_class")[a - 1].id,isError:true});
            }
            else if (classTarget.value >100 && classTarget.value !== '') {
                document.getElementsByClassName("weight_vetting_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("da_weight_vetting_class_p_error")[a - 1].innerHTML = 'Value entered in any [Weighting for related vetting requirement] entry box <= 100';
                vettval.push({id:document.getElementsByClassName("weight_vetting_class")[a - 1].id,isError:true});
            }
            else if (classTarget.value <= 0 && classTarget.value !== '') {
                document.getElementsByClassName("weight_vetting_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("da_weight_vetting_class_p_error")[a - 1].innerHTML = 'Please enter number <100 and >0';
                preventDefaultState.push({id:document.getElementsByClassName("weight_vetting_class")[a - 1].id,isError:true});
            }
            else {
                document.getElementsByClassName("weight_vetting_class")[a - 1].classList.remove('govuk-input--error')
                document.getElementsByClassName("da_weight_vetting_class_p_error")[a - 1].innerHTML = '';
                // $(`#rfp_weight_vetting_${a}`).removeClass('govuk-input--error');
            }
        }
        for (var a = 1; a < totalInputFields.length; a++) {
            const classTarget = document.getElementsByClassName("error_check_weight")[a - 1];
        
            if (classTarget.value != '') {
                inputtedtext.push(true)
            }
            if (classTarget.value.includes('.')) {
                document.getElementsByClassName("weight_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("da_weight_class_error")[a - 1].innerHTML = 'Enter whole numbers only ';

                decimalnumber.push({id:document.getElementsByClassName("weight_class")[a - 1].id,isError:true})
            }
            else if (isNaN(classTarget.value) && classTarget.value !== '') {
                document.getElementsByClassName("weight_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("da_weight_class_error")[a - 1].innerHTML = 'Enter whole numbers only';
                nonnumerical.push({id:document.getElementsByClassName("weight_class")[a - 1].id,isError:true});
            }
            else if (classTarget.value > 99 && classTarget.value != '') {
                document.getElementsByClassName("weight_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("da_weight_class_error")[a - 1].innerHTML = 'Please enter number <100 and >0';
                rolebox_validation.push({id:document.getElementsByClassName("weight_class")[a - 1].id,isError:true});
            }
            else if (classTarget.value <= 0 && classTarget.value !== '') {
                document.getElementsByClassName("weight_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("da_weight_class_error")[a - 1].innerHTML = 'Please enter number <100 and >0';
                preventDefaultState.push({id:document.getElementsByClassName("weight_class")[a - 1].id,isError:true});
            }
            else {
                document.getElementsByClassName("weight_class")[a - 1].classList.remove('govuk-input--error')
                document.getElementsByClassName("da_weight_class_error")[a - 1].innerHTML = '';
                // $(`#rfp_weight_vetting_${a}`).removeClass('govuk-input--error');
            }
   
        }

        
        
            let errormsg='';
            if(preventDefaultState.length > 0 || decimalnumber.length > 0 || nonnumerical.length > 0 || rolevalidation.length>0 || staffval.length>0 || vettval.length> 0 || rolebox_validation.length>0)
            {
                
                if (preventDefaultState.length > 0)


                errormsg=errormsg+'<li><a href="#'+preventDefaultState[0].id+'">The input field must be a number less than 100 and greater than 0</a></li>';

                if (nonnumerical.length > 0)


                errormsg=errormsg+'<li><a href="#'+nonnumerical[0].id+'">The input field must be a number</a></li>';

                if (decimalnumber.length > 0)


                errormsg=errormsg+'<li><a href="#'+decimalnumber[0].id+'">The input field should not contain decimal values</a></li>';

                if (rolevalidation.length>0)

                errormsg=errormsg+'<li><a href="#'+rolevalidation[0].id+'">At least 1 DDaT role must be populated with a quantity value</a></li>';
                
                if(staffval.length>0)

                errormsg=errormsg+'<li><a href="#">Sum of all [Weighting for number of staff] values for all Role Families in all groups = 100%</a></li>';
  
                if(vettval.length>0)

                errormsg=errormsg+'<li><a href="#">Sum of all [Weighting for related vetting requirement] values for all Role Families in all groups = 100%</a></li>';

                if(rolebox_validation.length>0)

                errormsg=errormsg+'<li><a href="#'+rolebox_validation[0].id+'">Value entered in [How many people you need for this role family?] <= 99</a></li>';

                e.preventDefault();
                $('#da_vetting_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#da_summary_list").html(errormsg);
                $('html, body').animate({ scrollTop: 0 }, 'fast'); 



            }

            if (!inputtedtext.length > 0) {

            e.preventDefault();
            $('#da_vetting_error_summary').removeClass('hide-block');
            $('.govuk-error-summary__title').text('There is a problem');
            $("#da_summary_list").html('You must enter atleast 1 role');
            $('html, body').animate({ scrollTop: 0 }, 'fast');
        }

    });

          }


);
  