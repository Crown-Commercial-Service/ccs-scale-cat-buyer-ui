document.addEventListener('DOMContentLoaded', () => {
const TotalFieldOnScreen= $('.govuk-radios__input').length /2 + 1;




for(var a =0; a < TotalFieldOnScreen; a++){

    const WholeclusterDIV ='#whole_cluster_'+a;
    const PartialClusterDIV = '#partial_cluster_'+a;

    const WholeWeightageCluster = "#whole_weightage_"+a
    
    $(WholeWeightageCluster).attr('checked', 'checked');
    $(PartialClusterDIV).fadeOut();
    $(WholeclusterDIV).fadeOut();
    
    
        $('#whole_weightage_'+a).click(function () {
            if ($(this).is(':checked')) {
               $(PartialClusterDIV).fadeOut();
               $(WholeclusterDIV).fadeIn();
            }
        });
    
        $('#partial_weightage_'+a).click(function () {
            if ($(this).is(':checked')) {
                $(PartialClusterDIV).fadeIn();
               $(WholeclusterDIV).fadeOut();
            }
        });
    
}




//ccs_ca_menu_tabs_form

$('#ccs_ca_menu_tabs_form').on('submit', (e)=> {
    var total = 0;
    const TotalWeightageBox = $('.weight');
    let fieldCheck = "",
    errorStore = [];

    for(var i = 0; i < TotalWeightageBox.length; i++){
        const selector = $(TotalWeightageBox[i]);
        if(selector.val() !== ''){
            total = total + Number(selector.val());
        }
        else{
            total = total;
        }
    }

    if(total < 100){
        alert('forms values must be equal to 100');
        e.preventDefault();
        let term_field = document.getElementById('weight_vetting_partial1');
         fieldCheck = [term_field.id, 'You must add information in all fields.'];
         errorStore.push(fieldCheck);
        ccsZPresentErrorSummary(errorStore);
       
        
    }
    else{
        $('#ccs_ca_menu_tabs_form').submit();
    }

})






});