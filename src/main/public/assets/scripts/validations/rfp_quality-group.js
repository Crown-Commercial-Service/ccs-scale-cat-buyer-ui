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

    if(ErrorStore.length > 0){
        e.preventDefault();
    }

    if(total > 100){
        e.preventDefault();
    }
    else{


    }

    e.preventDefault();
    console.log({total})

   
})