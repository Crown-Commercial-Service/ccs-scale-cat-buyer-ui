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
                div_email.innerText = 'User is not a member or is not available in Jagger';
                let div_tel = document.getElementById('lead-telephone');
                div_tel.innerText = 'User is not a member or is not available in Jagger';
            })
        });
        const setUserDetails = (user) => {
            let div_email = document.getElementById('lead-email');
            div_email.innerText = user.email;
            let div_tel = document.getElementById('lead-telephone');
            div_tel.innerText = user.telephone;
        };
    }
});