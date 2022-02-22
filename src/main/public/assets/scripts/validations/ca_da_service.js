
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

