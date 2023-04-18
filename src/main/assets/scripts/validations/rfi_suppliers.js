document.addEventListener('DOMContentLoaded', () => {

    if (document.getElementById("ccs-rfi-suppliers-form") !== null) {

        let supplier_page1 = document.getElementById("supplier-page1");
        let supplier_page2 = document.getElementById("supplier-page2");
        let supplier_page3 = document.getElementById("supplier-page3");

        supplier_page2.classList.add("ccs-dynaform-hidden");
        supplier_page3.classList.add("ccs-dynaform-hidden");

        document.getElementById("rfi_page-1-next-link").addEventListener('click', (e) => {
            e.preventDefault();
            supplier_page1.classList.add("ccs-dynaform-hidden");
            supplier_page2.classList.remove("ccs-dynaform-hidden")
        });

        document.getElementById("rfi_page-2-previous-link").addEventListener('click', (e) => {
            e.preventDefault();
            supplier_page1.classList.remove("ccs-dynaform-hidden");
            supplier_page2.classList.add("ccs-dynaform-hidden")
        });

        document.getElementById("rfi_page-2-next-link").addEventListener('click', (e) => {
            e.preventDefault();
            supplier_page2.classList.add("ccs-dynaform-hidden")
            supplier_page3.classList.remove("ccs-dynaform-hidden");
        });

        document.getElementById("rfi_page-3-previous-link").addEventListener('click', (e) => {
            e.preventDefault();
            supplier_page3.classList.add("ccs-dynaform-hidden")
            supplier_page2.classList.remove("ccs-dynaform-hidden");           
        });
        
    }

});