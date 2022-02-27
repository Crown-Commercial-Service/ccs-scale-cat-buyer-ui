
const weight_whole = $('.weight_vetting_whole');
const weight_partial = $('.weight_vetting_partial');

const  weight_whole_len = $('.weight_vetting_whole').length + 1;
const weight_partial_len = $('.weight_vetting_partial').length + 1;

for(var a =0; a< document.getElementsByClassName('weight_vetting_whole').length; a++){
    document.getElementsByClassName('weight_vetting_whole')[a].checked = true;
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

const vetting_partial = document.getElementsByClassName('weight_vetting_partial');
const vetting_partial_len = vetting_partial.length;



const ErrorMessageStorage = [];

//For vetting_partial

for(var a =0; a <  vetting_partial_len; a++){
    if(vetting_partial[a].value <= 0 && vetting_partial[a].value !== ""){
        document.getElementsByClassName('weight_vetting_partial')[a].classList.add('govuk-input--error')
        document.getElementsByClassName('weight_vetting_partial_t')[a].innerHTML = 'The weighting value(s) for the service capabilities must be a positive integer'
        ErrorMessageStorage.push(true);
    }
}


//Vetting_whole

const vetting_whole = document.getElementsByClassName('weight_vetting_whole');
const vetting_whole_len = vetting_whole.length;


for(var a =0; a <  vetting_whole_len ; a++){
    if(vetting_whole[a].value <= 0 && vetting_whole[a].value !== ""){
        document.getElementsByClassName('weight_vetting_whole')[a].classList.add('govuk-input--error')
        document.getElementsByClassName('weight_vetting_whole_t')[a].innerHTML = 'The weighting value(s) for the service capabilities must be a positive integer'
        ErrorMessageStorage.push(true);
    }
}





var total = 0;
var checkforEmptyBoxes = [];
const TotalWeightageBox = document.getElementsByClassName('weight');




for(var i = 0; i < TotalWeightageBox.length; i++){
    if(TotalWeightageBox[i].value != ''){
        total = total + Number(TotalWeightageBox[i].value);
    }
}

for(var i = 0; i < TotalWeightageBox.length; i++){
    if(TotalWeightageBox[i].value == ''){
        checkforEmptyBoxes.push(true);
    }
}




if(checkforEmptyBoxes.length == TotalWeightageBox.length){
    e.preventDefault();
    $('.govuk-error-summary__title').text('There is a problem');

    $("#summary_list").html('<li><a href="#">Atleast one of the service capability must be selected</a></li> ');
    $([document.documentElement, document.body]).animate({
        scrollTop: $("#summary_list").offset().top
    }, 1000);     

    $('#service_capability_error_summary').removeClass('hide-block');
}



else if(total !== 100){
    e.preventDefault();
    $('.govuk-error-summary__title').text('There is a problem');

    $("#summary_list").html('<li><a href="#">The weighting value(s) for the service capabilities must be equal to 100%</a></li> ');
    $([document.documentElement, document.body]).animate({
        scrollTop: $("#summary_list").offset().top
    }, 1000);     

    $('#service_capability_error_summary').removeClass('hide-block');
}
else if(ErrorMessageStorage.length > 0){
    e.preventDefault();
  $('.govuk-error-summary__title').text('There is a problem');

    $("#summary_list").html('<li><a href="#">There is a problem with the input provided</a></li>');
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
