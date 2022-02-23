const weight_whole = $('.weight_vetting_whole');
const weight_partial = $('.weight_vetting_partial');

const  weight_whole_len = $('.weight_vetting_whole').length + 1;
const weight_partial_len = $('.weight_vetting_partial').length + 1;

for(var a =1; a < $('.whole_radio').length + 1; a++){
    $(`#whole_weightage_${a}`).attr('checked', 'checked');
}

for(var a =1 ; a < weight_whole_len; a++ ){
    if($(`#weight_vetting_whole${a}`).val() !== "" ){
        const WholeWeightageCluster = "#whole_weightage_"+a
        $(WholeWeightageCluster).attr('checked', 'checked');
        const WholeclusterDIV ='#whole_cluster_'+a;
        $(WholeclusterDIV).fadeIn();
    }
}


document.addEventListener('DOMContentLoaded', () => {

const TotalFieldOnScreen= $('.govuk-radios__input').length /2 + 1;


/**
 * @FADE_IN_AND_OUT
 */
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

    
const weight_whole = $('.weight_vetting_whole');
const weight_partial = $('.weight_vetting_partial');


const  weight_whole_len = $('.weight_vetting_whole').length + 1;
const weight_partial_len = $('.weight_vetting_partial').length + 1;


const whole_weightage_errors = [];


    for(var a =1 ; a < weight_whole_len; a++ ){
        if($(`#weight_vetting_whole${a}`).val() <= 0 && $(`#weight_vetting_whole${a}`).val() !== "" ){
            $(`#weight_vetting_whole${a}`).addClass('govuk-input--error');
            $(`#whole-weightage-error-${a}`).html('The weighting value(s) for the service capabilities must be a positive integer')
            whole_weightage_errors.push(true)
        }
    }


    const partial_weightage_errors = [];
    for(var a =1 ; a < weight_partial_len; a++ ){
        if($(`#weight_vetting_partial${a}`).val() <= 0 && $(`#weight_vetting_partial${a}`).val() != "" ){
            $(`#weight_vetting_partial${a}`).addClass('govuk-input--error');
            $(`#partial-weightage-error-${a}`).html('The weighting value(s) for the service capabilities must be a positive integer')
            partial_weightage_errors.push(true)
        }
    }

    if(partial_weightage_errors.length > 0){
        e.preventDefault();
    }

    if(whole_weightage_errors.length > 0){
        e.preventDefault();
    }

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
        e.preventDefault();
        $('.govuk-error-summary__title').text('There is a problem');

        $("#summary_list").html('<li><a href="#">The weighting value(s) for the service capabilities must = 100%</a></li>');
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#summary_list").offset().top
        }, 1000);     


        $('#service_capability_error_summary').removeClass('hide-block');
    }
    else{
        $('#ccs_ca_menu_tabs_form').submit();
    }










})









});