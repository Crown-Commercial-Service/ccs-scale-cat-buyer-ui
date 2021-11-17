document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById("ccs_rfi_procurement_lead") !== null) {
        document.getElementById('ccs_rfi_procurement_lead').addEventListener('change', function (event) {
            event.preventDefault();
            $.ajax({
                url: "/rft/users-procurement-lead?id="+event.target.value,
                type: "GET",
                contentType: "application/json",
            }).done(function (result) {
                setUserDetails(result);
            }).fail((res) => {
                let div_email = document.getElementById('lead-email');
                div_email.innerText = '';
                let div_tel = document.getElementById('lead-telephone');
                div_tel.innerText = '';
                
            })
        });
        const setUserDetails = (user) => {
            let div_email = document.getElementById('lead-email');
            div_email.innerText = user.email;
            let div_tel = document.getElementById('lead-telephone');
            div_tel.innerText = user.telephone;
            let div_email_value = document.getElementById('rfi_procurement_lead_input');
            div_email_value.value = user.email;
            
        };
    }
});

$('.add').addClass('ccs-dynaform-hidden');