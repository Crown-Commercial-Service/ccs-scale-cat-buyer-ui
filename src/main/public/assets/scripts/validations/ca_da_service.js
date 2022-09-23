var allListOfHeading = new Set();

for (var a = 0; a < document.getElementsByClassName('headings').length; a++) {
    allListOfHeading.add(document.getElementsByClassName('headings')[a].innerHTML);
}

allListOfHeading = [...allListOfHeading].map(items => {
    return {
        partial: items.split(" ").join('_').concat('_partial'),
        whole: items.split(" ").join('_').concat('_whole')
    }
})

const weight_whole_len = $('.weight_vetting_whole').length + 1;
const weight_partial_len = $('.weight_vetting_partial').length + 1;
const weight = $('.weight');

const TotalFieldOnScreen = $('.govuk-radios__input').length / 2 + 1;

for (var a = 0; a < document.getElementsByClassName('weight_vetting_whole').length; a++) {
    document.getElementsByClassName('weight_vetting_whole')[a].checked = true;
}
var itemSubText = '';
var itemText = '';
var tabLinks = '';
var totalWeighting = '';

var daServiceCapaTabLinks = document.querySelectorAll('.da-service-capabilities');
var caServiceCapaTabLinks = document.querySelectorAll('.ca-service-capabilities');

if (daServiceCapaTabLinks !== null && daServiceCapaTabLinks.length > 0) {
    tabLinks = daServiceCapaTabLinks;
    ccsTabMenuNaviation();
    totalWeighting = $('#da_total_weighting');
    //fadeInFadeOut(0);
}
else if (caServiceCapaTabLinks !== null && caServiceCapaTabLinks.length > 0) {
    tabLinks = caServiceCapaTabLinks;
    ccsTabMenuNaviation();
    totalWeighting = $('#ca_total_weighting');
   // fadeInFadeOut(0);
}

// chandeshwar 
document.addEventListener('DOMContentLoaded', () => {

    if (tabLinks !== null && tabLinks.length > 0) {

        itemSubText = document.getElementsByClassName('table-item-subtext')[0];;
        itemText = tabLinks[0].getElementsByTagName('a')[0].childNodes[0].data

        if (itemText != null && itemText != '') {

            itemText = itemText.replaceAll(" ", "_");
            weightVettingWholePartialOnClick(itemText);
        }
        Array.from(tabLinks).forEach(link => {

            link.addEventListener('click', function (e) {
                let currentTarget = e.currentTarget;
                let clicked_index = $(this).index();

                itemSubText = currentTarget.getElementsByClassName('table-item-subtext')[0];
                itemText = tabLinks[clicked_index].getElementsByTagName('a')[0].childNodes[0].data

                itemText = itemText.replaceAll(" ", "_");
                weightVettingWholePartialOnClick(itemText);
                fadeInFadeOut(clicked_index);
                return false;
            });
        });
    }

    weight.on('keydown', (event) => {
        if (event.key === '.' || event.keyCode === 69)
            event.preventDefault();
    });

    function updateTotalAddedWeight() {
        
        let weightCount = 0
        for (index = 0; index < weight.length; ++index) {
            if (weight[index].value != "" && weight[index].value>0 && weight[index].value<=100)
                weightCount = weightCount + Number(weight[index].value);
        }
        let buildText = weightCount + ' of 100% total weighting for service capabilities'
        totalWeighting.text(buildText);
    }
    
    function weightVettingWholePartialOnClick(category) {

        let vettingPartial = 'weight_vetting_partial' + category;
        const vettingWhole2 = 'weight_vetting_whole_' + category

        for (var a = 1; a < weight_whole_len; a++) {

            let vettingWhole = 'weight_vetting_whole_' + category + a;
            let vettingWholeT = category +'whole'+ a;

            let vetWhole = $(`#${vettingWhole}`);

            vetWhole.on('blur', () => {

                if (vetWhole.val() != undefined && vetWhole.val() !== null && vetWhole.val() !== "") {
                    clearInputData(weight_partial_len, vettingPartial);

                    if (isValidInputData(vettingWhole, vettingWholeT, vetWhole.val(),vetWhole[0].id))
                    {
                        
                        updateTotalAddedWeight();
                        itemSubText.innerHTML = '[ ' + vetWhole.val() + ' %' + ' ]';
                    }
                        
                }
                else if (vetWhole.val() != undefined && vetWhole.val() == "") {
                    
                    itemSubText.innerHTML = '[ ' + 0 + ' %' + ' ]';
                    $(`#${vettingWhole}`).removeClass('govuk-input--error');
                    $(`.${vettingWholeT}`).text('');
                    updateTotalAddedWeight();
                }

            });
        }
        for (var a = 1; a < weight_partial_len; a++) {

            let weightId = vettingPartial + a;
            let vetPartial = $(`#${vettingPartial}${a}`);
            let weightT = category + a;

            vetPartial.on('blur', () => {

                clearWholeCluster(category);

                if (vetPartial.val() != undefined && vetPartial.val() !== null && vetPartial.val() !== "") {
                    clearInputData(weight_whole_len, vettingWhole2);
                    if (isValidInputData(weightId, weightT, vetPartial.val(),vetPartial[0].id))
                    {
                        updateVettingPartial(vettingPartial);
                        
                        updateTotalAddedWeight();
                    }
                       
                }
                else if (vetPartial.val() != undefined && vetPartial.val() == "") {
                    
                    updateVettingPartial(vettingPartial);
                    updateTotalAddedWeight();
                    $(`#${weightId}`).removeClass('govuk-input--error');
                    $(`.${weightT}`).text('');
                }

            });
        }
    }

    function clearWholeCluster(category) {
        for (var a = 1; a < weight_whole_len; a++) {
            let vettingWhole = 'weight_vetting_whole_' + category + a;
            let vetWhole = $(`#${vettingWhole}`);
            if (vetWhole != undefined && vetWhole != null)
                vetWhole.text('');
        }
    }

    function clearInputData(weightLength, idName) {
        for (var a = 1; a < weightLength; a++) {
            $(`#${idName}${a}`).val('');
        }
    }


    function updateVettingPartial(vettingPartial) {
        let value = 0;
        for (var a = 1; a < weight_partial_len; a++) {
            let vetPartial = $(`#${vettingPartial}${a}`);
            if (vetPartial.val() != undefined && vetPartial.val() != ''&& vetPartial.val()>0 &&vetPartial.val()<=100)
                value = value + Number(vetPartial.val());
        }
        itemSubText.innerHTML = '[ ' + value + ' %' + ' ]';
    }
   
    /**
     * @FADE_IN_AND_OUT
     */
    for (var a = 0; a < TotalFieldOnScreen; a++) {
        const WholeclusterDIV = '#whole_cluster_' + a;
        const PartialClusterDIV = '#partial_cluster_' + a;
        //const WholeWeightageCluster = "#whole_weightage_" + a
        //$(PartialClusterDIV).fadeOut();
        //$(WholeclusterDIV).fadeOut();
        //$('#whole_weightage_' + a).prop("checked",true);

        if ($('#whole_weightage_' + a).is(':checked')) {
               
            $(PartialClusterDIV).fadeOut();
            $(WholeclusterDIV).fadeIn();
        }  
        else if ($('#partial_weightage_' + a).is(':checked')) {
               
            $(PartialClusterDIV).fadeIn();
            $(WholeclusterDIV).fadeOut();
        }  
        else
        {
            $(PartialClusterDIV).fadeOut();
            $(WholeclusterDIV).fadeOut();            
        }      
        
        $('#whole_weightage_' + a).click(function () {
           
            if ($(this).is(':checked')) {
               
                $(PartialClusterDIV).fadeOut();
                $(WholeclusterDIV).fadeIn();
            }
        });
        $('#partial_weightage_' + a).click(function () {
           
            if ($(this).is(':checked')) {
               
                $(PartialClusterDIV).fadeIn();
                $(WholeclusterDIV).fadeOut();
            }
        });
    }

    function isValidInputData(weightClassName, weightPartialClassName, value,id) {
        var reg = /^\d+$/;
        if (value <= 0) {         
            $(`#${weightClassName}`).addClass('govuk-input--error');
            $(`.${weightPartialClassName}`).text('Please enter a positive integer');
            $('#service_capability_error_summary').removeClass('hide-block');
            $('.govuk-error-summary__title').text('There is a problem');
            $("#summary_list").html('<li><a href="#'+id+'">The weighting value(s) for the service capabilities must be a positive integer</a></li> ');
            $('html, body').animate({ scrollTop: 0 }, 'fast');
                   }
        else if (Number(value) > 100) {           
            $(`#${weightClassName}`).addClass('govuk-input--error');
            $(`.${weightPartialClassName}`).text('Please enter an integer >0 and <=100 %');
            $('#service_capability_error_summary').removeClass('hide-block');
            $('.govuk-error-summary__title').text('There is a problem');
            $("#summary_list").html('<li><a href="#'+id+'">The weighting value(s) for the service capabilities must be less or equal 100 %</a></li> ');
            $('html, body').animate({ scrollTop: 0 }, 'fast');
                }
        else if(!value.match(reg))
        {  $(`#${weightClassName}`).addClass('govuk-input--error');
        $(`.${weightPartialClassName}`).text('Enter whole numbers only');       
            $('#service_capability_error_summary').removeClass('hide-block');
            $('.govuk-error-summary__title').text('There is a problem');
            $("#summary_list").html('<li><a href="#">Enter whole numbers only</a></li>');
            $('html, body').animate({ scrollTop: 0 }, 'fast');
                 }
       else {
            
            $(`#${weightClassName}`).removeClass('govuk-input--error');
            $(`.${weightPartialClassName}`).text('');
            $('#service_capability_error_summary').addClass('hide-block');
            $('.govuk-error-summary__title').text('');
            $("#summary_list").html('');
            return true;
        }
        return false;
    }

    fadeInFadeOut(0);
    //ccs_ca_menu_tabs_form

    $('#ccs_ca_menu_tabs_form').on('submit', (e) => {
        let negativewholeerror=[], greaterwholeerror=[],alphabetwholeerror=[];
        let negativepartialerror=[], greaterpartialerror=[],alphabetpartialerror=[];
        var isFormValid = true;
        var totalWeightingPercentage = totalWeighting.text().trim().substring(0, 4).match(/\d/g);
        totalWeightingPercentage = totalWeightingPercentage.join("");
        let intWeightingPercentage = Number(totalWeightingPercentage);
        var checkforEmptyBoxes = [];

        const TotalWeightageBox = document.getElementsByClassName('weight');
        for (var i = 0; i < TotalWeightageBox.length; i++) {
            if (TotalWeightageBox[i].value == '') {
                checkforEmptyBoxes.push(true);
            }
        }
        var reg = /^\d+$/;
        for (var a = 1; a < weight_whole_len; a++) {
            const classTarget = document.getElementsByClassName("weight_vetting_whole")[a - 1];
            if (classTarget.value <= 0 && classTarget.value !== '') {
                
                negativewholeerror.push(true)
            }
            else if (classTarget.value > 100 && classTarget.value != '')            
            {
                greaterwholeerror.push(true)
            }
            else if (!classTarget.value.match(reg) && classTarget.value != '')           
                {
                    alphabetwholeerror.push(true)
                }
        }
        for (var a = 1; a < weight_partial_len; a++) {
            const classTarget = document.getElementsByClassName("weight_vetting_partial")[a - 1];
            if (classTarget.value <= 0 && classTarget.value !== '') {
                
                 negativepartialerror.push(true)
            }
            else if (classTarget.value > 100 && classTarget.value != '')            
            {
                greaterpartialerror.push(true)
            }
            else if (!classTarget.value.match(reg) && classTarget.value != '')           
                {
                    alphabetpartialerror.push(true)
                }         
        }
        if(negativewholeerror.length>0 || greaterwholeerror.length>0 ||alphabetwholeerror.length>0
        ||negativepartialerror.length>0 || greaterpartialerror.length>0 ||alphabetpartialerror.length>0)
        {
            
            isFormValid = false;
            e.preventDefault()
               switch (true) {
            case ((negativewholeerror.length>0 || negativepartialerror.length>0) &&(greaterwholeerror.length>0 || greaterpartialerror.length>0) && (alphabetwholeerror.length>0 || alphabetpartialerror.length>0)):

                e.preventDefault();
                $('#service_capability_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#summary_list").html('<li><a href="#">The input field must be a number less than or equal to 100 </a></li><br><li><a href="#">The input field must be greater than 0</a></li><br><li><a href="#">The input field must be a number</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
                break;
            case ((negativewholeerror.length>0 || negativepartialerror.length>0) && (greaterwholeerror.length>0 || greaterpartialerror.length>0)):
                
                e.preventDefault();
                $('#service_capability_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#summary_list").html('<li><a href="#">The input field must be a number less than 100</a></li><br><li><a href="#">The input field  must be  greater than 0</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
                break;
            case ((negativewholeerror.length>0 || negativepartialerror.length>0) && (alphabetwholeerror.length>0 || alphabetpartialerror.length>0)):
                
                e.preventDefault();
                $('#service_capability_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#summary_list").html('<li><a href="#">The input field must be must be  greater than 0</a></li><br><li><a href="#">The input field must be a number</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
                break;
            case ((greaterwholeerror.length>0 || greaterpartialerror.length>0) && (alphabetwholeerror.length>0 || alphabetpartialerror.length>0)):
                
                e.preventDefault();
                $('#service_capability_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#summary_list").html('<li><a href="#">The input field should  must be a number less than 100</a></li><br><li><a href="#">The input field must be a number</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
                break;
            case ((negativewholeerror.length>0 || negativepartialerror.length>0)):
                
                e.preventDefault();
                $('#service_capability_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#summary_list").html('<li><a href="#">The input field must be  greater than 0</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
                break;
            case ((alphabetwholeerror.length>0 || alphabetpartialerror.length>0)):
                
                e.preventDefault();
                $('#service_capability_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#summary_list").html('<li><a href="#">The input field must be a number</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
                break;
            case ((greaterwholeerror.length>0 || greaterpartialerror.length>0)):
                
                e.preventDefault();
                $('#service_capability_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#summary_list").html('<li><a href="#">The input field must be a number less than 100</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
                break;
            default:
                console.log("If all else fails");
                break;
        }
        
        }
       else  if (intWeightingPercentage != 100) {
            isFormValid = false;
            e.preventDefault();
            $('#service_capability_error_summary').removeClass('hide-block');
            $('.govuk-error-summary__title').text('There is a problem');

            $("#summary_list").html('<li><a href="#">The weighting value(s) for the service capabilities must be equal to 100%</a></li> ');
            $([document.documentElement, document.body]).animate({
                scrollTop: $("#summary_list").offset().top
            }, 1000);
        }
      else  if (checkforEmptyBoxes.length == TotalWeightageBox.length) {
            isFormValid = false;
            e.preventDefault();
           $('#service_capability_error_summary').removeClass('hide-block');
            $('.govuk-error-summary__title').text('There is a problem');

            $("#summary_list").html('<li><a href="#">Atleast one of the service capability must be selected</a></li> ');
            $([document.documentElement, document.body]).animate({
                scrollTop: $("#summary_list").offset().top
            }, 1000);

        
        }

        else if(isFormValid)
            $('#ccs_ca_menu_tabs_form').submit();

    })
});

function fadeInFadeOut(clickedIndex )
    {
        let index = parseInt(clickedIndex);
        const InputFieldSelector_partial = document.getElementsByClassName(allListOfHeading[index].whole)[0];
        //const Name = InputFieldSelector_partial?.getAttribute('class');
        const Value = InputFieldSelector_partial?.value;

        if (Value != undefined && Value != "") {
            $(`.${allListOfHeading[index].whole}_div`)?.fadeIn();
            $(`.${allListOfHeading[index].partial}_div`)?.fadeOut(); 
            $(`#whole_weightage_${index+1}`).prop('checked', true);
            $(`#partial_weightage_${index+1}`).prop('checked', false);
        }
        else 
        {
           let inputFields=  $(`.${allListOfHeading[index].partial}`) 
           let isValue = false;
            for (let index = 0; index < inputFields.length; index++) {
               if(inputFields[index].value !=undefined && inputFields[index].value !="")
               {
                isValue = true;
                break;
               }               
            }
            if(isValue)
            {
                $(`.${allListOfHeading[index].partial}_div`)?.fadeIn();
                $(`.${allListOfHeading[index].whole}_div`)?.fadeOut();
                $(`#partial_weightage_${index+1}`).prop('checked', true);
                $(`#whole_weightage_${index+1}`).prop('checked', false);
            }
            else{
                $(`.${allListOfHeading[index].partial}_div`)?.fadeOut();
                $(`.${allListOfHeading[index].whole}_div`)?.fadeOut();
                $(`#partial_weightage_${index+1}`).prop('checked', false);
                $(`#whole_weightage_${index+1}`).prop('checked', false);
            }
    }
}

const ccsZDAServiceCap = (e) => {
    let negativewholeerror=[], greaterwholeerror=[],alphabetwholeerror=[];zerowholeerror=[];
    let negativepartialerror=[], greaterpartialerror=[],alphabetpartialerror=[];zeropartialerror=[];
    var isFormValid = true;
    var totalWeightingPercentage = totalWeighting.text().trim().substring(0, 4).match(/\d/g);
    totalWeightingPercentage = totalWeightingPercentage.join("");
    let intWeightingPercentage = Number(totalWeightingPercentage);
    var checkforEmptyBoxes = [];

    const TotalWeightageBox = document.getElementsByClassName('weight');
    for (var i = 0; i < TotalWeightageBox.length; i++) {
        if (TotalWeightageBox[i].value == '') {
            checkforEmptyBoxes.push(true);
        }
    }
    var reg = /^\d+$/;
    for (var a = 1; a < weight_whole_len; a++) {
        const classTarget = document.getElementsByClassName("weight_vetting_whole")[a - 1];
        if (classTarget.value == 0 && classTarget.value !== ''){
            zerowholeerror.push(true);
        }
        else if (classTarget.value <= 0 && classTarget.value !== '') {
            
            negativewholeerror.push(true)
        }
        else if (classTarget.value > 100 && classTarget.value != '')            
        {
            greaterwholeerror.push(true)
        }
        else if (!classTarget.value.match(reg) && classTarget.value != '')           
            {
                alphabetwholeerror.push(true)
            }
    }
    for (var a = 1; a < weight_partial_len; a++) {
        const classTarget = document.getElementsByClassName("weight_vetting_partial")[a - 1];
        if (classTarget.value == 0 && classTarget.value !== '') {
            
            zeropartialerror.push(true)
       }
        else if (classTarget.value <= 0 && classTarget.value !== '') {
            
             negativepartialerror.push(true)
        }
        else if (classTarget.value > 100 && classTarget.value != '')            
        {
            greaterpartialerror.push(true)
        }
        else if (!classTarget.value.match(reg) && classTarget.value != '')           
            {
                alphabetpartialerror.push(true)
            }         
    }
    if(negativewholeerror.length>0 || greaterwholeerror.length>0 ||alphabetwholeerror.length>0 ||zerowholeerror.length>0
    ||negativepartialerror.length>0 || greaterpartialerror.length>0 ||alphabetpartialerror.length>0 || zeropartialerror.length>0)
    {
        
        isFormValid = false;
        e.preventDefault()
           switch (true) {
        case ((negativewholeerror.length>0 || negativepartialerror.length>0) &&(greaterwholeerror.length>0 || greaterpartialerror.length>0) && (alphabetwholeerror.length>0 || alphabetpartialerror.length>0)):

            e.preventDefault();
            $('#service_capability_error_summary').removeClass('hide-block');
            $('.govuk-error-summary__title').text('There is a problem');
            $("#summary_list").html('<li><a href="#">The input field must be a number less than or equal to 100 </a></li><br><li><a href="#">The input field must be greater than 0</a></li><br><li><a href="#">The input field must be a number</a></li>');
            $('html, body').animate({ scrollTop: 0 }, 'fast');
            break;
        case ((negativewholeerror.length>0 || negativepartialerror.length>0) && (greaterwholeerror.length>0 || greaterpartialerror.length>0)):
            
            e.preventDefault();
            $('#service_capability_error_summary').removeClass('hide-block');
            $('.govuk-error-summary__title').text('There is a problem');
            $("#summary_list").html('<li><a href="#">The input field must be a number less than 100</a></li><br><li><a href="#">The input field  must be  greater than 0</a></li>');
            $('html, body').animate({ scrollTop: 0 }, 'fast');
            break;
        case ((negativewholeerror.length>0 || negativepartialerror.length>0) && (alphabetwholeerror.length>0 || alphabetpartialerror.length>0)):
            
            e.preventDefault();
            $('#service_capability_error_summary').removeClass('hide-block');
            $('.govuk-error-summary__title').text('There is a problem');
            $("#summary_list").html('<li><a href="#">The input field must be must be  greater than 0</a></li><br><li><a href="#">The input field must be a number</a></li>');
            $('html, body').animate({ scrollTop: 0 }, 'fast');
            break;
        case ((greaterwholeerror.length>0 || greaterpartialerror.length>0) && (alphabetwholeerror.length>0 || alphabetpartialerror.length>0)):
            
            e.preventDefault();
            $('#service_capability_error_summary').removeClass('hide-block');
            $('.govuk-error-summary__title').text('There is a problem');
            $("#summary_list").html('<li><a href="#">The input field should  must be a number less than 100</a></li><br><li><a href="#">The input field must be a number</a></li>');
            $('html, body').animate({ scrollTop: 0 }, 'fast');
            break;
        case ((zerowholeerror.length>0 || zeropartialerror.length>0)):
        
            e.preventDefault();
            $('#service_capability_error_summary').removeClass('hide-block');
            $('.govuk-error-summary__title').text('There is a problem');
            $("#summary_list").html('<li><a href="#">The input field must be greater than 0</a></li>');
            $('html, body').animate({ scrollTop: 0 }, 'fast');
            break;
        case ((negativewholeerror.length>0 || negativepartialerror.length>0)):
            
            e.preventDefault();
            $('#service_capability_error_summary').removeClass('hide-block');
            $('.govuk-error-summary__title').text('There is a problem');
            $("#summary_list").html('<li><a href="#">The weighting value(s) for the service capabilities must be a positive integer</a></li>');
            $('html, body').animate({ scrollTop: 0 }, 'fast');
            break;
        case ((alphabetwholeerror.length>0 || alphabetpartialerror.length>0)):
            
            e.preventDefault();
            $('#service_capability_error_summary').removeClass('hide-block');
            $('.govuk-error-summary__title').text('There is a problem');
            $("#summary_list").html('<li><a href="#">The input field must be a number</a></li>');
            $('html, body').animate({ scrollTop: 0 }, 'fast');
            break;
        case ((greaterwholeerror.length>0 || greaterpartialerror.length>0)):
            
            e.preventDefault();
            $('#service_capability_error_summary').removeClass('hide-block');
            $('.govuk-error-summary__title').text('There is a problem');
            $("#summary_list").html('<li><a href="#">The weighting value(s) for the service capabilities must = 100%</a></li>');
            $('html, body').animate({ scrollTop: 0 }, 'fast');
            break;
        default:
            console.log("If all else fails");
            break;
    }
    
    }
    else  if (checkforEmptyBoxes.length == TotalWeightageBox.length) {
        isFormValid = false;
        e.preventDefault();
       $('#service_capability_error_summary').removeClass('hide-block');
        $('.govuk-error-summary__title').text('There is a problem');

        $("#summary_list").html('<li><a href="#">Atleast one of the service capability must be selected</a></li> ');
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#summary_list").offset().top
        }, 1000);

    
    }
   else  if (intWeightingPercentage != 100) {
        isFormValid = false;
        e.preventDefault();
        $('#service_capability_error_summary').removeClass('hide-block');
        $('.govuk-error-summary__title').text('There is a problem');

        $("#summary_list").html('<li><a href="#">The weighting value(s) for the service capabilities must be equal to 100%</a></li> ');
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#summary_list").offset().top
        }, 1000);
    }
  

    else if(isFormValid)
        $('#ccs_ca_menu_tabs_form').submit();

}
   
  