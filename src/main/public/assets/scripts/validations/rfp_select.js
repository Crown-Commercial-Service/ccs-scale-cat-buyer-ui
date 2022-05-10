
$('input[type="radio"]').on('click change', function(e) {
    if (e.currentTarget.value === 'Yes') {
       $('#conditional-rfp_radio_security_confirmation').fadeIn();
    } else {
        $('#conditional-rfp_radio_security_confirmation').hide();
    }
});
