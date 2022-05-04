document.addEventListener('DOMContentLoaded', () => {

    $('input:radio[name="ccs_rfp_choose_security"]').change(
        function(){
            if ($(this).is(':checked')) {               
               $('#ccs_rfp_resources').val(" ")
            }
        });
});