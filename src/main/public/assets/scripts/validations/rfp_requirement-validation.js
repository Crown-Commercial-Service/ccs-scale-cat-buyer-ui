document.addEventListener('DOMContentLoaded', () => {

    const totalInputFields = $('.rfp_weight_vetting_class');
    sessionStorage.setItem("rfpSelectedSection", 0);

    let total=0;sectionTotal=0;
    let liItems=document.getElementsByClassName("ons-list__item");//sections
    for(let j=0;j<liItems.length;j++){
        let inputs=document.getElementsByTagName("article")[j].querySelectorAll('[id^="rfp_textbox_weight_vetting_"]');
        sectionTotal=0;
        inputs.forEach(input=>{
            if(input.value!='')
            {
                sectionTotal=sectionTotal+parseInt(input.value);
            }
        });
        liItems[j].getElementsByClassName("table-item-subtext")[0].innerHTML=sectionTotal+" resources added";
        total=total+sectionTotal;
    }
    document.getElementsByClassName("govuk-!-display-inline")[0].textContent=total;
    document.getElementsByClassName("govuk-!-display-inline")[1].textContent=total;


    //add event listener to textboxes
    const boxes = Array.from(document.getElementsByClassName('rfp_weight_vetting_class'));

    boxes.forEach(box => {
      box.addEventListener('focusout', function handleClick(event) {
        let sectionSelected=sessionStorage.getItem("rfpSelectedSection");
        let inputs=document.getElementsByTagName("article")[sectionSelected].querySelectorAll('[id^="rfp_textbox_weight_vetting_"]')
        let total=0;
        inputs.forEach(input=>{
            if(input.value!='')
            {
                total=total+parseInt(input.value);
            }
        });
        document.getElementsByClassName("ons-list__item")[sectionSelected].getElementsByClassName("table-item-subtext")[0].innerHTML=total+" resources added";
        total=0;
        let liItems=document.getElementsByClassName("ons-list__item");
        for(let j=0;j<liItems.length;j++){
            let liText=liItems[j].getElementsByClassName("table-item-subtext")[0].innerHTML;
            let number=liText.split(" resources added")[0];
            total=total+parseInt(number);
        }
        document.getElementsByClassName("govuk-!-display-inline")[0].textContent=total;
        document.getElementsByClassName("govuk-!-display-inline")[1].textContent=total;
        // console.log(sectionSelected, event);
      });
    });



    $('#ccs_ca_menu_tabs_form_rfp_vetting').on('submit', (e) => {


        const preventDefaultState = [];
        const inputtedtext=[];
        const decimalnumber=[];
        const nonnumerical=[];

        for (var a = 1; a < totalInputFields.length; a++) {
            const classTarget = document.getElementsByClassName("rfp_weight_vetting_class")[a - 1];
           if(classTarget.value!='')
           {
            inputtedtext.push(true)
           }
           if(classTarget.value.includes('.'))
           {
            document.getElementsByClassName("weight_vetting_class")[a - 1].classList.add('govuk-input--error')
            document.getElementsByClassName("weight_vetting_class_error")[a - 1].innerHTML = 'Decimal value is entered. Please enter number <100 and >0 ';
           
            decimalnumber.push(true)
           }
           else if (isNaN(classTarget.value) && classTarget.value !== '') {
            document.getElementsByClassName("weight_vetting_class")[a - 1].classList.add('govuk-input--error')
            document.getElementsByClassName("weight_vetting_class_error")[a - 1].innerHTML = 'Alphabetical value is entered. Please enter number <100 and >0';
            nonnumerical.push(true);
        }
            else if (classTarget.value > 99 && classTarget.value != '') {
                document.getElementsByClassName("weight_vetting_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("weight_vetting_class_error")[a - 1].innerHTML = 'Please enter number <100 and >0';
                preventDefaultState.push(true);
            }
            else if (classTarget.value <= 0 && classTarget.value !== '') {
                document.getElementsByClassName("weight_vetting_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("weight_vetting_class_error")[a - 1].innerHTML = 'Please enter number <100 and >0';
                preventDefaultState.push(true);
            }          
            else {
                document.getElementsByClassName("weight_vetting_class")[a - 1].classList.remove('govuk-input--error')
                document.getElementsByClassName("weight_vetting_class_error")[a - 1].innerHTML = '';
                // $(`#rfp_weight_vetting_${a}`).removeClass('govuk-input--error');
            }
        }
        /**
         *  
         */

         switch (true) {
            case (preventDefaultState.length > 0 && decimalnumber.length>0 && nonnumerical.length>0):
                
            e.preventDefault();
            $('#rfp_vetting_error_summary').removeClass('hide-block');
            $('.govuk-error-summary__title').text('There is a problem');
            $("#summary_list").html('<li><a href="#">The input field must be a number less than 100 and greater than 0</a></li><br><li><a href="#">The input field should not contain decimal values</a></li><br><li><a href="#">The input field must be a number</a></li>');
            $('html, body').animate({ scrollTop: 0 }, 'fast');
                break;
                case (preventDefaultState.length > 0 && decimalnumber.length>0):
                
                    e.preventDefault();
                    $('#rfp_vetting_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#summary_list").html('<li><a href="#">The input field must be a number less than 100 and greater than 0</a></li><br><li><a href="#">The input field should not contain decimal values</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
                        break;
                        case (preventDefaultState.length > 0 && nonnumerical.length>0):
                
                            e.preventDefault();
                            $('#rfp_vetting_error_summary').removeClass('hide-block');
                            $('.govuk-error-summary__title').text('There is a problem');
                            $("#summary_list").html('<li><a href="#">The input field must be a number less than 100 and greater than 0</a></li><br><li><a href="#">The input field must be a number</a></li>');
                            $('html, body').animate({ scrollTop: 0 }, 'fast');
                                break;
                                case (decimalnumber.length > 0 && nonnumerical.length>0):
                
                                    e.preventDefault();
                                    $('#rfp_vetting_error_summary').removeClass('hide-block');
                                    $('.govuk-error-summary__title').text('There is a problem');
                                    $("#summary_list").html('<li><a href="#">The input field should not contain decimal values</a></li><br><li><a href="#">The input field must be a number</a></li>');
                                    $('html, body').animate({ scrollTop: 0 }, 'fast');
                                        break;
            case (preventDefaultState.length > 0):
                
                e.preventDefault();
                $('#rfp_vetting_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#summary_list").html('<li><a href="#">The input field must be a number less than 100 and greater than 0</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
                break;
            case (nonnumerical.length > 0):
                
                e.preventDefault();
                $('#rfp_vetting_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#summary_list").html('<li><a href="#">The input field must be a number</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
                break;
                case (decimalnumber.length>0):
                    
                    e.preventDefault();
                    $('#rfp_vetting_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#summary_list").html('<li><a href="#">The input field should not contain decimal values</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
                    break;
            default:
                console.log("If all else fails");
                break;
        }
       
        if(!inputtedtext.length>0)
{
   
    e.preventDefault();
    $('#rfp_vetting_error_summary').removeClass('hide-block');
    $('.govuk-error-summary__title').text('There is a problem');
    $("#summary_list").html('You must enter atleast on value');
    $('html, body').animate({ scrollTop: 0 }, 'fast');
}

    });

});
