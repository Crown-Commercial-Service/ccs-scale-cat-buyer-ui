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
        $('input:radio[name="ccs_ca_choose_security"]').on('change', function()
        {
            if ($(this).is(':checked')) {                         
               $('.da_choosesecurity_resources').val(" ")
            }
        });
});