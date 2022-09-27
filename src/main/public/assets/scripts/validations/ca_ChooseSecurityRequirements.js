document.addEventListener('DOMContentLoaded', () => {
        $('input:radio[name="ccs_ca_choose_security"]').on('change', function()
        {
            if ($(this).is(':checked')) {                         
               $('.ca_choosesecurity_resources').val(" ")
            }
            $('#ca_choose_security_error_summary').addClass('hide-block');
            const textboxes=document.querySelectorAll('[id^="ccs_ca_resources_"]')
            for (var a = 0; a < textboxes.length; a++) {
                ccsZremoveErrorMessage(textboxes[a]);
            }
        });
        var value_ca_=document.getElementsByClassName("ca_choosesecurity_resources")  
        for (var i = 0; i < value_ca_.length; i++) {
            
       value_ca_[i].addEventListener('keydown', function(event) {
           
           // Checking for Backspace.
           if (event.keyCode == 8) {
               
               $('.ca_choosesecurity_resources').val(" ")
           }
           // Checking for Delete.
           if (event.keyCode == 46) {
               
               $('.ca_choosesecurity_resources').val(" ")
           }
           if (event.keyCode == 69) {
               
            event.preventDefault();return;
        }
        if (event.key === '.') { event.preventDefault(); return;}
        if((event.ctrlKey || event.metaKey) && event.keyCode==86){ event.preventDefault(); return;}
       });          
        }
        $('#ca_choose_security_form').on('submit', (e) => {
            
            var resources_ca='';
            var index=-1;
            for(var i=0;i<4;i++)
            {
                var value_ca=document.getElementsByClassName("ca_choosesecurity_resources")[i].value
               if(value_ca!=undefined && value_ca!=" " && value_ca!='')   
               {
                resources_ca=value_ca;
                index=i+2;
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
                ccsZremoveErrorMessage(document.getElementsByClassName("ca_choosesecurity_resources")[selectednumber_ca-1]);
                ccsZaddErrorMessage(document.getElementsByClassName("ca_choosesecurity_resources")[selectednumber_ca-1], 'You must enter the number of staff requiring the highest level of clearance.');
                $('#ca_choose_security_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                let position=Number(selectednumber_ca)+1
                $("#ca_choose_security_summary_list").html('<li><a href="#ccs_ca_resources_'+position+'">You must enter the number of staff requiring the highest level of clearance.</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
            }
            else if(selectednumber_ca && ['1','2', '3', '4'].includes(selectednumber_ca)&&  (resources_ca < 0 || resources_ca > (totalQuantityca-1)))              
            {
                e.preventDefault();
                ccsZremoveErrorMessage(document.getElementsByClassName("ca_choosesecurity_resources")[index-2]);
                ccsZaddErrorMessage(document.getElementsByClassName("ca_choosesecurity_resources")[index-2], 'A Quantity must be between 0 to ['+totalQuantityca+'] - 1');
                $('#ca_choose_security_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#ca_choose_security_summary_list").html('<li><a href="#ccs_ca_resources_'+index+'">A Quantity must be between 1 to Quantity('+totalQuantityca+') - 1</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
            }
        })    
});