document.addEventListener('DOMContentLoaded', () => {
        $('input:radio[name="ccs_da_choose_security"]').on('change', function()
        {
            if ($(this).is(':checked')) {                         
               $('.da_choosesecurity_resources').val(" ")
            }
            $('#da_choose_security_error_summary').addClass('hide-block');
            const textboxes=document.querySelectorAll('[id^="ccs_da_resources_"]')
            for (var a = 0; a < textboxes.length; a++) {
                ccsZremoveErrorMessage(textboxes[a]);
            }

        });
        var value_da_=document.getElementsByClassName("da_choosesecurity_resources")  
        for (var i = 0; i < value_da_.length; i++) {
            
       value_da_[i].addEventListener('keydown', function(event) {
           
           // Checking for Backspace.
           if (event.keyCode == 8) {
               
               $('.da_choosesecurity_resources').val(" ")
           }
           // Checking for Delete.
           if (event.keyCode == 46) {
               
               $('.da_choosesecurity_resources').val(" ")
           }

           if (event.keyCode == 69) {
               
            event.preventDefault();return;
        }
        if (event.key === '.') { event.preventDefault(); return;}
        if((event.ctrlKey || event.metaKey) && event.keyCode==86){ event.preventDefault(); return;}
       });          
        }
        $('#da_choose_security_form').on('submit', (e) => {
            var resources_da='';
            let index=-1;
            
            for(var i=0;i<4;i++)
            {
                var value_da=document.getElementsByClassName("da_choosesecurity_resources")[i].value
               if(value_da!=undefined && value_da!=" " && value_da!='')   
               {
                resources_da=value_da;
                index=i+2;
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
                ccsZaddErrorMessage(document.getElementsByClassName("da_choosesecurity_resources")[selectednumber_da-1], 'A Quantity must be specified');
                $('#da_choose_security_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                let position=Number(selectednumber_da)+1
                $("#da_choose_security_summary_list").html('<li><a href="#ccs_da_resources_'+position+'">A Quantity must be specified</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
            }
            else if(selectednumber_da && ['1','2', '3', '4'].includes(selectednumber_da)&&  (resources_da < 0 || resources_da > (totalQuantityda-1)))              
            {
                e.preventDefault();
                ccsZaddErrorMessage(document.getElementsByClassName("da_choosesecurity_resources")[index-2], 'A Quantity must be between 0 to ['+totalQuantityda+'] - 1');
                $('#da_choose_security_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#da_choose_security_summary_list").html('<li><a href="#ccs_da_resources_'+index+'">A Quantity must be between 0 to ['+totalQuantityda+'] - 1</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
            }
        })
});