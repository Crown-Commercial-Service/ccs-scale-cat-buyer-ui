document.addEventListener('DOMContentLoaded', () => {
        $('input:radio[name="ccs_ca_choose_security"]').on('change', function()
        {
            if ($(this).is(':checked')) {                         
               $('.ca_choosesecurity_resources').val(" ")
            }
        });
    
        $('#ca_choose_security_form').on('submit', (e) => {
            debugger
            var resources_ca='';
            for(var i=0;i<4;i++)
            {
                var value_ca=document.getElementsByClassName("ca_choosesecurity_resources")[i].value
               if(value_ca!=undefined && value_ca!='')   
               {
                resources_ca=value_ca;
               }  
            }  
            var totalQuantityca=$('#totalQuantityca').val();  
            var choosenoption_ca=$('input[name="ccs_ca_choose_security"]:checked').val();   
            var selectednumber_ca=choosenoption_ca?choosenoption_ca.replace(/[^0-9.]/g, ''):null           
            if( $('input:radio[name="ccs_ca_choose_security"]:checked').length == 0)
            {                 
                    e.preventDefault();
                    $('#ca_choose_security_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#ca_choose_security_summary_list").html('<li><a href="#">You must select the highest level of security clearance that staff supplied to the project will need to have.</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
            }
            else if(selectednumber_ca && ['1','2', '3', '4'].includes(selectednumber_ca)&& !resources_ca)  
            {
                e.preventDefault();
                $('#ca_choose_security_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#ca_choose_security_summary_list").html('<li><a href="#">You must enter the number of staffs who will need a lower security and vetting requirement.</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
            }
            else if(selectednumber_ca && ['1','2', '3', '4'].includes(selectednumber_ca)&&  (resources_ca < 0 || resources_ca > (totalQuantityca-1)))              
            {
                e.preventDefault();
                $('#ca_choose_security_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#ca_choose_security_summary_list").html('<li><a href="#">A Quantity must be between 1 to Quantity('+totalQuantityca+') - 1</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
            }
        })    
});