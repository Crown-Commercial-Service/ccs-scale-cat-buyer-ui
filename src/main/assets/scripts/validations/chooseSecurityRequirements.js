document.addEventListener('DOMContentLoaded', () => {

    $('input:radio[name="ccs_rfp_choose_security"]').on('change', function()
        {
            if ($(this).is(':checked')) {                         
               $('.rfp_choosesecurity_resources').val(" ")
            }
        });

        $('input:radio[name="ccs_ca_choose_security"]').on('change', function()
        {
            if ($(this).is(':checked')) {                         
               $('.ca_choosesecurity_resources').val(" ")
            }
        });
        $('input:radio[name="ccs_da_choose_security"]').on('change', function()
        {
            if ($(this).is(':checked')) {                         
               $('.da_choosesecurity_resources').val(" ")
            }
        });
        $('#rfp_choose_security_form').on('submit', (e) => {
            var resources='';
            for(var i=0;i<4;i++)
            {
                var value=document.getElementsByClassName("rfp_choosesecurity_resources")[i].value
               if(value!=undefined && value!='')   
               {
                resources=value;
               }  
            }            
            var totalQuantityrfp=$('#totalQuantityrfp').val();  
            var choosenoption=$('input[name="ccs_rfp_choose_security"]:checked').val();   
            var selectednumber=choosenoption?choosenoption.replace(/[^0-9.]/g, ''):null   
            if( $('input:radio[name="ccs_rfp_choose_security"]:checked').length == 0)
            {                 
                    e.preventDefault();
                    $('#rfp_choose_security_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#rfp_choose_security_summary_list").html('<li><a href="#">You must select the highest level of security clearance that staff supplied to the project will need to have.</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
            }
            else if(selectednumber && ['1','2', '3', '4'].includes(selectednumber)&& !resources)           
            {
                e.preventDefault();
                $('#rfp_choose_security_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#rfp_choose_security_summary_list").html('<li><a href="#">You must enter the number of staffs who will need a lower security and vetting requirement.</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
            }
            else if(selectednumber && ['1','2', '3', '4'].includes(selectednumber)&&  (resources < 0 || resources > (totalQuantityrfp-1)))           
            {
                e.preventDefault();
                $('#rfp_choose_security_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#rfp_choose_security_summary_list").html('<li><a href="#">A Quantity must be between 1 to Quantity('+totalQuantityrfp+') - 1</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
            }
        })

        $('#ca_choose_security_form').on('submit', (e) => {
            var resources='';
            for(var i=0;i<4;i++)
            {
                var value=document.getElementsByClassName("ca_choosesecurity_resources")[i].value
               if(value!=undefined && value!='')   
               {
                resources=value;
               }  
            }  
            var totalQuantityca=$('#totalQuantityca').val();  
            var choosenoption=$('input[name="ccs_ca_choose_security"]:checked').val();   
            var selectednumber=choosenoption?choosenoption.replace(/[^0-9.]/g, ''):null           
            if( $('input:radio[name="ccs_ca_choose_security"]:checked').length == 0)
            {                 
                    e.preventDefault();
                    $('#ca_choose_security_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#ca_choose_security_summary_list").html('<li><a href="#">You must select the highest level of security clearance that staff supplied to the project will need to have.</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
            }
            else if(selectednumber && ['1','2', '3', '4'].includes(selectednumber)&& !resources)  
            {
                e.preventDefault();
                $('#ca_choose_security_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#ca_choose_security_summary_list").html('<li><a href="#">You must enter the number of staffs who will need a lower security and vetting requirement.</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
            }
            else if(selectednumber && ['1','2', '3', '4'].includes(selectednumber)&&  (resources < 0 || resources > (totalQuantityca-1)))              
            {
                e.preventDefault();
                $('#ca_choose_security_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#ca_choose_security_summary_list").html('<li><a href="#">A Quantity must be between 1 to Quantity('+totalQuantityca+') - 1</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
            }
        })

        $('#da_choose_security_form').on('submit', (e) => {
            var resources='';
            for(var i=0;i<4;i++)
            {
                var value=document.getElementsByClassName("da_choosesecurity_resources")[i].value
               if(value!=undefined && value!='')   
               {
                resources=value;
               }  
            }  
            var totalQuantityda=$('#totalQuantityda').val();  
            var choosenoption=$('input[name="ccs_da_choose_security"]:checked').val();   
            var selectednumber=choosenoption?choosenoption.replace(/[^0-9.]/g, ''):null          
            if( $('input:radio[name="ccs_da_choose_security"]:checked').length == 0)
            {                 
                    e.preventDefault();
                    $('#da_choose_security_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#da_choose_security_summary_list").html('<li><a href="#">You must select the highest level of security clearance that staff supplied to the project will need to have.</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
            }
            else if(selectednumber && ['1','2', '3', '4'].includes(selectednumber)&& !resources)  
            {
                e.preventDefault();
                $('#da_choose_security_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#da_choose_security_summary_list").html('<li><a href="#">You must enter the number of staffs who will need a lower security and vetting requirement.</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
            }
            else if(selectednumber && ['1','2', '3', '4'].includes(selectednumber)&&  (resources < 0 || resources > (totalQuantityda-1)))              
            {
                e.preventDefault();
                $('#da_choose_security_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#da_choose_security_summary_list").html('<li><a href="#">A Quantity must be between 1 to Quantity('+totalQuantityda+') - 1</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
            }
        })
});