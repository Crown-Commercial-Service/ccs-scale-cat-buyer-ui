const Selector = $('.quality_group');
const SelectorLen = Selector.length;


$('#quality_group_form').on('submit', (e)=> {
  
    const ErrorStore = [];

    var total = 0;

    for(var a =0; a <3; a++){

        const val = document.getElementsByClassName('quality_group')[a].value;
        
        if(val != '' && !isNaN(val)){
            total = total + Number(val);
        }
        else{
            document.getElementsByClassName('quality_group')[a].classList.add('govuk-input--error')
            document.getElementsByClassName('quality_group_t')[a].innerHTML = 'The format of the following input is invalid'
            ErrorStore.push(true);
        }
    }
    //main-content

    if(ErrorStore.length > 0){
        e.preventDefault();
       
    }

    if(total > 100){
        e.preventDefault();
        $('.govuk-error-summary__title').text('There is a problem');

        $("#summary_list").html('<li><a href="#">The total weighting is greater than 100%</a></li> ');
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#summary_list").offset().top
        }, 1000);     
    
        $('#service_capability_error_summary').removeClass('hide-block');

        for(var a =0; a < SelectorLen; a++){
            const val = document.getElementsByClassName('quality_group')[a].value;
        
        if(val != '' && !isNaN(val)){
            document.getElementsByClassName('quality_group')[a].classList.add('govuk-input--error')
            document.getElementsByClassName('quality_group_t')[a].innerHTML = 'The total weighting is greater than 100%'
        }
        else{
            document.getElementsByClassName('quality_group')[a].classList.add('govuk-input--error')
            document.getElementsByClassName('quality_group_t')[a].innerHTML = 'The format of the following input is invalid'
        }
            
        }

        e.preventDefault();

    }
    else{

        $('#quality_group_form').submit();

    }

  

   
})