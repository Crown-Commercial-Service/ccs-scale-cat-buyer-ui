document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById("ccs_ca_procurement_lead") !== null) {
        document.getElementById('ccs_ca_procurement_lead').addEventListener('change', function (event) {
            event.preventDefault();
            $.ajax({
                url: "/ca/users-procurement-lead?id=" + event.target.value,
                type: "GET",
                contentType: "application/json",
            }).done(function (result) {
                setUserDetails(result);
            }).fail((res) => {
                let div_email = document.getElementById('ca-lead-email');
                div_email.innerText = '';
                let div_tel = document.getElementById('ca-lead-telephone');
                div_tel.innerText = '';

            })
        });
        const setUserDetails = (user) => {
            let div_email = document.getElementById('ca-lead-email');
            div_email.innerText = user.userName;
            let div_tel = document.getElementById('ca-lead-telephone');
            div_tel.innerText = '1';
            let div_email_value = document.getElementById('ca_procurement_lead_input');
            div_email_value.value = user.userName;

        };
    }
});

$('.add').addClass('ccs-dynaform-hidden');