document.addEventListener('DOMContentLoaded', () => {
        $('input:radio[name="ccs_da_choose_security"]').on('change', function()
        {
            if ($(this).is(':checked')) {                         
               $('.da_choosesecurity_resources').val(" ")
            }
        });
     
        $('#da_choose_security_form').on('submit', (e) => {
            var resources_da='';
            for(var i=0;i<4;i++)
            {
                var value_da=document.getElementsByClassName("da_choosesecurity_resources")[i].value
               if(value_da!=undefined && value_da!='')   
               {
                resources_da=value_da;
               }  
            }  
            var totalQuantityda=$('#totalQuantityda').val();  
            var choosenoption_da=$('input[name="ccs_da_choose_security"]:checked').val();   
            var selectednumber_da=choosenoption_da?choosenoption_da.replace(/[^0-9.]/g, ''):null          
            if( $('input:radio[name="ccs_da_choose_security"]:checked').length == 0)
            {                 
                    e.preventDefault();
                    $('#da_choose_security_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#da_choose_security_summary_list").html('<li><a href="#">You must select the highest level of security clearance that staff supplied to the project will need to have.</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
            }
            else if(selectednumber_da && ['1','2', '3', '4'].includes(selectednumber_da)&& !resources_da)  
            {
                e.preventDefault();
                $('#da_choose_security_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#da_choose_security_summary_list").html('<li><a href="#">You must enter the number of staffs who will need a lower security and vetting requirement.</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
            }
            else if(selectednumber_da && ['1','2', '3', '4'].includes(selectednumber_da)&&  (resources_da < 0 || resources_da > (totalQuantityda-1)))              
            {
                e.preventDefault();
                $('#da_choose_security_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#da_choose_security_summary_list").html('<li><a href="#">A Quantity must be between 1 to Quantity('+totalQuantityda+') - 1</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
            }
        })
});