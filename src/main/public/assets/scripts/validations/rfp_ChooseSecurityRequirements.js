document.addEventListener('DOMContentLoaded', () => {

    $('input:radio[name="ccs_rfp_choose_security"]').on('change', function()
        {
            if ($(this).is(':checked')) {                         
               $('.rfp_choosesecurity_resources').val(" ")
            }
        });
             var value_rfp_=document.getElementById("ccs_rfp_resources")  
            value_rfp_.addEventListener('keydown', function(event) {
                
                // Checking for Backspace.
                if (event.keyCode == 8) {
                    debugger
                    $('.rfp_choosesecurity_resources').val(" ")
                }
                // Checking for Delete.
                if (event.keyCode == 46) {
                    debugger
                    $('.rfp_choosesecurity_resources').val(" ")
                }
            });          
       
        $('#rfp_choose_security_form').on('submit', (e) => {
            debugger
            var resources_rfp='';          
            for(var i=0;i<4;i++)
            {
                var value_rfp=document.getElementsByClassName("rfp_choosesecurity_resources")[i].value
               if(value_rfp!=undefined && value_rfp!='')   
               {
                resources_rfp=value_rfp;
               }  
            }            
            var totalQuantityrfp=$('#totalQuantityrfp').val();  
            var choosenoption_rfp=$('input[name="ccs_rfp_choose_security"]:checked').val();   
            var selectednumber_rfp=choosenoption_rfp?choosenoption_rfp.replace(/[^0-9.]/g, ''):null   
            if( $('input:radio[name="ccs_rfp_choose_security"]:checked').length == 0)
            {                 
                    e.preventDefault();
                    $('#rfp_choose_security_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#rfp_choose_security_summary_list").html('<li><a href="#">You must select the highest level of security clearance that staff supplied to the project will need to have.</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
            }
            else if(selectednumber_rfp && ['1','2', '3', '4'].includes(selectednumber_rfp)&& !resources_rfp)           
            {
                e.preventDefault();
                $('#rfp_choose_security_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#rfp_choose_security_summary_list").html('<li><a href="#">You must enter the number of staffs who will need a lower security and vetting requirement.</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
            }
            else if(selectednumber_rfp && ['1','2', '3', '4'].includes(selectednumber_rfp)&&  (resources_rfp < 0 || resources_rfp > (totalQuantityrfp-1)))           
            {
                e.preventDefault();
                $('#rfp_choose_security_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#rfp_choose_security_summary_list").html('<li><a href="#">A Quantity must be between 1 to Quantity('+totalQuantityrfp+') - 1</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
            }
        })
});